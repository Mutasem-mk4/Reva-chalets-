import { getDictionary } from '@/lib/dictionaries';
import { getChalets } from '@/lib/data';
import styles from '@/styles/chalets.module.css';
import ChaletListClient from '@/components/features/ChaletListClient';

export default async function ChaletsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = getDictionary(lang);
  const chalets = await getChalets();

  return (
    <div className={`container ${styles.pageContainer}`}>
      <h1 className={styles.pageTitle}>{dict.nav.chalets}</h1>

      <ChaletListClient chalets={chalets} lang={lang} dict={dict} />
    </div>
  );
}
