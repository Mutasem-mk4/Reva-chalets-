'use client';

import Link from 'next/link';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="auth-layout">
            <header className="auth-nav">
                <Link href="/en" className="auth-logo">
                    <svg viewBox="0 0 40 40" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M20 5 L5 18 L5 35 L35 35 L35 18 Z" />
                        <path d="M15 35 L15 25 L25 25 L25 35" />
                        <path d="M20 5 L20 1" />
                        <circle cx="20" cy="15" r="3" />
                    </svg>
                    <span>Reva.</span>
                </Link>
            </header>
            <main className="auth-main">
                {children}
            </main>
            <style jsx global>{`
                .auth-layout {
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                }
                
                .auth-nav {
                    padding: 1rem 2rem;
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: 10;
                }
                
                .auth-logo {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    text-decoration: none;
                    color: hsl(var(--foreground));
                    font-family: var(--font-serif);
                    font-size: 1.5rem;
                    font-weight: 600;
                }
                
                .auth-logo svg {
                    color: hsl(var(--primary));
                }
                
                .auth-main {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            `}</style>
        </div>
    );
}
