"use client";

import { useTransition, useState } from "react";
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
import { Save, Loader2, Info, Users, Heart } from "lucide-react";
import { toast } from "sonner";

export function PricingSettings({ initialData }: { initialData: any[] }) {
    const [isPending, startTransition] = useTransition();

    // Find existence of pricing config
    const pricingConfigSetting = initialData.find(s => s.key === 'pricing_config');
    const config = pricingConfigSetting ? JSON.parse(pricingConfigSetting.value) : {
        GENERAL: {
            WEEKDAY: { DAY: 500000, NIGHT: 650000 },
            SATURDAY: { DAY: 700000, NIGHT: 800000 },
            SUNDAY: { DAY: 800000, NIGHT: 650000 },
        },
        COUPLE: {
            WEEKDAY: { DAY: 250000, NIGHT: 250000 },
            SATURDAY: { DAY: 300000, NIGHT: 400000 },
            SUNDAY: { DAY: 400000, NIGHT: 300000 },
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const newConfig = {
            GENERAL: {
                WEEKDAY: {
                    DAY: Number(formData.get("GENERAL_WEEKDAY_DAY")),
                    NIGHT: Number(formData.get("GENERAL_WEEKDAY_NIGHT"))
                },
                SATURDAY: {
                    DAY: Number(formData.get("GENERAL_SATURDAY_DAY")),
                    NIGHT: Number(formData.get("GENERAL_SATURDAY_NIGHT"))
                },
                SUNDAY: {
                    DAY: Number(formData.get("GENERAL_SUNDAY_DAY")),
                    NIGHT: Number(formData.get("GENERAL_SUNDAY_NIGHT"))
                },
            },
            COUPLE: {
                WEEKDAY: {
                    DAY: Number(formData.get("COUPLE_WEEKDAY_DAY")),
                    NIGHT: Number(formData.get("COUPLE_WEEKDAY_NIGHT"))
                },
                SATURDAY: {
                    DAY: Number(formData.get("COUPLE_SATURDAY_DAY")),
                    NIGHT: Number(formData.get("COUPLE_SATURDAY_NIGHT"))
                },
                SUNDAY: {
                    DAY: Number(formData.get("COUPLE_SUNDAY_DAY")),
                    NIGHT: Number(formData.get("COUPLE_SUNDAY_NIGHT"))
                },
            }
        };

        startTransition(async () => {
            try {
                const result = await updateSettings('pricing_config', JSON.stringify(newConfig));
                if (result.success) {
                    toast.success("Tarifas actualizadas correctamente");
                } else {
                    toast.error("Error al guardar los cambios");
                }
            } catch (error) {
                toast.error("Error al conectar con el servidor");
            }
        });
    };

    const PriceInput = ({ label, name, defaultValue }: { label: string, name: string, defaultValue: number }) => (
        <div className="grid gap-2">
            <Label htmlFor={name} className="text-xs font-bold uppercase text-muted-foreground">{label}</Label>
            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">G.</span>
                <Input
                    id={name}
                    name={name}
                    defaultValue={defaultValue}
                    type="number"
                    className="rounded-xl h-11 pl-8 font-bold"
                />
            </div>
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 gap-8">
                {/* General Pricing Card */}
                <Card className="rounded-[2.5rem] border-none shadow-xl shadow-muted/20">
                    <CardHeader className="border-b bg-muted/30">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                <Users size={20} />
                            </div>
                            <div>
                                <CardTitle className="font-black tracking-tight">Tarifas Generales</CardTitle>
                                <CardDescription>Precios para grupos de hasta 30 personas.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-4 pt-2">
                                <h3 className="text-sm font-black uppercase tracking-widest text-primary border-b pb-2">Entre Semana</h3>
                                <PriceInput label="Día (09:00 - 18:00)" name="GENERAL_WEEKDAY_DAY" defaultValue={config.GENERAL.WEEKDAY.DAY} />
                                <PriceInput label="Noche (20:00 - 07:00)" name="GENERAL_WEEKDAY_NIGHT" defaultValue={config.GENERAL.WEEKDAY.NIGHT} />
                            </div>
                            <div className="space-y-4 pt-2">
                                <h3 className="text-sm font-black uppercase tracking-widest text-primary border-b pb-2">Sábados</h3>
                                <PriceInput label="Día (09:00 - 18:00)" name="GENERAL_SATURDAY_DAY" defaultValue={config.GENERAL.SATURDAY.DAY} />
                                <PriceInput label="Noche (20:00 - 07:00)" name="GENERAL_SATURDAY_NIGHT" defaultValue={config.GENERAL.SATURDAY.NIGHT} />
                            </div>
                            <div className="space-y-4 pt-2">
                                <h3 className="text-sm font-black uppercase tracking-widest text-primary border-b pb-2">Domingos</h3>
                                <PriceInput label="Día (09:00 - 18:00)" name="GENERAL_SUNDAY_DAY" defaultValue={config.GENERAL.SUNDAY.DAY} />
                                <PriceInput label="Noche (20:00 - 07:00)" name="GENERAL_SUNDAY_NIGHT" defaultValue={config.GENERAL.SUNDAY.NIGHT} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Couple Pricing Card */}
                <Card className="rounded-[2.5rem] border-none shadow-xl shadow-muted/20">
                    <CardHeader className="border-b bg-muted/30">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-pink-100 text-pink-600">
                                <Heart size={20} />
                            </div>
                            <div>
                                <CardTitle className="font-black tracking-tight">Promo Parejas</CardTitle>
                                <CardDescription>Precios especiales para 2 personas.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-4 pt-2">
                                <h3 className="text-sm font-black uppercase tracking-widest text-pink-600 border-b pb-2">Entre Semana</h3>
                                <PriceInput label="Día (10:00 - 19:00)" name="COUPLE_WEEKDAY_DAY" defaultValue={config.COUPLE.WEEKDAY.DAY} />
                                <PriceInput label="Noche (20:00 - 09:00)" name="COUPLE_WEEKDAY_NIGHT" defaultValue={config.COUPLE.WEEKDAY.NIGHT} />
                            </div>
                            <div className="space-y-4 pt-2">
                                <h3 className="text-sm font-black uppercase tracking-widest text-pink-600 border-b pb-2">Sábados</h3>
                                <PriceInput label="Día (10:00 - 19:00)" name="COUPLE_SATURDAY_DAY" defaultValue={config.COUPLE.SATURDAY.DAY} />
                                <PriceInput label="Noche (20:00 - 09:00)" name="COUPLE_SATURDAY_NIGHT" defaultValue={config.COUPLE.SATURDAY.NIGHT} />
                            </div>
                            <div className="space-y-4 pt-2">
                                <h3 className="text-sm font-black uppercase tracking-widest text-pink-600 border-b pb-2">Domingos</h3>
                                <PriceInput label="Día (10:00 - 19:00)" name="COUPLE_SUNDAY_DAY" defaultValue={config.COUPLE.SUNDAY.DAY} />
                                <PriceInput label="Noche (20:00 - 09:00)" name="COUPLE_SUNDAY_NIGHT" defaultValue={config.COUPLE.SUNDAY.NIGHT} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4">
                <div className="flex bg-muted/50 p-4 rounded-2xl gap-3 max-w-2xl border">
                    <Info className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                        Los cambios se guardarán como una configuración global y se aplicarán al motor de reservas automáticamente. Las reservas existentes no se verán afectadas.
                    </p>
                </div>
                <Button size="lg" className="w-full md:w-auto rounded-full px-12 h-14 font-black shadow-xl shadow-primary/20 gap-2 transition-all hover:scale-105" disabled={isPending}>
                    {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                    Guardar Cambios
                </Button>
            </div>
        </form>
    );
}
