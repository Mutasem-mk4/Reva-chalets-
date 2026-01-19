
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
    },
    {
        id: '2',
        name: 'Petra Desert Lodge',
        description: 'Experience the magic of Petra in this authentic stone lodge. Stars at night are incredible.',
        price: 180,
        location: 'Wadi Musa, Jordan',
        images: ['/images/chalet-2.png'],
        amenities: ['Fireplace', 'Hike Trails', 'Breakfast', 'AC'],
        capacity: 4,
        rating: 4.7,
        coordinates: { lat: 30.3285, lng: 35.4444 }, // Petra
        reviews: [
            { id: 'r3', user: 'Elena R.', date: 'Nov 2024', rating: 4, comment: 'Magical experience, though a bit cold at night. Fireplace helped!' }
        ]
    },
    {
        id: '3',
        name: 'Ajloun Forest Cabin',
        description: 'Cozy wooden cabin surrounded by the pine forests of Ajloun.',
        price: 120,
        location: 'Ajloun, Jordan',
        images: ['/images/chalet-3.png'],
        amenities: ['Nature View', 'Heating', 'Kitchen', 'Garden'],
        capacity: 5,
        rating: 4.8,
        coordinates: { lat: 32.3326, lng: 35.7517 }, // Ajloun
        reviews: []
    },
    {
        id: '4',
        name: 'Aqaba Luxury Suite',
        description: 'Modern suite with direct access to the Red Sea beaches.',
        price: 300,
        location: 'Aqaba, Jordan',
        images: ['/images/chalet-4.png'],
        amenities: ['Beach Access', 'Pool', 'Jacuzzi', 'Service'],
        capacity: 2,
        rating: 4.9,
        coordinates: { lat: 29.5319, lng: 35.0061 }, // Aqaba
        reviews: []
    }
];

export async function getChalets() {
    return MOCK_CHALETS;
}



export async function getChaletById(id: string) {
    return MOCK_CHALETS.find(c => c.id === id) || null;
}

// Rewards System Data
export type Partner = {
    id: string;
    name: string;
    category: 'Dining' | 'Activity' | 'Wellness' | 'Shopping';
    discount: string;
    description: string;
    logo: string; // Emoji for now, or image path
    qrValue: string;
};

export const MOCK_PARTNERS: Partner[] = [
    {
        id: 'p1',
        name: 'Azure Lounge',
        category: 'Dining',
        discount: '15% OFF',
        description: 'Enjoy premium seafood with a view. Valid on all main courses.',
        logo: '🍽️',
        qrValue: 'REVA_AZURE_15'
    },
    {
        id: 'p2',
        name: 'Petra Kitchen',
        category: 'Dining',
        discount: 'Free Dessert',
        description: 'Get a free traditional dessert with any meal.',
        logo: '🍰',
        qrValue: 'REVA_PETRA_FREE_DESSERT'
    },
    {
        id: 'p3',
        name: 'Oasis Spa',
        category: 'Wellness',
        discount: '20% OFF',
        description: 'Relax with 20% off all massage treatments.',
        logo: '💆‍♀️',
        qrValue: 'REVA_OASIS_20'
    },
    {
        id: 'p4',
        name: 'Jordan Adventures',
        category: 'Activity',
        discount: 'Buy 1 Get 1',
        description: 'Book a jeep tour and get the second person for free.',
        logo: '🚙',
        qrValue: 'REVA_BS1G1'
    }
];

export async function getPartners() {
    return MOCK_PARTNERS;
}

