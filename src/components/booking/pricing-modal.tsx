"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { HelpCircle, Clock, Users, Star } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface PricingModalProps {
    pricing?: any
}

export function PricingModal({ pricing }: PricingModalProps) {
    if (!pricing) return null;
    const PRICING = pricing;
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 text-xs h-8">
                    <HelpCircle className="h-3.5 w-3.5" />
                    Ver Tarifas
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black">Resumen de Tarifas</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <section className="space-y-3">
                        <h3 className="flex items-center gap-2 font-bold text-primary">
                            <Users className="h-4 w-4" />
                            Tarifas Generales (hasta 30 pers.)
                        </h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="p-2 bg-muted rounded border flex justify-between">
                                <span className="text-muted-foreground">L-V Día</span>
                                <span className="font-bold">{formatCurrency(PRICING.GENERAL.WEEKDAY.DAY)}</span>
                            </div>
                            <div className="p-2 bg-muted rounded border flex justify-between">
                                <span className="text-muted-foreground">L-V Noche</span>
                                <span className="font-bold">{formatCurrency(PRICING.GENERAL.WEEKDAY.NIGHT)}</span>
                            </div>
                            <div className="p-2 bg-muted rounded border flex justify-between">
                                <span className="text-muted-foreground">Sáb Día</span>
                                <span className="font-bold">{formatCurrency(PRICING.GENERAL.SATURDAY.DAY)}</span>
                            </div>
                            <div className="p-2 bg-muted rounded border flex justify-between">
                                <span className="text-muted-foreground">Sáb Noche</span>
                                <span className="font-bold">{formatCurrency(PRICING.GENERAL.SATURDAY.NIGHT)}</span>
                            </div>
                            <div className="p-2 bg-muted rounded border flex justify-between">
                                <span className="text-muted-foreground">Dom Día</span>
                                <span className="font-bold">{formatCurrency(PRICING.GENERAL.SUNDAY.DAY)}</span>
                            </div>
                            <div className="p-2 bg-muted rounded border flex justify-between">
                                <span className="text-muted-foreground">Dom Noche</span>
                                <span className="font-bold">{formatCurrency(PRICING.GENERAL.SUNDAY.NIGHT)}</span>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-3">
                        <h3 className="flex items-center gap-2 font-bold text-amber-600">
                            <Star className="h-4 w-4 fill-amber-600" />
                            Promos Pareja
                        </h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="p-2 bg-amber-50 rounded border border-amber-100 flex justify-between">
                                <span className="text-amber-800">L-V Día/Noc</span>
                                <span className="font-bold text-amber-900">{formatCurrency(PRICING.COUPLE.WEEKDAY.DAY)}</span>
                            </div>
                            <div className="p-2 bg-amber-50 rounded border border-amber-100 flex justify-between">
                                <span className="text-amber-800">Sáb Día</span>
                                <span className="font-bold text-amber-900">{formatCurrency(PRICING.COUPLE.SATURDAY.DAY)}</span>
                            </div>
                            <div className="p-2 bg-amber-50 rounded border border-amber-100 flex justify-between">
                                <span className="text-amber-800">Sáb Noche</span>
                                <span className="font-bold text-amber-900">{formatCurrency(PRICING.COUPLE.SATURDAY.NIGHT)}</span>
                            </div>
                            <div className="p-2 bg-amber-50 rounded border border-amber-100 flex justify-between">
                                <span className="text-amber-800">Dom Día</span>
                                <span className="font-bold text-amber-900">{formatCurrency(PRICING.COUPLE.SUNDAY.DAY)}</span>
                            </div>
                            <div className="p-2 bg-amber-50 rounded border border-amber-100 flex justify-between">
                                <span className="text-amber-800">Dom Noche</span>
                                <span className="font-bold text-amber-900">{formatCurrency(PRICING.COUPLE.SUNDAY.NIGHT)}</span>
                            </div>
                        </div>
                    </section>

                    <div className="text-[10px] text-muted-foreground bg-muted/30 p-2 rounded">
                        * Horarios: Día (09:00 - 18:00) | Noche (20:00 - 07:00).
                        Promo Parejas: Día (10:00 - 19:00) | Noche (20:00 - 09:00).
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
