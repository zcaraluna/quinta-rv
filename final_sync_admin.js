require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');

const data = {
    modified: [
        { name: 'ALESSANDRA THAIS DUARTE ARROYO', phone: '0982 961 314', email: 'cliente@web.com', date: '2026-02-13', slot: 'DAY' },
        { name: 'MARCELO GONZALEZ', phone: '0972 483 853', email: 'cliente@web.com', date: '2026-02-13', slot: 'NIGHT' },
        { name: 'BELÉN BOGADO', phone: '0983 911 059', email: 'cliente@web.com', date: '2026-02-14', slot: 'DAY' },
        { name: 'JOSE DANIEL VILLAMIL OSORIO', phone: '0982 804 066', email: 'cliente@web.com', date: '2026-02-16', slot: 'NIGHT' },
        { name: 'MARCELINO MARTINEZ', phone: '0991 853 752', email: 'cliente@web.com', date: '2026-02-19', slot: 'NIGHT' },
        { name: 'CLARA YAMILI TINDEL', phone: '0992 187 378', email: 'cliente@web.com', date: '2026-02-20', slot: 'NIGHT', note: '20:00 - 09:00' },
        { name: 'EDGAR INSFRAN', phone: '0982 324 862', email: 'cliente@web.com', date: '2026-02-21', slot: 'DAY' },
        { name: 'SERGIO ISAAC GONZALEZ ROLON', phone: '0971 741 292', email: 'cliente@web.com', date: '2026-02-21', slot: 'NIGHT' },
        { name: 'MARÍA ELIZABETH VILLALBA', phone: '0984 640 471', email: 'cliente@web.com', date: '2026-02-22', slot: 'DAY' },
        { name: 'JOHANA PERALTA', phone: '0992 375 144', email: 'cliente@web.com', date: '2026-02-27', slot: 'DAY' },
        { name: 'AZUCENA PEREZ', phone: '0986 631 232', email: 'cliente@web.com', date: '2026-02-27', slot: 'NIGHT', note: '20:00 - 09:00' }
    ],
    confirmed: [
        { name: 'YENIFER PEREZ TORRES', phone: '0972 375 564', email: 'cliente@web.com', date: '2026-02-16', slot: 'NIGHT' },
        { name: 'Lili', phone: '0982 336 705', email: 'cliente@web.com', date: '2026-04-24', slot: 'DAY' },
        { name: 'Lili', phone: '0982 336 705', email: 'cliente@web.com', date: '2026-04-24', slot: 'NIGHT' },
        { name: 'SERGIO DANIEL CABALLERO', phone: '0984 590 405', email: 'cliente@web.com', date: '2026-02-27', slot: 'DAY' },
        { name: 'MAURICIO NICOLAS RODRIGUEZ', phone: '0971 697 004', email: 'cliente@web.com', date: '2026-02-27', slot: 'NIGHT' }
    ],
    admin: [
        { name: 'RESERVADO POR EL ADMIN', phone: '00000000', email: 'admin@casaquinta.com', date: '2026-02-13', slot: 'NIGHT' },
        { name: 'RESERVADO POR EL ADMIN', phone: '00000000', email: 'admin@casaquinta.com', date: '2026-02-14', slot: 'DAY' },
        { name: 'RESERVADO POR EL ADMIN', phone: '00000000', email: 'admin@casaquinta.com', date: '2026-02-14', slot: 'NIGHT' }
    ]
};

async function sync() {
    const sql = neon(process.env.DATABASE_URL);
    const all = [...data.modified, ...data.confirmed, ...data.admin];

    console.log('--- Syncing to DB ---');
    for (const rec of all) {
        const targetDate = `${rec.date}T12:00:00`;

        let existing;
        if (rec.name === 'RESERVADO POR EL ADMIN') {
            existing = await sql`SELECT id FROM bookings WHERE guest_name = ${rec.name} AND booking_date::date = ${rec.date} AND slot = ${rec.slot} LIMIT 1`;
        } else {
            // For fuzzy match, prioritize exact or ILIKE
            existing = await sql`SELECT id FROM bookings WHERE guest_name ILIKE ${'%' + rec.name.replace(/[^a-zA-Z\s]/g, '%') + '%'} LIMIT 1`;
        }

        if (existing && existing.length > 0) {
            console.log(`Updating ${rec.name} (${rec.date} ${rec.slot})...`);
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
            console.log(`Inserting new record for ${rec.name} (${rec.date} ${rec.slot})...`);
            await sql`
                INSERT INTO bookings (guest_name, guest_email, guest_whatsapp, booking_date, slot, status, total_price, admin_notes)
                VALUES (${rec.name}, ${rec.email}, ${rec.phone}, ${targetDate}, ${rec.slot}, 'RESERVED', 0, ${rec.note || ''})
            `;
        }
    }
    console.log('Sync finished.');
}

sync().catch(console.error);
