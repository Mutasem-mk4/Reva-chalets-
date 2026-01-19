'use client';

import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="not-found">
            <div className="container">
                <div className="content">
                    <div className="error-code">404</div>
                    <h1>Oops! Page Not Found</h1>
                    <p>
                        The page you're looking for seems to have wandered off into the desert.
                        Don't worry, let's get you back on track!
                    </p>

                    <div className="actions">
                        <Link href="/en" className="btn-primary">
                            🏠 Go Home
                        </Link>
                        <Link href="/en/chalets" className="btn-secondary">
                            🏡 Browse Chalets
                        </Link>
                    </div>

                    <div className="suggestions">
                        <h3>You might be looking for:</h3>
                        <ul>
                            <li><Link href="/en/chalets">Our Luxury Chalets</Link></li>
                            <li><Link href="/en/contact">Contact Us</Link></li>
                            <li><Link href="/en/rewards">Rewards Program</Link></li>
                        </ul>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .not-found {
                    min-height: 80vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 4rem 2rem;
                    background: linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--secondary) / 0.3) 100%);
                }

                .content {
                    text-align: center;
                    max-width: 600px;
                    margin: 0 auto;
                }

                .error-code {
                    font-size: 8rem;
                    font-weight: 800;
                    background: linear-gradient(135deg, #f5a623, #d4920a);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    line-height: 1;
                    margin-bottom: 1rem;
                    text-shadow: none;
                }

                h1 {
                    font-family: var(--font-serif);
                    font-size: 2.5rem;
                    color: hsl(var(--foreground));
                    margin-bottom: 1rem;
                }

                p {
                    color: hsl(var(--muted-foreground));
                    font-size: 1.1rem;
                    line-height: 1.7;
                    margin-bottom: 2rem;
                }

                .actions {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                    flex-wrap: wrap;
                    margin-bottom: 3rem;
                }

                .btn-primary {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: linear-gradient(135deg, #f5a623, #d4920a);
                    color: white;
                    padding: 1rem 2rem;
                    border-radius: 3rem;
                    font-weight: 600;
                    text-decoration: none;
                    transition: all 0.2s ease;
                    box-shadow: 0 4px 15px rgba(245, 166, 35, 0.3);
                }

                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(245, 166, 35, 0.4);
                }

                .btn-secondary {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: hsl(var(--card));
                    color: hsl(var(--foreground));
                    padding: 1rem 2rem;
                    border-radius: 3rem;
                    font-weight: 600;
                    text-decoration: none;
                    border: 1px solid hsl(var(--border));
                    transition: all 0.2s ease;
                }

                .btn-secondary:hover {
                    border-color: hsl(var(--primary));
                    color: hsl(var(--primary));
                }

                .suggestions {
                    padding-top: 2rem;
                    border-top: 1px solid hsl(var(--border));
                }

                .suggestions h3 {
                    color: hsl(var(--foreground));
                    font-size: 1rem;
                    margin-bottom: 1rem;
                }

                .suggestions ul {
                    list-style: none;
                    padding: 0;
                    display: flex;
                    gap: 1.5rem;
                    justify-content: center;
                    flex-wrap: wrap;
                }

                .suggestions a {
                    color: hsl(var(--primary));
                    text-decoration: none;
                    font-weight: 500;
                    transition: opacity 0.2s;
                }

                .suggestions a:hover {
                    opacity: 0.8;
                }

                @media (max-width: 640px) {
                    .error-code {
                        font-size: 5rem;
                    }

                    h1 {
                        font-size: 1.75rem;
                    }

                    p {
                        font-size: 1rem;
                    }

                    .actions {
                        flex-direction: column;
                    }

                    .btn-primary,
                    .btn-secondary {
                        width: 100%;
                        justify-content: center;
                    }

                    .suggestions ul {
                        flex-direction: column;
                        gap: 0.75rem;
                    }
                }
            `}</style>
        </div>
    );
}
