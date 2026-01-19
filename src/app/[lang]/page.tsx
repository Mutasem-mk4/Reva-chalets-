import { getDictionary } from '@/lib/dictionaries';
import { getChalets } from '@/lib/data';
import ChaletCard from '@/components/features/ChaletCard';
import Link from 'next/link';
import styles from '@/styles/home.module.css';
import ScrollReveal from '@/components/ui/ScrollReveal';
import ParallaxHero from '@/components/ui/ParallaxHero';
import TestimonialsCarousel from '@/components/features/TestimonialsCarousel';
import FeaturedAs from '@/components/features/FeaturedAs';
import StatsCounter from '@/components/features/StatsCounter';
import RecentlyViewed from '@/components/features/RecentlyViewed';
import { ArrowRight } from '@/components/ui/Icons';
import { DotPattern } from '@/components/ui/Patterns';

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = getDictionary(lang);
  const chalets = await getChalets();

  return (
    <div className={styles.homePage}>
      {/* Parallax Hero Section */}
      <ParallaxHero
        title={dict.home.heroTitle}
        subtitle={dict.home.heroSubtitle}
        ctaText={dict.nav.bookNow}
        ctaHref={`/${lang}/chalets`}
      />

      {/* Recently Viewed (only shows if there are viewed items) */}
      <RecentlyViewed lang={lang} />

      {/* Featured As Section */}
      <ScrollReveal delay={0.1}>
        <FeaturedAs />
      </ScrollReveal>

      {/* Stats Counter */}
      <ScrollReveal>
        <StatsCounter />
      </ScrollReveal>

      {/* Featured Section */}
      <section className={`${styles.featured} ${styles.bgFaded} relative overflow-hidden`}>
        <DotPattern opacity={0.05} color="hsl(var(--primary))" />
        <div className="container relative z-10">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{dict.home.featured}</h2>
            <Link href={`/${lang}/chalets`} className={styles.viewAll}>
              {dict.home.viewAll} <ArrowRight size={18} />
            </Link>
          </div>

          <div className={styles.chaletGrid}>
            {chalets.map((chalet, idx) => (
              <ScrollReveal key={chalet.id} delay={idx * 0.1}>
                <ChaletCard chalet={chalet} lang={lang} dict={dict} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <ScrollReveal delay={0.2}>
        <TestimonialsCarousel />
      </ScrollReveal>
    </div>
  );
}



