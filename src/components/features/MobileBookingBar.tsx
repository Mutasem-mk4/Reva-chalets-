'use client';

import { useState } from 'react';
import BookingForm from './BookingForm';
import { X } from '@/components/ui/Icons';
import styles from '@/styles/mobileBooking.module.css';

interface MobileBookingBarProps {
    dict: any;
    price: number;
    chaletId: string;
}

export default function MobileBookingBar({ dict, price, chaletId }: MobileBookingBarProps) {
    const [isFormOpen, setIsFormOpen] = useState(false);

    return (
        <>
            {/* Compact Bar - Always visible at bottom on mobile */}
            <div className={styles.mobileBar}>
                <div className={styles.priceInfo}>
                    <span className={styles.price}>{price} JOD</span>
                    <span className={styles.period}>/ {dict.chalet.pricePerNight}</span>
                </div>
                <button className={styles.bookBtn} onClick={() => setIsFormOpen(true)}>
                    {dict.chalet.book}
                </button>
            </div>

            {/* Slide-up Booking Sheet */}
            {isFormOpen && (
                <div className={styles.formOverlay} onClick={() => setIsFormOpen(false)}>
                    <div className={styles.formSheet} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.formHeader}>
                            <h3>{dict.chalet.book}</h3>
                            <button className={styles.closeBtn} onClick={() => setIsFormOpen(false)}>
                                ✕
                            </button>
                        </div>
                        <div className={styles.formBody}>
                            <BookingForm dict={dict} price={price} chaletId={chaletId} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
