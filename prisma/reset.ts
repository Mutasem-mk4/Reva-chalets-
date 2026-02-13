import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Resetting public schema...');
    try {
        // Drop all tables in public schema by dropping the schema itself
        // This removes all tables, views, and functions in public
        await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS public CASCADE;`);
        await prisma.$executeRawUnsafe(`CREATE SCHEMA public;`);
        await prisma.$executeRawUnsafe(`GRANT ALL ON SCHEMA public TO postgres;`);
        await prisma.$executeRawUnsafe(`GRANT ALL ON SCHEMA public TO public;`);
        console.log('Public schema reset successfully.');
    } catch (e) {
        console.error('Failed to reset schema:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
