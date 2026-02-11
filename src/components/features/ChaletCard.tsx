'use client';

import Link from 'next/link';
import Image from 'next/image';
import TiltCard from '@/components/ui/TiltCard';
import Icons from '@/components/ui/Icons';
import type { Chalet } from '@/lib/data';

interface ChaletCardProps {
    chalet: Chalet;
    lang: string;
    dict: any;
}

// Generate urgency badge based on chalet properties
function getUrgencyBadge(chaletId: string): { text: string; icon: React.ReactNode; type: 'hot' | 'limited' | 'popular' } | null {
    const badges = [
        { text: 'Only 2 left!', icon: <Icons.Fire size={14} />, type: 'hot' as const },
        { text: 'Booked 5x today', icon: <Icons.Lightning size={14} />, type: 'popular' as const },
        { text: 'Popular this week', icon: <Icons.Sparkles size={14} />, type: 'popular' as const },
        { text: 'Limited availability', icon: <Icons.Clock size={14} />, type: 'limited' as const },
        null, // Some chalets won't have badges
    ];
    // Use chalet ID to deterministically assign a badge
    const index = parseInt(chaletId) % badges.length;
    return badges[index];
}

export default function ChaletCard({ chalet, lang, dict }: ChaletCardProps) {
    const urgencyBadge = getUrgencyBadge(chalet.id);

    return (
        <TiltCard className="h-full">
            <Link href={`/${lang}/chalets/${chalet.id}`} className="block h-full">
                <article className="chalet-card h-full">
                    <div className="image-wrapper">
                        <div className="badge">{chalet.location}</div>
                        {urgencyBadge && (
                            <div className={`urgency-badge ${urgencyBadge.type}`}>
                                {urgencyBadge.icon}
                                {urgencyBadge.text}
                            </div>
                        )}
                        <Image
                            src={chalet.images[0]}
                            alt={chalet.name}
                            className="card-image"
                            width={400}
                            height={250}
                            priority={false}
                        />
                    </div>

                    <div className="content">
                        <div className="header">
                            <h3>{chalet.name}</h3>
                            <span className="rating"><Icons.StarFilled size={14} color="#f5a623" /> {chalet.rating}</span>
                        </div>

                        <p className="description">{chalet.description}</p>

                        <div className="amenities">
                            {chalet.amenities.slice(0, 3).map((am, idx) => (
                                <span key={idx} className="amenity-tag">{am}</span>
                            ))}
                            {chalet.amenities.length > 3 && <span className="amenity-tag">+{chalet.amenities.length - 3}</span>}
                        </div>

                        <div className="footer">
                            <div className="price">
                                <div className="price-anchor">
                                    <span className="original-price">{Math.round(chalet.price * 1.25)} JOD</span>
                                    <span className="savings-badge">-20%</span>
                                </div>
                                <div className="current-price">
                                    <span className="amount">{chalet.price} JOD</span>
                                    <span className="period">/ {dict.chalet.pricePerNight}</span>
                                </div>
                            </div>

                            <span className="book-btn">
                                {dict.chalet.book}
                            </span>
                        </div>
                    </div>

                    <style jsx>{`
                    .chalet-card {
                        background: var(--color-cream-light);
                        border: 1px solid #E5E7EB;
                        border-radius: 20px;
                        overflow: hidden;
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        transition: border-color 0.3s ease, box-shadow 0.3s ease;
                        max-width: 100%;
                        width: 100%;
                        box-shadow: 0 4px 16px rgba(0,0,0,0.06);
                    }

                    /* Hover Glow Effect */
                    :global(.tilt-card:hover) .chalet-card {
                        border-color: rgba(27, 59, 54, 0.3);
                        box-shadow: 0 12px 32px rgba(0,0,0,0.12);
                    }

                    .image-wrapper {
                        position: relative;
                        aspect-ratio: 4/3;
                        overflow: hidden;
                        background: var(--color-cream-dark);
                    }

                    .card-image {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        transition: transform 0.7s ease;
                    }

                    :global(.tilt-card:hover) .card-image {
                        transform: scale(1.1);
                    }

                    .badge {
                        position: absolute;
                        top: 1rem;
                        right: 1rem;
                        background: rgba(27, 59, 54, 0.85);
                        backdrop-filter: blur(4px);
                        padding: 0.35rem 0.85rem;
                        border-radius: 2rem;
                        font-size: 0.75rem;
                        font-weight: 600;
                        color: #D1FAE5;
                        z-index: 10;
                        border: 1px solid rgba(167, 243, 208, 0.3);
                    }

                    .urgency-badge {
                        position: absolute;
                        bottom: 1rem;
                        left: 1rem;
                        display: inline-flex;
                        align-items: center;
                        gap: 0.35rem;
                        padding: 0.4rem 0.75rem;
                        border-radius: 0.5rem;
                        font-size: 0.7rem;
                        font-weight: 700;
                        z-index: 10;
                        animation: pulse-badge 2s infinite;
                    }

                    .urgency-badge.hot {
                        background: linear-gradient(135deg, #ef4444, #dc2626);
                        color: white;
                        box-shadow: 0 2px 10px rgba(239, 68, 68, 0.4);
                    }

                    .urgency-badge.popular {
                        background: linear-gradient(135deg, var(--color-gold), var(--color-gold-light));
                        color: white;
                        box-shadow: 0 2px 10px rgba(229, 166, 29, 0.4);
                    }

                    .urgency-badge.limited {
                        background: linear-gradient(135deg, #8b5cf6, #7c3aed);
                        color: white;
                        box-shadow: 0 2px 10px rgba(139, 92, 246, 0.4);
                    }

                    @keyframes pulse-badge {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.03); }
                    }

                    .content {
                        padding: 1.5rem;
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                    }

                    .header {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                        margin-bottom: 0.5rem;
                    }

                    h3 {
                        font-family: var(--font-serif);
                        font-size: 1.25rem;
                        margin: 0;
                        font-weight: 700;
                        color: var(--color-forest);
                    }

                    .rating {
                        display: inline-flex;
                        align-items: center;
                        gap: 0.25rem;
                        color: var(--color-gold);
                        font-weight: 700;
                        font-size: 0.9rem;
                    }

                    .description {
                        color: hsl(var(--muted-foreground));
                        font-size: 0.9rem;
                        line-height: 1.5;
                        margin-bottom: 1rem;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                    }

                    .amenities {
                        display: flex;
                        gap: 0.5rem;
                        margin-bottom: 1.5rem;
                        flex-wrap: wrap;
                    }

                    .amenity-tag {
                        background: #F0FDF4;
                        color: var(--color-forest);
                        font-size: 0.75rem;
                        padding: 0.25rem 0.6rem;
                        border-radius: 6px;
                        border: 1px solid #D1FAE5;
                    }

                    .footer {
                        margin-top: auto;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        border-top: 1px solid hsl(var(--border));
                        padding-top: 1rem;
                    }

                    .price {
                        display: flex;
                        flex-direction: column;
                    }

                    .price-anchor {
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                        margin-bottom: 0.25rem;
                    }

                    .original-price {
                        font-size: 0.85rem;
                        color: hsl(var(--muted-foreground));
                        text-decoration: line-through;
                    }

                    .savings-badge {
                        background: linear-gradient(135deg, #22c55e, #16a34a);
                        color: white;
                        padding: 0.15rem 0.4rem;
                        border-radius: 0.25rem;
                        font-size: 0.7rem;
                        font-weight: 700;
                    }

                    .current-price {
                        display: flex;
                        align-items: baseline;
                        gap: 0.25rem;
                    }

                    .amount {
                        font-size: 1.25rem;
                        font-weight: 700;
                        color: var(--color-forest);
                    }

                    .period {
                        font-size: 0.7rem;
                        text-transform: uppercase;
                        color: hsl(var(--muted-foreground));
                    }

                    .book-btn {
                        background: var(--gradient-forest);
                        color: #ffffff;
                        padding: 0.6rem 1.2rem;
                        border-radius: 99px;
                        font-size: 0.9rem;
                        font-weight: 600;
                        transition: all 0.3s ease;
                        box-shadow: 0 4px 12px rgba(27, 59, 54, 0.25);
                    }

                    :global(.tilt-card:hover) .book-btn {
                        transform: scale(1.05);
                        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                    }

                    @media (max-width: 767px) {
                        .chalet-card {
                            border-radius: 16px;
                        }

                        .image-wrapper {
                            aspect-ratio: 16/10;
                        }

                        .badge {
                            top: 0.75rem;
                            right: 0.75rem;
                            padding: 0.25rem 0.65rem;
                            font-size: 0.7rem;
                        }

                        .urgency-badge {
                            bottom: 0.75rem;
                            left: 0.75rem;
                            padding: 0.3rem 0.6rem;
                            font-size: 0.65rem;
                        }

                        .content {
                            padding: 1rem;
                        }

                        h3 {
                            font-size: 1.1rem;
                        }

                        .rating {
                            font-size: 0.85rem;
                        }

                        .description {
                            font-size: 0.85rem;
                            margin-bottom: 0.75rem;
                            -webkit-line-clamp: 2;
                        }

                        .amenities {
                            gap: 0.35rem;
                            margin-bottom: 1rem;
                        }

                        .amenity-tag {
                            font-size: 0.7rem;
                            padding: 0.2rem 0.5rem;
                        }

                        .footer {
                            padding-top: 0.75rem;
                        }

                        .original-price {
                            font-size: 0.8rem;
                        }

                        .savings-badge {
                            font-size: 0.65rem;
                            padding: 0.1rem 0.35rem;
                        }

                        .amount {
                            font-size: 1.1rem;
                        }

                        .period {
                            font-size: 0.65rem;
                        }

                        .book-btn {
                            padding: 0.5rem 1rem;
                            font-size: 0.85rem;
                        }
                    }
                `}</style>
                </article>
            </Link>
        </TiltCard>
    );
}

