'use client';

import { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { Partner } from '@/lib/data';
import styles from '@/styles/referral.module.css';
import { CheckCircle, X } from '@/components/ui/Icons';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface RewardCardProps {
    partner: Partner;
    dict: any; // Keep consistent with props if used, though unused here
}

export default function RewardCard({ partner }: RewardCardProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState<'info' | 'generating' | 'active' | 'redeemed'>('info');
    const [qrCode, setQrCode] = useState<string>('');

    // Check for existing redemption OR active session on load
    useEffect(() => {
        const redeemed = localStorage.getItem(`redeemed_${partner.id}`);
        if (redeemed) {
            setStep('redeemed');
            return;
        }

        const activeToken = localStorage.getItem(`active_token_${partner.id}`);
        if (activeToken) {
            setQrCode(activeToken);
            setStep('active');
        }
    }, [partner.id]);

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => {
        setIsOpen(false);
    };

    const generateCode = () => {
        // Double check not already redeemed
        if (localStorage.getItem(`redeemed_${partner.id}`)) {
            setStep('redeemed');
            return;
        }

        setStep('generating');
        setTimeout(() => {
            const uniqueToken = `REVA-${partner.qrValue}-${Math.floor(Math.random() * 10000)}`;
            localStorage.setItem(`active_token_${partner.id}`, uniqueToken); // Save active token
            setQrCode(uniqueToken);
            setStep('active');
        }, 1500);
    };

    const simulateScan = () => {
        // Persist redemption
        localStorage.setItem(`redeemed_${partner.id}`, 'true');
        localStorage.removeItem(`active_token_${partner.id}`); // Clear active token
        setStep('redeemed');
    };



    return (
        <>
            {/* Professional Card (No Flip) */}
            <div className={styles.proCard} onClick={handleOpen}>
                <div className={styles.proCardHeader}>
                    <span className={styles.proCategory}>{partner.category}</span>
                    <span className={styles.proLogo}>{partner.logo}</span>
                </div>
                <div className={styles.proCardBody}>
                    <h3 className={styles.proName}>{partner.name}</h3>
                    <div className={styles.proDiscount}>{partner.discount}</div>
                </div>
                <div className={styles.proCardFooter}>
                    <span className={styles.tapLabel}>Tap to View Offer</span>
                </div>
            </div>

            {isOpen && (
                <div className={styles.modalOverlay} onClick={handleClose}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.closeBtn} onClick={handleClose}>
                            <X size={24} />
                        </button>

                        <div className={styles.modalHeader}>
                            <div className={styles.modalLogo}>{partner.logo}</div>
                            <h2>{partner.name}</h2>
                            <span className={styles.modalDiscount}>{partner.discount}</span>
                        </div>

                        <div className={styles.modalContent}>
                            {step === 'info' && (
                                <div className={styles.stepInfo}>
                                    <p className={styles.modalDesc}>{partner.description}</p>
                                    <div className={styles.terms}>
                                        <small>• Valid for one-time use only</small>
                                        <small>• Must be presented at time of purchase</small>
                                        <small>• Expires 15 minutes after generation</small>
                                    </div>
                                    <button className={styles.generateBtn} onClick={generateCode}>
                                        Generate Secure Code
                                    </button>
                                </div>
                            )}

                            {step === 'generating' && (
                                <div className={styles.stepLoading}>
                                    <div className="mb-4">
                                        <LoadingSpinner size={48} color="hsl(var(--primary))" />
                                    </div>
                                    <p>Generating unique secure token...</p>
                                </div>
                            )}

                            {step === 'active' && (
                                <div className={styles.stepActive}>
                                    <div className={styles.qrContainer}>
                                        <QRCode
                                            value={qrCode}
                                            size={180}
                                            level="H"
                                            className={styles.qr}
                                        />
                                    </div>
                                    <p className={styles.securityNote}>Token: {qrCode}</p>
                                    <p className={styles.timer}>Expires in 14:59</p>

                                    <div className={styles.merchantActions}>
                                        <p>Merchant Use Only:</p>
                                        <button className={styles.scanBtn} onClick={simulateScan}>
                                            Simulate Scan (Merchant)
                                        </button>
                                    </div>
                                </div>
                            )}

                            {step === 'redeemed' && (
                                <div className={styles.stepRedeemed}>
                                    <div className={styles.successIcon}>
                                        <CheckCircle size={48} />
                                    </div>
                                    <h3>Redeemed Successfully</h3>
                                    <p>Thank you for using Reva Rewards!</p>
                                    <p className={styles.timestamp}>{new Date().toLocaleTimeString()}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
