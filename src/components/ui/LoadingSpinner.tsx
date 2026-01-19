'use client';

interface LoadingSpinnerProps {
    size?: number;
    color?: string;
    className?: string;
    fullScreen?: boolean;
}

export default function LoadingSpinner({
    size = 40,
    color = 'currentColor',
    className = '',
    fullScreen = false
}: LoadingSpinnerProps) {

    const Spinner = () => (
        <svg
            width={size}
            height={size}
            viewBox="0 0 50 50"
            xmlns="http://www.w3.org/2000/svg"
            className={`spinner ${className}`}
            style={{ color }}
        >
            <circle
                className="path-bg"
                cx="25"
                cy="25"
                r="20"
                fill="none"
                strokeWidth="4"
            />
            <circle
                className="path"
                cx="25"
                cy="25"
                r="20"
                fill="none"
                strokeWidth="4"
            />
            <style jsx>{`
        .spinner {
          animation: rotate 2s linear infinite;
        }
        
        .path-bg {
          stroke: currentColor;
          opacity: 0.1;
        }

        .path {
          stroke: currentColor;
          stroke-linecap: round;
          animation: dash 1.5s ease-in-out infinite;
        }

        @keyframes rotate {
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes dash {
          0% {
            stroke-dasharray: 1, 150;
            stroke-dashoffset: 0;
          }
          50% {
            stroke-dasharray: 90, 150;
            stroke-dashoffset: -35;
          }
          100% {
            stroke-dasharray: 90, 150;
            stroke-dashoffset: -124;
          }
        }
      `}</style>
        </svg>
    );

    if (fullScreen) {
        return (
            <div className="fullscreen-loader">
                <Spinner />
                <style jsx>{`
          .fullscreen-loader {
            position: fixed;
            inset: 0;
            background: hsl(var(--background) / 0.8);
            backdrop-filter: blur(8px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
          }
        `}</style>
            </div>
        );
    }

    return <Spinner />;
}
