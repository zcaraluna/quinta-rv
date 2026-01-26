import { db } from "@/lib/db";
import { bookings } from "@/lib/schema";
import { desc } from "drizzle-orm";
import {
    Calendar,
    User,
    MessageSquare,
    CheckCircle2,
    Clock,
    XCircle,
    AlertTriangle,
    MoreHorizontal,
    Mail,
    Phone
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { formatCurrency } from "@/lib/utils";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { BookingStatusBadge } from "@/components/admin/status-badge";
import { BookingActions } from "@/components/admin/booking-actions";

export default async function BookingsPage() {
    const allBookings = await db.select().from(bookings).orderBy(desc(bookings.createdAt));

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter">Gestión de Reservas</h1>
                    <p className="text-muted-foreground font-medium">Lista completa de todas las solicitudes y estados.</p>
                </div>
            </div>

            <div className="bg-card rounded-[2rem] border-none shadow-xl shadow-muted/20 overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow className="hover:bg-transparent border-b">
                            <TableHead className="font-black uppercase tracking-widest text-[10px] py-6 px-6">Cliente</TableHead>
                            <TableHead className="font-black uppercase tracking-widest text-[10px] py-6">Fecha y Turno</TableHead>
                            <TableHead className="font-black uppercase tracking-widest text-[10px] py-6">Estado</TableHead>
                            <TableHead className="font-black uppercase tracking-widest text-[10px] py-6">Total</TableHead>
                            <TableHead className="font-black uppercase tracking-widest text-[10px] py-6 text-right px-6">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {allBookings.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground font-medium">
                                    No hay reservas registradas.
                                </TableCell>
                            </TableRow>
                        ) : (
                            allBookings.map((booking) => (
                                <TableRow key={booking.id} className="hover:bg-muted/10 border-b">
                                    <TableCell className="py-4 px-6">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-foreground">{booking.guestName}</span>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium">
                                                    <Phone className="h-3 w-3" /> {booking.guestWhatsapp}
                                                </span>
                                                <span className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium">
                                                    <Mail className="h-3 w-3" /> {booking.guestEmail}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold capitalize">
                                                {format(booking.bookingDate, "EEEE d 'de' MMMM", { locale: es })}
                                            </span>
                                            <span className="text-[11px] font-black text-primary uppercase tracking-tighter">
                                                {booking.slot === 'DAY' ? 'Turno Día (09:00 - 19:00)' : 'Turno Noche (21:00 - 07:00)'}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4">
                                        <BookingStatusBadge status={booking.status} expiresAt={booking.expiresAt} />
                                    </TableCell>
                                    <TableCell className="py-4 font-black">
                                        {formatCurrency(booking.totalPrice)}
                                    </TableCell>
                                    <TableCell className="py-4 px-6 text-right">
                                        <BookingActions bookingId={booking.id} currentStatus={booking.status} />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
