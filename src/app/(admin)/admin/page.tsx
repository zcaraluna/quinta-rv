import { db } from "@/lib/db";
import { bookings } from "@/lib/schema";
import { sql, count, sum, eq, gte, lte, and, or, isNull, desc, asc } from "drizzle-orm";
import {
    CalendarRange,
    CreditCard,
    TrendingUp,
    Users,
    Clock,
    CheckCircle2,
    XCircle,
    Phone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { startOfMonth, endOfMonth, format } from "date-fns";
import { es } from "date-fns/locale";

import { cleanupExpiredBookings } from "@/lib/actions";

export default async function AdminDashboard() {
    await cleanupExpiredBookings();
    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);

    // Fetch summary stats (Excluding MAINTENANCE)
    const [totalBookings] = await db.select({ value: count() })
        .from(bookings)
        .where(and(isNull(bookings.deletedAt), sql`${bookings.status} != 'MAINTENANCE'`));

    const [pendingPayments] = await db.select({ value: count() })
        .from(bookings)
        .where(and(eq(bookings.status, "PENDING_PAYMENT"), isNull(bookings.deletedAt)));

    const [confirmedBookings] = await db.select({ value: count() })
        .from(bookings)
        .where(and(
            or(eq(bookings.status, "CONFIRMED"), eq(bookings.status, "RESERVED")),
            isNull(bookings.deletedAt)
        ));

    // Monthly Revenue (Actual collection: 100% for Confirmed/Completed, 50% for Reserved)
    const [revenue] = await db.select({
        value: sql<string>`sum(
            CASE 
                WHEN ${bookings.status} = 'RESERVED' THEN CAST(${bookings.totalPrice} AS NUMERIC) / 2
                WHEN ${bookings.status} IN ('CONFIRMED', 'COMPLETED') THEN CAST(${bookings.totalPrice} AS NUMERIC)
                ELSE 0 
            END
        )`
    })
        .from(bookings)
        .where(and(
            or(
                eq(bookings.status, "CONFIRMED"),
                or(eq(bookings.status, "RESERVED"), eq(bookings.status, "COMPLETED"))
            ),
            gte(bookings.bookingDate, thisMonthStart),
            lte(bookings.bookingDate, thisMonthEnd),
            isNull(bookings.deletedAt)
        ));

    const revenueValue = parseFloat(revenue.value || "0");

    // Fetch monthly breakdown (Excluding MAINTENANCE)
    const monthlyStats = await db.select({
        slot: bookings.slot,
        status: bookings.status,
        count: count()
    })
        .from(bookings)
        .where(and(
            gte(bookings.bookingDate, thisMonthStart),
            lte(bookings.bookingDate, thisMonthEnd),
            isNull(bookings.deletedAt),
            sql`${bookings.status} != 'MAINTENANCE'`
        ))
        .groupBy(bookings.slot, bookings.status);

    // Monthly Statistics Card calculations...
    const monthTotal = monthlyStats.reduce((acc, s) => acc + s.count, 0);
    const monthDay = monthlyStats.reduce((acc, s) => s.slot === 'DAY' ? acc + s.count : acc, 0);
    const monthNight = monthlyStats.reduce((acc, s) => s.slot === 'NIGHT' ? acc + s.count : acc, 0);
    const monthCompleted = monthlyStats.reduce((acc, s) => s.status === 'COMPLETED' ? acc + s.count : acc, 0);
    const monthIncomplete = monthTotal - monthCompleted;

    // Fetch today's bookings (Excluding MAINTENANCE and DELETED)
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    const todayBookings = await db.select()
        .from(bookings)
        .where(and(
            isNull(bookings.deletedAt),
            sql`${bookings.status} != 'MAINTENANCE'`,
            gte(bookings.bookingDate, todayStart),
            lte(bookings.bookingDate, todayEnd)
        ))
        .orderBy(asc(bookings.slot));

    // Filter out expired bookings from today's list
    const activeTodayBookings = todayBookings.filter(b => {
        if (b.status === "PENDING_PAYMENT" && b.expiresAt && now > new Date(b.expiresAt)) {
            return false;
        }
        return true;
    });

    // Fetch recent bookings (Excluding MAINTENANCE)
    const recentBookings = await db.select()
        // ... (rest of the query remains same)
        .from(bookings)
        .where(and(
            isNull(bookings.deletedAt),
            sql`${bookings.status} != 'MAINTENANCE'`
        ))
        .orderBy(desc(bookings.createdAt))
        .limit(5);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black tracking-tighter">Resumen General</h1>
                <p className="text-muted-foreground font-medium">Estado actual de las reservas y rendimiento comercial.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <StatCard
                    title="Total Reservas"
                    value={totalBookings.value.toString()}
                    icon={<CalendarRange className="text-primary" />}
                    description="Excluyendo mantenimiento"
                />
                <StatCard
                    title="Pendientes Pago"
                    value={pendingPayments.value.toString()}
                    icon={<Clock className="text-amber-500" />}
                    description="Esperando comprobante"
                />
                <StatCard
                    title="Ventas del Mes"
                    value={revenueValue === 0 ? "G. 0" : formatCurrency(revenueValue)}
                    icon={<CreditCard className="text-emerald-500" />}
                    description="Monto total cobrado"
                />
                <StatCard
                    title="Confirmadas"
                    value={confirmedBookings.value.toString()}
                    icon={<CheckCircle2 className="text-blue-500" />}
                    description="Listas para disfrutar"
                />
            </div>

            {/* Today's Reservations Card */}
            <Card className="rounded-[2rem] border-none shadow-2xl bg-primary/5 overflow-hidden">
                <CardHeader className="border-b border-primary/10 bg-white/50 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <CardTitle className="font-black tracking-tight flex items-center gap-2 text-primary">
                                <CalendarRange className="h-5 w-5" />
                                Reservas de Hoy ({format(now, "d 'de' MMMM", { locale: es })})
                            </CardTitle>
                            <CardDescription className="font-medium">Huéspedes que ingresan en el transcurso del día.</CardDescription>
                        </div>
                        {activeTodayBookings.length > 0 && (
                            <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-black text-sm">
                                {activeTodayBookings.length}
                            </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x border-b md:border-b-0">
                        {activeTodayBookings.length === 0 ? (
                            <div className="col-span-full py-12 text-center text-muted-foreground font-medium italic">
                                No hay reservas confirmadas para hoy.
                            </div>
                        ) : (
                            activeTodayBookings.map((booking) => (
                                <div key={booking.id} className="p-6 hover:bg-white/40 transition-colors flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-2xl bg-white shadow-sm flex items-center justify-center font-black text-primary border border-primary/10 text-lg">
                                                {booking.guestName[0].toUpperCase()}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-black text-sm tracking-tight">{booking.guestName}</span>
                                                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                                    {booking.slot === 'DAY' ? (
                                                        <>
                                                            <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                                            Turno Día (09-18)
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                                            Turno Noche (20-07)
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className={cn(
                                            "text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter border",
                                            booking.status === 'CONFIRMED' || booking.status === 'RESERVED' ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20" :
                                                booking.status === 'PENDING_PAYMENT' ? "bg-amber-500/10 text-amber-700 border-amber-500/20" :
                                                    "bg-muted text-muted-foreground"
                                        )}>
                                            {booking.status === 'PENDING_PAYMENT' ? 'Pago Pendiente' :
                                                booking.status === 'RESERVED' ? 'Reservado' :
                                                    booking.status === 'CONFIRMED' ? 'Pagado' : booking.status}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-muted/50">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">WhatsApp</span>
                                            <span className="text-xs font-black">{booking.guestWhatsapp}</span>
                                        </div>
                                        <a
                                            href={`https://wa.me/${booking.guestWhatsapp.replace(/\D/g, '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="h-10 w-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 hover:scale-110 active:scale-95 transition-all"
                                        >
                                            <Phone className="h-5 w-5 fill-current" />
                                        </a>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activity */}
                <Card className="rounded-[2rem] border-none shadow-xl shadow-muted/20 overflow-hidden flex flex-col">
                    <CardHeader className="border-b bg-muted/30">
                        <CardTitle className="font-black tracking-tight flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-primary" />
                            Actividad Reciente
                        </CardTitle>
                        <CardDescription>Ultimas reservas realizadas en el sistema (sin mantenimientos).</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 flex-1">
                        <div className="divide-y h-full">
                            {recentBookings.length === 0 ? (
                                <div className="py-24 text-center text-muted-foreground font-medium italic">
                                    No hay actividad reciente para mostrar.
                                </div>
                            ) : (
                                recentBookings.map((booking) => (
                                    <div key={booking.id} className="p-6 flex items-center justify-between hover:bg-muted/30 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                                                {booking.guestName[0].toUpperCase()}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm">{booking.guestName}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {booking.isCouplePromo === "true" ? "Promo Pareja" : "General"} • {booking.slot === 'DAY' ? 'Día' : 'Noche'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <span className="text-sm font-black">{formatCurrency(Number(booking.totalPrice))}</span>
                                            <span className={cn(
                                                "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest",
                                                booking.status === 'CONFIRMED' ? "bg-emerald-100 text-emerald-700" :
                                                    booking.status === 'PENDING_PAYMENT' ? "bg-amber-100 text-amber-700" :
                                                        "bg-muted text-muted-foreground"
                                            )}>
                                                {booking.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Monthly Statistics Card */}
                <Card className="rounded-[2rem] border-none shadow-xl shadow-muted/20 overflow-hidden">
                    <CardHeader className="border-b bg-primary/5">
                        <CardTitle className="font-black tracking-tight flex items-center gap-2">
                            <CalendarRange className="h-5 w-5 text-primary" />
                            Reservas este Mes
                        </CardTitle>
                        <CardDescription>Resumen detallado del periodo actual.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                        <div className="flex flex-col items-center justify-center py-6 bg-muted/20 rounded-[2.5rem] border border-dashed">
                            <span className="text-6xl font-black tracking-tighter text-primary">{monthTotal}</span>
                            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground mt-2">Total Reservas</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-6 rounded-[2rem] bg-background border shadow-sm space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Por Turno</p>
                                <div className="flex justify-between items-end">
                                    <div className="flex flex-col">
                                        <span className="text-2xl font-black">{monthDay}</span>
                                        <span className="text-[10px] font-bold text-primary italic">Día</span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-2xl font-black">{monthNight}</span>
                                        <span className="text-[10px] font-bold text-blue-600 italic">Noche</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 rounded-[2rem] bg-background border shadow-sm space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Estado</p>
                                <div className="flex justify-between items-end">
                                    <div className="flex flex-col">
                                        <span className="text-2xl font-black text-emerald-600">{monthCompleted}</span>
                                        <span className="text-[10px] font-bold italic">Hechas</span>
                                    </div>
                                    <div className="flex flex-col items-end text-amber-600">
                                        <span className="text-2xl font-black">{monthIncomplete}</span>
                                        <span className="text-[10px] font-bold italic">Pendientes</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-primary/5 rounded-2xl flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                            <p className="text-[11px] font-bold text-primary/80 uppercase tracking-widest">
                                Reporte actualizado en tiempo real
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, description }: { title: string; value: string; icon: React.ReactNode; description: string }) {
    return (
        <Card className="rounded-[2rem] border-none shadow-xl shadow-muted/20 hover:scale-[1.02] transition-transform duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">{title}</CardTitle>
                <div className="p-2 rounded-2xl bg-muted group-hover:bg-primary/10 transition-colors">
                    {icon}
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-black tracking-tighter">{value}</div>
                <p className="text-xs text-muted-foreground mt-1 font-medium">{description}</p>
            </CardContent>
        </Card>
    );
}
