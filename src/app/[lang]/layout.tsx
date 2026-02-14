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

import type { Viewport } from 'next';

export const viewport: Viewport = {
    themeColor: '#1B3B36',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    const isAr = lang === 'ar';

    return {
        metadataBase: new URL('https://riva-jo.me'),
        title: {
            template: isAr ? '%s | ريفا شاليهات' : '%s | Riva Chalets',
            default: isAr
                ? 'ريفا شاليهات | حجز شاليهات فاخرة في الأردن'
                : 'Riva Chalets | Book Luxury Chalets in Jordan',
        },
        description: isAr
            ? 'استمتع بأفخم الشاليهات في الأردن. احجز عطلتك المثالية في البحر الميت، عجلون، وجرش مع ريفا شاليهات.'
            : 'Experience the finest luxury chalets in Jordan. Book your perfect getaway at the Dead Sea, Ajloun, and Jerash with Riva Chalets.',
        keywords: isAr
            ? ['شاليهات', 'الأردن', 'حجز', 'البحر الميت', 'عجلون', 'جرش', 'إقامة فاخرة', 'مسبح خاص', 'ريفا']
            : ['Chalets', 'Jordan', 'Luxury Booking', 'Dead Sea', 'Ajloun', 'Jerash', 'Vacation Rental', 'Private Pool', 'Riva'],
        authors: [{ name: 'Riva Chalets' }],
        openGraph: {
            title: isAr ? 'ريفا شاليهات | فخامة لا تضاهى' : 'Riva Chalets | Luxury Chalets in Jordan',
            description: isAr
                ? 'اكتشف واحجز أفضل الشاليهات الفاخرة في الأردن.'
                : 'Discover and book premium luxury chalets across Jordan.',
            url: `https://riva-jo.me/${lang}`,
            siteName: 'Riva Chalets',
            locale: isAr ? 'ar_JO' : 'en_US',
            alternateLocale: isAr ? 'en_US' : 'ar_JO',
            type: 'website',
            images: [
                {
                    url: '/images/hero.png',
                    width: 1200,
                    height: 630,
                    alt: isAr ? 'ريفا شاليهات - الأردن' : 'Riva Chalets - Jordan',
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: isAr ? 'ريفا شاليهات' : 'Riva Chalets',
            description: isAr ? 'حجز شاليهات فاخرة في الأردن' : 'Luxury Chalets in Jordan',
            images: ['/images/hero.png'],
        },
        icons: {
            icon: '/images/logo-en.png',
            shortcut: '/images/logo-en.png',
            apple: '/images/logo-en.png',
        },
        manifest: '/manifest.json',
        other: {
            'apple-mobile-web-app-capable': 'yes',
            'apple-mobile-web-app-status-bar-style': 'black-translucent',
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
    };
}

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
