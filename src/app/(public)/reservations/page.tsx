import { getUnavailableDates } from "@/lib/actions";
import { BookingForm } from "@/components/booking/booking-form";
import { Toaster } from "@/components/ui/sonner";

export default async function ReservationsPage() {
    const unavailableDates = await getUnavailableDates().catch(() => []);

    return (
        <main className="min-h-screen pt-32 pb-20 px-4 bg-muted/20">
            <div className="container mx-auto max-w-4xl">
                <div className="grid md:grid-cols-[1fr_400px] gap-12 items-start">
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h1 className="text-4xl font-bold tracking-tight">Reserva tu estadía</h1>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                Asegura tu lugar en Quinta RV - Luque. Selecciona las fechas disponibles en el calendario.
                            </p>
                        </div>

                        <div className="bg-amber-100 dark:bg-amber-900/20 p-6 rounded-xl border border-amber-200 dark:border-amber-800">
                            <h3 className="text-amber-800 dark:text-amber-200 font-semibold mb-2 flex items-center gap-2">
                                <span>💡</span> Información Importante
                            </h3>
                            <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-2">
                                <li>• Se requiere una seña del 50% para confirmar la reserva.</li>
                                <li>• Tienes un plazo de 4 horas para enviar el comprobante de pago.</li>
                                <li>• La capacidad máxima es de 8 personas.</li>
                            </ul>
                        </div>
                    </div>

                    <BookingForm unavailableDates={unavailableDates} />
                </div>
            </div>
            <Toaster position="top-center" />
        </main>
    );
}
