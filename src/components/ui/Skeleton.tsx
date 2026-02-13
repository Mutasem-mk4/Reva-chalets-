'use client';

import styles from './Skeleton.module.css';

interface SkeletonProps {
    width?: string | number;
    height?: string | number;
    borderRadius?: string;
    className?: string;
    style?: React.CSSProperties;
}

export function Skeleton({ width = '100%', height = '1rem', borderRadius = '0.5rem', className = '', style = {} }: SkeletonProps) {
    return (
        <div
            className={`${styles.skeleton} ${className}`}
            style={{ width, height, borderRadius, ...style }}
        />
    );
}

// ═══════════════════════════════════════════════════════════════
// COMPONENT SKELETONS
// ═══════════════════════════════════════════════════════════════

export function HeroSkeleton() {
    return (
        <section className={styles.hero}>
            <div className={styles.heroTitle}><Skeleton height="100%" borderRadius="1rem" /></div>
            <div className={styles.heroSubtitle}><Skeleton height="100%" borderRadius="0.5rem" /></div>
            <div className={styles.heroButton}><Skeleton height="100%" borderRadius="99px" /></div>
        </section>
    );
}

export function GoldenCardSkeleton() {
    return (
        <div className={styles.goldenCardWrapper}>
            <div className={styles.goldenCard}>
                <div className={styles.goldenLeft}>
                    <div>
                        <Skeleton width="40%" height={16} style={{ marginBottom: 8 }} />
                        <Skeleton width="70%" height={24} style={{ marginBottom: 16 }} />
                        <div style={{ display: 'flex', gap: 8 }}>
                            <Skeleton width={60} height={16} />
                            <Skeleton width={60} height={16} />
                        </div>
                    </div>
                    <div style={{ marginTop: 16 }}>
                        <Skeleton width="50%" height={16} style={{ marginBottom: 4 }} />
                        <Skeleton width="40%" height={14} />
                    </div>
                </div>
                <div className={styles.goldenRight}>
                    <div className={styles.goldenPass}>
                        <Skeleton height="100%" borderRadius="1rem" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export function CategoriesSkeleton() {
    return (
        <div className={styles.categoriesWrapper}>
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className={styles.categoryPill}>
                    <Skeleton height="100%" borderRadius="99px" />
                </div>
            ))}
        </div>
    );
}

export function ChaletCardSkeleton() {
    return (
        <div className={styles.chaletCard}>
            <div className={styles.cardImage}>
                <Skeleton height="100%" borderRadius="0" />
            </div>
            <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                    <Skeleton width="60%" height={24} />
                    <Skeleton width={40} height={20} borderRadius="4px" />
                </div>
                <Skeleton width="40%" height={14} style={{ marginTop: 8 }} />
                <Skeleton width="70%" height={14} style={{ marginTop: 4 }} />

                <div className={styles.cardFooter}>
                    <div>
                        <Skeleton width={80} height={24} />
                        <Skeleton width={50} height={12} style={{ marginTop: 4 }} />
                    </div>
                    <Skeleton width={90} height={36} borderRadius="99px" />
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════
// PAGE SKELETONS
// ═══════════════════════════════════════════════════════════════

export function ChaletsGridSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className={styles.grid}>
            {Array.from({ length: count }).map((_, i) => (
                <ChaletCardSkeleton key={i} />
            ))}
        </div>
    );
}

export function HomeSkeleton() {
    return (
        <div className={styles.fullPage}>
            <div className={styles.homeContainer}>
                <HeroSkeleton />
                <GoldenCardSkeleton />
                <CategoriesSkeleton />
                <div style={{ padding: '0 1rem' }}>
                    <Skeleton width={150} height={28} style={{ marginBottom: '1.5rem' }} />
                    <ChaletsGridSkeleton count={4} />
                </div>
            </div>
        </div>
    );
}

/* Maintains API mostly compatible but upgrades implementation */
export function FullPageSkeleton() {
    return <HomeSkeleton />;
}

export function ChaletDetailSkeleton() {
    return (
        <div className={styles.chaletDetail}>
            <Skeleton height={400} borderRadius="1rem" />
            <div className={styles.detailContent}>
                <div className={styles.detailMain}>
                    <Skeleton width="80%" height="2.5rem" />
                    <Skeleton width="50%" height="1.5rem" />
                    <Skeleton height={200} />
                </div>
                <div className={styles.detailSidebar}>
                    <div className={styles.bookingCard}>
                        <Skeleton width="60%" height="1.5rem" />
                        <Skeleton height={50} />
                        <Skeleton height={50} />
                        <Skeleton height={48} borderRadius="2rem" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export function FooterSkeleton() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.footerGrid}>
                    <div>
                        <Skeleton width={120} height={40} />
                        <Skeleton width="80%" height="1rem" />
                    </div>
                    <div>
                        <Skeleton width={100} height="1.5rem" />
                        <Skeleton width={80} height="1rem" />
                        <Skeleton width={80} height="1rem" />
                    </div>
                    <div>
                        <Skeleton width={100} height="1.5rem" />
                        <Skeleton width={80} height="1rem" />
                        <Skeleton width={80} height="1rem" />
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Skeleton;
