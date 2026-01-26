"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { format, isBefore, startOfDay, getDay } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, Loader2, Info, CheckCircle2 } from "lucide-react"

import { cn, formatCurrency } from "@/lib/utils"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { createBooking } from "@/lib/actions"
import { PricingModal } from "./pricing-modal"

const formSchema = z.object({
    guestName: z.string().min(2, "Nombre muy corto"),
    guestEmail: z.string().email("Email inválido"),
    guestWhatsapp: z.string().min(8, "Mínimo 8 dígitos"),
    bookingDate: z.date(),
    slot: z.enum(["DAY", "NIGHT"]),
    isCouplePromo: z.boolean(),
})

type FormValues = z.infer<typeof formSchema>

interface BookingFormProps {
    unavailableSlots: { date: string; slot: string }[]
}

const PRICING = {
    GENERAL: {
        WEEKDAY: { DAY: 500000, NIGHT: 650000 },
        SATURDAY: { DAY: 700000, NIGHT: 800000 },
        SUNDAY: { DAY: 800000, NIGHT: 650000 },
    },
    COUPLE: {
        WEEKDAY: { DAY: 250000, NIGHT: 250000 },
        SATURDAY: { DAY: 300000, NIGHT: 400000 },
        SUNDAY: { DAY: 400000, NIGHT: 300000 },
    }
}

