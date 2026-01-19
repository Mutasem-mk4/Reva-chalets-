'use client';

import { useState, useEffect } from 'react';

export default function Preloader({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Hide preloader immediately on mount (client-side)
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return (
            <div className="preloader">
                {/* Header Skeleton */}
                <div className="header-skeleton">
                    <div className="container">
                        <div className="skeleton logo-skeleton"></div>
                        <div className="nav-skeleton">
                            <div className="skeleton nav-item"></div>
                            <div className="skeleton nav-item"></div>
                            <div className="skeleton nav-item"></div>
                            <div className="skeleton nav-item"></div>
                        </div>
                        <div className="skeleton btn-skeleton"></div>
                    </div>
                </div>

                {/* Hero Skeleton */}
                <div className="hero-skeleton">
                    <div className="hero-content">
                        <div className="skeleton title-skeleton"></div>
                        <div className="skeleton subtitle-skeleton"></div>
                        <div className="skeleton cta-skeleton"></div>
                    </div>
                </div>

                {/* Cards Section Skeleton */}
                <div className="section-skeleton">
                    <div className="container">
                        <div className="skeleton section-title-skeleton"></div>
                        <div className="cards-grid">
                            <div className="card-skeleton">
                                <div className="skeleton card-image"></div>
                                <div className="card-body">
                                    <div className="skeleton card-title"></div>
                                    <div className="skeleton card-text"></div>
                                </div>
                            </div>
                            <div className="card-skeleton">
                                <div className="skeleton card-image"></div>
                                <div className="card-body">
                                    <div className="skeleton card-title"></div>
                                    <div className="skeleton card-text"></div>
                                </div>
                            </div>
                            <div className="card-skeleton">
                                <div className="skeleton card-image"></div>
                                <div className="card-body">
                                    <div className="skeleton card-title"></div>
                                    <div className="skeleton card-text"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <style jsx>{`
                    .preloader {
                        position: fixed;
                        inset: 0;
                        z-index: 99999;
                        background: #0a1628;
                        overflow: hidden;
                    }
                    
                    .skeleton {
                        background: linear-gradient(90deg, #1a2d4a 0%, #2a3d5a 50%, #1a2d4a 100%);
                        background-size: 200% 100%;
                        animation: shimmer 1.5s ease-in-out infinite;
                        border-radius: 0.5rem;
                    }
                    
                    @keyframes shimmer {
                        0% { background-position: 200% 0; }
                        100% { background-position: -200% 0; }
                    }
                    
                    .container {
                        max-width: 1200px;
                        margin: 0 auto;
                        padding: 0 1.5rem;
                    }
                    
                    /* Header */
                    .header-skeleton {
                        padding: 1.25rem 0;
                        border-bottom: 1px solid #1a2d4a;
                    }
                    
                    .header-skeleton .container {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                    }
                    
                    .logo-skeleton {
                        width: 120px;
                        height: 40px;
                    }
                    
                    .nav-skeleton {
                        display: flex;
                        gap: 2rem;
                    }
                    
                    .nav-item {
                        width: 60px;
                        height: 20px;
                    }
                    
                    .btn-skeleton {
                        width: 100px;
                        height: 40px;
                        border-radius: 2rem;
                    }
                    
                    /* Hero */
                    .hero-skeleton {
                        height: 70vh;
                        min-height: 500px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: linear-gradient(135deg, #0f2847 0%, #0a1628 100%);
                    }
                    
                    .hero-content {
                        text-align: center;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 1rem;
                        padding: 2rem;
                    }
                    
                    .title-skeleton {
                        width: 400px;
                        height: 48px;
                        max-width: 90vw;
                    }
                    
                    .subtitle-skeleton {
                        width: 300px;
                        height: 24px;
                        max-width: 70vw;
                    }
                    
                    .cta-skeleton {
                        width: 180px;
                        height: 48px;
                        border-radius: 2rem;
                        margin-top: 1rem;
                    }
                    
                    /* Section */
                    .section-skeleton {
                        padding: 4rem 0;
                    }
                    
                    .section-title-skeleton {
                        width: 200px;
                        height: 32px;
                        margin-bottom: 2rem;
                    }
                    
                    .cards-grid {
                        display: grid;
                        grid-template-columns: repeat(3, 1fr);
                        gap: 2rem;
                    }
                    
                    .card-skeleton {
                        background: #0f2847;
                        border-radius: 1rem;
                        overflow: hidden;
                    }
                    
                    .card-image {
                        height: 200px;
                        border-radius: 0;
                    }
                    
                    .card-body {
                        padding: 1.5rem;
                        display: flex;
                        flex-direction: column;
                        gap: 0.75rem;
                    }
                    
                    .card-title {
                        width: 70%;
                        height: 24px;
                    }
                    
                    .card-text {
                        width: 50%;
                        height: 16px;
                    }
                    
                    @media (max-width: 768px) {
                        .nav-skeleton {
                            display: none;
                        }
                        
                        .cards-grid {
                            grid-template-columns: 1fr;
                        }
                        
                        .hero-skeleton {
                            height: 50vh;
                            min-height: 400px;
                        }
                    }
                `}</style>
            </div>
        );
    }

    return <>{children}</>;
}
