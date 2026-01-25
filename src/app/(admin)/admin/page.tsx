import { db } from "@/lib/db";
import { bookings } from "@/lib/schema";
import { sql, count, sum, eq, gte } from "drizzle-orm";
import {
    Users,
    CalendarRange,
    CreditCard,
    TrendingUp,
    Clock,
    CheckCircle2,
    XCircle
} from "lucide-react";
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
    const [totalBookings] = await db.select({ value: count() }).from(bookings);
    const [pendingPayments] = await db.select({ value: count() }).from(bookings).where(eq(bookings.status, "PENDING_PAYMENT"));
    const [confirmedBookings] = await db.select({ value: count() }).from(bookings).where(eq(bookings.status, "CONFIRMED"));

    const thisMonthStart = startOfMonth(new Date());
    const [revenue] = await db.select({ value: sum(bookings.totalPrice) })
        .from(bookings)
        .where(and(eq(bookings.status, "CONFIRMED"), gte(bookings.createdAt, thisMonthStart)));

    const revenueValue = parseFloat(revenue.value || "0");

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black tracking-tighter">Resumen General</h1>
                <p className="text-muted-foreground font-medium">Estado actual de las reservas y rendimiento comercial.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                    value={formatCurrency(revenueValue)}
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="rounded-[2rem] border-none shadow-xl shadow-muted/20">
                    <CardHeader>
                        <CardTitle className="font-black tracking-tight flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-primary" />
                            Actividad Reciente
                        </CardTitle>
                        <CardDescription>Ultimas reservas realizadas en el sistema.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground font-medium py-10 text-center italic">
                            Pronto: Gráfico de reservas y listado detallado aquí.
                        </p>
                    </CardContent>
                </Card>

                <Card className="rounded-[2rem] border-none shadow-xl shadow-muted/20">
                    <CardHeader>
                        <CardTitle className="font-black tracking-tight flex items-center gap-2">
                            <Users className="h-5 w-5 text-primary" />
                            Visitantes
                        </CardTitle>
                        <CardDescription>Tráfico y engagement de los clientes.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 flex flex-col items-center">
                                <span className="text-3xl font-black tracking-tighter text-primary">Pet Friendly</span>
                                <span className="text-xs font-bold uppercase tracking-widest text-primary/60 mt-2 text-center leading-tight">Mascotas Bienvenidas</span>
                            </div>
                            <div className="p-6 rounded-3xl bg-muted/30 border flex flex-col items-center">
                                <span className="text-3xl font-black tracking-tighter">Parejas</span>
                                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-2 text-center leading-tight">Promo Parejas</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

import { and } from "drizzle-orm";

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
