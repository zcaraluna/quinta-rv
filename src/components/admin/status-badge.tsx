"use client";

import { cn } from "@/lib/utils";
import { Clock, CheckCircle2, XCircle, AlertTriangle, Construction } from "lucide-react";

export function BookingStatusBadge({ status, expiresAt }: { status: string; expiresAt: Date | null }) {
    const isExpired = status === "PENDING_PAYMENT" && expiresAt && new Date() > expiresAt;

    const config: Record<string, { label: string; icon: any; className: string }> = {
        PENDING_PAYMENT: {
            label: isExpired ? "Expirada" : "Pago Pendiente",
            icon: isExpired ? XCircle : Clock,
            className: isExpired ? "bg-destructive/10 text-destructive border-destructive/20" : "bg-amber-500/10 text-amber-600 border-amber-500/20",
        },
        RESERVED: {
            label: "Reservado",
            icon: CheckCircle2,
            className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
        },
        CONFIRMED: {
            label: "Pagado",
            icon: CheckCircle2,
            className: "bg-blue-500/10 text-blue-600 border-blue-500/20",
        },
        COMPLETED: {
            label: "Completada",
            icon: CheckCircle2,
            className: "bg-slate-500/10 text-slate-600 border-slate-500/20",
        },
        CANCELLED: {
            label: "Cancelada",
            icon: XCircle,
            className: "bg-muted text-muted-foreground border-muted-foreground/20",
        },
        MAINTENANCE: {
            label: "Mantenimiento",
            icon: Construction,
            className: "bg-purple-500/10 text-purple-600 border-purple-500/20",
        },
    };

    const current = config[status] || { label: status, icon: AlertTriangle, className: "bg-muted text-muted-foreground" };
    const Icon = current.icon;

    return (
        <div className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
            current.className
        )}>
            <Icon className="h-3 w-3" />
            {current.label}
        </div>
    );
}
