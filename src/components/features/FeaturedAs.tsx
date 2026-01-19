'use client';

import { Trophy, Globe, Map, FileText, Camera, Plane } from '@/components/ui/Icons';

export default function FeaturedAs() {
    // Using text-based logos for demo - in production, use actual logo images
    const partners = [
        { name: 'TripAdvisor', icon: <Trophy size={20} /> },
        { name: 'Booking.com', icon: <Globe size={20} /> },
        { name: 'Lonely Planet', icon: <Map size={20} /> },
        { name: 'Forbes Travel', icon: <FileText size={20} /> },
        { name: 'National Geographic', icon: <Camera size={20} /> },
        { name: 'Travel + Leisure', icon: <Plane size={20} /> }
    ];

    return (
        <section className="featured-as">
            <div className="container">
                <p className="label">Trusted by the World's Best</p>
                <div className="logos">
                    {partners.map((partner, idx) => (
                        <div key={idx} className="logo-item">
                            {partner.icon}
                            <span className="name">{partner.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .featured-as {
                    padding: 3rem 0;
                    background: hsl(var(--secondary) / 0.3);
                    border-top: 1px solid hsl(var(--border));
                    border-bottom: 1px solid hsl(var(--border));
                }

                .label {
                    text-align: center;
                    font-size: 0.875rem;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: hsl(var(--muted-foreground));
                    margin-bottom: 2rem;
                }

                .logos {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 2rem 3rem;
                }

                .logo-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    opacity: 0.6;
                    transition: opacity 0.2s, transform 0.2s;
                    cursor: default;
                }

                .logo-item:hover {
                    opacity: 1;
                    transform: scale(1.05);
                }

                .icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: hsl(var(--primary));
                }

                .name {
                    font-size: 1rem;
                    font-weight: 600;
                    color: hsl(var(--foreground));
                    letter-spacing: -0.01em;
                }

                @media (max-width: 768px) {
                    .logos {
                        gap: 1.5rem 2rem;
                    }

                    .logo-item {
                        flex-direction: column;
                        gap: 0.25rem;
                    }

                    .name {
                        font-size: 0.75rem;
                    }

                    .icon {
                        font-size: 1.25rem;
                    }
                }
            `}</style>
        </section>
    );
}
