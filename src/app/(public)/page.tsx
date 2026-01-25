import { PhotoReel } from "@/components/booking/photo-reel";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Instagram, MapPin, Phone, Mail, Facebook } from "lucide-react";

export default async function Home() {
    return (
        <main className="min-h-screen bg-background flex flex-col items-center">
            {/* Hero Section with Watermark Background */}
            <section className="relative w-full overflow-hidden min-h-[85vh] flex items-center justify-center">
                {/* Watermark Photo Reel (Background) */}
                <div className="absolute inset-0 z-0 pointer-events-none flex items-center overflow-hidden">
                    <PhotoReel watermark />
                </div>

                {/* Hero Content */}
                <div className="relative z-10 w-full pt-20 sm:pt-32 pb-4 text-center px-4 max-w-4xl mx-auto">
                    <div className="space-y-1 mb-6">
                        <h1 className="text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter text-foreground leading-none drop-shadow-sm">
                            Quinta RV
                        </h1>
                        <p className="text-lg sm:text-xl md:text-2xl font-bold text-primary italic tracking-tight">
                            Yukyry - Luque
                        </p>
                    </div>
                    <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl mx-auto font-medium balance leading-relaxed px-4">
                        Un lugar para divertirte con la familia y amigos.<br />
                        <span className="text-primary/80 font-bold">Somos pet friendly.</span>
                    </p>
                    <div className="mt-8">
                        <Link href="/reservations">
                            <Button size="lg" className="rounded-full px-10 h-14 font-black text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-all active:scale-95">
                                Reservar Ahora
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Gallery Reel Section (Optional but nice) */}
            <section className="w-full py-10">
                <PhotoReel />
            </section>

            {/* Modern Footer */}
            <footer className="w-full bg-muted/30 border-t mt-20 pt-20 pb-10">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                        {/* Brand Column */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <Image src="/quinta-rv.png" alt="Logo" width={40} height={40} className="rounded-lg" />
                                <div className="flex flex-col">
                                    <span className="font-black text-xl tracking-tighter">Quinta RV</span>
                                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-none">Luque</span>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                                Creamos el ambiente perfecto para tus mejores momentos en familia y con amigos.
                            </p>
                            <div className="flex items-center gap-4">
                                <a href="#" className="p-2 rounded-full bg-background border hover:text-primary transition-colors shadow-sm">
                                    <Instagram className="h-5 w-5" />
                                </a>
                                <a href="#" className="p-2 rounded-full bg-background border hover:text-primary transition-colors shadow-sm">
                                    <Facebook className="h-5 w-5" />
                                </a>
                            </div>
                        </div>

                        {/* Navigation Column */}
                        <div className="space-y-6">
                            <h3 className="font-black text-sm uppercase tracking-widest text-foreground">Explora</h3>
                            <ul className="space-y-3 text-sm text-muted-foreground font-medium">
                                <li><Link href="/" className="hover:text-primary transition-colors">Inicio</Link></li>
                                <li><Link href="/amenities" className="hover:text-primary transition-colors">Instalaciones</Link></li>
                                <li><Link href="/pricing" className="hover:text-primary transition-colors">Tarifas</Link></li>
                                <li><Link href="/reservations" className="hover:text-primary transition-colors">Reservar</Link></li>
                            </ul>
                        </div>

                        {/* Contact Column */}
                        <div className="space-y-6">
                            <h3 className="font-black text-sm uppercase tracking-widest text-foreground">Contacto</h3>
                            <ul className="space-y-3 text-sm text-muted-foreground font-medium">
                                <li className="flex items-center gap-3">
                                    <Phone className="h-4 w-4 text-primary" />
                                    <span>0983 145 432</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Mail className="h-4 w-4 text-primary" />
                                    <span>info@quintarv.com.py</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <MapPin className="h-4 w-4 text-primary" />
                                    <span>Luque, Yukyry</span>
                                </li>
                            </ul>
                        </div>

                        {/* Location Column */}
                        <div className="space-y-6">
                            <h3 className="font-black text-sm uppercase tracking-widest text-foreground">Ubicanos</h3>
                            <div className="aspect-square w-full rounded-2xl overflow-hidden grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all border shrink-0">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14424.341113063548!2d-57.4443916!3d-25.334966!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x945da700147e62d3%3A0xe549aef6f19e917d!2sQuinta%20RV!5e0!3m2!1ses!2spy!4v1737847843477!5m2!1ses!2spy"
                                    className="w-full h-full border-0"
                                    loading="lazy"
                                ></iframe>
                            </div>
                        </div>
                    </div>

                    <div className="border-t pt-10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground font-medium uppercase tracking-widest">
                        <p>© 2026 Quinta RV - Luque. Todos los derechos reservados.</p>
                        <p>Desarrollado con ❤️ para momentos involvidables.</p>
                    </div>
                </div>
            </footer>
        </main>
    );
}
