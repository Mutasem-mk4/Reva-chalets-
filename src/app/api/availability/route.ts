import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const chaletId = searchParams.get('chaletId');

    try {
        // GET bookings for specific chalet or all user's chalets
        const whereClause = chaletId
            ? { chaletId, chalet: { ownerId: user.id } }
            : { chalet: { ownerId: user.id } };

        const bookings = await prisma.booking.findMany({
            where: {
                ...whereClause,
                status: { in: ['CONFIRMED', 'PENDING'] }
            },
            select: {
                id: true,
                startDate: true,
                endDate: true,
                status: true,
                guestName: true,
                chalet: {
                    select: { name: true }
                }
            }
        });

        return NextResponse.json(bookings);
    } catch (error) {
        console.error('Calendar fetch error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { chaletId, startDate, endDate, type } = body; // type: 'BLOCK' or 'Unblock'

        // Verify ownership
        const chalet = await prisma.chalet.findUnique({
            where: { id: chaletId }
        });

        if (!chalet || chalet.ownerId !== user.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        if (type === 'BLOCK') {
            // Create a "fake" booking to block the dates
            // In a real app we might have a separate 'Unavailability' model
            await prisma.booking.create({
                data: {
                    chaletId,
                    startDate: new Date(startDate),
                    endDate: new Date(endDate),
                    guestName: 'Blocked by Host',
                    guestEmail: user.email || 'host@reva.com',
                    guestPhone: 'N/A',
                    totalPrice: 0,
                    status: 'CONFIRMED',
                    paymentStatus: 'PAID' // Blocked dates don't need payment
                }
            });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Calendar update error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
