import webpush from 'web-push';
import { db } from './db';
import { pushSubscriptions } from './schema';
import { eq } from 'drizzle-orm';

// Configure VAPID keys
if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
    webpush.setVapidDetails(
        process.env.VAPID_SUBJECT || 'mailto:info@quintarv.com.py',
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
    );
}

export async function sendAdminPushNotification(payload: {
    title: string;
    body: string;
    url?: string;
}) {
    // Fetch all active subscriptions
    const subs = await db.select().from(pushSubscriptions);

    const notifications = subs.map(async (sub) => {
        try {
            const pushConfig = JSON.parse(sub.subscription);
            await webpush.sendNotification(
                pushConfig,
                JSON.stringify(payload)
            );
        } catch (error: any) {
            console.error('Push error:', error);
            // If subscription is invalid/expired (404/410), remove it from DB
            if (error.statusCode === 404 || error.statusCode === 410) {
                await db.delete(pushSubscriptions).where(eq(pushSubscriptions.id, sub.id));
            }
        }
    });

    await Promise.all(notifications);
}
