'use client';

import React, { useState, useEffect } from 'react';
import styles from './RewardsView.module.css';

interface RewardsViewProps {
    locale?: string;
}

type DiscountType = 'ZAD' | 'KAIF';

export default function RewardsView({ locale = 'ar' }: RewardsViewProps) {
    const [activeType, setActiveType] = useState<DiscountType>('ZAD');
    const [discounts, setDiscounts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchDiscounts = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/discounts?type=${activeType}`);
                const data = await res.json();
                setDiscounts(data);
            } catch (e) {
                console.error("Failed to fetch discounts", e);
            } finally {
                setLoading(false);
            }
        };

        fetchDiscounts();
    }, [activeType]);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Rewards</h1>
                <p className={styles.subtitle}>Exclusive discounts for your trip</p>
            </header>

            {/* Tabs */}
            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeType === 'ZAD' ? styles.activeTab : ''}`}
                    onClick={() => setActiveType('ZAD')}
                >
                    <span className={styles.tabIcon}>⛽</span>
                    <span>Zad</span>
                    <span className={styles.tabBadge}>Pre-Trip</span>
                </button>
                <button
                    className={`${styles.tab} ${activeType === 'KAIF' ? styles.activeTab : ''}`}
                    onClick={() => setActiveType('KAIF')}
                >
                    <span className={styles.tabIcon}>🎡</span>
                    <span>Kaif</span>
                    <span className={styles.tabBadge}>Post-Review</span>
                </button>
            </div>

            {/* Content */}
            <div className={styles.content}>
                {loading ? (
                    <div className={styles.loader}>Loading rewards...</div>
                ) : (
                    <div className={styles.grid}>
                        {discounts.map((discount) => (
                            <div key={discount.id} className={styles.card}>
                                <div className={styles.cardIcon}>
                                    {getCategoryIcon(discount.category)}
                                </div>
                                <div className={styles.cardInfo}>
                                    <h3 className={styles.cardTitle}>
                                        {locale === 'ar' ? discount.nameAr : discount.name}
                                    </h3>
                                    <p className={styles.cardDesc}>{discount.description}</p>
                                    <div className={styles.partnerName}>{discount.partner?.name}</div>
                                </div>
                                <button className={styles.redeemBtn}>
                                    Redeem
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function getCategoryIcon(category: string) {
    switch (category) {
        case 'gas': return '⛽';
        case 'meat': return '🥩';
        case 'transport': return '🚗';
        case 'bowling': return '🎳';
        case 'karting': return '🏎️';
        default: return '🎁';
    }
}
