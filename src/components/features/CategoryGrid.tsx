'use client';

import React from 'react';
import styles from './CategoryGrid.module.css';

interface CategoryGridProps {
    locale?: string;
}

interface Category {
    id: string;
    title: string;
    titleAr: string;
    icon: string;
    gradient: string;
}

const categories: Category[] = [
    {
        id: 'pool',
        title: 'Pool',
        titleAr: 'مسبح',
        icon: '🏊',
        gradient: 'linear-gradient(135deg, #0EA5E9, #0284C7)',
    },
    {
        id: 'nature-view',
        title: 'Nature View',
        titleAr: 'إطلالة طبيعية',
        icon: '🌿',
        gradient: 'linear-gradient(135deg, #22C55E, #16A34A)',
    },
    {
        id: 'large-groups',
        title: 'Large Groups',
        titleAr: 'مجموعات كبيرة',
        icon: '👨‍👩‍👧‍👦',
        gradient: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
    },
    {
        id: 'extra-activities',
        title: 'Activities',
        titleAr: 'أنشطة إضافية',
        icon: '🎯',
        gradient: 'linear-gradient(135deg, #F59E0B, #D97706)',
    },
    {
        id: 'pet-friendly',
        title: 'Pet Friendly',
        titleAr: 'حيوانات أليفة',
        icon: '🐾',
        gradient: 'linear-gradient(135deg, #EC4899, #DB2777)',
    },
    {
        id: 'hot-tub',
        title: 'Hot Tub',
        titleAr: 'جاكوزي',
        icon: '🛁',
        gradient: 'linear-gradient(135deg, #14B8A6, #0D9488)',
    },
];

export default function CategoryGrid({ locale = 'ar' }: CategoryGridProps) {
    return (
        <section className={styles.section}>
            <h2 className={styles.title}>
                {locale === 'ar' ? 'استكشف حسب الفئة' : 'Explore by Category'}
            </h2>

            <div className={styles.grid}>
                {categories.map((category) => (
                    <button key={category.id} className={styles.card}>
                        <div
                            className={styles.iconWrapper}
                            style={{ background: category.gradient }}
                        >
                            <span className={styles.icon}>{category.icon}</span>
                        </div>
                        <span className={styles.label}>
                            {locale === 'ar' ? category.titleAr : category.title}
                        </span>
                    </button>
                ))}
            </div>
        </section>
    );
}
