'use client';

import { SVGProps } from 'react';

// Base props for all icons
interface IconProps extends SVGProps<SVGSVGElement> {
    size?: number;
}

// Helper to create icon components with consistent styling
const createIcon = (path: React.ReactNode, viewBox = '0 0 24 24') => {
    const IconComponent = ({ size = 20, className = '', ...props }: IconProps) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox={viewBox}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            {...props}
        >
            {path}
        </svg>
    );
    IconComponent.displayName = 'Icon';
    return IconComponent;
};

// ═══════════════════════════════════════════════════════════════
// NAVIGATION ICONS
// ═══════════════════════════════════════════════════════════════

export const ArrowLeft = createIcon(
    <>
        <path d="M19 12H5" />
        <path d="M12 19l-7-7 7-7" />
    </>
);

export const Home = createIcon(
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2zM9 22V12h6v10" />
);

export const ArrowRight = createIcon(
    <>
        <path d="M5 12h14" />
        <path d="M12 5l7 7-7 7" />
    </>
);

export const ChevronDown = createIcon(
    <path d="M6 9l6 6 6-6" />
);

export const ChevronUp = createIcon(
    <path d="M18 15l-6-6-6 6" />
);

export const ChevronRight = createIcon(
    <path d="M9 18l6-6-6-6" />
);

export const ChevronLeft = createIcon(
    <path d="M15 18l-6-6 6-6" />
);

// ═══════════════════════════════════════════════════════════════
// THEME ICONS
// ═══════════════════════════════════════════════════════════════

export const Sun = createIcon(
    <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="M4.93 4.93l1.41 1.41" />
        <path d="M17.66 17.66l1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="M6.34 17.66l-1.41 1.41" />
        <path d="M19.07 4.93l-1.41 1.41" />
    </>
);

export const Moon = createIcon(
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
);

// ═══════════════════════════════════════════════════════════════
// USER ICONS
// ═══════════════════════════════════════════════════════════════

export const User = createIcon(
    <>
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </>
);

export const Users = createIcon(
    <>
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
    </>
);

// ═══════════════════════════════════════════════════════════════
// RATING & FEEDBACK ICONS
// ═══════════════════════════════════════════════════════════════

export const Star = createIcon(
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
);

export const StarFilled = ({ size = 20, className = '', color = 'currentColor', ...props }: IconProps & { color?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={color}
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...props}
    >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
);

// ═══════════════════════════════════════════════════════════════
// LOCATION ICONS
// ═══════════════════════════════════════════════════════════════

export const MapPin = createIcon(
    <>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
    </>
);

export const Map = createIcon(
    <>
        <path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z" />
        <path d="M8 2v16" />
        <path d="M16 6v16" />
    </>
);

// ═══════════════════════════════════════════════════════════════
// COMMUNICATION ICONS
// ═══════════════════════════════════════════════════════════════

export const Phone = createIcon(
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
);

export const Email = createIcon(
    <>
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <path d="M22 6l-10 7L2 6" />
    </>
);

export const MessageCircle = createIcon(
    <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
);

export const MessageSquare = createIcon(
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
);

export const Send = createIcon(
    <>
        <path d="M22 2L11 13" />
        <path d="M22 2l-7 20-4-9-9-4 20-7z" />
    </>
);

// ═══════════════════════════════════════════════════════════════
// PAYMENT ICONS
// ═══════════════════════════════════════════════════════════════

export const CreditCard = createIcon(
    <>
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <path d="M1 10h22" />
    </>
);

export const Wallet = createIcon(
    <>
        <path d="M21 12.5V17a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v.5" />
        <path d="M21 12.5v3h-4a2 2 0 010-4h4v1z" />
        <circle cx="17" cy="14" r="1" fill="currentColor" stroke="none" />
    </>
);

