'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Lock, Eye, Check } from '@/components/ui/Icons';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import styles from '@/styles/auth.module.css';

export default function ResetPasswordPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = use(params);
    const router = useRouter();
    const searchParams = useSearchParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        // In a real app, call Supabase to update password
        // await supabase.auth.updateUser({ password })

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSuccess(true);
        setLoading(false);
    };

    if (success) {
        return (
            <div className={styles.authPage}>
                <div className={styles.authContainer}>
                    <div className={styles.successIcon}>
                        <Check size={48} />
                    </div>
                    <h1>Password Updated!</h1>
                    <p>Your password has been successfully reset. You can now sign in with your new password.</p>
                    <Link href={`/${lang}/auth/login`} className={`${styles.authBtn} ${styles.authBtnPrimary}`}>
                        Sign In
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.authPage}>
            <div className={styles.authContainer}>
                <div className={styles.authHeader}>
                    <Link href={`/${lang}`} className={styles.authLogo}>
                        <svg viewBox="0 0 40 40" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M20 5 L5 18 L5 35 L35 35 L35 18 Z" />
                            <path d="M15 35 L15 25 L25 25 L25 35" />
                            <path d="M20 5 L20 1" />
                            <circle cx="20" cy="15" r="3" />
                        </svg>
                    </Link>
                    <h1>Create New Password</h1>
                    <p>Enter a strong password to secure your account</p>
                </div>

                {error && (
                    <div className={styles.authError}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className={styles.authForm}>
                    <div className={styles.formGroup}>
                        <label htmlFor="password">New Password</label>
                        <div className={styles.inputWrapper}>
                            <Lock size={20} className={styles.inputIcon} />
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                minLength={8}
                            />
                            <button
                                type="button"
                                className={styles.togglePassword}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <Eye size={20} />
                            </button>
                        </div>
                        <span className={styles.inputHint}>Must be at least 8 characters</span>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <div className={styles.inputWrapper}>
                            <Lock size={20} className={styles.inputIcon} />
                            <input
                                id="confirmPassword"
                                type={showPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={`${styles.authBtn} ${styles.authBtnPrimary}`}
                        disabled={loading}
                    >
                        {loading ? <LoadingSpinner size={20} /> : 'Reset Password'}
                    </button>
                </form>

                <div className={styles.authFooter}>
                    <Link href={`/${lang}/auth/login`}>
                        ← Back to Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
}
