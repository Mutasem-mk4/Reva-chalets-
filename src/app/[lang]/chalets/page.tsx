import { getDictionary } from '@/lib/dictionaries';
import { getChalets } from '@/lib/data';
import styles from '@/styles/chalets.module.css';
import ChaletListClient from '@/components/features/ChaletListClient';

export default async function ChaletsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = getDictionary(lang);
  const chalets = await getChalets();

  return (
    <div className={styles.page}>
      {/* Mini Hero Header */}
      <div className={styles.pageHero}>
        <div className={styles.pageHeroContent}>
          <h1 className={styles.pageTitle}>{dict.nav.chalets}</h1>
          <p className={styles.pageSubtitle}>
            {lang === 'ar'
              ? 'اكتشف أفخم الشاليهات في الأردن'
              : 'Discover the finest chalets in Jordan'}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className={`container ${styles.pageContent}`}>
        <ChaletListClient chalets={chalets} lang={lang} dict={dict} />
      </div>
    </div>
  );
}
