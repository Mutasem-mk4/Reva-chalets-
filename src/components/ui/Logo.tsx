'use client';

interface LogoProps {
  className?: string;
  animated?: boolean;
  showText?: boolean;
}

export default function Logo({ className = '', animated = false, showText = true }: LogoProps) {
  return (
    <div className={`logo-container flex items-center gap-2 ${className}`}>
      <svg
        width="40"
        height="40"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`logo-mark ${animated ? 'animate-logo' : ''}`}
      >
        {/* Sun / Moon circle background */}
        <circle cx="50" cy="50" r="45" className="logo-bg" fill="currentColor" opacity="0.1" />

        {/* Mountain Peaks - Minimalist */}
        <path
          d="M20 70 L50 30 L80 70"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mountain-path"
        />

        {/* Water / Reflection */}
        <path
          d="M30 80 Q50 90 70 80"
          stroke="#f5a623"
          strokeWidth="6"
          strokeLinecap="round"
          className="water-path"
        />

        {/* Sun accent */}
        <circle cx="50" cy="25" r="6" fill="#f5a623" className="sun-dot" />
      </svg>

      {showText && (
        <span className="logo-text font-serif text-xl font-bold tracking-tight">
          Reva<span className="text-accent">.</span>
        </span>
      )}

      <style jsx>{`
        .logo-text {
          color: inherit;
        }
        
        .text-accent {
          color: #f5a623;
        }

        /* Hover effect */
        .logo-container:hover .logo-bg {
          opacity: 0.2;
          transition: opacity 0.3s ease;
        }

        .logo-container:hover .water-path {
           transform: scaleX(1.1);
           transform-origin: center;
           transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .logo-container:hover .sun-dot {
           transform: translateY(-2px);
           transition: transform 0.3s ease;
        }

        /* Initial Entrance Animation */
        :global(.animate-logo) .mountain-path {
          stroke-dasharray: 200;
          stroke-dashoffset: 200;
          animation: drawPath 1.5s ease-out forwards;
        }
        
        :global(.animate-logo) .water-path {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: drawPath 1.2s ease-out 0.5s forwards;
          opacity: 0;
        }
        
        :global(.animate-logo) .sun-dot {
          opacity: 0;
          transform: translateY(10px);
          animation: fadeUp 0.5s ease-out 1.2s forwards;
        }

        @keyframes drawPath {
          to {
            stroke-dashoffset: 0;
            opacity: 1;
          }
        }
        
        @keyframes fadeUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
