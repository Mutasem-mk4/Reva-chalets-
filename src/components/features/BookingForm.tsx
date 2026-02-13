'use client';

import { useState } from 'react';
import { useToast } from '@/components/ui/Toast';
import { ChevronLeft, ChevronUp, ChevronDown, CheckCircle, Sparkles, Gift, Plus, Minus } from '@/components/ui/Icons';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
// import PaymentForm from './PaymentForm'; // Removed in favor of Stripe Checkout
import TrustSeals from './TrustSeals';
import SmartDatePicker from './SmartDatePicker';
import BookingProgress from './BookingProgress';
import { redirectToCheckout } from '@/lib/stripe-client';

export default function BookingForm({ dict, price, chaletId, locale = 'en' }: { dict: any, price: number, chaletId: string, locale?: string }) {
  const [step, setStep] = useState<'details' | 'payment'>('details');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [isGuestOpen, setIsGuestOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showGift, setShowGift] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate generic nights logic
  const getDays = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const days = getDays();
  const nightPrice = price;
  const subtotal = days > 0 ? days * nightPrice : 0;
  const cleaningFee = 40;
  const serviceFee = Math.round(subtotal * 0.10);
  const total = subtotal + cleaningFee + serviceFee;

  const { showToast } = useToast();

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (days === 0) {
      showToast(dict.booking?.selectDatesError || "Please select check-in and check-out dates.", "error");
      return;
    }
    setStep('payment');
  };

  const handleProceedToPayment = async () => {
    setIsSubmitting(true);
    try {
      // 1. Create Booking in DB first
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chaletId,
          startDate: checkIn,
          endDate: checkOut,
          guestName: 'Web User', // Should ideally come from auth context
          guestEmail: 'user@example.com', // Should come from auth
          guestPhone: '000000000',
          guestCount: guests,
          totalPrice: total,
          pricePerNight: nightPrice,
          nights: days,
          status: 'PENDING_PAYMENT' // Initial status
        })
      });

      if (response.ok) {
        const booking = await response.json();
        // 2. Redirect to Stripe
        await redirectToCheckout(booking.id);
      } else {
        const err = await response.json();
        showToast(err.error || 'Failed to initialize booking', 'error');
        setIsSubmitting(false);
      }
    } catch (e) {
      console.error("Booking initialization failed", e);
      showToast("Something went wrong. Please try again.", "error");
      setIsSubmitting(false);
    }
  };

  if (success) {
    if (showGift) {
      return (
        <div className="gift-reveal-container">
          <div className="confetti">
            <Sparkles size={48} color="#f5a623" />
          </div>
          <h2 className="gift-title">Payment Successful!</h2>
          <p className="gift-subtitle">As a thank you, you've unlocked a specialized reward.</p>

          <div className="mystery-box">
            <div className="box-lid"></div>
            <div className="box-body">
              <span className="gift-icon">
                <Gift size={64} color="white" />
              </span>
            </div>
          </div>

          <a href="/rewards" className="claim-btn">
            Claim Your Exclusive Gift
          </a>

          <style jsx>{`
                    .gift-reveal-container {
                        text-align: center;
                        padding: 3rem 2rem;
                        background: linear-gradient(135deg, hsl(var(--card)) 0%, hsl(var(--background)) 100%);
                        border-radius: var(--radius);
                        border: 1px solid hsl(var(--primary));
                        animation: fadeIn 0.5s ease-out;
                    }
                    
                    .gift-title {
                        font-family: var(--font-serif);
                        color: hsl(var(--primary));
                        font-size: 2rem;
                        margin-bottom: 0.5rem;
                    }

                    .gift-subtitle {
                        color: hsl(var(--muted-foreground));
                        margin-bottom: 2rem;
                    }

                    .mystery-box {
                        width: 100px;
                        height: 100px;
                        margin: 0 auto 2rem;
                        position: relative;
                        animation: bounce 2s infinite;
                    }

                    .gift-icon {
                        font-size: 4rem;
                    }

                    .claim-btn {
                        display: inline-block;
                        background: linear-gradient(to right, #d97706, #fbbf24);
                        color: white;
                        text-decoration: none;
                        padding: 1rem 2rem;
                        border-radius: 99px;
                        font-weight: 700;
                        box-shadow: 0 4px 15px rgba(251, 191, 36, 0.4);
                        transition: transform 0.2s;
                    }

                    .claim-btn:hover {
                        transform: scale(1.05);
                    }

                    @keyframes bounce {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-10px); }
                    }
                    
                    @keyframes fadeIn {
                        from { opacity: 0; transform: scale(0.9); }
                        to { opacity: 1; transform: scale(1); }
                    }
                `}</style>
        </div>
      );
    }

    return (
      <div className="success-message">
        <h3>
          <CheckCircle size={24} style={{ display: 'inline', marginRight: '0.5rem' }} />
          {dict.booking.success}
        </h3>
        <p>Processing your rewards...</p>
        <div className="flex justify-center mt-4">
          <LoadingSpinner size={40} color="hsl(var(--primary))" />
        </div>

        <style jsx>{`
            .success-message {
                text-align: center;
                padding: 3rem;
                background: hsl(var(--secondary));
                border-radius: var(--radius);
            }
            .loading-dots {
                font-size: 2rem;
                color: hsl(var(--primary));
                margin-top: 1rem;
                animation: pulse 1s infinite;
            }
            @keyframes pulse {
                0% { opacity: 0.5; }
                50% { opacity: 1; }
                100% { opacity: 0.5; }
            }
        `}</style>
      </div>
    );
  }

  if (step === 'payment') {
    return (
      <div>
        <BookingProgress currentStep={2} locale={locale} />
        <button onClick={() => setStep('details')} className="back-btn flex items-center gap-1">
          {locale === 'ar' ? <ChevronDown size={16} style={{ transform: 'rotate(90deg)' }} /> : <ChevronLeft size={16} />}
          {locale === 'ar' ? 'العودة للتفاصيل' : 'Back to details'}
        </button>
        <div className="summary-box">
          <h4>{dict.chalet.book} Summary</h4>
          <div className="summary-row">
            <span>{price} JOD x {days} {locale === 'ar' ? 'ليال' : 'nights'}</span>
            <span>{subtotal} JOD</span>
          </div>
          <div className="summary-row">
            <span>{dict?.fees?.cleaning || 'Cleaning Fee'}</span>
            <span>{cleaningFee} JOD</span>
          </div>
          <div className="summary-row">
            <span>{dict?.fees?.service || 'Service Fee'}</span>
            <span>{serviceFee} JOD</span>
          </div>
          <div className="total-row">
            <span>{dict?.booking?.total || 'Total'}</span>
            <span>{total} JOD</span>
          </div>
        </div>
        <div className="payment-action">
          <p className="payment-hint">
            {locale === 'ar'
              ? 'سيتم تحويلك إلى صفحة دفع آمنة عبر Stripe لإتمام الحجز.'
              : 'You will be redirected to a secure Stripe checkout page to complete your booking.'}
          </p>
          <button
            onClick={handleProceedToPayment}
            disabled={isSubmitting}
            className="stripe-btn"
          >
            {isSubmitting ? <LoadingSpinner size={24} color="white" /> : (
              <>
                <span style={{ marginRight: '0.5rem' }}>🔒</span>
                {locale === 'ar' ? `دفع ${total} دينار بأمان` : `Pay ${total} JOD Securely`}
              </>
            )}
          </button>

          <div className="payment-methods-icons">
            <span title="Visa">💳</span>
            <span title="Mastercard">💳</span>
            <span title="Apple Pay">🍎</span>
          </div>
        </div>
        <TrustSeals />

        <style jsx>{`
            .payment-action {
                text-align: center;
                margin-bottom: 2rem;
            }
            .payment-hint {
                color: #6b7280;
                font-size: 0.9rem;
                margin-bottom: 1rem;
            }
            .stripe-btn {
                background: #635bff;
                color: white;
                width: 100%;
                padding: 1rem;
                border-radius: 12px;
                font-weight: 600;
                font-size: 1.1rem;
                border: none;
                cursor: pointer;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 12px rgba(99, 91, 255, 0.3);
            }
            .stripe-btn:hover {
                background: #4f46e5;
                transform: translateY(-2px);
            }
            .stripe-btn:disabled {
                opacity: 0.7;
                cursor: not-allowed;
            }
            .payment-methods-icons {
                margin-top: 1rem;
                display: flex;
                gap: 1rem;
                justify-content: center;
                font-size: 1.5rem;
                opacity: 0.6;
            }
            .back-btn {
                        background: none;
                        border: none;
                        color: hsl(var(--foreground));
                        font-size: 0.875rem;
                        cursor: pointer;
                        margin-bottom: 1rem;
                        opacity: 0.8;
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                        padding: 0.5rem 0;
                    }
                    .back-btn:hover { opacity: 1; text-decoration: underline; }
                    
                    .summary-box {
                        background: hsl(var(--secondary) / 0.3);
                        padding: 1.5rem;
                        border-radius: 16px;
                        margin-bottom: 2rem;
                        border: 1px solid hsl(var(--border) / 0.5);
                    }
                    .summary-box h4 {
                        margin-bottom: 1rem;
                        font-family: var(--font-serif);
                        font-size: 1.1rem;
                    }
                    .summary-row {
                        display: flex;
                        justify-content: space-between;
                        font-size: 0.95rem;
                        margin-bottom: 0.75rem;
                        color: hsl(var(--muted-foreground));
                    }
                    .total-row {
                        display: flex;
                        justify-content: space-between;
                        font-weight: 800;
                        font-size: 1.25rem;
                        border-top: 1px dashed hsl(var(--border));
                        padding-top: 1rem;
                        margin-top: 1rem;
                        color: hsl(var(--foreground));
                    }
                `}</style>
      </div>
    );
  }

  return (
    <form onSubmit={handleDetailsSubmit} className="booking-form">
      <BookingProgress currentStep={1} locale={locale} />
      <div className="travel-inputs">
        <div className="smart-dates">
          <SmartDatePicker
            label={dict?.booking?.checkIn || "Check-In"}
            value={checkIn}
            onChange={setCheckIn}
            type="checkIn"
            locale={locale}
          />
          <SmartDatePicker
            label={dict?.booking?.checkOut || "Check-Out"}
            value={checkOut}
            onChange={setCheckOut}
            type="checkOut"
            minDate={checkIn}
            compareDate={checkIn}
            locale={locale}
          />
        </div>
        <div className="guest-input border-t">
          <label>{dict?.booking?.guests || "Guests"}</label>
          <div className="guest-trigger" onClick={() => setIsGuestOpen(!isGuestOpen)}>
            {guests} {dict?.booking?.guests || "Guests"}
            {isGuestOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
          {isGuestOpen && (
            <div className="guest-dropdown">
              <div className="guest-row">
                <span>{dict?.booking?.adults || "Adults"}</span>
                <div className="stepper">
                  <button type="button" onClick={() => setGuests(Math.max(1, guests - 1))}>
                    <Minus size={20} />
                  </button>
                  <span>{guests}</span>
                  <button type="button" onClick={() => setGuests(guests + 1)}>
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <button type="submit" className="submit-btn" disabled={days === 0 || isSubmitting}>
        {isSubmitting ? <LoadingSpinner size={24} color="white" /> : (dict?.booking?.reserve || "Reserve")}
      </button>

      {days > 0 && (
        <div className="price-breakdown">
          <p className="not-charged">{dict?.booking?.wontCharge || "You won't be charged yet"}</p>
          <div className="price-row">
            <span><u>{price} JOD x {days} {locale === 'ar' ? 'ليال' : 'nights'}</u></span>
            <span>{subtotal} JOD</span>
          </div>
          <div className="price-row">
            <span><u>{dict?.fees?.cleaning || 'Cleaning fee'}</u></span>
            <span>{cleaningFee} JOD</span>
          </div>
          <div className="price-row">
            <span><u>{dict?.fees?.service || 'Service fee'}</u></span>
            <span>{serviceFee} JOD</span>
          </div>
          <div className="price-row total">
            <span>{dict?.booking?.totalBeforeTax || 'Total before taxes'}</span>
            <span>{total} JOD</span>
          </div>
        </div>
      )}

      <style jsx>{`
        .booking-form {
            position: relative;
        }

        .travel-inputs {
            border: 1px solid #e5e7eb;
            border-radius: 16px;
            overflow: hidden;
            background: white;
            color: black;
            /* box-shadow removed for cleaner look in floating card */
        }

        .smart-dates {
            display: flex;
        }

        .guest-input {
            padding: 1rem 1.25rem;
            position: relative;
            cursor: pointer;
            transition: background 0.2s;
        }
        .guest-input:hover {
            background: #f9fafb;
        }

        .border-t { border-top: 1px solid #e5e7eb; }

        label {
            display: block;
            font-size: 0.75rem;
            font-weight: 800;
            text-transform: uppercase;
            margin-bottom: 6px;
            color: #4b5563;
            letter-spacing: 0.05em;
        }
        
        .guest-trigger {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 1rem;
            color: #1f2937;
        }

        .guest-dropdown {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 16px;
            padding: 1.5rem;
            z-index: 20;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
            margin-top: 8px;
            animation: fadeIn 0.2s ease-out;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .guest-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .stepper {
            display: flex;
            align-items: center;
            gap: 1.25rem;
        }
        
        .stepper button {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 1px solid #d1d5db;
            background: white;
            color: #6b7280;
            font-size: 1.25rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        }
        
        .stepper button:hover {
            border-color: #1f2937;
            color: #1f2937;
            background: #f3f4f6;
        }
        
        .submit-btn {
            background: linear-gradient(135deg, #FFB703, #FB8500); 
            color: white;
            width: 100%;
            padding: 18px;
            border-radius: 16px;
            font-weight: 700;
            font-size: 1.125rem;
            border: none;
            margin-top: 1.5rem;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 4px 15px rgba(251, 133, 0, 0.3);
        }
        
        .submit-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(251, 133, 0, 0.4);
        }
        
        .submit-btn:disabled {
            background: #e5e7eb;
            color: #9ca3af;
            cursor: not-allowed;
            box-shadow: none;
            transform: none;
        }

        .not-charged {
            text-align: center;
            font-size: 0.875rem;
            color: #6b7280;
            margin: 1.25rem 0;
        }

        .price-breakdown {
            margin-top: 0.5rem;
            padding: 0 0.5rem;
        }

        .price-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 1rem;
            color: #374151;
            font-size: 1rem;
        }
        
        .price-row.total {
            border-top: 1px solid #e5e7eb;
            padding-top: 1.25rem;
            margin-top: 1.25rem;
            font-weight: 800;
            font-size: 1.25rem;
            color: #111827;
        }

        /* RTL Support */
        ${locale === 'ar' ? `
            .smart-dates { flex-direction: row-reverse; }
            .price-row { direction: rtl; }
            .guest-input { text-align: right; }
            label { text-align: right; }
            .guest-trigger { flex-direction: row-reverse; }
            .summary-row { flex-direction: row-reverse; }
            .total-row { flex-direction: row-reverse; }
            .back-btn { direction: rtl; }
        ` : ''}

        @media (max-width: 768px) {
            .smart-dates {
                flex-direction: column !important;
            }
        }
      `}</style>
    </form>
  );
}
