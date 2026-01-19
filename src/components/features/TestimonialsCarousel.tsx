'use client';

import { useState, useEffect, useCallback } from 'react';
import Icons from '@/components/ui/Icons';
import { DotPattern, BlobShape, CurveDivider } from '@/components/ui/Patterns';

interface Testimonial {
    id: string;
    name: string;
    location: string;
    rating: number;
    comment: string;
    avatar: string;
    stayedAt: string;
}

const TESTIMONIALS: Testimonial[] = [
    {
        id: 't1',
        name: 'Sarah Mitchell',
        location: 'London, UK',
        rating: 5,
        comment: 'Absolutely breathtaking! The Dead Sea villa exceeded all our expectations. The infinity pool overlooking the sea was the highlight of our trip to Jordan.',
        avatar: '👩‍💼',
        stayedAt: 'Royal Dead Sea Villa'
    },
    {
        id: 't2',
        name: 'Ahmed Al-Rashid',
        location: 'Dubai, UAE',
        rating: 5,
        comment: 'The attention to detail was remarkable. From the moment we arrived, we felt like royalty. Will definitely be returning with family.',
        avatar: '👨‍💻',
        stayedAt: 'Petra Desert Lodge'
    },
    {
        id: 't3',
        name: 'Maria Garcia',
        location: 'Madrid, Spain',
        rating: 5,
        comment: 'A hidden gem! The Ajloun cabin was so peaceful and the views of the forest were magical. Perfect escape from city life.',
        avatar: '👩‍🎨',
        stayedAt: 'Ajloun Forest Cabin'
    },
    {
        id: 't4',
        name: 'James Chen',
        location: 'Singapore',
        rating: 5,
        comment: 'Incredible service and stunning location. The team went above and beyond to make our honeymoon special. Highly recommended!',
        avatar: '👨‍✈️',
        stayedAt: 'Aqaba Luxury Suite'
    }
];

