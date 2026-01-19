'use client';

import { useState } from 'react';
import { Lock, Lightning, CreditCard } from '@/components/ui/Icons';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Simplified Stripe-like component
export default function PaymentForm({
  amount,
  onSuccess
}: {
  amount: number;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cliq'>('card');

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
      setError('Card declined. Please try again with a different card.');
    }
  };

  return (
    <div className="payment-container">
      <div className="header">
        <span className="secure-badge"><Lock size={14} /> Secure Payment</span>
        <span className="brand">Stripe</span>
      </div>

      <div className="amount-display">
        Total to pay: <strong>{amount} JOD</strong>
      </div>

      {/* Payment Method Switcher */}
      <div className="payment-tabs">
        <button
          className={`tab ${paymentMethod === 'card' ? 'active' : ''}`}
          onClick={() => setPaymentMethod('card')}
          type="button"
        >
          Credit Card
        </button>
        <button
          className={`tab ${paymentMethod === 'cliq' ? 'active' : ''}`}
          onClick={() => setPaymentMethod('cliq')}
          type="button"
        >
          <Lightning size={14} /> CliQ (Instant)
        </button>
      </div>

      <form onSubmit={handlePay} className="payment-form">
        {paymentMethod === 'card' ? (
          <div className="form-row">
            <label>Card Information</label>
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
              <p>Send <strong>{amount} JOD</strong> to:</p>
              <div className="alias-box">
                <span className="alias-label">ALIA (Reva Corp)</span>
                <span className="alias-value">REVACHALETS</span>
              </div>
            </div>
            <div className="form-row">
              <label>Transaction Reference ID</label>
              <input
                type="text"
                placeholder="e.g. 123456789"
                className="cliq-input"
                required={paymentMethod === 'cliq'}
              />
              <small className="cliq-hint">Enter the REF number from your banking app</small>
            </div>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        <button type="submit" disabled={loading} className="pay-btn flex items-center justify-center gap-2">
          {loading ? <LoadingSpinner size={20} color="white" /> : (paymentMethod === 'cliq' ? 'Confirm Transfer' : `Pay ${amount} JOD`)}
        </button>
      </form>


      <div className="stripe-footer">
        Powered by <strong>Stripe</strong>
      </div>

      <style jsx>{`
        .payment-container {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 1.5rem;
          margin-top: 1rem;
          color: #334155;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
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
        }

        .brand {
          font-weight: 900;
          color: #635bff; /* Stripe Blurple */
          font-size: 1.25rem;
          letter-spacing: -0.5px;
        }

        .amount-display {
          margin-bottom: 1.5rem;
          font-size: 1rem;
        }

        .form-row {
          margin-bottom: 1rem;
        }

        label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
          color: #64748b;
        }

        .card-input-mock {
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          display: flex;
          align-items: center;
          padding: 0 0.75rem;
          background: #f8fafc;
          transition: border-color 0.2s;
        }
        
        .card-input-mock:focus-within {
          border-color: #635bff;
          box-shadow: 0 0 0 2px rgba(99, 91, 255, 0.2);
        }

        .icon {
          margin-right: 0.5rem;
          opacity: 0.5;
        }

        input {
          border: none;
          background: transparent;
          padding: 0.75rem 0;
          font-size: 0.9rem;
          outline: none;
          color: #334155;
        }

        .card-number {
          flex: 2;
        }
        
        .card-expiry {
          width: 60px;
          text-align: center;
          border-left: 1px solid #e2e8f0;
          border-right: 1px solid #e2e8f0;
          padding: 0.75rem 0.5rem;
          margin: 0 0.5rem;
        }

        .card-cvc {
          width: 40px;
          text-align: center;
        }

        .pay-btn {
          width: 100%;
          background: #635bff; /* Stripe Blurple */
          color: white;
          border: none;
          padding: 0.875rem;
          border-radius: 6px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .pay-btn:hover {
          background: #4f46e5;
        }
        
        .pay-btn:disabled {
          background: #94a3b8;
          cursor: not-allowed;
        }

        .error-message {
          color: #ef4444;
          font-size: 0.875rem;
          margin-bottom: 1rem;
          text-align: center;
        }

        .stripe-footer {
          margin-top: 1rem;
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
          padding: 0.25rem;
          border-radius: 8px;
        }

        .tab {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          border: none;
          background: transparent;
          padding: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: #64748b;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .tab.active {
          background: white;
          color: #0f172a;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        /* CliQ Styles */
        .cliq-info {
           background: #eff6ff;
           border: 1px dashed #3b82f6;
           padding: 1rem;
           border-radius: 8px;
           margin-bottom: 1.5rem;
           text-align: center;
        }

        .alias-box {
           margin-top: 0.5rem;
           background: white;
           padding: 0.5rem 1rem;
           border-radius: 6px;
           display: inline-flex;
           gap: 1rem;
           align-items: center;
           border: 1px solid #e2e8f0;
        }

        .alias-label {
           font-size: 0.75rem;
           color: #64748b;
           text-transform: uppercase;
        }

        .alias-value {
           font-weight: 700;
           color: #1e293b;
           font-family: monospace;
           font-size: 1.1rem;
        }

        .cliq-input {
           width: 100%;
           border: 1px solid #e2e8f0;
           border-radius: 6px;
           padding: 0.75rem;
           background: #f8fafc;
        }
        
        .cliq-hint {
            display: block;
            margin-top: 0.25rem;
            color: #94a3b8;
            font-size: 0.75rem;
        }
      `}</style>
    </div>
  );
}
