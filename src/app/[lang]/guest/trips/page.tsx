'use client';

import { use } from 'react';
import { getDictionary } from '@/lib/dictionaries';
import Link from 'next/link';

export default function TripsPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = use(params);
    const dict = getDictionary(lang);

    // Mock Trips Data
    const upcomingTrips = [
        {
            id: 'booking-1',
            chaletName: 'Royal Dead Sea Villa',
            dates: 'Next Weekend',
            status: 'confirmed',
            image: '/images/chalet-1.jpg'
        }
    ];

    return (
        <div className="trips-page">
            <h1 className="title">{dict.rewards?.trips || "My Trips"}</h1>

            <section>
                <h3 className="section-title">Upcoming Stays</h3>
                <div className="trips-list">
                    {upcomingTrips.map(trip => (
                        <div key={trip.id} className="trip-card">
                            <div className="trip-info">
                                <h4>{trip.chaletName}</h4>
                                <p>{trip.dates}</p>
                                <span className="status-badge">{trip.status}</span>
                            </div>
                            <div className="trip-actions">
                                <Link href={`/${lang}/chalets/1`} className="btn-outline">
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="past-trips">
                <h3 className="section-title">Past Stays</h3>
                <p className="empty-text">No history yet.</p>
            </section>

            <style jsx>{`
        .trips-page {
            animation: fadeIn 0.5s ease;
        }

        .title {
            font-family: var(--font-serif);
            font-size: 2rem;
            margin-bottom: 2rem;
        }

        .section-title {
            font-size: 1.2rem;
            margin-bottom: 1rem;
            color: hsl(var(--muted-foreground));
        }

        .trip-card {
            background: hsl(var(--card));
            border: 1px solid hsl(var(--border));
            padding: 1.5rem;
            border-radius: var(--radius);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .trip-info h4 {
            margin: 0 0 0.5rem 0;
            font-size: 1.1rem;
        }

        .status-badge {
            display: inline-block;
            background: #dcfce7;
            color: #166534;
            padding: 0.25rem 0.75rem;
            border-radius: 99px;
            font-size: 0.75rem;
            font-weight: 600;
            margin-top: 0.5rem;
            text-transform: uppercase;
        }

        .btn-outline {
            border: 1px solid hsl(var(--primary));
            color: hsl(var(--primary));
            padding: 0.5rem 1rem;
            border-radius: var(--radius);
            font-size: 0.9rem;
            text-decoration: none;
            transition: all 0.2s;
        }

        .btn-outline:hover {
            background: hsl(var(--primary));
            color: white;
        }

        .past-trips {
            margin-top: 3rem;
            opacity: 0.6;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
      `}</style>
        </div>
    );
}
