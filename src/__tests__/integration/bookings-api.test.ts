/**
 * @jest-environment node
 */
import { GET } from '@/app/api/bookings/route';
import { PATCH } from '@/app/api/bookings/[id]/route';
import { prisma } from '@/lib/db';
import { NextRequest } from 'next/server';

// Mock Supabase
jest.mock('@/lib/supabase/server', () => ({
    createClient: jest.fn().mockResolvedValue({
        auth: {
            getUser: jest.fn().mockResolvedValue({
                data: { user: { id: 'host-user-id', email: 'host@example.com' } },
                error: null
            })
        }
    })
}));

// Mock Prisma
jest.mock('@/lib/db', () => ({
    prisma: {
        chalet: {
            findMany: jest.fn()
        },
        booking: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn()
        }
    }
}));

describe('/api/bookings Integration Tests', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET (Host)', () => {
        it('should fetch bookings for host chalets', async () => {
            (prisma.chalet.findMany as jest.Mock).mockResolvedValue([{ id: 'chalet-1' }]);
            (prisma.booking.findMany as jest.Mock).mockResolvedValue([
                { id: 'booking-1', chaletId: 'chalet-1', status: 'PENDING' }
            ]);

            const req = new Request('http://localhost:3000/api/bookings?host=true') as unknown as NextRequest;
            const res = await GET(req);
            const data = await res.json();

            expect(res.status).toBe(200);
            expect(data).toHaveLength(1);
            expect(prisma.chalet.findMany).toHaveBeenCalledWith(expect.objectContaining({
                where: { ownerId: 'host-user-id' }
            }));
        });
    });

    describe('PATCH', () => {
        it('should update booking status if owner', async () => {
            // 1. Mock finding the booking to verify ownership
            (prisma.booking.findUnique as jest.Mock).mockResolvedValue({
                id: 'booking-1',
                chalet: { ownerId: 'host-user-id' }
            });

            // 2. Mock the update
            (prisma.booking.update as jest.Mock).mockResolvedValue({
                id: 'booking-1',
                status: 'CONFIRMED'
            });

            const req = new Request('http://localhost:3000/api/bookings/booking-1', {
                method: 'PATCH',
                body: JSON.stringify({ status: 'CONFIRMED' })
            }) as unknown as NextRequest;

            const params = Promise.resolve({ id: 'booking-1' });
            const res = await PATCH(req, { params });
            const data = await res.json();

            expect(res.status).toBe(200);
            expect(data.status).toBe('CONFIRMED');
        });

        it('should return 403 if not owner', async () => {
            (prisma.booking.findUnique as jest.Mock).mockResolvedValue({
                id: 'booking-1',
                chalet: { ownerId: 'other-user-id' }
            });

            const req = new Request('http://localhost:3000/api/bookings/booking-1', {
                method: 'PATCH',
                body: JSON.stringify({ status: 'CONFIRMED' })
            }) as unknown as NextRequest;

            const params = Promise.resolve({ id: 'booking-1' });
            const res = await PATCH(req, { params });

            expect(res.status).toBe(403);
        });

        it('should return 400 for invalid status', async () => {
            const req = new Request('http://localhost:3000/api/bookings/booking-1', {
                method: 'PATCH',
                body: JSON.stringify({ status: 'INVALID' })
            }) as unknown as NextRequest;

            const params = Promise.resolve({ id: 'booking-1' });
            const res = await PATCH(req, { params });

            expect(res.status).toBe(400);
        });
    });
});
