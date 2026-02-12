import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { MapPin, Star, Users, Check, Wifi, Droplets, Flame, ArrowLeft } from 'lucide-react-native';
import { api } from '../lib/api';

const { width } = Dimensions.get('window');

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
                <ActivityIndicator size="large" color="#1B3B36" />
            </View>
        );
    }

    if (!chalet) {
        return (
            <View style={styles.loadingContainer}>
                <Text>{isAr ? 'فشل تحميل التفاصيل' : 'Failed to load details.'}</Text>
                <TouchableOpacity onPress={onClose}><Text style={{ color: 'blue', marginTop: 10 }}>{isAr ? 'إغلاق' : 'Close'}</Text></TouchableOpacity>
            </View>
        );
    }

    const images = JSON.parse(chalet.images || '[]');
    const amenities = JSON.parse(chalet.amenities || '[]');

    const getLocalizedLocation = (loc) => {
        if (!isAr) return loc;
        switch (loc) {
            case 'Ajloun': return 'عجلون';
            case 'Dead Sea': return 'البحر الميت';
            case 'Salt': return 'السلط';
            default: return loc;
        }
    };

    const getLocalizedAmenity = (am) => {
        if (!isAr) return am;
        switch (am) {
            case 'Private Pool': return 'مسبح خاص';
            case 'Wifi': return 'واي فاي';
            case 'BBQ Area': return 'منطقة شواء';
            case 'Garden': return 'حديقة';
            default: return am;
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Image Header */}
                <View style={styles.imageContainer}>
                    <Image source={{ uri: images[0] }} style={styles.mainImage} />
                    <TouchableOpacity style={[styles.backBtn, isAr && { left: 'auto', right: 20 }]} onPress={onClose}>
                        <ArrowLeft color="#1B3B36" size={24} style={isAr && { transform: [{ rotate: '180deg' }] }} />
                    </TouchableOpacity>
                </View>

                {/* Content */}
                <View style={styles.content}>
                    <View style={[styles.headerRow, isAr && { flexDirection: 'row-reverse' }]}>
                        <Text style={[styles.title, isAr && { textAlign: 'right' }]}>{chalet.name}</Text>
                        <View style={[styles.ratingBox, isAr && { flexDirection: 'row-reverse' }]}>
                            <Star size={14} fill="#E5A61D" color="#E5A61D" />
                            <Text style={styles.ratingText}>{chalet.rating}</Text>
                        </View>
                    </View>

                    <View style={[styles.locationRow, isAr && { flexDirection: 'row-reverse' }]}>
                        <MapPin size={16} color="#6B7280" />
                        <Text style={styles.locationText}>{getLocalizedLocation(chalet.location)}</Text>
                    </View>

                    <Text style={[styles.description, isAr && { textAlign: 'right' }]}>{chalet.description}</Text>

                    {/* Amenities */}
                    <Text style={[styles.sectionTitle, isAr && { textAlign: 'right' }]}>{isAr ? 'المرافق والخدمات' : 'Amenities'}</Text>
                    <View style={[styles.amenitiesGrid, isAr && { flexDirection: 'row-reverse' }]}>
                        {amenities.map((item, index) => (
                            <View key={index} style={[styles.amenityItem, isAr && { flexDirection: 'row-reverse' }]}>
                                <Check size={16} color="#1E3932" />
                                <Text style={styles.amenityText}>{getLocalizedAmenity(item)}</Text>
                            </View>
                        ))}
                        <View style={[styles.amenityItem, isAr && { flexDirection: 'row-reverse' }]}>
                            <Users size={16} color="#1E3932" />
                            <Text style={styles.amenityText}>{isAr ? `يتسع لـ ${chalet.capacity} أشخاص` : `Up to ${chalet.capacity} Guests`}</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Booking Bar */}
            <View style={[styles.footer, isAr && { flexDirection: 'row-reverse' }]}>
                <View style={isAr && { alignItems: 'flex-end' }}>
                    <Text style={styles.priceLabel}>{isAr ? 'السعر الإجمالي' : 'Total Price'}</Text>
                    <Text style={[styles.price, isAr && { flexDirection: 'row-reverse' }]}>
                        {chalet.price} {isAr ? 'دينار' : 'JOD'} <Text style={{ fontSize: 14, fontWeight: 'normal' }}>{isAr ? '/ ليلة' : '/ Night'}</Text>
                    </Text>
                </View>
                <TouchableOpacity style={styles.bookBtn} onPress={() => onStartBooking && onStartBooking(chalet)}>
                    <Text style={styles.bookBtnText}>{isAr ? 'احجز الآن' : 'Book Now'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAF9F6',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        height: 300,
        width: '100%',
        position: 'relative',
    },
    mainImage: {
        width: '100%',
        height: '100%',
    },
    backBtn: {
        position: 'absolute',
        top: 50,
        left: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.9)',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
    },
    content: {
        flex: 1,
        backgroundColor: '#FAF9F6',
        marginTop: -30,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 24,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1F2937',
        flex: 1,
    },
    ratingBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFBEB',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 4,
    },
    ratingText: {
        fontWeight: 'bold',
        color: '#92400E',
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 20,
    },
    locationText: {
        fontSize: 16,
        color: '#6B7280',
    },
    description: {
        fontSize: 15,
        color: '#4B5563',
        lineHeight: 24,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 12,
    },
    amenitiesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 24,
    },
    amenityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 8,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    amenityText: {
        color: '#374151',
        fontSize: 14,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        paddingHorizontal: 24,
        paddingVertical: 20,
        paddingBottom: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    priceLabel: {
        fontSize: 12,
        color: '#6B7280',
    },
    price: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1B3B36',
    },
    bookBtn: {
        backgroundColor: '#1E3932',
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 16,
    },
    bookBtnText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
