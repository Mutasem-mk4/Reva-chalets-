'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Chalet } from '@/lib/data';
import { Sparkles, MapPin, StarFilled } from '@/components/ui/Icons';

interface RecommendationsProps {
    currentChaletId: string;
    currentLocation: string;
    allChalets: Chalet[];
    lang: string;
}

export default function Recommendations({
    currentChaletId,
    currentLocation,
    allChalets,
    lang
}: RecommendationsProps) {
    const [recommendations, setRecommendations] = useState<Chalet[]>([]);

    useEffect(() => {
        // Filter out current chalet and find similar ones
        // Priority: same location > different location
        const sameLocation = allChalets.filter(
            c => c.id !== currentChaletId && c.location.includes(currentLocation.split(',')[0])
        );

        const differentLocation = allChalets.filter(
            c => c.id !== currentChaletId && !c.location.includes(currentLocation.split(',')[0])
        );

        // Combine: same location first, then others
        const combined = [...sameLocation, ...differentLocation].slice(0, 3);
        setRecommendations(combined);
    }, [currentChaletId, currentLocation, allChalets]);

    if (recommendations.length === 0) return null;

    // Extract area name for messaging
    const areaName = currentLocation.split(',')[0].trim();

    return (
        <section className="recommendations">
            <div className="header">
                <span className="tag">
                    <Sparkles size={14} className="tag-icon" />
                    Personalized for You
                </span>
                <h3>Because you viewed {areaName} chalets...</h3>
                <p className="subtitle">Similar stays you might love</p>
            </div>

            <div className="cards">
                {recommendations.map((chalet) => (
                    <Link
                        key={chalet.id}
                        href={`/${lang}/chalets/${chalet.id}`}
                        className="card"
                    >
                        <div className="card-image">
                            <Image
                                src={chalet.images[0]}
                                alt={chalet.name}
                                width={200}
                                height={150}
                            />
                            {chalet.location.includes(areaName) && (
                                <span className="same-area-badge">Same Area</span>
                            )}
                        </div>
                        <div className="card-content">
                            <h4>{chalet.name}</h4>
                            <p className="location">
                                <MapPin size={12} className="loc-icon" />
                                {chalet.location}
                            </p>
                            <div className="card-footer">
                                <span className="price">{chalet.price} JOD</span>
                                <span className="rating">
                                    <StarFilled size={12} color="#f5a623" />
                                    {chalet.rating}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <style jsx>{`
                .recommendations {
                    margin-top: 3rem;
                    padding: 2rem;
                    background: linear-gradient(135deg, hsl(var(--primary) / 0.05), hsl(var(--primary) / 0.02));
                    border: 1px solid hsl(var(--primary) / 0.2);
                    border-radius: 1rem;
                }

                .header {
                    margin-bottom: 1.5rem;
                }

                .tag {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: linear-gradient(135deg, #f5a623, #d4920a);
                    color: white;
                    padding: 0.25rem 0.75rem;
                    border-radius: 1rem;
                    font-size: 0.75rem;
                    font-weight: 600;
                    margin-bottom: 0.75rem;
                }

                h3 {
                    font-family: var(--font-serif);
                    font-size: 1.5rem;
                    color: hsl(var(--foreground));
                    margin: 0 0 0.5rem 0;
                }

                .subtitle {
                    color: hsl(var(--muted-foreground));
                    font-size: 0.9rem;
                    margin: 0;
                }

                .cards {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1rem;
                }

                .card {
                    background: hsl(var(--card));
                    border: 1px solid hsl(var(--border));
                    border-radius: 0.75rem;
                    overflow: hidden;
                    text-decoration: none;
                    transition: all 0.2s ease;
                }

                .card:hover {
                    border-color: hsl(var(--primary));
                    transform: translateY(-4px);
                    box-shadow: 0 8px 20px rgba(0,0,0,0.1);
                }

                .card-image {
                    position: relative;
                    aspect-ratio: 4/3;
                    overflow: hidden;
                    background: hsl(var(--secondary));
                }

                .card-image :global(img) {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .same-area-badge {
                    position: absolute;
                    top: 0.5rem;
                    left: 0.5rem;
                    background: linear-gradient(135deg, #22c55e, #16a34a);
                    color: white;
                    padding: 0.2rem 0.5rem;
                    border-radius: 0.25rem;
                    font-size: 0.65rem;
                    font-weight: 600;
                }

                .card-content {
                    padding: 1rem;
                }

                h4 {
                    font-size: 0.95rem;
                    font-weight: 600;
                    color: hsl(var(--foreground));
                    margin: 0 0 0.25rem 0;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .location {
                    font-size: 0.75rem;
                    color: hsl(var(--muted-foreground));
                    margin: 0 0 0.75rem 0;
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                }

                .card-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .price {
                    font-weight: 700;
                    color: hsl(var(--primary));
                    font-size: 0.9rem;
                }

                .rating {
                    color: #f5a623;
                    font-size: 0.8rem;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                }

                @media (max-width: 768px) {
                    .cards {
                        grid-template-columns: 1fr;
                    }

                    .recommendations {
                        padding: 1.5rem;
                    }

                    h3 {
                        font-size: 1.25rem;
                    }
                }
            `}</style>
        </section>
    );
}
