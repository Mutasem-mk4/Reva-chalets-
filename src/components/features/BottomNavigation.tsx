'use client';

import React from 'react';
import styles from './BottomNavigation.module.css';

interface BottomNavigationProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    locale?: string;
}

interface NavItem {
    id: string;
    label: string;
    labelAr: string;
    icon: React.ReactNode;
    isCenter?: boolean;
}

const navItems: NavItem[] = [
    {
        id: 'home',
        label: 'Home',
        labelAr: 'الرئيسية',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        )
    },
    {
        id: 'trips',
        label: 'Trips',
        labelAr: 'رحلاتي',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" />
            </svg>
        )
    },
    {
        id: 'rewards',
        label: 'Rewards',
        labelAr: 'المكافآت',
        isCenter: true,
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path d="M12 8v4l2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="12" r="3" fill="currentColor" />
            </svg>
        )
    },
    {
        id: 'saved',
        label: 'Saved',
        labelAr: 'المحفوظات',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        )
    },
    {
        id: 'account',
        label: 'Account',
        labelAr: 'حسابي',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" />
                <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
            </svg>
        )
    }
];

export default function BottomNavigation({ activeTab, onTabChange, locale = 'ar' }: BottomNavigationProps) {
    return (
        <nav className={styles.nav}>
            {navItems.map((item) => (
                <button
                    key={item.id}
                    className={`${styles.navItem} ${activeTab === item.id ? styles.active : ''} ${item.isCenter ? styles.center : ''}`}
                    onClick={() => onTabChange(item.id)}
                    aria-label={locale === 'ar' ? item.labelAr : item.label}
                >
                    {item.isCenter && <div className={styles.centerBubble}></div>}
                    <span className={styles.icon}>{item.icon}</span>
                    <span className={styles.label}>
                        {locale === 'ar' ? item.labelAr : item.label}
                    </span>
                    {item.id === 'home' && activeTab === 'home' && (
                        <span className={styles.activeDot}></span>
                    )}
                </button>
            ))}
        </nav>
    );
}
