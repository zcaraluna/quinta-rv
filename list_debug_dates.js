require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');

async function listDates() {
    const sql = neon(process.env.DATABASE_URL);
    const dates = ['2026-02-14', '2026-02-22'];

    console.log('Checking active bookings for Feb 14 and Feb 22...');

    for (const date of dates) {
        // Querying with range to avoid ::date issues and timezone shifts
        const results = await sql`
            SELECT id, guest_name, booking_date, slot 
            FROM bookings 
            WHERE booking_date >= ${date + 'T00:00:00Z'} 
            AND booking_date <= ${date + 'T23:59:59Z'}
            AND deleted_at IS NULL
        `;

        console.log(`\nDate: ${date}`);
        if (results.length === 0) {
            console.log('  No active bookings found.');
        } else {
            results.forEach(r => {
                console.log(`  - ID: ${r.id} | Name: ${r.guest_name} | Date: ${r.booking_date.toISOString()} | Slot: ${r.slot}`);
            });
        }
    }
}

listDates().catch(console.error);
