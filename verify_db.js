require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');

async function verify() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        console.error("DATABASE_URL not found in .env.local");
        return;
    }

    const sql = neon(databaseUrl);

    // List all bookings until end of April 2026
    const allBookings = await sql`SELECT guest_name, booking_date, slot, status FROM bookings WHERE booking_date >= '2026-02-01' AND booking_date <= '2026-04-30' AND deleted_at IS NULL ORDER BY booking_date ASC, slot ASC`;

    console.log('\n--- ALL DB BOOKINGS (FEB-APR 2026) ---');
    allBookings.forEach(b => {
        const d = new Date(b.booking_date).toLocaleDateString('es-PY');
        console.log(`${d} (${b.slot}) | ${b.guest_name} | ${b.status}`);
    });
}

verify().catch(console.error);
