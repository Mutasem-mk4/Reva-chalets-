import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const booking = await prisma.booking.findUnique({
            where: { id: params.id },
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
