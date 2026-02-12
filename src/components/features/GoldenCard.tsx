'use client';

import React from 'react';
import styles from './GoldenCard.module.css';
import { MapPin, Calendar, Clock, Lock, Users, Ticket, Plus, Crown, Star } from '@/components/ui/Icons';

export type BookingPhase =
    | 'LOCKED'          // لم يحجز بعد
    | 'WAITING'         // حجز ولم يحن الوقت
    | 'ZAD'             // حجز مع ميزات زاد
    | 'CHILLING'        // خلال وقت الحجز
    | 'PASSED';         // انتهى الحجز

interface GoldenCardProps {
    phase?: BookingPhase;
    farmName?: string;
    bookingDate?: string;
    tripStartTime?: string;
    farmLocation?: string;
    remainingTime?: string;
    groupMembers?: number;
    ticketCount?: number;
    locale?: string;
    onRatePress?: () => void;
    onChatClick?: () => void;
}

export default function GoldenCard({
    phase = 'WAITING',
    locale = 'ar',
    onRatePress,
    onChatClick
}: GoldenCardProps) {
    const isAr = locale === 'ar';

    // Localized Defaults
    const displayFarmName = farmName || (isAr ? 'مزرعة الريف الفاخرة' : 'Al-Reef Luxury Farm');
    const displayBookingDate = bookingDate || '2025-06-15';
    const displayTripStartTime = tripStartTime || '02:00 PM';
    const displayFarmLocation = farmLocation || (isAr ? 'البحر الميت' : 'Dead Sea');
    const displayRemainingTime = remainingTime || (isAr ? '48 ساعة' : '48 Hours');

    const renderPassContent = () => {
        const ActiveDot = () => (
            <div className={styles.activeHeader}>
                <div className={styles.dotContainer}>
                    <div className={`${styles.dot} ${styles.dotActive}`} />
                </div>
                <span className={styles.statusLabel}>{isAr ? 'نشط' : 'Active'}</span>
            </div>
        );

        switch (phase) {
            case 'LOCKED':
                return (
                    <>
                        <div className={`${styles.badge} ${styles.badgeMissing}`}>
                            <span className={styles.badgeText}>{isAr ? 'مكافآت مفقودة' : 'Missing Rewards'}</span>
                        </div>
                        <div className={styles.centerContent}>
                            <span className={styles.mainStatusText}>{isAr ? 'غير مفعلة' : 'Inactive'}</span>
                            <span className={styles.subStatusText}>{isAr ? 'أكمل رحلتك السابقة للتفعيل' : 'Complete previous trip to unlock'}</span>
                        </div>
                        <div className={styles.iconsRow}>
                            <div className={styles.iconBox} style={{ backgroundColor: '#FFAB91' }}>
                                <Lock size={14} color="white" />
                            </div>
                            <div className={styles.iconBox} style={{ backgroundColor: '#9FA8DA' }}>
                                <Lock size={14} color="white" />
                            </div>
                        </div>
                    </>
                );

            case 'WAITING':
                return (
                    <>
                        <ActiveDot />
                        <div className={`${styles.badge} ${styles.badgeWaiting}`}>
                            <Lock size={12} color="#BF360C" />
                            <span className={styles.badgeText}>{isAr ? 'يفتح قريباً' : 'Opens soon'}</span>
                        </div>
                        <div className={styles.avatarSection}>
                            <Crown size={18} className={styles.crown} />
                            <div className={styles.avatarCircle}>
                                <Users size={20} />
                            </div>
                        </div>
                        <div className={styles.groupWithStats}>
                            <div className={styles.groupRow}>
                                <div className={styles.membersOverlap}>
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className={styles.miniAvatar} style={{ left: `${(i - 1) * 12}px`, zIndex: i }}>
                                            <Users size={8} color="#1B3B36" />
                                        </div>
                                    ))}
                                    <Plus size={10} color="#1B3B36" style={{ position: 'absolute', left: '50px', top: '4px' }} />
                                </div>
                            </div>
                            <div className={styles.bottomStatsRow}>
                                <div className={styles.statBox}>
                                    <Users size={10} color="#1B3B36" />
                                    <span>{groupMembers}</span>
                                </div>
                                <div className={`${styles.statBox} ${styles.ticketBox}`}>
                                    <Ticket size={10} color="#E05D44" />
                                    <span>{ticketCount}</span>
                                </div>
                            </div>
                        </div>
                    </>
                );

            case 'ZAD':
                return (
                    <>
                        <ActiveDot />
                        <div className={`${styles.badge} ${styles.badgeZad}`}>
                            <Plus size={14} color="white" />
                            <span className={styles.badgeText} style={{ color: 'white' }}>{isAr ? 'مكافآت زاد' : 'Zad rewards'}</span>
                        </div>
                        <div className={styles.avatarSection}>
                            <Crown size={18} className={styles.crown} />
                            <div className={styles.avatarCircle}>
                                <Users size={20} />
                            </div>
                        </div>
                        <div className={styles.groupWithStats}>
                            <div className={styles.groupRow}>
                                <div className={styles.membersOverlap}>
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className={styles.miniAvatar} style={{ left: `${(i - 1) * 12}px`, zIndex: i }}>
                                            <Users size={8} color="#1B3B36" />
                                        </div>
                                    ))}
                                    <Plus size={10} color="#1B3B36" style={{ position: 'absolute', left: '50px', top: '4px' }} />
                                </div>
                            </div>
                            <div className={styles.bottomStatsRow}>
                                <div className={styles.statBox}>
                                    <Users size={10} color="#1B3B36" />
                                    <span>{groupMembers}</span>
                                </div>
                                <div className={`${styles.statBox} ${styles.ticketBox}`}>
                                    <Ticket size={10} color="#E05D44" />
                                    <span>{ticketCount}</span>
                                </div>
                            </div>
                        </div>
                    </>
                );

            case 'CHILLING':
                return (
                    <>
                        <ActiveDot />
                        <div className={`${styles.badge} ${styles.badgeChilling}`}>
                            <span className={styles.badgeText}>{isAr ? 'وقت استرخاء' : 'Chill Phase'}</span>
                        </div>
                        <div className={styles.avatarSection}>
                            <Crown size={18} className={styles.crown} />
                            <div className={styles.avatarCircle}>
                                <Users size={20} />
                            </div>
                        </div>
                        <div className={styles.groupWithStats}>
                            <div className={styles.groupRow}>
                                <div className={styles.membersOverlap}>
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className={styles.miniAvatar} style={{ left: `${(i - 1) * 12}px`, zIndex: i }}>
                                            <Users size={8} color="#1B3B36" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className={styles.bottomStatsRow}>
                                <div className={styles.statBox}>
                                    <Users size={10} color="#1B3B36" />
                                    <span>{groupMembers}</span>
                                </div>
                                <div className={`${styles.statBox} ${styles.ticketBox}`}>
                                    <Ticket size={10} color="#E05D44" />
                                    <span>{ticketCount}</span>
                                </div>
                            </div>
                        </div>
                    </>
                );

            case 'PASSED':
                return (
                    <>
                        <div className={styles.passedHeader}>
                            <div className={styles.dotContainer}>
                                <div className={`${styles.dot} ${styles.dotPassed}`} />
                            </div>
                            <span className={styles.statusLabel}>{isAr ? 'مكتملة' : 'Completed'}</span>
                        </div>

                        <div className={`${styles.badge} ${styles.badgeRiva}`} onClick={onRatePress}>
                            <Star size={14} color="white" fill="white" />
                            <span className={styles.badgeText} style={{ color: 'white' }}>{isAr ? 'قيّم واربح' : 'Rate & Win'}</span>
                        </div>

                        <div className={styles.avatarSection}>
                            <Crown size={18} className={styles.crown} />
                            <div className={styles.avatarCircle}>
                                <Users size={20} />
                            </div>
                        </div>
                        <div className={styles.groupWithStats}>
                            <div className={styles.bottomStatsRow}>
                                <div className={styles.statBox}>
                                    <Users size={10} color="#1B3B36" />
                                    <span>{groupMembers}</span>
                                </div>
                                <div className={`${styles.statBox} ${styles.ticketBoxRiva}`}>
                                    <Ticket size={10} color="#5B21B6" />
                                    <span style={{ color: '#5B21B6' }}>{ticketCount}</span>
                                </div>
                            </div>
                        </div>
                    </>
                );

            default:
                return null;
        }
    };

    return (
        <div className={`${styles.card} ${styles[phase.toLowerCase()]}`}>
            {/* Left Section - Trip Info */}
            <div className={styles.infoSection}>
                <div>
                    <h4 className={styles.headerText}>
                        {phase === 'PASSED'
                            ? (isAr ? 'اكتملت الرحلة' : 'Trip Completed')
                            : (isAr ? 'رحلتك القادمة' : 'Your upcoming trip')}
                    </h4>
                    <h3 className={styles.farmName}>( {displayFarmName} )</h3>

                    <div className={styles.details}>
                        <div className={styles.detailRow}>
                            <Calendar size={14} color="#A7F3D0" />
                            <span className={styles.detailText}>{displayBookingDate}</span>
                        </div>
                        <div className={styles.detailRow}>
                            <Clock size={14} color="#A7F3D0" />
                            <span className={styles.detailText}>{displayTripStartTime}</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Group: Timer + Location */}
                <div className={styles.bottomLeftGroup}>
                    <div className={styles.timerBadge}>
                        <span className={styles.timerText}>
                            {phase === 'PASSED'
                                ? (isAr ? 'قيم تجربتك للمكافآت' : 'Rate us for rewards')
                                : (isAr ? `الوقت متبقي > ${displayRemainingTime}` : `Time > ${displayRemainingTime}`)}
                        </span>
                    </div>

                    <div className={styles.detailRow}>
                        <MapPin size={14} color="#A7F3D0" />
                        <span className={styles.detailText}>{displayFarmLocation}</span>
                    </div>
                </div>
            </div>

            {/* Right Section - Dynamic Pass Card */}
            <div className={styles.passSection}>
                <div className={styles.passCard}>
                    {renderPassContent()}
                </div>
            </div>
        </div>
    );
}
