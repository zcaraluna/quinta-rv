export default function BookingMaintenance() {
    return (
        <main className="min-h-screen flex items-center justify-center px-4">
            <div className="max-w-md text-center space-y-4">
                <h1 className="text-3xl font-black tracking-tighter">
                    Página de reservas en mantenimiento
                </h1>
                <p className="text-muted-foreground font-medium">
                    Estamos realizando ajustes internos en el sistema de reservas.
                </p>
                <p className="text-sm text-muted-foreground/80">
                    Por favor, vuelve a intentarlo más tarde o contacta con nosotros por WhatsApp
                    para gestionar tu reserva de forma manual.
                </p>
            </div>
        </main>
    );
}

