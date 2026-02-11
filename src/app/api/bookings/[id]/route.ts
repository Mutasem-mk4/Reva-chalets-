import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createClient } from '@/lib/supabase/server';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const booking = await prisma.booking.findUnique({
            where: { id },
            include: { chalet: true }
        });

        if (!booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        return NextResponse.json(booking);
    } catch (error) {
        console.error('Failed to fetch booking:', error);
        return NextResponse.json({ error: 'Failed to fetch booking' }, { status: 500 });
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supabase = await createClient();
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { status } = body;

        if (!['CONFIRMED', 'REJECTED'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        // Verify ownership
        const booking = await prisma.booking.findUnique({
            where: { id },
            include: { chalet: { select: { ownerId: true } } }
        });

        if (!booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        if (booking.chalet.ownerId !== user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const updatedBooking = await prisma.booking.update({
            where: { id },
            data: { status }
        });

        return NextResponse.json(updatedBooking);

    } catch (error) {
        console.error('Failed to update booking:', error);
        return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
    }
}
