'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Check, Lock, StarFilled, Star } from '@/components/ui/Icons';
import { hasCompletedStayAt, createMockBooking } from '@/lib/bookingVerification';

interface ReviewFormProps {
    chaletId: string;
    chaletName: string;
}

export default function ReviewForm({ chaletId, chaletName }: ReviewFormProps) {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check verification status on mount
        const verified = hasCompletedStayAt(chaletId);
        setIsVerified(verified);
        setIsLoading(false);
    }, [chaletId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isVerified) return;
        setSubmitted(true);
        // In a real app, this would POST to API
    };

    const handleCreateMockBooking = () => {
        createMockBooking(chaletId, chaletName);
        setIsVerified(true);
    };

    if (isLoading) {
        return <div className="loading">Checking eligibility...</div>;
    }

    if (submitted) {
        return (
            <div className="success-message">
                <h3><Sparkles size={24} style={{ display: 'inline', marginRight: '0.5rem' }} /> Thank you!</h3>
                <p>Your verified review has been submitted.</p>
                <div className="verified-badge">
                    <Check size={14} style={{ display: 'inline', marginRight: '0.4rem' }} />
                    Verified Guest Review
                </div>
                <style jsx>{`
                    .success-message {
                        background: linear-gradient(135deg, #f0fdf4, #dcfce7);
                        border: 1px solid #86efac;
                        padding: 2rem;
                        border-radius: var(--radius);
                        text-align: center;
                        color: #15803d;
                    }
                    .verified-badge {
                        display: inline-block;
                        background: #15803d;
                        color: white;
                        padding: 0.5rem 1rem;
                        border-radius: 2rem;
                        font-size: 0.85rem;
                        margin-top: 1rem;
                    }
                `}</style>
            </div>
        );
    }

    // Not verified - show locked state
    if (!isVerified) {
        return (
            <div className="review-locked">
                <div className="lock-icon"><Lock size={48} /></div>
                <h3>Verified Guests Only</h3>
                <p>Only guests who have completed a stay at {chaletName} can write reviews.</p>
                <p className="subtext">This ensures authentic, trustworthy reviews from real guests.</p>

                {/* Demo button for testing */}
                <button className="demo-btn" onClick={handleCreateMockBooking}>
                    🧪 Demo: Simulate Completed Stay
                </button>

                <style jsx>{`
                    .review-locked {
                        background: hsl(var(--card));
                        padding: 2.5rem;
                        border-radius: var(--radius);
                        border: 2px dashed hsl(var(--border));
                        text-align: center;
                        margin-top: 2rem;
                    }
                    .lock-icon {
                        display: flex;
                        justify-content: center;
                        color: hsl(var(--muted-foreground));
                        opacity: 0.5;
                        margin-bottom: 1rem;
                    }
                    h3 {
                        font-family: var(--font-serif);
                        color: hsl(var(--foreground));
                        margin-bottom: 0.5rem;
                    }
                    p {
                        color: hsl(var(--muted-foreground));
                        margin-bottom: 0.5rem;
                    }
                    .subtext {
                        font-size: 0.85rem;
                        opacity: 0.7;
                    }
                    .demo-btn {
                        margin-top: 1.5rem;
                        background: hsl(var(--secondary));
                        color: hsl(var(--secondary-foreground));
                        border: 1px solid hsl(var(--border));
                        padding: 0.75rem 1.5rem;
                        border-radius: var(--radius);
                        cursor: pointer;
                        font-size: 0.9rem;
                        transition: all 0.2s;
                    }
                    .demo-btn:hover {
                        background: hsl(var(--muted));
                    }
                `}</style>
            </div>
        );
    }

    // Verified - show review form
    return (
        <form className="review-form" onSubmit={handleSubmit}>
            <div className="form-header">
                <h3>Write a Review</h3>
                <span className="verified-tag">
                    <Check size={14} style={{ display: 'inline', marginRight: '0.4rem' }} />
                    Verified Guest
                </span>
            </div>

            <div className="rating-input">
                <label>Your Rating</label>
                <div className="stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            type="button"
                            key={star}
                            className="star-btn"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(rating)}
                        >
                            {star <= (hover || rating) ? (
                                <StarFilled size={24} color="#f5a623" />
                            ) : (
                                <Star size={24} color="#e2e8f0" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <div className="form-group">
                <label>Your Experience</label>
                <textarea required placeholder="Share your experience staying at this chalet..." rows={4} />
            </div>

            <button type="submit" className="submit-btn" disabled={rating === 0}>
                Submit Verified Review
            </button>

            <style jsx>{`
                .review-form {
                    background: hsl(var(--card));
                    padding: 2rem;
                    border-radius: var(--radius);
                    border: 1px solid hsl(var(--border) / 0.6);
                    margin-top: 2rem;
                }
                .form-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                }
                h3 { margin: 0; font-family: var(--font-serif); }
                .verified-tag {
                    background: linear-gradient(135deg, #15803d, #16a34a);
                    color: white;
                    padding: 0.35rem 0.75rem;
                    border-radius: 2rem;
                    font-size: 0.75rem;
                    font-weight: 600;
                }
                .form-group { margin-bottom: 1.5rem; }
                .rating-input { margin-bottom: 1.5rem; }
                .stars {
                    display: flex;
                    gap: 0.5rem;
                    margin-top: 0.5rem;
                }
                .star-btn {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    padding: 0;
                    transition: transform 0.1s;
                }
                .star-btn:hover { transform: scale(1.2); }
                label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-size: 0.9rem;
                    font-weight: 500;
                }
                textarea {
                    width: 100%;
                    padding: 0.75rem;
                    border-radius: var(--radius);
                    border: 1px solid hsl(var(--border));
                    background: hsl(var(--background));
                    color: hsl(var(--foreground));
                    resize: vertical;
                }
                .submit-btn {
                    background: linear-gradient(135deg, #f5a623, #d4920a);
                    color: #ffffff;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 3rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(245, 166, 35, 0.3);
                }
                .submit-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                .submit-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(245, 166, 35, 0.4);
                }
            `}</style>
        </form>
    );
}

