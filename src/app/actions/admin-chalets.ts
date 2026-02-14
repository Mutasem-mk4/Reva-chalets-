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

export async function toggleChaletStatus(chaletId: string, currentStatus: string) {
    await verifyAdmin();

    const newStatus = currentStatus === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';

    try {
        await prisma.chalet.update({
            where: { id: chaletId },
            data: { status: newStatus }
        });
        revalidatePath('/admin/chalets');
        revalidatePath('/chalets');
        return { success: true };
    } catch (error) {
        console.error('Failed to toggle chalet status:', error);
        return { success: false, error: 'Failed to update chalet' };
    }
}

export async function deleteChalet(chaletId: string) {
    await verifyAdmin();

    try {
        await prisma.chalet.delete({
            where: { id: chaletId }
        });
        revalidatePath('/admin/chalets');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete chalet:', error);
        return { success: false, error: 'Failed to delete chalet' };
    }
}

export async function approveChalet(chaletId: string) {
    await verifyAdmin();

    try {
        await prisma.chalet.update({
            where: { id: chaletId },
            data: {
                isApproved: true,
                status: 'PUBLISHED'
            }
        });
        revalidatePath('/admin/chalets');
        return { success: true };
    } catch (error) {
        console.error('Failed to approve chalet:', error);
        return { success: false, error: 'Failed to approve chalet' };
    }
}
