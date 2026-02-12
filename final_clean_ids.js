require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');

async function run() {
    const sql = neon(process.env.DATABASE_URL);
    const ids = [
        'e3f57723-0f43-490a-a714-19a6557894a5', // Belén Bogado
        'ec5bd406-0bee-4b7e-b993-dda6e5acde35'  // María Elizabeth Villalba
    ];

    console.log('Deleting records by ID:', ids);

    for (const id of ids) {
        const result = await sql`UPDATE bookings SET deleted_at = NOW() WHERE id = ${id} AND deleted_at IS NULL`;
        console.log(`  Processed ID: ${id}`);
    }

    console.log('Final verification of these specific dates...');
    const dates = ['2026-02-14', '2026-02-22'];
    for (const date of dates) {
        const remaining = await sql`
            SELECT guest_name FROM bookings 
            WHERE booking_date >= ${date + 'T00:00:00Z'} 
            AND booking_date <= ${date + 'T23:59:59Z'}
            AND deleted_at IS NULL
        `;
        if (remaining.length === 0) {
            console.log(`  Date ${date} is now CLEAR.`);
        } else {
            console.log(`  Date ${date} STILL HAS:`, remaining.map(r => r.guest_name));
        }
    }
}

run().catch(console.error);