// Simplified payment brand icons
export const Visa = ({ size = 20, className = '', ...props }: IconProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        {...props}
    >
        <rect x="1" y="4" width="22" height="16" rx="2" fill="#1A1F71" />
        <path d="M9.5 15.5L11 8.5H13L11.5 15.5H9.5Z" fill="white" />
        <path d="M17.5 8.7C17 8.5 16.2 8.3 15.3 8.3C13.3 8.3 11.9 9.3 11.9 10.8C11.9 11.9 12.9 12.5 13.7 12.9C14.5 13.3 14.8 13.5 14.8 13.9C14.8 14.5 14.1 14.7 13.4 14.7C12.5 14.7 12 14.5 11.2 14.2L10.9 14.1L10.6 16C11.3 16.3 12.4 16.5 13.6 16.5C15.7 16.5 17.1 15.5 17.1 13.9C17.1 13 16.5 12.3 15.3 11.8C14.6 11.4 14.1 11.2 14.1 10.7C14.1 10.3 14.5 9.9 15.4 9.9C16.1 9.9 16.7 10 17.1 10.2L17.3 10.3L17.5 8.7Z" fill="white" />
        <path d="M20.5 8.5H19C18.5 8.5 18.1 8.7 17.9 9.2L15 15.5H17.1L17.5 14.4H20.1L20.3 15.5H22.2L20.5 8.5ZM18.1 12.8C18.3 12.3 19.1 10.3 19.1 10.3C19.1 10.3 19.3 9.8 19.4 9.4L19.6 10.2C19.6 10.2 20.1 12.4 20.2 12.8H18.1Z" fill="white" />
        <path d="M7.5 8.5L5.5 13.5L5.3 12.4C4.9 11.2 3.8 9.8 2.5 9.1L4.3 15.5H6.4L9.6 8.5H7.5Z" fill="white" />
        <path d="M4.5 8.5H1.3L1.3 8.7C3.7 9.3 5.3 10.8 5.9 12.6L5.2 9.2C5.1 8.7 4.7 8.5 4.5 8.5Z" fill="#F9A51A" />
    </svg>
);

export const Mastercard = ({ size = 20, className = '', ...props }: IconProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        {...props}
    >
        <rect x="1" y="4" width="22" height="16" rx="2" fill="#1A1A1A" />
        <circle cx="9" cy="12" r="5" fill="#EB001B" />
        <circle cx="15" cy="12" r="5" fill="#F79E1B" />
        <path d="M12 8.5C13.3 9.5 14 11.2 14 12C14 12.8 13.3 14.5 12 15.5C10.7 14.5 10 12.8 10 12C10 11.2 10.7 9.5 12 8.5Z" fill="#FF5F00" />
    </svg>
);

// ═══════════════════════════════════════════════════════════════
// SECURITY ICONS
// ═══════════════════════════════════════════════════════════════

export const Lock = createIcon(
    <>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
    </>
);

export const Shield = createIcon(
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
);

export const ShieldCheck = createIcon(
    <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
    </>
);

// ═══════════════════════════════════════════════════════════════
// STATUS ICONS
// ═══════════════════════════════════════════════════════════════

export const Check = createIcon(
    <path d="M20 6L9 17l-5-5" />
);

export const CheckCircle = createIcon(
    <>
        <circle cx="12" cy="12" r="10" />
        <path d="M9 12l2 2 4-4" />
    </>
);

export const X = createIcon(
    <>
        <path d="M18 6L6 18" />
        <path d="M6 6l12 12" />
    </>
);

export const XCircle = createIcon(
    <>
        <circle cx="12" cy="12" r="10" />
        <path d="M15 9l-6 6" />
        <path d="M9 9l6 6" />
    </>
);

// ═══════════════════════════════════════════════════════════════
// ACTION & STATUS ICONS
// ═══════════════════════════════════════════════════════════════

export const Fire = createIcon(
    <path d="M12 22c4-2 7-5 7-10 0-3-2-5-2-5s-1 2-3 2c-1 0-2-1-2-2 0-2 2-4 2-6 0-1-1.5 0-3 1-3 2-5 5-5 10 0 5 3 8 6 10z" fill="currentColor" stroke="currentColor" />
);

export const Lightning = createIcon(
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor" stroke="currentColor" />
);

export const Clock = createIcon(
    <>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
    </>
);

