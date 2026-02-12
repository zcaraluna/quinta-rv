require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');

async function check13() {
    const sql = neon(process.env.DATABASE_URL);
    const date = '2026-02-13';

    const results = await sql`
        SELECT id, guest_name, booking_date, slot 
        FROM bookings 
        WHERE booking_date >= ${date + 'T00:00:00Z'} 
        AND booking_date <= ${date + 'T23:59:59Z'}
        AND deleted_at IS NULL
    `;

    console.log(`Bookings for ${date}:`);
    results.forEach(r => {
        console.log(`- ID: ${r.id} | Name: ${r.guest_name} | Slot: ${r.slot}`);
    });
}

check13().catch(console.error);
