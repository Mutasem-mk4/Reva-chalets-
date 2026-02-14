
import { validateCoupon } from '../src/app/actions/coupons';
import { createCoupon } from '../src/app/actions/admin-coupons';
import { prisma } from '../src/lib/db';

async function main() {
    console.log('🧪 Starting Coupon System Test...');

    // 1. Create a Test Coupon
    const code = 'TEST_COUPON_' + Date.now();
    console.log(`Creating coupon: ${code}`);

    // Convert float/int correctly
    await prisma.discount.create({
        data: {
            name: `Test Coupon`,
            nameAr: `كوبون تجريبي`,
            description: `Test Description`,
            type: 'PROMO',
            category: 'general',
            value: 10, // 10%
            code: code,
            isActive: true,
            maxUses: 5,
            minBookingAmount: 50,
        }
    });

    // 2. Validate Coupon
    console.log('Validating coupon...');
    const result = await validateCoupon(code, 100); // 100 JOD subtotal => should be 10 JOD discount

    if (result.valid && result.discountAmount === 10) {
        console.log('✅ Coupon validation passed: 10 JOD discount on 100 JOD subtotal');
    } else {
        console.error('❌ Coupon validation failed:', result);
    }

    // 3. Validate Constraints (Min Spend)
    const resultMin = await validateCoupon(code, 40); // 40 JOD < 50 JOD min check
    if (!resultMin.valid && resultMin.message?.includes('Minimum')) {
        console.log('✅ Min spend constraint passed');
    } else {
        console.error('❌ Min spend constraint failed:', resultMin);
    }

    // 4. Cleanup
    console.log('Cleaning up...');
    await prisma.discount.deleteMany({
        where: { code: { startsWith: 'TEST_COUPON_' } }
    });

    console.log('🎉 Test Completed');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
