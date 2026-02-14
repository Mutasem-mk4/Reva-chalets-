import { prisma } from '@/lib/db';

export type AdminStats = {
    totalRevenue: number;
    totalBookings: number;
    activeChalets: number;
    totalUsers: number;
    recentBookings: any[];
};

export async function getAdminStats(): Promise<AdminStats> {
    const totalRevenueAgg = await prisma.booking.aggregate({
        _sum: {
            totalPrice: true,
        },
        where: {
            status: 'CONFIRMED', // or COMPLETED
            paymentStatus: 'PAID'
        }
    });

    const totalBookings = await prisma.booking.count();

    // Chalets that are published
    const activeChalets = await prisma.chalet.count({
        where: {
            status: 'PUBLISHED'
        }
    });

    const totalUsers = await prisma.user.count();

    const recentBookings = await prisma.booking.findMany({
        take: 5,
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            user: {
                select: {
                    name: true,
                    email: true
                }
            },
            chalet: {
                select: {
                    name: true
                }
            }
        }
    });

    return {
        totalRevenue: totalRevenueAgg._sum.totalPrice || 0,
        totalBookings,
        activeChalets,
        totalUsers,
        recentBookings
    };
}
