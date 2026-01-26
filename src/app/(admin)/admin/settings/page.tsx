import { db } from "@/lib/db";
import { settings } from "@/lib/schema";
import { PricingSettings } from "@/components/admin/pricing-settings";
import {
    Settings,
    ShieldCheck,
    MapPin,
    Bell
} from "lucide-react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs";

export default async function SettingsPage() {
    const allSettings = await db.select().from(settings);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-black tracking-tighter">Ajustes del Sistema</h1>
                <p className="text-muted-foreground font-medium">Configura el funcionamiento global de Quinta RV.</p>
            </div>

            <Tabs defaultValue="pricing" className="space-y-6">
                <TabsList className="bg-muted/50 p-1 rounded-2xl h-auto border">
                    <TabsTrigger value="pricing" className="rounded-xl px-6 py-3 font-bold gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                        <Settings size={18} /> Tarifas
                    </TabsTrigger>
                    <TabsTrigger value="general" className="rounded-xl px-6 py-3 font-bold gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                        <ShieldCheck size={18} /> Seguridad
                    </TabsTrigger>
                    <TabsTrigger value="location" className="rounded-xl px-6 py-3 font-bold gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                        <MapPin size={18} /> Ubicación
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="pricing">
                    <PricingSettings initialData={allSettings} />
                </TabsContent>

                <TabsContent value="general">
                    <div className="bg-card rounded-[2.5rem] p-12 text-center border-none shadow-xl shadow-muted/20">
                        <ShieldCheck size={48} className="mx-auto text-primary mb-4 opacity-20" />
                        <h3 className="text-xl font-black tracking-tight mb-2">Configuración de Seguridad</h3>
                        <p className="text-muted-foreground font-medium italic">Sección en desarrollo. Aquí podrás cambiar contraseñas y gestionar accesos.</p>
                    </div>
                </TabsContent>

                <TabsContent value="location">
                    <div className="bg-card rounded-[2.5rem] p-12 text-center border-none shadow-xl shadow-muted/20">
                        <MapPin size={48} className="mx-auto text-primary mb-4 opacity-20" />
                        <h3 className="text-xl font-black tracking-tight mb-2">Información de Ubicación</h3>
                        <p className="text-muted-foreground font-medium italic">Sección en desarrollo. Podrás actualizar el enlace de Google Maps y dirección.</p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
