"use client";

import { useState, useTransition } from "react";
import { updateBookingStatus, deleteBooking } from "@/lib/actions";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
    MoreHorizontal,
    CheckCircle2,
    XCircle,
    Clock,
    Trash2,
    Construction,
    Loader2
} from "lucide-react";
import { toast } from "sonner";

export function BookingActions({ bookingId, currentStatus }: { bookingId: string; currentStatus: string }) {
    const [isPending, startTransition] = useTransition();

    const handleUpdate = (status: string) => {
        startTransition(async () => {
            try {
                await updateBookingStatus(bookingId, status);
                toast.success("Estado actualizado correctamente");
            } catch (error) {
                toast.error("Error al actualizar el estado");
            }
        });
    };

    const handleDelete = () => {
        if (!confirm("¿Estás seguro de que deseas eliminar esta reserva?")) return;
        startTransition(async () => {
            try {
                await deleteBooking(bookingId);
                toast.success("Reserva eliminada");
            } catch (error) {
                toast.error("Error al eliminar la reserva");
            }
        });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 p-0 rounded-full" disabled={isPending}>
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-2xl p-2 min-w-[180px]">
                <DropdownMenuLabel className="font-black uppercase tracking-widest text-[9px] text-muted-foreground px-3 py-2">Cambiar Estado</DropdownMenuLabel>

                {currentStatus !== 'RESERVED' && (
                    <DropdownMenuItem onClick={() => handleUpdate('RESERVED')} className="rounded-xl gap-2 font-bold cursor-pointer text-emerald-600 focus:text-emerald-600 focus:bg-emerald-50">
                        <CheckCircle2 size={16} /> Confirmar Seña
                    </DropdownMenuItem>
                )}

                {currentStatus !== 'CONFIRMED' && (
                    <DropdownMenuItem onClick={() => handleUpdate('CONFIRMED')} className="rounded-xl gap-2 font-bold cursor-pointer text-blue-600 focus:text-blue-600 focus:bg-blue-50">
                        <CheckCircle2 size={16} /> Pago Total Realizado
                    </DropdownMenuItem>
                )}

                {(currentStatus !== 'PENDING_PAYMENT' && currentStatus !== 'RESERVED' && currentStatus !== 'CONFIRMED') && (
                    <DropdownMenuItem onClick={() => handleUpdate('PENDING_PAYMENT')} className="rounded-xl gap-2 font-bold cursor-pointer">
                        <Clock size={16} /> Pendiente Pago
                    </DropdownMenuItem>
                )}

                {currentStatus !== 'MAINTENANCE' && (
                    <DropdownMenuItem onClick={() => handleUpdate('MAINTENANCE')} className="rounded-xl gap-2 font-bold cursor-pointer text-purple-600 focus:text-purple-600 focus:bg-purple-50">
                        <Construction size={16} /> Mantenimiento
                    </DropdownMenuItem>
                )}

                <DropdownMenuSeparator className="my-2" />

                <DropdownMenuItem onClick={() => handleUpdate('CANCELLED')} className="rounded-xl gap-2 font-bold cursor-pointer text-amber-600 focus:text-amber-600 focus:bg-amber-50">
                    <XCircle size={16} /> Cancelar Reserva
                </DropdownMenuItem>

                <DropdownMenuItem onClick={handleDelete} className="rounded-xl gap-2 font-bold cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
                    <Trash2 size={16} /> Eliminar
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
