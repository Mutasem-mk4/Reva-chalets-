'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import styles from '@/styles/login.module.css';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Secure Login Logic
        if (email === 'admin@reva.com') {
            if (password === 'admin123') {
                login(email, 'admin');
            } else {
                setError('Invalid credentials for Admin access.');
            }
        } else {
            // Any other email acts as an Owner for this demo
            // In a real app, we would verify owner password database
            if (password.length > 0) {
                login(email, 'owner');
            } else {
                setError('Please enter a password.');
            }
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Reva Partner Login</h1>
                <p className={styles.subtitle}>Sign in to manage your property</p>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label>Email Address</label>
                        <input
                            type="email"
                            required
                            className={styles.input}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@example.com"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Password</label>
                        <input
                            type="password"
                            required
                            className={styles.input}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>

                    {error && <div style={{ color: 'red', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

                    <button type="submit" className={styles.submitBtn}>
                        Sign In
                    </button>

                    <div style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: '#64748b', textAlign: 'center' }}>
                        <p><strong>Demo Credentials:</strong></p>
                        <p>Admin: admin@reva.com / admin123</p>
                        <p>Owner: Any other email / any password</p>
                    </div>
                </form>
            </div>
        </div>
    );
}
