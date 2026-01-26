"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock, Loader2, Save, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updatePassword } from "@/lib/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

export function PasswordChangeForm({ userId }: { userId: string }) {
    const [isPending, setIsPending] = useState(false);
    const router = useRouter();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    async function onSubmit(values: FormValues) {
        setIsPending(true);
        try {
            const result = await updatePassword(userId, values.password);
            if (result.success) {
                toast.success("Contraseña actualizada correctamente");
                router.push("/admin");
                router.refresh();
            } else {
                toast.error("Error al actualizar la contraseña");
            }
        } catch (error) {
            toast.error("Ocurrió un error inesperado");
        } finally {
            setIsPending(false);
        }
    }

    return (
        <div className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex gap-3 text-amber-800">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <div className="text-sm">
                    <p className="font-bold">Acción Requerida</p>
                    <p>Por seguridad, debes cambiar tu contraseña predeterminada antes de continuar al panel de administración.</p>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-bold">Nueva Contraseña</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            className="pl-10 h-12 rounded-xl"
                                            {...field}
                                        />
                                    </div>
                                </FormControl>
                                <FormDescription>Mínimo 6 caracteres.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-bold">Confirmar Nueva Contraseña</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            className="pl-10 h-12 rounded-xl"
                                            {...field}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        className="w-full h-14 rounded-2xl font-black text-lg shadow-xl shadow-primary/20"
                        disabled={isPending}
                    >
                        {isPending ? (
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        ) : (
                            <CheckCircle2 className="mr-2 h-5 w-5" />
                        )}
                        {isPending ? "Actualizando..." : "Cambiar Contraseña"}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
