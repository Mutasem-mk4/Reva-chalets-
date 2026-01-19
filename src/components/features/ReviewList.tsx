'use client';

import type { Review } from '@/lib/data';
import { Star, StarFilled, Check } from '@/components/ui/Icons';

export default function ReviewList({ reviews }: { reviews: Review[] }) {
    if (!reviews || reviews.length === 0) {
        return <p className="text-muted-foreground italic">No reviews yet. Be the first to share your experience!</p>;
    }

    return (
        <div className="reviews-grid">
            {reviews.map((review) => (
                <div key={review.id} className="review-card">
                    <div className="review-header">
                        <div className="avatar">
                            {review.user.charAt(0)}
                        </div>
                        <div className="meta">
                            <div className="user-row">
                                <span className="username">{review.user}</span>
                                <span className="verified-badge">
                                    <Check size={10} className="badge-icon" />
                                    Verified Guest
                                </span>
                            </div>
                            <span className="date">{review.date}</span>
                        </div>
                        <div className="rating">
                            {Array.from({ length: 5 }).map((_, i) => (
                                i < review.rating ? (
                                    <StarFilled key={i} size={14} color="#fbbf24" />
                                ) : (
                                    <Star key={i} size={14} style={{ opacity: 0.3 }} />
                                )
                            ))}
                        </div>
                    </div>
                    <p className="comment">"{review.comment}"</p>
                </div>
            ))}

            <style jsx>{`
        .reviews-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 1.5rem;
        }

        .review-card {
            background: hsl(var(--card));
            padding: 1.5rem;
            border-radius: var(--radius);
            border: 1px solid hsl(var(--border) / 0.6);
            transition: transform 0.2s;
        }

        .review-card:hover {
            border-color: #fbbf24;
            transform: translateY(-2px);
        }

        .review-header {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1rem;
        }

        .avatar {
            width: 42px;
            height: 42px;
            background: hsl(var(--secondary));
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            color: hsl(var(--foreground));
        }

        .meta {
            flex: 1;
        }

        .user-row {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .username {
            font-weight: 600;
            font-size: 0.95rem;
        }

        .verified-badge {
            font-size: 0.7rem;
            background: #dcfce7;
            color: #166534;
            padding: 0.15rem 0.5rem;
            border-radius: 4px;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 0.25rem;
        }

        .date {
            display: block;
            font-size: 0.8rem;
            color: hsl(var(--muted-foreground));
        }

        .comment {
            font-style: italic;
            color: hsl(var(--foreground) / 0.9);
            line-height: 1.6;
        }
      `}</style>
        </div>
    );
}
