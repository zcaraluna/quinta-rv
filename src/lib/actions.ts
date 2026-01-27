'use server';

import { db } from './db';
import { bookings } from './schema';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { addHours, format, getDay, startOfDay } from 'date-fns';
import { and, gte, lte, or, eq, sql, isNull } from 'drizzle-orm';

const DEFAULT_PRICING = {
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

export async function getPricingConfig() {
    const [configSetting] = await db.select()
        .from(settings)
        .where(eq(settings.key, 'pricing_config'));

    if (!configSetting) return DEFAULT_PRICING;

    try {
        return JSON.parse(configSetting.value);
    } catch (e) {
        console.error("Error parsing pricing_config:", e);
        return DEFAULT_PRICING;
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
            isNull(bookings.deletedAt),
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

    const PRICING = await getPricingConfig();
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

    redirect(`/estado/${newBooking.id}`);
}

export async function createManualBooking(formData: FormData) {
    const rawData = {
        guestName: formData.get('guestName'),
        guestEmail: formData.get('guestEmail'),
        guestWhatsapp: formData.get('guestWhatsapp'),
        bookingDate: new Date(formData.get('bookingDate') as string),
        slot: formData.get('slot'),
        isCouplePromo: formData.get('isCouplePromo') === "true",
        totalPrice: formData.get('totalPrice'),
        status: formData.get('status') || 'CONFIRMED',
    };

    const { guestName, guestEmail, guestWhatsapp, bookingDate, slot, isCouplePromo, totalPrice, status } = rawData as any;

    await db.insert(bookings).values({
        guestName,
        guestEmail,
        guestWhatsapp,
        bookingDate: startOfDay(bookingDate),
        slot,
        isCouplePromo: isCouplePromo.toString(),
        totalPrice: totalPrice.toString(),
        status,
    });

    revalidatePath('/admin/reservas');
    return { success: true };
}

export async function getUnavailableSlots() {
    const activeBookings = await db.select({
        date: bookings.bookingDate,
        slot: bookings.slot
    })
        .from(bookings)
        .where(
            and(
                or(
                    eq(bookings.status, 'CONFIRMED'),
                    eq(bookings.status, 'MAINTENANCE'),
                    and(
                        eq(bookings.status, 'PENDING_PAYMENT'),
                        gte(bookings.expiresAt, new Date())
                    )
                ),
                isNull(bookings.deletedAt)
            )
        );

    return activeBookings.map(b => ({
        date: format(b.date, "yyyy-MM-dd"),
        slot: b.slot
    }));
}

export async function updateBookingStatus(id: string, status: any) {
    await db.update(bookings)
        .set({ status })
        .where(eq(bookings.id, id));

    revalidatePath('/admin/reservas');
    revalidatePath(`/estado/${id}`);
    revalidatePath('/');
    return { success: true };
}

export async function deleteBooking(id: string) {
    await db.update(bookings)
        .set({ deletedAt: new Date() })
        .where(eq(bookings.id, id));
    revalidatePath('/admin/reservas');
    revalidatePath('/');
    return { success: true };
}

export async function createMaintenance(date: string) {
    const bookingDate = startOfDay(new Date(date));

    // Create maintenance for both slots
    await db.insert(bookings).values([
        {
            guestName: "MANTENIMIENTO",
            guestEmail: "admin@casaquinta.com",
            guestWhatsapp: "00000000",
            bookingDate,
            slot: "DAY",
            status: "MAINTENANCE",
            totalPrice: "0",
        },
        {
            guestName: "MANTENIMIENTO",
            guestEmail: "admin@casaquinta.com",
            guestWhatsapp: "00000000",
            bookingDate,
            slot: "NIGHT",
            status: "MAINTENANCE",
            totalPrice: "0",
        }
    ]);

    revalidatePath('/admin/reservas');
    revalidatePath('/');
    return { success: true };
}

import { settings } from './schema';

export async function updateSettings(key: string, value: string) {
    await db.insert(settings)
        .values({ key, value })
        .onConflictDoUpdate({
            target: settings.key,
            set: { value }
        });

    revalidatePath('/admin/ajustes');
    revalidatePath('/');
    return { success: true };
}

import { users } from './schema';
// Removed bcryptjs import as existing auth uses plain text comparison.

export async function updatePassword(userId: string, newPassword: string) {
    console.log("--- updatePassword action START ---");
    console.log("Target userId:", userId);
    try {
        if (!userId) {
            console.error("Error: userId is missing in updatePassword action");
            return { success: false, error: "Missing userId" };
        }

        console.log("Updating password in DB...");
        const updateResult = await db.update(users)
            .set({
                password: newPassword,
                requiresPasswordChange: false
            })
            .where(eq(users.id, userId));

        console.log("DB Update Result:", updateResult);
        console.log("Password updated successfully in DB");
    } catch (error) {
        console.error("Error updating password in DB:", error);
        return { success: false, error: "DB update failed" };
    }

    console.log("Revalidating path /admin");
    revalidatePath('/admin');
    console.log("--- updatePassword action END ---");
    return { success: true };
}

export async function createUser(formData: FormData) {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    const role = formData.get('role') as any;

    if (!username || !password) {
        return { error: "Usuario y contraseña son obligatorios" };
    }

    try {
        await db.insert(users).values({
            username,
            password, // Plan text for now as per project pattern
            role: role || 'ADMIN',
            requiresPasswordChange: true
        });

        revalidatePath('/admin/ajustes');
        return { success: true };
    } catch (error) {
        console.error("Error creating user:", error);
        return { error: "El usuario ya existe o hubo un error" };
    }
}
