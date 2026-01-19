'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Gift, CheckCircle, X } from '@/components/ui/Icons';

export default function ExitIntentPopup() {
    const [isVisible, setIsVisible] = useState(false);
    const [hasShown, setHasShown] = useState(false);
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const showPopup = useCallback(() => {
        if (hasShown) return;

        // Check if already dismissed in this session
        const dismissed = sessionStorage.getItem('exitPopupDismissed');
        if (dismissed) return;

        setIsVisible(true);
        setHasShown(true);
    }, [hasShown]);

    useEffect(() => {
        // Detect mouse leaving viewport (exit intent)
        const handleMouseLeave = (e: MouseEvent) => {
            // Only trigger when mouse leaves from top of page
            if (e.clientY < 10) {
                showPopup();
            }
        };

        // Add delay before activating exit intent (5 seconds)
        const timeout = setTimeout(() => {
            document.addEventListener('mouseleave', handleMouseLeave);
        }, 5000);

        return () => {
            clearTimeout(timeout);
            document.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [showPopup]);

    const handleClose = () => {
        setIsVisible(false);
        sessionStorage.setItem('exitPopupDismissed', 'true');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            // In production, send to API
            setIsSubmitted(true);
            setTimeout(() => {
                setIsVisible(false);
                sessionStorage.setItem('exitPopupDismissed', 'true');
            }, 2000);
        }
    };

    if (!isVisible) return null;

    return (
        <>
            <div className="overlay" onClick={handleClose} />
            <div className="popup">
                <button className="close-btn" onClick={handleClose}>
                    <X size={20} />
                </button>

                {!isSubmitted ? (
                    <>
                        <div className="popup-icon">
                            <Gift size={48} color="hsl(var(--primary))" />
                        </div>
                        <h2>Wait! Don't Miss Out!</h2>
                        <p className="offer">Get <span className="discount">10% OFF</span> your first booking</p>
                        <p className="subtitle">Enter your email and we'll send you an exclusive discount code.</p>

                        <form onSubmit={handleSubmit} className="form">
                            <input
                                type="email"
                                placeholder="Enter your email..."
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <button type="submit" className="submit-btn">
                                Get My 10% Off
                            </button>
                        </form>

                        <p className="no-thanks" onClick={handleClose}>
                            No thanks, I'll pay full price
                        </p>
                    </>
                ) : (
                    <div className="success">
                        <div className="success-icon">
                            <CheckCircle size={48} color="#22c55e" />
                        </div>
                        <h2>Check your inbox!</h2>
                        <p>Your discount code is on its way.</p>
                    </div>
                )}
            </div>

            <style jsx>{`
                .overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.7);
                    z-index: 1000;
                    animation: fadeIn 0.3s ease;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .popup {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: white;
                    border-radius: 1.5rem;
                    padding: 3rem 2.5rem;
                    max-width: 420px;
                    width: 90%;
                    z-index: 1001;
                    text-align: center;
                    animation: slideUp 0.4s ease;
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translate(-50%, -40%);
                    }
                    to {
                        opacity: 1;
                        transform: translate(-50%, -50%);
                    }
                }

                .close-btn {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    border: none;
                    background: #f1f5f9;
                    color: #64748b;
                    font-size: 1.25rem;
                    cursor: pointer;
                    transition: background 0.2s;
                }

                .close-btn:hover {
                    background: #e2e8f0;
                }

                .popup-icon {
                    font-size: 3rem;
                    margin-bottom: 1rem;
                }

                h2 {
                    font-family: var(--font-serif);
                    font-size: 1.75rem;
                    color: #1e293b;
                    margin-bottom: 0.75rem;
                }

                .offer {
                    font-size: 1.1rem;
                    color: #475569;
                    margin-bottom: 0.5rem;
                }

                .discount {
                    background: linear-gradient(135deg, #f5a623, #d4920a);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    font-weight: 700;
                    font-size: 1.5rem;
                }

                .subtitle {
                    color: #94a3b8;
                    font-size: 0.9rem;
                    margin-bottom: 1.5rem;
                }

                .form {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .form input {
                    padding: 1rem;
                    border: 2px solid #e2e8f0;
                    border-radius: 0.75rem;
                    font-size: 1rem;
                    outline: none;
                    transition: border-color 0.2s;
                }

                .form input:focus {
                    border-color: #f5a623;
                }

                .submit-btn {
                    padding: 1rem;
                    background: linear-gradient(135deg, #f5a623, #d4920a);
                    color: white;
                    border: none;
                    border-radius: 0.75rem;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: transform 0.2s, box-shadow 0.2s;
                }

                .submit-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 15px rgba(245, 166, 35, 0.4);
                }

                .no-thanks {
                    margin-top: 1rem;
                    color: #94a3b8;
                    font-size: 0.85rem;
                    cursor: pointer;
                    text-decoration: underline;
                    transition: color 0.2s;
                }

                .no-thanks:hover {
                    color: #64748b;
                }

                .success {
                    padding: 1rem 0;
                }

                .success-icon {
                    font-size: 3rem;
                    margin-bottom: 1rem;
                }

                .success h2 {
                    color: #22c55e;
                }

                .success p {
                    color: #64748b;
                }

                @media (max-width: 480px) {
                    .popup {
                        padding: 2rem 1.5rem;
                    }

                    h2 {
                        font-size: 1.5rem;
                    }

                    .discount {
                        font-size: 1.25rem;
                    }
                }
            `}</style>
        </>
    );
}
