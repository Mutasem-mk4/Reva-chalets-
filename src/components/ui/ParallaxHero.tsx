'use client';

import { useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { WaveDivider, DotPattern, BlobShape } from '@/components/ui/Patterns';

interface ParallaxHeroProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
}

export default function ParallaxHero({ title, subtitle, ctaText, ctaHref }: ParallaxHeroProps) {
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const shape1Ref = useRef<HTMLDivElement>(null);
  const shape2Ref = useRef<HTMLDivElement>(null);
  const currentY = useRef(0);
  const targetY = useRef(0);
  const rafId = useRef<number | null>(null);

  // Smooth interpolation for 120Hz-like feel
  const lerp = (start: number, end: number, factor: number) => {
    return start + (end - start) * factor;
  };

  const animate = useCallback(() => {
    // Smooth interpolation - lower value = smoother but slower response
    currentY.current = lerp(currentY.current, targetY.current, 0.1);

    // Apply transforms with sub-pixel precision
    if (bgRef.current) {
      bgRef.current.style.transform = `translate3d(0, ${currentY.current * 0.2}px, 0)`;
    }
    if (contentRef.current) {
      contentRef.current.style.transform = `translate3d(0, ${currentY.current * 0.4}px, 0)`;
      contentRef.current.style.opacity = String(Math.max(0, 1 - currentY.current / 700));
    }
    if (shape1Ref.current) {
      shape1Ref.current.style.transform = `translate3d(${currentY.current * 0.1}px, ${currentY.current * 0.5}px, 0) rotate(${currentY.current * 0.1}deg)`;
    }
    if (shape2Ref.current) {
      shape2Ref.current.style.transform = `translate3d(${-currentY.current * 0.1}px, ${currentY.current * 0.3}px, 0) rotate(${-currentY.current * 0.2}deg)`;
    }

    // Continue animation loop
    rafId.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      targetY.current = window.scrollY;
    };

    // Start animation loop
    rafId.current = requestAnimationFrame(animate);

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [animate]);

  return (
    <section className="hero-container">
      {/* Background with parallax */}
      <div ref={bgRef} className="hero-bg" />

      {/* Floating Shapes */}
      <div ref={shape1Ref} style={{ position: 'absolute', top: '10%', left: '5%', opacity: 0.1, mixBlendMode: 'soft-light', pointerEvents: 'none', zIndex: 0 }}>
        <BlobShape color="white" style={{ width: '300px', height: '300px' }} />
      </div>
      <div ref={shape2Ref} style={{ position: 'absolute', bottom: '20%', right: '10%', opacity: 0.1, mixBlendMode: 'soft-light', pointerEvents: 'none', zIndex: 0 }}>
        <BlobShape color="white" style={{ width: '400px', height: '400px', transform: 'scale(-1, 1)' }} />
      </div>

      {/* Overlay */}
      <div className="hero-overlay" />

      {/* Content */}
      <div ref={contentRef} className="hero-content">
        <h1>{title}</h1>
        <p>{subtitle}</p>
        <Link
          href={ctaHref}
          className="cta-btn"
        >
          {ctaText}
        </Link>
      </div>

      <WaveDivider position="bottom" color="hsl(var(--background))" style={{ zIndex: 10, height: '100px' }} />
      <DotPattern opacity={0.3} color="rgba(255,255,255,0.4)" style={{ pointerEvents: 'none', mixBlendMode: 'overlay', scale: '1.5' }} />

      <style jsx>{`
        .hero-container {
          position: relative;
          height: 90vh;
          min-height: 600px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.2) 0%,
            rgba(0, 0, 0, 0.4) 50%,
            rgba(0, 0, 0, 0.85) 100%
          );
          z-index: 1;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          text-align: center;
          color: white;
          padding: 2rem;
          max-width: 900px;
          will-change: transform, opacity;
          transform: translateZ(0);
          backface-visibility: hidden;
        }

        h1 {
          font-family: var(--font-serif);
          font-size: 5rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          text-shadow: 0 4px 60px rgba(0, 0, 0, 0.8);
          line-height: 1;
          letter-spacing: var(--tracking-widest);
          text-transform: uppercase;
          color: #ffffff;
        }

        p {
          font-size: 1.25rem;
          margin-bottom: 3rem;
          opacity: 0.95;
          text-shadow: 0 2px 20px rgba(0, 0, 0, 0.8);
          letter-spacing: var(--tracking-luxury);
          text-transform: uppercase;
          font-weight: 300;
          color: #ffffff;
        }

        .cta-btn {
          display: inline-block;
          background: linear-gradient(135deg, #f5a623, #d4920a);
          color: #ffffff;
          padding: 1.25rem 3rem;
          border-radius: 3rem;
          font-size: 1.125rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          text-decoration: none;
          box-shadow: 0 4px 20px rgba(245, 166, 35, 0.5);
          transition: transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                      box-shadow 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .cta-btn:hover {
          transform: translateY(-3px) translateZ(0);
          box-shadow: 0 8px 30px rgba(245, 166, 35, 0.6);
        }

        @media (max-width: 768px) {
          .hero-container {
            height: 75vh;
          }

          h1 {
            font-size: 2.5rem !important;
          }

          p {
            font-size: 1.1rem !important;
          }
        }
      `}</style>

      <style jsx global>{`
        .hero-bg {
          position: absolute;
          inset: -10%;
          background-image: url('/images/chalet-1.png');
          background-size: cover;
          background-position: center;
          will-change: transform;
          transform: translateZ(0);
          backface-visibility: hidden;
        }
      `}</style>
    </section>
  );
}
