require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

async function check() {
    const lilis = await sql`SELECT id, guest_name, booking_date, slot FROM bookings WHERE guest_name ILIKE '%Lili%' AND deleted_at IS NULL`;
    console.log('--- Lilis in DB ---');
    lilis.forEach(l => console.log(`${l.id} | ${l.guest_name} | ${l.booking_date.toLocaleDateString()} (${l.slot})`));

    const yonys = await sql`SELECT guest_name, booking_date, slot FROM bookings WHERE guest_name ILIKE '%López%' AND deleted_at IS NULL`;
    console.log('\n--- López in DB ---');
    yonys.forEach(y => console.log(`${y.guest_name} | ${y.booking_date.toLocaleDateString()} (${y.slot})`));
}


check().catch(console.error);
