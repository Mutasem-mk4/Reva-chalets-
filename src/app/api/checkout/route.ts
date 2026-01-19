import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession, BookingCheckoutData } from '@/lib/stripe';
import { bookingSchema, sanitizeObject } from '@/lib/validations';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
    try {
        // Rate limiting
        const ip = request.headers.get('x-forwarded-for') || 'anonymous';
        const rateLimit = checkRateLimit(ip, 'default');

        if (!rateLimit.allowed) {
            return NextResponse.json(
                { error: 'Too many requests. Please try again later.' },
                {
                    status: 429,
                    headers: getRateLimitHeaders(rateLimit),
                }
            );
        }

        const body = await request.json();
        const sanitizedBody = sanitizeObject(body);

        // Validate input (partial validation for checkout)
        const { chaletId, startDate, endDate, guestName, guestEmail, guestPhone, guestCount } = sanitizedBody;

        if (!chaletId || !startDate || !endDate || !guestName || !guestEmail || !guestPhone) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Get origin for redirect URLs
        const origin = request.headers.get('origin') || 'http://localhost:3000';

        // Prepare checkout data
        const checkoutData: BookingCheckoutData = {
            chaletId: sanitizedBody.chaletId,
            chaletName: sanitizedBody.chaletName || 'Luxury Chalet',
            chaletImage: sanitizedBody.chaletImage,
            pricePerNight: parseFloat(sanitizedBody.pricePerNight) || 150,
            nights: parseInt(sanitizedBody.nights) || 1,
            totalPrice: parseFloat(sanitizedBody.totalPrice) || 150,
            startDate: sanitizedBody.startDate,
            endDate: sanitizedBody.endDate,
            guestName: sanitizedBody.guestName,
            guestEmail: sanitizedBody.guestEmail,
            guestPhone: sanitizedBody.guestPhone,
            guestCount: parseInt(sanitizedBody.guestCount) || 1,
            userId: sanitizedBody.userId,
        };

        // Create Stripe checkout session
        const session = await createCheckoutSession(
            checkoutData,
            `${origin}/en/booking/success?session_id={CHECKOUT_SESSION_ID}`,
            `${origin}/en/booking/cancel`
        );

        return NextResponse.json({
            sessionId: session.id,
            url: session.url,
        });

    } catch (error) {
        console.error('Checkout error:', error);
        return NextResponse.json(
            { error: 'Failed to create checkout session' },
            { status: 500 }
        );
    }
}
