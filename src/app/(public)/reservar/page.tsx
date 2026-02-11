import { getUnavailableSlots, getPricingConfig } from "@/lib/actions";
import { BookingWizard } from "@/components/booking/booking-wizard";
import { Toaster } from "@/components/ui/sonner";
import BookingMaintenance from "./maintenance";
import { headers } from "next/headers";

const ALLOWED_IP = "181.91.86.248";

export default async function BookingPage() {
    // Obtener IP desde los headers (x-forwarded-for, típico detrás de proxy/CDN)
    const forwardedFor = headers().get("x-forwarded-for");
    const ip = forwardedFor?.split(",")[0]?.trim() || "";

    const isAllowed = ip === ALLOWED_IP;

    if (!isAllowed) {
        return <BookingMaintenance />;
    }

    const unavailableSlots = await getUnavailableSlots().catch(() => []);
    const pricingConfig = await getPricingConfig();

    return (
        <main className="min-h-screen pt-32 pb-20 px-4 bg-transparent">
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
