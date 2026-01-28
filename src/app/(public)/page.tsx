import { PhotoReel } from "@/components/booking/photo-reel";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Instagram, MapPin, Phone, Mail, Facebook } from "lucide-react";

export default async function Home() {
    return (
        <main className="min-h-screen bg-background flex flex-col items-center">
            {/* Split Hero Section */}
            <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[90vh]">
                {/* Left Side: Content */}
                <div className="text-center lg:text-left space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
                    <div className="space-y-2">
                        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-foreground leading-none">
                            Quinta RV
                        </h1>
                        <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary italic tracking-tight">
                            Yukyry - Luque
                        </p>
                    </div>

                    <div className="space-y-1">
                        <p className="text-lg sm:text-xl text-muted-foreground font-medium balance leading-relaxed">
                            Un lugar para divertirte con la familia y amigos.
                        </p>
                        <p className="text-lg sm:text-xl font-black text-primary/90 tracking-tight">
                            Somos pet friendly.
                        </p>
                    </div>

                    <div className="pt-2">
                        <Link href="/reservar">
                            <Button size="lg" className="rounded-full px-10 h-14 font-black text-lg shadow-2xl shadow-primary/30 hover:scale-105 transition-all active:scale-95">
                                Reservar Ahora
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Right Side: Photo Reel */}
                <div className="w-full max-w-sm lg:max-w-md mx-auto h-[500px] lg:h-[70vh] overflow-hidden rounded-[2.5rem] shadow-2xl border-2 border-white/50 relative animate-in fade-in slide-in-from-right-8 duration-1000">
                    <PhotoReel direction="vertical" />
                </div>
            </section>

            {/* Modern Footer */}
            <footer className="w-full bg-muted/30 border-t mt-12 pt-20 pb-10">
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
                                <a href="https://www.instagram.com/casaquintarvluque" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-background border hover:text-primary transition-colors shadow-sm">
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
                                <li><Link href="/comodidades" className="hover:text-primary transition-colors">Instalaciones</Link></li>
                                <li><Link href="/tarifas" className="hover:text-primary transition-colors">Tarifas</Link></li>
                                <li><Link href="/reservar" className="hover:text-primary transition-colors">Reservar</Link></li>
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
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3608.191027598744!2d-57.4415588!3d-25.264158600000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x945db1bddd4378cb%3A0xcb81d02a2f32d0f!2sCasaquinta%20RV%20luque!5e0!3m2!1ses-419!2spy!4v1769384373495!5m2!1ses-419!2spy"
                                    className="w-full h-full border-0"
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                        </div>
                    </div>

                    <div className="border-t pt-10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground font-medium uppercase tracking-widest">
                        <p>© 2026 Quinta RV - Luque. Todos los derechos reservados.</p>
                        <p>
                            Desarrollado por <a href="https://s1mple.dev" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors font-black lowercase">s1mple.dev</a>,
                            desplegado en <a href="https://s1mple.cloud" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors font-black lowercase">s1mple.cloud</a>
                        </p>
                    </div>
                </div>
            </footer>
        </main>
    );
}
