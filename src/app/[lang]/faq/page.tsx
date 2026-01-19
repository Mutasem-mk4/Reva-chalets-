'use client';

import { useState, use } from 'react';
import { ChevronDown } from '@/components/ui/Icons';

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQSection {
    title: string;
    icon: string;
    items: FAQItem[];
}

const faqData: FAQSection[] = [
    {
        title: 'Booking & Reservations',
        icon: '📅',
        items: [
            {
                question: 'How do I make a booking?',
                answer: 'Simply browse our chalets, select your preferred dates and number of guests, then follow the checkout process. You\'ll receive a confirmation email once your booking is complete.'
            },
            {
                question: 'Can I modify my booking after confirmation?',
                answer: 'Yes, you can modify your booking up to 48 hours before check-in by contacting our support team or through your dashboard. Modifications are subject to availability.'
            },
            {
                question: 'What is the check-in and check-out time?',
                answer: 'Standard check-in is at 3:00 PM and check-out is at 11:00 AM. Early check-in or late check-out can be arranged based on availability for an additional fee.'
            },
        ]
    },
    {
        title: 'Payment & Pricing',
        icon: '💳',
        items: [
            {
                question: 'What payment methods do you accept?',
                answer: 'We accept all major credit cards (Visa, Mastercard, American Express), CliQ instant payments, and bank transfers for bookings made in advance.'
            },
            {
                question: 'Is my payment secure?',
                answer: 'Absolutely! We use 256-bit SSL encryption and process all payments through Stripe, a PCI-compliant payment processor. Your financial information is never stored on our servers.'
            },
            {
                question: 'Are there any hidden fees?',
                answer: 'No hidden fees! The price you see includes all taxes and service fees. Any additional charges (like cleaning fees) are clearly displayed before you confirm your booking.'
            },
        ]
    },
    {
        title: 'Cancellation Policy',
        icon: '🔄',
        items: [
            {
                question: 'What is your cancellation policy?',
                answer: 'Free cancellation is available up to 48 hours before check-in. Cancellations within 48 hours may incur a fee equivalent to one night\'s stay. No-shows are charged the full amount.'
            },
            {
                question: 'How long does it take to get a refund?',
                answer: 'Refunds are processed within 3-5 business days. Depending on your bank, it may take an additional 5-10 days for the funds to appear in your account.'
            },
            {
                question: 'What happens if I need to cancel due to an emergency?',
                answer: 'We understand that emergencies happen. Please contact our support team as soon as possible, and we\'ll work with you to find the best solution on a case-by-case basis.'
            },
        ]
    },
    {
        title: 'For Hosts',
        icon: '🏡',
        items: [
            {
                question: 'How do I list my property on Reva Chalets?',
                answer: 'Sign up as a host, complete your profile, and submit your property for review. Our team will verify your listing within 24-48 hours before it goes live.'
            },
            {
                question: 'What commission does Reva Chalets charge?',
                answer: 'We charge a competitive 10% commission on successful bookings. This covers payment processing, marketing, customer support, and our booking guarantee.'
            },
            {
                question: 'How and when do I receive payments?',
                answer: 'Payments are processed within 24 hours after your guest\'s check-in. You can receive funds via bank transfer or CliQ, typically within 2-3 business days.'
            },
        ]
    },
];

function FAQAccordion({ item, isOpen, toggle }: { item: FAQItem; isOpen: boolean; toggle: () => void }) {
    return (
        <div className={`faq-item ${isOpen ? 'open' : ''}`}>
            <button className="faq-question" onClick={toggle}>
                <span>{item.question}</span>
                <ChevronDown size={20} className="faq-icon" />
            </button>
            <div className="faq-answer">
                <p>{item.answer}</p>
            </div>

            <style jsx>{`
                .faq-item {
                    border-bottom: 1px solid hsl(var(--border));
                }
                
                .faq-question {
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.25rem 0;
                    background: none;
                    border: none;
                    text-align: left;
                    font-size: 1rem;
                    font-weight: 500;
                    color: hsl(var(--foreground));
                    cursor: pointer;
                    transition: color 0.2s;
                }
                
                .faq-question:hover {
                    color: hsl(var(--primary));
                }
                
                .faq-item.open .faq-question {
                    color: hsl(var(--primary));
                }
                
                :global(.faq-icon) {
                    transition: transform 0.3s ease;
                    flex-shrink: 0;
                }
                
                .faq-item.open :global(.faq-icon) {
                    transform: rotate(180deg);
                }
                
                .faq-answer {
                    max-height: 0;
                    overflow: hidden;
                    transition: max-height 0.3s ease, padding 0.3s ease;
                }
                
                .faq-item.open .faq-answer {
                    max-height: 200px;
                    padding-bottom: 1.25rem;
                }
                
                .faq-answer p {
                    color: hsl(var(--muted-foreground));
                    line-height: 1.7;
                }
            `}</style>
        </div>
    );
}

