'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Sun, Moon, User } from '@/components/ui/Icons';
import Logo from '@/components/ui/Logo';

// Default dictionary values as fallback
const defaultDict = {
  nav: { home: 'Home', chalets: 'Chalets', about: 'About', contact: 'Contact', bookNow: 'Book Now', signIn: 'Sign In' },
  rewards: { wallet: 'My Wallet' },
};

export default function Header({ lang, dict: propDict }: { lang: string, dict: any }) {
  // Use prop dict or fallback to defaults
  const dict = propDict || defaultDict;
  const [theme, setTheme] = useState('light');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

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

  // Use stored theme or preference
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.setAttribute('data-theme', storedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const switchLanguage = () => {
    const newLang = lang === 'en' ? 'ar' : 'en';
    const newPath = pathname.replace(`/${lang}`, `/${newLang}`);
    router.push(newPath);
  };

  return (
    <>
      <header className={`header ${isHomePage ? 'home' : 'inner'} ${scrolled ? 'scrolled' : ''} ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="container header-content">
          <Link href={`/${lang}`} className="logo-link">
            <Logo animated={true} />
          </Link>

          <nav className="desktop-nav">
            <Link
              href={`/${lang}`}
              className={pathname === `/${lang}` || pathname === `/${lang}/` ? 'active' : ''}
            >
              {dict.nav.home}
            </Link>
            <Link
              href={`/${lang}/chalets`}
              className={pathname?.includes('/chalets') ? 'active' : ''}
            >
              {dict.nav.chalets}
            </Link>
            <Link
              href={`/${lang}/about`}
              className={pathname?.includes('/about') ? 'active' : ''}
            >
              {dict.nav.about}
            </Link>
            <Link
              href={`/${lang}/contact`}
              className={pathname?.includes('/contact') ? 'active' : ''}
            >
              {dict.nav.contact}
            </Link>
          </nav>

          <div className="actions">
            {/* Desktop Actions */}
            <button onClick={switchLanguage} className="icon-btn desktop-only" aria-label={lang === 'en' ? 'Switch to Arabic' : 'Switch to English'}>
              {lang === 'en' ? 'عربي' : 'English'}
            </button>

            <button onClick={toggleTheme} className="icon-btn desktop-only" aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <Link href={`/${lang}/login`} className="btn-secondary desktop-only">
              {dict.nav.signIn}
            </Link>

            <Link
              href={`/${lang}/guest/profile`}
              className="icon-btn guest-icon desktop-only"
              aria-label="My Profile"
            >
              <User size={18} />
            </Link>

            <Link href={`/${lang}/chalets`} className="btn-primary desktop-only">
              {dict.nav.bookNow}
            </Link>

            {/* Mobile Hamburger - Only visible on mobile */}
            <button
              className="hamburger"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <span className={`bar ${mobileMenuOpen ? 'open' : ''}`}></span>
              <span className={`bar ${mobileMenuOpen ? 'open' : ''}`}></span>
              <span className={`bar ${mobileMenuOpen ? 'open' : ''}`}></span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        {/* Mobile Menu Header */}
        <div className="mobile-menu-header">
          <button onClick={switchLanguage} className="mobile-action-btn">
            {lang === 'en' ? 'عربي' : 'EN'}
          </button>
          <button onClick={toggleTheme} className="mobile-action-btn">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>

        <nav className="mobile-nav">
          <Link
            href={`/${lang}`}
            className={pathname === `/${lang}` || pathname === `/${lang}/` ? 'active' : ''}
          >
            {dict.nav.home}
          </Link>
          <Link
            href={`/${lang}/chalets`}
            className={pathname?.includes('/chalets') ? 'active' : ''}
          >
            {dict.nav.chalets}
          </Link>
          <Link
            href={`/${lang}/about`}
            className={pathname?.includes('/about') ? 'active' : ''}
          >
            {dict.nav.about}
          </Link>
          <Link
            href={`/${lang}/contact`}
            className={pathname?.includes('/contact') ? 'active' : ''}
          >
            {dict.nav.contact}
          </Link>

          <div className="mobile-divider" />

          <Link href={`/${lang}/login`} className="mobile-secondary">
            {dict.nav.signIn}
          </Link>
          <Link href={`/${lang}/guest/profile`}>
            My Profile
          </Link>
          <Link href={`/${lang}/guest/wallet`}>
            My Wallet
          </Link>

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
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          align-items: center;
        }

        /* 1. HOME PAGE STATE (Initial) - Transparent & White */
        .header.home {
            height: 80px;
            background: transparent;
            color: white;
            border-bottom: 1px solid transparent;
        }

        .header.home .logo-link,
        .header.home .desktop-nav a,
        .header.home .icon-btn,
        .header.home .btn-secondary {
            color: white;
        }

        .header.home .btn-secondary {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .header.home .btn-secondary:hover {
            background: rgba(255, 255, 255, 0.2);
        }

        /* 2. INNER PAGES & SCROLLED STATE - Adaptive Theme */
        .header.inner,
        .header.home.scrolled,
        .header.open {
            height: 70px;
            background: rgba(250, 249, 246, 0.95); /* Cream with opacity */
            backdrop-filter: blur(16px);
            color: var(--color-forest);
            border-bottom: 1px solid rgba(27, 59, 54, 0.1);
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
        }

        .header.inner .logo-link,
        .header.home.scrolled .logo-link,
        .header.open .logo-link,
        .header.inner .desktop-nav a,
        .header.home.scrolled .desktop-nav a,
        .header.open .desktop-nav a,
        .header.inner .icon-btn,
        .header.home.scrolled .icon-btn,
        .header.open .icon-btn {
            color: var(--color-forest);
        }

        /* Secondary Button in Theme Mode */
        .header.inner .btn-secondary,
        .header.home.scrolled .btn-secondary,
        .header.open .btn-secondary {
            background: transparent;
            color: var(--color-forest);
            border: 1px solid rgba(27, 59, 54, 0.2);
        }

        .header.inner .btn-secondary:hover,
        .header.home.scrolled .btn-secondary:hover,
        .header.open .btn-secondary:hover {
            background: rgba(27, 59, 54, 0.05);
        }

        /* Adjustments for Promo Banner */
        :global(body.promo-visible) .header {
          top: 48px;
        }

        :global(body.promo-visible) .header.inner,
        :global(body.promo-visible) .header.scrolled {
          top: 0;
        }

        .header-content {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          height: 100%;
          gap: 1rem;
        }

        .logo-link {
          text-decoration: none;
          transition: color 0.3s ease;
          display: flex;
          align-items: center;
        }

        .desktop-nav {
          display: none;
          gap: 2.5rem;
          justify-self: center;
        }
        
        .desktop-nav a {
          font-weight: 500;
          text-transform: capitalize;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          opacity: 0.9;
          position: relative;
        }

        .desktop-nav a:hover,
        .desktop-nav a.active {
          color: hsl(var(--primary));
          opacity: 1;
        }

        .desktop-nav a::after {
            content: '';
            position: absolute;
            width: 0;
            height: 2px;
            bottom: -4px;
            left: 0;
            background-color: hsl(var(--primary));
            transition: width 0.3s ease;
        }

        .desktop-nav a:hover::after,
        .desktop-nav a.active::after {
            width: 100%;
        }

        .actions {
          display: flex;
          gap: 0.75rem;
          align-items: center;
          justify-self: end;
        }

        .icon-btn {
          background: none;
          border: none;
          padding: 0.6rem;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.2s ease;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .icon-btn:hover,
        .icon-btn.active {
          color: hsl(var(--primary)) !important; /* Force primary on hover */
          background: rgba(150, 150, 150, 0.1);
          transform: translateY(-1px);
        }

        .btn-primary {
          background: var(--gradient-gold);
          color: #ffffff !important; /* Always white text */
          padding: 0.6rem 1.5rem;
          border-radius: 3rem;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(245, 166, 35, 0.3);
          margin-left: 0.5rem;
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(245, 166, 35, 0.4);
        }

        .btn-secondary {
            padding: 0.5rem 1.2rem;
            border-radius: 3rem;
            font-weight: 500;
            font-size: 0.9rem;
            transition: all 0.3s ease;
            margin-left: 0.5rem;
            text-decoration: none;
            backdrop-filter: blur(4px);
        }

        .btn-secondary:hover {
            transform: translateY(-1px);
        }

        .desktop-only {
          display: none !important;
        }

        @media (min-width: 768px) {
          .desktop-only {
            display: inline-flex !important;
          }
        }

        /* Hamburger Button */
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
          width: 24px;
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

        /* Mobile Menu */
        .mobile-menu {
          position: fixed;
          top: 0;
          right: -100%;
          width: 85%;
          max-width: 320px;
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
          padding-bottom: 1.5rem;
          margin-bottom: 1rem;
          border-bottom: 1px solid hsl(var(--border));
        }

        .mobile-action-btn {
          background: hsl(var(--muted));
          border: none;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          font-size: 0.9rem;
          font-weight: 500;
          color: hsl(var(--foreground));
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }

        .mobile-action-btn:hover {
          background: hsl(var(--border));
        }

        .mobile-nav {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .mobile-nav :global(a) {
          font-size: 1.1rem;
          font-weight: 500;
          color: hsl(var(--foreground));
          padding: 0.875rem 0.5rem;
          border-radius: 0.5rem;
          transition: all 0.2s;
        }

        .mobile-nav :global(a:hover),
        .mobile-nav :global(a.active) {
          color: hsl(var(--primary));
          background: hsl(var(--muted) / 0.5);
        }

        .mobile-divider {
          height: 1px;
          background: hsl(var(--border));
          margin: 0.75rem 0;
        }

        .mobile-nav :global(.mobile-secondary) {
          color: hsl(var(--muted-foreground));
          font-size: 1rem;
        }

        .mobile-nav :global(.mobile-cta) {
          background: linear-gradient(135deg, #f5a623, #d4920a);
          color: #ffffff !important;
          padding: 1rem;
          border-radius: 0.75rem;
          text-align: center;
          margin-top: 1rem;
          font-weight: 600;
          box-shadow: 0 4px 15px rgba(245, 166, 35, 0.3);
        }

        .mobile-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px);
          z-index: 1050;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @media (min-width: 768px) {
          .desktop-nav {
            display: flex;
          }

          .desktop-only {
            display: inline-block;
          }

          .hamburger {
            display: none;
          }

          .mobile-menu,
          .mobile-overlay {
            display: none;
          }
        }

        @media (max-width: 767px) {
          .header.home,
          .header.inner {
            height: 56px;
          }

          .header-content {
            grid-template-columns: 1fr auto;
            padding: 0 1rem;
          }

          .desktop-nav {
            display: none !important;
          }

          .actions {
            gap: 0;
          }

          .hamburger {
            width: 44px;
            height: 44px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .bar {
            width: 22px;
          }

          :global(body.promo-visible) .header {
            top: 0;
          }
        }
      `}</style>
    </>
  );
}


// Force Refresh
