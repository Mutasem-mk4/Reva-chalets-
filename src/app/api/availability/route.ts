import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const chaletId = searchParams.get('chaletId');

        if (!chaletId) {
            return NextResponse.json({ error: 'Chalet ID is required' }, { status: 400 });
        }

        const supabase = await createClient();
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Verify ownership
        const chalet = await prisma.chalet.findUnique({
            where: { id: chaletId },
            select: { ownerId: true }
        });

        if (!chalet) {
            return NextResponse.json({ error: 'Chalet not found' }, { status: 404 });
        }

        // Allow owner or admin to view
        if (chalet.ownerId !== user.id && user.user_metadata.role !== 'admin') {
            // actually for availability, maybe guests need to see it too? 
            // But this API is for the DASHBOARD (private details maybe?). 
            // Public availability is usually public. 
            // However, for the dashboard, we definitely want to allow the owner.
            // Let's restrict it for now to owner/admin as this might expose guest details or specific block info.
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const bookings = await prisma.booking.findMany({
            where: {
                chaletId,
                status: { in: ['CONFIRMED', 'PENDING'] }, // Show pending too so host knows
                endDate: { gte: new Date() } // Future bookings only? Or all? Let's get all for now.
            },
            select: {
                id: true,
                startDate: true,
                endDate: true,
                status: true,
                guestName: true // Host needs to know who booked
            }
        });

        return NextResponse.json(bookings);
    } catch (error) {
        console.error('Failed to fetch availability:', error);
        return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { chaletId, startDate, endDate } = body;

        if (!chaletId || !startDate || !endDate) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Verify ownership
        const chalet = await prisma.chalet.findUnique({
            where: { id: chaletId },
            select: { ownerId: true }
        });

        if (!chalet || chalet.ownerId !== user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Create a "Blocked" booking
        // We act as if the host booked it themselves, or use a specific flag/status if we had one.
        // Since we don't have a 'BLOCKED' status in the BookingStatus enum (unless I allow 'CONFIRMED' with special name),
        // I should check schema. 
        // Schema has: PENDING, CONFIRMED, CANCELLED, COMPLETED.
        // I will use 'CONFIRMED' and maybe set guestName to 'Hosted Blocked' or similar.

        const booking = await prisma.booking.create({
            data: {
                chaletId,
                userId: user.id, // Host blocked it
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                guestName: 'Manual Block',
                guestEmail: user.email || '',
                guestPhone: '',
                totalPrice: 0,
                status: 'CONFIRMED',
                paymentStatus: 'PAID' // It's a block
            }
        });

        return NextResponse.json(booking);
    } catch (error) {
        console.error('Failed to block dates:', error);
        return NextResponse.json({ error: 'Failed to block dates' }, { status: 500 });
    }
}
