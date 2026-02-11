'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronUp, ChevronDown, CheckCircle, Sparkles, Gift, Plus, Minus } from '@/components/ui/Icons';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import PaymentForm from './PaymentForm';
import TrustSeals from './TrustSeals';
import SmartDatePicker from './SmartDatePicker';
import BookingProgress from './BookingProgress';

export default function BookingForm({ dict, price, chaletId }: { dict: any, price: number, chaletId: string }) {
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

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePaymentSuccess = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chaletId,
          startDate: checkIn,
          endDate: checkOut,
          guestName: 'Web User', // Should ideally come from a form or auth
          guestEmail: 'web@user.com',
          guestPhone: '000000000',
          guestCount: guests,
          totalPrice: total,
          pricePerNight: nightPrice,
          nights: days
        })
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          setShowGift(true);
        }, 1500);
      } else {
        const err = await response.json();
        alert(err.error || 'Failed to create booking');
      }
    } catch (e) {
      console.error("Booking failed", e);
    } finally {
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
        <BookingProgress currentStep={2} />
        <button onClick={() => setStep('details')} className="back-btn flex items-center gap-1">
          <ChevronLeft size={16} /> Back to details
        </button>
        <div className="summary-box">
          <h4>{dict.chalet.book} Summary</h4>
          <div className="summary-row">
            <span>{price} JOD x {days} nights</span>
            <span>{subtotal} JOD</span>
          </div>
          <div className="summary-row">
            <span>Cleaning Fee</span>
            <span>{cleaningFee} JOD</span>
          </div>
          <div className="summary-row">
            <span>Service Fee</span>
            <span>{serviceFee} JOD</span>
          </div>
          <div className="total-row">
            <span>Total</span>
            <span>{total} JOD</span>
          </div>
        </div>
        <PaymentForm amount={total} onSuccess={handlePaymentSuccess} />
        <TrustSeals />

        <style jsx>{`
                    .back-btn {
                        background: none;
                        border: none;
                        color: hsl(var(--foreground));
                        font-size: 0.875rem;
                        cursor: pointer;
                        margin-bottom: 0.5rem;
                        opacity: 0.7;
                    }
                    .back-btn:hover { opacity: 1; }
                    
                    .summary-box {
                        background: hsl(var(--secondary) / 0.5);
                        padding: 1rem;
                        border-radius: var(--radius);
                        margin-bottom: 1.5rem;
                    }
                    .summary-row {
                        display: flex;
                        justify-content: space-between;
                        font-size: 0.9rem;
                        margin-bottom: 0.5rem;
                    }
                    .total-row {
                        display: flex;
                        justify-content: space-between;
                        font-weight: 700;
                        font-size: 1.1rem;
                        border-top: 1px solid hsl(var(--border));
                        padding-top: 0.5rem;
                        margin-top: 0.5rem;
                    }
                `}</style>
      </div>
    );
  }

  return (
    <form onSubmit={handleDetailsSubmit} className="booking-form">
      <BookingProgress currentStep={1} />
      <div className="travel-inputs">
        <div className="smart-dates">
          <SmartDatePicker
            label="Check-In"
            value={checkIn}
            onChange={setCheckIn}
            type="checkIn"
          />
          <SmartDatePicker
            label="Check-Out"
            value={checkOut}
            onChange={setCheckOut}
            type="checkOut"
            minDate={checkIn}
            compareDate={checkIn}
          />
        </div>
        <div className="guest-input border-t">
          <label>Guests</label>
          <div className="guest-trigger" onClick={() => setIsGuestOpen(!isGuestOpen)}>
            {guests} Guests
            {isGuestOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
          {isGuestOpen && (
            <div className="guest-dropdown">
              <div className="guest-row">
                <span>Adults</span>
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

      <button type="submit" className="submit-btn" disabled={days === 0}>
        Reserve
      </button>

      {days > 0 && (
        <div className="price-breakdown">
          <p className="not-charged">You won't be charged yet</p>
          <div className="price-row">
            <span><u>{price} JOD x {days} nights</u></span>
            <span>{subtotal} JOD</span>
          </div>
          <div className="price-row">
            <span><u>Cleaning fee</u></span>
            <span>{cleaningFee} JOD</span>
          </div>
          <div className="price-row">
            <span><u>Service fee</u></span>
            <span>{serviceFee} JOD</span>
          </div>
          <div className="price-row total">
            <span>Total before taxes</span>
            <span>{total} JOD</span>
          </div>
        </div>
      )}

      <style jsx>{`
        .booking-form {
            position: relative;
        }

        .travel-inputs {
            border: 1px solid #ccc;
            border-radius: 12px;
            overflow: hidden;
            background: white;
            color: black;
        }

        .date-inputs {
            display: flex;
        }

        .date-field {
            flex: 1;
            padding: 0.75rem 1rem;
        }
        
        .date-field input {
            width: 100%;
            border: none;
            outline: none;
            font-size: 1rem;
            color: #222;
            cursor: pointer;
            min-height: 44px;
            background: transparent;
        }

        .guest-input {
            padding: 0.75rem 1rem;
            position: relative;
        }

        .border-r { border-right: 1px solid #ccc; }
        .border-t { border-top: 1px solid #ccc; }

        label {
            display: block;
            font-size: 0.7rem;
            font-weight: 800;
            text-transform: uppercase;
            margin-bottom: 4px;
            color: #222;
        }
        
        .guest-trigger {
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 1rem;
            min-height: 44px;
            padding: 0.5rem 0;
        }

        .guest-dropdown {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 1px solid #ccc;
            border-radius: 12px;
            padding: 1.25rem;
            z-index: 10;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            margin-top: 4px;
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
            width: 44px;
            height: 44px;
            border-radius: 50%;
            border: 1px solid #b0b0b0;
            background: white;
            color: #717171;
            font-size: 1.5rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            touch-action: manipulation;
        }
        
        .stepper button:hover {
            border-color: black;
            color: black;
        }
        
        .stepper button:active {
            background: #f0f0f0;
            transform: scale(0.95);
        }

        .stepper span {
            font-size: 1.1rem;
            font-weight: 600;
            min-width: 30px;
            text-align: center;
        }

        .submit-btn {
            background: linear-gradient(135deg, #f5a623, #d4920a);
            color: white;
            width: 100%;
            padding: 16px;
            border-radius: 3rem;
            font-weight: 700;
            font-size: 1.1rem;
            border: none;
            margin-top: 1.25rem;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 4px 15px rgba(245, 166, 35, 0.3);
            touch-action: manipulation;
        }
        
        .submit-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(245, 166, 35, 0.4);
        }

        .submit-btn:active {
            transform: scale(0.98);
        }
        
        .submit-btn:disabled {
            background: #ccc;
            cursor: not-allowed;
            box-shadow: none;
        }

        .not-charged {
            text-align: center;
            font-size: 0.9rem;
            color: #555;
            margin: 1rem 0;
        }

        .price-breakdown {
            margin-top: 0.5rem;
        }

        .price-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.75rem;
            color: hsl(var(--foreground));
            font-size: 1rem;
        }
        
        .price-row u {
            text-decoration: underline;
            cursor: pointer;
        }
        
        .price-row.total {
            border-top: 1px solid hsl(var(--border));
            padding-top: 1rem;
            margin-top: 1rem;
            font-weight: 800;
            font-size: 1.1rem;
        }

        /* Mobile optimizations */
        @media (max-width: 768px) {
            .date-inputs {
                flex-direction: column;
            }
            
            .date-field {
                padding: 1rem;
            }
            
            .date-field input {
                font-size: 1.1rem;
            }
            
            .border-r {
                border-right: none;
                border-bottom: 1px solid #ccc;
            }
            
            .guest-input {
                padding: 1rem;
            }
            
            .guest-trigger {
                font-size: 1.1rem;
            }
            
            .stepper button {
                width: 52px;
                height: 52px;
                font-size: 1.75rem;
            }
            
            .stepper span {
                font-size: 1.25rem;
            }
            
            .submit-btn {
                padding: 18px;
                font-size: 1.15rem;
            }
            
            .price-row {
                font-size: 0.95rem;
            }
            
            label {
                font-size: 0.75rem;
            }
        }
      `}</style>
    </form>
  );
}
