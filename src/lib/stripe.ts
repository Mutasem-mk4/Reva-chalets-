import Stripe from 'stripe';

// Server-side Stripe instance
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-12-15.clover',
    typescript: true,
});

// Constants
export const CURRENCY = 'jod'; // Jordanian Dinar

// Helper to format amount for Stripe (cents/fils)
export function formatAmountForStripe(amount: number): number {
    // Stripe expects amounts in smallest currency unit
    // For JOD, that's fils (1 JOD = 1000 fils)
    return Math.round(amount * 1000);
}

// Helper to format amount from Stripe
export function formatAmountFromStripe(amount: number): number {
    return amount / 1000;
}

// Create checkout session metadata type
export interface CheckoutMetadata {
    chaletId: string;
    chaletName: string;
    userId: string;
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    guestCount: string;
    startDate: string;
    endDate: string;
    nights: string;
    pricePerNight: string;
    totalPrice: string;
    [key: string]: string; // Index signature for MetadataParam compatibility
}

// Booking data for checkout
export interface BookingCheckoutData {
    chaletId: string;
    chaletName: string;
    chaletImage?: string;
    pricePerNight: number;
    nights: number;
    totalPrice: number;
    startDate: string;
    endDate: string;
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    guestCount: number;
    userId?: string;
}

// Create a Stripe checkout session
export async function createCheckoutSession(
    data: BookingCheckoutData,
    successUrl: string,
    cancelUrl: string
): Promise<Stripe.Checkout.Session> {
    const metadata: CheckoutMetadata = {
        chaletId: data.chaletId,
        chaletName: data.chaletName,
        userId: data.userId || 'guest',
        guestName: data.guestName,
        guestEmail: data.guestEmail,
        guestPhone: data.guestPhone,
        guestCount: data.guestCount.toString(),
        startDate: data.startDate,
        endDate: data.endDate,
        nights: data.nights.toString(),
        pricePerNight: data.pricePerNight.toString(),
        totalPrice: data.totalPrice.toString(),
    };

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        customer_email: data.guestEmail,
        line_items: [
            {
                price_data: {
                    currency: CURRENCY,
                    product_data: {
                        name: data.chaletName,
                        description: `${data.nights} night${data.nights > 1 ? 's' : ''} stay (${data.startDate} to ${data.endDate})`,
                        images: data.chaletImage ? [data.chaletImage] : undefined,
                    },
                    unit_amount: formatAmountForStripe(data.pricePerNight),
                },
                quantity: data.nights,
            },
        ],
        metadata,
        success_url: successUrl,
        cancel_url: cancelUrl,
    });

    return session;
}
