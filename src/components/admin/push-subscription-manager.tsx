"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Bell, BellOff, Loader2 } from "lucide-react";
import { savePushSubscription } from "@/lib/actions";
import { toast } from "sonner";

export function PushSubscriptionManager({ userId }: { userId: string }) {
    const [isSupported, setIsSupported] = useState(false);
    const [subscription, setSubscription] = useState<PushSubscription | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window) {
            setIsSupported(true);
            checkSubscription();
        } else {
            setLoading(false);
        }
    }, []);

    const checkSubscription = async () => {
        try {
            const registration = await navigator.serviceWorker.getRegistration();
            if (registration) {
                const sub = await registration.pushManager.getSubscription();
                setSubscription(sub);
            }
        } catch (error) {
            console.error("Check subscription failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const subscribe = async () => {
        const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

        if (!vapidKey) {
            toast.error("Error de configuración: Falta NEXT_PUBLIC_VAPID_PUBLIC_KEY en el servidor.");
            console.error("VAPID Public Key is missing from environment variables.");
            return;
        }

        setLoading(true);
        try {
            console.log("Registering Service Worker...");
            const registration = await navigator.serviceWorker.register("/sw.js", {
                scope: "/"
            });

            console.log("Service Worker registered. Waiting for ready...");
            await navigator.serviceWorker.ready;

            console.log("Subscribing to Push Manager...");
            const sub = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(vapidKey)
            });

            console.log("Subscription successful. Saving to DB...");
            await savePushSubscription(userId, sub, navigator.userAgent);
            setSubscription(sub);
            toast.success("Notificaciones activadas correctamente");
        } catch (error: any) {
            console.error("Subscription failed:", error);
            if (error.name === 'NotAllowedError') {
                toast.error("Permiso denegado. Habilita las notificaciones en la configuración del navegador.");
            } else {
                toast.error(`Error: ${error.message || "No se pudo activar"}`);
            }
        } finally {
            setLoading(false);
        }
    };

    if (!isSupported) return null;

    if (subscription) {
        return (
            <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                <Bell className="h-3 w-3" />
                Alertas Activas
            </div>
        );
    }

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={subscribe}
            disabled={loading}
            className="rounded-full gap-2 text-[10px] font-black uppercase tracking-widest h-8 border-primary/20 text-primary hover:bg-primary/5 transition-all active:scale-95"
        >
            {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <BellOff className="h-3 w-3" />}
            Activar Notificaciones
        </Button>
    );
}

function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
