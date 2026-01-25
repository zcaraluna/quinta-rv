import { PhotoReel } from "@/components/booking/photo-reel";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Home() {
    return (
        <main className="min-h-screen bg-background flex flex-col items-center">
            {/* Header Section */}
            <section className="w-full pt-28 sm:pt-40 pb-10 text-center px-4 max-w-4xl mx-auto">
                <div className="space-y-2 mb-8">
                    <h1 className="text-6xl sm:text-8xl md:text-[10rem] font-black tracking-tighter text-foreground leading-none">
                        Quinta RV
                    </h1>
                    <p className="text-xl sm:text-3xl md:text-4xl font-bold text-primary italic tracking-tight">
                        Yukyry - Luque
                    </p>
                </div>
                <p className="text-lg sm:text-2xl text-muted-foreground max-w-2xl mx-auto font-medium balance leading-relaxed px-4">
                    Un lugar para divertirte con la familia y amigos.<br />
                    <span className="text-primary/80 font-bold">Somos pet friendly.</span>
                </p>
                <div className="mt-8">
                    <Button size="lg" className="rounded-full px-10 h-14 font-black text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-all active:scale-95" asChild>
                        <Link href="/reservations">Reservar Ahora</Link>
                    </Button>
                </div>
            </section>

            {/* Photo Reel Section */}
            <section className="w-full mt-10">
                <PhotoReel />
            </section>

            {/* Footer Info */}
            <section className="container mx-auto px-4 max-w-4xl py-20 text-center">
                <p className="text-muted-foreground italic text-sm">
                    © 2026 Quinta RV - Luque. Todos los derechos reservados.
                </p>
            </section>
        </main>
    );
}
