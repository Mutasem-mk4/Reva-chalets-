'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface PrefetchLinkProps {
    href: string;
    children: React.ReactNode;
    className?: string;
    prefetchDelay?: number;
}

// Link that prefetches on hover for instant navigation
export function PrefetchLink({
    href,
    children,
    className = '',
    prefetchDelay = 100
}: PrefetchLinkProps) {
    const router = useRouter();
    const timeoutRef = useRef<any>(null);

    const handleMouseEnter = useCallback(() => {
        timeoutRef.current = setTimeout(() => {
            router.prefetch(href);
        }, prefetchDelay);
    }, [href, prefetchDelay, router]);

    const handleMouseLeave = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }, []);

    return (
        <Link
            href={href}
            className={className}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}
        </Link>
    );
}

// Magnetic button effect
export function MagneticButton({
    children,
    className = '',
    onClick,
    strength = 0.2,
    ...props
}: {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    strength?: number;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        if (!buttonRef.current) return;

        const rect = buttonRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        buttonRef.current.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    }, [strength]);

    const handleMouseLeave = useCallback(() => {
        if (!buttonRef.current) return;
        buttonRef.current.style.transform = 'translate(0, 0)';
    }, []);

    return (
        <button
            ref={buttonRef}
            className={`magnetic-button ${className}`}
            onClick={onClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ transition: 'transform 0.2s ease-out' }}
            {...props}
        >
            {children}
        </button>
    );
}

// Ripple effect on click
export function RippleButton({
    children,
    className = '',
    onClick,
    ...props
}: {
    children: React.ReactNode;
    className?: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
    const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

    const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const newRipple = { id: Date.now(), x, y };
        setRipples(prev => [...prev, newRipple]);

        setTimeout(() => {
            setRipples(prev => prev.filter(r => r.id !== newRipple.id));
        }, 600);

        onClick?.(e);
    }, [onClick]);

    return (
        <button
            className={`ripple-button ${className}`}
            onClick={handleClick}
            {...props}
        >
            {children}
            {ripples.map(ripple => (
                <span
                    key={ripple.id}
                    className="ripple"
                    style={{ left: ripple.x, top: ripple.y }}
                />
            ))}

            <style jsx>{`
                .ripple-button {
                    position: relative;
                    overflow: hidden;
                }
                
                .ripple {
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.3);
                    transform: translate(-50%, -50%);
                    pointer-events: none;
                    animation: ripple-effect 0.6s ease-out forwards;
                }
                
                @keyframes ripple-effect {
                    0% {
                        width: 0;
                        height: 0;
                        opacity: 0.5;
                    }
                    100% {
                        width: 200px;
                        height: 200px;
                        opacity: 0;
                    }
                }
            `}</style>
        </button>
    );
}

// Glow on hover
export function GlowCard({
    children,
    className = ''
}: {
    children: React.ReactNode;
    className?: string;
}) {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        cardRef.current.style.setProperty('--mouse-x', `${x}px`);
        cardRef.current.style.setProperty('--mouse-y', `${y}px`);
    }, []);

    return (
        <div
            ref={cardRef}
            className={`glow-card ${className}`}
            onMouseMove={handleMouseMove}
        >
            {children}

            <style jsx>{`
                .glow-card {
                    position: relative;
                    background: hsl(var(--card));
                    border-radius: 1rem;
                    overflow: hidden;
                }
                
                .glow-card::before {
                    content: '';
                    position: absolute;
                    top: var(--mouse-y, 50%);
                    left: var(--mouse-x, 50%);
                    transform: translate(-50%, -50%);
                    width: 200px;
                    height: 200px;
                    background: radial-gradient(
                        circle,
                        hsl(var(--primary) / 0.2) 0%,
                        transparent 70%
                    );
                    opacity: 0;
                    transition: opacity 0.3s;
                    pointer-events: none;
                }
                
                .glow-card:hover::before {
                    opacity: 1;
                }
            `}</style>
        </div>
    );
}
