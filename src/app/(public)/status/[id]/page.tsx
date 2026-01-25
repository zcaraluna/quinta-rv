import { db } from "@/lib/db";
import { bookings } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export default async function StatusPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Validate UUID format to prevent DB errors if ID is invalid
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
        return notFound();
    }

    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));

    if (!booking) return notFound();

    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-muted/20">
            <div className="bg-card p-8 rounded-xl shadow-lg border max-w-md w-full text-center space-y-4">
                <h1 className="text-2xl font-bold text-foreground">Estado de Reserva</h1>
                <div className="p-4 bg-primary/10 rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">ID de Reserva</p>
                    <p className="font-mono text-lg">{booking.id.slice(0, 8)}...</p>
                </div>

                <div className="space-y-2">
                    <p className="text-muted-foreground">Estado Actual:</p>
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-amber-500 text-white shadow hover:bg-amber-600">
                        {booking.status.replace('_', ' ')}
                    </span>
                </div>

                <p className="text-sm text-muted-foreground pt-4">
                    (Esta página se desarrollará en detalle en la Fase 3)
                </p>
            </div>
        </main>
    )
}
