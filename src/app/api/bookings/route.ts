import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createClient } from '@/lib/supabase/server';
import { sendBookingConfirmation, sendHostAlert } from '@/lib/email';

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

        // Only create a BookingGroup if the user is authenticated (has a userId)
        if (userId) {
            await prisma.bookingGroup.create({
                data: {
                    bookingId: booking.id,
                    hostId: userId,
                }
            });
        }

        // Send Email Notifications (Fire and forget to not block response)
        (async () => {
            try {
                // Fetch chalet name for email
                const chalet = await prisma.chalet.findUnique({
                    where: { id: chaletId },
                    select: { name: true }
                });

                if (chalet) {
                    const emailData = {
                        to: guestEmail,
                        guestName,
                        chaletName: chalet.name,
                        checkIn: new Date(startDate).toLocaleDateString(),
                        checkOut: new Date(endDate).toLocaleDateString(),
                        nights: nights || 1,
                        guestCount: guestCount || 1,
                        totalPrice: totalPrice || 0,
                        bookingId: booking.id
                    };

                    await sendBookingConfirmation(emailData);
                    await sendHostAlert(emailData);
                }
            } catch (error) {
                console.error('Async email sending failed:', error);
            }
        })();

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
        const host = searchParams.get('host');

        let whereClause: any = {};

        if (host === 'true') {
            const supabase = await createClient();
            const { data: { user }, error } = await supabase.auth.getUser();

            if (error || !user) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }

            // Find chalets owned by this user
            const chalets = await prisma.chalet.findMany({
                where: { ownerId: user.id },
                select: { id: true }
            });

            const chaletIds = chalets.map((c: { id: string }) => c.id);
            whereClause = { chaletId: { in: chaletIds } };
        } else if (userId) {
            whereClause = { userId };
        }

        const bookings = await prisma.booking.findMany({
            where: whereClause,
            include: { chalet: { select: { name: true, images: true } } },
            orderBy: { createdAt: 'desc' }
        });

        // Parse chalet images if they are JSON strings (depending on how prisma returns them, usually object if Json type, but let's be safe if it's string in DB)
        // Actually prisma Json type returns object.

        return NextResponse.json(bookings);
    } catch (error) {
        console.error('Failed to fetch bookings:', error);
        return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
    }
}
