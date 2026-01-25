"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Menu } from "lucide-react"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const NAV_ITEMS = [
    { label: "Inicio", href: "/" },
    { label: "Reservaciones", href: "/reservations" },
    { label: "Amenities", href: "/amenities" },
    { label: "Sobre Nosotros", href: "/about" },
]

export function Navbar() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)

    const NavLinks = ({ onClick }: { onClick?: () => void }) => (
        <>
            {NAV_ITEMS.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClick}
                    className={cn(
                        "text-sm font-medium transition-colors hover:text-primary",
                        pathname === item.href ? "text-primary font-bold" : "text-muted-foreground"
                    )}
                >
                    {item.label}
                </Link>
            ))}
        </>
    )

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4 sm:p-6">
            <div className="flex items-center justify-between w-full max-w-5xl px-4 sm:px-6 py-3 bg-background/80 backdrop-blur-md border rounded-full shadow-lg">
                <Link href="/" className="flex items-center gap-2">
                    <Image
                        src="/quinta-rv.png"
                        alt="Quinta RV Logo"
                        width={40}
                        height={40}
                        className="rounded-sm object-contain w-8 h-8 sm:w-10 sm:h-10"
                    />
                    <span className="font-bold tracking-tight text-sm sm:text-base">Quinta RV</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    <NavLinks />
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                    <Link
                        href="/login"
                        className="hidden sm:block px-4 py-1.5 text-xs sm:text-sm font-semibold bg-foreground text-background rounded-full hover:opacity-90 transition-opacity"
                    >
                        Iniciar Sesión
                    </Link>

                    {/* Mobile Navigation */}
                    <div className="md:hidden">
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full">
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Menú</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="top" className="rounded-b-[2rem] border-b shadow-2xl">
                                <SheetHeader>
                                    <SheetTitle className="text-left flex items-center gap-2">
                                        <Image src="/quinta-rv.png" alt="Logo" width={24} height={24} />
                                        Quinta RV
                                    </SheetTitle>
                                </SheetHeader>
                                <div className="flex flex-col gap-6 py-8">
                                    <NavLinks onClick={() => setIsOpen(false)} />
                                    <Separator />
                                    <Link
                                        href="/login"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center justify-center p-4 text-sm font-bold bg-foreground text-background rounded-2xl"
                                    >
                                        Iniciar Sesión
                                    </Link>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    )
}

function Separator() {
    return <div className="h-[1px] w-full bg-border" />
}
