import { db } from "@/lib/db";
import {
    settings,
    users as usersSchema
} from "@/lib/schema";
import { PricingSettings } from "@/components/admin/pricing-settings";
import { UserManagement } from "@/components/admin/user-management";
import {
    Settings,
    ShieldCheck,
    MapPin,
    Users
} from "lucide-react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs";
import { auth } from "@/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function SettingsPage() {
    const session = await auth();
    const allSettings = await db.select().from(settings);
    const allUsers = await db.select().from(usersSchema);

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
                    <TabsTrigger value="users" className="rounded-xl px-6 py-3 font-bold gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                        <Users size={18} /> Usuarios
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="pricing">
                    <PricingSettings initialData={allSettings} />
                </TabsContent>

                <TabsContent value="general">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="bg-card rounded-[2.5rem] p-12 text-center border-none shadow-xl shadow-muted/20">
                            <ShieldCheck size={48} className="mx-auto text-primary mb-4 opacity-20" />
                            <h3 className="text-xl font-black tracking-tight mb-2">Configuración de Seguridad</h3>
                            <p className="text-muted-foreground font-medium italic">
                                Sección en desarrollo. Aquí podrás cambiar contraseñas y gestionar accesos.
                            </p>
                        </div>

                        {session?.user?.username === "Admin" && (
                            <div className="bg-card rounded-[2.5rem] p-12 border-dashed border-2 border-primary/20 text-center shadow-xl shadow-primary/10 flex flex-col items-center justify-center gap-4">
                                <h3 className="text-xl font-black tracking-tight mb-1">
                                    Herramientas Exclusivas de Admin
                                </h3>
                                <p className="text-muted-foreground font-medium max-w-md mx-auto">
                                    Descarga un archivo CSV con todas las reservas registradas en el sistema
                                    para analizar los datos en Excel u otras herramientas.
                                </p>
                                <Button
                                    asChild
                                    className="mt-2 h-12 px-8 rounded-full font-black text-sm"
                                >
                                    <Link href="/admin/reservas/export">
                                        Descargar CSV de Reservas
                                    </Link>
                                </Button>
                                <p className="text-[10px] text-muted-foreground/70 uppercase tracking-widest mt-2">
                                    Solo visible para el usuario Admin
                                </p>
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="location">
                    <div className="bg-card rounded-[2.5rem] p-12 text-center border-none shadow-xl shadow-muted/20">
                        <MapPin size={48} className="mx-auto text-primary mb-4 opacity-20" />
                        <h3 className="text-xl font-black tracking-tight mb-2">Información de Ubicación</h3>
                        <p className="text-muted-foreground font-medium italic">Sección en desarrollo. Podrás actualizar el enlace de Google Maps y dirección.</p>
                    </div>
                </TabsContent>

                <TabsContent value="users">
                    <UserManagement users={allUsers} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
