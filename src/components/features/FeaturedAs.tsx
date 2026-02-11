'use client';

export default function FeaturedAs() {
    const partners = [
        'Royal Jordanian',
        'Visit Jordan',
        'Zain',
        'Jordan Times',
        'Roya TV',
        'Condé Nast Middle East'
    ];

    return (
        <section className="featured-as">
            <div className="container">
                <p className="label">Trusted Partners & Features</p>
                <div className="logos">
                    {partners.map((name, idx) => (
                        <span key={idx} className="logo-text">
                            {name}
                        </span>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .featured-as {
                    padding: 2.5rem 0;
                    border-top: 1px solid var(--color-gray-200);
                    border-bottom: 1px solid var(--color-gray-200);
                    background: var(--color-cream);
                }

                .label {
                    text-align: center;
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 0.15em;
                    color: var(--color-gray-400);
                    margin-bottom: 1.5rem;
                    font-weight: 500;
                }

                .logos {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 1.5rem 3rem;
                }

                .logo-text {
                    font-size: 1rem;
                    font-weight: 700;
                    color: var(--color-gray-400);
                    letter-spacing: -0.02em;
                    transition: color 0.2s ease;
                    cursor: default;
                    user-select: none;
                }

                .logo-text:hover {
                    color: var(--color-forest);
                }

                @media (max-width: 768px) {
                    .logos {
                        gap: 1rem 2rem;
                    }

                    .logo-text {
                        font-size: 0.85rem;
                    }
                }

                @media (max-width: 480px) {
                    .featured-as {
                        padding: 2rem 0;
                    }

                    .logos {
                        gap: 0.75rem 1.5rem;
                    }

                    .logo-text {
                        font-size: 0.8rem;
                    }
                }
            `}</style>
        </section>
    );
}
