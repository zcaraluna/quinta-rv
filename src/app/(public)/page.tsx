import { PhotoReel } from "@/components/booking/photo-reel";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Home() {
    return (
        <main className="min-h-screen bg-background flex flex-col items-center">
            {/* Header Section */}
            <section className="w-full pt-40 pb-10 text-center px-4">
                <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-foreground mb-4">
                    Quinta RV - <span className="text-primary italic">Luque</span>
                </h1>
                <p className="text-muted-foreground text-xl max-w-xl mx-auto font-medium">
                    Naturaleza, paz y el lugar perfecto para tus recuerdos.
                </p>
                <div className="mt-8">
                    <Button size="lg" className="rounded-full px-8 font-bold text-lg" asChild>
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
