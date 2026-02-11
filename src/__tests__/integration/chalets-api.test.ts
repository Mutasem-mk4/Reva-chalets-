/**
 * @jest-environment node
 */
import { GET, POST } from '@/app/api/chalets/route';
import { createMocks } from 'node-mocks-http';
import { prisma } from '@/lib/db';

// Mock Supabase
jest.mock('@/lib/supabase/server', () => ({
    createClient: jest.fn().mockResolvedValue({
        auth: {
            getUser: jest.fn().mockResolvedValue({
                data: { user: { id: 'test-user-id', email: 'test@example.com' } },
                error: null
            })
        }
    })
}));

// Mock Prisma
jest.mock('@/lib/db', () => ({
    prisma: {
        chalet: {
            findMany: jest.fn(),
            create: jest.fn()
        }
    }
}));

describe('/api/chalets Integration Tests', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET', () => {
        it('should fetch user chalets when authorized', async () => {
            const mockChalets = [
                {
                    id: '1',
                    name: 'Chalet 1',
                    images: '["img1.jpg"]',
                    amenities: '["wifi"]',
                    ownerId: 'test-user-id',
                    reviews: [{ rating: 5 }]
                }
            ];

            (prisma.chalet.findMany as jest.Mock).mockResolvedValue(mockChalets);

            const req = new Request('http://localhost:3000/api/chalets?mine=true');
            const res = await GET(req);
            const data = await res.json();

            expect(res.status).toBe(200);
            expect(data).toHaveLength(1);
            expect(data[0].name).toBe('Chalet 1');
            expect(prisma.chalet.findMany).toHaveBeenCalledWith(expect.objectContaining({
                where: { ownerId: 'test-user-id' }
            }));
        });
    });

    describe('POST', () => {
        it('should create a new chalet', async () => {
            const newChalet = {
                name: 'New Chalet',
                description: 'Desc',
                price: 100,
                location: 'Amman',
                images: ['img.jpg'],
                amenities: ['wifi'],
                capacity: 4
            };

            (prisma.chalet.create as jest.Mock).mockResolvedValue({
                id: 'new-id',
                ...newChalet,
                price: 100, // as float
                capacity: 4,
                images: JSON.stringify(newChalet.images),
                amenities: JSON.stringify(newChalet.amenities),
                ownerId: 'test-user-id',
                createdAt: new Date(),
                updatedAt: new Date()
            });

            const req = new Request('http://localhost:3000/api/chalets', {
                method: 'POST',
                body: JSON.stringify(newChalet)
            });

            const res = await POST(req);
            const data = await res.json();

            expect(res.status).toBe(200);
            expect(data.id).toBe('new-id');
            expect(prisma.chalet.create).toHaveBeenCalled();
        });

        it('should return 400 if missing fields', async () => {
            const req = new Request('http://localhost:3000/api/chalets', {
                method: 'POST',
                body: JSON.stringify({})
            });

            const res = await POST(req);
            expect(res.status).toBe(400);
        });
    });
});
