import { db } from "@/lib/db";
import { ManualBookingForm } from "@/components/admin/manual-booking-form";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NewBookingPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="rounded-full h-12 w-12 hover:bg-muted" asChild>
                    <Link href="/admin/bookings">
                        <ChevronLeft className="h-6 w-6" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-4xl font-black tracking-tighter">Nueva Reserva Manual</h1>
                    <p className="text-muted-foreground font-medium text-lg">Registra una reserva directamente en el sistema.</p>
                </div>
            </div>

            <div className="bg-card rounded-[2.5rem] border-none shadow-2xl p-8 md:p-12">
                <ManualBookingForm />
            </div>
        </div>
    );
}
