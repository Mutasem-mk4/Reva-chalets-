'use client';

import { useEffect, useState, use, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Check, Calendar, MapPin, Users, ArrowRight } from '@/components/ui/Icons';
import Confetti, { SuccessCheck } from '@/components/ui/Celebrations';
import styles from '@/styles/auth.module.css';

function SuccessContent({ lang }: { lang: string }) {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const [showConfetti, setShowConfetti] = useState(true);
    const [bookingDetails, setBookingDetails] = useState<{
        chaletName: string;
        startDate: string;
        endDate: string;
        guestCount: number;
        totalPrice: number;
    } | null>(null);

    useEffect(() => {
        if (sessionId) {
            // Fetch booking details from session
            fetch(`/api/booking/details?session_id=${sessionId}`)
                .then(res => res.json())
                .then(data => {
                    if (data.booking) {
                        setBookingDetails(data.booking);
                    }
                })
                .catch(console.error);
        }
    }, [sessionId]);

    return (
        <div className={styles.authPage}>
            {/* Celebration confetti */}
            <Confetti trigger={showConfetti} />

            <div className={`${styles.authContainer} ${styles.successContainer}`} style={{ maxWidth: '500px' }}>
                {/* Animated success check */}
                <SuccessCheck show={true} />

                <h1>Booking Confirmed!</h1>
                <p style={{ marginBottom: '1.5rem' }}>
                    Thank you for your reservation. You will receive a confirmation email shortly.
                </p>

                {bookingDetails && (
                    <div style={{
                        background: 'hsl(var(--background))',
                        borderRadius: '1rem',
                        padding: '1.5rem',
                        marginBottom: '1.5rem',
                        textAlign: 'left',
                    }}>
                        <h3 style={{ marginBottom: '1rem', color: 'hsl(var(--foreground))' }}>
                            {bookingDetails.chaletName}
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Calendar size={18} />
                                <span>{bookingDetails.startDate} - {bookingDetails.endDate}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Users size={18} />
                                <span>{bookingDetails.guestCount} guests</span>
                            </div>
                            <div style={{
                                borderTop: '1px solid hsl(var(--border))',
                                paddingTop: '0.75rem',
                                marginTop: '0.5rem',
                                fontWeight: 600,
                                fontSize: '1.1rem',
                            }}>
                                Total: {bookingDetails.totalPrice} JOD
                            </div>
                        </div>
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <Link
                        href={`/${lang}/dashboard/bookings`}
                        className={`${styles.authBtn} ${styles.authBtnPrimary}`}
                    >
                        View My Bookings
                        <ArrowRight size={18} />
                    </Link>
                    <Link
                        href={`/${lang}`}
                        className={`${styles.authBtn} ${styles.authBtnGoogle}`}
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function BookingSuccessPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = use(params);

    return (
        <Suspense fallback={<div className={styles.authPage}>Loading...</div>}>
            <SuccessContent lang={lang} />
        </Suspense>
    );
}
