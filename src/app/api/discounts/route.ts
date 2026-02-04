import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { DiscountType } from '@prisma/client';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type') as DiscountType | null;
        const category = searchParams.get('category');

        const where: any = {
            // By default, only show active discounts or those with valid dates
            validUntil: {
                gte: new Date(),
            }
        };

        if (type) {
            where.type = type;
        }

        if (category) {
            where.category = category;
        }

        // If DB is reachable, query it. 
        // Fallback to mock data if DB fails (common in dev environments without local DB running)
        try {
            const discounts = await prisma.discount.findMany({
                where,
                orderBy: {
                    createdAt: 'desc',
                },
                include: {
                    partner: true,
                }
            });
            return NextResponse.json(discounts);
        } catch (dbError) {
            console.warn("Database connection failed, returning mock data for discounts", dbError);

            // Mock Data
            const mockDiscounts = [
                {
                    id: '1',
                    name: 'Gas Station Discount',
                    nameAr: 'خصم محطة المناصير',
                    description: '10% off on premium gas',
                    type: 'ZAD',
                    category: 'gas',
                    value: 10,
                    partner: { name: 'Manaseer' }
                },
                {
                    id: '2',
                    name: 'Best Burger',
                    nameAr: 'أطيب برجر',
                    description: 'Buy 1 Get 1 Free',
                    type: 'ZAD',
                    category: 'meat', // or food
                    value: 50,
                    partner: { name: 'Firefly' }
                },
                {
                    id: '3',
                    name: 'Bowling Night',
                    nameAr: 'ليلة البولنج',
                    description: 'Free shoes rental',
                    type: 'KAIF',
                    category: 'bowling',
                    value: 100, // fixed amount
                    partner: { name: 'Strikers' }
                }
            ];

            const filtered = mockDiscounts.filter(d =>
                (!type || d.type === type) &&
                (!category || d.category === category)
            );

            return NextResponse.json(filtered);
        }

    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch discounts' }, { status: 500 });
    }
}
