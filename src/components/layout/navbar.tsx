"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
    { label: "Inicio", href: "/" },
    { label: "Reservaciones", href: "/reservations" },
    { label: "Amenities", href: "/amenities" },
    { label: "Sobre Nosotros", href: "/about" },
]

export function Navbar() {
    const pathname = usePathname()

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center p-6">
            <div className="flex items-center gap-8 px-6 py-3 bg-background/70 backdrop-blur-md border rounded-full shadow-lg">
                <Link href="/" className="flex items-center gap-2">
                    <Image src="/quinta-rv.png" alt="Quinta RV Logo" width={48} height={48} className="rounded-sm object-contain" />
                    <span className="font-bold tracking-tight hidden sm:inline-block">Quinta RV</span>
                </Link>

                <div className="flex items-center gap-6">
                    {NAV_ITEMS.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary",
                                pathname === item.href ? "text-primary" : "text-muted-foreground"
                            )}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                <Link
                    href="/login"
                    className="px-4 py-1.5 text-sm font-semibold bg-foreground text-background rounded-full hover:opacity-90 transition-opacity"
                >
                    Iniciar Sesión
                </Link>
            </div>
        </nav>
    )
}
