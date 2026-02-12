require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');

const data = {
    modified: [
        { name: 'ALESSANDRA THAIS DUARTE ARROYO', phone: '0982 961 314', date: '2026-02-13', slot: 'DAY' },
        { name: 'MARCELO GONZALEZ', phone: '0972 483 853', date: '2026-02-13', slot: 'NIGHT' },
        { name: 'BELÉN BOGADO', phone: '0983 911 059', date: '2026-02-14', slot: 'DAY' },
        { name: 'JOSE DANIEL VILLAMIL OSORIO', phone: '0982 804 066', date: '2026-02-16', slot: 'NIGHT' },
        { name: 'MARCELINO MARTINEZ', phone: '0991 853 752', date: '2026-02-19', slot: 'NIGHT' },
        { name: 'CLARA YAMILI TINDEL', phone: '0992 187 378', date: '2026-02-20', slot: 'NIGHT', note: '20:00 - 09:00' },
        { name: 'EDGAR INSFRAN', phone: '0982 324 862', date: '2026-02-21', slot: 'DAY' },
        { name: 'SERGIO ISAAC GONZALEZ ROLON', phone: '0971 741 292', date: '2026-02-21', slot: 'NIGHT' },
        { name: 'MARÍA ELIZABETH VILLALBA', phone: '0984 640 471', date: '2026-02-22', slot: 'DAY' },
        { name: 'JOHANA PERALTA', phone: '0992 375 144', date: '2026-02-27', slot: 'DAY' },
        { name: 'AZUCENA PEREZ', phone: '0986 631 232', date: '2026-02-27', slot: 'NIGHT', note: '20:00 - 09:00' }
    ],
    confirmed: [
        { name: 'YENIFER PEREZ TORRES', phone: '0972 375 564', date: '2026-02-16', slot: 'NIGHT' },
        { name: 'Lili', phone: '0982 336 705', date: '2026-04-24', slot: 'DAY' },
        { name: 'Lili', phone: '0982 336 705', date: '2026-04-24', slot: 'NIGHT' },
        { name: 'SERGIO DANIEL CABALLERO', phone: '0984 590 405', date: '2026-02-27', slot: 'DAY' },
        { name: 'MAURICIO NICOLAS RODRIGUEZ', phone: '0971 697 004', date: '2026-02-27', slot: 'NIGHT' }
    ],
    cancelled: [
        { name: 'ALAN A. FRANCO TRINIDAD', phone: '0983 622 543', date: '2026-02-24', slot: 'DAY' }
    ]
};

async function sync() {
    const sql = neon(process.env.DATABASE_URL);
    const all = [...data.modified, ...data.confirmed];
    const conflicts = [];

    console.log('--- Analyzing Conflicts ---');
    const occupancy = new Map();
    for (const rec of all) {
        const key = `${rec.date}-${rec.slot}`;
        if (occupancy.has(key)) {
            conflicts.push({
                date: rec.date,
                slot: rec.slot,
                p1: occupancy.get(key).name,
                p2: rec.name
            });
        } else {
            occupancy.set(key, rec);
        }
    }

    if (conflicts.length > 0) {
        console.log('INTERNAL CONFLICTS FOUND:');
        conflicts.forEach(c => console.log(`  - ${c.date} (${c.slot}): ${c.p1} vs ${c.p2}`));
    } else {
        console.log('No internal conflicts in the provided list.');
    }

    // Now, let's update DB
    // 1. Mark cancelled as deleted
    for (const rec of data.cancelled) {
        await sql`UPDATE bookings SET deleted_at = NOW() WHERE guest_name ILIKE ${'%' + rec.name.replace(/[^a-zA-Z\s]/g, '%') + '%'} AND deleted_at IS NULL`;
    }

    // 2. Process all others
    for (const rec of all) {
        // Find existing (even deleted)
        const existing = await sql`
            SELECT id FROM bookings 
            WHERE (guest_name ILIKE ${'%' + rec.name.replace(/[^a-zA-Z\s]/g, '%') + '%'} OR guest_whatsapp ILIKE ${'%' + rec.phone.replace(/\D/g, '') + '%'})
            LIMIT 1
        `;

        const targetDate = `${rec.date}T12:00:00`;

        if (existing.length > 0) {
            console.log(`Updating ${rec.name} to ${rec.date} (${rec.slot})...`);
            await sql`
                UPDATE bookings 
                SET booking_date = ${targetDate}, 
                    slot = ${rec.slot}, 
                    deleted_at = NULL,
                    admin_notes = ${rec.note || ''},
                    status = 'RESERVED'
                WHERE id = ${existing[0].id}
            `;
        } else {
            console.log(`Record for ${rec.name} not found, would need insertion but skipping for now to be safe.`);
        }
    }
}

sync().catch(console.error);
