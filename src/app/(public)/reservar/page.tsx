import { getUnavailableSlots, getPricingConfig } from "@/lib/actions";
import { BookingWizard } from "@/components/booking/booking-wizard";
import { Toaster } from "@/components/ui/sonner";

export default async function BookingPage() {
    const unavailableSlots = await getUnavailableSlots().catch(() => []);
    const pricingConfig = await getPricingConfig();

    return (
        <main className="min-h-screen pt-32 pb-20 px-4 bg-muted/20">
            <div className="container mx-auto max-w-4xl">
                <BookingWizard
                    unavailableSlots={unavailableSlots}
                    pricingConfig={pricingConfig}
                />
            </div>
            <Toaster position="top-center" />
        </main>
    );
}
