'use server';

import { db } from './db';
import { bookings } from './schema';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { addHours } from 'date-fns';
import { and, gte, lte, or, eq, sql } from 'drizzle-orm';

const bookingSchema = z.object({
    guestName: z.string().min(3, "El nombre es obligatorio"),
    guestEmail: z.string().email("Email inválido"),
    guestWhatsapp: z.string().min(8, "WhatsApp inválido"),
    dateRange: z.object({
        from: z.date(),
        to: z.date(),
    }),
});

export async function createBooking(prevState: any, formData: FormData) {
    const rawData = {
        guestName: formData.get('guestName'),
        guestEmail: formData.get('guestEmail'),
        guestWhatsapp: formData.get('guestWhatsapp'),
        dateRange: {
            from: new Date(formData.get('from') as string),
            to: new Date(formData.get('to') as string),
        }
    };

    // 1. Validation
    const result = bookingSchema.safeParse(rawData);

    if (!result.success) {
        return { error: "Datos inválidos. Verifica los campos." };
    }

    const { guestName, guestEmail, guestWhatsapp, dateRange } = result.data;
    const { from: startDate, to: endDate } = dateRange;

    // 2. Check Availability (Overlap + Status Logic)
    // Blocked if: Status is CONFIRMED/MAINTENANCE 
    // OR Status is PENDING_PAYMENT AND now() < expires_at

    const overlap = await db.select().from(bookings).where(
        and(
            // Date Overlap Logic: (StartA <= EndB) and (EndA >= StartB)
            lte(bookings.startDate, endDate),
            gte(bookings.endDate, startDate),
            or(
                // Confirmed or Maintenance
                or(eq(bookings.status, 'CONFIRMED'), eq(bookings.status, 'MAINTENANCE')),
                // Pending Payment within 4 hour window
                and(
                    eq(bookings.status, 'PENDING_PAYMENT'),
                    gte(bookings.expiresAt, new Date())
                )
            )
        )
    );

    if (overlap.length > 0) {
        return { error: "Fechas no disponibles. Alguien más acaba de reservar." };
    }

    // 3. Create Booking
    // Calculate expiry
    const expiresAt = addHours(new Date(), 4);

    // TODO: Fetch price from settings. For now, hardcode or calculate.
    // Assuming a fixed price or passing it ? Security risk if passed from client.
    // We should fetch price settings here. 
    // Placeholder: $50.000 per night.
    const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const pricePerNight = 50000; // Placeholder
    const totalPrice = (nights * pricePerNight).toString();

    const [newBooking] = await db.insert(bookings).values({
        guestName,
        guestEmail,
        guestWhatsapp,
        startDate,
        endDate,
        totalPrice,
        status: 'PENDING_PAYMENT',
        expiresAt,
    }).returning({ id: bookings.id });

    // 4. Redirect
    redirect(`/status/${newBooking.id}`);
}

export async function checkAvailability(from: Date, to: Date) {
    // Helper for client side check if needed
}

export async function getUnavailableDates() {
    const activeBookings = await db.select({
        start: bookings.startDate,
        end: bookings.endDate
    })
        .from(bookings)
        .where(
            or(
                eq(bookings.status, 'CONFIRMED'),
                eq(bookings.status, 'MAINTENANCE'),
                and(
                    eq(bookings.status, 'PENDING_PAYMENT'),
                    gte(bookings.expiresAt, new Date())
                )
            )
        );

    return activeBookings;
}
