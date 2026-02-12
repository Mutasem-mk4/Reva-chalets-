'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Check, Lock, StarFilled, Star } from '@/components/ui/Icons';
import { hasCompletedStayAt, createMockBooking, getCompletedStaysAt } from '@/lib/bookingVerification';

export default function ReviewForm({ chaletId, chaletName, locale = 'ar' }: { chaletId: string, chaletName: string, locale?: string }) {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // Check verification status on mount
        const verified = hasCompletedStayAt(chaletId);
        setIsVerified(verified);
        setIsLoading(false);
    }, [chaletId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isVerified || rating === 0) return;

        setIsSubmitting(true);
        try {
            // Find the most recent completed stay to get groupId
            const completedStays = getCompletedStaysAt(chaletId);
            const latestStay = completedStays[0]; // Assuming sorted or just pick first

            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    rating,
                    comment,
                    chaletId,
                    userId: 'mock-user-1', // In a real app, this would be from the session
                    groupId: latestStay?.groupId // Pass groupId to trigger Kaif discount
                })
            });

            if (res.ok) {
                setSubmitted(true);
            } else {
                alert('Failed to submit review');
            }
        } catch (error) {
            console.error("Review submission failed", error);
        } finally {
            setIsSubmitting(false);
        }
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
                <h3><Sparkles size={24} style={{ display: 'inline', marginRight: '0.5rem' }} /> {locale === 'ar' ? 'شكراً لك!' : 'Thank you!'}</h3>
                <p>{locale === 'ar' ? 'تم إرسال تقييمك بنجاح.' : 'Your verified review has been submitted.'}</p>
                <div className="verified-badge">
                    <Check size={14} style={{ display: 'inline', marginRight: '0.4rem' }} />
                    {locale === 'ar' ? 'تقييم ضيف مؤكد' : 'Verified Guest Review'}
                </div>
                <style jsx>{`
                    .success-message {
                        background: #F0FDF4;
                        border: 1px solid #BBF7D0;
                        padding: 2.5rem;
                        border-radius: 20px;
                        text-align: center;
                        color: #166534;
                        box-shadow: 0 4px 15px rgba(0,0,0,0.05);
                    }
                    .verified-badge {
                        display: inline-block;
                        background: #1F423A;
                        color: white;
                        padding: 0.6rem 1.25rem;
                        border-radius: 50px;
                        font-size: 0.9rem;
                        font-weight: 600;
                        margin-top: 1.5rem;
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
                <h3>{locale === 'ar' ? 'للضيوف فقط' : 'Verified Guests Only'}</h3>
                <p>{locale === 'ar' ? `فقط الضيوف الذين أكملوا إقامتهم في ${chaletName} يمكنهم كتابة تقييم.` : `Only guests who have completed a stay at ${chaletName} can write reviews.`}</p>
                <p className="subtext">{locale === 'ar' ? 'هذا يضمن الشفافية والمصداقية لرحلتك القادمة.' : 'This ensures authentic, trustworthy reviews from real guests.'}</p>

                {/* Demo button for testing */}
                {/* Demo button hidden for production feel */}
                {/* <button className="demo-btn" onClick={handleCreateMockBooking}>
                    🧪 Demo: Simulate Completed Stay
                </button> */}

                <style jsx>{`
                    .review-locked {
                        background: white;
                        padding: 3rem;
                        border-radius: 24px;
                        border: 2px dashed #E5E7EB;
                        text-align: center;
                        margin-top: 2rem;
                    }
                    .lock-icon {
                        display: flex;
                        justify-content: center;
                        color: #9CA3AF;
                        margin-bottom: 1.5rem;
                    }
                    h3 {
                        font-family: var(--font-serif);
                        color: #1F423A;
                        font-size: 1.5rem;
                        margin-bottom: 1rem;
                    }
                    p {
                        color: #4B5563;
                        margin-bottom: 1rem;
                        line-height: 1.6;
                    }
                    .subtext {
                        font-size: 0.9rem;
                        color: #9CA3AF;
                    }
                    .demo-btn {
                        margin-top: 2rem;
                        background: #F3F4F6;
                        color: #1F2937;
                        border: 1px solid #D1D5DB;
                        padding: 0.75rem 1.5rem;
                        border-radius: 12px;
                        cursor: pointer;
                        font-size: 0.9rem;
                        font-weight: 600;
                        transition: all 0.2s;
                    }
                    .demo-btn:hover {
                        background: #E5E7EB;
                    }
                `}</style>
            </div>
        );
    }

    // Verified - show review form
    return (
        <form className="review-form" onSubmit={handleSubmit}>
            <div className="form-header">
                <h3>{locale === 'ar' ? 'اكتب تقييمك' : 'Write a Review'}</h3>
                <span className="verified-tag">
                    <Check size={14} style={{ display: 'inline', marginRight: '0.4rem' }} />
                    {locale === 'ar' ? 'ضيف مؤكد' : 'Verified Guest'}
                </span>
            </div>

            <div className="rating-input">
                <label>{locale === 'ar' ? 'التقييم' : 'Your Rating'}</label>
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
                                <StarFilled size={28} color="#E5A61D" />
                            ) : (
                                <Star size={28} color="#E5E7EB" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <div className="form-group">
                <label>{locale === 'ar' ? 'ملاحظاتك' : 'Your Experience'}</label>
                <textarea
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={locale === 'ar' ? 'شاركنا تجربتك في هذا الشاليه...' : 'Share your experience staying at this chalet...'}
                    rows={4}
                />
            </div>

            <button type="submit" className="submit-btn" disabled={rating === 0 || isSubmitting}>
                {isSubmitting ? (locale === 'ar' ? 'جاري الإرسال...' : 'Submitting...') : (locale === 'ar' ? 'إرسال التقييم' : 'Submit Verified Review')}
            </button>

            <style jsx>{`
                .review-form {
                    background: white;
                    padding: 2.5rem;
                    border-radius: 24px;
                    border: 1px solid #E5E7EB;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.03);
                    margin-top: 2rem;
                }
                .form-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                }
                h3 { 
                    margin: 0; 
                    font-family: var(--font-serif); 
                    color: #1F423A;
                    font-size: 1.5rem;
                }
                .verified-tag {
                    background: #1F423A;
                    color: white;
                    padding: 0.4rem 1rem;
                    border-radius: 50px;
                    font-size: 0.8rem;
                    font-weight: 700;
                }
                .form-group { margin-bottom: 2rem; }
                .rating-input { margin-bottom: 2rem; }
                .stars {
                    display: flex;
                    gap: 0.75rem;
                    margin-top: 0.75rem;
                }
                .star-btn {
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 0;
                    transition: transform 0.2s ease;
                }
                .star-btn:hover { transform: scale(1.2) rotate(5deg); }
                label {
                    display: block;
                    margin-bottom: 0.75rem;
                    font-size: 0.95rem;
                    font-weight: 700;
                    color: #374151;
                }
                textarea {
                    width: 100%;
                    padding: 1rem;
                    border-radius: 12px;
                    border: 1px solid #E5E7EB;
                    background: #F9FAFB;
                    color: #1F2937;
                    font-size: 1rem;
                    transition: all 0.2s;
                    resize: vertical;
                }
                textarea:focus {
                    outline: none;
                    border-color: #1F423A;
                    background: white;
                    box-shadow: 0 0 0 3px rgba(31, 66, 58, 0.05);
                }
                .submit-btn {
                    background: #1F423A;
                    color: #ffffff;
                    border: none;
                    padding: 1rem 2rem;
                    border-radius: 50px;
                    font-weight: 700;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(31, 66, 58, 0.15);
                    width: 100%;
                }
                .submit-btn:disabled {
                    background: #9CA3AF;
                    box-shadow: none;
                    cursor: not-allowed;
                }
                .submit-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(31, 66, 58, 0.25);
                }
            `}</style>
        </form>
    );
}

