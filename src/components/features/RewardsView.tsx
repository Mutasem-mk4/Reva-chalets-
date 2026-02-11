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
                <h1 className={styles.title}>{locale === 'ar' ? 'المكافآت' : 'Rewards'}</h1>
                <p className={styles.subtitle}>{locale === 'ar' ? 'خصومات حصرية لرحلتك' : 'Exclusive discounts for your trip'}</p>
            </header>

            {/* Tabs */}
            <div className={styles.tabsContainer}>
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeType === 'ZAD' ? styles.activeTab : ''}`}
                        onClick={() => setActiveType('ZAD')}
                    >
                        <span className={styles.tabIcon}>🎯</span>
                        <span>{locale === 'ar' ? 'زاد' : 'Zad'}</span>
                    </button>
                    <button
                        className={`${styles.tab} ${activeType === 'KAIF' ? styles.activeTab : ''}`}
                        onClick={() => setActiveType('KAIF')}
                    >
                        <span className={styles.tabIcon}>🌟</span>
                        <span>{locale === 'ar' ? 'كيف' : 'Kaif'}</span>
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className={styles.content}>
                {loading ? (
                    <div className={styles.loader}>Loading rewards...</div>
                ) : (
                    <div className={styles.grid}>
                        {discounts.length > 0 ? discounts.map((discount) => (
                            <div key={discount.id} className={styles.card}>
                                <div className={styles.cardIcon}>
                                    {getCategoryIcon(discount.category)}
                                </div>
                                <div className={styles.cardBody}>
                                    <div className={styles.cardHeader}>
                                        <h3 className={styles.cardTitle}>
                                            {locale === 'ar' ? discount.nameAr : discount.name}
                                        </h3>
                                        <div className={styles.discountValue}>
                                            {discount.value}% OFF
                                        </div>
                                    </div>
                                    <p className={styles.cardDesc}>{discount.description}</p>
                                    <div className={styles.cardFooter}>
                                        <span className={styles.partnerName}>{discount.partner?.name || 'Riva Partner'}</span>
                                        <button className={styles.redeemBtn}>
                                            {locale === 'ar' ? 'استخدام' : 'Redeem'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className={styles.emptyState}>
                                <div className={styles.emptyIcon}>🎁</div>
                                <p>{locale === 'ar' ? 'لا توجد مكافآت متاحة حالياً' : 'No rewards available yet'}</p>
                            </div>
                        )}
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
