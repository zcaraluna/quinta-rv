"use client";

import { useTransition } from "react";
import { updateSettings } from "@/lib/actions";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save, Loader2, Info } from "lucide-react";
import { toast } from "sonner";

export function PricingSettings({ initialData }: { initialData: any }) {
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
            try {
                // In a real scenario, we'd iterate over all keys
                // For now, let's just show the pattern for one or two
                toast.info("Guardando configuración...");
                // await updateSettings('pricing_config', JSON.stringify(Object.fromEntries(formData)));
                toast.success("Configuración guardada (Simulación)");
            } catch (error) {
                toast.error("Error al guardar");
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="rounded-[2.5rem] border-none shadow-xl shadow-muted/20">
                <CardHeader>
                    <CardTitle className="font-black tracking-tight">Tarifas Generales</CardTitle>
                    <CardDescription>Configura los precios base para los diferentes turnos y días.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h3 className="text-sm font-black uppercase tracking-widest text-primary">Entre Semana (Lunes a Viernes)</h3>
                            <div className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="weekday_day">Turno Día</Label>
                                    <Input id="weekday_day" name="weekday_day" defaultValue="500000" type="number" className="rounded-xl h-12" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="weekday_night">Turno Noche</Label>
                                    <Input id="weekday_night" name="weekday_night" defaultValue="650000" type="number" className="rounded-xl h-12" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-black uppercase tracking-widest text-primary">Fin de Semana (Sábados)</h3>
                            <div className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="sat_day">Turno Día</Label>
                                    <Input id="sat_day" name="sat_day" defaultValue="700000" type="number" className="rounded-xl h-12" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="sat_night">Turno Noche</Label>
                                    <Input id="sat_night" name="sat_night" defaultValue="800000" type="number" className="rounded-xl h-12" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex bg-muted/50 p-4 rounded-2xl gap-3">
                        <Info className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                            Los cambios en las tarifas se aplicarán de forma inmediata a todas las nuevas reservas. Las reservas ya realizadas mantendrán el precio acordado en su momento.
                        </p>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end pt-4">
                <Button size="lg" className="rounded-full px-12 h-14 font-black shadow-xl shadow-primary/20 gap-2" disabled={isPending}>
                    {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                    Guardar Cambios
                </Button>
            </div>
        </form>
    );
}
