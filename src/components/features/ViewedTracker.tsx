'use client';

import { useEffect } from 'react';
import { useRecentlyViewed } from './RecentlyViewed';

interface ViewedTrackerProps {
    chaletId: string;
    chaletName: string;
    chaletImage: string;
    chaletPrice: number;
}

export default function ViewedTracker({ chaletId, chaletName, chaletImage, chaletPrice }: ViewedTrackerProps) {
    const { addViewed } = useRecentlyViewed();

    useEffect(() => {
        addViewed({
            id: chaletId,
            name: chaletName,
            image: chaletImage,
            price: chaletPrice
        });
    }, [chaletId, chaletName, chaletImage, chaletPrice, addViewed]);

    // This component doesn't render anything
    return null;
}
