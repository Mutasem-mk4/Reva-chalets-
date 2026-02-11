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
          gap: 1rem;
          background: var(--color-cream-dark);
          padding: 1.5rem;
          border-radius: 20px;
          margin-top: 2rem;
          flex-wrap: wrap;
          border: 1px solid #E5E7EB;
        }

        .trust-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex: 1;
          min-width: 140px;
        }

        .icon {
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--color-forest);
            background: #D1FAE5;
            width: 40px;
            height: 40px;
            border-radius: 50%;
        }

        .text {
          display: flex;
          flex-direction: column;
        }

        strong {
          color: var(--color-forest);
          font-weight: 700;
          font-size: 0.9rem;
        }

        small {
          opacity: 0.7;
          font-size: 0.75rem;
          color: var(--color-forest);
        }

        .reva-promise {
            background: #FFFBEB;
            padding: 0.5rem 0.75rem;
            border-radius: 12px;
            border: 1px solid #FCD34D;
        }

        .reva-promise strong {
            color: #B45309;
        }

        @media (max-width: 480px) {
          .trust-banner {
            gap: 1rem;
            padding: 1rem;
          }

          .trust-item {
            min-width: 100%;
            flex: 0 0 100%;
          }
        }
      `}</style>
    </div>
  );
}
