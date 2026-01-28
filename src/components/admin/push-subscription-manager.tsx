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
        const registration = await navigator.serviceWorker.ready;
        const sub = await registration.pushManager.getSubscription();
        setSubscription(sub);
        setLoading(false);
    };

    const subscribe = async () => {
        setLoading(true);
        try {
            const registration = await navigator.serviceWorker.register("/sw.js");
            const sub = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!)
            });

            await savePushSubscription(userId, sub, navigator.userAgent);
            setSubscription(sub);
            toast.success("Notificaciones activadas");
        } catch (error) {
            console.error("Subscription failed:", error);
            toast.error("Error al activar notificaciones");
        } finally {
            setLoading(false);
        }
    };

    if (!isSupported) return null;

    if (subscription) {
        return (
            <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
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
            className="rounded-full gap-2 text-[10px] font-black uppercase tracking-widest h-8 border-primary/20 text-primary hover:bg-primary/5"
        >
            {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <BellOff className="h-3 w-3" />}
            Activar Alertas Celular
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
