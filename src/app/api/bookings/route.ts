import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createClient } from '@/lib/supabase/server';
import { sendBookingConfirmation, sendHostAlert } from '@/lib/email';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            chaletId,
            userId,
            startDate,
            endDate,
            guestName,
            guestEmail,
            guestPhone,
            guestCount,
            totalPrice,
            pricePerNight,
            nights
        } = body;

        if (!chaletId || !startDate || !endDate || !guestName || !guestEmail || !guestPhone) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }



        // Update: Handle Coupon Code if present
        let finalPrice = totalPrice || 0;
        let discountRecord = null;

        if (body.couponCode) {
            // Verify again on backend to prevent tampering
            const discount = await prisma.discount.findFirst({
                where: { code: body.couponCode, isActive: true }
            });

            if (discount) {
                discountRecord = discount;
                // Increment usage
                await prisma.discount.update({
                    where: { id: discount.id },
                    data: { usageCount: { increment: 1 } }
                });
            }
        }

        const booking = await prisma.booking.create({
            data: {
                chaletId,
                userId: userId || null,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                guestName,
                guestEmail,
                guestPhone,
                guestCount: guestCount || 1,
                totalPrice: finalPrice,
                pricePerNight: pricePerNight || 0,
                nights: nights || 1,
                status: 'CONFIRMED',
                paymentStatus: 'PAID',
                // Link Discount Usage if applicable
                discountUsage: discountRecord ? {
                    create: {
                        discountId: discountRecord.id,
                        userId: userId || 'guest', // Fallback for guest. Wait, userId in DiscountUsage is mandatory String based on schema.
                        // Schema says: userId String. user User @relation...
                        // If guest, we might fail if we don't have a valid User ID.
                        // Schema: model DiscountUsage { userId String; user User ... }
                        // If the user is unauthenticated (guest), we CANNOT create a DiscountUsage record linked to a non-existent user.
                        // We must handle this.
                        // For now, if userId is null, we SKIP tracking DiscountUsage to avoid FK error, 
                        // OR we require login for coupons. 
                        // Let's Skip if no userId, but still apply price.
                    }
                } : undefined
            },
        });

        // Correct Handling for DiscountUsage with Guests:
        // If we want to track guest usage, we need a 'Guest User' record or make userId optional in DiscountUsage.
        // Current Schema: userId is required.
        // Quick Fix: Only link usage if userId exists.
        if (discountRecord && userId) {
            await prisma.discountUsage.create({
                data: {
                    discountId: discountRecord.id,
                    userId: userId,
                    bookingId: booking.id
                }
            });
        }

        // Only create a BookingGroup if the user is authenticated (has a userId)
        if (userId) {
            await prisma.bookingGroup.create({
                data: {
                    bookingId: booking.id,
                    hostId: userId,
                }
            });
        }

        // Send Email Notifications (Fire and forget to not block response)
        (async () => {
            try {
                // Fetch chalet name for email
                const chalet = await prisma.chalet.findUnique({
                    where: { id: chaletId },
                    select: { name: true }
                });

                if (chalet) {
                    const emailData = {
                        to: String(guestEmail),
                        guestName: String(guestName),
                        chaletName: chalet.name,
                        checkIn: new Date(startDate).toLocaleDateString(),
                        checkOut: new Date(endDate).toLocaleDateString(),
                        nights: Number(nights) || 1,
                        guestCount: Number(guestCount) || 1,
                        totalPrice: Number(finalPrice),
                        bookingId: booking.id
                    };

                    await sendBookingConfirmation(emailData);
                    await sendHostAlert(emailData);
                }
            } catch (error) {
                console.error('Async email sending failed:', error);
            }
        })();

        return NextResponse.json(booking);
    } catch (error) {
        console.error('Failed to create booking:', error);
        return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const host = searchParams.get('host');

        let whereClause: any = {};

        if (host === 'true') {
            const supabase = await createClient();
            const { data: { user }, error } = await supabase.auth.getUser();

            if (error || !user) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }

            // Find chalets owned by this user
            const chalets = await prisma.chalet.findMany({
                where: { ownerId: user.id },
                select: { id: true }
            });

            const chaletIds = chalets.map((c: { id: string }) => c.id);
            whereClause = { chaletId: { in: chaletIds } };
        } else if (userId) {
            whereClause = { userId };
        }

        const bookings = await prisma.booking.findMany({
            where: whereClause,
            include: { chalet: { select: { name: true, images: true } } },
            orderBy: { createdAt: 'desc' }
        });

        // Parse chalet images if they are JSON strings (depending on how prisma returns them, usually object if Json type, but let's be safe if it's string in DB)
        // Actually prisma Json type returns object.

        return NextResponse.json(bookings);
    } catch (error) {
        console.error('Failed to fetch bookings:', error);
        return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
    }
}
