'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Email, Lock, User, Eye, ArrowRight, Check, X } from '@/components/ui/Icons';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import styles from '@/styles/auth.module.css';

interface SignupPageProps {
    params: Promise<{ lang: string }>;
}

export default function SignupPage({ params }: SignupPageProps) {
    const { lang } = use(params);
    const router = useRouter();
    const { signUp, signInWithGoogle } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'USER' | 'HOST'>('USER');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            return;
        }

        const { error } = await signUp(email, password, { name, role });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            setSuccess(true);
        }
    };

    const handleGoogleSignup = async () => {
        setLoading(true);
        const { error } = await signInWithGoogle();
        if (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className={styles.authPage}>
                <div className={`${styles.authContainer} ${styles.successContainer}`}>
                    <div className={styles.successIcon}>
                        <Check size={48} />
                    </div>
                    <h1>Check Your Email</h1>
                    <p>We've sent a confirmation link to <strong>{email}</strong></p>
                    <p>Click the link to activate your account.</p>
                    <Link href={`/${lang}/auth/login`} className={`${styles.authBtn} ${styles.authBtnPrimary}`} style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.authPage}>
            <div className={styles.authContainer}>
                <div className={styles.authHeader}>
                    <h1>Create Account</h1>
                    <p>Join Reva Chalets and start your journey</p>
                </div>

                {error && (
                    <div className={styles.authError}>
                        <X size={16} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className={styles.authForm}>
                    <div className={styles.formGroup}>
                        <label htmlFor="name">Full Name</label>
                        <div className={styles.inputWrapper}>
                            <User size={20} />
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="email">Email</label>
                        <div className={styles.inputWrapper}>
                            <Email size={20} />
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="password">Password</label>
                        <div className={styles.inputWrapper}>
                            <Lock size={20} />
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="At least 6 characters"
                                required
                                minLength={6}
                            />
                            <button
                                type="button"
                                className={styles.togglePassword}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <Eye size={20} />
                            </button>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label>I want to</label>
                        <div className={styles.roleSelector}>
                            <button
                                type="button"
                                className={`${styles.roleBtn} ${role === 'USER' ? styles.active : ''}`}
                                onClick={() => setRole('USER')}
                            >
                                <span className={styles.roleIcon}>🏠</span>
                                <span>Book Chalets</span>
                            </button>
                            <button
                                type="button"
                                className={`${styles.roleBtn} ${role === 'HOST' ? styles.active : ''}`}
                                onClick={() => setRole('HOST')}
                            >
                                <span className={styles.roleIcon}>🔑</span>
                                <span>List My Property</span>
                            </button>
                        </div>
                    </div>

                    <button type="submit" className={`${styles.authBtn} ${styles.authBtnPrimary}`} disabled={loading}>
                        {loading ? (
                            <LoadingSpinner size={20} color="white" />
                        ) : (
                            <>
                                Create Account
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <div className={styles.authDivider}>
                    <span>or continue with</span>
                </div>

                <button
                    type="button"
                    className={`${styles.authBtn} ${styles.authBtnGoogle}`}
                    onClick={handleGoogleSignup}
                    disabled={loading}
                >
                    <svg viewBox="0 0 24 24" width="20" height="20">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                </button>

                <p className={styles.authSwitch}>
                    Already have an account?{' '}
                    <Link href={`/${lang}/auth/login`}>Sign in</Link>
                </p>
            </div>
        </div>
    );
}
