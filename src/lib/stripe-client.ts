import { loadStripe } from '@stripe/stripe-js';

// Make sure to add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to your .env
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export const redirectToCheckout = async (bookingId: string) => {
    try {
        const response = await fetch('/api/checkout/session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ bookingId }),
        });

        const data = await response.json();

        if (data.url) {
            window.location.href = data.url; // Redirect to Stripe hosted page
        } else {
            console.error('No URL returned from checkout API');
            throw new Error('Checkout failed');
        }

    } catch (error) {
        console.error('Redirect to checkout error:', error);
        throw error;
    }
};
