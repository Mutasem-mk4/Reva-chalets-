
import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Dimensions, Image, Animated, Easing } from 'react-native';
import GoldenCard from './components/GoldenCard';
import CategoryGrid from './components/CategoryGrid';
import RecommendedList from './components/RecommendedList';
import SearchBar from './components/SearchBar';
import BottomNavigation from './components/BottomNavigation';
import RewardsView from './components/RewardsView';
import TripsView from './components/TripsView';
import SavedView from './components/SavedView';
import AccountView from './components/AccountView';
import { LayoutGrid, Bell, UserCircle } from 'lucide-react-native';

import ChatView from './components/ChatView';
import SearchView from './components/SearchView';
import ChaletDetailsView from './components/ChaletDetailsView';
import BookingView from './components/BookingView';
import RatingView from './components/RatingView';
import WelcomeView from './components/WelcomeView';
import LoginView from './components/LoginView';
import { api } from './lib/api';

const { width } = Dimensions.get('window');

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [lang, setLang] = useState('ar'); // 'en' or 'ar'
  const isAr = lang === 'ar';

  const [chatBookingId, setChatBookingId] = useState(null); // If set, shows Chat Overlay
  const [isSearching, setIsSearching] = useState(false); // If true, shows Search Overlay
  const [selectedChaletId, setSelectedChaletId] = useState(null); // If set, shows Details Overlay
  const [bookingChalet, setBookingChalet] = useState(null); // If set, shows Booking Form
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [ratingChalet, setRatingChalet] = useState(null); // If set, shows Rating Form

  // Golden Card State
  const [goldenCardData, setGoldenCardData] = useState(null);

  useEffect(() => {
    loadGoldenCard();
  }, [isLoggedIn]); // Reload if login status changes

  const loadGoldenCard = async () => {
    // If not logged in, show default or empty state
    // For now, we fetch generic status or rely on API to handle guest/user
    const data = await api.getGoldenCardStatus();
    setGoldenCardData(data);
  };

  // Splash Screen Logic
  React.useEffect(() => {
    // 1. Start Reveal Animation
    Animated.timing(revealAnim, {
      toValue: 1, // 100% width
      duration: 1200, // 1.2s "Writing" duration
      useNativeDriver: false, // width doesn't support native driver
      easing: Easing.out(Easing.ease),
    }).start(() => {
      // 2. Hide Splash after animation + pause
      setTimeout(() => {
        setShowSplash(false);
      }, 500);
    });
  }, []);

  // Calculate header style based on active tab
  const isHome = activeTab === 'home';
  const headerPadding = isHome ? 260 : 30; // 260 wraps card completely
  const headerRadius = isHome ? 40 : 24;

  if (showSplash) {
    const logoWidth = 150; // Fixed width for splash logo
    const animatedWidth = revealAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, logoWidth],
    });

    return (
      <View style={styles.splashContainer}>
        <StatusBar style="light" />
        {/* Masking Container */}
        <Animated.View style={[styles.splashMask, { width: animatedWidth }]}>
          <Image
            source={require('./assets/splash_logo.png')}
            style={[styles.splashLogo, { width: logoWidth }]}
            resizeMode="contain"
          />
        </Animated.View>
        {/* Ghost Image (Optional: slightly visible track, or just Keep clean) */}
      </View>
    );
  }

  if (!isOnboarded) {
    if (showLogin) {
      return (
        <LoginView
          lang={lang}
          onBack={() => setShowLogin(false)}
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            setIsLoggedIn(true);
            setIsOnboarded(true);
            setShowLogin(false);
          }}
        />
      );
    }

    return (
      <WelcomeView
        currentLang={lang}
        setLang={setLang}
        onFinish={(type) => {
          if (type === 'login') {
            setShowLogin(true);
          } else {
            setIsLoggedIn(false);
            setIsOnboarded(true);
          }
        }}
      />
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: isHome ? 120 : 100 }]}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >

        {/* Dynamic Dark Green Header */}
        <View style={[
          styles.headerSection,
          {
            paddingBottom: headerPadding,
            borderBottomLeftRadius: headerRadius,
            borderBottomRightRadius: headerRadius
          }
        ]}>
          <View style={styles.topBar}>
            <LayoutGrid color="white" size={28} />
            <Image
              source={require('./assets/riva_logo_final.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Bell color="#FBBF24" fill="#FBBF24" size={28} />
          </View>

          <View style={[styles.greetingContainer, isAr && { flexDirection: 'row-reverse' }]}>
            <View style={styles.avatarPlaceholder}>
              <UserCircle color="#E2E8F0" size={48} fill="#E2E8F0" />
            </View>
            <View style={isAr && { alignItems: 'flex-end' }}>
              <Text style={styles.helloText}>{isAr ? 'أهلاً بك' : 'Hello'}</Text>
              <Text style={styles.userName}>{currentUser ? currentUser.name : (isAr ? 'ضيف' : 'Guest')}</Text>
            </View>
          </View>
        </View>

        {isHome && (
          <>
            {/* Overlapping Content (Golden Card) */}
            <View style={styles.overlapContainer}>
              <GoldenCard
                phase={goldenCardData?.phase || 'WAITING'}
                lang={lang}
                farmName={goldenCardData?.details?.farmName || (isAr ? 'مزرعة الريف الفاخرة' : 'Al-Reef Luxury Farm')}
                bookingDate={goldenCardData?.details?.date || '2025-06-15'}
                tripStartTime={goldenCardData?.details?.time || '02:00 PM'}
                farmLocation={goldenCardData?.details?.location || (isAr ? 'البحر الميت' : 'Dead Sea')}
                remainingTime={goldenCardData?.details?.remaining || (isAr ? '48 ساعة' : '48 Hours')}
                groupMembers={goldenCardData?.details?.members || 5}
                ticketCount={goldenCardData?.details?.tickets || 1}
                onRatePress={() => setRatingChalet({ id: 'chalet_123', name: isAr ? 'مزرعة الريف الفاخرة' : 'Al-Reef Luxury Farm' })}
              />
            </View>

            {/* White Content Section */}
            <View style={styles.whiteSection}>
              <SearchBar onPress={() => setIsSearching(true)} lang={lang} />

              <View style={styles.section}>
                <Text style={[styles.sectionTitle, isAr && { textAlign: 'right' }]}>
                  {isAr ? 'استكشف حسب الفئة' : 'Explore by Category'}
                </Text>
                <CategoryGrid lang={lang} />
              </View>

              <View style={styles.section}>
                <Text style={[styles.sectionTitle, isAr && { textAlign: 'right' }]}>
                  {isAr ? 'مقترح لك' : 'Recommended'}
                </Text>
                <RecommendedList
                  lang={lang}
                  onSelect={(item) => setSelectedChaletId(item.id || 'chalet_123')}
                />
              </View>
            </View>
          </>
        )}

        {/* Other Tabs Content - Adjusted margin */}
        {activeTab !== 'home' && (
          <View style={{ marginTop: 20 }}>
            {activeTab === 'rewards' && <RewardsView lang={lang} />}
            {activeTab === 'trips' && <TripsView lang={lang} userId={currentUser?.id} onOpenChat={(id) => setChatBookingId(id)} />}
            {activeTab === 'saved' && <SavedView lang={lang} />}
            {activeTab === 'account' && (
              <AccountView
                lang={lang}
                onLogout={() => {
                  setIsOnboarded(false);
                  setIsLoggedIn(false);
                }}
              />
            )}
          </View>
        )}

      </ScrollView>

      {/* Chat Overlay (Full Screen or Modal-like) */}
      {chatBookingId && (
        <View style={styles.chatOverlay}>
          <ChatView
            bookingId={chatBookingId}
            lang={lang}
            onClose={() => setChatBookingId(null)}
          />
        </View>
      )}

      {/* Search Overlay */}
      {isSearching && (
        <View style={styles.chatOverlay}>
          <SearchView
            onClose={() => setIsSearching(false)}
            lang={lang}
            onSelectChalet={(id) => {
              setIsSearching(false);
              setSelectedChaletId(id);
            }}
          />
        </View>
      )}

      {/* Details Overlay */}
      {selectedChaletId && (
        <View style={styles.chatOverlay}>
          <ChaletDetailsView
            chaletId={selectedChaletId}
            onClose={() => setSelectedChaletId(null)}
            lang={lang}
            onStartBooking={(chalet) => {
              setSelectedChaletId(null);
              setBookingChalet(chalet);
            }}
          />
        </View>
      )}

      {/* Booking Overlay */}
      {bookingChalet && (
        <View style={styles.chatOverlay}>
          <BookingView
            chalet={bookingChalet}
            onClose={() => setBookingChalet(null)}
            lang={lang}
            onBookingSuccess={() => {
              setBookingChalet(null);
              setActiveTab('trips'); // Jump to trips to see the new booking
            }}
          />
        </View>
      )}

      {/* Rating Overlay */}
      {ratingChalet && (
        <View style={styles.chatOverlay}>
          <RatingView
            chaletId={ratingChalet.id}
            chaletName={ratingChalet.name}
            onClose={() => setRatingChalet(null)}
            lang={lang}
            onRatingSuccess={() => {
              setRatingChalet(null);
              setActiveTab('rewards'); // Redirect to rewards to see unlocked Kaif coupons
            }}
          />
        </View>
      )}

      {/* Bottom Navigation */}
      {!chatBookingId && <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} lang={lang} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  chatOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100, // Above everything
    backgroundColor: '#F3F4F6',
  },
  headerSection: {
    backgroundColor: '#1B3B36',
    paddingTop: 60,
    paddingBottom: 260, // Massive header to wrap card
    paddingHorizontal: 20,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    width: '100%', // ensures justifying space between works
  },
  logoImage: {
    width: 220,
    height: 80,
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  helloText: {
    color: '#D1D5DB',
    fontSize: 14,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  overlapContainer: {
    marginTop: -230, // Pull card HIGHER into the header
    marginBottom: 40,
  },
  whiteSection: {
    paddingTop: 10,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B3B36',
    marginBottom: 12,
  },
  splashContainer: {
    flex: 1,
    backgroundColor: '#1B3B36', // Riva Dark Green
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashMask: {
    height: 150,
    overflow: 'hidden', // Clips the content (Masking)
    alignItems: 'flex-end', // Anchors image to RIGHT (Reveals R -> L)
  },
  splashLogo: {
    height: 150,
    tintColor: '#FAF9F6',
    // Width is handled inline
  },
});
