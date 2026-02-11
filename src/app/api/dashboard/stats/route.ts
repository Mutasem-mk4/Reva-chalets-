import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/db';
import { BookingStatus } from '@prisma/client';

interface DashboardStat {
    label: string;
    value: string;
    type: 'revenue' | 'bookings' | 'chalets' | 'rating';
}

interface RecentBooking {
    id: string;
    guestName: string;
    chaletName: string;
    dates: string;
    status: string;
    amount: string;
}

export async function GET(request: Request) {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const userId = user.id;

        // 1. Get chalets owned by user
        const chalets = await prisma.chalet.findMany({
            where: { ownerId: userId },
            select: { id: true, rating: true }
        });

        const chaletIds = chalets.map((c: { id: string }) => c.id);

        // 2. Get bookings for these chalets
        const bookings = await prisma.booking.findMany({
            where: { chaletId: { in: chaletIds } },
            select: {
                id: true,
                status: true,
                totalPrice: true,
                startDate: true,
                endDate: true
            }
        });

        // 3. Calculate Stats
        const totalRevenue = bookings
            .filter((b: { status: BookingStatus }) => b.status === 'CONFIRMED' || b.status === 'COMPLETED')
            .reduce((sum: number, b: { totalPrice: number }) => sum + b.totalPrice, 0);

        const activeBookingsCount = bookings.filter((b: { status: BookingStatus, endDate: Date }) =>
            (b.status === 'CONFIRMED' || b.status === 'PENDING') &&
            new Date(b.endDate) >= new Date()
        ).length;

        const chaletCount = chalets.length;

        const avgRating = chalets.length > 0
            ? chalets.reduce((sum: number, c: { rating: number }) => sum + c.rating, 0) / chalets.length
            : 0;

        // 4. Get recent bookings (last 5)
        const recentBookingsRaw = await prisma.booking.findMany({
            where: { chaletId: { in: chaletIds } },
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                chalet: { select: { name: true } },
            }
        });

        const recentBookings: RecentBooking[] = recentBookingsRaw.map((b: any) => ({
            id: b.id,
            guestName: b.guestName,
            chaletName: b.chalet.name,
            dates: `${new Date(b.startDate).toLocaleDateString()} - ${new Date(b.endDate).toLocaleDateString()}`,
            status: b.status,
            amount: `${b.totalPrice} JOD`
        }));

        const stats: DashboardStat[] = [
            { label: 'Total Revenue', value: `${totalRevenue.toLocaleString()} JOD`, type: 'revenue' },
            { label: 'Active Bookings', value: activeBookingsCount.toString(), type: 'bookings' },
            { label: 'Chalets Listed', value: chaletCount.toString(), type: 'chalets' },
            { label: 'Avg. Rating', value: avgRating.toFixed(1), type: 'rating' },
        ];

        return NextResponse.json({
            stats,
            recentBookings
        });

    } catch (error) {
        console.error('Dashboard stats error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
