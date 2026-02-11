'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from './MobileStyleHero.module.css';

interface MobileStyleHeroProps {
    title: string;
    subtitle: string;
    ctaText?: string;
    ctaLink?: string;
}

export default function MobileStyleHero({ title, subtitle, ctaText = 'Book Now', ctaLink = '/en/chalets' }: MobileStyleHeroProps) {
    return (
        <section className={styles.heroWrapper}>
            {/* Background Image Overlay */}
            <div className={styles.bgOverlay} />

            <div className={styles.heroContent}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={styles.textContent}
                >
                    <h1 className={styles.title}>{title}</h1>
                    <p className={styles.subtitle}>{subtitle}</p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
                    >
                        <Link href={ctaLink} className={styles.ctaButton}>
                            {ctaText}
                        </Link>
                    </motion.div>
                </motion.div>
            </div>

            {/* Decorative bottom curve */}
            <div className={styles.bottomCurve}>
                <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                    <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="var(--color-cream)" />
                </svg>
            </div>
        </section>
    );
}
