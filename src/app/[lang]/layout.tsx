import { redirect } from 'next/navigation';
import { Inter, Cairo, EB_Garamond } from 'next/font/google';
import '@/styles/globals.css';
import { getDictionary } from '@/lib/dictionaries';
import type { Metadata } from 'next';
import { AuthProvider } from '@/lib/auth';
import LayoutWrapper from '@/components/layout/LayoutWrapper';
import Preloader from '@/components/ui/Preloader';
import { ToastProvider } from '@/components/ui/Toast';

// Font setup
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
// Playfair_Display removed — EB_Garamond is the sole serif font
const cairo = Cairo({ subsets: ['arabic'], variable: '--font-cairo' });
const ebGaramond = EB_Garamond({ subsets: ['latin'], variable: '--font-serif', style: ['normal', 'italic'] });

export const metadata: Metadata = {
    title: {
        template: '%s | Riva Chalets',
        default: 'Riva Chalets | حجز شاليهات فاخرة في الأردن',
    },
    description: 'Experience the finest luxury chalets in Jordan. Book your perfect getaway at the Dead Sea, Ajloun, and Jerash with Riva Chalets. احجز شاليهك الآن.',
    keywords: ['Chalets', 'Jordan', 'Luxury Booking', 'Dead Sea', 'Ajloun', 'Jerash', 'Vacation Rental', 'شاليهات', 'الأردن', 'حجز', 'ريفا'],
    authors: [{ name: 'Riva Chalets' }],
    metadataBase: new URL('https://riva-jo.me'),
    openGraph: {
        title: 'Riva Chalets | Luxury Chalets in Jordan',
        description: 'Discover and book premium luxury chalets across Jordan. Dead Sea, Ajloun, Jerash & more.',
        url: 'https://riva-jo.me',
        siteName: 'Riva Chalets',
        images: [
            {
                url: '/images/hero.png',
                width: 1200,
                height: 630,
                alt: 'Riva Chalets - Luxury Getaway in Jordan',
            },
        ],
        locale: 'en_US',
        alternateLocale: 'ar_JO',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Riva Chalets',
        description: 'Luxury Chalets in Jordan - Book Now',
        images: ['/images/hero.png'],
    },
    icons: {
        icon: '/images/logo-en.png',
        shortcut: '/images/logo-en.png',
        apple: '/images/logo-en.png',
    },
    manifest: '/manifest.json',
    themeColor: '#1B3B36',
    other: {
        'apple-mobile-web-app-capable': 'yes',
        'apple-mobile-web-app-status-bar-style': 'black-translucent',
    },
    robots: {
        index: true,
        follow: true,
    },
};

// export async function generateStaticParams() {
//    return [{ lang: 'en' }, { lang: 'ar' }];
// }

import GoogleAnalytics from '@/components/features/GoogleAnalytics';

// ... (imports)

export default async function RootLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const dict = getDictionary(lang);
    const dir = lang === 'ar' ? 'rtl' : 'ltr';

    return (
        <html lang={lang} dir={dir} data-theme="light">
            <body className={`${inter.variable} ${ebGaramond.variable} ${cairo.className}`}>
                <GoogleAnalytics GA_MEASUREMENT_ID="G-PLACEHOLDER" />

                {/* Skip to content link for accessibility */}
                <a href="#main-content" className="skip-to-content">
                    Skip to content
                </a>

                <AuthProvider>
                    <ToastProvider>
                        <Preloader>
                            <LayoutWrapper lang={lang} dict={dict}>
                                <div id="main-content">
                                    {children}
                                </div>
                            </LayoutWrapper>
                        </Preloader>
                    </ToastProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
