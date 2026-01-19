'use client';

import dynamic from 'next/dynamic';
import type { Chalet } from '@/lib/data';

// Dynamically import the map with SSR disabled
const ChaletMap = dynamic(() => import('@/components/ui/ChaletMap'), {
    ssr: false,
    loading: () => <div className="map-loading-placeholder">Loading Map...</div>
});

export default function MapWrapper({ chalets }: { chalets: Chalet[] }) {
    return <ChaletMap chalets={chalets} />;
}
