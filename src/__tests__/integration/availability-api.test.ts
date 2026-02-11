/**
 * @jest-environment node
 */
import { GET, POST } from '@/app/api/availability/route';
import { prisma } from '@/lib/db';

// Mock Supabase
jest.mock('@/lib/supabase/server', () => ({
    createClient: jest.fn().mockResolvedValue({
        auth: {
            getUser: jest.fn().mockResolvedValue({
                data: { user: { id: 'owner-id', email: 'owner@example.com', user_metadata: { role: 'HOST' } } },
                error: null
            })
        }
    })
}));

// Mock Prisma
jest.mock('@/lib/db', () => ({
    prisma: {
        chalet: {
            findUnique: jest.fn()
        },
        booking: {
            findMany: jest.fn(),
            create: jest.fn()
        }
    }
}));

describe('/api/availability Integration Tests', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET', () => {
        it('should fetch bookings for a chalet', async () => {
            (prisma.chalet.findUnique as jest.Mock).mockResolvedValue({ id: 'chalet-1', ownerId: 'owner-id' });
            (prisma.booking.findMany as jest.Mock).mockResolvedValue([
                { id: 'b1', startDate: new Date(), endDate: new Date(), status: 'CONFIRMED' }
            ]);

            const req = new Request('http://localhost:3000/api/availability?chaletId=chalet-1');
            const res = await GET(req);
            const data = await res.json();

            expect(res.status).toBe(200);
            expect(data).toHaveLength(1);
        });

        it('should fail if not owner (implicit check in our logic)', async () => {
            (prisma.chalet.findUnique as jest.Mock).mockResolvedValue({ id: 'chalet-1', ownerId: 'other-id' });
            // Mock user is 'owner-id' from global mock, so this should fail

            const req = new Request('http://localhost:3000/api/availability?chaletId=chalet-1');
            const res = await GET(req);

            // Actually our GET implementation might allow admin, but let's assume strict owner check for this test based on current impl
            // Checking impl... 
            // if (chalet.ownerId !== user.id && user.user_metadata.role !== 'admin') return 403

            // But wait, our mock user doesn't have role in metadata. 
            // We should update the mock or expect 403.
            // Let's expect 403 because role is missing/undefined != 'admin'
            expect(res.status).toBe(403);
        });
    });

    describe('POST', () => {
        it('should create a blocked booking', async () => {
            (prisma.chalet.findUnique as jest.Mock).mockResolvedValue({ id: 'chalet-1', ownerId: 'owner-id' });
            (prisma.booking.create as jest.Mock).mockResolvedValue({
                id: 'block-1',
                status: 'CONFIRMED',
                guestName: 'Manual Block'
            });

            const req = new Request('http://localhost:3000/api/availability', {
                method: 'POST',
                body: JSON.stringify({
                    chaletId: 'chalet-1',
                    startDate: '2023-01-01',
                    endDate: '2023-01-02'
                })
            });

            const res = await POST(req);
            const data = await res.json();

            expect(res.status).toBe(200);
            expect(data.guestName).toBe('Manual Block');
        });
    });
});
