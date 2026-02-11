/** @jest-environment node */
import { POST } from './route';
import { prisma } from '@/lib/db';
import { NextRequest } from 'next/server';

// Mock prisma
jest.mock('@/lib/db', () => ({
    prisma: {
        review: {
            create: jest.fn(),
            findMany: jest.fn(),
        },
        chalet: {
            update: jest.fn(),
        },
        groupMember: {
            updateMany: jest.fn(),
        },
    },
}));

describe('API: /api/reviews', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 400 if required fields are missing', async () => {
        const req = new NextRequest('http://localhost:3000/api/reviews', {
            method: 'POST',
            body: JSON.stringify({ rating: 5 }), // Missing chaletId and userId
        });

        const res = await POST(req);
        expect(res.status).toBe(400);
        const data = await res.json();
        expect(data.error).toBe('Missing required fields');
    });

    it('should create a review and update chalet rating', async () => {
        const mockReview = { id: 'rev-1', rating: 5, comment: 'Great!', chaletId: 'c1', userId: 'u1' };
        (prisma.review.create as jest.Mock).mockResolvedValue(mockReview);
        (prisma.review.findMany as jest.Mock).mockResolvedValue([{ rating: 5 }, { rating: 4 }]);

        const req = new NextRequest('http://localhost:3000/api/reviews', {
            method: 'POST',
            body: JSON.stringify({
                rating: 5,
                comment: 'Great!',
                chaletId: 'c1',
                userId: 'u1'
            }),
        });

        const res = await POST(req);
        expect(res.status).toBe(200);

        const data = await res.json();
        expect(data.id).toBe('rev-1');

        // Check prisma updates
        expect(prisma.chalet.update).toHaveBeenCalledWith({
            where: { id: 'c1' },
            data: { rating: 4.5 } // (5+4)/2
        });
    });

    it('should grant Kaif discount if groupId is provided', async () => {
        (prisma.review.create as jest.Mock).mockResolvedValue({ id: 'rev-1' });
        (prisma.review.findMany as jest.Mock).mockResolvedValue([{ rating: 5 }]);

        const req = new NextRequest('http://localhost:3000/api/reviews', {
            method: 'POST',
            body: JSON.stringify({
                rating: 5,
                chaletId: 'c1',
                userId: 'u1',
                groupId: 'g1'
            }),
        });

        await POST(req);

        expect(prisma.groupMember.updateMany).toHaveBeenCalledWith({
            where: {
                groupId: 'g1',
                userId: 'u1'
            },
            data: {
                hasRated: true,
                canUseKaif: true
            }
        });
    });
});
