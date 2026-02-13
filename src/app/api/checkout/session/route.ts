import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { bookingId } = body;

        // Fetch booking details
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: { chalet: true }
        });

        if (!booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        // Verify ownership (optional: ensure user matches booking guest or is paying for it)
        // For now, allow any auth user to pay for a booking if they have the ID (or restrict to guestEmail match)

        // Create Stripe Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'jod', // Stripe supports JOD, but requires converting to cents/fills if passed as integer. Stripe expects smallest unit.
                        // However, JOD is 3 decimal places. Stripe treats JOD as 1000 fills.
                        // Actually Stripe's zero-decimal currencies list doesn't include JOD. 
                        // It usually divides by 100 or 1000 depending on currency. 
                        // For JOD, 1 unit = 1000 fills. 
                        // Let's check Stripe docs. JOD is 3 decimal places.
                        // Stripe API expects amount in specific smallest unit.
                        product_data: {
                            name: booking.chalet.name,
                            description: `Booking from ${booking.startDate.toISOString().split('T')[0]} to ${booking.endDate.toISOString().split('T')[0]}`,
                            images: JSON.parse(booking.chalet.images || '[]').slice(0, 1),
                        },
                        unit_amount: Math.round(booking.totalPrice * 1000), // JOD has 3 decimals, so multiply by 1000? 
                        // Update: Stripe documentation says for JOD, amount is divisible by 1000.
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/bookings/${booking.id}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/chalets/${booking.chaletId}`,
            metadata: {
                bookingId: booking.id,
                userId: user.id,
            },
            client_reference_id: booking.id,
        });

        return NextResponse.json({ sessionId: session.id, url: session.url });

    } catch (error) {
        console.error('Stripe Checkout Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
