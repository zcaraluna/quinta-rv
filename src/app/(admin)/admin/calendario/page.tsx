import { db } from "@/lib/db";
import { bookings as bookingsSchema } from "@/lib/schema";
import { isNull, and, asc } from "drizzle-orm";
import { CalendarView } from "@/components/admin/calendar-view";

export const dynamic = "force-dynamic";

export default async function AdminCalendarPage() {
    // Fetch all active bookings (not deleted)
    const allBookings = await db
        .select()
        .from(bookingsSchema)
        .where(isNull(bookingsSchema.deletedAt))
        .orderBy(asc(bookingsSchema.bookingDate));

    // Filter out expired bookings (Pending payment + expiresAt in the past)
    const bookings = allBookings.filter(b => {
        if (b.status === "PENDING_PAYMENT" && b.expiresAt && new Date() > new Date(b.expiresAt)) {
            return false;
        }
        return true;
    });

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col gap-1">
                <h1 className="text-4xl font-black tracking-tighter">Calendario de Reservas</h1>
                <p className="text-muted-foreground font-medium">
                    Gestiona y visualiza la ocupación de la quinta de forma visual (solo reservas vigentes).
                </p>
            </div>

            <CalendarView bookings={bookings} />
        </div>
    );
}
