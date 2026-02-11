import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const mine = searchParams.get('mine');

    try {
        let whereClause = {};

        if (mine === 'true') {
            const supabase = await createClient();
            const { data: { user }, error } = await supabase.auth.getUser();

            if (error || !user) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
            whereClause = { ownerId: user.id };
        }

        const chalets = await prisma.chalet.findMany({
            where: whereClause,
            include: {
                reviews: {
                    select: { rating: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Parse JSON fields
        const formattedChalets = chalets.map((c: any) => ({
            ...c,
            images: JSON.parse(c.images),
            amenities: JSON.parse(c.amenities),
            reviews: undefined, // Don't send full reviews list
            rating: c.reviews.length > 0
                ? c.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / c.reviews.length
                : 0
        }));

        return NextResponse.json(formattedChalets);

    } catch (error) {
        console.error('Error fetching chalets:', error);
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
        const { name, description, price, location, images, amenities, capacity } = body;

        // Validation
        if (!name || !price || !location) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newChalet = await prisma.chalet.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                location,
                images: JSON.stringify(images || []),
                amenities: JSON.stringify(amenities || []),
                capacity: parseInt(capacity) || 2,
                ownerId: user.id
            }
        });

        return NextResponse.json(newChalet);

    } catch (error) {
        console.error('Error creating chalet:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
