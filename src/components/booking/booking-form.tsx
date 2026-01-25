"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { format, isBefore, startOfDay, addDays } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, Loader2 } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "sonner"
import { createBooking } from "@/lib/actions"

const formSchema = z.object({
    guestName: z.string().min(2, { message: "Nombre muy corto" }),
    guestEmail: z.string().email({ message: "Email inválido" }),
    guestWhatsapp: z.string().min(8, { message: "Mínimo 8 dígitos" }),
    dateRange: z.object({
        from: z.date(),
        to: z.date(),
    }),
})

interface BookingFormProps {
    unavailableDates: { start: Date; end: Date }[]
}

export function BookingForm({ unavailableDates }: BookingFormProps) {
    const [isPending, startTransition] = React.useTransition()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            guestName: "",
            guestEmail: "",
            guestWhatsapp: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        const formData = new FormData()
        formData.append("guestName", values.guestName)
        formData.append("guestEmail", values.guestEmail)
        formData.append("guestWhatsapp", values.guestWhatsapp)
        formData.append("from", values.dateRange.from.toISOString())
        formData.append("to", values.dateRange.to.toISOString())

        startTransition(async () => {
            const result = await createBooking(null, formData)
            if (result?.error) {
                toast.error(result.error)
            } else {
                toast.success("Reserva iniciada")
            }
        })
    }

    // Disable dates: Past dates + Unavailable ranges
    const isDateDisabled = (date: Date) => {
        if (isBefore(date, startOfDay(new Date()))) return true;

        return unavailableDates.some(range => {
            // Check if date is within range [start, end]
            // Fix: Ensure we compare properly (start of day)
            return date >= startOfDay(range.start) && date <= startOfDay(range.end);
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-card p-6 rounded-xl border shadow-sm">
                <div className="space-y-2">
                    <h3 className="text-xl font-semibold">Reserva tu Estadía</h3>
                    <p className="text-sm text-muted-foreground">Selecciona tus fechas y completa tus datos.</p>
                </div>

                <FormField
                    control={form.control}
                    name="dateRange"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Fechas</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value?.from ? (
                                                field.value.to ? (
                                                    <>
                                                        {format(field.value.from, "LLL dd, y", { locale: es })} -{" "}
                                                        {format(field.value.to, "LLL dd, y", { locale: es })}
                                                    </>
                                                ) : (
                                                    format(field.value.from, "LLL dd, y", { locale: es })
                                                )
                                            ) : (
                                                <span>Selecciona fechas</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="range"
                                        selected={field.value as DateRange} // Cast for react-day-picker compatibility
                                        onSelect={field.onChange}
                                        disabled={isDateDisabled}
                                        numberOfMonths={2}
                                        initialFocus
                                        locale={es}
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="guestName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre completo</FormLabel>
                                <FormControl>
                                    <Input placeholder="Juan Pérez" {...field} />
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
                                <FormLabel>WhatsApp</FormLabel>
                                <FormControl>
                                    <Input placeholder="11 1234 5678" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="guestEmail"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="juan@ejemplo.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isPending ? "Procesando..." : "Confirmar Reserva"}
                </Button>
            </form>
        </Form>
    )
}
