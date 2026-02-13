import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/db';
import { sendBookingConfirmation, sendHostAlert } from '@/lib/email';
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
            const updatedBooking = await prisma.booking.update({
                where: { id: bookingId },
                data: {
                    status: 'CONFIRMED',
                    paymentStatus: 'PAID',
                    stripePaymentIntentId: session.payment_intent as string,
                    stripeSessionId: session.id,
                },
                include: { chalet: true } // Fetch chalet details for email
            });

            console.log(`Booking ${bookingId} confirmed via webhook.`);

            // Send Email Notifications
            try {
                const emailData = {
                    to: session.customer_details?.email || updatedBooking.guestEmail,
                    guestName: updatedBooking.guestName,
                    chaletName: updatedBooking.chalet.name,
                    checkIn: updatedBooking.startDate.toLocaleDateString(),
                    checkOut: updatedBooking.endDate.toLocaleDateString(),
                    nights: updatedBooking.nights,
                    guestCount: updatedBooking.guestCount,
                    totalPrice: updatedBooking.totalPrice,
                    bookingId: updatedBooking.id
                };

                // 1. Send Confirmation to Guest
                await sendBookingConfirmation(emailData);

                // 2. Send Alert to Host/Admin
                await sendHostAlert(emailData);

            } catch (emailError) {
                console.error("Failed to send booking emails:", emailError);
                // Don't fail the webhook if email fails
            }
        }
    }

    return new NextResponse(null, { status: 200 });
}
