import { auth, signOut } from "@/auth";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import {
    LayoutDashboard,
    CalendarDays,
    Settings,
    LogOut,
    Menu,
    ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-muted/20 flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-card border-r flex flex-col shadow-sm z-30">
                <div className="p-6 border-b flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Image src="/quinta-rv.png" alt="Logo" width={32} height={32} />
                        <span className="font-black tracking-tighter">Admin QRV</span>
                    </div>
                    <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu className="h-5 w-5" />
                    </Button>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <SidebarItem href="/admin" icon={<LayoutDashboard size={20} />} label="Dashboard" />
                    <SidebarItem href="/admin/bookings" icon={<CalendarDays size={20} />} label="Reservas" />
                    <SidebarItem href="/admin/settings" icon={<Settings size={20} />} label="Ajustes" />
                </nav>

                <div className="p-4 border-t space-y-4">
                    <div className="flex items-center gap-3 px-2 py-2">
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-xs text-primary">
                            {((session.user as any)?.username || "A")[0].toUpperCase()}
                        </div>
                        <div className="flex flex-col overflow-hidden text-sm">
                            <span className="font-bold truncate">{(session.user as any)?.username || "Admin"}</span>
                            <span className="text-xs text-muted-foreground">Administrador</span>
                        </div>
                    </div>
                    <form
                        action={async () => {
                            "use server";
                            await signOut();
                        }}
                    >
                        <Button variant="ghost" className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl px-2">
                            <LogOut size={20} />
                            <span className="font-bold">Cerrar Sesión</span>
                        </Button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-muted/10">
                <header className="h-16 bg-card border-b px-8 flex items-center justify-between sticky top-0 z-20 shadow-sm md:shadow-none">
                    <h2 className="font-black tracking-tight text-lg">Quinta RV Dashboard</h2>
                    <div className="flex items-center gap-6">
                        <span className="hidden sm:inline text-xs font-bold text-muted-foreground uppercase tracking-widest">{new Date().toLocaleDateString('es-PY', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                        <form
                            action={async () => {
                                "use server";
                                await signOut();
                            }}
                        >
                            <Button variant="outline" size="sm" className="rounded-full gap-2 border-destructive/20 text-destructive hover:bg-destructive/10 hover:text-destructive font-bold transition-all">
                                <LogOut className="h-4 w-4" />
                                <span className="hidden sm:inline">Salir</span>
                            </Button>
                        </form>
                    </div>
                </header>
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}

function SidebarItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <Link
            href={href}
            className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl hover:bg-muted font-bold text-sm text-muted-foreground hover:text-foreground transition-all group"
        >
            <div className="flex items-center gap-3">
                {icon}
                <span>{label}</span>
            </div>
            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
        </Link>
    );
}
