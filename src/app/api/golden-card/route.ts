import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
// import { BookingPhase } from '@prisma/client'; // Commented out to fix build

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        // Allow forcing a phase for demo/testing
        const mockPhase = searchParams.get('mock_phase');

        if (mockPhase) {
            return NextResponse.json({
                phase: mockPhase,
                details: getMockDetails(mockPhase)
            });
        }

        // TODO: Get actual user from auth session
        // const session = await auth();
        // if (!session?.user) ...

        // For now, simulate logic:
        // 1. Find upcoming booking
        // 2. Determine phase

        // Mocking the phase determination for now
        const currentPhase = 'WAITING';

        return NextResponse.json({
            phase: currentPhase,
            details: getMockDetails(currentPhase)
        });

    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch golden card status' }, { status: 500 });
    }
}

function getMockDetails(phase: string) {
    const common = {
        farmName: 'Al-Reef Luxury Farm',
        bookingDate: '2025-06-15',
        tripStartTime: '02:00 PM',
        farmLocation: 'Dead Sea, Jordan',
        groupMembers: 5
    };

    switch (phase) {
        case 'NOT_BOOKED':
            return { ...common, statusText: 'Start your journey' };
        case 'BOOKED_PENDING':
            return {
                ...common,
                remainingTime: '3 Days left',
                statusText: 'Your upcoming trip'
            };
        case 'IN_PROGRESS':
            return {
                ...common,
                remainingTime: 'Trip ends in 5h',
                statusText: 'Enjoy your stay!'
            };
        case 'COMPLETED':
            return {
                ...common,
                remainingTime: '-',
                statusText: 'Hope you had fun!'
            };
        default:
            return common;
    }
}
