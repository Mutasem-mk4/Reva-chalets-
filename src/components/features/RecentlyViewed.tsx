'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, ArrowRight } from '@/components/ui/Icons';

interface ViewedChalet {
    id: string;
    name: string;
    image: string;
    price: number;
    timestamp: number;
}

const STORAGE_KEY = 'revaRecentlyViewed';
const MAX_ITEMS = 4;

// Hook to manage recently viewed chalets
export function useRecentlyViewed() {
    const addViewed = (chalet: Omit<ViewedChalet, 'timestamp'>) => {
        if (typeof window === 'undefined') return;

        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            let items: ViewedChalet[] = stored ? JSON.parse(stored) : [];

            // Remove if already exists
            items = items.filter(item => item.id !== chalet.id);

            // Add to beginning with timestamp
            items.unshift({
                ...chalet,
                timestamp: Date.now()
            });

            // Keep only max items
            items = items.slice(0, MAX_ITEMS);

            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch (e) {
            console.error('Error saving recently viewed:', e);
        }
    };

    return { addViewed };
}

// Component to display recently viewed chalets
export default function RecentlyViewed({ lang }: { lang: string }) {
    const [items, setItems] = useState<ViewedChalet[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                setItems(parsed);
            }
        } catch (e) {
            console.error('Error loading recently viewed:', e);
        }
        setIsLoaded(true);
    }, []);

    if (!isLoaded || items.length === 0) return null;

    return (
        <section className="recently-viewed">
            <div className="container">
                <div className="header">
                    <div className="title-area">
                        <span className="icon">
                            <Eye size={20} />
                        </span>
                        <h3>Continue Where You Left Off</h3>
                    </div>
                    <Link href={`/${lang}/chalets`} className="view-all">
                        View All <ArrowRight size={14} style={{ display: 'inline', marginLeft: '0.25rem' }} />
                    </Link>
                </div>

                <div className="items-grid">
                    {items.map((item) => (
                        <Link
                            key={item.id}
                            href={`/${lang}/chalets/${item.id}`}
                            className="item"
                        >
                            <div className="item-image">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={120}
                                    height={80}
                                />
                            </div>
                            <div className="item-info">
                                <span className="item-name">{item.name}</span>
                                <span className="item-price">{item.price} JOD/night</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .recently-viewed {
                    padding: 2rem 0;
                    background: linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--secondary) / 0.3) 100%);
                    border-top: 1px solid hsl(var(--border));
                }

                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                }

                .title-area {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: hsl(var(--primary));
                }

                h3 {
                    font-family: var(--font-serif);
                    font-size: 1.25rem;
                    color: hsl(var(--foreground));
                    margin: 0;
                }

                .view-all {
                    color: hsl(var(--primary));
                    font-size: 0.875rem;
                    font-weight: 500;
                    text-decoration: none;
                    transition: opacity 0.2s;
                }

                .view-all:hover {
                    opacity: 0.7;
                }

                .items-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 1rem;
                }

                .item {
                    display: flex;
                    gap: 0.75rem;
                    padding: 0.75rem;
                    background: hsl(var(--card));
                    border: 1px solid hsl(var(--border));
                    border-radius: 0.75rem;
                    text-decoration: none;
                    transition: all 0.2s ease;
                }

                .item:hover {
                    border-color: hsl(var(--primary));
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                }

                .item-image {
                    flex-shrink: 0;
                    width: 80px;
                    height: 60px;
                    border-radius: 0.5rem;
                    overflow: hidden;
                    background: hsl(var(--secondary));
                }

                .item-image :global(img) {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .item-info {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    gap: 0.25rem;
                    overflow: hidden;
                }

                .item-name {
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: hsl(var(--foreground));
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .item-price {
                    font-size: 0.75rem;
                    color: hsl(var(--primary));
                    font-weight: 500;
                }

                @media (max-width: 900px) {
                    .items-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }

                @media (max-width: 500px) {
                    .items-grid {
                        grid-template-columns: 1fr;
                    }

                    h3 {
                        font-size: 1rem;
                    }
                }
            `}</style>
        </section>
    );
}
