import { NextResponse } from 'next/server';
import { sendDiscountEmail } from '@/lib/email';
import { z } from 'zod';

const subscribeSchema = z.object({
    email: z.string().email('Invalid email address'),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validate input
        const result = subscribeSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { error: result.error.issues[0].message },
                { status: 400 }
            );
        }

        const { email } = result.data;

        // In a real app, save to Supabase "subscribers" table here
        // For now, we'll just log and send the email
        console.log(`New subscriber: ${email}`);

        // Send discount email
        const emailResult = await sendDiscountEmail({
            to: email,
            code: 'WELCOME10', // Static code for now
        });

        if (!emailResult.success) {
            console.error('Failed to send discount email:', emailResult.error);
            return NextResponse.json(
                { error: 'Failed to send welcome email' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Subscription error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
