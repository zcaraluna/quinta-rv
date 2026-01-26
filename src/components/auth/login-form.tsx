"use client";

import { useActionState } from "react";
import { authenticate } from "@/lib/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, User, Loader2, AlertCircle } from "lucide-react";

export function LoginForm() {
    const [errorMessage, dispatch, isPending] = useActionState(
        authenticate,
        undefined
    );

    return (
        <form action={dispatch} className="space-y-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="username">Usuario</Label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            id="username"
                            name="username"
                            placeholder="Nombre de usuario"
                            required
                            className="pl-10 h-12 rounded-xl focus:ring-primary/20"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            required
                            className="pl-10 h-12 rounded-xl focus:ring-primary/20"
                        />
                    </div>
                </div>
            </div>

            {errorMessage && (
                <div className="flex items-center gap-2 text-destructive text-sm font-bold bg-destructive/10 p-3 rounded-lg animate-in fade-in slide-in-from-top-1">
                    <AlertCircle className="h-4 w-4" />
                    <p>{errorMessage}</p>
                </div>
            )}

            <Button
                type="submit"
                className="w-full h-12 rounded-xl font-black text-lg shadow-xl shadow-primary/20"
                disabled={isPending}
            >
                {isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                    "Ingresar"
                )}
            </Button>
        </form>
    );
}
