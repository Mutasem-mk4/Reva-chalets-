'use client';

import { useEffect } from 'react';
import StickyPriceBar from './StickyPriceBar';

interface StickyPriceBarWrapperProps {
    chaletName: string;
    price: number;
    rating: number;
}

export default function StickyPriceBarWrapper({ chaletName, price, rating }: StickyPriceBarWrapperProps) {
    const handleBookClick = () => {
        // Scroll to booking form
        const bookingForm = document.querySelector('[class*="bookingCard"]');
        if (bookingForm) {
            bookingForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            // Fallback - scroll to a reasonable position
            window.scrollTo({ top: 600, behavior: 'smooth' });
        }
    };

    return (
        <StickyPriceBar
            chaletName={chaletName}
            price={price}
            rating={rating}
            onBookClick={handleBookClick}
        />
    );
}
