'use client';

import { useState } from 'react';
import { Plus, Minus, ArrowRight } from '@/components/ui/Icons';

interface FAQItem {
    question: string;
    answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
    {
        question: 'How do I book a chalet?',
        answer: 'Simply browse our collection, select your preferred chalet, choose your dates, and complete the booking form. You\'ll receive an instant confirmation email with all the details.'
    },
    {
        question: 'What is the cancellation policy?',
        answer: 'We offer free cancellation up to 48 hours before your check-in date. Cancellations made within 48 hours may be subject to a one-night charge depending on the property.'
    },
    {
        question: 'What time is check-in and check-out?',
        answer: 'Standard check-in time is 3:00 PM and check-out is 11:00 AM. Early check-in or late check-out can be arranged upon request, subject to availability.'
    },
    {
        question: 'Are pets allowed in the chalets?',
        answer: 'Pet policies vary by property. Some of our chalets are pet-friendly while others are not. Check the specific chalet listing or contact us directly to confirm.'
    },
    {
        question: 'Is there a security deposit required?',
        answer: 'Yes, most properties require a refundable security deposit of 50-100 JOD. This is returned within 3-5 business days after checkout, subject to property inspection.'
    },
    {
        question: 'Do you offer airport transfers?',
        answer: 'Yes! We can arrange private airport transfers from Queen Alia International Airport to any of our properties. Contact us 24 hours in advance to book this service.'
    }
];

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleItem = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="faq-section">
            <div className="container">
                <div className="section-header">
                    <span className="label">Got Questions?</span>
                    <h2>Frequently Asked Questions</h2>
                    <p className="subtitle">Everything you need to know before booking your stay</p>
                </div>

                <div className="faq-list">
                    {FAQ_ITEMS.map((item, index) => (
                        <div
                            key={index}
                            className={`faq-item ${openIndex === index ? 'open' : ''}`}
                        >
                            <button
                                className="faq-question"
                                onClick={() => toggleItem(index)}
                                aria-expanded={openIndex === index}
                            >
                                <span className="question-text">{item.question}</span>
                                <span className="icon">
                                    {openIndex === index ? <Minus size={16} /> : <Plus size={16} />}
                                </span>
                            </button>
                            <div className="faq-answer">
                                <p>{item.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="contact-cta">
                    <p>Still have questions?</p>
                    <a href="/contact" className="contact-link">
                        Contact our support team <ArrowRight size={16} style={{ display: 'inline', marginLeft: '0.25rem' }} />
                    </a>
                </div>
            </div>

            <style jsx>{`
                .faq-section {
                    padding: 6rem 0;
                    background: hsl(var(--background));
                }

                .section-header {
                    text-align: center;
                    margin-bottom: 3rem;
                }

                .label {
                    display: inline-block;
                    background: hsl(var(--primary) / 0.1);
                    color: hsl(var(--primary));
                    padding: 0.5rem 1.5rem;
                    border-radius: 2rem;
                    font-size: 0.875rem;
                    font-weight: 600;
                    margin-bottom: 1rem;
                }

                .section-header h2 {
                    font-family: var(--font-serif);
                    font-size: 2.5rem;
                    color: hsl(var(--foreground));
                    margin: 0 0 0.75rem 0;
                }

                .subtitle {
                    color: hsl(var(--muted-foreground));
                    font-size: 1.1rem;
                    margin: 0;
                }

                .faq-list {
                    max-width: 800px;
                    margin: 0 auto;
                }

                .faq-item {
                    border: 1px solid hsl(var(--border));
                    border-radius: 1rem;
                    margin-bottom: 1rem;
                    background: hsl(var(--card));
                    overflow: hidden;
                    transition: all 0.3s ease;
                }

                .faq-item:hover {
                    border-color: hsl(var(--primary) / 0.3);
                }

                .faq-item.open {
                    border-color: hsl(var(--primary));
                    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                }

                .faq-question {
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.25rem 1.5rem;
                    background: none;
                    border: none;
                    cursor: pointer;
                    text-align: left;
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: hsl(var(--foreground));
                    transition: color 0.2s;
                }

                .faq-question:hover {
                    color: hsl(var(--primary));
                }

                .faq-item.open .faq-question {
                    color: hsl(var(--primary));
                }

                .question-text {
                    flex: 1;
                    padding-right: 1rem;
                }

                .icon {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: hsl(var(--secondary));
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.25rem;
                    font-weight: 300;
                    color: hsl(var(--foreground));
                    transition: all 0.3s ease;
                }

                .faq-item.open .icon {
                    background: linear-gradient(135deg, #f5a623, #d4920a);
                    color: white;
                }

                .faq-answer {
                    max-height: 0;
                    overflow: hidden;
                    transition: max-height 0.3s ease, padding 0.3s ease;
                }

                .faq-item.open .faq-answer {
                    max-height: 300px;
                }

                .faq-answer p {
                    padding: 0 1.5rem 1.5rem;
                    color: hsl(var(--muted-foreground));
                    line-height: 1.7;
                    margin: 0;
                }

                .contact-cta {
                    text-align: center;
                    margin-top: 3rem;
                    padding-top: 2rem;
                    border-top: 1px solid hsl(var(--border));
                }

                .contact-cta p {
                    color: hsl(var(--muted-foreground));
                    margin: 0 0 0.5rem 0;
                }

                .contact-link {
                    color: hsl(var(--primary));
                    font-weight: 600;
                    text-decoration: none;
                    transition: opacity 0.2s;
                }

                .contact-link:hover {
                    opacity: 0.8;
                }

                @media (max-width: 768px) {
                    .faq-section {
                        padding: 4rem 0;
                    }

                    .section-header h2 {
                        font-size: 1.75rem;
                    }

                    .faq-question {
                        padding: 1rem;
                        font-size: 1rem;
                    }

                    .faq-answer p {
                        padding: 0 1rem 1rem;
                        font-size: 0.95rem;
                    }
                }
            `}</style>
        </section>
    );
}
