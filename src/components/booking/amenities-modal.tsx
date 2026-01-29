"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles } from "lucide-react"
import { AMENITY_CATEGORIES } from "@/lib/constants"

export function AmenitiesModal() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="lg" className="rounded-full px-8 h-14 font-bold border-primary/20 hover:border-primary/40 transition-all gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Instalaciones
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] border-none p-8 text-foreground">
                <DialogHeader className="mb-8">
                    <DialogTitle className="text-4xl font-black tracking-tighter text-center">Nuestras Comodidades</DialogTitle>
                </DialogHeader>

                <div className="space-y-12">
                    {AMENITY_CATEGORIES.map((category, idx) => (
                        <div key={idx} className="space-y-6">
                            <div className="border-b pb-4">
                                <h3 className="text-2xl font-black tracking-tight">{category.title}</h3>
                                <p className="text-muted-foreground font-medium text-sm">{category.description}</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {category.items.map((item, itemIdx) => (
                                    <div key={itemIdx} className="flex items-start gap-4 p-4 rounded-2xl bg-muted/30 border border-muted/50 hover:bg-muted/50 transition-colors">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                            <item.icon className="h-5 w-5 text-primary" />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="font-bold text-sm">{item.name}</h4>
                                            <p className="text-xs text-muted-foreground font-medium">{item.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 p-6 bg-primary/5 rounded-[2rem] border border-primary/10 text-center">
                    <p className="text-sm font-bold text-primary">
                        Todo lo necesario para que tu estadía sea inolvidable.
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    )
}
