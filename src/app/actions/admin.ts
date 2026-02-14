'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

// Helper to verify admin role
async function verifyAdmin() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || user.user_metadata.role !== 'ADMIN') {
        throw new Error('Unauthorized');
    }
}

export async function approveBooking(bookingId: string) {
    await verifyAdmin();

    try {
        await prisma.booking.update({
            where: { id: bookingId },
            data: {
                status: 'CONFIRMED',
                paymentStatus: 'PAID' // Assuming manual approval implies payment verified
            }
        });
        revalidatePath('/admin/bookings');
        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        console.error('Failed to approve booking:', error);
        return { success: false, error: 'Failed to update booking' };
    }
}

export async function cancelBooking(bookingId: string) {
    await verifyAdmin();

    // TODO: Add Stripe Refund logic here if needed

    try {
        await prisma.booking.update({
            where: { id: bookingId },
            data: {
                status: 'CANCELLED',
                paymentStatus: 'REFUNDED'
            }
        });
        revalidatePath('/admin/bookings');
        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        console.error('Failed to cancel booking:', error);
        return { success: false, error: 'Failed to update booking' };
    }
}
