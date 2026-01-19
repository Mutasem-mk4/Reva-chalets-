import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
    const checks = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        services: {
            api: 'ok',
            database: 'unknown',
        },
    };

    // Check database connection
    try {
        await prisma.$queryRaw`SELECT 1`;
        checks.services.database = 'ok';
    } catch (error) {
        checks.services.database = 'error';
        checks.status = 'degraded';
    }

    const statusCode = checks.status === 'healthy' ? 200 : 503;

    return NextResponse.json(checks, { status: statusCode });
}
