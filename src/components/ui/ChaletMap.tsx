'use client';

import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import type { Chalet } from '@/lib/data';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { Plus, Minus, MapPin } from '@/components/ui/Icons';

// Fix for default marker icon in Next.js
const customIcon = new Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [38, 38]
});

// Custom zoom control component
function CustomZoomControl() {
    const map = useMap();
    const [currentZoom, setCurrentZoom] = useState(map.getZoom());

    useEffect(() => {
        const onZoom = () => setCurrentZoom(Math.round(map.getZoom() * 10) / 10);
        map.on('zoomend', onZoom);
        return () => { map.off('zoomend', onZoom); };
    }, [map]);

    const zoomIn = useCallback(() => {
        map.zoomIn(0.5, { animate: true });
    }, [map]);

    const zoomOut = useCallback(() => {
        map.zoomOut(0.5, { animate: true });
    }, [map]);

    const resetView = useCallback(() => {
        map.flyTo([31.0, 36.0], 7, {
            animate: true,
            duration: 1.5,
            easeLinearity: 0.1
        });
    }, [map]);

    const fitBounds = useCallback(() => {
        // Zoom to fit all markers
        const bounds = map.getBounds();
        map.flyToBounds(bounds.pad(0.1), {
            animate: true,
            duration: 1,
            easeLinearity: 0.1
        });
    }, [map]);

    return (
        <div className="custom-zoom-controls">
            <button
                className="zoom-btn"
                onClick={zoomIn}
                title="Zoom In"
                disabled={currentZoom >= 18}
            >
                <Plus size={20} />
            </button>
            <div className="zoom-level">{Math.round(currentZoom)}</div>
            <button
                className="zoom-btn"
                onClick={zoomOut}
                title="Zoom Out"
                disabled={currentZoom <= 5}
            >
                <Minus size={20} />
            </button>
            <div className="zoom-divider"></div>
            <button className="zoom-btn" onClick={resetView} title="Reset View">
                <MapPin size={18} />
            </button>
        </div>
    );
}

// Map events handler for better zoom experience
function MapEvents() {
    const map = useMap();

    useEffect(() => {
        // Enable double-click zoom with smooth animation
        map.doubleClickZoom.enable();

        // Configure responsive zoom settings
        map.options.wheelPxPerZoomLevel = 100; // Lower = faster wheel zoom
        map.options.zoomSnap = 0.5; // Snap for cleaner zoom levels
        map.options.zoomDelta = 1; // Standard delta
        map.options.wheelDebounceTime = 20; // Low debounce for instant response
    }, [map]);

    return null;
}

export default function ChaletMap({ chalets }: { chalets: Chalet[] }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="map-loading">Loading Map...</div>;

    return (
        <div className="map-container">
            <MapContainer
                center={[31.0, 36.0]}
                zoom={7}
                minZoom={5}
                maxZoom={18}
                scrollWheelZoom={true}
                zoomControl={false}
                doubleClickZoom={true}
                touchZoom={true}
                zoomAnimation={true}
                fadeAnimation={true}
                markerZoomAnimation={true}
                zoomAnimationThreshold={10}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />

                <CustomZoomControl />
                <MapEvents />

                {chalets.map(chalet => (
                    chalet.coordinates && (
                        <Marker
                            key={chalet.id}
                            position={[chalet.coordinates.lat, chalet.coordinates.lng]}
                            icon={customIcon}
                        >
                            <Popup className="chalet-popup">
                                <div className="popup-content">
                                    <h4 className="font-serif font-bold text-sm">{chalet.name}</h4>
                                    <p className="text-xs text-muted-foreground">{chalet.price} JOD / night</p>
                                    <Link href={`/en/chalets/${chalet.id}`} className="block mt-2 text-xs font-bold text-primary hover:underline">
                                        View &gt;
                                    </Link>
                                </div>
                            </Popup>
                        </Marker>
                    )
                ))}
            </MapContainer>

            <style jsx global>{`
                .map-container {
                    height: 500px;
                    width: 100%;
                    border-radius: var(--radius);
                    overflow: hidden;
                    box-shadow: var(--shadow-md);
                    border: 1px solid hsl(var(--border));
                    z-index: 0;
                    position: relative;
                }
                
                .map-loading {
                    height: 500px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: hsl(var(--secondary));
                    border-radius: var(--radius);
                }

                /* Custom Zoom Controls */
                .custom-zoom-controls {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    z-index: 1000;
                    display: flex;
                    flex-direction: column;
                    gap: 0;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                    overflow: hidden;
                }

                .zoom-btn {
                    width: 44px;
                    height: 44px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: none;
                    background: white;
                    color: #333;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .zoom-btn:hover:not(:disabled) {
                    background: hsl(var(--primary));
                    color: white;
                }

                .zoom-btn:disabled {
                    opacity: 0.4;
                    cursor: not-allowed;
                }

                .zoom-btn:active:not(:disabled) {
                    transform: scale(0.95);
                }

                .zoom-level {
                    width: 44px;
                    height: 28px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    font-weight: 600;
                    color: #666;
                    background: #f5f5f5;
                    border-top: 1px solid #eee;
                    border-bottom: 1px solid #eee;
                }

                .zoom-divider {
                    height: 1px;
                    background: #eee;
                }

                /* Hide default Leaflet zoom controls */
                .leaflet-control-zoom {
                    display: none !important;
                }

                /* Leaflet Override */
                .leaflet-popup-content-wrapper {
                    border-radius: 12px;
                    overflow: hidden;
                    padding: 0;
                }
                .leaflet-popup-content {
                    margin: 12px;
                }

                /* Smooth zoom animation */
                .leaflet-zoom-animated {
                    will-change: transform;
                    transition: transform 0.15s ease-out !important;
                }

                .leaflet-tile-container {
                    transition: opacity 0.1s ease-out;
                }

                .leaflet-fade-anim .leaflet-tile,
                .leaflet-fade-anim .leaflet-popup {
                    transition: opacity 0.1s ease-out;
                }

                .leaflet-container {
                    -webkit-transform: translateZ(0);
                    transform: translateZ(0);
                }

                .leaflet-tile {
                    transition: opacity 0.1s linear;
                }

                .leaflet-marker-icon {
                    transition: transform 0.15s ease-out;
                }

                /* Touch-friendly popup */
                .leaflet-popup-tip-container {
                    margin-top: -1px;
                }
            `}</style>
        </div>
    );
}
