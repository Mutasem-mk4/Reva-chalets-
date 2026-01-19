'use client';

import { useState } from 'react';
import BookingForm from './BookingForm';
import { X } from '@/components/ui/Icons';
import styles from '@/styles/mobileBooking.module.css';

interface MobileBookingBarProps {
    dict: any;
    price: number;
}

export default function MobileBookingBar({ dict, price }: MobileBookingBarProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Compact Bar - Always visible at bottom on mobile */}
            <div className={styles.mobileBookingBar}>
                <div className={styles.priceInfo}>
                    <span className={styles.price}>{price} JOD</span>
                    <span className={styles.period}>/ {dict.chalet?.pricePerNight || 'night'}</span>
                </div>
                <button className={styles.bookBtn} onClick={() => setIsOpen(true)}>
                    Check Availability
                </button>
            </div>

            {/* Full Screen Modal for Booking Form */}
            {isOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsOpen(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>Book Your Stay</h3>
                            <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className={styles.modalContent}>
                            <div className={styles.modalPrice}>
                                <span className={styles.price}>{price} JOD</span>
                                <span className={styles.period}>/ {dict.chalet?.pricePerNight || 'night'}</span>
                            </div>
                            <BookingForm dict={dict} price={price} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
