
import { getDictionary } from '@/lib/dictionaries';
import { getPartners } from '@/lib/data';
import RewardCard from '@/components/features/RewardCard';
import styles from '@/styles/referral.module.css';

export default async function RewardsPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const dict = getDictionary(lang);
    const partners = await getPartners();

    return (
        <div className={`container ${styles.pageContainer}`}>
            <div className={styles.header}>
                <h1 className={styles.title}>Reva VIP Club</h1>
                <p className={styles.subtitle}>Exclusive discounts for our valued guests</p>
            </div>

            <div className={styles.rewardsGrid}>
                {partners.map(partner => (
                    <RewardCard key={partner.id} partner={partner} dict={dict} />
                ))}
            </div>
        </div>
    );
}
