'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift } from '@/components/ui/Icons';
import styles from '@/styles/referral.module.css'; // Reuse existing styles or create new

export default function ExitIntentPopup() {
    const [isVisible, setIsVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        // Check if already subscribed or dismissed recently
        const isClosed = localStorage.getItem('exit_intent_closed');
        const isSubscribed = localStorage.getItem('reva_subscribed');

        if (isClosed || isSubscribed) return;

        // Desktop: Exit Intent
        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY <= 0) {
                setIsVisible(true);
            }
        };

        // Mobile: Timer
        const mobileTimer = setTimeout(() => {
            if (window.innerWidth < 768) {
                setIsVisible(true);
            }
        }, 15000); // 15 seconds

        document.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            document.removeEventListener('mouseleave', handleMouseLeave);
            clearTimeout(mobileTimer);
        };
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        // Don't show again for 7 days
        const expiry = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
        localStorage.setItem('exit_intent_closed', expiry.toString());
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMsg('');

        try {
            const res = await fetch('/api/marketing/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Something went wrong');

            setStatus('success');
            localStorage.setItem('reva_subscribed', 'true');

            // Auto close after success
            setTimeout(() => {
                setIsVisible(false);
            }, 3000);

        } catch (err: any) {
            setStatus('error');
            setErrorMsg(err.message);
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="popup-overlay" onClick={handleClose}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.3 }}
                        className="popup-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button className="close-btn" onClick={handleClose}>
                            <X size={20} />
                        </button>

                        <div className="icon-wrapper">
                            <Gift size={40} color="#c9a55c" />
                        </div>

                        <h2>Wait! Don't Miss Out!</h2>

                        {status === 'success' ? (
                            <div className="success-message">
                                <h3>🎉 Code Sent!</h3>
                                <p>Check your email ({email}) for your 10% discount code.</p>
                            </div>
                        ) : (
                            <>
                                <p className="subtitle">
                                    Get <span className="highlight">10% OFF</span> your first booking
                                </p>
                                <p className="description">
                                    Enter your email and we'll send you an exclusive discount code instantly.
                                </p>

                                <form onSubmit={handleSubmit} className="popup-form">
                                    <input
                                        type="email"
                                        placeholder="Enter your email..."
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={status === 'loading'}
                                    />
                                    <button type="submit" disabled={status === 'loading'}>
                                        {status === 'loading' ? 'Sending...' : 'Get My 10% Off'}
                                    </button>
                                    {status === 'error' && <p className="error">{errorMsg}</p>}
                                </form>

                                <button className="skip-btn" onClick={handleClose}>
                                    No thanks, I'll pay full price
                                </button>
                            </>
                        )}
                    </motion.div>

                    <style jsx>{`
                        .popup-overlay {
                            position: fixed;
                            top: 0;
                            left: 0;
                            right: 0;
                            bottom: 0;
                            background: rgba(0, 0, 0, 0.7);
                            backdrop-filter: blur(4px);
                            z-index: 9999;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            padding: 20px;
                        }

                        .popup-content {
                            background: hsl(var(--card));
                            border: 1px solid hsl(var(--border));
                            border-radius: 24px;
                            padding: 40px;
                            width: 100%;
                            max-width: 480px;
                            text-align: center;
                            position: relative;
                            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                        }

                        .close-btn {
                            position: absolute;
                            top: 16px;
                            right: 16px;
                            background: transparent;
                            border: none;
                            color: hsl(var(--muted-foreground));
                            cursor: pointer;
                            padding: 8px;
                            border-radius: 50%;
                            transition: all 0.2s;
                        }

                        .close-btn:hover {
                            background: hsl(var(--secondary));
                            color: hsl(var(--foreground));
                        }

                        .icon-wrapper {
                            width: 80px;
                            height: 80px;
                            border-radius: 50%;
                            background: rgba(201, 165, 92, 0.1);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin: 0 auto 24px;
                        }

                        h2 {
                            font-size: 2rem;
                            font-family: var(--font-serif);
                            color: hsl(var(--foreground));
                            margin-bottom: 8px;
                        }

                        .subtitle {
                            font-size: 1.25rem;
                            color: hsl(var(--muted-foreground));
                            margin-bottom: 16px;
                        }

                        .highlight {
                            color: #c9a55c;
                            font-weight: 700;
                        }

                        .description {
                            font-size: 0.95rem;
                            color: hsl(var(--muted-foreground));
                            margin-bottom: 32px;
                            line-height: 1.5;
                        }

                        .popup-form {
                            display: flex;
                            flex-direction: column;
                            gap: 16px;
                            margin-bottom: 24px;
                        }

                        input {
                            width: 100%;
                            padding: 16px;
                            border-radius: 12px;
                            border: 1px solid hsl(var(--border));
                            background: hsl(var(--background));
                            color: hsl(var(--foreground));
                            font-size: 1rem;
                            outline: none;
                            transition: border-color 0.2s;
                        }

                        input:focus {
                            border-color: #c9a55c;
                        }

                        button[type="submit"] {
                            padding: 16px;
                            border-radius: 12px;
                            border: none;
                            background: linear-gradient(135deg, #c9a55c 0%, #e8c87f 100%);
                            color: #0a1628;
                            font-weight: 600;
                            font-size: 1.1rem;
                            cursor: pointer;
                            transition: opacity 0.2s;
                        }

                        button[type="submit"]:disabled {
                            opacity: 0.7;
                            cursor: not-allowed;
                        }

                        .skip-btn {
                            background: transparent;
                            border: none;
                            color: hsl(var(--muted-foreground));
                            font-size: 0.9rem;
                            text-decoration: underline;
                            cursor: pointer;
                            padding: 8px;
                        }

                        .error {
                            color: #ef4444;
                            font-size: 0.875rem;
                        }

                        .success-message h3 {
                            color: #22c55e;
                            margin-bottom: 8px;
                            font-size: 1.5rem;
                        }

                        .success-message p {
                            color: hsl(var(--muted-foreground));
                        }
                    `}</style>
                </div>
            )}
        </AnimatePresence>
    );
}
