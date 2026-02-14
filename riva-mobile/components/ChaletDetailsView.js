
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { MapPin, Star, Users, ArrowLeft, DoorOpen as Door, Share, Heart } from 'lucide-react-native';
import { api } from '../lib/api';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// Colors from Design
const COLORS = {
    primary: "#F89F1E",
    forestGreen: "#1B3028",
    forestLight: "#2D4B3F",
    backgroundLight: "#F7F3ED",
    backgroundDark: "#1A2E26",
    white: '#FFFFFF',
};

export default function ChaletDetailsView({ chaletId, onClose, onStartBooking, lang = 'ar' }) {
    const [chalet, setChalet] = useState(null);
    const [loading, setLoading] = useState(true);

    const isAr = lang === 'ar';

    useEffect(() => {
        loadChalet();
    }, [chaletId]);

    const loadChalet = async () => {
        setLoading(true);
        const data = await api.getChaletById(chaletId);
        setChalet(data);
        setLoading(false);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    if (!chalet) {
        return (
            <View style={styles.loadingContainer}>
                <Text>{isAr ? 'فشل تحميل التفاصيل' : 'Failed to load details.'}</Text>
                <TouchableOpacity onPress={onClose}><Text style={{ color: COLORS.primary, marginTop: 10 }}>{isAr ? 'إغلاق' : 'Close'}</Text></TouchableOpacity>
            </View>
        );
    }

    const images = JSON.parse(chalet.images || '[]');
    const amenities = JSON.parse(chalet.amenities || '[]');

    return (
        <View style={styles.container}>
            {/* Top Navigation Bar - Absolute */}
            <View style={styles.topNav}>
                <TouchableOpacity style={styles.circleBtn} onPress={onClose}>
                    <ArrowLeft color="white" size={24} style={isAr && { transform: [{ rotate: '180deg' }] }} />
                </TouchableOpacity>
                <View style={styles.topNavRight}>
                    <TouchableOpacity style={styles.circleBtn}>
                        <Share color="white" size={20} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.circleBtn}>
                        <Heart color="white" size={20} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 150 }} showsVerticalScrollIndicator={false}>
                {/* Image Section */}
                <View style={styles.imageContainer}>
                    <Image source={{ uri: images[0] || 'https://via.placeholder.com/400' }} style={styles.mainImage} />

                    {/* Gradient Overlay at Bottom */}
                    <LinearGradient
                        colors={['transparent', COLORS.backgroundLight]}
                        style={styles.gradientOverlay}
                    />

                    {/* Carousel Dots Indicatior (Mock) */}
                    <View style={styles.dotsContainer}>
                        <View style={[styles.dot, styles.activeDot]} />
                        <View style={styles.dot} />
                        <View style={styles.dot} />
                    </View>
                </View>

                {/* Content Section - Overlapping */}
                <View style={styles.content}>
                    {/* Header: Title and Rating */}
                    <View style={[styles.headerRow, isAr && { flexDirection: 'row-reverse' }]}>
                        <Text style={[styles.title, isAr && { textAlign: 'right' }]}>{chalet.name}</Text>
                        <View style={styles.ratingBadge}>
                            <Star size={14} fill={COLORS.primary} color={COLORS.primary} />
                            <Text style={styles.ratingText}>{chalet.rating || '4.9'}</Text>
                        </View>
                    </View>

                    {/* Location */}
                    <View style={[styles.locationRow, isAr && { flexDirection: 'row-reverse' }]}>
                        <MapPin size={18} color="#9CA3AF" />
                        <Text style={styles.locationText}>{chalet.location}</Text>
                    </View>

                    {/* Quick Stats: Guests & Rooms */}
                    <View style={[styles.statsRow, isAr && { flexDirection: 'row-reverse' }]}>
                        <View style={[styles.statItem, isAr && { flexDirection: 'row-reverse' }]}>
                            <View style={styles.statIcon}>
                                <Users size={20} color={COLORS.forestGreen} />
                            </View>
                            <View>
                                <Text style={styles.statLabel}>{isAr ? 'الضيوف' : 'Guests'}</Text>
                                <Text style={styles.statValue}>{isAr ? `يتسع لـ ${chalet.capacity}` : `Up to ${chalet.capacity}`}</Text>
                            </View>
                        </View>

                        <View style={[styles.statDivider]} />

                        <View style={[styles.statItem, isAr && { flexDirection: 'row-reverse' }]}>
                            <View style={styles.statIcon}>
                                <Door size={20} color={COLORS.forestGreen} />
                            </View>
                            <View>
                                <Text style={styles.statLabel}>{isAr ? 'الغرف' : 'Rooms'}</Text>
                                <Text style={styles.statValue}>{isAr ? `4 غرف نوم` : `4 Bedrooms`}</Text>
                            </View>
                        </View>
                    </View>

                    {/* About Section */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, isAr && { textAlign: 'right' }]}>{isAr ? 'عن المزرعة' : 'About this farm'}</Text>
                        <Text style={[styles.description, isAr && { textAlign: 'right' }]}>
                            {chalet.description}
                        </Text>
                        <TouchableOpacity>
                            <Text style={[styles.readMore, isAr && { textAlign: 'right' }]}>{isAr ? 'اقرأ المزيد' : 'Read more'}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Amenities Grid */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, isAr && { textAlign: 'right' }]}>{isAr ? 'ما يوفره المكان' : 'What this place offers'}</Text>
                        <View style={[styles.amenitiesGrid, isAr && { flexDirection: 'row-reverse' }]}>
                            {amenities.slice(0, 4).map((item, index) => (
                                <View key={index} style={[styles.amenityCard, isAr && { flexDirection: 'row-reverse' }]}>
                                    <View style={styles.amenityIcon}>
                                        <Star size={20} color={COLORS.primary} />
                                    </View>
                                    <Text style={styles.amenityText}>{item}</Text>
                                </View>
                            ))}
                        </View>
                        <TouchableOpacity style={styles.showAllBtn}>
                            <Text style={styles.showAllText}>{isAr ? 'عرض جميع الخدمات' : 'Show all amenities'}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Guest Reviews (Horizontal Scroll) */}
                    <View style={styles.section}>
                        <View style={[styles.sectionHeader, isAr && { flexDirection: 'row-reverse' }]}>
                            <Text style={styles.sectionTitle}>{isAr ? 'آراء الضيوف' : 'Guest Reviews'}</Text>
                            <Text style={styles.viewAll}>{isAr ? 'عرض الكل' : 'View all'}</Text>
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.reviewsScroll, isAr && { flexDirection: 'row-reverse' }]}>
                            <View style={styles.reviewCard}>
                                <View style={[styles.reviewHeader, isAr && { flexDirection: 'row-reverse' }]}>
                                    <Image source={{ uri: 'https://i.pravatar.cc/150?img=12' }} style={styles.avatar} />
                                    <View>
                                        <Text style={[styles.reviewerName, isAr && { textAlign: 'right' }]}>Ahmed K.</Text>
                                        <Text style={styles.reviewDate}>{isAr ? 'منذ أسبوعين' : '2 weeks ago'}</Text>
                                    </View>
                                </View>
                                <Text style={[styles.reviewText, isAr && { textAlign: 'right' }]} numberOfLines={2}>
                                    "An incredible experience! The host was very helpful and the view at sunset is breathtaking."
                                </Text>
                            </View>
                            <View style={styles.reviewCard}>
                                <View style={[styles.reviewHeader, isAr && { flexDirection: 'row-reverse' }]}>
                                    <Image source={{ uri: 'https://i.pravatar.cc/150?img=5' }} style={styles.avatar} />
                                    <View>
                                        <Text style={[styles.reviewerName, isAr && { textAlign: 'right' }]}>Sarah M.</Text>
                                        <Text style={styles.reviewDate}>{isAr ? 'منذ شهر' : '1 month ago'}</Text>
                                    </View>
                                </View>
                                <Text style={[styles.reviewText, isAr && { textAlign: 'right' }]} numberOfLines={2}>
                                    "Very clean and well maintained. The kids loved the organic farm tour."
                                </Text>
                            </View>
                        </ScrollView>
                    </View>

                </View>
            </ScrollView>

            {/* Bottom Floating Booking Bar */}
            <View style={styles.floatingFooter}>
                <View style={styles.footerContent}>
                    <View style={isAr && { alignItems: 'flex-end' }}>
                        <Text style={styles.priceLabel}>{isAr ? 'السعر لليلة' : 'Price per night'}</Text>
                        <View style={[styles.priceRow, isAr && { flexDirection: 'row-reverse' }]}>
                            <Text style={styles.priceValue}>{chalet.price}</Text>
                            <Text style={styles.currency}>{isAr ? 'ر.س' : 'JOD'}</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.floatingBookBtn} onPress={() => onStartBooking && onStartBooking(chalet)}>
                        <Text style={styles.bookBtnText}>{isAr ? 'احجز الآن' : 'Book Now'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.backgroundLight,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.backgroundLight,
    },
    topNav: {
        position: 'absolute',
        top: 40,
        left: 0,
        right: 0,
        zIndex: 50,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    topNavRight: {
        flexDirection: 'row',
        gap: 10,
    },
    circleBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        backdropFilter: 'blur(10px)', // Only works on web/native layers that support it, but nice to have
    },
    imageContainer: {
        height: 400, // 45vh approx
        width: '100%',
        position: 'relative',
    },
    mainImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    gradientOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 100,
    },
    dotsContainer: {
        position: 'absolute',
        bottom: 30,
        alignSelf: 'center',
        flexDirection: 'row',
        gap: 6,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(255,255,255,0.5)',
    },
    activeDot: {
        width: 24,
        backgroundColor: 'white',
    },
    content: {
        marginTop: -24,
        paddingHorizontal: 24,
        zIndex: 10,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    title: {
        fontSize: 26,
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto', // Ideally 'Plus Jakarta Sans'
        fontWeight: '800',
        color: COLORS.forestGreen,
        flex: 1,
        marginRight: 10,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(248, 159, 30, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 4,
    },
    ratingText: {
        fontWeight: 'bold',
        color: COLORS.primary,
        fontSize: 14,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 20,
    },
    locationText: {
        color: '#6B7280', // forest-green/60
        fontSize: 14,
        fontWeight: '500',
    },
    statsRow: {
        flexDirection: 'row',
        paddingVertical: 16,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: 'rgba(27, 48, 40, 0.05)',
        marginBottom: 24,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
    },
    statIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.white, // background-light inverted basically
        alignItems: 'center',
        justifyContent: 'center',
    },
    statLabel: {
        fontSize: 10,
        textTransform: 'uppercase',
        opacity: 0.6,
        color: COLORS.forestGreen,
        letterSpacing: 1,
    },
    statValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.forestGreen,
    },
    statDivider: {
        width: 1,
        backgroundColor: 'rgba(27, 48, 40, 0.05)',
        marginHorizontal: 16,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.forestGreen,
        marginBottom: 12,
    },
    description: {
        fontSize: 14,
        color: 'rgba(27, 48, 40, 0.7)',
        lineHeight: 22,
    },
    readMore: {
        color: COLORS.primary,
        fontWeight: 'bold',
        fontSize: 14,
        marginTop: 8,
    },
    amenitiesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        justifyContent: 'space-between',
    },
    amenityCard: {
        width: '47%',
        backgroundColor: COLORS.white,
        padding: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(27, 48, 40, 0.05)',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    amenityText: {
        fontSize: 13,
        fontWeight: '500',
        color: COLORS.forestGreen,
    },
    showAllBtn: {
        marginTop: 16,
        width: '100%',
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(27, 48, 40, 0.1)',
        alignItems: 'center',
    },
    showAllText: {
        fontWeight: 'bold',
        fontSize: 14,
        color: COLORS.forestGreen,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    viewAll: {
        color: COLORS.primary,
        fontWeight: 'bold',
        fontSize: 14,
    },
    reviewsScroll: {
        gap: 16,
        paddingBottom: 20,
    },
    reviewCard: {
        width: 280,
        backgroundColor: COLORS.white,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(27, 48, 40, 0.05)',
    },
    reviewHeader: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    reviewerName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.forestGreen,
    },
    reviewDate: {
        fontSize: 10,
        opacity: 0.5,
        color: COLORS.forestGreen,
    },
    reviewText: {
        fontSize: 12,
        color: 'rgba(27, 48, 40, 0.7)',
        lineHeight: 18,
    },

    // Floating Footer
    floatingFooter: {
        position: 'absolute',
        bottom: 24,
        left: 20,
        right: 20,
    },
    footerContent: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 32,
        padding: 16,
        paddingHorizontal: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    priceLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
        opacity: 0.6,
        color: COLORS.forestGreen,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
    },
    priceValue: {
        fontSize: 22,
        fontWeight: '800',
        color: COLORS.forestGreen,
    },
    currency: {
        fontSize: 12,
        fontWeight: 'bold',
        opacity: 0.7,
        color: COLORS.forestGreen,
    },
    floatingBookBtn: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 20,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    bookBtnText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
