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
    image: string;
}

const categories: Category[] = [
    {
        id: 'extra-activities',
        title: 'Extra Activities',
        titleAr: 'أنشطة إضافية',
        image: '/images/categories/activities.jpg'
    },
    {
        id: 'large-groups',
        title: 'Large Groups',
        titleAr: 'مجموعات كبيرة',
        image: '/images/categories/groups.jpg'
    },
    {
        id: 'nature-view',
        title: 'Nature View',
        titleAr: 'إطلالة طبيعية',
        image: '/images/categories/nature.jpg'
    }
];

export default function CategoryGrid({ locale = 'ar' }: CategoryGridProps) {
    return (
        <section className={styles.section}>
            <h2 className={styles.title}>Explore by Category</h2>

            <div className={styles.grid}>
                {categories.map((category) => (
                    <div key={category.id} className={styles.card}>
                        <div className={styles.imageWrapper}>
                            {/* Placeholder gradient since we don't have actual images */}
                            <div className={styles.imagePlaceholder}></div>
                        </div>
                        <span className={styles.label}>
                            {locale === 'ar' ? category.titleAr : category.title}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
}
