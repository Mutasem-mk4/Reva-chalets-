'use client';

import Link from 'next/link';
import Image from 'next/image';
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
  const logoSrc = lang === 'ar' ? '/images/logo-ar.png' : '/images/logo-en.png';

  return (
    <footer className="footer">
      <div className="container footer-content pt-16">
        {/* Brand */}
        <div className="brand">
          <div className="mb-4">
            <Link href={`/${lang}`}>
              <Image
                src={logoSrc}
                alt="Riva"
                width={140}
                height={60}
                className="footer-logo"
                style={{ objectFit: 'contain' }}
              />
            </Link>
          </div>
          <p>{dict.home.heroSubtitle}</p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4>{dict.footer?.quickLinks || (lang === 'ar' ? 'روابط سريعة' : 'Quick Links')}</h4>
          <nav className="footer-nav">
            <Link href={`/${lang}/chalets`}>{dict.nav.chalets}</Link>
            <Link href={`/${lang}/about`}>{dict.nav.about}</Link>
            <Link href={`/${lang}/contact`}>{dict.nav.contact}</Link>
            <Link href={`/${lang}/faq`}>{lang === 'ar' ? 'الأسئلة الشائعة' : 'FAQ'}</Link>
          </nav>
        </div>

        {/* Legal */}
        <div className="footer-section">
          <h4>{dict.footer?.legal || (lang === 'ar' ? 'قانوني' : 'Legal')}</h4>
          <nav className="footer-nav">
            <Link href={`/${lang}/terms`}>{dict.footer?.terms || (lang === 'ar' ? 'شروط الخدمة' : 'Terms of Service')}</Link>
            <Link href={`/${lang}/privacy`}>{dict.footer?.privacy || (lang === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy')}</Link>
          </nav>
        </div>

        {/* Payment & Security */}
        <div className="footer-section">
          <h4>{dict.footer?.payments || (lang === 'ar' ? 'دفع آمن' : 'Secure Payments')}</h4>
          <div className="payment-badges">
            <span className="badge visa"><Visa size={24} /> Visa</span>
            <span className="badge mastercard"><Mastercard size={24} /> Mastercard</span>
            <span className="badge cliq"><Lightning size={14} /> CliQ</span>
            <span className="badge ssl"><ShieldCheck size={14} /> SSL</span>
          </div>

          <h4 style={{ marginTop: '1.5rem' }}>{lang === 'ar' ? 'تواصل معنا' : 'Connect'}</h4>
          <div className="social-links">
            <a href="https://instagram.com/riva.jo" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
            </a>
            <a href="https://facebook.com/riva.jo" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="social-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.47h3.047v-2.642c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385c5.737-.9 10.125-5.864 10.125-11.854z" /></svg>
            </a>
            <a href="https://wa.me/962790000000" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="social-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" /></svg>
            </a>
          </div>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>&copy; {new Date().getFullYear()} {lang === 'ar' ? 'شاليهات ريفا' : 'Riva Chalets'}. {dict.footer?.allRights || (lang === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.')} <span style={{ opacity: 0.3, fontSize: '0.7em', marginLeft: '5px' }}>v1.0.5</span></p>
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

        .footer-logo {
          filter: brightness(0) invert(1);
          opacity: 0.9;
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

        .social-links {
          display: flex;
          gap: 0.75rem;
        }

        .social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          color: #D1FAE5;
          transition: all 0.2s ease;
        }

        .social-link:hover {
          background: rgba(245, 166, 35, 0.15);
          border-color: rgba(245, 166, 35, 0.4);
          color: #f5a623;
          transform: translateY(-2px);
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

