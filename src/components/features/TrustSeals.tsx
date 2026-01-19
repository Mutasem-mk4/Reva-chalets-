'use client';

import { Lock, Sparkles, Calendar, ShieldCheck, Visa, Mastercard, Wallet } from '@/components/ui/Icons';


export default function TrustSeals() {
    const seals = [
        { icon: <Lock size={20} />, label: 'Secure Payment', sublabel: '256-bit SSL' },
        { icon: <Sparkles size={20} />, label: 'Best Price', sublabel: 'Guaranteed' },
        { icon: <Calendar size={20} />, label: 'Free Cancellation', sublabel: '48hrs notice' },
        { icon: <ShieldCheck size={20} />, label: 'Money Back', sublabel: '24hr refund' }
    ];

    return (
        <div className="trust-seals">
            <p className="trust-header flex items-center justify-center gap-2">
                <ShieldCheck size={16} /> Book with Confidence
            </p>
            <div className="seals-grid">
                {seals.map((seal, idx) => (
                    <div key={idx} className="seal">
                        <span className="seal-icon">{seal.icon}</span>
                        <div className="seal-text">
                            <span className="seal-label">{seal.label}</span>
                            <span className="seal-sublabel">{seal.sublabel}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="payment-methods">
                <span className="accepted">Accepted Payments:</span>
                <div className="methods">
                    <span className="method flex items-center gap-1"><Visa size={16} /> Visa</span>
                    <span className="method flex items-center gap-1"><Mastercard size={16} /> Mastercard</span>
                    <span className="method flex items-center gap-1"><Wallet size={16} /> Apple Pay</span>
                </div>
            </div>

            <style jsx>{`
                .trust-seals {
                    margin-top: 1.5rem;
                    padding: 1.25rem;
                    background: linear-gradient(135deg, rgba(34, 197, 94, 0.05), rgba(34, 197, 94, 0.02));
                    border: 1px solid rgba(34, 197, 94, 0.2);
                    border-radius: 1rem;
                }

                .trust-header {
                    text-align: center;
                    font-weight: 600;
                    color: #16a34a;
                    margin-bottom: 1rem;
                    font-size: 0.9rem;
                }

                .seals-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 0.75rem;
                }

                .seal {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem;
                    background: white;
                    border-radius: 0.5rem;
                    border: 1px solid rgba(0,0,0,0.05);
                }

                .seal-icon {
                    font-size: 1.25rem;
                }

                .seal-text {
                    display: flex;
                    flex-direction: column;
                }

                .seal-label {
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: hsl(var(--foreground));
                    line-height: 1.2;
                }

                .seal-sublabel {
                    font-size: 0.65rem;
                    color: hsl(var(--muted-foreground));
                }

                .payment-methods {
                    margin-top: 1rem;
                    padding-top: 1rem;
                    border-top: 1px dashed rgba(0,0,0,0.1);
                    text-align: center;
                }

                .accepted {
                    font-size: 0.7rem;
                    color: hsl(var(--muted-foreground));
                    display: block;
                    margin-bottom: 0.5rem;
                }

                .methods {
                    display: flex;
                    justify-content: center;
                    gap: 0.75rem;
                    flex-wrap: wrap;
                }

                .method {
                    font-size: 0.75rem;
                    color: hsl(var(--foreground));
                    background: white;
                    padding: 0.25rem 0.5rem;
                    border-radius: 0.25rem;
                    border: 1px solid rgba(0,0,0,0.05);
                }

                @media (max-width: 400px) {
                    .seals-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
}
