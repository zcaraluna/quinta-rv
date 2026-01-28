"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    LayoutDashboard,
    CalendarDays,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { AdminNotifications } from "./notifications";
import { PushSubscriptionManager } from "./push-subscription-manager";

export function AdminShell({
    children,
    session,
    signOutAction
}: {
    children: React.ReactNode;
    session: any;
    signOutAction: () => Promise<void>;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();

    const SidebarItem = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => {
        const isActive = pathname === href;
        return (
            <Link
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                    "flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all group font-bold text-sm",
                    isActive
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
            >
                <div className="flex items-center gap-3">
                    {icon}
                    <span>{label}</span>
                </div>
                <ChevronRight size={14} className={cn(
                    "transition-all",
                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0"
                )} />
            </Link>
        );
    };

    return (
        <div className="min-h-screen bg-muted/20 flex flex-col md:flex-row relative overflow-x-hidden">
            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 w-64 bg-card border-r flex flex-col shadow-2xl md:shadow-sm z-50 transition-transform duration-300 md:relative md:translate-x-0",
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-6 border-b flex items-center justify-between">
                    <Link href="/admin" className="flex items-center gap-3" onClick={() => setSidebarOpen(false)}>
                        <Image src="/quinta-rv.png" alt="Logo" width={32} height={32} />
                        <span className="font-black tracking-tighter">Admin QRV</span>
                    </Link>
                    <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(false)}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <SidebarItem href="/admin" icon={<LayoutDashboard size={20} />} label="Dashboard" />
                    <SidebarItem href="/admin/reservas" icon={<CalendarDays size={20} />} label="Reservas" />
                    <SidebarItem href="/admin/ajustes" icon={<Settings size={20} />} label="Ajustes" />
                </nav>

                <div className="p-4 border-t space-y-4">
                    <div className="flex items-center gap-3 px-2 py-2">
                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-sm text-primary">
                            {(session?.user?.username || "A")[0].toUpperCase()}
                        </div>
                        <div className="flex flex-col overflow-hidden text-sm">
                            <span className="font-bold truncate">{session?.user?.username || "Admin"}</span>
                            <span className="text-xs text-muted-foreground">Administrador</span>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl px-2"
                        onClick={() => signOutAction()}
                    >
                        <LogOut size={20} />
                        <span className="font-bold">Cerrar Sesión</span>
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 bg-muted/10">
                <header className="h-16 bg-card border-b px-4 md:px-8 flex items-center justify-between sticky top-0 z-20 shadow-sm md:shadow-none">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(true)}>
                            <Menu className="h-6 w-6" />
                        </Button>
                        <h2 className="font-black tracking-tight text-lg truncate">Quinta RV Dashboard</h2>
                    </div>

                    <div className="flex items-center gap-4 md:gap-6">
                        <PushSubscriptionManager userId={session.user.id} />
                        <AdminNotifications />
                        <span className="hidden lg:inline text-xs font-bold text-muted-foreground uppercase tracking-widest">
                            {new Date().toLocaleDateString('es-PY', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full gap-2 border-destructive/20 text-destructive hover:bg-destructive/10 hover:text-destructive font-bold transition-all"
                            onClick={() => signOutAction()}
                        >
                            <LogOut className="h-4 w-4" />
                            <span className="hidden sm:inline">Salir</span>
                        </Button>
                    </div>
                </header>
                <div className="p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
