'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
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
            {/* Optimized Background Image */}
            <Image
                src="/images/hero.png"
                alt="Luxury Chalet View"
                fill
                priority
                className={styles.heroBg}
            />
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

            {/* Bottom curve removed by user request */}
        </section>
    );
}
