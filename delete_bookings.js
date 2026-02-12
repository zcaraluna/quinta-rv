require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');

const listToDelete = `
ALESSANDRA THAIS DUARTE ARROYO;0982 961 314;13/02/2026;0;RESERVED;13/02 - da
MARCELO GONZALEZ;0972 483 853;13/02/2026;1;RESERVED;13/02 - noche
BELN BOGADO;0983 911 059;14/02/2026;0;RESERVED;14/02 - da
OCUPADO POR EL SISTEMA;;13/02/2026;1;RESERVED;CONSULTAR TITULAR
RESERVADO POR EL ADMIN;;14/02/2026;0;RESERVED;CONSULTAR TITULAR
RESERVADO POR EL ADMIN;;14/02/2026;1;RESERVED;CONSULTAR TITULAR
JOSE DANIEL VILLAMIL OSORIO;0982 804 066;16/02/2026;1;RESERVED;16/02 - noche
YENIFER PEREZ TORRES;0972 375 564;16/02/2026;1;RESERVED;confirmado
MARCELINO MARTINEZ;0991 853 752;19/02/2026;1;RESERVED;
CLARA YAMILI TINDEL;0992 187 378;20/02/2026;1;RESERVED;20/02 - noche
EDGAR INSFRAN;0982 324 862;21/02/2026;0;RESERVED;21/02 - da
SERGIO ISAAC GONZALEZ ROLON;0971 741 292;21/02/2026;1;RESERVED;21/02 - noche
MARA ELIZABETH VILLALBA;0984 640 471;22/02/2026;0;RESERVED;22/02 - da (consult sobre el pago de la segunda mitad de su reserva)
ALAN A. FRANCO TRINIDAD;0983 622 543;24/02/2026;0;RESERVED;solicit cancelar
Lili;0982 336 705;24/04/2026;0;RESERVED;confirmado
Lili;0982 336 705;24/04/2026;1;RESERVED;confirmado
JOHANA PERALTA;0992 375 144;27/02/2026;0;RESERVED;27/02 - da
AZUCENA PEREZ;0986 631 232;27/02/2026;1;RESERVED;27/02 - noche
SERGIO DANIEL CABALLERO;0984 590 405;27/02/2026;0;RESERVED;confirmado
MAURICIO NICOLAS RODRIGUEZ;0971 697 004;27/02/2026;1;RESERVED;confirmado? Preguntar al dueo
MAURICIO RDRIGUEZ;0981 623 777;28/02/2026;0;RESERVED;preguntar al dueo
`;

async function deleteBookings() {
    const sql = neon(process.env.DATABASE_URL);
    const lines = listToDelete.trim().split('\n');

    console.log(`Starting deletion of ${lines.length} records...`);

    for (const line of lines) {
        const parts = line.split(';');
        const nombre = (parts[0] || '').trim();
        const fecha = parts[2] || '';
        const slotCode = parts[3] || '0';

        if (!nombre || !fecha) continue;

        const [day, month, year] = fecha.split('/');
        const dateStr = `${year}-${month}-${day}`;
        const slot = slotCode === '1' ? 'NIGHT' : 'DAY';

        console.log(`Processing: ${nombre} (${dateStr} - ${slot})`);

        // Fuzzy match for name because of encoding issues
        let matchName = nombre;
        if (nombre.includes('BELN')) matchName = 'BEL%N BOGADO';
        if (nombre.includes('MARA')) matchName = 'MAR%A ELIZABETH VILLALBA';
        if (nombre.includes('dueo')) matchName = '%'; // Not used for guest name but as part of notes

        const found = await sql`
            SELECT id, guest_name FROM bookings 
            WHERE (guest_name ILIKE ${'%' + nombre.replace(/[^a-zA-Z\s]/g, '%') + '%'})
            AND (booking_date::date = ${dateStr})
            AND (slot = ${slot})
            AND deleted_at IS NULL
        `;

        if (found.length > 0) {
            for (const b of found) {
                console.log(`  Deleting ID: ${b.id} (${b.guest_name})`);
                await sql`UPDATE bookings SET deleted_at = NOW() WHERE id = ${b.id}`;
            }
        } else {
            // Try one more time with just date and slot if it's a known placeholder like ADMIN
            if (nombre.includes('ADMIN') || nombre.includes('SISTEMA')) {
                const placeholders = await sql`
                    SELECT id, guest_name FROM bookings 
                    WHERE (booking_date::date = ${dateStr})
                    AND (slot = ${slot})
                    AND (guest_name ILIKE '%ADMIN%' OR guest_name ILIKE '%SISTEMA%')
                    AND deleted_at IS NULL
                `;
                for (const b of placeholders) {
                    console.log(`  Deleting Placeholder ID: ${b.id} (${b.guest_name})`);
                    await sql`UPDATE bookings SET deleted_at = NOW() WHERE id = ${b.id}`;
                }
            } else {
                console.log(`  NOT FOUND or already deleted.`);
            }
        }
    }
    console.log("Deletion process finished.");
}

deleteBookings().catch(console.error);
