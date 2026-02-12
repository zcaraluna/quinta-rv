require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');

async function deleteMarcelo() {
    const sql = neon(process.env.DATABASE_URL);
    const idToDelete = '957b3acb-2350-4a97-905b-ecb4e59cfa86';

    console.log(`Deleting duplicate record ID: ${idToDelete}...`);
    const result = await sql`UPDATE bookings SET deleted_at = NOW() WHERE id = ${idToDelete}`;
    console.log('Update complete.');
}

deleteMarcelo().catch(console.error);
