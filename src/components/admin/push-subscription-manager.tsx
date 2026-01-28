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
        setLoading(true);
        try {
            // First register the sw if not exists
            const registration = await navigator.serviceWorker.register("/sw.js", {
                scope: "/"
            });

            // Wait for it to be active
            await navigator.serviceWorker.ready;

            const sub = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!)
            });

            await savePushSubscription(userId, sub, navigator.userAgent);
            setSubscription(sub);
            toast.success("Notificaciones activadas correctamente");
        } catch (error) {
            console.error("Subscription failed:", error);
            toast.error("Error al activar notificaciones. Asegúrate de dar permiso.");
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
