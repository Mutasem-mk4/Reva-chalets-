
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { code, price } = body;

        if (!code) {
            return NextResponse.json({ error: 'Code is required' }, { status: 400 });
        }

        const discount = await prisma.discount.findFirst({
            where: {
                code: {
                    equals: code,
                    mode: 'insensitive', // Case insensitive
                },
                isActive: true,
                type: 'PROMO' // Only allow PROMO type codes here? Or allow ZAD/KAIF if they have codes?
                // Schema says code is unique, so checking code is enough.
            },
            include: {
                partner: true
            }
        });

        if (!discount) {
            return NextResponse.json({ valid: false, message: 'Invalid code' }, { status: 404 });
        }

        // 1. Check Expiry
        if (discount.validUntil && new Date(discount.validUntil) < new Date()) {
            return NextResponse.json({ valid: false, message: 'Code expired' }, { status: 400 });
        }

        // 2. Check Usage Limit
        if (discount.maxUses !== null && discount.usageCount >= discount.maxUses) {
            return NextResponse.json({ valid: false, message: 'Code usage limit reached' }, { status: 400 });
        }

        // 3. Check Minimum Spend
        if (discount.minBookingAmount && price < discount.minBookingAmount) {
            return NextResponse.json({
                valid: false,
                message: `Minimum spend of ${discount.minBookingAmount} required`
            }, { status: 400 });
        }

        // Calculate Discount
        let discountAmount = 0;
        // Assuming value is percentage for now based on previous chats, but schema has float value.
        // Let's assume logic: if value < 100, it's percentage. If > 100, it's fixed amount?
        // Or usually value is just value. 
        // Checking schema: value Float.
        // Let's assume it's Percentage for PROMO codes based on typical implementation or check if there is a type field for calculation.
        // There is no specific field for "isPercentage".
        // Let's assume percentage for now as standard.

        // Wait, looking at previous conversation summaries or code, Phase 41 mentioned "percentage-based keys".
        discountAmount = (price * discount.value) / 100;

        // Cap discount? No field for cap.

        return NextResponse.json({
            valid: true,
            code: discount.code,
            type: discount.type,
            value: discount.value,
            discountAmount: discountAmount,
            message: 'Coupon applied successfully'
        });

    } catch (error) {
        console.error('Verify Coupon Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
