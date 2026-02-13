'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import UserMenu from '@/components/auth/UserMenu';

// Default dictionary values as fallback
const defaultDict = {
  nav: { home: 'Home', chalets: 'Chalets', about: 'About', contact: 'Contact', bookNow: 'Book Now' },
};

export default function Header({ lang, dict: propDict }: { lang: string, dict: any }) {
  const dict = propDict || defaultDict;
  const isAr = lang === 'ar';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();

  const isHomePage = pathname === `/${lang}` || pathname === `/${lang}/` || pathname === '/';
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (isHomePage) {
      document.body.classList.add('home-page');
    } else {
      document.body.classList.remove('home-page');
    }
    return () => document.body.classList.remove('home-page');
  }, [isHomePage]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Theme logic removed - Light mode enforced
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const switchLanguage = () => {
    const newLang = lang === 'en' ? 'ar' : 'en';
    const newPath = pathname.replace(`/${lang}`, `/${newLang}`);
    router.push(newPath);
  };

  const logoSrc = lang === 'ar' ? '/images/logo-ar.png' : '/images/logo-en.png';

  return (
    <>
      <header className={`header ${isHomePage ? 'home' : 'inner'} ${scrolled ? 'scrolled' : ''}`}>
        <div className="container header-content">
          {/* Logo */}
          <Link href={`/${lang}`} className="logo-link">
            <Image
              src={logoSrc}
              alt="Riva"
              width={120}
              height={54}
              className="logo-img"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="desktop-nav">
            <Link href={`/${lang}`} className={pathname === `/${lang}` || pathname === `/${lang}/` ? 'active' : ''}>
              {dict.nav.home}
            </Link>
            <Link href={`/${lang}/chalets`} className={pathname?.includes('/chalets') ? 'active' : ''}>
              {dict.nav.chalets}
            </Link>
            <Link href={`/${lang}/about`} className={pathname?.includes('/about') ? 'active' : ''}>
              {dict.nav.about}
            </Link>
            <Link href={`/${lang}/contact`} className={pathname?.includes('/contact') ? 'active' : ''}>
              {dict.nav.contact}
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="actions">
            <button onClick={switchLanguage} className="lang-btn desktop-only" aria-label={lang === 'en' ? 'Switch to Arabic' : 'Switch to English'}>
              {lang === 'en' ? 'عربي' : 'EN'}
            </button>

            <UserMenu lang={lang} isAr={isAr} dict={dict} />

            <Link href={`/${lang}/chalets`} className="btn-primary desktop-only">
              {dict.nav.bookNow}
            </Link>

            {/* Mobile: hamburger only */}
            <button className="hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
              <span className={`bar ${mobileMenuOpen ? 'open' : ''}`}></span>
              <span className={`bar ${mobileMenuOpen ? 'open' : ''}`}></span>
              <span className={`bar ${mobileMenuOpen ? 'open' : ''}`}></span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <button onClick={switchLanguage} className="mobile-action-btn">
            {lang === 'en' ? 'عربي' : 'EN'}
          </button>
        </div>

        <nav className="mobile-nav">
          <Link href={`/${lang}`} className={pathname === `/${lang}` || pathname === `/${lang}/` ? 'active' : ''}>
            {dict.nav.home}
          </Link>
          <Link href={`/${lang}/chalets`} className={pathname?.includes('/chalets') ? 'active' : ''}>
            {dict.nav.chalets}
          </Link>
          <Link href={`/${lang}/about`} className={pathname?.includes('/about') ? 'active' : ''}>
            {dict.nav.about}
          </Link>
          <Link href={`/${lang}/contact`} className={pathname?.includes('/contact') ? 'active' : ''}>
            {dict.nav.contact}
          </Link>

          <div className="mobile-divider" />

          {user ? (
            <>
              <Link href={`/${lang}/dashboard`} className={pathname?.includes('/dashboard') ? 'active' : ''}>
                {isAr ? 'لوحة التحكم' : 'Dashboard'}
              </Link>
              <Link href={`/${lang}/guest/profile`} className={pathname?.includes('/profile') ? 'active' : ''}>
                {isAr ? 'حسابي' : 'My Profile'}
              </Link>
              <button onClick={() => signOut()} className="mobile-logout-btn">
                {isAr ? 'تسجيل الخروج' : 'Logout'}
              </button>
            </>
          ) : (
            <Link href={`/${lang}/login`} className={pathname?.includes('/login') ? 'active' : ''}>
              {isAr ? 'تسجيل الدخول' : 'Login'}
            </Link>
          )}

          <Link href={`/${lang}/chalets`} className="mobile-cta">
            {dict.nav.bookNow}
          </Link>
        </nav>
      </div>

      {/* Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)} />
      )}

      <style jsx>{`
        .header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
        }

        /* HOME — transparent white */
        .header.home {
          height: 72px;
          background: transparent;
          color: white;
        }

        .header.home .logo-link,
        .header.home .desktop-nav a,
        .header.home .lang-btn {
          color: white;
        }

        /* SCROLLED + INNER — cream glass */
        .header.inner,
        .header.home.scrolled {
          height: 64px;
          background: rgba(250, 249, 246, 0.95);
          backdrop-filter: blur(12px);
          color: var(--color-forest);
          border-bottom: 1px solid rgba(27, 59, 54, 0.08);
          box-shadow: 0 2px 20px rgba(0, 0, 0, 0.04);
        }

        .header.inner .logo-link,
        .header.home.scrolled .logo-link,
        .header.inner .desktop-nav a,
        .header.home.scrolled .desktop-nav a,
        .header.inner .lang-btn,
        .header.home.scrolled .lang-btn {
          color: var(--color-forest);
        }

        /* Logo image — Dynamic visibility */
        .header.home :global(.logo-img) {
          height: 64px;
          width: auto;
          object-fit: contain;
          filter: brightness(0) invert(1);
          transition: filter 0.3s ease;
        }

        .header.inner :global(.logo-img),
        .header.home.scrolled :global(.logo-img) {
          height: 64px;
          width: auto;
          object-fit: contain;
          filter: brightness(0) saturate(100%) invert(18%) sepia(10%) saturate(1966%) hue-rotate(124deg) brightness(97%) contrast(90%);
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
        }

        .logo-link {
          text-decoration: none;
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        .desktop-nav {
          display: none;
          gap: 2rem;
        }

        .desktop-nav a {
          font-weight: 500;
          font-size: 0.9rem;
          transition: all 0.2s ease;
          opacity: 0.85;
          position: relative;
        }

        .desktop-nav a:hover,
        .desktop-nav a.active {
          opacity: 1;
        }

        .desktop-nav a::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: -4px;
          left: 0;
          background: currentColor;
          transition: width 0.2s ease;
        }

        .desktop-nav a:hover::after,
        .desktop-nav a.active::after {
          width: 100%;
        }

        .actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .lang-btn {
          background: none;
          border: 1px solid rgba(150, 150, 150, 0.2);
          padding: 0.35rem 0.75rem;
          border-radius: 2rem;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .lang-btn:hover {
          background: rgba(150, 150, 150, 0.1);
        }

        .btn-primary {
          background: linear-gradient(135deg, #E5A61D 0%, #FBBF24 50%, #D4920A 100%);
          color: #ffffff !important;
          padding: 0.5rem 1.25rem;
          border-radius: 3rem;
          font-weight: 600;
          font-size: 0.85rem;
          transition: all 0.2s ease;
          box-shadow: 0 2px 10px rgba(229, 166, 29, 0.3);
        }

        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(229, 166, 29, 0.4);
        }

        .desktop-only {
          display: none !important;
        }

        .hamburger {
          display: flex;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          padding: 0.5rem;
          cursor: pointer;
          z-index: 110;
          color: inherit;
        }

        .bar {
          width: 22px;
          height: 2px;
          background: currentColor;
          transition: all 0.3s ease;
        }

        .bar.open:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
        }

        .bar.open:nth-child(2) {
          opacity: 0;
        }

        .bar.open:nth-child(3) {
          transform: rotate(-45deg) translate(5px, -5px);
        }

        .mobile-menu {
          position: fixed;
          top: 0;
          right: -100%;
          width: 80%;
          max-width: 300px;
          height: 100vh;
          background: var(--color-cream);
          z-index: 1100;
          transition: right 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          padding: 1.5rem;
          box-shadow: -10px 0 30px rgba(0,0,0,0.15);
          overflow-y: auto;
        }

        .mobile-menu.open {
          right: 0;
        }

        .mobile-menu-header {
          display: flex;
          justify-content: flex-end;
          gap: 0.5rem;
          padding-bottom: 1.25rem;
          margin-bottom: 0.75rem;
          border-bottom: 1px solid rgba(27, 59, 54, 0.08);
        }

        .mobile-action-btn {
          background: rgba(27, 59, 54, 0.05);
          border: none;
          padding: 0.6rem 0.85rem;
          border-radius: 0.5rem;
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--color-forest);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }

        .mobile-nav {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .mobile-nav :global(a) {
          font-size: 1.05rem;
          font-weight: 500;
          color: var(--color-forest);
          padding: 0.75rem 0.5rem;
          border-radius: 0.5rem;
          transition: all 0.2s;
        }

        .mobile-nav :global(a:hover),
        .mobile-nav :global(a.active) {
          color: var(--color-gold);
          background: rgba(27, 59, 54, 0.05);
        }

        .mobile-divider {
          height: 1px;
          background: rgba(27, 59, 54, 0.08);
          margin: 0.5rem 0;
        }

        .mobile-logout-btn {
          font-size: 1.05rem;
          font-weight: 500;
          color: #ef4444;
          padding: 0.75rem 0.5rem;
          border-radius: 0.5rem;
          transition: all 0.2s;
          background: none;
          border: none;
          width: 100%;
          text-align: inherit;
          cursor: pointer;
        }

        .mobile-logout-btn:hover {
          background: rgba(239, 68, 68, 0.05);
        }

        .mobile-nav :global(.mobile-cta) {
          background: linear-gradient(135deg, #E5A61D 0%, #FBBF24 50%, #D4920A 100%);
          color: #ffffff !important;
          padding: 0.85rem;
          border-radius: 0.75rem;
          text-align: center;
          margin-top: 0.75rem;
          font-weight: 600;
          box-shadow: 0 3px 12px rgba(229, 166, 29, 0.3);
        }

        .mobile-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.4);
          backdrop-filter: blur(4px);
          z-index: 1050;
        }

        @media (min-width: 768px) {
          .desktop-nav {
            display: flex;
          }

          .desktop-only {
            display: inline-flex !important;
          }

          .hamburger {
            display: none;
          }
        }

        @media (max-width: 1024px) {
          .desktop-nav {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
