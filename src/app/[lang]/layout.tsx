import { redirect } from 'next/navigation';
import { Inter, Playfair_Display, Cairo } from 'next/font/google';
import '@/styles/globals.css';
import { getDictionary } from '@/lib/dictionaries';
import type { Metadata } from 'next';
import { AuthProvider } from '@/lib/auth';
import LayoutWrapper from '@/components/layout/LayoutWrapper';
import Preloader from '@/components/ui/Preloader';
import { ToastProvider } from '@/components/ui/Toast';

// Font setup
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });
const cairo = Cairo({ subsets: ['arabic'], variable: '--font-cairo' });

export const metadata: Metadata = {
    title: {
        template: '%s | Reva Chalets',
        default: 'Reva Chalets | Luxury Booking in Jordan',
    },
    description: 'Experience the finest luxury chalets in Jordan. Book your perfect getaway at the Dead Sea, Petra, and Aqaba with Reva Chalets.',
    keywords: ['Chalets', 'Jordan', 'Luxury Booking', 'Dead Sea', 'Petra', 'Vacation Rental'],
    authors: [{ name: 'Reva Chalets Team' }],
    openGraph: {
        title: 'Reva Chalets | Luxury Booking in Jordan',
        description: 'Experience the finest luxury chalets in Jordan.',
        url: 'https://reva-chalets.com',
        siteName: 'Reva Chalets',
        images: [
            {
                url: '/images/og-image.jpg',
                width: 1200,
                height: 630,
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Reva Chalets',
        description: 'Luxury Chalets in Jordan',
    },
};

// export async function generateStaticParams() {
//    return [{ lang: 'en' }, { lang: 'ar' }];
// }

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
            <body className={`${inter.variable} ${playfair.variable} ${cairo.className}`}>
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
