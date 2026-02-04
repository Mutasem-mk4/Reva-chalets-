'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Gift, ArrowRight, X } from '@/components/ui/Icons';

interface TimeLeft {
    hours: number;
    minutes: number;
    seconds: number;
}

export default function PromoBanner() {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({ hours: 23, minutes: 45, seconds: 59 });
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Check if banner was dismissed in this session
        const dismissed = sessionStorage.getItem('promoBannerDismissed');
        if (dismissed) {
            setIsVisible(false);
            document.body.classList.remove('promo-visible');
            return;
        }

        document.body.classList.add('promo-visible');

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                let { hours, minutes, seconds } = prev;

                if (seconds > 0) {
                    seconds--;
                } else if (minutes > 0) {
                    minutes--;
                    seconds = 59;
                } else if (hours > 0) {
                    hours--;
                    minutes = 59;
                    seconds = 59;
                } else {
                    // Reset to 24 hours when timer ends (for demo)
                    return { hours: 23, minutes: 59, seconds: 59 };
                }

                return { hours, minutes, seconds };
            });
        }, 1000);

        return () => {
            clearInterval(timer);
            document.body.classList.remove('promo-visible');
        };
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        sessionStorage.setItem('promoBannerDismissed', 'true');
        document.body.classList.remove('promo-visible');
    };

    if (!isVisible) return null;

    const formatNumber = (n: number) => n.toString().padStart(2, '0');

    return (
        <div className="promo-banner">
            <div className="container banner-content">
                <div className="promo-text">
                    <span className="promo-icon"><Gift size={20} /></span>
                    <span className="promo-label">Limited Time Offer:</span>
                    <span className="promo-discount">15% OFF</span>
                    <span className="promo-detail">all bookings this week!</span>
                </div>

                <div className="countdown">
                    <span className="countdown-label">Ends in:</span>
                    <div className="countdown-timer">
                        <div className="time-block">
                            <span className="time-value">{formatNumber(timeLeft.hours)}</span>
                            <span className="time-label">HRS</span>
                        </div>
                        <span className="separator">:</span>
                        <div className="time-block">
                            <span className="time-value">{formatNumber(timeLeft.minutes)}</span>
                            <span className="time-label">MIN</span>
                        </div>
                        <span className="separator">:</span>
                        <div className="time-block">
                            <span className="time-value">{formatNumber(timeLeft.seconds)}</span>
                            <span className="time-label">SEC</span>
                        </div>
                    </div>
                </div>

                <Link href="/en/chalets" className="promo-cta">
                    Book Now <ArrowRight size={16} style={{ display: 'inline', marginLeft: '0.25rem' }} />
                </Link>

                <button className="dismiss-btn" onClick={handleDismiss} aria-label="Dismiss">
                    <X size={18} />
                </button>
            </div>

            <style jsx>{`
                .promo-banner {
                    background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%);
                    padding: 0.75rem 0;
                    position: relative;
                    overflow: hidden;
                }

                .promo-banner::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 200%;
                    height: 100%;
                    background: linear-gradient(
                        90deg,
                        transparent,
                        rgba(255,255,255,0.1),
                        transparent
                    );
                    animation: shimmer 3s infinite;
                }

                @keyframes shimmer {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(50%); }
                }

                .banner-content {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 2rem;
                    flex-wrap: wrap;
                    position: relative;
                    z-index: 1;
                }

                .promo-text {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: white;
                }

                .promo-icon {
                    font-size: 1.25rem;
                }

                .promo-label {
                    font-weight: 500;
                    opacity: 0.9;
                }

                .promo-discount {
                    background: linear-gradient(135deg, #f5a623, #d4920a);
                    color: white;
                    padding: 0.25rem 0.75rem;
                    border-radius: 0.25rem;
                    font-weight: 700;
                    font-size: 1rem;
                }

                .promo-detail {
                    opacity: 0.9;
                }

                .countdown {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .countdown-label {
                    color: white;
                    opacity: 0.8;
                    font-size: 0.875rem;
                }

                .countdown-timer {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                }

                .time-block {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    background: rgba(255,255,255,0.1);
                    padding: 0.35rem 0.5rem;
                    border-radius: 0.25rem;
                    min-width: 40px;
                }

                .time-value {
                    color: #f5a623;
                    font-weight: 700;
                    font-size: 1.1rem;
                    font-family: monospace;
                    line-height: 1;
                }

                .time-label {
                    color: white;
                    font-size: 0.6rem;
                    opacity: 0.7;
                    text-transform: uppercase;
                }

                .separator {
                    color: #f5a623;
                    font-weight: 700;
                    font-size: 1.1rem;
                }

                .promo-cta {
                    background: linear-gradient(135deg, #f5a623, #d4920a);
                    color: white;
                    padding: 0.5rem 1.25rem;
                    border-radius: 2rem;
                    font-weight: 600;
                    font-size: 0.875rem;
                    text-decoration: none;
                    transition: all 0.2s ease;
                    white-space: nowrap;
                }

                .promo-cta:hover {
                    transform: scale(1.05);
                    box-shadow: 0 4px 15px rgba(245, 166, 35, 0.4);
                }

                .dismiss-btn {
                    position: absolute;
                    right: 1rem;
                    background: rgba(255,255,255,0.1);
                    border: none;
                    color: white;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 1rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.2s;
                }

                .dismiss-btn:hover {
                    background: rgba(255,255,255,0.2);
                }

                @media (max-width: 768px) {
                    .promo-banner {
                        padding: 0.5rem 0;
                    }

                    .banner-content {
                        flex-direction: column;
                        gap: 0.75rem;
                        padding-right: 2.5rem;
                    }

                    .promo-text {
                        flex-wrap: wrap;
                        justify-content: center;
                        text-align: center;
                        font-size: 0.875rem;
                    }

                    .promo-detail {
                        display: none;
                    }

                    .countdown {
                        gap: 0.5rem;
                    }

                    .time-block {
                        min-width: 35px;
                        padding: 0.25rem 0.4rem;
                    }

                    .time-value {
                        font-size: 1rem;
                    }

                    .promo-banner {
                        display: none;
                    }
                }
            `}</style>
        </div>
    );
}
