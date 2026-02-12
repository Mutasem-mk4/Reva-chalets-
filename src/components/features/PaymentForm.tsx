'use client';

import { useState } from 'react';
import { Lock, Lightning, CreditCard } from '@/components/ui/Icons';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Simplified Stripe-like component
export default function PaymentForm({
  amount,
  onSuccess,
  locale = 'en'
}: {
  amount: number;
  onSuccess: () => void;
  locale?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cliq'>('card');
  const isAr = locale === 'ar';

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Simulate network delay for payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate random success/failure (90% success)
    const isSuccess = Math.random() > 0.1;

    setLoading(false);

    if (isSuccess) {
      onSuccess();
    } else {
      setError(isAr ? 'تم رفض البطاقة. يرجى المحاولة مرة أخرى.' : 'Card declined. Please try again with a different card.');
    }
  };

  return (
    <div className="payment-container">
      <div className="header">
        <span className="secure-badge"><Lock size={14} /> {isAr ? 'دفع آمن' : 'Secure Payment'}</span>
        <span className="brand">Stripe</span>
      </div>

      <div className="amount-display">
        {isAr ? 'الإجمالي للدفع:' : 'Total to pay:'} <strong>{amount} JOD</strong>
      </div>

      {/* Payment Method Switcher */}
      <div className="payment-tabs">
        <button
          className={`tab ${paymentMethod === 'card' ? 'active' : ''}`}
          onClick={() => setPaymentMethod('card')}
          type="button"
        >
          {isAr ? 'بطاقة ائتمان' : 'Credit Card'}
        </button>
        <button
          className={`tab ${paymentMethod === 'cliq' ? 'active' : ''}`}
          onClick={() => setPaymentMethod('cliq')}
          type="button"
        >
          <Lightning size={14} /> {isAr ? 'كليك (فوري)' : 'CliQ (Instant)'}
        </button>
      </div>

      <form onSubmit={handlePay} className="payment-form">
        {paymentMethod === 'card' ? (
          <div className="form-row">
            <label>{isAr ? 'بيانات البطاقة' : 'Card Information'}</label>
            <div className="card-input-mock">
              <span className="icon"><CreditCard size={18} /></span>
              <input
                type="text"
                placeholder="0000 0000 0000 0000"
                maxLength={19}
                className="card-number"
                required={paymentMethod === 'card'}
              />
              <input
                type="text"
                placeholder="MM/YY"
                className="card-expiry"
                maxLength={5}
                required={paymentMethod === 'card'}
              />
              <input
                type="text"
                placeholder="CVC"
                className="card-cvc"
                maxLength={3}
                required={paymentMethod === 'card'}
              />
            </div>
          </div>
        ) : (
          <div className="cliq-section">
            <div className="cliq-info">
              <p>{isAr ? `أرسل ${amount} دينار إلى:` : `Send ${amount} JOD to:`}</p>
              <div className="alias-box">
                <span className="alias-label">ALIA (Reva Corp)</span>
                <span className="alias-value">REVACHALETS</span>
              </div>
            </div>
            <div className="form-row">
              <label>{isAr ? 'رقم المرجع (Ref ID)' : 'Transaction Reference ID'}</label>
              <input
                type="text"
                placeholder="e.g. 123456789"
                className="cliq-input"
                required={paymentMethod === 'cliq'}
                style={{ textAlign: isAr ? 'right' : 'left' }}
              />
              <small className="cliq-hint">{isAr ? 'أدخل الرقم المرجعي من تطبيق البنك الخاص بك' : 'Enter the REF number from your banking app'}</small>
            </div>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        <button type="submit" disabled={loading} className="pay-btn flex items-center justify-center gap-2">
          {loading ? <LoadingSpinner size={20} color="white" /> : (paymentMethod === 'cliq' ? (isAr ? 'تأكيد التحويل' : 'Confirm Transfer') : (isAr ? `دفع ${amount} دينار` : `Pay ${amount} JOD`))}
        </button>
      </form>


      <div className="stripe-footer">
        Powered by <strong>Stripe</strong>
      </div>

      <style jsx>{`
        .payment-container {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 1.5rem;
          margin-top: 1rem;
          color: #334155;
          font-family: var(--font-sans);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .secure-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.75rem;
          color: #10b981;
          font-weight: 500;
          background: #ecfdf5;
          padding: 4px 8px;
          border-radius: 6px;
        }

        .brand {
          font-weight: 900;
          color: #635bff; /* Stripe Blurple */
          font-size: 1.25rem;
          letter-spacing: -0.5px;
        }

        .amount-display {
          margin-bottom: 1.5rem;
          font-size: 1.1rem;
          text-align: center;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 12px;
          border: 1px dashed #e2e8f0;
        }

        .form-row {
          margin-bottom: 1.25rem;
        }

        label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #475569;
        }

        .card-input-mock {
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          display: flex;
          align-items: center;
          padding: 0 0.75rem;
          background: white;
          transition: all 0.2s;
          height: 48px;
        }
        
        .card-input-mock:focus-within {
          border-color: #635bff;
          box-shadow: 0 0 0 3px rgba(99, 91, 255, 0.1);
        }

        .icon {
          margin-right: 0.5rem;
          opacity: 0.5;
          display: flex;
        }

        input {
          border: none;
          background: transparent;
          padding: 0.5rem 0;
          font-size: 0.95rem;
          outline: none;
          color: #1e293b;
          font-family: monospace;
        }
        
        input::placeholder {
            color: #cbd5e1;
            font-family: var(--font-sans);
        }

        .card-number {
          flex: 2;
        }
        
        .card-expiry {
          width: 70px;
          text-align: center;
          border-left: 1px solid #e2e8f0;
          border-right: 1px solid #e2e8f0;
          padding: 0 0.5rem;
          margin: 0 0.5rem;
        }

        .card-cvc {
          width: 50px;
          text-align: center;
        }

        .pay-btn {
          width: 100%;
          background: #635bff; /* Stripe Blurple */
          color: white;
          border: none;
          padding: 1rem;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1.05rem;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1.5rem;
          box-shadow: 0 4px 12px rgba(99, 91, 255, 0.25);
        }

        .pay-btn:hover {
          background: #4f46e5;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(99, 91, 255, 0.35);
        }
        
        .pay-btn:disabled {
          background: #94a3b8;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .error-message {
          color: #ef4444;
          font-size: 0.875rem;
          margin-bottom: 1rem;
          text-align: center;
          background: #fef2f2;
          padding: 0.75rem;
          border-radius: 8px;
        }

        .stripe-footer {
          margin-top: 1.5rem;
          text-align: center;
          font-size: 0.75rem;
          color: #94a3b8;
        }

        /* Payment Tabs */
        .payment-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          background: #f1f5f9;
          padding: 0.35rem;
          border-radius: 12px;
        }

        .tab {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          border: none;
          background: transparent;
          padding: 0.6rem;
          font-size: 0.9rem;
          font-weight: 500;
          color: #64748b;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .tab.active {
          background: white;
          color: #0f172a;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          font-weight: 600;
        }

        /* CliQ Styles */
        .cliq-info {
           background: #eff6ff;
           border: 1px dashed #3b82f6;
           padding: 1.25rem;
           border-radius: 12px;
           margin-bottom: 1.5rem;
           text-align: center;
        }

        .alias-box {
           margin-top: 0.75rem;
           background: white;
           padding: 0.75rem 1.25rem;
           border-radius: 8px;
           display: inline-flex;
           gap: 1rem;
           align-items: center;
           border: 1px solid #bfdbfe;
           box-shadow: 0 2px 5px rgba(59, 130, 246, 0.05);
        }

        .alias-label {
           font-size: 0.75rem;
           color: #64748b;
           text-transform: uppercase;
           font-weight: 600;
        }

        .alias-value {
           font-weight: 700;
           color: #1e293b;
           font-family: monospace;
           font-size: 1.2rem;
           letter-spacing: 0.5px;
        }

        .cliq-input {
           width: 100%;
           border: 1px solid #e2e8f0;
           border-radius: 10px;
           padding: 0.875rem;
           background: #f8fafc;
           transition: all 0.2s;
           font-family: monospace;
           font-size: 1.1rem;
           letter-spacing: 1px;
        }
        .cliq-input:focus {
           border-color: #3b82f6;
           background: white;
           box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .cliq-hint {
            display: block;
            margin-top: 0.5rem;
            color: #94a3b8;
            font-size: 0.8rem;
        }

        ${isAr ? `
            .header { direction: rtl; }
            .amount-display { direction: rtl; }
            .payment-tabs { direction: rtl; }
            .form-row { direction: rtl; }
            label { text-align: right; }
            .cliq-info { direction: rtl; }
            .alias-box { flex-direction: row-reverse; }
            .icon { margin-left: 0.5rem; margin-right: 0; }
        ` : ''}
      `}</style>
    </div>
  );
}
