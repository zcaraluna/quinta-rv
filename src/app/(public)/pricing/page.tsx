import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Clock, Users, Star, ArrowRight } from "lucide-react"

export default function PricingPage() {
    return (
        <main className="min-h-screen pt-32 pb-20 px-4 bg-muted/20">
            <div className="container mx-auto max-w-5xl">
                <header className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">
                        Tarifas y <span className="text-primary">Promociones</span>
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Disfruta de Quinta RV con los mejores precios. Tenemos planes especiales para grupos grandes y escapadas románticas.
                    </p>
                </header>

                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    {/* General Pricing (Groups) */}
                    <Card className="border-t-4 border-t-primary shadow-lg">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-2xl">Tarifas Generales</CardTitle>
                                    <CardDescription>Costo sujeto a 30 personas</CardDescription>
                                </div>
                                <Users className="text-primary h-6 w-6" />
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="font-bold flex items-center gap-2">
                                    <Badge variant="outline">Lun a Vie</Badge>
                                </h3>
                                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span>09hs a 18hs</span>
                                    </div>
                                    <span className="font-black text-lg text-primary">500.000gs</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span>20hs a 07hs</span>
                                    </div>
                                    <span className="font-black text-lg text-primary">650.000gs</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-bold flex items-center gap-2">
                                    <Badge variant="outline" className="border-amber-500 text-amber-500">Sábado</Badge>
                                </h3>
                                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span>09hs a 18hs</span>
                                    </div>
                                    <span className="font-black text-lg text-primary">700.000gs</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span>20hs a 07hs</span>
                                    </div>
                                    <span className="font-black text-lg text-primary">800.000gs</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-bold flex items-center gap-2">
                                    <Badge variant="outline" className="border-green-500 text-green-500">Domingo</Badge>
                                </h3>
                                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span>09hs a 18hs</span>
                                    </div>
                                    <span className="font-black text-lg text-primary">800.000gs</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Couple Promo */}
                    <Card className="border-t-4 border-t-amber-500 shadow-lg">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-2xl">Promo Pareja</CardTitle>
                                    <CardDescription>Escapada romántica exclusiva</CardDescription>
                                </div>
                                <Star className="text-amber-500 h-6 w-6 fill-amber-500" />
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-amber-900 text-sm font-medium">
                                Incluye habitación climatizada y acceso a todas las instalaciones.
                            </div>

                            <div className="space-y-3">
                                <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-widest">Lunes a Viernes</h3>
                                <div className="flex justify-between items-center p-3 bg-amber-500/5 rounded-lg border border-amber-200">
                                    <span className="text-sm font-medium">9am a 18hs / 20hs a 8am</span>
                                    <span className="font-black text-lg text-amber-700">250.000gs</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-widest">Sábados</h3>
                                <div className="flex justify-between items-center p-3 bg-amber-500/5 rounded-lg border border-amber-200">
                                    <span className="text-sm font-medium">10am a 18hs</span>
                                    <span className="font-black text-lg text-amber-700">300.000gs</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-amber-500/5 rounded-lg border border-amber-200">
                                    <span className="text-sm font-medium">19hs a 09am</span>
                                    <span className="font-black text-lg text-amber-700">400.000gs</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-widest">Domingos</h3>
                                <div className="flex justify-between items-center p-3 bg-amber-500/5 rounded-lg border border-amber-200">
                                    <span className="text-sm font-medium">10am a 18hs</span>
                                    <span className="font-black text-lg text-amber-700">400.000gs</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-amber-500/5 rounded-lg border border-amber-200">
                                    <span className="text-sm font-medium">19hs a 09am</span>
                                    <span className="font-black text-lg text-amber-700">300.000gs</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="text-center">
                    <Button size="xl" className="rounded-full px-12 h-16 text-xl font-black shadow-2xl hover:scale-105 transition-all" asChild>
                        <Link href="/reservations" className="flex items-center gap-3">
                            Quiero Reservar
                            <ArrowRight className="h-6 w-6" />
                        </Link>
                    </Button>
                </div>
            </div>
        </main>
    )
}
