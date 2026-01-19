'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface BlurImageProps extends Omit<ImageProps, 'onLoad'> {
    blurColor?: string;
}

export default function BlurImage({
    blurColor = 'hsl(var(--secondary))',
    className = '',
    alt,
    ...props
}: BlurImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(false);

    return (
        <div className={`blur-image-container ${className}`}>
            {/* Placeholder skeleton */}
            <div
                className={`placeholder ${isLoaded ? 'loaded' : ''}`}
                style={{ backgroundColor: blurColor }}
            />

            {/* Actual image */}
            {!error && (
                <Image
                    {...props}
                    alt={alt}
                    className={`actual-image ${isLoaded ? 'loaded' : ''}`}
                    onLoad={() => setIsLoaded(true)}
                    onError={() => setError(true)}
                />
            )}

            {/* Error state */}
            {error && (
                <div className="error-state">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                    </svg>
                </div>
            )}

            <style jsx>{`
                .blur-image-container {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                }
                
                .placeholder {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(
                        90deg,
                        transparent 0%,
                        rgba(255,255,255,0.1) 50%,
                        transparent 100%
                    );
                    background-size: 200% 100%;
                    animation: shimmer 1.5s infinite;
                    transition: opacity 0.3s ease;
                }
                
                .placeholder.loaded {
                    opacity: 0;
                }
                
                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
                
                .blur-image-container :global(.actual-image) {
                    opacity: 0;
                    transition: opacity 0.4s ease;
                }
                
                .blur-image-container :global(.actual-image.loaded) {
                    opacity: 1;
                }
                
                .error-state {
                    position: absolute;
                    inset: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: hsl(var(--secondary));
                    color: hsl(var(--muted-foreground));
                }
            `}</style>
        </div>
    );
}

// Progressive gallery loader
export function ProgressiveGallery({
    images,
    alt
}: {
    images: string[];
    alt: string;
}) {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div className="progressive-gallery">
            <div className="main-image">
                <BlurImage
                    src={images[activeIndex]}
                    alt={`${alt} - Image ${activeIndex + 1}`}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, 60vw"
                    priority={activeIndex === 0}
                />
            </div>

            {images.length > 1 && (
                <div className="thumbnails">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            className={`thumbnail ${idx === activeIndex ? 'active' : ''}`}
                            onClick={() => setActiveIndex(idx)}
                            aria-label={`View image ${idx + 1}`}
                        >
                            <BlurImage
                                src={img}
                                alt={`${alt} thumbnail ${idx + 1}`}
                                fill
                                style={{ objectFit: 'cover' }}
                                sizes="80px"
                            />
                        </button>
                    ))}
                </div>
            )}

            <style jsx>{`
                .progressive-gallery {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                
                .main-image {
                    position: relative;
                    aspect-ratio: 16/10;
                    border-radius: 1rem;
                    overflow: hidden;
                }
                
                .thumbnails {
                    display: flex;
                    gap: 0.5rem;
                    overflow-x: auto;
                    padding: 0.25rem;
                    margin: -0.25rem;
                }
                
                .thumbnail {
                    position: relative;
                    width: 80px;
                    height: 60px;
                    flex-shrink: 0;
                    border-radius: 0.5rem;
                    overflow: hidden;
                    border: 2px solid transparent;
                    cursor: pointer;
                    transition: border-color 0.2s;
                    padding: 0;
                    background: hsl(var(--secondary));
                }
                
                .thumbnail.active {
                    border-color: hsl(var(--primary));
                }
                
                .thumbnail:hover:not(.active) {
                    border-color: hsl(var(--border));
                }
            `}</style>
        </div>
    );
}
