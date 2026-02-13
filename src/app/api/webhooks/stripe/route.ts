import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/db';
import Stripe from 'stripe';

export async function POST(req: Request) {
    const body = await req.text();
    const headerPayload = await headers();
    const signature = headerPayload.get('Stripe-Signature') as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET || ''
        );
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === 'checkout.session.completed') {
        const bookingId = session.metadata?.bookingId;

        if (bookingId) {
            await prisma.booking.update({
                where: { id: bookingId },
                data: {
                    status: 'CONFIRMED',
                    paymentStatus: 'PAID',
                    stripePaymentIntentId: session.payment_intent as string,
                    stripeSessionId: session.id,
                },
            });
            console.log(`Booking ${bookingId} confirmed via webhook.`);
        }
    }

    return new NextResponse(null, { status: 200 });
}
