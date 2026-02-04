'use client';

import React from 'react';
import styles from './GoldenCard.module.css';

export type BookingPhase =
    | 'NOT_BOOKED'      // لم يحجز بعد
    | 'BOOKED_PENDING'  // حجز ولم يحن الوقت
    | 'IN_PROGRESS'     // خلال وقت الحجز
    | 'COMPLETED';      // انتهى الحجز

interface GoldenCardProps {
    phase?: BookingPhase;
    farmName?: string;
    bookingDate?: string;
    tripStartTime?: string;
    farmLocation?: string;
    remainingTime?: string;
    groupMembers?: number;
    locale?: string;
    onChatClick?: () => void;
}

export default function GoldenCard({
    phase = 'BOOKED_PENDING',
    farmName = 'Farm Name',
    bookingDate = 'Booking Date',
    tripStartTime = 'Trip start time',
    farmLocation = 'Farm location',
    remainingTime = 'Remaining Time',
    groupMembers = 6,
    locale = 'ar',
    onChatClick
}: GoldenCardProps) {

    const getPhaseStyles = () => {
        switch (phase) {
            case 'NOT_BOOKED':
                return { cardClass: styles.notBooked, statusText: 'Start your journey' };
            case 'BOOKED_PENDING':
                return { cardClass: styles.bookedPending, statusText: 'Your upcoming trip' };
            case 'IN_PROGRESS':
                return { cardClass: styles.inProgress, statusText: 'You are at the farm' };
            case 'COMPLETED':
                return { cardClass: styles.completed, statusText: 'Rate your experience' };
            default:
                return { cardClass: styles.bookedPending, statusText: 'Your upcoming trip' };
        }
    };

    const { cardClass, statusText } = getPhaseStyles();

    return (
        <div className={`${styles.card} ${cardClass}`}>
            {/* Left side - Farm preview */}
            <div className={styles.previewSection}>
                <button className={styles.viewButton}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" />
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <span>View</span>
                </button>

                {/* Farm images grid */}
                <div className={styles.imageGrid}>
                    <div className={styles.mainImage}></div>
                    <div className={styles.smallImages}>
                        <div className={styles.smallImage}></div>
                        <div className={styles.smallImage}></div>
                        <div className={styles.smallImage}></div>
                        <div className={styles.smallImage}></div>
                    </div>
                </div>
            </div>

            {/* Center - Trip info */}
            <div className={styles.infoSection}>
                <span className={styles.statusText}>{statusText}</span>
                <h3 className={styles.farmName}>{farmName}</h3>

                <div className={styles.details}>
                    <div className={styles.detailRow}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                            <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" />
                        </svg>
                        <span>{bookingDate}</span>
                    </div>

                    <div className={styles.detailRow}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                            <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <span>{tripStartTime}</span>
                    </div>

                    <div className={styles.detailRow}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z" stroke="currentColor" strokeWidth="2" />
                            <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
                        </svg>
                        <span>{farmLocation}</span>
                    </div>
                </div>

                <button className={styles.remainingTimeBtn}>
                    {remainingTime}
                </button>
            </div>

            {/* Right side - Pass & Group */}
            <div className={styles.passSection}>
                <div className={styles.passCard}>
                    <span className={styles.activeLabel}>
                        <span className={styles.activeDot}></span>
                        Active
                    </span>

                    <button className={styles.openButton}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                            <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" />
                        </svg>
                        <span>Open in [h]</span>
                    </button>

                    {/* Character illustration */}
                    <div className={styles.characterIcon}>
                        🏍️
                    </div>

                    {/* Group members */}
                    <div className={styles.groupMembers}>
                        <div className={styles.memberAvatars}>
                            <span className={styles.currencyIcon}>€</span>
                            <span className={styles.currencyIcon}>€</span>
                            <span className={styles.currencyIcon}>฿</span>
                        </div>
                        <span className={styles.memberCount}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" />
                                <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" />
                            </svg>
                            {groupMembers}
                        </span>
                        <button className={styles.chatIconWrapper} onClick={onChatClick}>
                            <span className={styles.chatIcon}>💬</span>
                        </button>
                    </div>

                    <button className={styles.viewPassBtn}>
                        View Pass
                    </button>
                </div>
            </div>
        </div>
    );
}
