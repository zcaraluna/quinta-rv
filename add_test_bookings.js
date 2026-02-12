require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

async function addTestBookings() {
    console.log("Añadiendo reservaciones de prueba...");

    // Una fecha futura para probar (ej: 20 de Marzo 2026)
    const testDate = "2026-03-20T12:00:00Z";

    const testBookings = [
        {
            guest_name: "TEST - Juan Perez (CON CONFLICTO)",
            guest_email: "juan@test.com",
            guest_whatsapp: "123456789",
            booking_date: testDate,
            slot: "DAY",
            status: "RESERVED",
            total_price: 500000
        },
        {
            guest_name: "TEST - Maria Garcia (CON CONFLICTO)",
            guest_email: "maria@test.com",
            guest_whatsapp: "987654321",
            booking_date: testDate,
            slot: "DAY",
            status: "PENDING_PAYMENT",
            total_price: 500000,
            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h desde ahora
        },
        {
            guest_name: "TEST - Carlos Rodriguez (SOLO)",
            guest_email: "carlos@test.com",
            guest_whatsapp: "555123456",
            booking_date: testDate,
            slot: "NIGHT",
            status: "CONFIRMED",
            total_price: 600000
        }
    ];

    for (const b of testBookings) {
        try {
            await sql`
                INSERT INTO bookings (
                    guest_name, guest_email, guest_whatsapp, booking_date, slot, status, total_price, expires_at, created_at, updated_at
                ) VALUES (
                    ${b.guest_name}, ${b.guest_email}, ${b.guest_whatsapp}, ${b.booking_date}, ${b.slot}, ${b.status}, ${b.total_price}, ${b.expires_at || null}, NOW(), NOW()
                )
            `;
            console.log(`+ Insertada: ${b.guest_name}`);
        } catch (e) {
            console.error(`- Error insertando ${b.guest_name}:`, e.message);
        }
    }

    console.log("\nPrueba lista. Busca las reservas 'TEST' en el panel de administración (puedes filtrar por 'Todas' y buscar Marzo 20).");
    console.log("Deberías ver un CONFLICTO entre Juan Perez y Maria Garcia.");
}

addTestBookings().catch(console.error);
