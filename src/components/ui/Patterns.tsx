'use client';
import { CSSProperties } from 'react';

// ═══════════════════════════════════════════════════════════════
// DECORATIVE PATTERNS & DIVIDERS
// ═══════════════════════════════════════════════════════════════

interface PatternProps {
    className?: string;
    style?: CSSProperties;
    opacity?: number;
    color?: string;
}

// 1. Subtle Dot Grid Pattern
export const DotPattern = ({ className = '', style, opacity = 0.5, color = 'currentColor' }: PatternProps) => (
    <div className={`dot-pattern ${className}`} style={{ ...style, opacity }}>
        <svg width="100%" height="100%" aria-hidden="true">
            <defs>
                <pattern
                    id="dot-grid"
                    width="20"
                    height="20"
                    patternUnits="userSpaceOnUse"
                >
                    <circle cx="2" cy="2" r="1" fill={color} />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dot-grid)" />
        </svg>
        <style jsx>{`
            .dot-pattern {
                position: absolute;
                inset: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
            }
        `}</style>
    </div>
);

// 2. Elegant Wave Divider
export const WaveDivider = ({ className = '', style, color = 'currentColor', position = 'bottom' }: PatternProps & { position?: 'top' | 'bottom' }) => (
    <div className={`wave-divider ${position} ${className}`} style={style}>
        <svg
            className="wave-svg"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
        >
            <path
                d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                fill={color}
            ></path>
        </svg>
        <style jsx>{`
            .wave-divider {
                position: absolute;
                left: 0;
                width: 100%;
                overflow: hidden;
                line-height: 0;
                z-index: 1;
            }
            .wave-divider.top {
                top: 0;
            }
            .wave-divider.bottom {
                bottom: 0;
                transform: rotate(180deg);
            }
            .wave-svg {
                display: block;
                width: 100%;
                height: 60px;
            }
            @media (min-width: 768px) {
                .wave-svg {
                    height: 120px;
                }
            }
        `}</style>
    </div>
);

// 3. Curve Divider (Smooth Arc)
export const CurveDivider = ({ className = '', style, color = 'currentColor', position = 'bottom' }: PatternProps & { position?: 'top' | 'bottom' }) => (
    <div className={`section-divider curve ${position} ${className}`} style={style}>
        <svg
            className="divider-svg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
        >
            <path
                d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
                opacity=".25"
                fill={color}
            ></path>
            <path
                d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
                opacity=".5"
                fill={color}
            ></path>
            <path
                d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
                fill={color}
            ></path>
        </svg>
        <style jsx>{`
            .section-divider {
                position: absolute;
                left: 0;
                width: 100%;
                overflow: hidden;
                line-height: 0;
                z-index: 1;
            }
            .section-divider.top {
                top: 0;
            }
            .section-divider.bottom {
                bottom: 0;
                transform: rotate(180deg);
            }
            .divider-svg {
                display: block;
                width: 100%;
                height: 60px;
            }
            @media (min-width: 768px) {
                .divider-svg {
                    height: 120px;
                }
            }
        `}</style>
    </div>
);

// 4. Tilt Divider (Sharp Angle)
export const TiltDivider = ({ className = '', style, color = 'currentColor', position = 'bottom' }: PatternProps & { position?: 'top' | 'bottom' }) => (
    <div className={`section-divider tilt ${position} ${className}`} style={style}>
        <svg
            className="divider-svg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
        >
            <path
                d="M1200 120L0 16.48 0 0 1200 0 1200 120z"
                fill={color}
            ></path>
        </svg>
        <style jsx>{`
            .section-divider {
                position: absolute;
                left: 0;
                width: 100%;
                overflow: hidden;
                line-height: 0;
                z-index: 1;
            }
            .section-divider.top {
                top: 0;
            }
            .section-divider.bottom {
                bottom: 0;
                transform: rotate(180deg);
            }
            .divider-svg {
                display: block;
                width: 100%;
                height: 60px;
            }
            @media (min-width: 768px) {
                .divider-svg {
                    height: 120px;
                }
            }
        `}</style>
    </div>
);

