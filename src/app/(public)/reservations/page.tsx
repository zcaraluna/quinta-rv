import { getUnavailableSlots } from "@/lib/actions";
import { BookingForm } from "@/components/booking/booking-form";
import { Toaster } from "@/components/ui/sonner";

export default async function ReservationsPage() {
    const unavailableSlots = await getUnavailableSlots().catch(() => []);

    return (
        <main className="min-h-screen pt-32 pb-20 px-4 bg-muted/20">
            <div className="container mx-auto max-w-4xl">
                <div className="grid md:grid-cols-[1fr_400px] gap-12 items-start">
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h1 className="text-4xl font-black tracking-tight">Comenzar Reserva</h1>
                            <p className="text-muted-foreground text-lg leading-relaxed balance">
                                Asegura tu lugar en Quinta RV - Luque. Reservas por día (Día o Noche).
                            </p>
                        </div>

                        <div className="bg-amber-100 dark:bg-amber-900/20 p-6 rounded-2xl border border-amber-200 dark:border-amber-800">
                            <h3 className="text-amber-800 dark:text-amber-200 font-bold mb-2 flex items-center gap-2">
                                <span>💡</span> Importante
                            </h3>
                            <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-2 font-medium">
                                <li>• Se requiere una seña del 50% para confirmar.</li>
                                <li>• Tienes <span className="font-bold">4 horas</span> para enviar el comprobante.</li>
                                <li>• Capacidad: Hasta 30 personas (excepto Promo Pareja).</li>
                            </ul>
                        </div>
                    </div>

                    <BookingForm unavailableSlots={unavailableSlots} />
                </div>
            </div>
            <Toaster position="top-center" />
        </main>
    );
}
