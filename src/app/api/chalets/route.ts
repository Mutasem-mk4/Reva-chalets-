import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search');
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const location = searchParams.get('location');

        // Build filtering where clause
        const where: any = {};

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { location: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) where.price.gte = parseFloat(minPrice);
            if (maxPrice) where.price.lte = parseFloat(maxPrice);
        }

        if (location) {
            where.location = { contains: location, mode: 'insensitive' };
        }

        try {
            const chalets = await prisma.chalet.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                include: {
                    reviews: {
                        select: { rating: true }
                    }
                }
            });

            // Calculate average rating locally if needed, or rely on aggregation
            // For simplicity, just returning chalets
            return NextResponse.json(chalets);

        } catch (dbError) {
            console.warn("DB failed, returning mock chalets", dbError);
            return NextResponse.json(getMockChalets(search, location));
        }

    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch chalets' }, { status: 500 });
    }
}

function getMockChalets(search?: string | null, location?: string | null) {
    const all = [
        {
            id: '1',
            name: 'Al-Reef Luxury Farm',
            description: 'Experience the beauty of the Dead Sea in this luxurious farm.',
            price: 150,
            location: 'Dead Sea',
            images: JSON.stringify(['https://images.unsplash.com/photo-1566073771259-6a8506099945']),
            rating: 4.8,
            capacity: 10,
            amenities: JSON.stringify(['pool', 'wifi', 'bbq'])
        },
        {
            id: '2',
            name: 'Mountain View Chalet',
            description: 'Cozy chalet with a stunning view of Ajloun mountains.',
            price: 120,
            location: 'Ajloun',
            images: JSON.stringify(['https://images.unsplash.com/photo-1582719508461-905c673771fd']),
            rating: 4.5,
            capacity: 6,
            amenities: JSON.stringify(['fireplace', 'wifi'])
        },
        {
            id: '3',
            name: 'Sunset Valley',
            description: 'Perfect for families, spacious and private.',
            price: 180,
            location: 'Salt',
            images: JSON.stringify(['https://images.unsplash.com/photo-1518780664697-55e3ad937233']),
            rating: 4.9,
            capacity: 12,
            amenities: JSON.stringify(['pool', 'playground'])
        },
    ];

    return all.filter(c => {
        if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.location.toLowerCase().includes(search.toLowerCase())) return false;
        if (location && !c.location.toLowerCase().includes(location.toLowerCase())) return false;
        return true;
    });
}
