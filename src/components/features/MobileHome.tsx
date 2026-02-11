'use client';

import React, { useState, useEffect } from 'react';
import styles from './MobileHome.module.css';
import GoldenCard from './GoldenCard';
import SearchBar from './SearchBar';
import CategoryGrid from './CategoryGrid';
import BottomNavigation from './BottomNavigation';
import RewardsView from './RewardsView';
import ChatView from './ChatView';

interface MobileHomeProps {
  userName?: string;
  locale?: string;
}

export default function MobileHome({ userName = 'User Name', locale = 'ar' }: MobileHomeProps) {
  const [activeTab, setActiveTab] = useState('home');
  // Helper to handle switching tabs including custom 'chat' state
  const setActiveType = (tab: string) => setActiveTab(tab);

  const [goldenCardData, setGoldenCardData] = useState<any>(null);

  useEffect(() => {
    // Fetch Golden Card Status
    // For demo purposes, we can toggle phases by adding ?mock_phase=IN_PROGRESS to the window URL or just randomizing
    const fetchCard = async () => {
      try {
        const res = await fetch('/api/golden-card');
        const data = await res.json();
        setGoldenCardData(data);
      } catch (e) {
        console.error("Failed to fetch card data", e);
      }
    };
    fetchCard();
  }, []);


  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <button className={styles.menuButton} aria-label="Menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="5" cy="12" r="2" fill="currentColor" />
            <circle cx="12" cy="5" r="2" fill="currentColor" />
            <circle cx="12" cy="12" r="2" fill="currentColor" />
            <circle cx="12" cy="19" r="2" fill="currentColor" />
          </svg>
        </button>

        <div className={styles.logo}>
          <span className={styles.logoText}>Riva</span>
        </div>

        <button className={styles.notificationButton} aria-label="Notifications">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 8A6 6 0 1 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        {/* User Greeting */}
        <section className={styles.greeting}>
          <div className={styles.avatar}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="20" fill="#E8E0D0" />
              <circle cx="20" cy="16" r="8" fill="#9CA3AF" />
              <path d="M8 36c0-6.627 5.373-12 12-12s12 5.373 12 12" fill="#9CA3AF" />
            </svg>
          </div>
          <div className={styles.greetingText}>
            <span className={styles.hello}>Hello</span>
            <span className={styles.userName}>{userName}</span>
          </div>
        </section>


        {/* Golden Card */}
        {activeTab === 'home' && (
          <>
            <GoldenCard
              locale={locale}
              phase={goldenCardData?.phase}
              {...goldenCardData?.details}
              onRatePress={() => setActiveTab('rewards')}
              onChatClick={() => setActiveTab('chat')}
            />

            {/* Search Section */}
            <SearchBar locale={locale} />

            {/* Categories */}
            <CategoryGrid locale={locale} />

            {/* Recommended Section */}
            <section className={styles.recommended}>
              <h2 className={styles.sectionTitle}>Recommended</h2>
              {/* Recommended chalets will be rendered here */}
            </section>
          </>
        )}

        {/* Rewards Tab */}
        {activeTab === 'rewards' && <RewardsView locale={locale} />}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div style={{ height: '100%' }}>
            <ChatView groupId="demo-group-1" locale={locale} />
          </div>
        )}

      </main>

      {/* Bottom Navigation */}
      {activeTab !== 'chat' && (
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} locale={locale} />
      )}
    </div>
  );
}
