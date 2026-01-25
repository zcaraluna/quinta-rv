import { getUnavailableDates } from "@/lib/actions";
import { BookingForm } from "@/components/booking/booking-form";
import { PhotoReel } from "@/components/booking/photo-reel";
import { Toaster } from "@/components/ui/sonner";

export default async function Home() {
    const unavailableDates = await getUnavailableDates().catch(() => []);

    return (
        <main className="min-h-screen bg-background flex flex-col items-center">
            {/* Header Section */}
            <section className="w-full pt-20 pb-10 text-center px-4">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-foreground mb-4">
                    Casa Quinta <span className="text-primary">Relax</span>
                </h1>
                <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                    Tu rincón de paz y naturaleza.
                </p>
            </section>

            {/* Photo Reel Section */}
            <section className="w-full mb-16">
                <PhotoReel />
            </section>

            {/* Booking Section */}
            <section id="reserve" className="container mx-auto px-4 max-w-4xl pb-20">
                <div className="grid md:grid-cols-[1fr_400px] gap-12 items-start">
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold">Reserva tu estadía</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Disfruta de una experiencia única en nuestra quinta. Piscina, asador y tranquilidad garantizada.
                                Selecciona las fechas en el calendario para comenzar.
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
            </section>

            <Toaster position="top-center" />
        </main>
    );
}
