
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

      {/* Gallery Section */}
      <div className={styles.gallerySection}>
        <div className="container">
          <ScrollReveal>
            <ImageGallery images={chalet.images} alt={chalet.name} />
          </ScrollReveal>
        </div>
      </div>

      <div className={`container ${styles.contentGrid}`}>
        <div className={styles.mainInfo}>
          <ScrollReveal delay={0.1}>
            {/* Breadcrumb Navigation */}
            <Breadcrumb
              lang={lang}
              items={[
                { label: dict.nav.chalets, href: `/${lang}/chalets` },
                { label: chalet.name }
              ]}
            />

            <h1>{chalet.name}</h1>
            <p className={styles.location}>
              <MapPin size={18} style={{ display: 'inline' }} />
              {chalet.location}
            </p>

            <div className={styles.rating}>
              <StarFilled size={16} color="#E5A61D" />
              {chalet.rating} (120 {lang === 'ar' ? 'تقييم' : 'reviews'})
            </div>

            {/* Live Viewers */}
            <div style={{ marginTop: '0.75rem' }}>
              <LiveViewers chaletId={chalet.id} />
            </div>

            <TrustBanner />

            <div className={styles.divider}></div>

            <h2>{dict.chalet.description}</h2>
            <p className={styles.description}>{chalet.description}</p>

            <div className={styles.divider}></div>

            <h2>{dict.chalet.amenities}</h2>
            <div className={styles.amenitiesList}>
              {chalet.amenities.map((am) => (
                <span key={am} className={styles.amenityItem}>
                  <Check size={14} color="#1F423A" />
                  {am}
                </span>
              ))}
            </div>

            <div className={styles.divider}></div>

            <h2>{(dict.chalet as any).guestReviews || 'Guest Reviews'}</h2>
            <ReviewList reviews={chalet.reviews} />
            <ReviewForm chaletId={chalet.id} chaletName={chalet.name} />

            <div className={styles.divider}></div>

            <h2>{(dict.chalet as any).thingsToKnow || 'Things to Know'}</h2>
            <div className={styles.policies}>
              <div className={styles.policyItem}>
                <strong>{(dict.chalet as any).checkIn || 'Check-in'}</strong>: {(dict.chalet as any).checkInTime || '15:00 onwards'}
              </div>
              <div className={styles.policyItem}>
                <strong>{(dict.chalet as any).checkOut || 'Check-out'}</strong>: {(dict.chalet as any).checkOutTime || 'Before 11:00'}
              </div>
              <div className={styles.policyItem}>
                <strong>{(dict.chalet as any).cancellation || 'Cancellation'}</strong>: {(dict.chalet as any).cancellationPolicy || 'Free up to 48 hours before check-in.'}
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Desktop Booking Sidebar - Hidden on mobile */}
        <div className={styles.bookingSidebar}>
          <ScrollReveal delay={0.2}>
            <div className={styles.bookingCard}>
              <RecentlyBookedBadge />

              <div className={styles.priceTag}>
                <span className={styles.amount}>{chalet.price} JOD</span>
                <span className={styles.period}>/ {dict.chalet.pricePerNight}</span>
              </div>

              <BookingForm dict={dict} price={chalet.price} chaletId={chalet.id} />

              <GuaranteeBadge />

              <p className={styles.hint}>{(dict.chalet as any).noPayment || 'No payment required today.'}</p>
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
