import { getDictionary } from '@/lib/dictionaries';
import { getChalets } from '@/lib/data';
import ChaletCard from '@/components/features/ChaletCard';
import Link from 'next/link';
import styles from '@/styles/home.module.css';
import ScrollReveal from '@/components/ui/ScrollReveal';
import MobileStyleHero from '@/components/layout/MobileStyleHero';
import TestimonialsCarousel from '@/components/features/TestimonialsCarousel';
import FeaturedAs from '@/components/features/FeaturedAs';
import StatsCounter from '@/components/features/StatsCounter';
import RecentlyViewed from '@/components/features/RecentlyViewed';
import SearchBar from '@/components/features/SearchBar';
import CategoryGrid from '@/components/features/CategoryGrid';
import GoldenCard from '@/components/features/GoldenCard';
import { ArrowRight } from '@/components/ui/Icons';

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = getDictionary(lang);
  const chalets = await getChalets();

  return (
    <div className={styles.homePage}>
      {/* ═══ HERO ═══ */}
      <MobileStyleHero
        title={dict.home.heroTitle}
        subtitle={dict.home.heroSubtitle}
        ctaText={dict.nav?.bookNow || 'Book Now'}
        ctaLink={`/${lang}/chalets`}
      />

      {/* ═══ GOLDEN CARD ═══ */}
      <div className={styles.goldenCardSection}>
        <GoldenCard phase="WAITING" locale={lang} />
      </div>

      {/* ═══ SEARCH BAR ═══ */}
      <div className={styles.searchSection}>
        <SearchBar locale={lang} />
      </div>

      {/* ═══ CATEGORIES ═══ */}
      <div className={styles.sectionWrapper}>
        <CategoryGrid locale={lang} />
      </div>

      {/* ═══ RECENTLY VIEWED ═══ */}
      <RecentlyViewed lang={lang} />

      {/* ═══ SOCIAL PROOF ═══ */}
      <FeaturedAs />

      {/* ═══ STATS ═══ */}
      <StatsCounter locale={lang} />

      {/* ═══ FEATURED CHALETS ═══ */}
      <section className={`${styles.featured} ${styles.bgFaded}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{dict.home.featured}</h2>
            <Link href={`/${lang}/chalets`} className={styles.viewAll}>
              {dict.home.viewAll} <ArrowRight size={18} />
            </Link>
          </div>

          <div className={styles.chaletGrid}>
            {chalets.map((chalet) => (
              <ScrollReveal key={chalet.id}>
                <ChaletCard chalet={chalet} lang={lang} dict={dict} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <TestimonialsCarousel lang={lang} />
    </div>
  );
}
