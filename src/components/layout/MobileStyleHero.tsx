'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import styles from './MobileStyleHero.module.css';

interface MobileStyleHeroProps {
    title: string;
    subtitle: string;
}

export default function MobileStyleHero({ title, subtitle }: MobileStyleHeroProps) {
    return (
        <section className={styles.heroWrapper}>
            <div className={styles.heroContent}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className={styles.textContent}
                >
                    <h1 className={styles.title}>{title}</h1>
                    <p className={styles.subtitle}>{subtitle}</p>
                </motion.div>
            </div>

            {/* Decorative Circles similar to Mobile Splash/Header if needed, or just clean green */}
            <div className={styles.decorationCircle} />
        </section>
    );
}
