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
    const isConfirmed = booking.status === 'CONFIRMED';

    // WhatsApp Message Generator
    const waNumber = "595983145432"; // Correct format for 0983145432
    const waMessage = `Hola! Envío comprobante para la reserva ${booking.id.slice(0, 8)} a nombre de ${booking.guestName}.`;
    const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;

    return (
        <main className="min-h-screen bg-muted/20 py-12 px-4 flex justify-center items-start">
            <Card className="max-w-md w-full shadow-lg border-t-4 border-t-primary">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4">
                        {isConfirmed ? (
                            <CheckCircle2 className="w-16 h-16 text-green-500" />
                        ) : showPayment ? (
                            <Clock className="w-16 h-16 text-amber-500" />
                        ) : (
                            <AlertCircle className="w-16 h-16 text-destructive" />
                        )}
                    </div>
                    <CardTitle>{isConfirmed ? "¡Reserva Confirmada!" : showPayment ? "Reserva Pendiente" : "Reserva Expirada"}</CardTitle>
                    <CardDescription>ID: {booking.id.slice(0, 8)}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Countdown Section */}
                    {showPayment && booking.expiresAt && (
                        <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg border border-amber-200 dark:border-amber-800 text-center space-y-2">
                            <p className="text-sm text-amber-800 dark:text-amber-300 font-medium">
                                Tu pre-reserva expira en:
                            </p>
                            <CountdownTimer targetDate={booking.expiresAt} />
                        </div>
                    )}

                    {/* Confirmed QR Section */}
                    {isConfirmed && (
                        <div className="text-center space-y-4">
                            <p className="text-sm text-muted-foreground">Presenta este código al ingresar</p>
                            <BookingQRCode value={`https://casaquinta.app/admin/verify/${booking.id}`} />
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Fecha</span>
                            <span className="font-bold">{formatDate(booking.bookingDate)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Horario</span>
                            <Badge variant="secondary" className="font-bold">
                                {booking.slot === 'DAY' ? "Día (9am - 6pm)" : "Noche (8pm - 7am)"}
                            </Badge>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Tipo</span>
                            <span className="font-medium text-xs">
                                {booking.isCouplePromo === "true" ? "Promo Pareja (2 pers.)" : "General (Hasta 30 pers.)"}
                            </span>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center">
                            <span className="font-semibold">Total</span>
                            <span className="text-xl font-bold text-primary">{formatCurrency(booking.totalPrice)}</span>
                        </div>
                    </div>

                    {/* Payment Info Section */}
                    {showPayment && (
                        <div className="bg-muted p-4 rounded-lg space-y-2 text-sm border-l-4 border-l-primary">
                            <p className="font-bold">Datos para Transferencia:</p>
                            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
                                <span className="text-muted-foreground">Titular:</span>
                                <span className="font-bold">Evelin Vargas</span>
                                <span className="text-muted-foreground">Alias (Cél):</span>
                                <span className="font-mono font-bold">0982336705</span>
                            </div>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="flex-col gap-3">
                    {showPayment && (
                        <Button className="w-full bg-green-600 hover:bg-green-700 text-white" asChild>
                            <a href={waLink} target="_blank" rel="noopener noreferrer">
                                <MessageCircle className="mr-2 h-4 w-4" />
                                Enviar Comprobante
                            </a>
                        </Button>
                    )}

                    {isConfirmed && (
                        <Button variant="outline" className="w-full" asChild>
                            <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer">
                                <MapPin className="mr-2 h-4 w-4" />
                                Ver Ubicación
                            </a>
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </main>
    )
}
