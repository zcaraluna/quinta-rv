require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');

async function cleanTemp() {
    const sql = neon(process.env.DATABASE_URL);

    console.log('Searching for records with (TEMP) in names...');
    const records = await sql`SELECT id, guest_name FROM bookings WHERE guest_name LIKE '%(TEMP)%' AND deleted_at IS NULL`;

    if (records.length === 0) {
        console.log('No records with (TEMP) found.');
        return;
    }

    for (const r of records) {
        // Remove all occurrences of (TEMP) and extra spaces
        const cleanName = r.guest_name.replace(/\(TEMP\)/g, '').trim().replace(/\s+/g, ' ');
        console.log(`Cleaning: "${r.guest_name}" -> "${cleanName}"`);
        await sql`UPDATE bookings SET guest_name = ${cleanName} WHERE id = ${r.id}`;
    }
    console.log('Cleanup finished.');
}

cleanTemp().catch(console.error);