export const Sparkles = createIcon(
    <>
        <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" fill="currentColor" stroke="currentColor" />
        <path d="M5 19l.5 1.5L7 21l-1.5.5L5 23l-.5-1.5L3 21l1.5-.5L5 19z" fill="currentColor" stroke="currentColor" />
        <path d="M19 5l.5 1.5L21 7l-1.5.5L19 9l-.5-1.5L17 7l1.5-.5L19 5z" fill="currentColor" stroke="currentColor" />
    </>
);

export const Eye = createIcon(
    <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </>
);

export const Calendar = createIcon(
    <>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <path d="M16 2v4" />
        <path d="M8 2v4" />
        <path d="M3 10h18" />
    </>
);

export const Heart = createIcon(
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
);

export const HeartFilled = createIcon(
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" fill="currentColor" />
);

export const Lightbulb = createIcon(
    <>
        <path d="M9 18h6" />
        <path d="M10 22h4" />
        <path d="M12 2a7 7 0 00-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 001 1h6a1 1 0 001-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 00-7-7z" />
    </>
);

export const Plus = createIcon(
    <>
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </>
);

export const Minus = createIcon(
    <line x1="5" y1="12" x2="19" y2="12" />
);

export const HelpCircle = createIcon(
    <>
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
    </>
);

export const Gift = createIcon(
    <path d="M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zm0 0h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" />
);

export const Headphones = createIcon(
    <>
        <path d="M3 18v-6a9 9 0 0118 0v6" />
        <path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z" />
    </>
);

export const Handshake = createIcon(
    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
);

export const Edit = createIcon(
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
);

export const Trash = createIcon(
    <>
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
        <line x1="10" y1="11" x2="10" y2="17" />
        <line x1="14" y1="11" x2="14" y2="17" />
    </>
);

export const TrendingUp = createIcon(
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
);

export const DollarSign = createIcon(
    <>
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
    </>
);

export const Trophy = createIcon(
    <path d="M6 9H4.5a2.5 2.5 0 010-5H6M18 9h1.5a2.5 2.5 0 000-5H18M4 22h16M10 14.66V17c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-2.34M12 14.66A6 6 0 016 9V4h12v5a6 6 0 01-6 5.66z" />
);

export const Globe = createIcon(
    <>
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </>
);

export const FileText = createIcon(
    <>
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
    </>
);

export const Camera = createIcon(
    <>
        <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V7a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
        <circle cx="12" cy="13" r="4" />
    </>
);

export const Plane = createIcon(
    <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3.5s-2.5 0-4 1.5L13.5 8.5 5.3 6.7c-1.1-.3-2.1.4-2.1 1.5l.3 1.9 6.2 3.1-4.7 4.7-2.9-.3-.5.5 2.1 2.1 2.1 2.1.5-.5-.3-2.9 4.7-4.7 3.1 6.2 1.9.3c1 .1 1.8-.9 1.5-2.1z" />
);

// ═══════════════════════════════════════════════════════════════
// DEFAULT EXPORT - ALL ICONS
// ═══════════════════════════════════════════════════════════════

const Icons = {
    ArrowLeft,
    ArrowRight,
    ChevronDown,
    ChevronUp,
    ChevronRight,
    ChevronLeft,
    Sun,
    Moon,
    User,
    Users,
    Star,
    StarFilled,
    MapPin,
    Map,
    Phone,
    Email,
    MessageCircle,
    MessageSquare,
    Send,
    CreditCard,
    Wallet,
    Visa,
    Mastercard,
    Lock,
    Shield,
    ShieldCheck,
    Check,
    CheckCircle,
    X,
    XCircle,
    Fire,
    Lightning,
    Clock,
    Sparkles,
    Eye,
    Calendar,
    Heart,
    HeartFilled,
    Lightbulb,
    Plus,
    Minus,
    HelpCircle,
    Gift,
    Headphones,
    Handshake,
    Home,
    Edit,
    Trash,
    TrendingUp,
    DollarSign,
    Trophy,
    Globe,
    FileText,
    Camera,
    Plane,
};

export default Icons;
