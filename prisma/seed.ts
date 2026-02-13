import { PrismaClient } from '@prisma/client';
import { MOCK_CHALETS } from '../src/lib/data';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding...');

    try {
        // 1. Create Chalets
        for (const chalet of MOCK_CHALETS) {
            console.log(`Creating chalet: ${chalet.name}`);

            const createdChalet = await prisma.chalet.upsert({
                where: { id: chalet.id },
                update: {}, // If exists, do nothing (or update if you prefer)
                create: {
                    id: chalet.id,
                    name: chalet.name,
                    description: chalet.description,
                    price: chalet.price,
                    location: chalet.location,
                    images: JSON.stringify(chalet.images),
                    amenities: JSON.stringify(chalet.amenities),
                    capacity: chalet.capacity,
                    rating: chalet.rating,
                    // Create reviews for this chalet
                    reviews: {
                        create: chalet.reviews.map(review => ({
                            rating: review.rating,
                            comment: review.comment,
                            // Create a dummy user for the review since we don't have real users yet
                            user: {
                                connectOrCreate: {
                                    where: { email: `guest_${review.user.replace(/\s/g, '').toLowerCase()}@example.com` },
                                    create: {
                                        email: `guest_${review.user.replace(/\s/g, '').toLowerCase()}@example.com`,
                                        name: review.user,
                                        role: 'USER'
                                    }
                                }
                            }
                        }))
                    }
                },
            });
            console.log(`Created chalet with id: ${createdChalet.id}`);
        }

        console.log('Seeding finished.');
    } catch (e) {
        console.error(e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
