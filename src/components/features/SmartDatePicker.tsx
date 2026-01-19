'use client';

import { useState, useEffect } from 'react';
import { XCircle, Sparkles, Lightning, CheckCircle, StarFilled, Lightbulb } from '@/components/ui/Icons';

interface SmartDatePickerProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    minDate?: string;
    compareDate?: string; // For check-out to compare with check-in
    type: 'checkIn' | 'checkOut';
}

export default function SmartDatePicker({
    label,
    value,
    onChange,
    minDate,
    compareDate,
    type
}: SmartDatePickerProps) {
    const [feedback, setFeedback] = useState<{ message: React.ReactNode; type: 'success' | 'hint' | 'error' } | null>(null);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        if (!value) {
            setFeedback(null);
            return;
        }

        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dayOfWeek = selectedDate.getDay();
        const isWeekend = dayOfWeek === 5 || dayOfWeek === 6; // Friday or Saturday

        if (type === 'checkIn') {
            // Check-in date validation
            if (selectedDate < today) {
                setFeedback({
                    message: <><XCircle size={14} /> Please select a future date</>,
                    type: 'error'
                });
            } else if (isWeekend) {
                setFeedback({
                    message: <><Sparkles size={14} /> Weekend getaway! Great choice for a relaxing stay</>,
                    type: 'success'
                });
            } else {
                // Check how far in advance
                const daysAhead = Math.ceil((selectedDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                if (daysAhead <= 3) {
                    setFeedback({
                        message: <><Lightning size={14} /> Last-minute booking! Limited availability</>,
                        type: 'hint'
                    });
                } else if (daysAhead >= 14) {
                    setFeedback({
                        message: <><CheckCircle size={14} /> Early booking! You get the best selection</>,
                        type: 'success'
                    });
                } else {
                    setFeedback({
                        message: <><CheckCircle size={14} /> Good date! Availability looks great</>,
                        type: 'success'
                    });
                }
            }
        } else if (type === 'checkOut') {
            // Check-out date validation
            if (compareDate) {
                const checkInDate = new Date(compareDate);
                const nights = Math.ceil((selectedDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

                if (selectedDate <= checkInDate) {
                    setFeedback({
                        message: <><XCircle size={14} /> Check-out must be after check-in</>,
                        type: 'error'
                    });
                } else if (nights >= 7) {
                    setFeedback({
                        message: <><StarFilled size={14} /> Weekly stay! Enjoy extended discounts</>,
                        type: 'success'
                    });
                } else if (nights >= 3) {
                    setFeedback({
                        message: <><CheckCircle size={14} /> Perfect weekend escape!</>,
                        type: 'success'
                    });
                } else if (nights === 1) {
                    setFeedback({
                        message: <><Lightbulb size={14} /> Just one night? Consider staying longer!</>,
                        type: 'hint'
                    });
                } else {
                    setFeedback({
                        message: <><CheckCircle size={14} /> {nights} nights selected</>,
                        type: 'success'
                    });
                }
            }
        }
    }, [value, compareDate, type]);

    // Get today's date for min
    const getMinDate = () => {
        if (minDate) return minDate;
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    return (
        <div className={`smart-date-picker ${isFocused ? 'focused' : ''}`}>
            <label>{label}</label>
            <div className="input-wrapper">
                <input
                    type="date"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    min={getMinDate()}
                />
            </div>
            {feedback && (
                <div className={`feedback ${feedback.type}`}>
                    {feedback.message}
                </div>
            )}

            <style jsx>{`
                .smart-date-picker {
                    margin-bottom: 1rem;
                }

                label {
                    display: block;
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: hsl(var(--foreground));
                    margin-bottom: 0.5rem;
                }

                .input-wrapper {
                    position: relative;
                }

                input {
                    width: 100%;
                    padding: 0.875rem 1rem;
                    border: 2px solid hsl(var(--border));
                    border-radius: 0.75rem;
                    font-size: 1rem;
                    outline: none;
                    transition: all 0.2s ease;
                    background: white;
                }

                input:focus {
                    border-color: #f5a623;
                    box-shadow: 0 0 0 3px rgba(245, 166, 35, 0.1);
                }

                .feedback {
                    font-size: 0.8rem;
                    margin-top: 0.5rem;
                    padding: 0.5rem 0.75rem;
                    border-radius: 0.5rem;
                    animation: fadeIn 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-5px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .feedback.success {
                    background: rgba(34, 197, 94, 0.1);
                    color: #16a34a;
                    border: 1px solid rgba(34, 197, 94, 0.2);
                }

                .feedback.hint {
                    background: rgba(245, 166, 35, 0.1);
                    color: #b45309;
                    border: 1px solid rgba(245, 166, 35, 0.2);
                }

                .feedback.error {
                    background: rgba(239, 68, 68, 0.1);
                    color: #dc2626;
                    border: 1px solid rgba(239, 68, 68, 0.2);
                }
            `}</style>
        </div>
    );
}
