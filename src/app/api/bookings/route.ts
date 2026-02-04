import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            chaletId,
            userId,
            startDate,
            endDate,
            guestName,
            guestEmail,
            guestPhone,
            guestCount,
            totalPrice,
            pricePerNight,
            nights
        } = body;

        if (!chaletId || !startDate || !endDate || !guestName || !guestEmail || !guestPhone) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const booking = await prisma.booking.create({
            data: {
                chaletId,
                userId: userId || null,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                guestName,
                guestEmail,
                guestPhone,
                guestCount: guestCount || 1,
                totalPrice: totalPrice || 0,
                pricePerNight: pricePerNight || 0,
                nights: nights || 1,
                status: 'CONFIRMED',
                paymentStatus: 'PAID',
            },
        });

        // Also create a BookingGroup automatically
        await prisma.bookingGroup.create({
            data: {
                bookingId: booking.id,
                hostId: userId || 'anonymous', // In a real app, you'd need a real user ID
            }
        });

        return NextResponse.json(booking);
    } catch (error) {
        console.error('Failed to create booking:', error);
        return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        const bookings = await prisma.booking.findMany({
            where: userId ? { userId } : {},
            include: { chalet: true },
            orderBy: { startDate: 'desc' }
        });

        return NextResponse.json(bookings);
    } catch (error) {
        console.error('Failed to fetch bookings:', error);
        return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
    }
}