export function BookingForm({ unavailableSlots }: BookingFormProps) {
    const [isPending, startTransition] = React.useTransition()

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            guestName: "",
            guestEmail: "",
            guestWhatsapp: "",
            slot: "DAY",
            isCouplePromo: false,
        },
    })

    const watchDate = form.watch("bookingDate")
    const watchSlot = form.watch("slot")
    const watchCouple = form.watch("isCouplePromo")

    const calculatePrice = React.useCallback(() => {
        if (!watchDate) return 0
        const dayOfWeek = getDay(watchDate) // 0=Sun, 1=Mon, ..., 6=Sat
        const type = watchCouple ? "COUPLE" : "GENERAL"

        let dayType: "WEEKDAY" | "SATURDAY" | "SUNDAY" = "WEEKDAY"
        if (dayOfWeek === 6) dayType = "SATURDAY"
        else if (dayOfWeek === 0) dayType = "SUNDAY"

        return PRICING[type][dayType][watchSlot as "DAY" | "NIGHT"]
    }, [watchDate, watchSlot, watchCouple])

    const totalPrice = calculatePrice()

    function onSubmit(values: z.infer<typeof formSchema>) {
        const formData = new FormData()
        formData.append("guestName", values.guestName)
        formData.append("guestEmail", values.guestEmail)
        formData.append("guestWhatsapp", values.guestWhatsapp)
        formData.append("bookingDate", values.bookingDate.toISOString())
        formData.append("slot", values.slot)
        formData.append("isCouplePromo", values.isCouplePromo.toString())
        formData.append("totalPrice", totalPrice.toString())

        startTransition(async () => {
            const result = await createBooking(null, formData)
            if (result?.error) {
                toast.error(result.error)
            } else {
                toast.success("Reserva iniciada")
            }
        })
    }

    const isDateDisabled = (date: Date) => {
        if (isBefore(date, startOfDay(new Date()))) return true

        const dateStr = format(date, "yyyy-MM-dd")
        const slotsTaken = unavailableSlots.filter(s => s.date === dateStr)

        // If there are 2 slots and both are taken, disable the date
        return slotsTaken.length >= 2
    }

    const isSlotDisabled = (slot: string) => {
        if (!watchDate) return false
        const dateStr = format(watchDate, "yyyy-MM-dd")
        return unavailableSlots.some(s => s.date === dateStr && s.slot === slot)
    }

    // Calculate modifiers for color coding
    const modifiers = React.useMemo(() => {
        const full: Date[] = []
        const partial: Date[] = []

        // Group by date
        const counts = unavailableSlots.reduce((acc, current) => {
            acc[current.date] = (acc[current.date] || 0) + 1
            return acc
        }, {} as Record<string, number>)

        Object.entries(counts).forEach(([dateStr, count]) => {
            const date = new Date(dateStr + "T00:00:00")
            if (count >= 2) full.push(date)
            else if (count === 1) partial.push(date)
        })

        return {
            full,
            partial,
            available: (date: Date) => {
                if (isBefore(date, startOfDay(new Date()))) return false
                const dateStr = format(date, "yyyy-MM-dd")
                return !counts[dateStr]
            }
        }
    }, [unavailableSlots])

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-card p-6 rounded-2xl border shadow-md">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <h3 className="text-2xl font-black tracking-tight">Reservar</h3>
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Quinta RV - Luque</p>
                    </div>
                    <PricingModal />
                </div>

                <div className="grid gap-6">
                    {/* Date Picker */}
                    <FormField
                        control={form.control}
                        name="bookingDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel className="text-xs font-bold uppercase text-muted-foreground">Fecha</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full h-12 rounded-xl text-left font-semibold",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP", { locale: es })
                                                ) : (
                                                    <span>Selecciona un día</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <div className="p-3 border-b bg-muted/20 flex justify-between gap-2 text-[10px] font-black uppercase tracking-tighter">
                                            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-emerald-500" /> Disponible</div>
                                            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-amber-400" /> 1 Turno Ocupado</div>
                                            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500" /> Ocupado</div>
                                        </div>
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={isDateDisabled}
                                            initialFocus
                                            locale={es}
                                            modifiers={modifiers}
                                            modifiersClassNames={{
                                                full: "bg-red-100 text-red-900 font-bold border-2 border-red-400/50 cursor-not-allowed opacity-50",
                                                partial: "bg-amber-100 text-amber-900 font-bold border-2 border-amber-400/50",
                                                available: "bg-emerald-50 text-emerald-900 border border-emerald-200"
                                            }}
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Slot Selector */}
                    <FormField
                        control={form.control}
                        name="slot"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel className="text-xs font-bold uppercase text-muted-foreground">Horario Disponibles</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="grid grid-cols-2 gap-4"
                                    >
                                        <FormItem>
                                            <FormControl>
                                                <RadioGroupItem value="DAY" id="day" className="sr-only" disabled={isSlotDisabled("DAY")} />
                                            </FormControl>
                                            <label
                                                htmlFor="day"
                                                className={cn(
                                                    "flex flex-col items-center justify-center rounded-xl border-2 p-4 cursor-pointer transition-all h-full text-center hover:bg-muted",
                                                    field.value === "DAY" ? "border-primary bg-primary/5" : "border-muted bg-transparent",
                                                    isSlotDisabled("DAY") && "opacity-30 cursor-not-allowed grayscale"
                                                )}
                                            >
                                                <span className="text-sm font-bold">Día</span>
                                                <span className="text-[10px] text-muted-foreground font-medium">9:00 AM - 6:00 PM</span>
                                            </label>
                                        </FormItem>
                                        <FormItem>
                                            <FormControl>
                                                <RadioGroupItem value="NIGHT" id="night" className="sr-only" disabled={isSlotDisabled("NIGHT")} />
                                            </FormControl>
                                            <label
                                                htmlFor="night"
                                                className={cn(
                                                    "flex flex-col items-center justify-center rounded-xl border-2 p-4 cursor-pointer transition-all h-full text-center hover:bg-muted",
                                                    field.value === "NIGHT" ? "border-primary bg-primary/5" : "border-muted bg-transparent",
                                                    isSlotDisabled("NIGHT") && "opacity-30 cursor-not-allowed grayscale"
                                                )}
                                            >
                                                <span className="text-sm font-bold">Noche</span>
                                                <span className="text-[10px] text-muted-foreground font-medium">8:00 PM - 7:00 AM</span>
                                            </label>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Promo Switch */}
                    <FormField
                        control={form.control}
                        name="isCouplePromo"
                        render={({ field }) => (
                            <FormItem className="flex items-center justify-between rounded-xl border p-4 bg-muted/20">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base font-bold flex items-center gap-2">
                                        Promo Pareja
                                        <CheckCircle2 className="h-4 w-4 text-amber-500" />
                                    </FormLabel>
                                    <FormDescription className="text-[10px]">
                                        Para escapadas románticas (2 personas)
                                    </FormDescription>
                                </div>
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

                {/* Personal Data */}
                <div className="space-y-4 pt-4 border-t">
                    <FormField
                        control={form.control}
                        name="guestName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs font-bold uppercase text-muted-foreground">Nombre completo</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="JUAN PÉREZ"
                                        className="rounded-xl h-11 uppercase"
                                        {...field}
                                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="guestWhatsapp"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold uppercase text-muted-foreground">WhatsApp</FormLabel>
                                    <FormControl>
                                        <Input placeholder="0981 123 456" className="rounded-xl h-11" {...field} />
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
                                    <FormLabel className="text-xs font-bold uppercase text-muted-foreground">Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="juan@ejemplo.com"
                                            className="rounded-xl h-11 lowercase"
                                            {...field}
                                            onChange={(e) => field.onChange(e.target.value.toLowerCase())}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* Price Display */}
                {totalPrice > 0 && (
                    <div className="p-4 bg-primary/10 rounded-xl border border-primary/20 flex justify-between items-center animate-in zoom-in-95 duration-300">
                        <div className="flex items-center gap-2">
                            <Info className="h-4 w-4 text-primary" />
                            <span className="font-bold text-primary">Total a pagar:</span>
                        </div>
                        <span className="text-2xl font-black text-primary">
                            {formatCurrency(totalPrice)}
                        </span>
                    </div>
                )}

                <Button type="submit" className="w-full h-14 rounded-xl text-lg font-black" disabled={isPending || !watchDate}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isPending ? "Procesando..." : "Confirmar Reserva"}
                </Button>
            </form>
        </Form>
    )
}
