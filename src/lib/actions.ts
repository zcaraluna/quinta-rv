'use server';

import { db } from './db';
import { bookings } from './schema';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { addHours, format, getDay, startOfDay } from 'date-fns';
import { and, gte, lte, or, eq, sql } from 'drizzle-orm';

const PRICING = {
    GENERAL: {
        WEEKDAY: { DAY: 500000, NIGHT: 650000 },
        SATURDAY: { DAY: 700000, NIGHT: 800000 },
        SUNDAY: { DAY: 800000, NIGHT: 650000 },
    },
    COUPLE: {
        WEEKDAY: { DAY: 250000, NIGHT: 250000 },
        SATURDAY: { DAY: 300000, NIGHT: 400000 },
        SUNDAY: { DAY: 400000, NIGHT: 300000 },
    }
}

const bookingSchema = z.object({
    guestName: z.string().min(3),
    guestEmail: z.string().email(),
    guestWhatsapp: z.string().min(8),
    bookingDate: z.date(),
    slot: z.enum(["DAY", "NIGHT"]),
    isCouplePromo: z.boolean(),
});

export async function createBooking(prevState: any, formData: FormData) {
    const rawData = {
        guestName: formData.get('guestName'),
        guestEmail: formData.get('guestEmail'),
        guestWhatsapp: formData.get('guestWhatsapp'),
        bookingDate: new Date(formData.get('bookingDate') as string),
        slot: formData.get('slot'),
        isCouplePromo: formData.get('isCouplePromo') === "true",
    };

    const result = bookingSchema.safeParse(rawData);

    if (!result.success) {
        return { error: "Datos inválidos." };
    }

    const { guestName, guestEmail, guestWhatsapp, bookingDate, slot, isCouplePromo } = result.data;

    // 1. Check Availability for that day + slot
    const overlap = await db.select().from(bookings).where(
        and(
            eq(bookings.bookingDate, startOfDay(bookingDate)),
            eq(bookings.slot, slot),
            or(
                or(eq(bookings.status, 'CONFIRMED'), eq(bookings.status, 'MAINTENANCE')),
                and(
                    eq(bookings.status, 'PENDING_PAYMENT'),
                    gte(bookings.expiresAt, new Date())
                )
            )
        )
    );

    if (overlap.length > 0) {
        return { error: "Este horario ya ha sido reservado." };
    }

    // 2. Calculate Price (Server-side for security)
    const dayOfWeek = getDay(bookingDate); // 0=Sun, 6=Sat
    const type = isCouplePromo ? "COUPLE" : "GENERAL";
    let dayType: "WEEKDAY" | "SATURDAY" | "SUNDAY" = "WEEKDAY";
    if (dayOfWeek === 6) dayType = "SATURDAY";
    else if (dayOfWeek === 0) dayType = "SUNDAY";

    const price = PRICING[type][dayType][slot];
    const expiresAt = addHours(new Date(), 4);

    // 3. Create
    const [newBooking] = await db.insert(bookings).values({
        guestName,
        guestEmail,
        guestWhatsapp,
        bookingDate: startOfDay(bookingDate),
        slot,
        isCouplePromo: isCouplePromo.toString(),
        totalPrice: price.toString(),
        status: 'PENDING_PAYMENT',
        expiresAt,
    }).returning({ id: bookings.id });

    redirect(`/status/${newBooking.id}`);
}

export async function getUnavailableSlots() {
    const activeBookings = await db.select({
        date: bookings.bookingDate,
        slot: bookings.slot
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

    return activeBookings.map(b => ({
        date: format(b.date, "yyyy-MM-dd"),
        slot: b.slot
    }));
}
