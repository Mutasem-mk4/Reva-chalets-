'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingSupport from '@/components/features/FloatingSupport';
import BackToTop from '@/components/ui/BackToTop';
import PromoBanner from '@/components/features/PromoBanner';
import ExitIntentPopup from '@/components/marketing/ExitIntentPopup';

interface LayoutWrapperProps {
    children: ReactNode;
    lang: string;
    dict: any;
}

export default function LayoutWrapper({ children, lang, dict }: LayoutWrapperProps) {
    const pathname = usePathname();

    // Check if we're on an auth page
    const isAuthPage = pathname?.includes('/auth/');
    const isBookingResultPage = pathname?.includes('/booking/success') || pathname?.includes('/booking/cancel');

    // Don't show main layout components on auth pages
    const showMainLayout = !isAuthPage && !isBookingResultPage;

    if (!showMainLayout) {
        // Minimal layout for auth pages
        return (
            <>
                {children}
            </>
        );
    }

    // Full layout for regular pages
    return (
        <>
            <PromoBanner />
            <Header lang={lang} dict={dict} />
            <main style={{ flex: 1 }}>{children}</main>
            <FloatingSupport />
            <BackToTop />
            <ExitIntentPopup />
            <Footer lang={lang} dict={dict} />
        </>
    );
}
