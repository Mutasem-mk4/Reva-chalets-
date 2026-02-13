'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Check } from '@/components/ui/Icons';
import Link from 'next/link';
import Confetti from 'react-confetti';

export default function BookingSuccessPage({ params }: { params: { lang: string, id: string } }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }, []);

    return (
        <div style={{
            minHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '2rem'
        }}>
            <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={500} />

            <div style={{
                background: '#dcfce7',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '2rem',
                color: '#15803d'
            }}>
                <Check size={48} />
            </div>

            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontFamily: 'var(--font-serif)' }}>
                Payment Successful!
            </h1>

            <p style={{ color: '#57534e', fontSize: '1.1rem', maxWidth: '500px', marginBottom: '2rem' }}>
                Thank you for your booking. We have received your payment and your reservation is now confirmed.
            </p>

            <div style={{ display: 'flex', gap: '1rem' }}>
                <Link href={`/${params.lang}/dashboard/bookings`} style={{
                    background: '#1c1917',
                    color: 'white',
                    padding: '1rem 2rem',
                    borderRadius: '12px',
                    fontWeight: 600,
                    textDecoration: 'none'
                }}>
                    View My Bookings
                </Link>
                <Link href={`/${params.lang}`} style={{
                    background: 'white',
                    border: '1px solid #e5e5e5',
                    color: '#1c1917',
                    padding: '1rem 2rem',
                    borderRadius: '12px',
                    fontWeight: 600,
                    textDecoration: 'none'
                }}>
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
