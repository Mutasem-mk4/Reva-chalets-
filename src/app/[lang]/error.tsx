'use client';

import { useEffect } from 'react';
import { XCircle } from '@/components/ui/Icons';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: '60vh',
            justifyContent: 'center'
        }}>
            <div style={{ marginBottom: '1.5rem', color: '#ef4444' }}>
                <XCircle size={64} />
            </div>
            <h2 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '2rem',
                marginBottom: '1rem',
                color: 'hsl(var(--primary))'
            }}>Something went wrong!</h2>
            <p style={{ marginBottom: '2rem', opacity: 0.7 }}>
                We apologize for the inconvenience. Please try again.
            </p>
            {process.env.NODE_ENV === 'development' && (
                <p style={{
                    marginBottom: '1rem',
                    fontSize: '0.875rem',
                    color: '#ef4444',
                    background: 'rgba(239, 68, 68, 0.1)',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    maxWidth: '500px',
                    wordBreak: 'break-word'
                }}>
                    {error.message}
                </p>
            )}
            <button
                onClick={() => reset()}
                style={{
                    padding: '0.75rem 2rem',
                    background: 'hsl(var(--secondary))',
                    color: 'hsl(var(--secondary-foreground))',
                    border: 'none',
                    borderRadius: '2rem',
                    cursor: 'pointer',
                    fontWeight: 600
                }}
            >
                Try again
            </button>
        </div>
    );
}
