"use client";

import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function WhatsappFloat() {
    const waNumber = "595983145432";
    const waMessage = "Hola! Quisiera más información sobre la Quinta RV.";
    const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;

    return (
        <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
                "fixed bottom-8 right-8 z-50",
                "hidden lg:flex items-center gap-3",
                "bg-[#25D366] text-white px-6 py-4 rounded-full",
                "shadow-2xl shadow-green-500/20",
                "transition-all duration-300 hover:scale-110 active:scale-95 group"
            )}
        >
            <div className="flex flex-col items-end">
                <span className="text-[10px] font-black uppercase tracking-widest leading-none opacity-80">Consultas</span>
                <span className="text-sm font-black whitespace-nowrap">WhatsApp Directo</span>
            </div>
            <MessageCircle className="h-7 w-7 fill-white/20" />

            {/* Notification Pulse */}
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-white/40"></span>
            </span>
        </a>
    );
}
