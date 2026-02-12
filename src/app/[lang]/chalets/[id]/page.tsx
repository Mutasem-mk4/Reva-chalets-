
import { getDictionary } from '@/lib/dictionaries';
import { getChaletById, getChalets } from '@/lib/data';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import BookingForm from '@/components/features/BookingForm';
import TrustBanner from '@/components/features/TrustBanner';
import ReviewList from '@/components/features/ReviewList';
import ReviewForm from '@/components/features/ReviewForm';
import MobileBookingBar from '@/components/features/MobileBookingBar';
import ImageGallery from '@/components/ui/ImageGallery';
import Breadcrumb from '@/components/ui/Breadcrumb';
import ScrollReveal from '@/components/ui/ScrollReveal';
import LiveViewers from '@/components/features/LiveViewers';
import StickyPriceBarWrapper from '@/components/features/StickyPriceBarWrapper';
import ViewedTracker from '@/components/features/ViewedTracker';
import Recommendations from '@/components/features/Recommendations';
import { GuaranteeBadge, RecentlyBookedBadge } from '@/components/features/TrustSignals';
import { MapPin, StarFilled, Check } from '@/components/ui/Icons';
import styles from '@/styles/chalets.module.css';

import type { Metadata, ResolvingMetadata } from 'next';

export async function generateMetadata(
  { params }: { params: Promise<{ lang: string, id: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { lang, id } = await params;
  const chalet = await getChaletById(id);

  if (!chalet) {
    return {
      title: 'Chalet Not Found | Riva Chalets',
    };
  }

  const previousImages = (await parent).openGraph?.images || [];
  const title = lang === 'ar' ? `${chalet.name} | ريفا شاليهات` : `${chalet.name} | Riva Chalets`;
  const description = chalet.description.substring(0, 160) + '...';

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: [chalet.images[0], ...previousImages],
      locale: lang === 'ar' ? 'ar_JO' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [chalet.images[0]],
    },
    alternates: {
      canonical: `https://riva-jo.me/${lang}/chalets/${id}`,
      languages: {
        'en': `https://riva-jo.me/en/chalets/${id}`,
        'ar': `https://riva-jo.me/ar/chalets/${id}`,
      },
    },
  };
}

export default async function ChaletDetailPage({ params }: { params: Promise<{ lang: string, id: string }> }) {
  const { lang, id } = await params;
  const dict = getDictionary(lang);
  const chalet = await getChaletById(id);
  const allChalets = await getChalets();

  if (!chalet) {
    notFound();
  }

  return (
    <div className="chalet-detail" style={{ background: 'var(--color-cream)' }}>
      {/* Track this view */}
      <ViewedTracker chaletId={chalet.id} chaletName={chalet.name} chaletImage={chalet.images[0]} chaletPrice={chalet.price} />
      {/* Sticky Price Bar */}
      <StickyPriceBarWrapper chaletName={chalet.name} price={chalet.price} rating={chalet.rating} />

      {/* Hero Gallery Section - Immersive Top */}
      <div className={styles.heroGallery}>
        <div className="container">
          <ScrollReveal>
            <ImageGallery images={chalet.images} alt={chalet.name} />
          </ScrollReveal>
        </div>
      </div>

      <div className={`container ${styles.contentGrid}`}>
        <div className={styles.mainContent}>
          <ScrollReveal delay={0.1}>
            {/* Breadcrumb Navigation */}
            <div className={styles.breadcrumbWrapper}>
              <Breadcrumb
                lang={lang}
                items={[
                  { label: dict.nav.chalets, href: `/${lang}/chalets` },
                  { label: chalet.name }
                ]}
              />
            </div>

            <header className={styles.chaletHeader}>
              <h1>{chalet.name}</h1>
              <div className={styles.metaRow}>
                <p className={styles.location}>
                  <MapPin size={18} />
                  {chalet.location}
                </p>
                <div className={styles.ratingBadge}>
                  <StarFilled size={16} color="#B45309" />
                  <span>{chalet.rating}</span>
                  <span className={styles.reviewCount}>(120 {lang === 'ar' ? 'تقييم' : 'reviews'})</span>
                </div>
              </div>
            </header>

            {/* Live Viewers */}
            <div className={styles.liveViewersWrapper}>
              <LiveViewers chaletId={chalet.id} />
            </div>

            <TrustBanner />

            <div className={styles.divider}></div>

            <section className={styles.section}>
              <h2>{dict.chalet.description}</h2>
              <p className={styles.description}>{chalet.description}</p>
            </section>

            <div className={styles.divider}></div>

            <section className={styles.section}>
              <h2>{dict.chalet.amenities}</h2>
              <div className={styles.amenitiesList}>
                {chalet.amenities.map((am) => (
                  <span key={am} className={styles.amenityItem}>
                    <div className={styles.checkIcon}><Check size={12} color="white" /></div>
                    {am}
                  </span>
                ))}
              </div>
            </section>

            <div className={styles.divider}></div>

            <section className={styles.section}>
              <h2>{(dict.chalet as any).guestReviews || 'Guest Reviews'}</h2>
              <ReviewList reviews={chalet.reviews} />
              <ReviewForm chaletId={chalet.id} chaletName={chalet.name} />
            </section>

            <div className={styles.divider}></div>

            <section className={styles.section}>
              <h2>{(dict.chalet as any).thingsToKnow || 'Things to Know'}</h2>
              <div className={styles.policiesGrid}>
                <div className={styles.policyCard}>
                  <span className={styles.policyLabel}>{(dict.chalet as any).checkIn || 'Check-in'}</span>
                  <span className={styles.policyValue}>{(dict.chalet as any).checkInTime || '15:00 onwards'}</span>
                </div>
                <div className={styles.policyCard}>
                  <span className={styles.policyLabel}>{(dict.chalet as any).checkOut || 'Check-out'}</span>
                  <span className={styles.policyValue}>{(dict.chalet as any).checkOutTime || 'Before 11:00'}</span>
                </div>
                <div className={`${styles.policyCard} ${styles.fullWidth}`}>
                  <span className={styles.policyLabel}>{(dict.chalet as any).cancellation || 'Cancellation'}</span>
                  <span className={styles.policyValue}>{(dict.chalet as any).cancellationPolicy || 'Free up to 48 hours before check-in.'}</span>
                </div>
              </div>
            </section>
          </ScrollReveal>
        </div>

        {/* Desktop Booking Sidebar - Floating Glass Effect */}
        <div className={styles.bookingSidebar}>
          <ScrollReveal delay={0.2}>
            <div className={styles.floatingBookingCard}>
              <RecentlyBookedBadge />

              <div className={styles.priceHeader}>
                <div className={styles.priceWrapper}>
                  <span className={styles.amount}>{chalet.price} JOD</span>
                  <span className={styles.period}>/ {dict.chalet.pricePerNight}</span>
                </div>
                <div className={styles.miniRating}>
                  <StarFilled size={14} color="#B45309" /> {chalet.rating}
                </div>
              </div>

              <BookingForm dict={dict} price={chalet.price} chaletId={chalet.id} locale={lang} />

              <div className={styles.cardFooter}>
                <GuaranteeBadge />
                <p className={styles.hint}>{(dict.chalet as any).noPayment || 'No payment required today'}</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Personalized Recommendations */}
      <div className="container">
        <Recommendations
          currentChaletId={chalet.id}
          currentLocation={chalet.location}
          allChalets={allChalets}
          lang={lang}
        />
      </div>

      {/* Mobile Booking Bar - Only shows on mobile */}
      <MobileBookingBar dict={dict} price={chalet.price} chaletId={chalet.id} />
    </div>
  );
}
