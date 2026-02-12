import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, Vibration } from 'react-native';
import { MapPin, Calendar, Clock, Lock, Users, Ticket, Plus, Crown, Star } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Phases: 'LOCKED', 'WAITING', 'ZAD', 'CHILLING', 'PASSED'

export default function GoldenCard({
    phase = 'WAITING',
    lang = 'ar', // 'en' or 'ar'
    farmName = 'مزرعة الريف الفاخرة',
    bookingDate = '2025-06-15',
    tripStartTime = '02:00 PM',
    farmLocation = 'البحر الميت',
    remainingTime = '3 أيام متبقية',
    groupMembers = 5,
    ticketCount = 1,
    onRatePress,
}) {
    const isAr = lang === 'ar';
    // Pulse Animation for 'Active' dot
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (['WAITING', 'ZAD', 'CHILLING'].includes(phase)) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.2,
                        duration: 1000,
                        useNativeDriver: true,
                        easing: Easing.inOut(Easing.ease),
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                        easing: Easing.inOut(Easing.ease),
                    }),
                ])
            ).start();
        } else {
            pulseAnim.setValue(1); // Reset if not active
        }
    }, [phase]);

    const handlePress = () => {
        Vibration.vibrate(10);
    };

    const renderPassContent = () => {
        const ActiveDot = () => (
            <View style={[styles.topStatus, isAr && { flexDirection: 'row-reverse' }]}>
                <Animated.View style={[styles.dot, styles.dotActive, { transform: [{ scale: pulseAnim }] }]} />
                <Text style={styles.statusLabel}>{isAr ? 'نشط' : 'Active'}</Text>
            </View>
        );

        switch (phase) {
            case 'LOCKED':
                return (
                    <>
                        <View style={[styles.badge, styles.badgeMissing]}>
                            <Text style={styles.badgeTextMissing}>{isAr ? 'مكافآت مفقودة' : 'Missing Rewards'}</Text>
                        </View>
                        <View style={styles.centerContent}>
                            <Text style={styles.mainStatusText}>{isAr ? 'غير مفعلة' : 'Inactive'}</Text>
                            <Text style={styles.subStatusText}>{isAr ? 'أكمل رحلتك السابقة للتفعيل' : 'Complete previous trip to unlock'}</Text>
                        </View>
                        <View style={[styles.iconsRow, isAr && { flexDirection: 'row-reverse' }]}>
                            <View style={[styles.iconBox, { backgroundColor: '#FFAB91' }]}>
                                <Lock size={14} color="white" />
                            </View>
                            <View style={[styles.iconBox, { backgroundColor: '#9FA8DA' }]}>
                                <Lock size={14} color="white" />
                            </View>
                        </View>
                    </>
                );

            case 'WAITING':
                return (
                    <>
                        <ActiveDot />
                        <View style={[styles.badge, styles.badgeWaiting]}>
                            <Lock size={12} color="#1B3B36" />
                            <Text style={styles.badgeTextWaiting}>{isAr ? 'يفتح قريباً' : 'Opens soon'}</Text>
                        </View>
                        <View style={styles.avatarSection}>
                            <Crown size={18} color="#1B3B36" style={styles.crown} />
                            <View style={styles.avatarCircle}>
                                <Users size={20} color="#1B3B36" />
                            </View>
                        </View>
                        <View style={styles.groupWithStats}>
                            <View style={styles.groupRow}>
                                <View style={[styles.membersOverlap, isAr && { flexDirection: 'row-reverse' }]}>
                                    {[1, 2, 3, 4].map((_, i) => (
                                        <View key={i} style={[styles.miniAvatar, { [isAr ? 'right' : 'left']: i * 12, zIndex: i }]}>
                                            <Users size={8} color="#1B3B36" />
                                        </View>
                                    ))}
                                    <Plus size={10} color="#1B3B36" style={{ [isAr ? 'right' : 'left']: 50, position: 'absolute', top: 4 }} />
                                </View>
                            </View>
                            <View style={[styles.bottomRow, isAr && { flexDirection: 'row-reverse' }]}>
                                <View style={[styles.statBox, isAr && { flexDirection: 'row-reverse' }]}>
                                    <Users size={10} color="#1B3B36" />
                                    <Text style={styles.statText}>{groupMembers}</Text>
                                </View>
                                <View style={[styles.statBox, styles.ticketBox, isAr && { flexDirection: 'row-reverse' }]}>
                                    <Ticket size={10} color="#E05D44" />
                                    <Text style={[styles.statText, { color: '#E05D44' }]}>{ticketCount}</Text>
                                </View>
                            </View>
                        </View>
                    </>
                );

            case 'ZAD':
                return (
                    <>
                        <ActiveDot />
                        <TouchableOpacity style={[styles.badge, styles.badgeZad, isAr && { flexDirection: 'row-reverse' }]} activeOpacity={0.8} onPress={handlePress}>
                            <Plus size={14} color="white" />
                            <Text style={styles.badgeTextWhite}>{isAr ? 'مكافآت زاد' : 'Zad rewards'}</Text>
                        </TouchableOpacity>
                        <View style={styles.avatarSection}>
                            <Crown size={18} color="#1B3B36" style={styles.crown} />
                            <View style={styles.avatarCircle}>
                                <Users size={20} color="#1B3B36" />
                            </View>
                        </View>
                        <View style={styles.groupWithStats}>
                            <View style={styles.groupRow}>
                                <View style={[styles.membersOverlap, isAr && { flexDirection: 'row-reverse' }]}>
                                    {[1, 2, 3, 4].map((_, i) => (
                                        <View key={i} style={[styles.miniAvatar, { [isAr ? 'right' : 'left']: i * 12, zIndex: i }]}>
                                            <Users size={8} color="#1B3B36" />
                                        </View>
                                    ))}
                                    <Plus size={10} color="#1B3B36" style={{ [isAr ? 'right' : 'left']: 50, position: 'absolute', top: 4 }} />
                                </View>
                            </View>
                            <View style={[styles.bottomRow, isAr && { flexDirection: 'row-reverse' }]}>
                                <View style={[styles.statBox, isAr && { flexDirection: 'row-reverse' }]}>
                                    <Users size={10} color="#1B3B36" />
                                    <Text style={styles.statText}>{groupMembers}</Text>
                                </View>
                                <View style={[styles.statBox, styles.ticketBox, isAr && { flexDirection: 'row-reverse' }]}>
                                    <Ticket size={10} color="#E05D44" />
                                    <Text style={[styles.statText, { color: '#E05D44' }]}>{ticketCount}</Text>
                                </View>
                            </View>
                        </View>
                    </>
                );

            case 'CHILLING':
                return (
                    <>
                        <ActiveDot />
                        <View style={[styles.badge, styles.badgeChilling]}>
                            <Text style={styles.badgeTextChilling}>{isAr ? 'وقت استرخاء' : 'Chill Phase'}</Text>
                        </View>
                        <View style={styles.avatarSection}>
                            <Crown size={18} color="#1B3B36" style={styles.crown} />
                            <View style={styles.avatarCircle}>
                                <Users size={20} color="#1B3B36" />
                            </View>
                        </View>
                        <View style={styles.groupWithStats}>
                            <View style={styles.groupRow}>
                                <View style={[styles.membersOverlap, isAr && { flexDirection: 'row-reverse' }]}>
                                    {[1, 2, 3, 4].map((_, i) => (
                                        <View key={i} style={[styles.miniAvatar, { [isAr ? 'right' : 'left']: i * 12, zIndex: i }]}>
                                            <Users size={8} color="#1B3B36" />
                                        </View>
                                    ))}
                                    <Plus size={10} color="#1B3B36" style={{ [isAr ? 'right' : 'left']: 50, position: 'absolute', top: 4 }} />
                                </View>
                            </View>
                            <View style={[styles.bottomRow, isAr && { flexDirection: 'row-reverse' }]}>
                                <View style={[styles.statBox, isAr && { flexDirection: 'row-reverse' }]}>
                                    <Users size={10} color="#1B3B36" />
                                    <Text style={styles.statText}>{groupMembers}</Text>
                                </View>
                                <View style={[styles.statBox, styles.ticketBox, isAr && { flexDirection: 'row-reverse' }]}>
                                    <Ticket size={10} color="#E05D44" />
                                    <Text style={[styles.statText, { color: '#E05D44' }]}>{ticketCount}</Text>
                                </View>
                            </View>
                        </View>
                    </>
                );

            case 'PASSED':
                return (
                    <>
                        <View style={[styles.topStatus, isAr && { flexDirection: 'row-reverse' }]}>
                            <View style={[styles.dot, styles.dotPassed]} />
                            <Text style={styles.statusLabel}>{isAr ? 'مكتملة' : 'Completed'}</Text>
                        </View>
                        <TouchableOpacity style={[styles.badge, styles.badgeRiva, isAr && { flexDirection: 'row-reverse' }]} activeOpacity={0.8} onPress={onRatePress}>
                            <Star size={14} color="white" fill="white" />
                            <Text style={styles.badgeTextWhite}>{isAr ? 'قيّم واربح' : 'Rate & Win'}</Text>
                        </TouchableOpacity>
                        <View style={styles.avatarSection}>
                            <Crown size={18} color="#1B3B36" style={styles.crown} />
                            <View style={styles.avatarCircle}>
                                <Users size={20} color="#1B3B36" />
                            </View>
                        </View>
                        <View style={styles.groupWithStats}>
                            <View style={styles.groupRow}>
                                <View style={[styles.membersOverlap, isAr && { flexDirection: 'row-reverse' }]}>
                                    {[1, 2, 3, 4].map((_, i) => (
                                        <View key={i} style={[styles.miniAvatar, { [isAr ? 'right' : 'left']: i * 12, zIndex: i }]}>
                                            <Users size={8} color="#1B3B36" />
                                        </View>
                                    ))}
                                    <Plus size={10} color="#1B3B36" style={{ [isAr ? 'right' : 'left']: 50, position: 'absolute', top: 4 }} />
                                </View>
                            </View>
                            <View style={[styles.bottomRow, isAr && { flexDirection: 'row-reverse' }]}>
                                <View style={[styles.statBox, isAr && { flexDirection: 'row-reverse' }]}>
                                    <Users size={10} color="#1B3B36" />
                                    <Text style={styles.statText}>{groupMembers}</Text>
                                </View>
                                <View style={[styles.statBox, styles.ticketBoxRiva, isAr && { flexDirection: 'row-reverse' }]}>
                                    <Ticket size={10} color="#5B21B6" />
                                    <Text style={[styles.statText, { color: '#5B21B6' }]}>{ticketCount}</Text>
                                </View>
                            </View>
                        </View>
                    </>
                );

            default:
                return null;
        }
    };

    return (
        <LinearGradient
            colors={['#1F423A', '#152C25']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
        >
            {/* Left Section - Trip Info */}
            <View style={styles.infoSection}>
                <View>
                    <Text style={[styles.headerText, isAr && { textAlign: 'right' }]}>
                        {phase === 'PASSED'
                            ? (isAr ? 'اكتملت الرحلة' : 'Trip Completed')
                            : (isAr ? 'رحلتك القادمة' : 'Your upcoming trip')}
                    </Text>
                    <Text style={[styles.farmName, isAr && { textAlign: 'right' }]} numberOfLines={1} adjustsFontSizeToFit>( {farmName} )</Text>

                    <View style={[styles.details, isAr && { alignItems: 'flex-end' }]}>
                        <View style={[styles.detailRow, isAr && { flexDirection: 'row-reverse' }]}>
                            <Calendar size={14} color="#A7F3D0" />
                            <Text style={styles.detailText}>{bookingDate}</Text>
                        </View>
                        <View style={[styles.detailRow, isAr && { flexDirection: 'row-reverse' }]}>
                            <Clock size={14} color="#A7F3D0" />
                            <Text style={styles.detailText}>{tripStartTime}</Text>
                        </View>
                    </View>
                </View>

                {/* Bottom Group: Timer + Location */}
                <View style={[styles.bottomLeftGroup, isAr && { alignItems: 'flex-end' }]}>
                    <View style={styles.timerBadge}>
                        <Text style={styles.timerText}>
                            {phase === 'PASSED'
                                ? (isAr ? 'قيم تجربتك للمكافآت' : 'Rate us for rewards')
                                : (isAr ? `الوقت متبقي > ${remainingTime}` : `Time > ${remainingTime}`)}
                        </Text>
                    </View>

                    <View style={[styles.detailRow, isAr && { flexDirection: 'row-reverse' }]}>
                        <MapPin size={14} color="#A7F3D0" />
                        <Text style={styles.detailText}>{farmLocation}</Text>
                    </View>
                </View>
            </View>

            {/* Right Section - Dynamic Pass Card */}
            <View style={styles.passSection}>
                <View style={styles.passCard}>
                    {renderPassContent()}
                </View>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 24,
        padding: 16,
        marginHorizontal: 20,
        marginVertical: 10,
        flexDirection: 'row',
        minHeight: 180,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 6,
    },
    infoSection: {
        flex: 1.25,
        justifyContent: 'space-between',
        paddingRight: 10,
    },
    headerText: {
        color: '#D1FAE5',
        fontSize: 12,
        fontWeight: '500',
        marginBottom: 2,
    },
    farmName: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        lineHeight: 24,
    },
    details: {
        gap: 8,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    detailText: {
        color: '#E5E7EB',
        fontSize: 12,
        fontWeight: '500',
    },
    bottomLeftGroup: {
        marginTop: 'auto',
        gap: 8,
    },
    timerBadge: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 10,
        alignSelf: 'flex-start',
    },
    timerText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    passSection: {
        flex: 1,
        maxWidth: 130,
    },
    passCard: {
        backgroundColor: 'white',
        borderRadius: 18,
        flex: 1,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    topStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    dotActive: {
        backgroundColor: '#10B981',
    },
    dotPassed: {
        backgroundColor: '#1E3932',
    },
    statusLabel: {
        fontSize: 10,
        color: '#4B5563',
        fontWeight: '600',
    },
    badge: {
        paddingVertical: 6,
        paddingHorizontal: 8,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        width: '100%',
    },
    badgeMissing: { backgroundColor: '#A5D6A7' },
    badgeWaiting: { backgroundColor: '#FFE0B2' },
    badgeZad: { backgroundColor: '#E05D44' },
    badgeChilling: { backgroundColor: '#B2DFDB' },
    badgeRiva: { backgroundColor: '#D1C4E9' },

    badgeTextMissing: { color: '#1B3B36', fontSize: 9, fontWeight: 'bold' },
    badgeTextWaiting: { color: '#BF360C', fontSize: 10, fontWeight: 'bold' },
    badgeTextWhite: { color: 'white', fontSize: 10, fontWeight: 'bold' },
    badgeTextChilling: { color: '#004D40', fontSize: 10, fontWeight: 'bold' },

    centerContent: {
        alignItems: 'center',
        gap: 2,
    },
    mainStatusText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    subStatusText: {
        fontSize: 8,
        color: '#6B7280',
        marginTop: 4,
        textAlign: 'center',
    },
    avatarSection: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
    },
    crown: {
        marginBottom: -6,
        zIndex: 10,
    },
    avatarCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#1B3B36',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F3F4F6',
    },
    groupWithStats: {
        width: '100%',
        gap: 8,
    },
    groupRow: {
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    membersOverlap: {
        flexDirection: 'row',
        width: 60,
        height: 20,
        alignItems: 'center',
    },
    miniAvatar: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#E5E7EB',
        borderWidth: 1,
        borderColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
    },
    bottomRow: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
    },
    statBox: {
        backgroundColor: '#F3F4F6',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 6,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
    },
    ticketBox: {
        backgroundColor: '#FFEBEE',
    },
    ticketBoxRiva: {
        backgroundColor: '#F3E5F5',
    },
    statText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#374151',
    },
    iconsRow: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 8,
    },
    iconBox: {
        width: 32,
        height: 32,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
