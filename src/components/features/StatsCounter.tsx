'use client';

import { useEffect, useState, useRef } from 'react';
import { Users, Home, StarFilled, Headphones } from '@/components/ui/Icons';

interface Stat {
    value: number;
    suffix: string;
    labelEn: string;
    labelAr: string;
    icon: React.ReactNode;
}

const STATS: Stat[] = [
    { value: 500, suffix: '+', labelEn: 'Happy Guests', labelAr: 'ضيف سعيد', icon: <Users size={28} /> },
    { value: 50, suffix: '+', labelEn: 'Luxury Chalets', labelAr: 'شاليه فاخر', icon: <Home size={28} /> },
    { value: 4.9, suffix: '', labelEn: 'Star Rating', labelAr: 'تقييم عام', icon: <StarFilled size={28} /> },
    { value: 24, suffix: '/7', labelEn: 'Support', labelAr: 'دعم فني', icon: <Headphones size={28} /> }
];

function useCountUp(target: number, isVisible: boolean, duration: number = 2000) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!isVisible) return;

        const steps = 60;
        const increment = target / steps;
        let current = 0;
        const stepDuration = duration / steps;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                setCount(target);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current * 10) / 10);
            }
        }, stepDuration);

        return () => clearInterval(timer);
    }, [target, isVisible, duration]);

    return count;
}

export default function StatsCounter({ locale = 'ar' }: { locale?: string }) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.3 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section ref={ref} className="stats-section">
            <div className="stats-inner">
                <div className="stats-grid">
                    {STATS.map((stat, idx) => (
                        <StatItem key={idx} stat={stat} isVisible={isVisible} delay={idx * 100} locale={locale} />
                    ))}
                </div>
            </div>

            <style jsx>{`
                .stats-section {
                    padding: 0 1rem;
                    margin: 3rem auto;
                    max-width: 1140px;
                }

                .stats-inner {
                    background: var(--gradient-forest);
                    border-radius: 24px;
                    padding: 3.5rem 2rem;
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 2rem;
                }

                @media (max-width: 768px) {
                    .stats-grid {
                        grid-template-columns: repeat(2, 1fr);
                        gap: 2rem 1rem;
                    }

                    .stats-inner {
                        padding: 2.5rem 1.5rem;
                        border-radius: 20px;
                    }
                }

                @media (max-width: 480px) {
                    .stats-section {
                        padding: 0 0.75rem;
                        margin: 2rem auto;
                    }

                    .stats-inner {
                        padding: 2rem 1rem;
                        border-radius: 16px;
                    }
                }
            `}</style>
        </section>
    );
}

function StatItem({ stat, isVisible, delay, locale }: { stat: Stat; isVisible: boolean; delay: number, locale: string }) {
    const count = useCountUp(stat.value, isVisible);
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => setShow(true), delay);
            return () => clearTimeout(timer);
        }
    }, [isVisible, delay]);

    const displayValue = stat.value === 4.9 ? count.toFixed(1) : Math.floor(count);

    return (
        <div className={`stat-item ${show ? 'visible' : ''}`}>
            <span className="icon">{stat.icon}</span>
            <span className="value">
                {displayValue}{stat.suffix}
            </span>
            <span className="label">{locale === 'ar' ? stat.labelAr : stat.labelEn}</span>

            <style jsx>{`
                .stat-item {
                    text-align: center;
                    color: white;
                    opacity: 0;
                    transform: translateY(16px);
                    transition: all 0.5s ease;
                }

                .stat-item.visible {
                    opacity: 1;
                    transform: translateY(0);
                }

                .icon {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-bottom: 0.5rem;
                    color: rgba(251, 191, 36, 0.9);
                }

                .value {
                    display: block;
                    font-size: 2.75rem;
                    font-weight: 700;
                    line-height: 1;
                    margin-bottom: 0.4rem;
                    font-family: var(--font-serif);
                }

                .label {
                    font-size: 0.8rem;
                    opacity: 0.75;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    font-weight: 500;
                }

                @media (max-width: 768px) {
                    .value {
                        font-size: 2rem;
                    }
                }

                @media (max-width: 480px) {
                    .value {
                        font-size: 1.75rem;
                    }
                    .label {
                        font-size: 0.7rem;
                    }
                }
            `}</style>
        </div>
    );
}
