'use client';

import Link from 'next/link';
import { Visa, Mastercard, ShieldCheck, Lightning } from '@/components/ui/Icons';
import Logo from '@/components/ui/Logo';

// Default dictionary values as fallback
const defaultDict = {
  nav: { chalets: 'Chalets', about: 'About', contact: 'Contact' },
  home: { heroSubtitle: 'Find your perfect getaway with Riva Chalets.' },
  footer: { quickLinks: 'Quick Links', legal: 'Legal', terms: 'Terms of Service', privacy: 'Privacy Policy', payments: 'Secure Payments', allRights: 'All rights reserved.' },
};

export default function Footer({ lang, dict: propDict }: { lang: string, dict: any }) {
  // Use prop dict or fallback to defaults
  const dict = propDict || defaultDict;
  return (
    <footer className="footer">
      <div className="container footer-content pt-16">
        {/* Brand */}
        <div className="brand">
          <div className="mb-4">
            <Logo animated={false} />
          </div>
          <p>{dict.home.heroSubtitle}</p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4>{dict.footer?.quickLinks || 'Quick Links'}</h4>
          <nav className="footer-nav">
            <Link href={`/${lang}/chalets`}>{dict.nav.chalets}</Link>
            <Link href={`/${lang}/about`}>{dict.nav.about}</Link>
            <Link href={`/${lang}/contact`}>{dict.nav.contact}</Link>
            <Link href={`/${lang}/faq`}>FAQ</Link>
          </nav>
        </div>

        {/* Legal */}
        <div className="footer-section">
          <h4>{dict.footer?.legal || 'Legal'}</h4>
          <nav className="footer-nav">
            <Link href={`/${lang}/terms`}>{dict.footer?.terms || 'Terms of Service'}</Link>
            <Link href={`/${lang}/privacy`}>{dict.footer?.privacy || 'Privacy Policy'}</Link>
          </nav>
        </div>

        {/* Payment & Security */}
        <div className="footer-section">
          <h4>{dict.footer?.payments || 'Secure Payments'}</h4>
          <div className="payment-badges">
            <span className="badge visa"><Visa size={24} /> Visa</span>
            <span className="badge mastercard"><Mastercard size={24} /> Mastercard</span>
            <span className="badge cliq"><Lightning size={14} /> CliQ</span>
            <span className="badge ssl"><ShieldCheck size={14} /> SSL</span>
          </div>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>&copy; {new Date().getFullYear()} Riva Chalets. {dict.footer?.allRights || 'All rights reserved.'}</p>
      </div>

      <style jsx>{`
        .footer {
          background-color: var(--color-forest);
          color: var(--color-cream);
          padding: 4rem 0 2rem;
          margin-top: auto;
          position: relative;
        }

        .footer-content {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.5rem;
          margin-bottom: 3rem;
        }

        .brand p {
          opacity: 0.75;
          font-size: 0.9rem;
          color: #A7F3D0;
        }

        .footer-section h4 {
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 1rem;
          color: #A7F3D0;
          opacity: 0.7;
        }

        .footer-nav {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .footer-nav :global(a) {
          opacity: 0.85;
          transition: opacity 0.2s, color 0.2s;
          font-size: 0.95rem;
          color: var(--color-cream);
        }

        .footer-nav :global(a:hover) {
          opacity: 1;
          color: var(--color-gold-light);
        }

        .payment-badges {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: rgba(255,255,255,0.08);
          padding: 0.35rem 0.6rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 500;
          border: 1px solid rgba(255,255,255,0.12);
          color: #D1FAE5;
        }

        .badge.visa,
        .badge.mastercard {
          padding: 0.25rem 0.5rem;
        }

        .badge.cliq {
          border-color: #2563eb;
          color: #93C5FD;
        }

        .badge.ssl {
          color: #6EE7B7;
          border-color: rgba(110, 231, 183, 0.3);
        }

        .footer-bottom {
          border-top: 1px solid rgba(167, 243, 208, 0.15);
          padding-top: 1.5rem;
          text-align: center;
        }

        .footer-bottom p {
          font-size: 0.85rem;
          opacity: 0.5;
          color: #A7F3D0;
        }

        @media (min-width: 768px) {
          .footer-content {
            grid-template-columns: 2fr 1fr 1fr 1.5fr;
            gap: 3rem;
          }

          .footer-bottom {
            text-align: left;
          }
        }

        @media (max-width: 767px) {
          .footer {
            padding: 2.5rem 0 1.5rem;
          }

          .footer-content {
            gap: 2rem;
            margin-bottom: 2rem;
          }

          .brand p {
            font-size: 0.85rem;
          }

          .footer-section h4 {
            font-size: 0.75rem;
            margin-bottom: 0.75rem;
          }

          .footer-nav :global(a) {
            font-size: 0.9rem;
            padding: 0.25rem 0;
          }

          .payment-badges {
            gap: 0.35rem;
          }

          .badge {
            font-size: 0.7rem;
            padding: 0.25rem 0.5rem;
          }

          .footer-bottom {
            padding-top: 1rem;
          }

          .footer-bottom p {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </footer>
  );
}

