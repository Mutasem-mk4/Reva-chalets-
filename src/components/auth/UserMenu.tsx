'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { User, LogOut, LayoutDashboard, Settings, ChevronDown } from '@/components/ui/Icons';
import styles from './UserMenu.module.css';

interface UserMenuProps {
    lang: string;
    isAr: boolean;
    dict: any;
}

export default function UserMenu({ lang, isAr, dict }: UserMenuProps) {
    const { user, signOut, loading } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    if (loading) return <div className={styles.skeleton} />;

    if (!user) {
        return (
            <div className={styles.guestActions}>
                <Link href={`/${lang}/login`} className={styles.loginLink}>
                    {isAr ? 'دخول' : 'Login'}
                </Link>
                <Link href={`/${lang}/signup`} className={styles.signupBtn}>
                    {isAr ? 'حساب جديد' : 'Sign Up'}
                </Link>
            </div>
        );
    }

    return (
        <div className={styles.userMenu}>
            <button
                className={styles.trigger}
                onClick={() => setIsOpen(!isOpen)}
                onBlur={() => setTimeout(() => setIsOpen(false), 200)}
            >
                <div className={styles.avatar}>
                    {user.user_metadata?.avatar_url ? (
                        <img src={user.user_metadata.avatar_url} alt="" />
                    ) : (
                        <User size={18} />
                    )}
                </div>
                <span className={styles.userName}>{user.user_metadata?.name || user.email}</span>
                <ChevronDown size={14} className={`${styles.chevron} ${isOpen ? styles.open : ''}`} />
            </button>

            {isOpen && (
                <div className={styles.dropdown} dir={isAr ? 'rtl' : 'ltr'}>
                    <Link href={`/${lang}/dashboard`} className={styles.menuItem}>
                        <LayoutDashboard size={18} />
                        <span>{isAr ? 'لوحة التحكم' : 'Dashboard'}</span>
                    </Link>
                    <Link href={`/${lang}/guest/profile`} className={styles.menuItem}>
                        <Settings size={18} />
                        <span>{isAr ? 'الإعدادات' : 'Settings'}</span>
                    </Link>
                    <div className={styles.divider} />
                    <button onClick={() => signOut()} className={`${styles.menuItem} ${styles.logout}`}>
                        <LogOut size={18} />
                        <span>{isAr ? 'خروج' : 'Logout'}</span>
                    </button>
                </div>
            )}
        </div>
    );
}
