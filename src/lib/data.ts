import { prisma } from './db';

export type Review = {
    id: string;
    user: string;
    date: string;
    rating: number;
    comment: string;
};

export type Chalet = {
    id: string;
    name: string;
    description: string;
    price: number;
    location: string;
    images: string[];
    amenities: string[];
    capacity: number;
    rating: number;
    coordinates?: {
        lat: number;
        lng: number;
    };
    reviews: Review[];
};

export const MOCK_CHALETS: Chalet[] = [
    {
        id: '1',
        name: 'Royal Dead Sea Villa',
        description: 'A stunning villa overlooking the Dead Sea with private infinity pool. Perfect for a luxurious getaway.',
        price: 250,
        location: 'Dead Sea, Jordan',
        images: ['/images/chalet-1.png', '/images/chalet-2.png', '/images/chalet-3.png', '/images/chalet-4.png'],
        amenities: ['Pool', 'WiFi', 'BBQ', 'AC', 'Parking'],
        capacity: 6,
        rating: 4.9,
        coordinates: { lat: 31.7196, lng: 35.5891 }, // Dead Sea
        reviews: [
            { id: 'r1', user: 'Sarah M.', date: 'Oct 2024', rating: 5, comment: 'Absolutely breathtaking views! The infinity pool is to die for.' },
            { id: 'r2', user: 'James K.', date: 'Sep 2024', rating: 5, comment: 'Super clean and the host was very responsive. Highly recommended.' }
        ]
    }
];

export async function getChalets(): Promise<Chalet[]> {
    try {
        const dbChalets = await prisma.chalet.findMany({
            include: {
                reviews: {
                    include: { user: true }
                }
            }
        });

        if (dbChalets.length === 0) return MOCK_CHALETS;

        return dbChalets.map(c => ({
            id: c.id,
            name: c.name,
            description: c.description,
            price: c.price,
            location: c.location,
            images: JSON.parse(c.images),
            amenities: JSON.parse(c.amenities),
            capacity: c.capacity,
            rating: c.rating,
            reviews: c.reviews.map(r => ({
                id: r.id,
                user: r.user.name || 'Guest',
                date: r.createdAt.toLocaleDateString(),
                rating: r.rating,
                comment: r.comment
            }))
        }));
    } catch (e) {
        console.warn("Using MOCK_CHALETS due to DB connection issue:", e);
        return MOCK_CHALETS;
    }
}

export async function getChaletById(id: string): Promise<Chalet | null> {
    try {
        const c = await prisma.chalet.findUnique({
            where: { id },
            include: {
                reviews: {
                    include: { user: true }
                }
            }
        });

        if (!c) return MOCK_CHALETS.find(mc => mc.id === id) || null;

        return {
            id: c.id,
            name: c.name,
            description: c.description,
            price: c.price,
            location: c.location,
            images: JSON.parse(c.images),
            amenities: JSON.parse(c.amenities),
            capacity: c.capacity,
            rating: c.rating,
            reviews: c.reviews.map(r => ({
                id: r.id,
                user: r.user.name || 'Guest',
                date: r.createdAt.toLocaleDateString(),
                rating: r.rating,
                comment: r.comment
            }))
        };
    } catch (e) {
        return MOCK_CHALETS.find(mc => mc.id === id) || null;
    }
}

// Rewards System Data
export type Partner = {
    id: string;
    name: string;
    category: string;
    discount: string;
    description: string;
    logo: string;
    qrValue: string;
};

export async function getPartners(): Promise<Partner[]> {
    try {
        const dbPartners = await prisma.partner.findMany({
            where: { isActive: true }
        });

        if (dbPartners.length === 0) return [];

        return dbPartners.map(p => ({
            id: p.id,
            name: p.name,
            category: p.category,
            discount: p.discount,
            description: p.description,
            logo: p.logo,
            qrValue: p.qrValue
        }));
    } catch (e) {
        return [];
    }
}

