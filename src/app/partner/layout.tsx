import styles from '@/styles/partner.module.css';

export const metadata = {
    title: 'Reva Partner Scanner',
    description: 'Merchant Redemption Tool',
};

export default function PartnerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <div className={styles.partnerApp}>
                    <header className={styles.partnerHeader}>
                        <div className="container">
                            <span className={styles.logo}>Reva Partner</span>
                        </div>
                    </header>
                    <main>{children}</main>
                </div>
            </body>
        </html>
    );
}
