'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Eye, Check } from '@/components/ui/Icons';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { createClient } from '@/lib/supabase/client';
import styles from '@/styles/auth.module.css';

const t = {
    ar: {
        title: 'إنشاء كلمة مرور جديدة',
        subtitle: 'أدخل كلمة مرور قوية لتأمين حسابك',
        newPassword: 'كلمة المرور الجديدة',
        confirmPassword: 'تأكيد كلمة المرور',
        placeholder: '••••••••',
        hint: 'يجب أن تكون ٨ أحرف على الأقل',
        resetBtn: 'إعادة تعيين كلمة المرور',
        backToLogin: '← الرجوع لتسجيل الدخول',
        successTitle: 'تم تحديث كلمة المرور!',
        successMsg: 'تم تغيير كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.',
        signIn: 'تسجيل الدخول',
        errorMin: 'كلمة المرور يجب أن تكون ٨ أحرف على الأقل',
        errorMatch: 'كلمتا المرور غير متطابقتين',
    },
    en: {
        title: 'Create New Password',
        subtitle: 'Enter a strong password to secure your account',
        newPassword: 'New Password',
        confirmPassword: 'Confirm Password',
        placeholder: '••••••••',
        hint: 'Must be at least 8 characters',
        resetBtn: 'Reset Password',
        backToLogin: '← Back to Sign In',
        successTitle: 'Password Updated!',
        successMsg: 'Your password has been successfully reset. You can now sign in with your new password.',
        signIn: 'Sign In',
        errorMin: 'Password must be at least 8 characters',
        errorMatch: 'Passwords do not match',
    },
};

export default function ResetPasswordPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = use(params);
    const isAr = lang === 'ar';
    const labels = isAr ? t.ar : t.en;
    const router = useRouter();
    const supabase = createClient();
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
            setError(labels.errorMin);
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError(labels.errorMatch);
            setLoading(false);
            return;
        }

        const { error } = await supabase.auth.updateUser({ password });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            setSuccess(true);
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className={styles.authPage} dir={isAr ? 'rtl' : 'ltr'}>
                <div className={`${styles.authContainer} ${styles.successContainer}`}>
                    <div className={styles.successIcon}>
                        <Check size={48} />
                    </div>
                    <h1>{labels.successTitle}</h1>
                    <p>{labels.successMsg}</p>
                    <Link href={`/${lang}/auth/login`} className={`${styles.authBtn} ${styles.authBtnPrimary}`} style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
                        {labels.signIn}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.authPage} dir={isAr ? 'rtl' : 'ltr'}>
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
                    <h1>{labels.title}</h1>
                    <p>{labels.subtitle}</p>
                </div>

                {error && (
                    <div className={styles.authError}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className={styles.authForm}>
                    <div className={styles.formGroup}>
                        <label htmlFor="password">{labels.newPassword}</label>
                        <div className={styles.inputWrapper}>
                            <Lock size={20} />
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={labels.placeholder}
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
                        <span className={styles.inputHint}>{labels.hint}</span>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="confirmPassword">{labels.confirmPassword}</label>
                        <div className={styles.inputWrapper}>
                            <Lock size={20} />
                            <input
                                id="confirmPassword"
                                type={showPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder={labels.placeholder}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={`${styles.authBtn} ${styles.authBtnPrimary}`}
                        disabled={loading}
                    >
                        {loading ? <LoadingSpinner size={20} color="white" /> : labels.resetBtn}
                    </button>
                </form>

                <div className={styles.authFooter}>
                    <Link href={`/${lang}/auth/login`}>
                        {labels.backToLogin}
                    </Link>
                </div>
            </div>
        </div>
    );
}
