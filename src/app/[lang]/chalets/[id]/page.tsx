
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
    <div className="chalet-detail">
      {/* Track this view */}
      <ViewedTracker chaletId={chalet.id} chaletName={chalet.name} chaletImage={chalet.images[0]} chaletPrice={chalet.price} />
      {/* Sticky Price Bar */}
      <StickyPriceBarWrapper chaletName={chalet.name} price={chalet.price} rating={chalet.rating} />
      {/* Gallery Section */}
      <div className={styles.gallerySection}>
        <div className="container">
          <ImageGallery images={chalet.images} alt={chalet.name} />
        </div>
      </div>

      <div className={`container ${styles.contentGrid}`}>
        <div className={styles.mainInfo}>
          {/* Breadcrumb Navigation */}
          <Breadcrumb
            lang={lang}
            items={[
              { label: lang === 'ar' ? 'الشاليهات' : 'Chalets', href: `/${lang}/chalets` },
              { label: chalet.name }
            ]}
          />

          <h1>{chalet.name}</h1>
          <p className={styles.location}>
            <MapPin size={18} style={{ display: 'inline', marginRight: '0.25rem' }} />
            {chalet.location}
          </p>

          <div className={styles.rating}>
            <StarFilled size={16} color="#f5a623" style={{ display: 'inline', marginRight: '0.25rem' }} />
            {chalet.rating} (120 reviews)
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
                <Check size={14} style={{ display: 'inline', marginRight: '0.4rem' }} />
                {am}
              </span>
            ))}
          </div>

          <div className={styles.divider}></div>

          <h2>Guest Reviews</h2>
          <ReviewList reviews={chalet.reviews} />
          <ReviewForm chaletId={chalet.id} chaletName={chalet.name} />

          <div className={styles.divider}></div>

          <h2>Things to Know</h2>
          <div className={styles.policies}>
            <div className={styles.policyItem}>
              <strong>Check-in</strong>: 15:00 onwards
            </div>
            <div className={styles.policyItem}>
              <strong>Check-out</strong>: Before 11:00
            </div>
            <div className={styles.policyItem}>
              <strong>Cancellation</strong>: Free up to 48 hours before check-in.
            </div>
          </div>
        </div>

        {/* Desktop Booking Sidebar - Hidden on mobile */}
        <div className={styles.bookingSidebar}>
          <div className={styles.bookingCard}>
            <RecentlyBookedBadge />

            <div className={styles.priceTag}>
              <span className={styles.amount}>{chalet.price} JOD</span>
              <span className={styles.period}>/ {dict.chalet.pricePerNight}</span>
            </div>

            <BookingForm dict={dict} price={chalet.price} />

            <GuaranteeBadge />

            <p className={styles.hint}>No payment required today.</p>
          </div>
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
      <MobileBookingBar dict={dict} price={chalet.price} />
    </div>
  );
}

