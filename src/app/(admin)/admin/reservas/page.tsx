import { db } from "@/lib/db";
import { bookings } from "@/lib/schema";
import { desc, eq, and, sql, count, isNull, isNotNull, ilike, or, gte } from "drizzle-orm";
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
    Phone,
    ChevronLeft,
    ChevronRight,
    Filter,
    Plus
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
import { MaintenanceDialog } from "@/components/admin/maintenance-dialog";
import { BookingSearch } from "@/components/admin/booking-search";
import { normalizePhone } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 10;

export default async function BookingsPage({
    searchParams
}: {
    searchParams: Promise<{ page?: string; status?: string; search?: string }>
}) {
    const params = await searchParams;
    const currentPage = Number(params.page) || 1;
    const currentStatus = params.status || "ALL";
    const currentSearch = params.search || "";

    // Build query conditions
    const isExpiredFilter = currentStatus === "EXPIRED";
    const conditions: any[] = [];

    // Deleted-at logic:
    // - EXPIRED filter: show only soft-deleted
    // - Search active: show both deleted and non-deleted
    // - Otherwise: show only non-deleted
    if (isExpiredFilter) {
        conditions.push(isNotNull(bookings.deletedAt));
    } else if (!currentSearch) {
        conditions.push(isNull(bookings.deletedAt));
    }
    // When searching, we don't filter by deletedAt — show all matches

    if (currentStatus !== "ALL" && !isExpiredFilter) {
        conditions.push(eq(bookings.status, currentStatus as any));
    }
    if (currentSearch) {
        const normalizedSearch = normalizePhone(currentSearch);
        const searchConditions = [
            ilike(bookings.guestName, `%${currentSearch}%`),
            ilike(bookings.guestEmail, `%${currentSearch}%`),
            ilike(bookings.guestWhatsapp, `%${currentSearch}%`),
        ];

        if (normalizedSearch) {
            searchConditions.push(
                sql`regexp_replace(${bookings.guestWhatsapp}, '[^0-9]', '', 'g') ILIKE ${`%${normalizedSearch}%`}`
            );
        }

        const searchCondition = or(...searchConditions);
        if (searchCondition) {
            conditions.push(searchCondition);
        }
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Fetch total count for pagination
    const [totalRes] = await db.select({ value: count() }).from(bookings).where(whereClause || sql`1=1`);
    const totalBookings = totalRes.value;
    const totalPages = Math.ceil(totalBookings / PAGE_SIZE);

    // Fetch paginated bookings
    const paginatedBookings = await db
        .select()
        .from(bookings)
        .where(whereClause || sql`1=1`)
        .orderBy(desc(bookings.createdAt))
        .limit(PAGE_SIZE)
        .offset((currentPage - 1) * PAGE_SIZE);

    // Conflict detection logic: Find if any of these bookings overlap with others
    const conflictChecks = await Promise.all(
        paginatedBookings.map(async (b) => {
            const overlaps = await db.select({ count: count() })
                .from(bookings)
                .where(
                    and(
                        eq(bookings.bookingDate, b.bookingDate),
                        eq(bookings.slot, b.slot),
                        isNull(bookings.deletedAt),
                        or(
                            or(eq(bookings.status, 'CONFIRMED'),
                                or(eq(bookings.status, 'RESERVED'),
                                    eq(bookings.status, 'MAINTENANCE'))),
                            and(
                                eq(bookings.status, 'PENDING_PAYMENT'),
                                gte(bookings.expiresAt, new Date())
                            )
                        )
                    )
                );
            return { id: b.id, isConflict: overlaps[0].count > 1 };
        })
    );

    const conflictMap = new Map(conflictChecks.map(c => [c.id, c.isConflict]));

    const statuses = [
        { label: "Todas", value: "ALL" },
        { label: "Pendientes", value: "PENDING_PAYMENT" },
        { label: "Reservadas", value: "RESERVED" },
        { label: "Pagadas", value: "CONFIRMED" },
        { label: "Completadas", value: "COMPLETED" },
        { label: "Canceladas", value: "CANCELLED" },
        { label: "Mantenimiento", value: "MAINTENANCE" },
        { label: "Expiradas", value: "EXPIRED" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4 sm:px-0">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tighter">Gestión de Reservas</h1>
                    <p className="text-muted-foreground font-medium text-sm sm:text-base">Gestiona y filtra todas las solicitudes de la quinta.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                    <BookingSearch />
                    <div className="flex items-center gap-3">
                        <MaintenanceDialog />
                        <Button
                            asChild
                            variant="outline"
                            className="h-14 px-6 rounded-2xl font-black text-xs sm:text-sm"
                        >
                            <Link href="/admin/reservas/export">
                                Exportar CSV
                            </Link>
                        </Button>
                        <Button asChild className="h-14 px-8 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 flex-1 sm:flex-none">
                            <Link href="/admin/reservas/nuevo">
                                <Plus className="mr-2 h-5 w-5" /> Nueva Reserva
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Filters Bar */}
                <div className="flex flex-wrap items-center gap-2 bg-muted/30 p-2 rounded-2xl sm:rounded-3xl border w-full lg:w-fit">
                    {statuses.map((s) => (
                        <Button
                            key={s.value}
                            variant={currentStatus === s.value ? "default" : "ghost"}
                            className={cn(
                                "h-10 px-6 rounded-2xl font-bold text-xs transition-all",
                                currentStatus === s.value ? "shadow-lg shadow-primary/20 scale-105" : "hover:bg-muted"
                            )}
                            asChild
                        >
                            <Link href={`?status=${s.value}&page=1${currentSearch ? `&search=${currentSearch}` : ""}`}>
                                {s.label}
                            </Link>
                        </Button>
                    ))}
                </div>
            </div>

            <div className="bg-card rounded-[2.5rem] border-none shadow-2xl shadow-muted/20 overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow className="hover:bg-transparent border-b">
                            <TableHead className="font-black uppercase tracking-widest text-[10px] py-8 px-8">Cliente</TableHead>
                            <TableHead className="font-black uppercase tracking-widest text-[10px] py-8">Fecha y Turno</TableHead>
                            <TableHead className="font-black uppercase tracking-widest text-[10px] py-8">Estado</TableHead>
                            <TableHead className="font-black uppercase tracking-widest text-[10px] py-8 text-center">Pagado</TableHead>
                            <TableHead className="font-black uppercase tracking-widest text-[10px] py-8 text-right px-8">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedBookings.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-48 text-center text-muted-foreground font-medium">
                                    <div className="flex flex-col items-center gap-3">
                                        <Filter className="h-10 w-10 opacity-20" />
                                        <p>No se encontraron reservas con estos filtros.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedBookings.map((booking) => {
                                const bookingIsDeleted = booking.deletedAt !== null;
                                return (
                                    <TableRow key={booking.id} className={cn("hover:bg-muted/10 border-b group", bookingIsDeleted && "opacity-50")}>
                                        <TableCell className="py-6 px-8">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{booking.guestName}</span>
                                                    {conflictMap.get(booking.id) && (
                                                        <span className="bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full animate-pulse shadow-sm h-fit">
                                                            CONFLICTO
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex flex-wrap items-center gap-4 mt-2">
                                                    <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-bold">
                                                        <Phone className="h-3.5 w-3.5" /> {booking.guestWhatsapp}
                                                    </span>
                                                    <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-bold italic">
                                                        <Mail className="h-3.5 w-3.5" /> {booking.guestEmail || "Sin email"}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-6">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-base capitalize">
                                                    {format(booking.bookingDate, "EEEE d 'de' MMMM", { locale: es })}
                                                </span>
                                                <span className="text-[11px] font-black text-primary/70 uppercase tracking-widest mt-1">
                                                    {booking.slot === 'DAY'
                                                        ? 'Turno Día (09:00 - 18:00)'
                                                        : 'Turno Noche (20:00 - 07:00)'
                                                    }
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-6">
                                            <BookingStatusBadge status={booking.status} expiresAt={booking.expiresAt} isDeleted={bookingIsDeleted} />
                                        </TableCell>
                                        <TableCell className="py-6 font-black text-lg text-center text-emerald-600">
                                            {(() => {
                                                const total = Number(booking.totalPrice);
                                                if (booking.status === 'CONFIRMED' || booking.status === 'COMPLETED') {
                                                    return formatCurrency(total);
                                                }
                                                if (booking.status === 'RESERVED') {
                                                    return (
                                                        <div className="flex flex-col items-center">
                                                            <span>{formatCurrency(total / 2)}</span>
                                                            <span className="text-[10px] text-muted-foreground uppercase opacity-50">Seña (50%)</span>
                                                        </div>
                                                    );
                                                }
                                                return formatCurrency(0);
                                            })()}
                                        </TableCell>
                                        <TableCell className="py-6 px-8 text-right">
                                            <BookingActions
                                                bookingId={booking.id}
                                                currentStatus={booking.status}
                                                guestName={booking.guestName}
                                                bookingDate={booking.bookingDate}
                                                slot={booking.slot}
                                                isDeleted={bookingIsDeleted}
                                            />
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="p-8 bg-muted/10 flex items-center justify-between border-t">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                            Mostrando {paginatedBookings.length} de {totalBookings} reservas
                        </p>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-10 w-10 rounded-xl"
                                disabled={currentPage <= 1}
                                asChild={currentPage > 1}
                            >
                                {currentPage > 1 ? (
                                    <Link href={`?status=${currentStatus}&page=${currentPage - 1}${currentSearch ? `&search=${currentSearch}` : ""}`}>
                                        <ChevronLeft className="h-5 w-5" />
                                    </Link>
                                ) : (
                                    <ChevronLeft className="h-5 w-5" />
                                )}
                            </Button>

                            <div className="flex items-center gap-1">
                                {Array.from({ length: totalPages }).map((_, i) => (
                                    <Button
                                        key={i}
                                        variant={currentPage === i + 1 ? "default" : "ghost"}
                                        className={cn(
                                            "h-10 w-10 rounded-xl font-bold transition-all",
                                            currentPage === i + 1 ? "shadow-lg shadow-primary/20 scale-110" : "text-muted-foreground"
                                        )}
                                        asChild={currentPage !== i + 1}
                                    >
                                        {currentPage !== i + 1 ? (
                                            <Link href={`?status=${currentStatus}&page=${i + 1}${currentSearch ? `&search=${currentSearch}` : ""}`}>
                                                {i + 1}
                                            </Link>
                                        ) : (
                                            <span>{i + 1}</span>
                                        )}
                                    </Button>
                                ))}
                            </div>

                            <Button
                                variant="outline"
                                size="icon"
                                className="h-10 w-10 rounded-xl"
                                disabled={currentPage >= totalPages}
                                asChild={currentPage < totalPages}
                            >
                                {currentPage < totalPages ? (
                                    <Link href={`?status=${currentStatus}&page=${currentPage + 1}${currentSearch ? `&search=${currentSearch}` : ""}`}>
                                        <ChevronRight className="h-5 w-5" />
                                    </Link>
                                ) : (
                                    <ChevronRight className="h-5 w-5" />
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
