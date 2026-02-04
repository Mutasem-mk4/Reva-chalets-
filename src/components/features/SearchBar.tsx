'use client';

import React from 'react';
import styles from './SearchBar.module.css';

interface SearchBarProps {
    locale?: string;
}

export default function SearchBar({ locale = 'ar' }: SearchBarProps) {
    return (
        <section className={styles.searchSection}>
            {/* Search Input */}
            <div className={styles.searchContainer}>
                <div className={styles.searchInputWrapper}>
                    <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                        <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search farms"
                        className={styles.searchInput}
                    />
                </div>
                <button className={styles.filterButton} aria-label="Filters">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <circle cx="4" cy="14" r="2" stroke="currentColor" strokeWidth="2" />
                        <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="2" />
                        <circle cx="20" cy="16" r="2" stroke="currentColor" strokeWidth="2" />
                    </svg>
                </button>
            </div>

            {/* Filter Tags */}
            <div className={styles.filterTags}>
                <button className={styles.filterTag}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                        <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <span>Date</span>
                </button>

                <button className={styles.filterTag}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z" stroke="currentColor" strokeWidth="2" />
                        <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <span>Location</span>
                </button>

                <button className={styles.filterTag}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" />
                        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <span>Guests</span>
                </button>
            </div>
        </section>
    );
}
