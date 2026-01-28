import { db } from "@/lib/db";
import { bookings } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { formatCurrency, formatDate } from "@/lib/utils";
import { CountdownTimer } from "@/components/booking/countdown";
import { BookingQRCode } from "@/components/booking/qr-code";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MessageCircle, MapPin, CheckCircle2, Clock, AlertCircle } from "lucide-react";

export default async function StatusPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Validate UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) return notFound();

    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));

    if (!booking) return notFound();

    // Logic to determine visual state
    const isExpired = booking.status === 'PENDING_PAYMENT' && booking.expiresAt && new Date() > booking.expiresAt;
    const showPayment = booking.status === 'PENDING_PAYMENT' && !isExpired;
    const isReserved = booking.status === 'RESERVED';
    const isConfirmed = booking.status === 'CONFIRMED';
    const hasPasse = isReserved || isConfirmed;

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "";

    // WhatsApp Message Generator
    const waNumber = "595983145432"; // Correct format for 0983145432
    const waMessage = `Hola! Envío comprobante para la reserva ${booking.id.slice(0, 8)} a nombre de ${booking.guestName}.`;
    const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;

    return (
        <main className="min-h-screen bg-muted/20 pt-32 pb-20 px-4 flex justify-center items-start">
            <Card className="max-w-md w-full shadow-xl border-t-8 border-t-primary rounded-[2rem] overflow-hidden">
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto mb-4">
                        {hasPasse ? (
                            <CheckCircle2 className="w-20 h-20 text-green-500 animate-in zoom-in-50 duration-500" />
                        ) : showPayment ? (
                            <Clock className="w-20 h-20 text-amber-500 animate-pulse" />
                        ) : (
                            <AlertCircle className="w-20 h-20 text-destructive" />
                        )}
                    </div>
                    <CardTitle className="text-2xl font-black">
                        {isConfirmed ? "¡Pago Completado!" : isReserved ? "¡Reserva Confirmada!" : showPayment ? "Reserva Pendiente" : "Reserva Expirada"}
                    </CardTitle>
                    <CardDescription className="font-mono text-xs">ID: {booking.id}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Countdown Section */}
                    {showPayment && booking.expiresAt && (
                        <div className="bg-amber-50 dark:bg-amber-950/30 p-5 rounded-2xl border-2 border-amber-200 dark:border-amber-800 text-center space-y-2">
                            <p className="text-xs text-amber-800 dark:text-amber-300 font-black uppercase tracking-widest">
                                Tu pre-reserva expira en:
                            </p>
                            <CountdownTimer targetDate={booking.expiresAt} />
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground font-medium">Nombre</span>
                            <span className="font-black uppercase">{booking.guestName}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground font-medium">Fecha</span>
                            <span className="font-black">{formatDate(booking.bookingDate)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground font-medium">Horario</span>
                            <Badge variant="secondary" className="font-black px-3 rounded-full">
                                {booking.slot === 'DAY'
                                    ? `Día (${booking.isCouplePromo === "true" ? "10:00 - 19:00" : "09:00 - 18:00"})`
                                    : `Noche (${booking.isCouplePromo === "true" ? "20:00 - 09:00" : "20:00 - 07:00"})`
                                }
                            </Badge>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground font-medium">Tipo</span>
                            <span className="font-bold text-xs bg-muted px-2 py-1 rounded">
                                {booking.isCouplePromo === "true" ? "PROMO PAREJA (2 PERS.)" : "GENERAL (HASTA 30 PERS.)"}
                            </span>
                        </div>
                        <Separator className="bg-muted-foreground/10" />
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-muted-foreground">Total</span>
                            <span className="text-2xl font-black text-primary">{formatCurrency(booking.totalPrice)}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-dashed border-muted-foreground/20">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">Seña para Confirmar</span>
                                <span className="text-xs font-bold text-muted-foreground italic">Equivale al 50% del total</span>
                            </div>
                            <span className="text-xl font-black text-primary/80">{formatCurrency(Number(booking.totalPrice) * 0.5)}</span>
                        </div>
                    </div>

                    {/* Payment Info Section */}
                    {showPayment && (
                        <div className="bg-muted/50 p-5 rounded-2xl space-y-3 text-sm border-2 border-dashed border-muted-foreground/20">
                            <p className="font-black uppercase text-[10px] text-muted-foreground tracking-tighter">Datos para Transferencia:</p>
                            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
                                <span className="text-muted-foreground">Titular:</span>
                                <span className="font-bold">Evelin Vargas</span>
                                <span className="text-muted-foreground">Alias (Cél):</span>
                                <span className="font-mono font-black text-base">0982336705</span>
                            </div>
                        </div>
                    )}

                    {/* QR Section */}
                    {hasPasse && (
                        <div className="text-center space-y-4 pt-4 border-t border-dashed">
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{isConfirmed ? "Pase de Entrada (Pagado)" : "Pase de Entrada (Confirmado)"}</p>
                            <BookingQRCode value={`${baseUrl}/estado/${booking.id}`} id={booking.id} />
                        </div>
                    )}
                </CardContent>

                <CardFooter className="flex-col gap-3 pb-8">
                    {showPayment && (
                        <>
                            <Button className="w-full h-14 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-black text-lg shadow-lg" asChild>
                                <a href={waLink} target="_blank" rel="noopener noreferrer">
                                    <MessageCircle className="mr-2 h-6 w-6" />
                                    Enviar Comprobante
                                </a>
                            </Button>
                            <div className="pt-4 w-full flex flex-col items-center gap-2">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase">ID de Reserva Provisional</p>
                                <BookingQRCode value={`${baseUrl}/estado/${booking.id}`} id={booking.id} />
                            </div>
                        </>
                    )}

                    {hasPasse && (
                        <Button variant="outline" className="w-full h-12 rounded-2xl font-bold border-2" asChild>
                            <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer">
                                <MapPin className="mr-2 h-5 w-5" />
                                Ver Ubicación en Maps
                            </a>
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </main>
    )
}