export default function TestimonialsCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    const goToNext = useCallback(() => {
        setCurrentIndex(prev => (prev + 1) % TESTIMONIALS.length);
    }, []);

    const goToPrev = useCallback(() => {
        setCurrentIndex(prev => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
    }, []);

    // Auto-play
    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(goToNext, 5000);
        return () => clearInterval(interval);
    }, [isAutoPlaying, goToNext]);

    const current = TESTIMONIALS[currentIndex];

    return (
        <section className="testimonials-section relative overflow-hidden">
            <CurveDivider position="top" color="hsl(var(--background))" style={{ height: '4rem', zIndex: 5 }} />
            <DotPattern color="hsl(var(--foreground))" style={{ top: 0, right: 0, width: '16rem', height: '16rem', opacity: 0.03 }} />
            <BlobShape color="hsl(var(--primary))" style={{ bottom: 0, left: 0, width: '24rem', height: '24rem', opacity: 0.03 }} />

            <div className="container relative z-10">
                <div className="section-header">
                    <span className="label">What Our Guests Say</span>
                    <h2>Trusted by Travelers Worldwide</h2>
                </div>

                <div
                    className="carousel"
                    onMouseEnter={() => setIsAutoPlaying(false)}
                    onMouseLeave={() => setIsAutoPlaying(true)}
                >
                    <div className="testimonial-card">
                        <div className="quote-icon">"</div>

                        <div className="rating">
                            {[...Array(5)].map((_, i) => (
                                <span key={i} className={i < current.rating ? 'star filled' : 'star'}>
                                    {i < current.rating ? (
                                        <Icons.StarFilled size={20} />
                                    ) : (
                                        <Icons.Star size={20} />
                                    )}
                                </span>
                            ))}
                        </div>

                        <p className="comment">{current.comment}</p>

                        <div className="author">
                            <div className="avatar">{current.avatar}</div>
                            <div className="author-info">
                                <strong className="name">{current.name}</strong>
                                <span className="location">{current.location}</span>
                                <span className="stayed">Stayed at {current.stayedAt}</span>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="nav-controls">
                        <button className="nav-btn" onClick={goToPrev} aria-label="Previous testimonial">
                            <Icons.ChevronLeft size={24} />
                        </button>

                        <div className="dots">
                            {TESTIMONIALS.map((_, idx) => (
                                <button
                                    key={idx}
                                    className={`dot ${idx === currentIndex ? 'active' : ''}`}
                                    onClick={() => setCurrentIndex(idx)}
                                    aria-label={`Go to testimonial ${idx + 1}`}
                                />
                            ))}
                        </div>

                        <button className="nav-btn" onClick={goToNext} aria-label="Next testimonial">
                            <Icons.ChevronRight size={24} />
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .testimonials-section {
                    padding: 6rem 0;
                    background: linear-gradient(135deg, hsl(var(--secondary) / 0.3) 0%, hsl(var(--background)) 100%);
                }

                .section-header {
                    text-align: center;
                    margin-bottom: 3rem;
                }

                .label {
                    display: inline-block;
                    background: linear-gradient(135deg, #f5a623, #d4920a);
                    color: white;
                    padding: 0.5rem 1.5rem;
                    border-radius: 2rem;
                    font-size: 0.875rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin-bottom: 1rem;
                }

                .section-header h2 {
                    font-family: var(--font-serif);
                    font-size: 2.5rem;
                    color: hsl(var(--foreground));
                    margin: 0;
                }

                .carousel {
                    max-width: 800px;
                    margin: 0 auto;
                }

                .testimonial-card {
                    background: hsl(var(--card));
                    border-radius: 1.5rem;
                    padding: 3rem;
                    text-align: center;
                    border: 1px solid hsl(var(--border));
                    box-shadow: 0 10px 40px rgba(0,0,0,0.1);
                    position: relative;
                }

                .quote-icon {
                    position: absolute;
                    top: -20px;
                    left: 50%;
                    transform: translateX(-50%);
                    font-size: 4rem;
                    font-family: Georgia, serif;
                    background: linear-gradient(135deg, #f5a623, #d4920a);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    line-height: 1;
                }

                .rating {
                    margin-bottom: 1.5rem;
                }

                .star {
                    font-size: 1.25rem;
                    color: #ddd;
                    margin: 0 2px;
                }

                .star.filled {
                    color: #f5a623;
                }

                .comment {
                    font-size: 1.25rem;
                    line-height: 1.8;
                    color: hsl(var(--foreground));
                    margin-bottom: 2rem;
                    font-style: italic;
                }

                .author {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 1rem;
                }

                .avatar {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, hsl(var(--primary) / 0.2), hsl(var(--secondary)));
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.75rem;
                }

                .author-info {
                    text-align: left;
                    display: flex;
                    flex-direction: column;
                }

                .name {
                    font-weight: 600;
                    color: hsl(var(--foreground));
                    font-size: 1.1rem;
                }

                .location {
                    color: hsl(var(--muted-foreground));
                    font-size: 0.9rem;
                }

                .stayed {
                    color: hsl(var(--primary));
                    font-size: 0.85rem;
                    font-weight: 500;
                }

                .nav-controls {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 1.5rem;
                    margin-top: 2rem;
                }

                .nav-btn {
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    border: 1px solid hsl(var(--border));
                    background: hsl(var(--card));
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: hsl(var(--foreground));
                    transition: all 0.2s ease;
                }

                .nav-btn:hover {
                    background: hsl(var(--primary));
                    color: white;
                    border-color: hsl(var(--primary));
                }

                .dots {
                    display: flex;
                    gap: 0.5rem;
                }

                .dot {
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    border: none;
                    background: hsl(var(--border));
                    cursor: pointer;
                    transition: all 0.2s ease;
                    padding: 0;
                }

                .dot.active {
                    background: linear-gradient(135deg, #f5a623, #d4920a);
                    transform: scale(1.2);
                }

                @media (max-width: 768px) {
                    .testimonials-section {
                        padding: 4rem 0;
                    }

                    .section-header h2 {
                        font-size: 1.75rem;
                    }

                    .testimonial-card {
                        padding: 2rem 1.5rem;
                    }

                    .comment {
                        font-size: 1rem;
                    }

                    .author {
                        flex-direction: column;
                        text-align: center;
                    }

                    .author-info {
                        text-align: center;
                    }
                }
            `}</style>
        </section>
    );
}
