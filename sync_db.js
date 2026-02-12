require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');
const fs = require('fs');

async function sync() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        console.error("DATABASE_URL not found");
        return;
    }

    const sql = neon(databaseUrl);

    // Read the CSV file
    const csvContent = fs.readFileSync('corregido.csv', 'latin1');
    const lines = csvContent.split(/\r?\n/).filter(l => l.trim().length > 0);
    const headers = lines[0].split(';');

    const csvRecords = lines.slice(1).map(line => {
        const parts = line.split(';');
        const record = {};
        headers.forEach((h, i) => record[h] = parts[i]);
        return record;
    }).filter(r => r.Nombre && !r.Nombre.includes('RESERVADO POR EL ADMIN') && !r.Nombre.includes('OCUPADO POR EL SISTEMA'));

    console.log(`Syncing ${csvRecords.length} named records...`);

    // 1. Move EVERYONE in the CSV to a "shadow" date to vacate their current slots
    console.log("--- Phase 1: Vacating current slots (Shadow Move) ---");
    const dbBookingsInitial = await sql`SELECT id, guest_name FROM bookings WHERE deleted_at IS NULL`;

    for (const record of csvRecords) {
        const dbMatch = dbBookingsInitial.find(b => {
            const cleanDbName = (b.guest_name || '').trim().toLowerCase();
            const cleanCsvName = (record.Nombre || '').trim().toLowerCase();
            return cleanDbName.includes(cleanCsvName) || cleanCsvName.includes(cleanDbName);
        });

        if (dbMatch) {
            const shadowDate = `2999-01-01`;
            await sql`UPDATE bookings SET booking_date = ${shadowDate}, slot = 'DAY', guest_name = ${dbMatch.guest_name + ' (TEMP)'} WHERE id = ${dbMatch.id}`;
        }
    }

    // 2. Move everyone to their FINAL positions from the CSV
    console.log("--- Phase 2: Positioning to final dates ---");
    for (const record of csvRecords) {
        const [day, month, year] = record.Fecha.split('/');
        // Internal fix: use 12:00:00 to ensure Asunción (-3h/-4h) always sees the correct day
        const targetDateStr = `${year}-${month}-${day}T12:00:00`;
        // Map 0 -> DAY, 1 -> NIGHT
        const targetSlot = record.Slot === '1' ? 'NIGHT' : 'DAY';


        const tempMatch = await sql`SELECT id FROM bookings WHERE guest_name LIKE ${'%' + record.Nombre.trim() + '% (TEMP)'} AND deleted_at IS NULL`;

        if (tempMatch.length > 0) {
            const bookingId = tempMatch[0].id;
            console.log(`[OK] ${record.Nombre} -> ${targetDateStr} (${targetSlot})`);
            await sql`UPDATE bookings SET booking_date = ${targetDateStr}, slot = ${targetSlot}, guest_name = ${record.Nombre.trim()} WHERE id = ${bookingId}`;
        } else {
            console.log(`[NOT FOUND] ${record.Nombre} was not in shadow storage.`);
        }
    }
}

sync().catch(console.error);
