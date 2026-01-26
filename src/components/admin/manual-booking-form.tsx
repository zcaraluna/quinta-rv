"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { createManualBooking } from "@/lib/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

const formSchema = z.object({
    guestName: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    guestEmail: z.string().email("Correo electrónico inválido"),
    guestWhatsapp: z.string().min(8, "El número de WhatsApp es inválido"),
    bookingDate: z.date(),
    slot: z.enum(["DAY", "NIGHT"]),
    isCouplePromo: z.boolean(),
    totalPrice: z.string().min(1, "El precio es obligatorio"),
    status: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export function ManualBookingForm() {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            guestName: "",
            guestEmail: "",
            guestWhatsapp: "",
            bookingDate: new Date(),
            slot: "DAY",
            isCouplePromo: false,
            totalPrice: "",
            status: "CONFIRMED",
        },
    });

    async function onSubmit(values: FormValues) {
        setIsPending(true);
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            if (value instanceof Date) {
                formData.append(key, value.toISOString());
            } else {
                formData.append(key, value.toString());
            }
        });

        try {
            const result = await createManualBooking(formData);
            if (result.success) {
                toast.success("Reserva creada exitosamente");
                router.push("/admin/reservas");
                router.refresh();
            } else {
                toast.error("Error al crear la reserva");
            }
        } catch (error) {
            toast.error("Ocurrió un error inesperado");
        } finally {
            setIsPending(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Guest Information */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-sm">1</span>
                            <h2 className="text-xl font-black uppercase tracking-widest text-muted-foreground/60">Datos del Cliente</h2>
                        </div>

                        <FormField
                            control={form.control}
                            name="guestName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold">Nombre Completo</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Juan Pérez" className="h-12 rounded-xl" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="guestEmail"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold">Correo Electrónico</FormLabel>
                                    <FormControl>
                                        <Input placeholder="juan@ejemplo.com" className="h-12 rounded-xl" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="guestWhatsapp"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold">WhatsApp (Celular)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="0981 123 456" className="h-12 rounded-xl" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Booking Details */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-sm">2</span>
                            <h2 className="text-xl font-black uppercase tracking-widest text-muted-foreground/60">Detalles de Reserva</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="bookingDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel className="font-bold">Fecha</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "h-12 rounded-xl pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "PPP", { locale: es })
                                                        ) : (
                                                            <span>Seleccionar fecha</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0 rounded-2xl" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                        date < new Date(new Date().setHours(0, 0, 0, 0))
                                                    }
                                                    initialFocus
                                                    locale={es}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">Estado Inicial</FormLabel>
                                        <FormControl>
                                            <select
                                                className="flex h-12 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                {...field}
                                            >
                                                <option value="PENDING_PAYMENT">Pendiente Pago</option>
                                                <option value="CONFIRMED">Confirmada</option>
                                                <option value="MAINTENANCE">Mantenimiento</option>
                                            </select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="slot"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel className="font-bold">Turno</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex gap-4"
                                        >
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="DAY" />
                                                </FormControl>
                                                <FormLabel className="font-medium cursor-pointer">Día (09:00 - 19:00)</FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="NIGHT" />
                                                </FormControl>
                                                <FormLabel className="font-medium cursor-pointer">Noche (21:00 - 07:00)</FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border">
                            <div className="space-y-0.5">
                                <FormLabel className="font-bold">Promo Pareja</FormLabel>
                                <p className="text-xs text-muted-foreground">Solo para 2 personas</p>
                            </div>
                            <FormField
                                control={form.control}
                                name="isCouplePromo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="totalPrice"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold text-primary">Monto Total (Gs.)</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="800000"
                                            className="h-14 rounded-xl text-xl font-black border-primary/20 focus:ring-primary/20"
                                            {...field}
                                            type="number"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-end gap-4 pt-6 border-t">
                    <Button
                        type="button"
                        variant="ghost"
                        className="h-12 rounded-xl font-bold px-8"
                        onClick={() => router.back()}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        className="h-14 rounded-2xl font-black px-12 text-lg shadow-xl shadow-primary/20"
                        disabled={isPending}
                    >
                        {isPending ? (
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        ) : (
                            <Save className="mr-2 h-5 w-5" />
                        )}
                        {isPending ? "Guardando..." : "Crear Reserva"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
