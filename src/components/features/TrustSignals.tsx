'use client';

import { useState, useEffect } from 'react';
import { Eye, Clock, Shield, Star } from '@/components/ui/Icons';

// Animated viewing count
export function LiveViewingIndicator({ chaletId }: { chaletId: string }) {
    const [viewers, setViewers] = useState(0);

    useEffect(() => {
        // Simulate real-time viewers (in production, use WebSocket)
        const baseViewers = (parseInt(chaletId) % 5) + 1;
        setViewers(baseViewers);

        const interval = setInterval(() => {
            setViewers(v => {
                const change = Math.random() > 0.5 ? 1 : -1;
                return Math.max(1, Math.min(v + change, 8));
            });
        }, 5000);

        return () => clearInterval(interval);
    }, [chaletId]);

    if (viewers <= 1) return null;

    return (
        <div className="live-indicator">
            <span className="pulse"></span>
            <Eye size={14} />
            <span>{viewers} people viewing</span>

            <style jsx>{`
                .live-indicator {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 0.75rem;
                    background: rgba(239, 68, 68, 0.1);
                    border: 1px solid rgba(239, 68, 68, 0.2);
                    border-radius: 2rem;
                    font-size: 0.75rem;
                    font-weight: 500;
                    color: #ef4444;
                }
                
                .pulse {
                    width: 8px;
                    height: 8px;
                    background: #ef4444;
                    border-radius: 50%;
                    animation: pulse 2s infinite;
                }
                
                @keyframes pulse {
                    0%, 100% { 
                        opacity: 1;
                        transform: scale(1);
                    }
                    50% { 
                        opacity: 0.5;
                        transform: scale(1.2);
                    }
                }
            `}</style>
        </div>
    );
}

// Trust badges
export function TrustBadges() {
    return (
        <div className="trust-badges">
            <div className="badge">
                <Shield size={16} />
                <span>Secure Booking</span>
            </div>
            <div className="badge">
                <Clock size={16} />
                <span>Free Cancellation</span>
            </div>
            <div className="badge">
                <Star size={16} />
                <span>Verified Property</span>
            </div>

            <style jsx>{`
                .trust-badges {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.75rem;
                    margin: 1.5rem 0;
                }
                
                .badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.35rem;
                    padding: 0.5rem 0.75rem;
                    background: hsl(var(--secondary));
                    border-radius: 2rem;
                    font-size: 0.75rem;
                    font-weight: 500;
                    color: hsl(var(--foreground));
                }
                
                .badge :global(svg) {
                    color: hsl(var(--primary));
                }
            `}</style>
        </div>
    );
}

// Money-back guarantee
export function GuaranteeBadge() {
    return (
        <div className="guarantee-badge">
            <Shield size={20} />
            <div className="content">
                <strong>Money-Back Guarantee</strong>
                <span>Full refund if cancelled within 48 hours</span>
            </div>

            <style jsx>{`
                .guarantee-badge {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 1rem 1.25rem;
                    background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%);
                    border: 1px solid rgba(34, 197, 94, 0.2);
                    border-radius: 0.75rem;
                    margin: 1rem 0;
                }
                
                .guarantee-badge :global(svg) {
                    color: #22c55e;
                    flex-shrink: 0;
                }
                
                .content {
                    display: flex;
                    flex-direction: column;
                    gap: 0.15rem;
                }
                
                .content strong {
                    font-size: 0.875rem;
                    color: hsl(var(--foreground));
                }
                
                .content span {
                    font-size: 0.75rem;
                    color: hsl(var(--muted-foreground));
                }
            `}</style>
        </div>
    );
}

// Recently booked indicator
export function RecentlyBookedBadge() {
    const [bookings, setBookings] = useState(0);

    useEffect(() => {
        setBookings(Math.floor(Math.random() * 8) + 3);
    }, []);

    return (
        <div className="recently-booked">
            <Clock size={14} />
            <span>Booked {bookings} times in the last 24 hours</span>

            <style jsx>{`
                .recently-booked {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 0.75rem;
                    background: linear-gradient(135deg, rgba(245, 166, 35, 0.1) 0%, rgba(245, 166, 35, 0.05) 100%);
                    border: 1px solid rgba(245, 166, 35, 0.2);
                    border-radius: 2rem;
                    font-size: 0.75rem;
                    font-weight: 500;
                    color: #d4920a;
                }
            `}</style>
        </div>
    );
}
