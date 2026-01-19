import { useState, useEffect } from 'react';
import { Calendar, Lock, CheckCircle, Check } from '@/components/ui/Icons';

interface BookingProgressProps {
    currentStep: 1 | 2 | 3;
    steps?: { label: string; description: string }[];
}

const DEFAULT_STEPS = [
    { label: 'Dates', description: 'Select your stay' },
    { label: 'Payment', description: 'Secure checkout' },
    { label: 'Confirmed', description: 'Booking complete' }
];

export default function BookingProgress({ currentStep, steps = DEFAULT_STEPS }: BookingProgressProps) {
    const progressPercent = ((currentStep - 1) / (steps.length - 1)) * 100;

    const renderMessage = () => {
        switch (currentStep) {
            case 1: return <><Calendar size={16} /> Choose your perfect dates</>;
            case 2: return <><Lock size={16} /> Almost there! Complete payment</>;
            case 3: return <><CheckCircle size={16} /> Booking confirmed!</>;
            default: return '';
        }
    };

    return (
        <div className="booking-progress">
            <div className="progress-header">
                <span className="step-indicator">Step {currentStep} of {steps.length}</span>
                <span className="message">{renderMessage()}</span>
            </div>

            <div className="progress-bar">
                <div
                    className="progress-fill"
                    style={{ width: `${progressPercent}%` }}
                />
                <div className="steps">
                    {steps.map((step, idx) => (
                        <div
                            key={idx}
                            className={`step ${idx + 1 <= currentStep ? 'active' : ''} ${idx + 1 < currentStep ? 'completed' : ''}`}
                        >
                            <div className="step-dot">
                                {idx + 1 < currentStep ? <Check size={14} /> : idx + 1}
                            </div>
                            <div className="step-info">
                                <span className="step-label">{step.label}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .booking-progress {
                    margin-bottom: 1.5rem;
                    padding-bottom: 1.5rem;
                    border-bottom: 1px solid hsl(var(--border));
                }

                .progress-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                }

                .step-indicator {
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: hsl(var(--muted-foreground));
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .message {
                    font-size: 0.875rem;
                    color: hsl(var(--foreground));
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .progress-bar {
                    position: relative;
                    height: 4px;
                    background: hsl(var(--secondary));
                    border-radius: 2px;
                    margin-bottom: 1rem;
                }

                .progress-fill {
                    position: absolute;
                    left: 0;
                    top: 0;
                    height: 100%;
                    background: linear-gradient(90deg, #f5a623, #d4920a);
                    border-radius: 2px;
                    transition: width 0.5s ease;
                }

                .steps {
                    position: absolute;
                    top: 50%;
                    left: 0;
                    right: 0;
                    display: flex;
                    justify-content: space-between;
                    transform: translateY(-50%);
                }

                .step {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.5rem;
                }

                .step-dot {
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background: hsl(var(--background));
                    border: 2px solid hsl(var(--border));
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.7rem;
                    font-weight: 600;
                    color: hsl(var(--muted-foreground));
                    transition: all 0.3s ease;
                }

                .step.active .step-dot {
                    border-color: #f5a623;
                    background: #f5a623;
                    color: white;
                }

                .step.completed .step-dot {
                    background: #22c55e;
                    border-color: #22c55e;
                    color: white;
                }

                .step-info {
                    position: absolute;
                    top: 30px;
                    white-space: nowrap;
                }

                .step-label {
                    font-size: 0.7rem;
                    color: hsl(var(--muted-foreground));
                    font-weight: 500;
                }

                .step.active .step-label {
                    color: hsl(var(--foreground));
                }

                @media (max-width: 400px) {
                    .step-info {
                        display: none;
                    }

                    .progress-bar {
                        margin-bottom: 0.5rem;
                    }
                }
            `}</style>
        </div>
    );
}
