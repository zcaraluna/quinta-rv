"use client";

import { useState } from "react";
import { Hammer, Loader2, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { createMaintenance } from "@/lib/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function MaintenanceDialog() {
    const [date, setDate] = useState<Date>();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    async function handleConfirm() {
        if (!date) return;
        setIsLoading(true);
        try {
            const result = await createMaintenance(date.toISOString());
            if (result.success) {
                toast.success("Mantenimiento configurado para todo el día");
                setIsOpen(false);
                router.refresh();
            } else {
                toast.error("Error al configurar el mantenimiento");
            }
        } catch (error) {
            toast.error("Error inesperado");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="h-14 px-8 rounded-2xl font-black text-lg border-2 border-primary/20 hover:bg-primary/5 transition-all">
                    <Hammer className="mr-2 h-5 w-5" /> Mantenimiento
                </Button>
            </DialogTrigger>
            <DialogContent className="rounded-[2.5rem] sm:max-w-[425px] overflow-hidden p-0 border-none shadow-2xl">
                <DialogHeader className="p-8 bg-muted/30">
                    <DialogTitle className="text-2xl font-black">Bloquear Fecha</DialogTitle>
                    <DialogDescription className="font-medium">
                        Selecciona el día que deseas poner en mantenimiento. Se bloquearán ambos turnos automáticamente.
                    </DialogDescription>
                </DialogHeader>
                <div className="p-8 space-y-6">
                    <div className="space-y-2">
                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Fecha a bloquear</p>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full h-12 justify-start text-left font-bold rounded-xl border-2",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-5 w-5" />
                                    {date ? format(date, "PPP", { locale: es }) : <span>Selecciona un día</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 rounded-2xl overflow-hidden" align="start">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                    locale={es}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                <DialogFooter className="p-8 bg-muted/10">
                    <Button
                        type="submit"
                        className="w-full h-14 rounded-2xl font-black text-lg"
                        disabled={!date || isLoading}
                        onClick={handleConfirm}
                    >
                        {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Hammer className="mr-2 h-5 w-5" />}
                        Confirmar Bloqueo
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
