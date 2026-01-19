'use client';

import { useState, useEffect } from 'react';
import { ChevronUp } from '@/components/ui/Icons';

export default function BackToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            // Show button when scrolled down 400px
            if (window.scrollY > 400) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility, { passive: true });
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <>
            <button
                className={`back-to-top ${isVisible ? 'visible' : ''}`}
                onClick={scrollToTop}
                aria-label="Back to top"
            >
                <ChevronUp size={24} />
            </button>

            <style jsx>{`
                .back-to-top {
                    position: fixed;
                    bottom: 6rem;
                    left: 2rem;
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    background: hsl(var(--card));
                    border: 1px solid hsl(var(--border));
                    color: hsl(var(--foreground));
                    font-size: 1.25rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                    opacity: 0;
                    visibility: hidden;
                    transform: translateY(20px);
                    transition: all 0.3s ease;
                    z-index: 100;
                }

                .back-to-top.visible {
                    opacity: 1;
                    visibility: visible;
                    transform: translateY(0);
                }

                .back-to-top:hover {
                    background: linear-gradient(135deg, #f5a623, #d4920a);
                    color: white;
                    border-color: transparent;
                    transform: translateY(-3px);
                    box-shadow: 0 6px 20px rgba(245, 166, 35, 0.4);
                }

                @media (max-width: 768px) {
                    .back-to-top {
                        bottom: 5rem;
                        left: 1rem;
                        width: 44px;
                        height: 44px;
                    }
                }
            `}</style>
        </>
    );
}
