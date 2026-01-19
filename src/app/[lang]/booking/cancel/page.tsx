'use client';

import { use } from 'react';
import Link from 'next/link';
import { X, ArrowRight } from '@/components/ui/Icons';
import styles from '@/styles/auth.module.css';

export default function BookingCancelPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = use(params);

    return (
        <div className={styles.authPage}>
            <div className={`${styles.authContainer} ${styles.successContainer}`} style={{ maxWidth: '450px' }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, hsl(0 84% 50%), hsl(0 84% 60%))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    color: 'white',
                }}>
                    <X size={48} />
                </div>
                <h1>Payment Cancelled</h1>
                <p style={{ marginBottom: '1.5rem' }}>
                    Your booking was not completed. No payment has been made.
                </p>
                <p style={{ color: 'hsl(var(--muted-foreground))', marginBottom: '2rem' }}>
                    If you experienced any issues, please contact our support team.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <Link
                        href={`/${lang}/chalets`}
                        className={`${styles.authBtn} ${styles.authBtnPrimary}`}
                    >
                        Try Again
                        <ArrowRight size={18} />
                    </Link>
                    <Link
                        href={`/${lang}/contact`}
                        className={`${styles.authBtn} ${styles.authBtnGoogle}`}
                    >
                        Contact Support
                    </Link>
                </div>
            </div>
        </div>
    );
}
