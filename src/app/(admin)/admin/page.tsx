import { db } from "@/lib/db";
import { bookings } from "@/lib/schema";
import { sql, count, sum, eq, gte, and, isNull, desc } from "drizzle-orm";
import {
    CalendarRange,
    CreditCard,
    TrendingUp,
    Users,
    Clock,
    CheckCircle2,
    XCircle,
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
import { startOfMonth } from "date-fns";

export default async function AdminDashboard() {
    // Fetch summary stats
    const [totalBookings] = await db.select({ value: count() }).from(bookings).where(isNull(bookings.deletedAt));
    const [pendingPayments] = await db.select({ value: count() }).from(bookings).where(and(eq(bookings.status, "PENDING_PAYMENT"), isNull(bookings.deletedAt)));
    const [confirmedBookings] = await db.select({ value: count() }).from(bookings).where(and(eq(bookings.status, "CONFIRMED"), isNull(bookings.deletedAt)));

    const thisMonthStart = startOfMonth(new Date());

    // Use sql for sum to be more robust
    const [revenue] = await db.select({
        value: sql<string>`sum(${bookings.totalPrice})`
    })
        .from(bookings)
        .where(and(
            eq(bookings.status, "CONFIRMED"),
            gte(bookings.createdAt, thisMonthStart),
            isNull(bookings.deletedAt)
        ));

    const revenueValue = parseFloat(revenue.value || "0");

    // Fetch recent bookings
    const recentBookings = await db.select()
        .from(bookings)
        .where(isNull(bookings.deletedAt))
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
                    description="Historial acumulado"
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
                    description="Solo confirmadas"
                />
                <StatCard
                    title="Confirmadas"
                    value={confirmedBookings.value.toString()}
                    icon={<CheckCircle2 className="text-blue-500" />}
                    description="Listas para disfrutar"
                />
            </div>

            <div className="grid grid-cols-1 gap-8">
                <Card className="rounded-[2rem] border-none shadow-xl shadow-muted/20 overflow-hidden">
                    <CardHeader className="border-b bg-muted/30">
                        <CardTitle className="font-black tracking-tight flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-primary" />
                            Actividad Reciente
                        </CardTitle>
                        <CardDescription>Ultimas reservas realizadas en el sistema.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y">
                            {recentBookings.length === 0 ? (
                                <div className="py-12 text-center text-muted-foreground font-medium italic">
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
