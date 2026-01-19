'use client';

import { ShieldCheck, Sparkles, Headphones, Handshake } from '@/components/ui/Icons';

export default function TrustBanner() {
  return (
    <div className="trust-banner">
      <div className="trust-item">
        <span className="icon"><ShieldCheck size={24} /></span>
        <div className="text">
          <strong>Secure Payment</strong>
          <small>Protected by Stripe</small>
        </div>
      </div>
      <div className="trust-item">
        <span className="icon"><Sparkles size={24} /></span>
        <div className="text">
          <strong>Verified Host</strong>
          <small>Inspected for Quality</small>
        </div>
      </div>
      <div className="trust-item">
        <span className="icon"><Headphones size={24} /></span>
        <div className="text">
          <strong>24/7 Support</strong>
          <small>We're here to help</small>
        </div>
      </div>
      <div className="trust-item reva-promise">
        <span className="icon"><Handshake size={24} /></span>
        <div className="text">
          <strong>The Reva Promise</strong>
          <small>Money Back Guarantee</small>
        </div>
      </div>

      <style jsx>{`
        .trust-banner {
          display: flex;
          gap: 2rem;
          background: hsl(var(--secondary) / 0.5);
          padding: 1.5rem;
          border-radius: var(--radius);
          margin-top: 2rem;
          flex-wrap: wrap;
        }

        .trust-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex: 1;
          min-width: 200px;
        }

        .icon {
            display: flex;
            align-items: center;
            justify-content: center;
            color: hsl(var(--primary));
        }

        .text {
          display: flex;
          flex-direction: column;
        }

        strong {
          color: hsl(var(--primary));
          font-weight: 600;
        }

        small {
          opacity: 0.7;
          font-size: 0.8rem;
        }

        .reva-promise {
            background: rgba(217, 119, 6, 0.1); /* Gold tint */
            padding: 0.5rem 1rem;
            border-radius: 8px;
            border: 1px solid rgba(217, 119, 6, 0.3);
        }

        .reva-promise strong {
            color: #b45309;
        }
      `}</style>
    </div>
  );
}
