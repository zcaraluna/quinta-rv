import Image from "next/image";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
    return (
        <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="w-full max-w-md space-y-8 relative">
                <div className="text-center space-y-4">
                    <div className="flex justify-center">
                        <div className="p-4 rounded-3xl bg-primary/10 shadow-inner">
                            <Image src="/quinta-rv.png" alt="Logo" width={80} height={80} className="rounded-2xl" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-4xl font-black tracking-tighter text-foreground">
                            Panel Administrativo
                        </h1>
                        <p className="text-muted-foreground font-medium italic">
                            Quinta RV - Acceso Seguro
                        </p>
                    </div>
                </div>

                <div className="bg-card p-8 rounded-[2.5rem] shadow-2xl border border-white/20 backdrop-blur-sm">
                    <LoginForm />
                </div>

                <p className="text-center text-xs text-muted-foreground font-medium uppercase tracking-widest pt-4">
                    © 2026 Quinta RV - Reservado para administración
                </p>
            </div>
        </main>
    );
}
