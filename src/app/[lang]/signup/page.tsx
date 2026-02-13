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

const t = {
    ar: {
        title: 'إنشاء حساب',
        subtitle: 'انضم إلى ريفا وابدأ رحلتك',
        fullName: 'الاسم الكامل',
        namePlaceholder: 'أدخل اسمك',
        email: 'البريد الإلكتروني',
        emailPlaceholder: 'example@email.com',
        password: 'كلمة المرور',
        passwordPlaceholder: '٦ أحرف على الأقل',
        iWantTo: 'أريد أن',
        bookChalets: 'أحجز شاليهات',
        listProperty: 'أعرض عقاري',
        createAccount: 'إنشاء الحساب',
        orContinueWith: 'أو عبر',
        continueWithGoogle: 'التسجيل بحساب Google',
        haveAccount: 'لديك حساب بالفعل؟',
        signIn: 'تسجيل الدخول',
        checkEmail: 'تحقق من بريدك الإلكتروني',
        confirmationSent: 'أرسلنا رابط التأكيد إلى',
        clickToActivate: 'اضغط على الرابط لتفعيل حسابك.',
        goToLogin: 'الذهاب لتسجيل الدخول',
        passwordMinError: 'كلمة المرور يجب أن تكون ٦ أحرف على الأقل',
    },
    en: {
        title: 'Create Account',
        subtitle: 'Join Riva Chalets and start your journey',
        fullName: 'Full Name',
        namePlaceholder: 'John Doe',
        email: 'Email',
        emailPlaceholder: 'your@email.com',
        password: 'Password',
        passwordPlaceholder: 'At least 6 characters',
        iWantTo: 'I want to',
        bookChalets: 'Book Chalets',
        listProperty: 'List My Property',
        createAccount: 'Create Account',
        orContinueWith: 'or continue with',
        continueWithGoogle: 'Continue with Google',
        haveAccount: 'Already have an account?',
        signIn: 'Sign in',
        checkEmail: 'Check Your Email',
        confirmationSent: "We've sent a confirmation link to",
        clickToActivate: 'Click the link to activate your account.',
        goToLogin: 'Go to Login',
        passwordMinError: 'Password must be at least 6 characters',
    },
};

export default function SignupPage({ params }: SignupPageProps) {
    const { lang } = use(params);
    const isAr = lang === 'ar';
    const labels = isAr ? t.ar : t.en;
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
            setError(labels.passwordMinError);
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
            <div className={styles.authPage} dir={isAr ? 'rtl' : 'ltr'}>
                <div className={`${styles.authContainer} ${styles.successContainer}`}>
                    <div className={styles.successIcon}>
                        <Check size={48} />
                    </div>
                    <h1>{labels.checkEmail}</h1>
                    <p>{labels.confirmationSent} <strong>{email}</strong></p>
                    <p>{labels.clickToActivate}</p>
                    <Link href={`/${lang}/login`} className={`${styles.authBtn} ${styles.authBtnPrimary}`} style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
                        {labels.goToLogin}
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
                        <label htmlFor="name">{labels.fullName}</label>
                        <div className={styles.inputWrapper}>
                            <User size={20} />
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={labels.namePlaceholder}
                                required
                            />
                        </div>
                    </div>

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

                    <div className={styles.formGroup}>
                        <label htmlFor="password">{labels.password}</label>
                        <div className={styles.inputWrapper}>
                            <Lock size={20} />
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={labels.passwordPlaceholder}
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
                        <label>{labels.iWantTo}</label>
                        <div className={styles.roleSelector}>
                            <button
                                type="button"
                                className={`${styles.roleBtn} ${role === 'USER' ? styles.active : ''}`}
                                onClick={() => setRole('USER')}
                            >
                                <span className={styles.roleIcon}>🏠</span>
                                <span>{labels.bookChalets}</span>
                            </button>
                            <button
                                type="button"
                                className={`${styles.roleBtn} ${role === 'HOST' ? styles.active : ''}`}
                                onClick={() => setRole('HOST')}
                            >
                                <span className={styles.roleIcon}>🔑</span>
                                <span>{labels.listProperty}</span>
                            </button>
                        </div>
                    </div>

                    <button type="submit" className={`${styles.authBtn} ${styles.authBtnPrimary}`} disabled={loading}>
                        {loading ? (
                            <LoadingSpinner size={20} color="white" />
                        ) : (
                            <>
                                {labels.createAccount}
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <div className={styles.authDivider}>
                    <span>{labels.orContinueWith}</span>
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
                    {labels.continueWithGoogle}
                </button>

                <p className={styles.authSwitch}>
                    {labels.haveAccount}{' '}
                    <Link href={`/${lang}/login`}>{labels.signIn}</Link>
                </p>
            </div>
        </div>
    );
}
