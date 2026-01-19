'use client';

import { useState, useEffect } from 'react';
import { StarFilled } from '@/components/ui/Icons';

interface StickyPriceBarProps {
    chaletName: string;
    price: number;
    rating: number;
    onBookClick: () => void;
}

export default function StickyPriceBar({ chaletName, price, rating, onBookClick }: StickyPriceBarProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > 400);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className={`sticky-price-bar ${isVisible ? 'visible' : ''}`}>
            <div className="container bar-content">
                <div className="chalet-info">
                    <h4>{chaletName}</h4>
                    <div className="meta">
                        <span className="rating">
                            <StarFilled size={14} color="#f5a623" />
                            {rating}
                        </span>
                        <span className="separator">•</span>
                        <span className="reviews">120 reviews</span>
                    </div>
                </div>

                <div className="price-action">
                    <div className="price">
                        <span className="amount">{price} JOD</span>
                        <span className="period">/ night</span>
                    </div>
                    <button className="book-btn" onClick={onBookClick}>
                        Book Now
                    </button>
                </div>
            </div>

            <style jsx>{`
                .sticky-price-bar {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    background: hsl(var(--background));
                    border-bottom: 1px solid hsl(var(--border));
                    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
                    z-index: 900;
                    transform: translateY(-100%);
                    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .sticky-price-bar.visible {
                    transform: translateY(0);
                }

                .bar-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.75rem 1rem;
                    gap: 1rem;
                }

                .chalet-info h4 {
                    margin: 0;
                    font-size: 1rem;
                    font-weight: 600;
                    color: hsl(var(--foreground));
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-width: 300px;
                }

                .meta {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.8rem;
                    color: hsl(var(--muted-foreground));
                }

                .rating {
                    color: #f5a623;
                    font-weight: 600;
                }

                .separator {
                    opacity: 0.5;
                }

                .price-action {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                }

                .price {
                    text-align: right;
                }

                .amount {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: hsl(var(--foreground));
                }

                .period {
                    font-size: 0.8rem;
                    color: hsl(var(--muted-foreground));
                    margin-left: 0.25rem;
                }

                .book-btn {
                    background: linear-gradient(135deg, #f5a623, #d4920a);
                    color: white;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 2rem;
                    font-weight: 600;
                    font-size: 0.9rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    white-space: nowrap;
                }

                .book-btn:hover {
                    transform: scale(1.05);
                    box-shadow: 0 4px 15px rgba(245, 166, 35, 0.4);
                }

                @media (max-width: 768px) {
                    .chalet-info {
                        display: none;
                    }

                    .bar-content {
                        justify-content: center;
                    }

                    .price-action {
                        width: 100%;
                        justify-content: space-between;
                    }
                }
            `}</style>
        </div>
    );
}
