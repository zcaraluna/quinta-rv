require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

async function check(name) {
    const results = await sql`SELECT id, guest_name, booking_date, slot FROM bookings WHERE guest_name ILIKE ${'%' + name + '%'} AND deleted_at IS NULL`;
    console.log('--- DATABASE STATUS ---');
    if (results.length === 0) {
        console.log('No results found for:', name);
    } else {
        results.forEach(r => {
            console.log(`Nombre: ${r.guest_name}`);
            console.log(`Fecha actual (ISO): ${r.booking_date.toISOString()}`);
            console.log(`Fecha local: ${r.booking_date.toLocaleDateString()}`);
            console.log(`Turno: ${r.slot}`);
            console.log('-------------------------');
        });
    }
}


const nameToCheck = process.argv[2] || 'ALESSANDRA THAIS DUARTE ARROYO';
check(nameToCheck).catch(console.error);
