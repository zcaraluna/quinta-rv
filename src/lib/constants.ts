import { Waves, Utensils, Bed, Trophy, Trees, Wifi, Car, Shield, Wind, Coffee, Music, Sun } from "lucide-react"

export const AMENITY_CATEGORIES = [
    {
        title: "Instalaciones Exclusivas",
        description: "Exclusivo y privado, el lugar cuenta con todas las facilidades.",
        items: [
            { name: "Habitación Climatizada", description: "Habitación con AC para mayor confort.", icon: Wind },
            { name: "Wifi de Alta Velocidad", description: "Conexión estable en todo el predio.", icon: Wifi },
            { name: "Equipo Bluetooth", description: "Sonido de alta fidelidad para tus momentos.", icon: Music },
            { name: "TV Smart", description: "Acceso a tus plataformas de streaming favoritas.", icon: Sun },
        ]
    },
    {
        title: "Cocina & Parrilla",
        description: "Equipamiento completo para tus comidas y refrigerios.",
        items: [
            { name: "Heladera y Congelador", description: "Espacio amplio para refrigerar alimentos y bebidas.", icon: Coffee },
            { name: "Parrilla y Cubiertos", description: "Todo listo para realizar tu asado perfecto.", icon: Utensils },
            { name: "Electrodomésticos", description: "Licuadora, calentador, mixtera.", icon: Utensils },
            { name: "Placa Cocina", description: "Para preparaciones rápidas y calientes.", icon: Coffee },
        ]
    },
    {
        title: "Relajación & Piscina",
        description: "El sector ideal para refrescarte y disfrutar al aire libre.",
        items: [
            { name: "Piscina con Cascada", description: "Experiencia refrescante con relajante sonido de agua.", icon: Waves },
            { name: "Iluminación LED", description: "Piscina con luces para uso nocturno.", icon: Sun },
            { name: "Privacidad Total", description: "Predio amurallado para mayor exclusividad.", icon: Shield },
        ]
    }
]
