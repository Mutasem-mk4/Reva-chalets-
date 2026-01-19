import { NextRequest, NextResponse } from 'next/server';
import { stripe, CheckoutMetadata } from '@/lib/stripe';
import { prisma } from '@/lib/db';
import { sendBookingConfirmation } from '@/lib/email';
import Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
        return NextResponse.json(
            { error: 'Missing stripe-signature header' },
            { status: 400 }
        );
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err);
        return NextResponse.json(
            { error: 'Webhook signature verification failed' },
            { status: 400 }
        );
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object as Stripe.Checkout.Session;
            await handleCheckoutCompleted(session);
            break;
        }

        case 'payment_intent.succeeded': {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            console.log('Payment succeeded:', paymentIntent.id);
            break;
        }

        case 'payment_intent.payment_failed': {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            console.log('Payment failed:', paymentIntent.id);
            break;
        }

        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    const metadata = session.metadata as unknown as CheckoutMetadata;

    if (!metadata?.chaletId) {
        console.error('No chalet ID in session metadata');
        return;
    }

    try {
        // Create booking in database
        const booking = await prisma.booking.create({
            data: {
                chaletId: metadata.chaletId,
                userId: metadata.userId !== 'guest' ? metadata.userId : null,
                startDate: new Date(metadata.startDate),
                endDate: new Date(metadata.endDate),
                guestName: metadata.guestName,
                guestEmail: metadata.guestEmail,
                guestPhone: metadata.guestPhone,
                guestCount: parseInt(metadata.guestCount),
                totalPrice: parseFloat(metadata.totalPrice),
                pricePerNight: parseFloat(metadata.pricePerNight),
                nights: parseInt(metadata.nights),
                status: 'CONFIRMED',
                paymentStatus: 'PAID',
                stripeSessionId: session.id,
                stripePaymentIntentId: session.payment_intent as string,
            },
        });

        console.log('Booking created:', booking.id);

        // Send confirmation email
        await sendBookingConfirmation({
            to: metadata.guestEmail,
            guestName: metadata.guestName,
            chaletName: metadata.chaletName,
            checkIn: metadata.startDate,
            checkOut: metadata.endDate,
            nights: parseInt(metadata.nights),
            guestCount: parseInt(metadata.guestCount),
            totalPrice: parseFloat(metadata.totalPrice),
            bookingId: booking.id,
        });

    } catch (error) {
        console.error('Failed to create booking:', error);
        throw error;
    }
}

