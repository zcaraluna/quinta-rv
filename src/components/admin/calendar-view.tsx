"use client";

import { useState, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import {
    User,
    Clock,
    Phone,
    Mail,
    Calendar as CalendarIcon,
    ChevronRight,
    AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BookingStatusBadge } from "./status-badge";
import { BookingActions } from "./booking-actions";
import { isAfter } from "date-fns";

interface CalendarViewProps {
    bookings: any[];
}

export function CalendarView({ bookings }: CalendarViewProps) {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

    // Group bookings by date for easy lookup
    const bookingsByDate = useMemo(() => {
        const grouped: Record<string, any[]> = {};
        bookings.forEach((booking) => {
            const dateStr = format(new Date(booking.bookingDate), "yyyy-MM-dd");
            if (!grouped[dateStr]) {
                grouped[dateStr] = [];
            }
            grouped[dateStr].push(booking);
        }
        );
        return grouped;
    }, [bookings]);

    const selectedDayBookings = useMemo(() => {
        if (!selectedDate) return [];
        const dateStr = format(selectedDate, "yyyy-MM-dd");
        return bookingsByDate[dateStr] || [];
    }, [selectedDate, bookingsByDate]);

    const dayConflicts = useMemo(() => {
        const counts: Record<string, number> = {};
        selectedDayBookings.forEach(b => {
            const isActive = b.status === 'CONFIRMED' ||
                b.status === 'RESERVED' ||
                b.status === 'MAINTENANCE' ||
                (b.status === 'PENDING_PAYMENT' && b.expiresAt && isAfter(new Date(b.expiresAt), new Date()));

            if (isActive) {
                counts[b.slot] = (counts[b.slot] || 0) + 1;
            }
        });
        return counts;
    }, [selectedDayBookings]);

    // Modifiers for react-day-picker
    const modifiers = {
        hasBookings: bookings.map(b => new Date(b.bookingDate)),
        confirmed: bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'RESERVED').map(b => new Date(b.bookingDate)),
        pending: bookings.filter(b => b.status === 'PENDING_PAYMENT').map(b => new Date(b.bookingDate)),
    };

    const modifierClassNames = {
        hasBookings: "font-black underline decoration-primary decoration-2 underline-offset-4",
        confirmed: "bg-green-500/10 text-green-700 dark:text-green-400 font-black",
        pending: "bg-amber-500/10 text-amber-700 dark:text-amber-400 font-black",
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left side: Calendar */}
            <Card className="lg:col-span-7 border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-card">
                <CardHeader className="pb-2">
                    <CardTitle className="text-2xl font-black tracking-tighter flex items-center gap-2">
                        <CalendarIcon className="h-6 w-6 text-primary" />
                        Disponibilidad y Reservas
                    </CardTitle>
                    <CardDescription className="font-medium">
                        Visualiza las reservas confirmadas y pendientes por día.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0 sm:p-4">
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        locale={es}
                        className="w-full"
                        modifiers={modifiers}
                        modifiersClassNames={modifierClassNames}
                    />
                </CardContent>
            </Card>

            {/* Right side: Details */}
            <div className="lg:col-span-5 space-y-6">
                <Card className="border-none shadow-2xl rounded-[2.5rem] bg-card">
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-xl font-black tracking-tighter">
                                    {selectedDate ? format(selectedDate, "EEEE d 'de' MMMM", { locale: es }) : "Selecciona un día"}
                                </CardTitle>
                                <CardDescription className="font-bold text-primary/60 uppercase tracking-widest text-[10px]">
                                    Detalles del día
                                </CardDescription>
                            </div>
                            {selectedDayBookings.length > 0 && (
                                <Badge className="rounded-full px-3 bg-primary/10 text-primary border-none font-black">
                                    {selectedDayBookings.length} {selectedDayBookings.length === 1 ? 'Reserva' : 'Reservas'}
                                </Badge>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {selectedDayBookings.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 bg-muted/30 rounded-3xl border-2 border-dashed border-muted">
                                <AlertCircle className="h-12 w-12 text-muted-foreground/30" />
                                <div className="space-y-1">
                                    <p className="font-black text-muted-foreground">No hay reservas</p>
                                    <p className="text-xs text-muted-foreground/60 font-medium">Este día se encuentra disponible.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {selectedDayBookings.sort((a, b) => a.slot === 'DAY' ? -1 : 1).map((booking) => (
                                    <div
                                        key={booking.id}
                                        className="group p-5 rounded-3xl bg-muted/40 hover:bg-muted/60 transition-all border border-transparent hover:border-primary/10 relative overflow-hidden"
                                    >
                                        <div className="flex flex-col gap-4 relative z-10">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-2xl bg-white shadow-sm flex items-center justify-center font-black text-primary text-lg">
                                                        {booking.guestName[0].toUpperCase()}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-black text-base tracking-tight leading-none mb-1">
                                                            {booking.guestName}
                                                        </span>
                                                        <div className="flex items-center gap-1.5 text-muted-foreground font-bold text-[10px] uppercase tracking-wider">
                                                            <Clock className="h-3 w-3" />
                                                            {booking.slot === 'DAY' ? 'Turno Día (09-18)' : 'Turno Noche (20-07)'}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <BookingStatusBadge status={booking.status} expiresAt={booking.expiresAt ? new Date(booking.expiresAt) : null} />
                                                    <BookingActions
                                                        bookingId={booking.id}
                                                        currentStatus={booking.status}
                                                        guestName={booking.guestName}
                                                        bookingDate={new Date(booking.bookingDate)}
                                                        slot={booking.slot}
                                                    />
                                                </div>
                                            </div>

                                            {dayConflicts[booking.slot] > 1 && (
                                                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 p-2 rounded-xl">
                                                    <AlertCircle className="h-3.5 w-3.5 text-red-600" />
                                                    <span className="text-[10px] font-black text-red-600 uppercase tracking-tighter">
                                                        Conflicto detected en este turno
                                                    </span>
                                                </div>
                                            )}

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-muted/50">
                                                <a
                                                    href={`https://wa.me/${booking.guestWhatsapp.replace(/\D/g, '')}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 text-sm hover:text-primary transition-colors group/link"
                                                >
                                                    <div className="h-7 w-7 rounded-full bg-white flex items-center justify-center text-primary border border-muted/50 shadow-sm group-hover/link:border-primary/30 group-hover/link:bg-primary/5 transition-all">
                                                        <Phone className="h-3.5 w-3.5" />
                                                    </div>
                                                    <span className="font-bold text-xs truncate select-all">{booking.guestWhatsapp}</span>
                                                </a>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <div className="h-7 w-7 rounded-full bg-white flex items-center justify-center text-primary border border-muted/50 shadow-sm">
                                                        <Mail className="h-3.5 w-3.5" />
                                                    </div>
                                                    <span className="font-bold text-xs truncate select-all">{booking.guestEmail}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Legend */}
                <Card className="border-none bg-primary/5 rounded-[2rem] p-6 shadow-sm">
                    <h4 className="font-black text-xs uppercase tracking-widest text-primary/60 mb-4">Referencias</h4>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="h-4 w-4 rounded-full bg-green-500 shadow-sm" />
                            <span className="text-xs font-bold">Reserva Confirmada / Pagada</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-4 w-4 rounded-full bg-amber-500 shadow-sm" />
                            <span className="text-xs font-bold">Pendiente de Pago</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-4 w-4 rounded-full bg-primary/10 border-2 border-primary/20" />
                            <span className="text-xs font-bold">Día con alguna reservación</span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
