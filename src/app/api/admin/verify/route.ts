import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user || user.user_metadata?.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const pendingChalets = await prisma.chalet.findMany({
            where: {
                OR: [
                    { isApproved: false },
                    { status: 'PENDING' }
                ]
            },
            include: {
                owner: {
                    select: { name: true, email: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(pendingChalets);
    } catch (error) {
        console.error('Fetch pending chalets error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user || user.user_metadata?.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id, action } = await request.json();

        if (!id || !action) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        if (action === 'approve') {
            await prisma.chalet.update({
                where: { id },
                data: {
                    isApproved: true,
                    status: 'PUBLISHED'
                }
            });
        } else if (action === 'reject') {
            // Option: Ask for reason or just set to draft
            await prisma.chalet.update({
                where: { id },
                data: {
                    status: 'DRAFT' // Send back to draft instead of deleting
                }
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Update status error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
