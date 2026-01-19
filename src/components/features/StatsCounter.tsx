'use client';

import { useEffect, useState, useRef } from 'react';
import { Users, Home, StarFilled, Headphones } from '@/components/ui/Icons';

interface Stat {
    value: number;
    suffix: string;
    label: string;
    icon: React.ReactNode;
}

const STATS: Stat[] = [
    { value: 500, suffix: '+', label: 'Happy Guests', icon: <Users size={32} /> },
    { value: 50, suffix: '+', label: 'Luxury Chalets', icon: <Home size={32} /> },
    { value: 4.9, suffix: '', label: 'Star Rating', icon: <StarFilled size={32} /> },
    { value: 24, suffix: '/7', label: 'Support', icon: <Headphones size={32} /> }
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
                setCount(Math.floor(current * 10) / 10); // Keep one decimal for rating
            }
        }, stepDuration);

        return () => clearInterval(timer);
    }, [target, isVisible, duration]);

    return count;
}

export default function StatsCounter() {
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
            <div className="container">
                <div className="stats-grid">
                    {STATS.map((stat, idx) => (
                        <StatItem key={idx} stat={stat} isVisible={isVisible} delay={idx * 100} />
                    ))}
                </div>
            </div>

            <style jsx>{`
                .stats-section {
                    padding: 4rem 0;
                    background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.8) 100%);
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 2rem;
                }

                @media (max-width: 768px) {
                    .stats-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }

                @media (max-width: 480px) {
                    .stats-section {
                        padding: 3rem 0;
                    }
                }
            `}</style>
        </section>
    );
}

function StatItem({ stat, isVisible, delay }: { stat: Stat; isVisible: boolean; delay: number }) {
    const count = useCountUp(stat.value, isVisible);
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => setShow(true), delay);
            return () => clearTimeout(timer);
        }
    }, [isVisible, delay]);

    // Format the display value
    const displayValue = stat.value === 4.9 ? count.toFixed(1) : Math.floor(count);

    return (
        <div className={`stat-item ${show ? 'visible' : ''}`}>
            <span className="icon">{stat.icon}</span>
            <span className="value">
                {displayValue}{stat.suffix}
            </span>
            <span className="label">{stat.label}</span>

            <style jsx>{`
                .stat-item {
                    text-align: center;
                    color: white;
                    opacity: 0;
                    transform: translateY(20px);
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
                    margin-bottom: 0.75rem;
                }

                .value {
                    display: block;
                    font-size: 3rem;
                    font-weight: 700;
                    line-height: 1;
                    margin-bottom: 0.5rem;
                    font-family: var(--font-serif);
                }

                .label {
                    font-size: 0.9rem;
                    opacity: 0.9;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                @media (max-width: 768px) {
                    .value {
                        font-size: 2.25rem;
                    }

                    .icon {
                        font-size: 1.5rem;
                    }
                }
            `}</style>
        </div>
    );
}
