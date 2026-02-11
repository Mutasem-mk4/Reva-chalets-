'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { Email, ArrowRight, Check, X } from '@/components/ui/Icons';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import styles from '@/styles/auth.module.css';

interface ForgotPasswordPageProps {
    params: Promise<{ lang: string }>;
}

const t = {
    ar: {
        title: 'نسيت كلمة المرور؟',
        subtitle: 'أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين',
        email: 'البريد الإلكتروني',
        emailPlaceholder: 'example@email.com',
        sendLink: 'إرسال رابط إعادة التعيين',
        backToLogin: '← الرجوع لتسجيل الدخول',
        successTitle: 'تم الإرسال!',
        successMsg1: 'أرسلنا رابط إعادة تعيين كلمة المرور إلى',
        successMsg2: 'تحقق من بريدك الإلكتروني واتبع التعليمات.',
        backToLoginBtn: 'العودة لتسجيل الدخول',
    },
    en: {
        title: 'Forgot Password?',
        subtitle: "Enter your email and we'll send you a reset link",
        email: 'Email',
        emailPlaceholder: 'your@email.com',
        sendLink: 'Send Reset Link',
        backToLogin: '← Back to Sign In',
        successTitle: 'Email Sent!',
        successMsg1: "We've sent a password reset link to",
        successMsg2: 'Check your email and follow the instructions.',
        backToLoginBtn: 'Back to Sign In',
    },
};

export default function ForgotPasswordPage({ params }: ForgotPasswordPageProps) {
    const { lang } = use(params);
    const isAr = lang === 'ar';
    const labels = isAr ? t.ar : t.en;
    const { resetPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const { error } = await resetPassword(email);

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
                    <p>{labels.successMsg1} <strong>{email}</strong></p>
                    <p>{labels.successMsg2}</p>
                    <Link
                        href={`/${lang}/auth/login`}
                        className={`${styles.authBtn} ${styles.authBtnPrimary}`}
                        style={{ marginTop: '1.5rem', display: 'inline-flex' }}
                    >
                        {labels.backToLoginBtn}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.authPage} dir={isAr ? 'rtl' : 'ltr'}>
            <div className={styles.authContainer}>
                <div className={styles.authHeader}>
                    <h1>{labels.title}</h1>
                    <p>{labels.subtitle}</p>
                </div>

                {error && (
                    <div className={styles.authError}>
                        <X size={16} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className={styles.authForm}>
                    <div className={styles.formGroup}>
                        <label htmlFor="email">{labels.email}</label>
                        <div className={styles.inputWrapper}>
                            <Email size={20} />
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={labels.emailPlaceholder}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className={`${styles.authBtn} ${styles.authBtnPrimary}`} disabled={loading}>
                        {loading ? (
                            <LoadingSpinner size={20} color="white" />
                        ) : (
                            <>
                                {labels.sendLink}
                                <ArrowRight size={18} />
                            </>
                        )}
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
