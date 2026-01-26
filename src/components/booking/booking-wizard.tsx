"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { format, isBefore, startOfDay, getDay, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, startOfWeek, endOfWeek } from "date-fns"
import { es } from "date-fns/locale"
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    Clock,
    Users,
    User,
    CheckCircle2,
    Loader2,
    Info,
    Smartphone,
    Mail
} from "lucide-react"

import { cn, formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar, CalendarDayButton } from "@/components/ui/calendar"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { createBooking } from "@/lib/actions"
import { Card } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

const formSchema = z.object({
    guestName: z.string().min(2, "Nombre muy corto"),
    guestEmail: z.string().email("Email inválido"),
    guestWhatsapp: z.string().min(8, "Mínimo 8 dígitos"),
    bookingDate: z.date(),
    slot: z.enum(["DAY", "NIGHT"]),
    isCouplePromo: z.boolean(),
})

type FormValues = z.infer<typeof formSchema>

interface BookingWizardProps {
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

export function BookingWizard({ unavailableSlots }: BookingWizardProps) {
    const [step, setStep] = React.useState(1)
    const [currentMonth, setCurrentMonth] = React.useState(new Date())
    const [isPending, startTransition] = React.useTransition()
    const [isLegendOpen, setIsLegendOpen] = React.useState(false)

    React.useEffect(() => {
        const timer = setTimeout(() => setIsLegendOpen(true), 800)
        return () => clearTimeout(timer)
    }, [])

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
        const dayOfWeek = getDay(watchDate)
        const type = watchCouple ? "COUPLE" : "GENERAL"

        let dayType: "WEEKDAY" | "SATURDAY" | "SUNDAY" = "WEEKDAY"
        if (dayOfWeek === 6) dayType = "SATURDAY"
        else if (dayOfWeek === 0) dayType = "SUNDAY"

        return PRICING[type][dayType][watchSlot as "DAY" | "NIGHT"]
    }, [watchDate, watchSlot, watchCouple])

    const totalPrice = calculatePrice()

    const modifiers = React.useMemo(() => {
        const full: Date[] = []
        const partial: Date[] = []
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
            free: (date: Date) => {
                const today = startOfDay(new Date())
                if (isBefore(date, today)) return false
                const dateStr = format(date, "yyyy-MM-dd")
                return !counts[dateStr] && !isBefore(date, today)
            }
        }
    }, [unavailableSlots])

    const nextStep = () => setStep(prev => prev + 1)
    const prevStep = () => setStep(prev => prev - 1)

    async function onSubmit(values: FormValues) {
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
                toast.success("Reserva iniciada exitosamente")
                // Possibly redirect or show success step
            }
        })
    }

    const isDateDisabled = (date: Date) => {
        if (isBefore(date, startOfDay(new Date()))) return true
        const dateStr = format(date, "yyyy-MM-dd")
        const slotsTaken = unavailableSlots.filter(s => s.date === dateStr)
        return slotsTaken.length >= 2
    }

    const isSlotDisabled = (slot: string) => {
        if (!watchDate) return false
        const dateStr = format(watchDate, "yyyy-MM-dd")
        return unavailableSlots.some(s => s.date === dateStr && s.slot === slot)
    }

    return (
        <div className="max-w-none mx-auto w-full">
            {/* Progress Bar */}
            <div className="mb-12">
                <div className="flex justify-between items-center mb-4 h-6">
                    <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Paso {step} de 5</span>
                    <span className="text-xs font-black uppercase tracking-widest text-primary">{Math.round((step / 5) * 100)}% Completado</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all duration-500 ease-out"
                        style={{ width: `${(step / 5) * 100}%` }}
                    />
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {/* STEP 1: DATE SELECTION */}
                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="text-center space-y-2 relative group">
                                <h2 className="text-4xl font-black tracking-tighter flex items-center justify-center gap-4">
                                    ¿Cuándo quieres venir?
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setIsLegendOpen(true)}
                                        className="h-10 w-10 rounded-full hover:bg-primary/10 hover:text-primary transition-all shrink-0"
                                    >
                                        <Info className="h-6 w-6" />
                                    </Button>
                                </h2>
                                <p className="text-muted-foreground font-medium">Selecciona la fecha de tu preferencia en el calendario.</p>

                                <Dialog open={isLegendOpen} onOpenChange={setIsLegendOpen}>
                                    <DialogContent className="sm:max-w-md rounded-[2.5rem] border-none shadow-2xl p-8">
                                        <DialogHeader className="mb-6">
                                            <DialogTitle className="text-3xl font-black tracking-tighter text-center">Leyenda de Disponibilidad</DialogTitle>
                                            <DialogDescription className="text-center text-muted-foreground font-medium pt-2">
                                                Colores y estados de las fechas en nuestro calendario.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4">
                                            <div className="flex items-center gap-4 p-5 rounded-3xl bg-emerald-500/5 border border-emerald-500/10">
                                                <div className="w-6 h-6 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50 shrink-0" />
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black uppercase tracking-widest text-emerald-700">Disponible</span>
                                                    <span className="text-xs font-bold text-emerald-600/60 leading-tight">Día y Noche totalmente libres para reservar</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 p-5 rounded-3xl bg-amber-400/5 border border-amber-400/10">
                                                <div className="w-6 h-6 rounded-full bg-amber-400 shadow-lg shadow-amber-400/50 shrink-0" />
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black uppercase tracking-widest text-amber-700">Parcial</span>
                                                    <span className="text-xs font-bold text-amber-600/60 leading-tight">Solo queda 1 turno libre (Día o Noche)</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 p-5 rounded-3xl bg-red-500/5 border border-red-500/10">
                                                <div className="w-6 h-6 rounded-full bg-red-500 shadow-lg shadow-red-500/50 shrink-0" />
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black uppercase tracking-widest text-red-700">Ocupado</span>
                                                    <span className="text-xs font-bold text-red-600/60 leading-tight">Ambos turnos están reservados</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={() => setIsLegendOpen(false)}
                                            className="w-full mt-6 h-14 rounded-2xl text-lg font-black"
                                        >
                                            Entendido
                                        </Button>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            <Card className="p-4 md:px-4 md:py-12 rounded-[2.5rem] border-none shadow-2xl bg-card overflow-hidden min-h-[700px] flex flex-col items-stretch relative">

                                <Calendar
                                    mode="single"
                                    selected={watchDate}
                                    onSelect={(date) => form.setValue("bookingDate", date as Date)}
                                    disabled={isDateDisabled}
                                    modifiers={modifiers}
                                    month={currentMonth}
                                    onMonthChange={setCurrentMonth}
                                    className="w-full h-full grow"
                                    modifiersClassNames={{
                                        full: "bg-red-50 text-red-600 border border-red-200 opacity-100 hover:bg-red-100/50 transition-colors",
                                        partial: "bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100/50 transition-colors",
                                        free: "bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100/50 transition-colors",
                                        selected: "ring-2 ring-primary ring-offset-4 scale-95 z-30 !bg-primary !text-primary-foreground shadow-lg shadow-primary/40 font-black rounded-xl"
                                    }}
                                    locale={es}
                                />
                            </Card>

                            <div className="flex justify-end pt-8">
                                <Button
                                    size="lg"
                                    onClick={nextStep}
                                    type="button"
                                    className="h-16 px-12 rounded-2xl text-lg font-black"
                                    disabled={!watchDate}
                                >
                                    Siguiente <ChevronRight className="ml-2" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: SLOT SELECTION */}
                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="text-center space-y-2">
                                <h2 className="text-4xl font-black tracking-tighter">¿En qué horario?</h2>
                                <p className="text-muted-foreground font-medium">Elige el turno que mejor se adapte a tu plan.</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                                <FormField
                                    control={form.control}
                                    name="slot"
                                    render={({ field }) => (
                                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-1 md:grid-cols-2 gap-6 col-span-2">
                                            <label
                                                htmlFor="day-slot"
                                                className={cn(
                                                    "group flex flex-col items-center justify-center p-8 rounded-[2.5rem] border-4 transition-all duration-300 cursor-pointer text-center",
                                                    field.value === "DAY" ? "border-primary bg-primary/5 shadow-xl shadow-primary/10" : "border-muted bg-card hover:border-muted-foreground/20",
                                                    isSlotDisabled("DAY") && "opacity-30 cursor-not-allowed grayscale pointer-events-none"
                                                )}
                                            >
                                                <RadioGroupItem value="DAY" id="day-slot" className="sr-only" disabled={isSlotDisabled("DAY")} />
                                                <div className={cn("p-4 rounded-2xl mb-4 transition-colors", field.value === "DAY" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-muted-foreground/10")}>
                                                    <Clock size={32} />
                                                </div>
                                                <span className="text-2xl font-black tracking-tight">Turno Día</span>
                                                <span className="text-sm font-bold text-muted-foreground mt-2 uppercase tracking-widest">9:00 AM - 6:00 PM</span>
                                            </label>

                                            <label
                                                htmlFor="night-slot"
                                                className={cn(
                                                    "group flex flex-col items-center justify-center p-8 rounded-[2.5rem] border-4 transition-all duration-300 cursor-pointer text-center",
                                                    field.value === "NIGHT" ? "border-primary bg-primary/5 shadow-xl shadow-primary/10" : "border-muted bg-card hover:border-muted-foreground/20",
                                                    isSlotDisabled("NIGHT") && "opacity-30 cursor-not-allowed grayscale pointer-events-none"
                                                )}
                                            >
                                                <RadioGroupItem value="NIGHT" id="night-slot" className="sr-only" disabled={isSlotDisabled("NIGHT")} />
                                                <div className={cn("p-4 rounded-2xl mb-4 transition-colors", field.value === "NIGHT" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-muted-foreground/10")}>
                                                    <Clock size={32} />
                                                </div>
                                                <span className="text-2xl font-black tracking-tight">Turno Noche</span>
                                                <span className="text-sm font-bold text-muted-foreground mt-2 uppercase tracking-widest">8:00 PM - 7:00 AM</span>
                                            </label>
                                        </RadioGroup>
                                    )}
                                />
                            </div>

                            <div className="flex justify-between items-center max-w-2xl mx-auto pt-8">
                                <Button variant="ghost" onClick={prevStep} type="button" className="h-14 px-8 rounded-2xl font-black">
                                    <ChevronLeft className="mr-2" /> Atrás
                                </Button>
                                <Button size="lg" onClick={nextStep} type="button" className="h-16 px-12 rounded-2xl text-lg font-black">
                                    Siguiente <ChevronRight className="ml-2" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: PROMO & CAPACITY */}
                    {step === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="text-center space-y-2">
                                <h2 className="text-4xl font-black tracking-tighter">¿Es una escapada para dos?</h2>
                                <p className="text-muted-foreground font-medium">Aprovecha precios especiales si vienes solo con tu pareja.</p>
                            </div>

                            <div className="max-w-2xl mx-auto space-y-8">
                                <FormField
                                    control={form.control}
                                    name="isCouplePromo"
                                    render={({ field }) => (
                                        <RadioGroup
                                            onValueChange={(val) => field.onChange(val === "COUPLE")}
                                            defaultValue={field.value ? "COUPLE" : "NORMAL"}
                                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                        >
                                            <label
                                                htmlFor="normal-booking"
                                                className={cn(
                                                    "group flex flex-col items-center justify-center p-8 rounded-[2.5rem] border-4 transition-all duration-300 cursor-pointer text-center",
                                                    !field.value ? "border-primary bg-primary/5 shadow-xl shadow-primary/10" : "border-muted bg-card hover:border-muted-foreground/20"
                                                )}
                                            >
                                                <RadioGroupItem value="NORMAL" id="normal-booking" className="sr-only" />
                                                <div className={cn("p-4 rounded-2xl mb-4 transition-colors", !field.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-muted-foreground/10")}>
                                                    <Users size={32} />
                                                </div>
                                                <span className="text-2xl font-black tracking-tight">Normal</span>
                                                <span className="text-sm font-bold text-muted-foreground mt-2 uppercase tracking-widest">Capacidad Máx: 30 Personas</span>
                                            </label>

                                            <label
                                                htmlFor="couple-booking"
                                                className={cn(
                                                    "group flex flex-col items-center justify-center p-8 rounded-[2.5rem] border-4 transition-all duration-300 cursor-pointer text-center",
                                                    field.value ? "border-amber-500 bg-amber-50 shadow-xl shadow-amber-200/50" : "border-muted bg-card hover:border-muted-foreground/20"
                                                )}
                                            >
                                                <RadioGroupItem value="COUPLE" id="couple-booking" className="sr-only" />
                                                <div className={cn("p-4 rounded-2xl mb-4 transition-colors", field.value ? "bg-amber-500 text-white" : "bg-muted text-muted-foreground group-hover:bg-muted-foreground/10")}>
                                                    <Users size={32} />
                                                </div>
                                                <span className="text-2xl font-black tracking-tight">Promo Pareja</span>
                                                <span className="text-sm font-bold text-muted-foreground mt-2 uppercase tracking-widest">Capacidad Máx: 2 Personas</span>
                                            </label>
                                        </RadioGroup>
                                    )}
                                />
                            </div>

                            <div className="flex justify-between items-center max-w-2xl mx-auto pt-8">
                                <Button variant="ghost" onClick={prevStep} type="button" className="h-14 px-8 rounded-2xl font-black">
                                    <ChevronLeft className="mr-2" /> Atrás
                                </Button>
                                <Button size="lg" onClick={nextStep} type="button" className="h-16 px-12 rounded-2xl text-lg font-black">
                                    Siguiente <ChevronRight className="ml-2" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* STEP 4: GUEST INFO */}
                    {step === 4 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="text-center space-y-2">
                                <h2 className="text-4xl font-black tracking-tighter">Queremos conocerte</h2>
                                <p className="text-muted-foreground font-medium">Estos datos son necesarios para gestionar tu reserva.</p>
                            </div>

                            <Card className="p-10 rounded-[2.5rem] border-none shadow-2xl bg-card max-w-2xl mx-auto space-y-8">
                                <FormField
                                    control={form.control}
                                    name="guestName"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
                                                <User size={14} /> Nombre Completo
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="JUAN PANTALEÓN BOGADO"
                                                    className="h-14 rounded-2xl font-bold uppercase transition-all focus:ring-4 focus:ring-primary/10 border-muted-foreground/20 text-lg"
                                                    {...field}
                                                    onChange={e => field.onChange(e.target.value.toUpperCase())}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="guestWhatsapp"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
                                                    <Smartphone size={14} /> WhatsApp
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="0981 123 456" className="h-14 rounded-2xl font-bold transition-all focus:ring-4 focus:ring-primary/10 border-muted-foreground/20 text-lg" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="guestEmail"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
                                                    <Mail size={14} /> Correo Electrónico
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="juan@ejemplo.com" className="h-14 rounded-2xl font-bold transition-all focus:ring-4 focus:ring-primary/10 border-muted-foreground/20 text-lg" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </Card>

                            <div className="flex justify-between items-center max-w-2xl mx-auto pt-8">
                                <Button variant="ghost" onClick={prevStep} type="button" className="h-14 px-8 rounded-2xl font-black">
                                    <ChevronLeft className="mr-2" /> Atrás
                                </Button>
                                <Button size="lg" onClick={nextStep} type="button" className="h-16 px-12 rounded-2xl text-lg font-black">
                                    Siguiente <ChevronRight className="ml-2" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* STEP 5: CONFIRMATION & SUMMARY */}
                    {step === 5 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="text-center space-y-2">
                                <h2 className="text-4xl font-black tracking-tighter">Todo listo para tu reserva</h2>
                                <p className="text-muted-foreground font-medium">Revisa los detalles y confirma para enviarnos tu solicitud.</p>
                            </div>

                            <Card className="p-0 rounded-[2.5rem] border-none shadow-2xl bg-card max-w-2xl mx-auto overflow-hidden">
                                <div className="p-8 bg-primary/5 border-b border-primary/10 flex items-center gap-6">
                                    <div className="h-20 w-20 rounded-3xl bg-primary flex items-center justify-center text-primary-foreground">
                                        <CheckCircle2 size={40} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-black uppercase tracking-widest text-primary/60">Quinta RV - Luque</span>
                                        <span className="text-2xl font-black tracking-tight capitalize">
                                            {format(watchDate, "EEEE d 'de' MMMM", { locale: es })}
                                        </span >
                                        <span className="font-bold text-muted-foreground">Turno {watchSlot === "DAY" ? "Día (9:00 - 18:00)" : "Noche (20:00 - 07:00)"}</span>
                                    </div>
                                </div>

                                <div className="p-8 space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-2xl bg-muted/20 border">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Cliente</span>
                                            <p className="font-bold truncate mt-1">{form.getValues("guestName")}</p>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-muted/20 border">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Tipo de Reserva</span>
                                            <p className="font-bold mt-1">{watchCouple ? "Promo Pareja" : "Normal (Hasta 30p)"}</p>
                                        </div>
                                    </div>

                                    <div className="p-8 rounded-[2rem] bg-foreground text-background space-y-6">
                                        <div className="flex justify-between items-center">
                                            <span className="font-black uppercase tracking-widest text-xs opacity-60">Monto Total a Pagar</span>
                                            <span className="text-2xl font-black">{formatCurrency(totalPrice)}</span>
                                        </div>

                                        <div className="pt-6 border-t border-background/10 space-y-2">
                                            <div className="flex justify-between items-center bg-primary text-primary-foreground p-5 rounded-2xl">
                                                <div className="flex flex-col">
                                                    <span className="font-black uppercase tracking-widest text-[10px] opacity-80">Seña para Confirmar</span>
                                                    <span className="text-2xl font-black">{formatCurrency(totalPrice * 0.5)}</span>
                                                </div>
                                                <div className="flex flex-col items-end gap-1">
                                                    <span className="text-3xl font-black">50%</span>
                                                </div>
                                            </div>
                                            <p className="text-[10px] font-medium italic opacity-60 text-center uppercase tracking-widest pt-2">
                                                Para confirmar la reservación debes enviar esta seña
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            <div className="flex justify-between items-center max-w-2xl mx-auto pt-8">
                                <Button variant="ghost" onClick={prevStep} type="button" className="h-14 px-8 rounded-2xl font-black">
                                    <ChevronLeft className="mr-2" /> Atrás
                                </Button>
                                <Button
                                    size="lg"
                                    type="submit"
                                    className="h-16 px-12 rounded-2xl text-lg font-black min-w-[200px]"
                                    disabled={isPending}
                                >
                                    {isPending ? <Loader2 className="animate-spin" /> : "Finalizar Reserva"}
                                </Button>
                            </div>
                        </div>
                    )}
                </form>
            </Form>
        </div>
    )
}

