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
    isApproved?: boolean;
    status?: string;
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
        description: 'A stunning villa overlooking the Dead Sea with private infinity pool and panoramic sunset views. Perfect for a luxurious family retreat.',
        price: 350,
        location: 'Dead Sea',
        images: ['/images/chalet-1.png', '/images/chalet-2.png', '/images/chalet-3.png', '/images/chalet-4.png'],
        amenities: ['Private Pool', 'WiFi', 'BBQ Area', 'AC', 'Parking', 'Sea View', 'Jacuzzi'],
        capacity: 8,
        rating: 4.9,
        isApproved: true,
        status: 'PUBLISHED',
        coordinates: { lat: 31.7196, lng: 35.5891 },
        reviews: [
            { id: 'r1', user: 'Sarah M.', date: 'Oct 2024', rating: 5, comment: 'Absolutely breathtaking views! The infinity pool is to die for.' },
            { id: 'r2', user: 'James K.', date: 'Sep 2024', rating: 5, comment: 'Super clean and the host was very responsive. Highly recommended.' }
        ]
    },
    {
        id: '2',
        name: 'Ajloun Forest Retreat',
        description: 'Nestled among ancient oak forests with mountain views. A peaceful hideaway surrounded by nature, ideal for hiking enthusiasts and families.',
        price: 180,
        location: 'Ajloun',
        images: ['/images/chalet-2.png', '/images/chalet-3.png', '/images/chalet-1.png', '/images/chalet-4.png'],
        amenities: ['Garden', 'WiFi', 'BBQ Area', 'Fireplace', 'Parking', 'Mountain View', 'Playground'],
        capacity: 10,
        rating: 4.8,
        isApproved: true,
        status: 'PUBLISHED',
        coordinates: { lat: 32.3296, lng: 35.7553 },
        reviews: [
            { id: 'r3', user: 'Ahmad R.', date: 'Nov 2024', rating: 5, comment: 'The most relaxing weekend we\'ve ever had. The forest setting is magical.' },
            { id: 'r4', user: 'Dana L.', date: 'Oct 2024', rating: 4, comment: 'Beautiful location, very clean. The fireplace was a nice touch in winter.' }
        ]
    },
    {
        id: '3',
        name: 'Jerash Heritage Lodge',
        description: 'A charming stone lodge near the ancient Roman ruins of Jerash. Combine history with comfort in this traditionally decorated retreat.',
        price: 120,
        location: 'Jerash',
        images: ['/images/chalet-3.png', '/images/chalet-1.png', '/images/chalet-4.png', '/images/chalet-2.png'],
        amenities: ['WiFi', 'BBQ Area', 'AC', 'Parking', 'Garden', 'Traditional Decor'],
        capacity: 6,
        rating: 4.7,
        isApproved: true,
        status: 'PUBLISHED',
        coordinates: { lat: 32.2747, lng: 35.8914 },
        reviews: [
            { id: 'r5', user: 'Lina S.', date: 'Dec 2024', rating: 5, comment: 'Walking distance to the ruins! The stone architecture is beautiful.' },
            { id: 'r6', user: 'Omar H.', date: 'Nov 2024', rating: 4, comment: 'Great value for money. The garden area is perfect for evening tea.' }
        ]
    },
    {
        id: '4',
        name: 'Amman Sky Penthouse',
        description: 'A modern rooftop penthouse in Abdoun with stunning city skyline views. Stylish interiors, private terrace, and walkable to Amman\'s best restaurants.',
        price: 220,
        location: 'Amman',
        images: ['/images/chalet-4.png', '/images/chalet-1.png', '/images/chalet-2.png', '/images/chalet-3.png'],
        amenities: ['WiFi', 'AC', 'Parking', 'City View', 'Terrace', 'Smart TV', 'Kitchen'],
        capacity: 4,
        rating: 4.8,
        isApproved: true,
        status: 'PUBLISHED',
        coordinates: { lat: 31.9539, lng: 35.9106 },
        reviews: [
            { id: 'r7', user: 'Nour A.', date: 'Jan 2025', rating: 5, comment: 'The sunset from the terrace is unreal. Best place we\'ve stayed in Amman.' },
            { id: 'r8', user: 'Tariq B.', date: 'Dec 2024', rating: 5, comment: 'Spotless, modern, and the location is unbeatable. Will definitely return.' }
        ]
    },
    {
        id: '5',
        name: 'Salt Valley Farm',
        description: 'A traditional farmhouse in the green hills of Salt. Enjoy fresh countryside air, olive groves, and authentic Jordanian hospitality.',
        price: 85,
        location: 'Salt',
        images: ['/images/chalet-1.png', '/images/chalet-4.png', '/images/chalet-3.png', '/images/chalet-2.png'],
        amenities: ['Garden', 'BBQ Area', 'Parking', 'Playground', 'Farm Animals', 'Outdoor Seating'],
        capacity: 15,
        rating: 4.6,
        isApproved: true,
        status: 'PUBLISHED',
        coordinates: { lat: 32.0392, lng: 35.7272 },
        reviews: [
            { id: 'r9', user: 'Rami M.', date: 'Oct 2024', rating: 5, comment: 'Kids loved the farm animals! Great family trip. Homemade breakfast was amazing.' },
            { id: 'r10', user: 'Hala J.', date: 'Sep 2024', rating: 4, comment: 'Beautiful green valley. Very peaceful and affordable.' }
        ]
    },
    {
        id: '6',
        name: 'Madaba Mosaic House',
        description: 'A beautifully restored heritage home near Madaba\'s famous mosaic map. Traditional arches, courtyard, and rooftop dining with views to the hills.',
        price: 150,
        location: 'Madaba',
        images: ['/images/chalet-2.png', '/images/chalet-4.png', '/images/chalet-1.png', '/images/chalet-3.png'],
        amenities: ['WiFi', 'AC', 'Parking', 'Rooftop', 'Traditional Decor', 'Kitchen', 'Courtyard'],
        capacity: 5,
        rating: 4.7,
        isApproved: true,
        status: 'PUBLISHED',
        coordinates: { lat: 31.7160, lng: 35.7932 },
        reviews: [
            { id: 'r11', user: 'Kareem W.', date: 'Nov 2024', rating: 5, comment: 'An absolute gem! The rooftop dinner under the stars was unforgettable.' },
            { id: 'r12', user: 'Sana F.', date: 'Oct 2024', rating: 4, comment: 'Charming traditional home. Very close to all the sights in Madaba.' }
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
            isApproved: c.isApproved,
            status: c.status,
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
            isApproved: c.isApproved,
            status: c.status,
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

