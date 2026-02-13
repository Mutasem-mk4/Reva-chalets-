import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
    console.warn('STRIPE_SECRET_KEY is missing. Stripe features will not work.');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
    // @ts-ignore - Stripe types might be slightly behind, but this is standard usage
    apiVersion: '2023-10-16',
    typescript: true,
});
