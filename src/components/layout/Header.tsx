'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Sun, Moon, User } from '@/components/ui/Icons';
import Logo from '@/components/ui/Logo';

// Default dictionary values as fallback
const defaultDict = {
  nav: { home: 'Home', chalets: 'Chalets', about: 'About', contact: 'Contact', bookNow: 'Book Now' },
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
      <header className={`header ${scrolled || !isHomePage ? 'scrolled' : ''} ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="container header-content">
          <Link href={`/${lang}`} className="logo-link">
            <Logo animated={true} />
          </Link>

          {/* Desktop Nav - Simplified */}
          <nav className="desktop-nav">
            <Link href={`/${lang}`}>{dict.nav.home}</Link>
            <Link href={`/${lang}/about`}>{dict.nav.about}</Link>
            <Link href={`/${lang}/contact`}>{dict.nav.contact}</Link>
          </nav>

          <div className="actions">
            <button onClick={switchLanguage} className="icon-btn" aria-label={lang === 'en' ? 'Switch to Arabic' : 'Switch to English'}>
              {lang === 'en' ? 'عربي' : 'English'}
            </button>

            <button onClick={toggleTheme} className="icon-btn" aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <Link href={`/${lang}/dashboard/profile`} className="icon-btn guest-icon" aria-label="My Profile">
              <User size={18} />
            </Link>

            <Link href={`/${lang}/chalets`} className="btn-primary desktop-only">
              {dict.nav.bookNow}
            </Link>

            {/* Mobile Menu Button */}
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
        <nav className="mobile-nav">
          <Link href={`/${lang}`}>{dict.nav.home}</Link>
          <Link href={`/${lang}/chalets`}>{dict.nav.chalets}</Link>
          <Link href={`/${lang}/about`}>{dict.nav.about}</Link>
          <Link href={`/${lang}/contact`}>{dict.nav.contact}</Link>
          <Link href={`/${lang}/guest/wallet`}>My Wallet</Link>
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
          height: 80px; /* Fixed Height */
          background: transparent;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          border-bottom: 1px solid transparent;
          display: flex;
          align-items: center;
        }

        :global(body.promo-visible) .header {
          top: 48px;
        }

        :global(body.promo-visible) .header.scrolled {
          top: 0;
        }

        .header.scrolled {
          background: hsl(var(--background) / 0.85);
          backdrop-filter: blur(16px);
          height: 70px; /* Slightly smaller on scroll */
          border-bottom: 1px solid hsl(var(--border) / 0.3);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
        }
        
        .header.open {
           background: hsl(var(--background));
           color: hsl(var(--foreground));
        }

        .header.open .desktop-nav a,
        .header.open .icon-btn {
          color: hsl(var(--foreground));
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
        }

        .logo-link {
          text-decoration: none;
          color: white; /* Initial state over dark hero */
          transition: color 0.3s ease;
          display: flex;
          align-items: center;
        }

        .header.scrolled .logo-link,
        .header.open .logo-link {
          color: hsl(var(--foreground));
        }

        .desktop-nav {
          display: none;
          gap: 2.5rem; /* Increased spacing for cleaner look */
        }
        
        .desktop-nav a {
          font-weight: 500;
          text-transform: capitalize; /* Cleaner than uppercase */
          font-size: 0.95rem;
          color: inherit;
          transition: all 0.3s ease;
          opacity: 0.9;
          position: relative;
        }

        .desktop-nav a:hover {
          color: hsl(var(--primary));
          opacity: 1;
        }

        /* Hover underline effect */
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

        .desktop-nav a:hover::after {
            width: 100%;
        }

        .header {
          color: white; /* Default for transparent over hero */
        }

        .header.scrolled,
        .header.open {
          color: hsl(var(--foreground));
        }

        .actions {
          display: flex;
          gap: 0.5rem; /* Reduced gap */
          align-items: center;
        }

        .icon-btn {
          background: none;
          border: none;
          padding: 0.5rem;
          font-size: 1rem;
          color: inherit;
          cursor: pointer;
          transition: transform 0.2s ease, color 0.2s;
          border-radius: 50%;
        }

        .icon-btn:hover {
          color: hsl(var(--primary));
          background: rgba(255,255,255,0.1);
          transform: translateY(-1px);
        }
        
        .header.scrolled .icon-btn:hover {
             background: hsl(var(--muted));
        }

        .btn-primary {
          background: var(--gradient-gold);
          color: #ffffff;
          padding: 0.6rem 1.5rem; /* Smaller, leaner button */
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

        .desktop-only {
          display: none;
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
          width: 80%;
          max-width: 320px;
          height: 100vh;
          background: hsl(var(--background));
          z-index: 105;
          transition: right 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          padding: 6rem 2rem 2rem;
          box-shadow: -10px 0 30px rgba(0,0,0,0.1);
        }

        .mobile-menu.open {
          right: 0;
        }

        .mobile-nav {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .mobile-nav :global(a) {
          font-size: 1.25rem;
          font-weight: 500;
          color: hsl(var(--foreground));
          transition: color 0.2s;
        }

        .mobile-nav :global(a:hover) {
          color: #f5a623;
        }

        .mobile-nav :global(.mobile-cta) {
          background: linear-gradient(135deg, #f5a623, #d4920a);
          color: #ffffff;
          padding: 1rem;
          border-radius: 3rem;
          text-align: center;
          margin-top: 1rem;
          font-weight: 600;
          box-shadow: 0 4px 15px rgba(245, 166, 35, 0.3);
        }

        .mobile-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.4);
          backdrop-filter: blur(4px);
          z-index: 102;
          animation: fadeIn 0.3s ease;
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
      `}</style>
    </>
  );
}


// Force Refresh
