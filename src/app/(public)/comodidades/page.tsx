import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Waves, Utensils, Bed, Trophy, Trees, Wifi, Car, Shield, Wind, Coffee, Music, Sun } from "lucide-react"

const AMENITY_CATEGORIES = [
    {
        title: "Relajación & Piscina",
        description: "Espacios diseñados para desconectar y disfrutar del sol.",
        items: [
            { name: "Piscina Amplia", description: "Piscina moderna con sector para niños.", icon: Waves },
            { name: "Solarium", description: "Área de descanso con reposeras.", icon: Sun },
            { name: "Ducha Exterior", description: "Para uso previo y posterior a la piscina.", icon: Waves },
        ]
    },
    {
        title: "Área Social & Eventos",
        description: "Todo lo necesario para tus reuniones y festejos.",
        items: [
            { name: "Quincho Techado", description: "Capacidad para 30+ personas.", icon: Utensils },
            { name: "Parrilla Grande", description: "Espacio completo para asados.", icon: Utensils },
            { name: "Cocina Equipada", description: "Heladera, visicooler y anafe.", icon: Coffee },
            { name: "Música & Sonido", description: "Conexión Bluetooth disponible.", icon: Music },
        ]
    },
    {
        title: "Confort & Descanso",
        description: "Habitaciones pensadas para tu comodidad.",
        items: [
            { name: "Habitaciones c/ AC", description: "Ambientes climatizados.", icon: Wind },
            { name: "Camas Sommier", description: "Descanso de alta calidad.", icon: Bed },
            { name: "Baños Privados", description: "Con terminaciones modernas.", icon: Shield },
        ]
    },
    {
        title: "Deportes & Diversión",
        description: "Actividad física y recreación al aire libre.",
        items: [
            { name: "Cancha de Vóley", description: "Arena reglamentaria.", icon: Trophy },
            { name: "Espacio de Fútbol", description: "Césped natural nivelado.", icon: Trophy },
            { name: "Áreas Verdes", description: "Extenso parque para recreación.", icon: Trees },
        ]
    },
    {
        title: "Servicios Incluidos",
        description: "Facilidades para una estadía sin preocupaciones.",
        items: [
            { name: "Wi-Fi Gratis", description: "Conexión de alta velocidad.", icon: Wifi },
            { name: "Estacionamiento", description: "Seguridad dentro del predio.", icon: Car },
            { name: "Privacidad Total", description: "Predio totalmente amurallado.", icon: Shield },
        ]
    }
]

export default function AmenitiesPage() {
    return (
        <main className="min-h-screen pt-32 pb-20 px-4 bg-muted/20">
            <div className="container mx-auto max-w-6xl">
                <header className="text-center mb-16 space-y-4">
                    <Badge variant="outline" className="px-4 py-1 rounded-full border-primary text-primary font-bold uppercase tracking-widest text-[10px]">
                        Instalaciones
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">
                        Todo lo que <span className="text-primary">necesitas</span>
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto balance font-medium">
                        Quinta RV está equipada con instalaciones de primer nivel para garantizar que tu estadía sea placentera, segura e inolvidable.
                    </p>
                </header>

                <div className="space-y-20">
                    {AMENITY_CATEGORIES.map((category, idx) => (
                        <section key={idx} className="space-y-8">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-6">
                                <div className="space-y-1">
                                    <h2 className="text-3xl font-black tracking-tight">{category.title}</h2>
                                    <p className="text-muted-foreground font-medium">{category.description}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {category.items.map((item, itemIdx) => (
                                    <Card key={itemIdx} className="group hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 rounded-3xl overflow-hidden border-muted-foreground/10 bg-card">
                                        <CardHeader className="pb-2">
                                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
                                                <item.icon className="h-6 w-6 text-primary" />
                                            </div>
                                            <CardTitle className="text-lg font-bold">{item.name}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-muted-foreground font-medium">{item.description}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>

                {/* Closing CTA */}
                <section className="mt-32 p-12 bg-primary rounded-[3rem] text-center text-primary-foreground space-y-6 shadow-2xl shadow-primary/20">
                    <h2 className="text-3xl md:text-5xl font-black tracking-tighter">¿Listo para visitarnos?</h2>
                    <p className="text-primary-foreground/80 text-lg max-w-xl mx-auto font-medium">
                        Reserva tu fecha ahora y asegura tu lugar en el paraíso.
                    </p>
                    <div className="pt-4">
                        <a
                            href="/reservations"
                            className="inline-flex items-center justify-center px-10 h-16 bg-white text-primary rounded-full font-black text-xl hover:scale-105 transition-all shadow-xl active:scale-95"
                        >
                            Reservar Ahora
                        </a>
                    </div>
                </section>
            </div>
        </main>
    )
}
