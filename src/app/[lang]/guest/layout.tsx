import Link from 'next/link';
import { getDictionary } from '@/lib/dictionaries';
import styles from '@/styles/guest.module.css';

export default async function GuestLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const dict = getDictionary(lang);

    return (
        <div className={`container ${styles.guestLayout}`}>
            <aside className={styles.guestSidebar}>
                <div className={styles.userProfile}>
                    <div className={styles.avatar}>G</div>
                    <div className={styles.info}>
                        <h4>Guest User</h4>
                        <p>VIP Member</p>
                    </div>
                </div>
                <nav className={styles.guestNav}>
                    <Link href={`/${lang}/guest/wallet`} className={styles.navItem}>
                        🎫 {dict.rewards?.wallet || "My Wallet"}
                    </Link>
                    <Link href={`/${lang}/guest/trips`} className={styles.navItem}>
                        ✈️ {dict.rewards?.trips || "My Trips"}
                    </Link>
                    <Link href={`/${lang}/guest/profile`} className={styles.navItem}>
                        ⚙️ {dict.rewards?.settings || "Settings"}
                    </Link>
                </nav>
            </aside>
            <main className={styles.guestContent}>
                {children}
            </main>
        </div>
    );
}
