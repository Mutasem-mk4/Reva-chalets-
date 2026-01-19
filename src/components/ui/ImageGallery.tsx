'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';

interface ImageGalleryProps {
    images: string[];
    alt: string;
}

export default function ImageGallery({ images, alt }: ImageGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);

    const goToPrevious = useCallback(() => {
        setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
    }, [images.length]);

    const goToNext = useCallback(() => {
        setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
    }, [images.length]);

    const goToIndex = useCallback((index: number) => {
        setCurrentIndex(index);
    }, []);

    // Handle keyboard navigation
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'ArrowLeft') goToPrevious();
        if (e.key === 'ArrowRight') goToNext();
        if (e.key === 'Escape') setIsZoomed(false);
    }, [goToPrevious, goToNext]);

    if (images.length === 0) return null;

    return (
        <>
            <div className="gallery" tabIndex={0} onKeyDown={handleKeyDown}>
                {/* Main Image */}
                <div className="main-image-container" onClick={() => setIsZoomed(true)}>
                    <Image
                        src={images[currentIndex]}
                        alt={`${alt} - Image ${currentIndex + 1}`}
                        className="main-image"
                        width={1200}
                        height={675}
                        priority
                    />

                    {/* Image Counter */}
                    <div className="image-counter">
                        {currentIndex + 1} / {images.length}
                    </div>

                    {/* Navigation Arrows */}
                    {images.length > 1 && (
                        <>
                            <button
                                className="nav-btn prev"
                                onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
                                aria-label="Previous image"
                            >
                                ‹
                            </button>
                            <button
                                className="nav-btn next"
                                onClick={(e) => { e.stopPropagation(); goToNext(); }}
                                aria-label="Next image"
                            >
                                ›
                            </button>
                        </>
                    )}
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                    <div className="thumbnails">
                        {images.map((img, idx) => (
                            <button
                                key={idx}
                                className={`thumbnail ${idx === currentIndex ? 'active' : ''}`}
                                onClick={() => goToIndex(idx)}
                                aria-label={`Go to image ${idx + 1}`}
                            >
                                <Image src={img} alt={`Thumbnail ${idx + 1}`} width={80} height={60} />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Fullscreen Modal */}
            {isZoomed && (
                <div className="lightbox" onClick={() => setIsZoomed(false)}>
                    <button className="close-btn" aria-label="Close">×</button>
                    <img
                        src={images[currentIndex]}
                        alt={`${alt} - Fullscreen`}
                        onClick={(e) => e.stopPropagation()}
                    />
                    <button
                        className="lightbox-nav prev"
                        onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
                    >
                        ‹
                    </button>
                    <button
                        className="lightbox-nav next"
                        onClick={(e) => { e.stopPropagation(); goToNext(); }}
                    >
                        ›
                    </button>
                    <div className="lightbox-counter">
                        {currentIndex + 1} / {images.length}
                    </div>
                </div>
            )}

            <style jsx>{`
                .gallery {
                    position: relative;
                    outline: none;
                }

                .main-image-container {
                    position: relative;
                    aspect-ratio: 16/9;
                    overflow: hidden;
                    border-radius: var(--radius);
                    cursor: zoom-in;
                    background: hsl(var(--muted));
                }

                .main-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.3s ease;
                }

                .main-image-container:hover .main-image {
                    transform: scale(1.02);
                }

                .image-counter {
                    position: absolute;
                    bottom: 1rem;
                    right: 1rem;
                    background: rgba(0,0,0,0.7);
                    color: white;
                    padding: 0.5rem 1rem;
                    border-radius: 2rem;
                    font-size: 0.875rem;
                    font-weight: 500;
                }

                .nav-btn {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.9);
                    border: none;
                    font-size: 2rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                    opacity: 0;
                    color: #333;
                }

                .main-image-container:hover .nav-btn {
                    opacity: 1;
                }

                .nav-btn:hover {
                    background: white;
                    transform: translateY(-50%) scale(1.1);
                }

                .nav-btn.prev { left: 1rem; }
                .nav-btn.next { right: 1rem; }

                .thumbnails {
                    display: flex;
                    gap: 0.75rem;
                    margin-top: 1rem;
                    overflow-x: auto;
                    padding-bottom: 0.5rem;
                }

                .thumbnail {
                    flex-shrink: 0;
                    width: 80px;
                    height: 60px;
                    border-radius: 0.5rem;
                    overflow: hidden;
                    border: 2px solid transparent;
                    cursor: pointer;
                    opacity: 0.6;
                    transition: all 0.2s ease;
                    padding: 0;
                    background: none;
                }

                .thumbnail:hover {
                    opacity: 1;
                }

                .thumbnail.active {
                    border-color: hsl(var(--primary));
                    opacity: 1;
                }

                .thumbnail img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                /* Lightbox */
                .lightbox {
                    position: fixed;
                    inset: 0;
                    background: rgba(0,0,0,0.95);
                    z-index: 1000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: zoom-out;
                    animation: fadeIn 0.2s ease;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .lightbox img {
                    max-width: 90vw;
                    max-height: 90vh;
                    object-fit: contain;
                    cursor: default;
                }

                .close-btn {
                    position: absolute;
                    top: 1.5rem;
                    right: 1.5rem;
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.1);
                    border: none;
                    color: white;
                    font-size: 2rem;
                    cursor: pointer;
                    transition: background 0.2s;
                }

                .close-btn:hover {
                    background: rgba(255,255,255,0.2);
                }

                .lightbox-nav {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 56px;
                    height: 56px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.1);
                    border: none;
                    color: white;
                    font-size: 2.5rem;
                    cursor: pointer;
                    transition: background 0.2s;
                }

                .lightbox-nav:hover {
                    background: rgba(255,255,255,0.2);
                }

                .lightbox-nav.prev { left: 2rem; }
                .lightbox-nav.next { right: 2rem; }

                .lightbox-counter {
                    position: absolute;
                    bottom: 2rem;
                    left: 50%;
                    transform: translateX(-50%);
                    color: white;
                    font-size: 1rem;
                    padding: 0.5rem 1.5rem;
                    background: rgba(0,0,0,0.5);
                    border-radius: 2rem;
                }

                @media (max-width: 768px) {
                    .nav-btn {
                        width: 40px;
                        height: 40px;
                        font-size: 1.5rem;
                        opacity: 1;
                    }

                    .thumbnail {
                        width: 60px;
                        height: 45px;
                    }

                    .lightbox-nav {
                        width: 44px;
                        height: 44px;
                        font-size: 2rem;
                    }

                    .lightbox-nav.prev { left: 1rem; }
                    .lightbox-nav.next { right: 1rem; }
                }
            `}</style>
        </>
    );
}
