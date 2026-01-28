import { NextResponse } from 'next/server';
import { checkAndSendReminders } from '@/lib/actions';

export async function GET(request: Request) {
    // Optional: Add a simple secret to avoid unauthorized calls
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');

    if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const result = await checkAndSendReminders();
        return NextResponse.json({ success: true, ...result });
    } catch (error: any) {
        console.error('Cron error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
