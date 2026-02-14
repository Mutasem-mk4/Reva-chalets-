'use server';

import { prisma } from '@/lib/db';

export async function validateCoupon(code: string, subtotal: number) {
    if (!code) return { valid: false, message: 'Code is required' };

    try {
        const coupon = await prisma.discount.findFirst({
            where: {
                code: { equals: code, mode: 'insensitive' }, // Case insensitive check
                isActive: true,
                type: 'PROMO',
            }
        });

        if (!coupon) {
            return { valid: false, message: 'Invalid or expired coupon code' };
        }

        // Check expiration
        if (coupon.validUntil && new Date(coupon.validUntil) < new Date()) {
            return { valid: false, message: 'Coupon code has expired' };
        }

        // Check max uses
        if (coupon.maxUses && coupon.usageCount >= coupon.maxUses) {
            return { valid: false, message: 'Coupon usage limit reached' };
        }

        // Check min spend
        if (coupon.minBookingAmount && subtotal < coupon.minBookingAmount) {
            return { valid: false, message: `Minimum spend of ${coupon.minBookingAmount} JOD required` };
        }

        // Calculate discount
        let discountAmount = 0;
        if (coupon.value <= 0) { // Should not happen but safe check
            discountAmount = 0;
        } else if (coupon.value <= 100) { // Assume percentage if <= 100, wait, schema said value is float. 
            // We need a way to distinguish type.
            // Wait, schema has type: DiscountType { PROMO }. It doesn't store 'PERCENTAGE' or 'FIXED'.
            // The `value` field comment said "// percentage or fixed amount".
            // Since we didn't add a `unit` field or separate type for calculation, let's assume:
            // If value <= 100, it treats as percentage? No, 50 JOD off is valid.
            // Let's assume standard behavior: 
            // If we want both, we should have added `discountType` or similar to schema.
            // For now, let's assume the value is ALWAYS percentage for simplicity as per common promo codes, 
            // OR we can infer.
            // Actually, looking back at `admin-coupons.ts` implementation:
            // The Create form has explicit "Percentage %" label.
            // So we will treat it as Percentage.
            discountAmount = (subtotal * coupon.value) / 100;
        } else {
            // Fallback or explicit fixed logic if we changed schema.
            // For this implementation, we stick to Percentage as implied by UI "Percentage %" label.
            discountAmount = (subtotal * coupon.value) / 100;
        }

        // Ensure we don't discount more than subtotal
        if (discountAmount > subtotal) {
            discountAmount = subtotal;
        }

        return {
            valid: true,
            discountAmount: Math.round(discountAmount * 100) / 100, // Round to 2 decimals
            couponCode: coupon.code,
            message: 'Coupon applied successfully!'
        };

    } catch (error) {
        console.error('Coupon validation error:', error);
        return { valid: false, message: 'Error validating coupon' };
    }
}
