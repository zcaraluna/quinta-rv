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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
                <Button variant="outline" size="sm" className="gap-2 text-xs h-8 rounded-xl font-bold border-primary/20 hover:border-primary/40 transition-all">
                    <HelpCircle className="h-3.5 w-3.5 text-primary" />
                    Ver Tarifas
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto rounded-[2rem] border-none p-8 text-foreground">
                <DialogHeader className="mb-4">
                    <DialogTitle className="text-3xl font-black tracking-tighter text-center">Tarifas y Turnos</DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="day" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 rounded-2xl h-12 bg-muted/50 p-1 mb-6">
                        <TabsTrigger value="day" className="rounded-xl font-black text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-300">Turno Día</TabsTrigger>
                        <TabsTrigger value="night" className="rounded-xl font-black text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-300">Turno Noche</TabsTrigger>
                    </TabsList>

                    <TabsContent value="day" className="space-y-6 animate-in fade-in duration-500">
                        <div className="space-y-4">
                            <h4 className="text-xs font-black uppercase tracking-widest text-primary/60 border-b pb-2 flex items-center gap-2">
                                <Users className="h-3 w-3" /> Tarifas Generales (hasta 30 pers.)
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-4 rounded-2xl bg-muted/30 border border-muted/50 flex flex-col gap-1">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Lunes a Viernes</span>
                                    <span className="font-black text-primary text-xl">{formatCurrency(PRICING.GENERAL.WEEKDAY.DAY)}</span>
                                </div>
                                <div className="p-4 rounded-2xl bg-muted/30 border border-muted/50 flex flex-col gap-1">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Sábados</span>
                                    <span className="font-black text-primary text-xl">{formatCurrency(PRICING.GENERAL.SATURDAY.DAY)}</span>
                                </div>
                                <div className="p-4 rounded-2xl bg-muted/30 border border-muted/50 flex flex-col gap-1">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Domingos</span>
                                    <span className="font-black text-primary text-xl">{formatCurrency(PRICING.GENERAL.SUNDAY.DAY)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-xs font-black uppercase tracking-widest text-amber-600/60 border-b border-amber-500/10 pb-2 flex items-center gap-2">
                                <Star className="h-3 w-3" /> Promociones Pareja
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex flex-col gap-1">
                                    <span className="text-[10px] font-bold text-amber-800/60 uppercase">Lunes a Viernes</span>
                                    <span className="font-black text-amber-600 text-xl">{formatCurrency(PRICING.COUPLE.WEEKDAY.DAY)}</span>
                                </div>
                                <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex flex-col gap-1">
                                    <span className="text-[10px] font-bold text-amber-800/60 uppercase">Sábados</span>
                                    <span className="font-black text-amber-600 text-xl">{formatCurrency(PRICING.COUPLE.SATURDAY.DAY)}</span>
                                </div>
                                <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex flex-col gap-1">
                                    <span className="text-[10px] font-bold text-amber-800/60 uppercase">Domingos</span>
                                    <span className="font-black text-amber-600 text-xl">{formatCurrency(PRICING.COUPLE.SUNDAY.DAY)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-muted/30 border border-muted/50 text-center">
                            <p className="text-[11px] font-bold text-muted-foreground flex items-center justify-center gap-2">
                                <Clock className="h-4 w-4" /> Horario: 09:00 - 18:00 hs.
                            </p>
                        </div>
                    </TabsContent>

                    <TabsContent value="night" className="space-y-6 animate-in fade-in duration-500">
                        <div className="space-y-4">
                            <h4 className="text-xs font-black uppercase tracking-widest text-primary/60 border-b pb-2 flex items-center gap-2">
                                <Users className="h-3 w-3" /> Tarifas Generales (hasta 30 pers.)
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-4 rounded-2xl bg-muted/30 border border-muted/50 flex flex-col gap-1">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Lunes a Viernes</span>
                                    <span className="font-black text-primary text-xl">{formatCurrency(PRICING.GENERAL.WEEKDAY.NIGHT)}</span>
                                </div>
                                <div className="p-4 rounded-2xl bg-muted/30 border border-muted/50 flex flex-col gap-1">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Sábados</span>
                                    <span className="font-black text-primary text-xl">{formatCurrency(PRICING.GENERAL.SATURDAY.NIGHT)}</span>
                                </div>
                                <div className="p-4 rounded-2xl bg-muted/30 border border-muted/50 flex flex-col gap-1">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Domingos</span>
                                    <span className="font-black text-primary text-xl">{formatCurrency(PRICING.GENERAL.SUNDAY.NIGHT)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-xs font-black uppercase tracking-widest text-amber-600/60 border-b border-amber-500/10 pb-2 flex items-center gap-2">
                                <Star className="h-3 w-3" /> Promociones Pareja
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex flex-col gap-1">
                                    <span className="text-[10px] font-bold text-amber-800/60 uppercase">Lunes a Viernes</span>
                                    <span className="font-black text-amber-600 text-xl">{formatCurrency(PRICING.COUPLE.WEEKDAY.DAY)}</span>
                                </div>
                                <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex flex-col gap-1">
                                    <span className="text-[10px] font-bold text-amber-800/60 uppercase">Sábados</span>
                                    <span className="font-black text-amber-600 text-xl">{formatCurrency(PRICING.COUPLE.SATURDAY.NIGHT)}</span>
                                </div>
                                <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex flex-col gap-1">
                                    <span className="text-[10px] font-bold text-amber-800/60 uppercase">Domingos</span>
                                    <span className="font-black text-amber-600 text-xl">{formatCurrency(PRICING.COUPLE.SUNDAY.NIGHT)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-muted/30 border border-muted/50 text-center">
                            <p className="text-[11px] font-bold text-muted-foreground flex items-center justify-center gap-2">
                                <Clock className="h-4 w-4" /> Horario: 20:00 - 07:00 hs.
                            </p>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
