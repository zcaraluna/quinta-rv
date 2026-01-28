"use client";

import { useEffect, useState, useCallback } from "react";
import { getRecentPendingBookings } from "@/lib/actions";
import {
    Bell,
    Clock,
    User,
    CheckCircle2,
    ExternalLink,
    AlertCircle
} from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function AdminNotifications() {
    const [recentBookings, setRecentBookings] = useState<any[]>([]);
    const [lastCount, setLastCount] = useState<number | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const fetchNotifications = useCallback(async () => {
        try {
            const bookings = await getRecentPendingBookings();
            setRecentBookings(bookings);

            // If it's not the first load and count increased, show a toast
            if (lastCount !== null && bookings.length > lastCount) {
                const latest = bookings[0];
                toast.info(`Nueva reserva de ${latest.guestName}`, {
                    description: "Se ha recibido una nueva solicitud de reserva.",
                    action: {
                        label: "Ver Reservas",
                        onClick: () => window.location.href = "/admin/reservas"
                    }
                });

                // Play a subtle sound if possible or just rely on toast
            }

            setLastCount(bookings.length);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    }, [lastCount]);

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Every 30 seconds
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    const pendingCount = recentBookings.length;

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative rounded-full hover:bg-primary/10 transition-colors group"
                >
                    <Bell className={cn(
                        "h-5 w-5 transition-transform group-hover:scale-110",
                        pendingCount > 0 ? "text-primary fill-primary/10 animate-pulse" : "text-muted-foreground"
                    )} />
                    {pendingCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-black text-primary-foreground border-2 border-background shadow-sm">
                            {pendingCount}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 rounded-3xl overflow-hidden shadow-2xl border-none mr-4 mt-2" align="end">
                <div className="bg-primary p-4 text-primary-foreground">
                    <div className="flex items-center justify-between">
                        <h3 className="font-black text-sm uppercase tracking-widest flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" />
                            Notificaciones
                        </h3>
                        <span className="text-[10px] font-bold opacity-80 uppercase tracking-tighter">
                            Pendientes (24h)
                        </span>
                    </div>
                </div>

                <div className="max-h-[70vh] overflow-y-auto bg-card">
                    {recentBookings.length === 0 ? (
                        <div className="p-8 text-center space-y-2">
                            <CheckCircle2 className="h-8 w-8 text-muted-foreground/20 mx-auto" />
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Sin reservas nuevas</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-muted/50">
                            {recentBookings.map((booking) => (
                                <Link
                                    key={booking.id}
                                    href={`/admin/reservas?status=PENDING_PAYMENT`}
                                    onClick={() => setIsOpen(false)}
                                    className="p-4 flex flex-col gap-2 hover:bg-muted/30 transition-colors group"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                <User className="h-3.5 w-3.5 text-primary" />
                                            </div>
                                            <span className="text-sm font-bold truncate max-w-[120px]">
                                                {booking.guestName}
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-black text-primary">
                                            {formatCurrency(Number(booking.totalPrice))}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between text-[10px] text-muted-foreground font-medium">
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {format(new Date(booking.bookingDate), "d MMM", { locale: es })} • {booking.slot === 'DAY' ? 'Día' : 'Noche'}
                                        </span>
                                        <span className="italic opacity-60">
                                            {format(new Date(booking.createdAt), "HH:mm", { locale: es })}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {recentBookings.length > 0 && (
                    <div className="p-3 bg-muted/30 border-t">
                        <Button
                            asChild
                            variant="ghost"
                            className="w-full rounded-xl font-bold text-xs gap-2 py-0 h-9"
                        >
                            <Link href="/admin/reservas">
                                Ver todas las reservas
                                <ExternalLink className="h-3 w-3" />
                            </Link>
                        </Button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
}
