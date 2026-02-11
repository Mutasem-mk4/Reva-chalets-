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
        comment: 'Absolutely breathtaking! The Royal Dead Sea Villa exceeded all expectations. The infinity pool at sunset is a memory we will cherish forever.',
        avatar: '👩‍💼',
        stayedAt: 'Royal Dead Sea Villa'
    },
    {
        id: 't2',
        name: 'Khalid Al-Otaibi',
        location: 'Riyadh, KSA',
        rating: 5,
        comment: 'The Ajloun Forest Retreat was pure magic. Waking up to the sound of birds and the smell of pine trees was exactly the escape we needed.',
        avatar: '👨‍✈️',
        stayedAt: 'Ajloun Forest Retreat'
    },
    {
        id: 't3',
        name: 'Maria Garcia',
        location: 'Madrid, Spain',
        rating: 5,
        comment: 'We loved the history at Jerash Heritage Lodge. It felt authentic yet comfortable. The traditional breakfast in the garden was delicious!',
        avatar: '👩‍🎨',
        stayedAt: 'Jerash Heritage Lodge'
    },
    {
        id: 't4',
        name: 'James Chen',
        location: 'Singapore',
        rating: 5,
        comment: 'Amman Sky Penthouse is world-class. The view of the city lights at night is stunning, and the location in Abdoun is perfect.',
        avatar: '👨‍💻',
        stayedAt: 'Amman Sky Penthouse'
    },
    {
        id: 't5',
        name: 'Layla Massad',
        location: 'Dubai, UAE',
        rating: 5,
        comment: 'Salt Valley Farm was a joy for our kids. Authentic Jordanian hospitality at its best. We felt like family.',
        avatar: '👩‍⚕️',
        stayedAt: 'Salt Valley Farm'
    }
];

import { useParams } from 'next/navigation';

export default function TestimonialsCarousel() {
    const params = useParams();
    const isAr = params?.lang === 'ar';
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
            {/* CurveDivider removed by user request */}

            <div className="container relative z-10">
                <div className="section-header">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-forest">
                        {isAr ? 'ماذا يقول ضيوفنا' : 'What Our Guests Say'}
                    </h2>
                    <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
                        {isAr ? 'تجارب حقيقية من زبائننا المميزين في شاليهات ريفا' : 'Real experiences from our distinguished guests at Riva Chalets'}
                    </p>
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
                    font-family: var(--font-serif);
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
