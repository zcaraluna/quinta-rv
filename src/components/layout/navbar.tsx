"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Menu, Home, Calendar, Sparkles, Users, LogIn, X } from "lucide-react"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const NAV_ITEMS = [
    { label: "Inicio", href: "/", icon: Home },
    { label: "Reservaciones", href: "/reservations", icon: Calendar },
    { label: "Amenities", href: "/amenities", icon: Sparkles },
    { label: "Sobre Nosotros", href: "/about", icon: Users },
]

export function Navbar() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)

    const NavLinks = ({ onClick, isMobile = false }: { onClick?: () => void; isMobile?: boolean }) => (
        <>
            {NAV_ITEMS.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClick}
                    className={cn(
                        "flex items-center gap-3 transition-all duration-200",
                        isMobile ? "text-lg py-4 px-6 rounded-2xl w-full justify-center" : "text-sm font-medium hover:text-primary",
                        pathname === item.href
                            ? (isMobile ? "bg-primary/10 text-primary font-bold shadow-sm" : "text-primary font-bold")
                            : "text-muted-foreground hover:bg-muted/50"
                    )}
                >
                    {isMobile && <item.icon className="h-5 w-5" />}
                    {item.label}
                </Link>
            ))}
        </>
    )

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4 sm:p-6">
            <div className="flex items-center justify-between w-full max-w-5xl px-4 sm:px-6 py-3 bg-background/80 backdrop-blur-md border rounded-full shadow-lg transition-all duration-300">
                <Link href="/" className="flex items-center gap-2 group">
                    <Image
                        src="/quinta-rv.png"
                        alt="Quinta RV Logo"
                        width={48}
                        height={48}
                        className="rounded-sm object-contain w-10 h-10 group-hover:scale-110 transition-transform"
                    />
                    <div className="flex flex-col -gap-1">
                        <span className="font-bold tracking-tight text-sm sm:text-base">Quinta RV</span>
                        <span className="text-[10px] text-muted-foreground font-medium hidden sm:block">Luque</span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    <NavLinks />
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                    <Link
                        href="/login"
                        className="hidden sm:flex items-center gap-2 px-5 py-2 text-sm font-bold bg-foreground text-background rounded-full hover:bg-foreground/90 transition-all hover:scale-105 active:scale-95 shadow-sm"
                    >
                        <LogIn className="h-4 w-4" />
                        Iniciar Sesión
                    </Link>

                    {/* Mobile Navigation */}
                    <div className="md:hidden">
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted">
                                    <Menu className="h-6 w-6 text-foreground" />
                                    <span className="sr-only">Menú</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="top" className="rounded-b-[2.5rem] border-b shadow-2xl p-0 overflow-hidden bg-background">
                                <div className="flex flex-col h-full max-h-[85vh]">
                                    <SheetHeader className="p-6 border-b bg-muted/20">
                                        <div className="flex items-center justify-between">
                                            <SheetTitle className="text-left flex items-center gap-3">
                                                <Image src="/quinta-rv.png" alt="Logo" width={32} height={32} className="rounded-sm" />
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-lg">Quinta RV</span>
                                                    <span className="text-xs text-muted-foreground">Luque - Paraguay</span>
                                                </div>
                                            </SheetTitle>
                                            <SheetClose asChild>
                                                <Button variant="ghost" size="icon" className="rounded-full outline-amber-500">
                                                    <X className="h-6 w-6" />
                                                </Button>
                                            </SheetClose>
                                        </div>
                                    </SheetHeader>

                                    <div className="flex flex-col items-center gap-2 px-6 py-10 overflow-y-auto">
                                        <NavLinks onClick={() => setIsOpen(false)} isMobile />
                                    </div>

                                    <div className="p-6 mt-auto border-t bg-muted/10">
                                        <Link
                                            href="/login"
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center justify-center gap-3 w-full p-5 text-base font-black bg-foreground text-background rounded-[1.5rem] shadow-xl hover:shadow-2xl transition-all active:scale-95"
                                        >
                                            <LogIn className="h-5 w-5" />
                                            Iniciar Sesión
                                        </Link>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    )
}

