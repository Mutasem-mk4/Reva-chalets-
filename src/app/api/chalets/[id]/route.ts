import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/db';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const chalet = await prisma.chalet.findUnique({
            where: { id },
            include: {
                reviews: {
                    include: { user: { select: { name: true, image: true } } }
                }
            }
        });

        if (!chalet) {
            return NextResponse.json({ error: 'Chalet not found' }, { status: 404 });
        }

        // Parse JSON fields
        const formattedChalet = {
            ...chalet,
            images: JSON.parse(chalet.images),
            amenities: JSON.parse(chalet.amenities),
            reviews: chalet.reviews.map(r => ({
                id: r.id,
                user: r.user.name || 'Guest',
                date: r.createdAt.toLocaleDateString(),
                rating: r.rating,
                comment: r.comment
            }))
        };

        return NextResponse.json(formattedChalet);

    } catch (error) {
        console.error('Error fetching chalet:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Verify ownership
        const existingChalet = await prisma.chalet.findUnique({
            where: { id },
            select: { ownerId: true }
        });

        if (!existingChalet) {
            return NextResponse.json({ error: 'Chalet not found' }, { status: 404 });
        }

        if (existingChalet.ownerId !== user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await request.json();
        const { name, description, price, location, images, amenities, capacity } = body;

        const updatedChalet = await prisma.chalet.update({
            where: { id },
            data: {
                name,
                description,
                price: price ? parseFloat(price) : undefined,
                location,
                images: images ? JSON.stringify(images) : undefined,
                amenities: amenities ? JSON.stringify(amenities) : undefined,
                capacity: capacity ? parseInt(capacity) : undefined,
            }
        });

        return NextResponse.json(updatedChalet);

    } catch (error) {
        console.error('Error updating chalet:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Verify ownership
        const existingChalet = await prisma.chalet.findUnique({
            where: { id },
            select: { ownerId: true }
        });

        if (!existingChalet) {
            return NextResponse.json({ error: 'Chalet not found' }, { status: 404 });
        }

        if (existingChalet.ownerId !== user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await prisma.chalet.delete({
            where: { id }
        });

        return NextResponse.json({ message: 'Chalet deleted successfully' });

    } catch (error) {
        console.error('Error deleting chalet:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
