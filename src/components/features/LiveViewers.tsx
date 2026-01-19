'use client';

import { useState, useEffect } from 'react';
import { Eye } from '@/components/ui/Icons';

interface LiveViewersProps {
    chaletId: string;
}

export default function LiveViewers({ chaletId }: LiveViewersProps) {
    const [viewers, setViewers] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Generate a "realistic" random number based on chalet ID
        // In production, this would be a real-time WebSocket connection
        const baseViewers = (parseInt(chaletId) % 5) + 3; // 3-7 base viewers
        const randomOffset = Math.floor(Math.random() * 6); // 0-5 additional
        const initialViewers = baseViewers + randomOffset;

        setViewers(initialViewers);

        // Fade in after a small delay
        const showTimer = setTimeout(() => setIsVisible(true), 500);

        // Simulate viewers fluctuating
        const fluctuateInterval = setInterval(() => {
            setViewers(prev => {
                const change = Math.random() > 0.5 ? 1 : -1;
                const newCount = prev + change;
                // Keep between 2 and 20
                return Math.max(2, Math.min(20, newCount));
            });
        }, 8000); // Update every 8 seconds

        return () => {
            clearTimeout(showTimer);
            clearInterval(fluctuateInterval);
        };
    }, [chaletId]);

    return (
        <div className={`live-viewers ${isVisible ? 'visible' : ''}`}>
            <span className="pulse-dot"></span>
            <span className="icon"><Eye size={16} /></span>
            <span className="text">
                <strong>{viewers}</strong> people viewing this right now
            </span>

            <style jsx>{`
                .live-viewers {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05));
                    border: 1px solid rgba(239, 68, 68, 0.2);
                    padding: 0.5rem 1rem;
                    border-radius: 2rem;
                    font-size: 0.875rem;
                    color: hsl(var(--foreground));
                    opacity: 0;
                    transform: translateY(10px);
                    transition: all 0.5s ease;
                }

                .live-viewers.visible {
                    opacity: 1;
                    transform: translateY(0);
                }

                .pulse-dot {
                    width: 8px;
                    height: 8px;
                    background: #ef4444;
                    border-radius: 50%;
                    animation: pulse-dot 2s infinite;
                }

                @keyframes pulse-dot {
                    0%, 100% { 
                        opacity: 1;
                        box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
                    }
                    50% { 
                        opacity: 0.8;
                        box-shadow: 0 0 0 6px rgba(239, 68, 68, 0);
                    }
                }

                .icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #ef4444; 
                }

                .text {
                    color: hsl(var(--muted-foreground));
                }

                .text strong {
                    color: #ef4444;
                    font-weight: 700;
                }

                @media (max-width: 480px) {
                    .live-viewers {
                        font-size: 0.8rem;
                        padding: 0.4rem 0.75rem;
                    }
                }
            `}</style>
        </div>
    );
}
