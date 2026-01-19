'use client';

import styles from './Skeleton.module.css';

interface SkeletonProps {
    width?: string | number;
    height?: string | number;
    borderRadius?: string;
    className?: string;
}

export function Skeleton({ width = '100%', height = '1rem', borderRadius = '0.5rem', className = '' }: SkeletonProps) {
    return (
        <div
            className={`${styles.skeleton} ${className}`}
            style={{ width, height, borderRadius }}
        />
    );
}

// ═══════════════════════════════════════════════════════════════
// PAGE SKELETONS
// ═══════════════════════════════════════════════════════════════

export function HeaderSkeleton() {
    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Skeleton width={120} height={40} borderRadius="0.5rem" />
                <nav className={styles.nav}>
                    <Skeleton width={60} height={20} />
                    <Skeleton width={60} height={20} />
                    <Skeleton width={60} height={20} />
                    <Skeleton width={60} height={20} />
                </nav>
                <div className={styles.actions}>
                    <Skeleton width={80} height={36} borderRadius="2rem" />
                </div>
            </div>
        </header>
    );
}

export function HeroSkeleton() {
    return (
        <section className={styles.hero}>
            <div className={styles.heroContent}>
                <Skeleton width="60%" height="3rem" className={styles.center} />
                <Skeleton width="40%" height="1.5rem" className={styles.center} />
                <Skeleton width={200} height={48} borderRadius="2rem" className={styles.center} />
            </div>
        </section>
    );
}

export function ChaletCardSkeleton() {
    return (
        <div className={styles.chaletCard}>
            <Skeleton height={200} borderRadius="1rem 1rem 0 0" />
            <div className={styles.cardContent}>
                <Skeleton width="70%" height="1.5rem" />
                <Skeleton width="50%" height="1rem" />
                <Skeleton width="30%" height="1rem" />
            </div>
        </div>
    );
}

export function ChaletsGridSkeleton({ count = 6 }: { count?: number }) {
    return (
        <section className={styles.chaletsSection}>
            <div className={styles.sectionHeader}>
                <Skeleton width={200} height="2rem" />
                <Skeleton width={100} height="1.5rem" />
            </div>
            <div className={styles.chaletsGrid}>
                {Array.from({ length: count }).map((_, i) => (
                    <ChaletCardSkeleton key={i} />
                ))}
            </div>
        </section>
    );
}

export function HomePageSkeleton() {
    return (
        <div className={styles.page}>
            <HeroSkeleton />
            <ChaletsGridSkeleton count={6} />
        </div>
    );
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

export function FullPageSkeleton() {
    return (
        <div className={styles.fullPage}>
            <HeaderSkeleton />
            <main className={styles.main}>
                <HomePageSkeleton />
            </main>
            <FooterSkeleton />
        </div>
    );
}

export default Skeleton;