export default function FAQPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = use(params);
    const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

    const toggleItem = (sectionIndex: number, itemIndex: number) => {
        const key = `${sectionIndex}-${itemIndex}`;
        setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="faq-page">
            <div className="container">
                <header className="faq-header">
                    <h1>Frequently Asked Questions</h1>
                    <p>Find answers to common questions about booking, payments, and more.</p>
                </header>

                <div className="faq-content">
                    {faqData.map((section, sectionIndex) => (
                        <section key={section.title} className="faq-section">
                            <h2>
                                <span className="section-icon">{section.icon}</span>
                                {section.title}
                            </h2>
                            <div className="faq-list">
                                {section.items.map((item, itemIndex) => (
                                    <FAQAccordion
                                        key={item.question}
                                        item={item}
                                        isOpen={openItems[`${sectionIndex}-${itemIndex}`] || false}
                                        toggle={() => toggleItem(sectionIndex, itemIndex)}
                                    />
                                ))}
                            </div>
                        </section>
                    ))}
                </div>

                <div className="faq-contact">
                    <h3>Still have questions?</h3>
                    <p>Can't find what you're looking for? Our support team is here to help.</p>
                    <a href={`/${lang}/contact`} className="contact-btn">Contact Support</a>
                </div>
            </div>

            <style jsx>{`
                .faq-page {
                    padding: 4rem 0;
                    min-height: 100vh;
                }
                
                .container {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 0 1.5rem;
                }
                
                .faq-header {
                    text-align: center;
                    margin-bottom: 4rem;
                }
                
                .faq-header h1 {
                    font-family: var(--font-serif);
                    font-size: 2.5rem;
                    color: hsl(var(--primary));
                    margin-bottom: 0.75rem;
                }
                
                .faq-header p {
                    color: hsl(var(--muted-foreground));
                    font-size: 1.1rem;
                }
                
                .faq-section {
                    margin-bottom: 3rem;
                }
                
                .faq-section h2 {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    font-size: 1.25rem;
                    color: hsl(var(--foreground));
                    margin-bottom: 1rem;
                    padding-bottom: 0.75rem;
                    border-bottom: 2px solid hsl(var(--primary) / 0.2);
                }
                
                .section-icon {
                    font-size: 1.5rem;
                }
                
                .faq-list {
                    background: hsl(var(--card));
                    border-radius: 1rem;
                    padding: 0 1.5rem;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                }
                
                .faq-contact {
                    text-align: center;
                    padding: 3rem;
                    background: linear-gradient(135deg, hsl(var(--primary) / 0.1) 0%, hsl(var(--secondary)) 100%);
                    border-radius: 1.5rem;
                    margin-top: 2rem;
                }
                
                .faq-contact h3 {
                    font-family: var(--font-serif);
                    font-size: 1.5rem;
                    color: hsl(var(--foreground));
                    margin-bottom: 0.5rem;
                }
                
                .faq-contact p {
                    color: hsl(var(--muted-foreground));
                    margin-bottom: 1.5rem;
                }
                
                .contact-btn {
                    display: inline-block;
                    padding: 0.875rem 2rem;
                    background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.8) 100%);
                    color: hsl(var(--primary-foreground));
                    text-decoration: none;
                    border-radius: 2rem;
                    font-weight: 600;
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                
                .contact-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 20px hsl(var(--primary) / 0.3);
                }
                
                @media (max-width: 640px) {
                    .faq-header h1 {
                        font-size: 2rem;
                    }
                    
                    .faq-list {
                        padding: 0 1rem;
                    }
                }
            `}</style>
        </div>
    );
}
