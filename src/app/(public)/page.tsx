import { getUnavailableDates } from "@/lib/actions";
import { BookingForm } from "@/components/booking/booking-form";
import { Toaster } from "@/components/ui/sonner";

export default async function Home() {
    const unavailableDates = await getUnavailableDates().catch(() => []); // Fallback if DB fails/not set

    return (
        <main className="min-h-screen bg-background flex flex-col items-center">
            {/* Hero Section */}
            <section className="w-full h-[50vh] bg-stone-900 flex items-center justify-center relative overflow-hidden">
                {/* Placeholder for Image - in real app, use Next/Image with DB url */}
                <div className="absolute inset-0 bg-black/40 z-10" />
                <div className="relative z-20 text-center px-4">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
                        Casa Quinta <span className="text-primary">Relax</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
                        Tu escapada perfecta. Naturaleza, confort y tranquilidad a solo unos pasos de la ciudad.
                    </p>
                </div>
            </section>

            {/* Booking Section */}
            <section className="container mx-auto px-4 -mt-20 relative z-30 mb-20">
                <div className="grid md:grid-cols-2 gap-8 items-start">
                    <div className="hidden md:block space-y-6 pt-20">
                        <div className="bg-card p-6 rounded-xl border shadow-sm">
                            <h3 className="text-xl font-semibold mb-2">Amenities</h3>
                            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                <li>Piscina climatizada</li>
                                <li>Quincho y Asador</li>
                                <li>Wi-Fi de alta velocidad</li>
                                <li>3 Habitaciones (8 pax)</li>
                            </ul>
                        </div>
                        <div className="bg-amber-100 dark:bg-amber-900/20 p-6 rounded-xl border border-amber-200 dark:border-amber-800">
                            <h3 className="text-amber-800 dark:text-amber-200 font-semibold mb-2">Información Importante</h3>
                            <p className="text-sm text-amber-700 dark:text-amber-300">
                                La reserva requiere una seña del 50%. Tienes 4 horas para realizar el pago una vez solicitada la fecha.
                            </p>
                        </div>
                    </div>

                    <BookingForm unavailableDates={unavailableDates} />
                </div>
            </section>

            <Toaster position="top-center" />
        </main>
    );
}
