import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');

    // 1. Create Users
    const admin = await prisma.user.upsert({
        where: { email: 'admin@reva.com' },
        update: {},
        create: {
            email: 'admin@reva.com',
            name: 'Reva Admin',
            role: 'ADMIN',
            passwordHash: 'hashed_password_123'
        }
    });

    const host = await prisma.user.upsert({
        where: { email: 'host@reva.com' },
        update: {},
        create: {
            email: 'host@reva.com',
            name: 'Sarah the Host',
            role: 'HOST',
            passwordHash: 'hashed_password_host'
        }
    });

    const guest = await prisma.user.upsert({
        where: { email: 'guest@example.com' },
        update: {},
        create: {
            email: 'guest@example.com',
            name: 'John Guest',
            role: 'USER',
            passwordHash: 'hashed_password_guest'
        }
    });

    // 2. Create Chalets
    const chalet1 = await prisma.chalet.create({
        data: {
            name: 'Royal Dead Sea Villa',
            description: 'A stunning villa overlooking the Dead Sea with private infinity pool. Perfect for a luxurious getaway.',
            price: 250,
            location: 'Dead Sea, Jordan',
            images: JSON.stringify(['/images/chalet-1.png', '/images/chalet-2.png', '/images/chalet-3.png', '/images/chalet-4.png']),
            amenities: JSON.stringify(['Pool', 'WiFi', 'BBQ', 'AC', 'Parking']),
            capacity: 6,
            rating: 4.9,
            ownerId: host.id,
            reviews: {
                create: [
                    { rating: 5, comment: 'Absolutely breathtaking views! The infinity pool is to die for.', userId: guest.id },
                    { rating: 5, comment: 'Super clean and the host was very responsive. Highly recommended.', userId: admin.id } // Admin reviewing for test
                ]
            }
        }
    });

    const chalet2 = await prisma.chalet.create({
        data: {
            name: 'Petra Desert Lodge',
            description: 'Experience the magic of Petra in this authentic stone lodge. Stars at night are incredible.',
            price: 180,
            location: 'Wadi Musa, Jordan',
            images: JSON.stringify(['/images/chalet-2.png']),
            amenities: JSON.stringify(['Fireplace', 'Hike Trails', 'Breakfast', 'AC']),
            capacity: 4,
            rating: 4.7,
            ownerId: host.id,
            reviews: {
                create: [
                    { rating: 4, comment: 'Magical experience, though a bit cold at night. Fireplace helped!', userId: guest.id }
                ]
            }
        }
    });

    const chalet3 = await prisma.chalet.create({
        data: {
            name: 'Ajloun Forest Cabin',
            description: 'Cozy wooden cabin surrounded by the pine forests of Ajloun.',
            price: 120,
            location: 'Ajloun, Jordan',
            images: JSON.stringify(['/images/chalet-3.png']),
            amenities: JSON.stringify(['Nature View', 'Heating', 'Kitchen', 'Garden']),
            capacity: 5,
            rating: 4.8,
            ownerId: host.id
        }
    });

    const chalet4 = await prisma.chalet.create({
        data: {
            name: 'Aqaba Luxury Suite',
            description: 'Modern suite with direct access to the Red Sea beaches.',
            price: 300,
            location: 'Aqaba, Jordan',
            images: JSON.stringify(['/images/chalet-4.png']),
            amenities: JSON.stringify(['Beach Access', 'Pool', 'Jacuzzi', 'Service']),
            capacity: 2,
            rating: 4.9,
            ownerId: host.id
        }
    });

    // 3. Create Partners (Rewards)
    const partners = [
        { name: 'Azure Lounge', category: 'Dining', discount: '15% OFF', description: 'Enjoy premium seafood with a view.', logo: '🍽️', qrValue: 'REVA_AZURE_15' },
        { name: 'Petra Kitchen', category: 'Dining', discount: 'Free Dessert', description: 'Get a free traditional dessert.', logo: '🍰', qrValue: 'REVA_PETRA_FREE' },
        { name: 'Oasis Spa', category: 'Wellness', discount: '20% OFF', description: 'Relax with 20% off all massage treatments.', logo: '💆‍♀️', qrValue: 'REVA_OASIS_20' },
        { name: 'Jordan Adventures', category: 'Activity', discount: 'Buy 1 Get 1', description: 'Book a jeep tour and get the second for free.', logo: '🚙', qrValue: 'REVA_BS1G1' },
    ];

    for (const p of partners) {
        await prisma.partner.upsert({
            where: { qrValue: p.qrValue },
            update: {},
            create: p
        });
    }

    console.log('✅ Seed completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
