"use client";

import { useState } from "react";
import { Loader2, Calendar as CalendarIcon, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
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
import { reassignBooking } from "@/lib/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ReassignDialogProps {
    bookingId: string;
    currentGuestName: string;
    currentDate: Date;
    currentSlot: 'DAY' | 'NIGHT';
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ReassignDialog({
    bookingId,
    currentGuestName,
    currentDate,
    currentSlot,
    open,
    onOpenChange
}: ReassignDialogProps) {
    const [date, setDate] = useState<Date | undefined>(new Date(currentDate));
    const [slot, setSlot] = useState<'DAY' | 'NIGHT'>(currentSlot);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    async function handleConfirm() {
        if (!date) return;
        setIsLoading(true);
        try {
            const result = await reassignBooking(bookingId, date.toISOString(), slot);
            if (result.success) {
                toast.success("Reserva reasignada correctamente");
                onOpenChange(false);
                router.refresh();
            } else {
                toast.error("Error al reasignar");
            }
        } catch (error) {
            toast.error("Error inesperado");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="rounded-[2.5rem] sm:max-w-[425px] overflow-hidden p-0 border-none shadow-2xl">
                <DialogHeader className="p-8 bg-muted/30">
                    <DialogTitle className="text-2xl font-black flex items-center gap-2">
                        <ArrowRightLeft className="h-6 w-6 text-primary" />
                        Reasignar Reserva
                    </DialogTitle>
                    <DialogDescription className="font-medium">
                        Cambiando espacio para <strong>{currentGuestName}</strong>.
                        Selecciona la nueva fecha y turno.
                    </DialogDescription>
                </DialogHeader>
                <div className="p-8 space-y-6">
                    <div className="space-y-2">
                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Nueva Fecha</p>
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
                            <PopoverContent className="w-auto p-0 rounded-2xl overflow-hidden" align="start" side="top">
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

                    <div className="space-y-2">
                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Nuevo Turno</p>
                        <div className="flex gap-2">
                            <Button
                                variant={slot === 'DAY' ? 'default' : 'outline'}
                                className="flex-1 rounded-xl font-bold h-12"
                                onClick={() => setSlot('DAY')}
                            >
                                Día
                            </Button>
                            <Button
                                variant={slot === 'NIGHT' ? 'default' : 'outline'}
                                className="flex-1 rounded-xl font-bold h-12"
                                onClick={() => setSlot('NIGHT')}
                            >
                                Noche
                            </Button>
                        </div>
                    </div>
                </div>
                <DialogFooter className="p-8 bg-muted/10">
                    <Button
                        type="submit"
                        className="w-full h-14 rounded-2xl font-black text-lg"
                        disabled={!date || isLoading}
                        onClick={handleConfirm}
                    >
                        {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <ArrowRightLeft className="mr-2 h-5 w-5" />}
                        Confirmar Reasignación
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
