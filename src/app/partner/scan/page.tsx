'use client';

import { useState, useEffect } from 'react';
// import { QrReader } from 'react-qr-reader'; // Will import dynamically or use if installed
import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues with camera
const QrReader = dynamic(() => import('react-qr-reader').then((mod) => mod.QrReader), {
    ssr: false,
    loading: () => <div className="camera-placeholder">Loading Camera...</div>
});


export default function ScannerPage() {
    const [data, setData] = useState<string | null>(null);
    const [status, setStatus] = useState<'idle' | 'valid' | 'invalid' | 'redeemed'>('idle');
    const [scannedInfo, setScannedInfo] = useState<any>(null);

    const handleScan = (result: any, error: any) => {
        if (!!result) {
            const code = result?.text;
            if (code && code !== data) {
                setData(code);
                validateCode(code);
            }
        }
    };

    const validateCode = (code: string) => {
        // Logic: REVA-[PARTNER_VAL]-[RANDOM]

        // 1. Signature Check
        if (!code.startsWith('REVA-')) {
            setStatus('invalid');
            return;
        }

        // 2. Parse Code
        const parts = code.split('-');
        // Expected parts: ["REVA", "PARTNER_VAL", "RANDOM"]

        if (parts.length < 3) {
            setStatus('invalid');
            return;
        }

        // 3. Mock Partner Validation
        const partnerVal = parts[1];
        // In a real app, we'd fetch the partner details from DB.
        // For now, we accept any valid signature as a "Valid Coupon".

        // 4. Persistence Check (Simulated)
        // Since we are mocking, we can't check the User's device state.
        // But we can check if *this scanner* has scanned it before (Mock).
        const alreadyScanned = localStorage.getItem(`merchant_scanned_${code}`);
        if (alreadyScanned) {
            setStatus('redeemed');
            return;
        }

        // Success
        setStatus('valid');
        setScannedInfo({
            code: code,
            partner: partnerVal,
            timestamp: new Date().toLocaleString()
        });

        // Mark as scanned locally
        localStorage.setItem(`merchant_scanned_${code}`, 'true');
    };

    const resetScan = () => {
        setData(null);
        setStatus('idle');
        setScannedInfo(null);
    };

    return (
        <div className="scanner-container">
            <div className="scanner-instruction">
                <h1>Verify Coupon</h1>
                <p>Align the guest's QR code within the frame.</p>
            </div>

            <div className="camera-view">
                {status === 'idle' && (
                    <div className="qr-wrapper">
                        {/* @ts-ignore */}
                        <QrReader
                            constraints={{ facingMode: 'environment' }}
                            onResult={handleScan}
                            className="qr-reader"
                            scanDelay={500}
                        />
                        <div className="scan-overlay"></div>
                    </div>
                )}

                {status !== 'idle' && (
                    <div className={`result-card ${status}`}>
                        {status === 'valid' && (
                            <>
                                <div className="icon">✅</div>
                                <h2>Valid Coupon!</h2>
                                <div className="details">
                                    <p><strong>Code:</strong> {scannedInfo?.code}</p>
                                    <p><strong>Discount:</strong> {scannedInfo?.partner}</p>
                                    <p><strong>Verified:</strong> {scannedInfo?.timestamp}</p>
                                </div>
                                <button onClick={resetScan} className="btn-next">Scan Next</button>
                            </>
                        )}

                        {status === 'invalid' && (
                            <>
                                <div className="icon">❌</div>
                                <h2>Invalid QR</h2>
                                <p>This code is not recognized by Reva.</p>
                                <button onClick={resetScan} className="btn-retry">Try Again</button>
                            </>
                        )}

                        {status === 'redeemed' && (
                            <>
                                <div className="icon">⚠️</div>
                                <h2>Already Used</h2>
                                <p>This coupon has already been redeemed.</p>
                                <button onClick={resetScan} className="btn-retry">Scan Next</button>
                            </>
                        )}
                    </div>
                )}
            </div>

            <style jsx>{`
                .scanner-container {
                    padding: 2rem;
                    text-align: center;
                    max-width: 600px;
                    margin: 0 auto;
                }
                
                .scanner-instruction h1 {
                    color: white;
                    margin-bottom: 0.5rem;
                }
                
                .scanner-instruction p {
                    color: #94a3b8;
                    margin-bottom: 2rem;
                }

                .camera-view {
                    position: relative;
                    background: black;
                    border-radius: 20px;
                    overflow: hidden;
                    min-height: 400px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid #334155;
                }

                .qr-wrapper {
                    width: 100%;
                    height: 100%;
                }

                .scan-overlay {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 250px;
                    height: 250px;
                    border: 2px solid #fbbf24;
                    border-radius: 20px;
                    box-shadow: 0 0 0 4000px rgba(0,0,0,0.5);
                }

                .result-card {
                    padding: 2rem;
                    background: white;
                    color: black;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    animation: slideUp 0.3s ease;
                }
                
                .result-card.valid .icon { font-size: 4rem; margin-bottom: 1rem; }
                .result-card.invalid .icon { font-size: 4rem; margin-bottom: 1rem; }
                .result-card.redeemed .icon { font-size: 4rem; margin-bottom: 1rem; }

                .details {
                    background: #f1f5f9;
                    padding: 1rem;
                    border-radius: 12px;
                    margin: 1.5rem 0;
                    text-align: left;
                    width: 100%;
                }

                .btn-next {
                    background: #10b981;
                    color: white;
                    padding: 1rem 2rem;
                    border-radius: 12px;
                    border: none;
                    font-weight: 700;
                    width: 100%;
                    font-size: 1.1rem;
                    cursor: pointer;
                }
                
                .btn-retry {
                    background: #ef4444;
                    color: white;
                    padding: 1rem 2rem;
                    border-radius: 12px;
                    border: none;
                    font-weight: 700;
                    width: 100%;
                    font-size: 1.1rem;
                    cursor: pointer;
                }

                @keyframes slideUp {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
