'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

// Helper to verify admin role
async function verifyAdmin() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || user.user_metadata.role !== 'ADMIN') {
        throw new Error('Unauthorized');
    }
}

export type CreateCouponInput = {
    code: string;
    value: number; // Percentage (e.g., 10 for 10%) or Fixed Amount
    type: 'PERCENTAGE' | 'FIXED';
    maxUses?: number;
    minBookingAmount?: number;
    validUntil?: Date;
};

export async function createCoupon(input: CreateCouponInput) {
    await verifyAdmin();

    try {
        await prisma.discount.create({
            data: {
                name: `Promo: ${input.code}`,
                nameAr: `كوبون: ${input.code}`,
                description: `${input.value}${input.type === 'PERCENTAGE' ? '%' : ' JOD'} OFF`,
                type: 'PROMO',
                category: 'general',
                value: input.value,
                code: input.code.toUpperCase(),
                isActive: true,
                maxUses: input.maxUses,
                minBookingAmount: input.minBookingAmount,
                validUntil: input.validUntil,
            }
        });
        revalidatePath('/admin/coupons');
        return { success: true };
    } catch (error) {
        console.error('Failed to create coupon:', error);
        return { success: false, error: 'Failed to create coupon. Code might already exist.' };
    }
}

export async function toggleCouponStatus(id: string, currentStatus: boolean) {
    await verifyAdmin();

    try {
        await prisma.discount.update({
            where: { id },
            data: { isActive: !currentStatus }
        });
        revalidatePath('/admin/coupons');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to update coupon' };
    }
}

export async function deleteCoupon(id: string) {
    await verifyAdmin();

    try {
        await prisma.discount.delete({
            where: { id }
        });
        revalidatePath('/admin/coupons');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to delete coupon' };
    }
}
