import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            rating,
            comment,
            chaletId,
            userId,
            groupId // Optional: to link with a specific booking group
        } = body;

        if (!rating || !chaletId || !userId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Create the review
        const review = await prisma.review.create({
            data: {
                rating: parseInt(rating),
                comment: comment || '',
                chaletId,
                userId,
            },
        });

        // 1. Update Chalet average rating (Optional but good)
        const reviews = await prisma.review.findMany({
            where: { chaletId },
            select: { rating: true }
        });

        const avgRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;

        await prisma.chalet.update({
            where: { id: chaletId },
            data: { rating: avgRating }
        });

        // 2. Grant "Kaif" discount eligibility if checking from a GroupMember perspective
        if (groupId) {
            await prisma.groupMember.updateMany({
                where: {
                    groupId,
                    userId
                },
                data: {
                    hasRated: true,
                    canUseKaif: true
                }
            });
        }

        return NextResponse.json(review);
    } catch (error) {
        console.error('Failed to create review:', error);
        return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const chaletId = searchParams.get('chaletId');
        const userId = searchParams.get('userId');

        const reviews = await prisma.review.findMany({
            where: {
                ...(chaletId ? { chaletId } : {}),
                ...(userId ? { userId } : {}),
            },
            include: {
                user: {
                    select: { name: true, image: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(reviews);
    } catch (error) {
        console.error('Failed to fetch reviews:', error);
        return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
    }
}