// 5. ZigZag Divider (Spiky)
export const ZigZagDivider = ({ className = '', style, color = 'currentColor', position = 'bottom' }: PatternProps & { position?: 'top' | 'bottom' }) => (
    <div className={`section-divider zigzag ${position} ${className}`} style={style}>
        <svg
            className="divider-svg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
        >
            <path
                d="M1200 120L0 120 0 0 
                30 0 60 40 90 0 120 40 150 0 180 40 210 0 240 40 270 0 300 40 
                330 0 360 40 390 0 420 40 450 0 480 40 510 0 540 40 570 0 600 40 
                630 0 660 40 690 0 720 40 750 0 780 40 810 0 840 40 870 0 900 40 
                930 0 960 40 990 0 1020 40 1050 0 1080 40 1110 0 1140 40 1170 0 1200 40 
                1200 120z"
                fill={color}
            ></path>
        </svg>
        <style jsx>{`
            .section-divider {
                position: absolute;
                left: 0;
                width: 100%;
                overflow: hidden;
                line-height: 0;
                z-index: 1;
            }
            .section-divider.top {
                top: 0;
            }
            .section-divider.bottom {
                bottom: 0;
                transform: rotate(180deg);
            }
            .divider-svg {
                display: block;
                width: 100%;
                height: 60px;
            }
            @media (min-width: 768px) {
                .divider-svg {
                    height: 120px;
                }
            }
        `}</style>
    </div>
);

// 6. Arrow Divider (Central Pointer)
export const ArrowDivider = ({ className = '', style, color = 'currentColor', position = 'bottom' }: PatternProps & { position?: 'top' | 'bottom' }) => (
    <div className={`section-divider arrow ${position} ${className}`} style={style}>
        <svg
            className="divider-svg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
        >
            <path
                d="M600 120L0 0 1200 0 600 120z"
                fill={color}
            ></path>
        </svg>
        <style jsx>{`
            .section-divider {
                position: absolute;
                left: 0;
                width: 100%;
                overflow: hidden;
                line-height: 0;
                z-index: 1;
            }
            .section-divider.top {
                top: 0;
            }
            .section-divider.bottom {
                bottom: 0;
                transform: rotate(180deg);
            }
            .divider-svg {
                display: block;
                width: 100%;
                height: 60px;
            }
            @media (min-width: 768px) {
                .divider-svg {
                    height: 120px;
                }
            }
        `}</style>
    </div>
);

// 7. Grid Lines (Architectural feel)
export const GridPattern = ({ className = '', style, opacity = 0.05 }: PatternProps) => (
    <svg
        className={`grid-pattern ${className}`}
        style={{ ...style, opacity }}
        xmlns="http://www.w3.org/2000/svg"
    >
        <defs>
            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-pattern)" />

        <style jsx>{`
            .grid-pattern {
                position: absolute;
                inset: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
            }
        `}</style>
    </svg>
);

// 4. Abstract Blob Shape (for Hero/Cards)
export const BlobShape = ({ className = '', style, color = 'currentColor' }: PatternProps) => (
    <div className={`blob-shape ${className}`} style={style}>
        <svg
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fill={color}
                d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-5.3C93.5,8.6,82.2,21.5,70.6,32.4C59,43.3,47.1,52.2,34.5,59.3C21.9,66.4,8.6,71.7,-3.5,77.8C-15.6,83.9,-26.5,90.8,-36.8,86.2C-47.1,81.6,-56.9,65.5,-65.4,50.7C-73.9,35.9,-81.1,22.4,-80.6,9.1C-80.1,-4.2,-71.9,-17.3,-62.7,-29.4C-53.5,-41.5,-43.3,-52.6,-31.6,-61.2C-19.9,-69.8,-6.7,-75.9,5.7,-85.8L18.1,-95.7"
                transform="translate(100 100)"
            />
        </svg>
        <style jsx>{`
            .blob-shape {
                position: absolute;
                width: 300px;
                height: 300px;
                z-index: 0;
            }
        `}</style>
    </div>
);
