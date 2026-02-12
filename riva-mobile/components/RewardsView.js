import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Fuel, ShoppingBag, Trophy, Car, Ticket, Coffee, Utensils } from 'lucide-react-native';
import DiscountCard from './DiscountCard';
import { api } from '../lib/api';

export default function RewardsView({ lang = 'ar' }) {
    const [activeType, setActiveType] = useState('ZAD'); // ZAD or KAIF
    const [discounts, setDiscounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);

    const isAr = lang === 'ar';

    useEffect(() => {
        loadData();
    }, [activeType]);

    const loadData = async () => {
        setLoading(true);
        // 1. Load Profile to check canUseKaif
        let currentProfile = profile;
        if (!currentProfile) {
            currentProfile = await api.getProfile('user_123'); // Demo user
            setProfile(currentProfile);
        }

        // 2. Load Discounts
        const data = await api.getDiscounts(activeType);

        // 3. Map with logic
        const formatted = data.map(item => ({
            ...item,
            icon: getIconForCategory(item.category),
            color: item.type === 'ZAD' ? '#FFF8E1' : '#E8F5E9',
            // Unlock KAIF only if user has canUseKaif permission
            locked: item.type === 'KAIF' && !currentProfile?.canUseKaif,
        }));

        setDiscounts(formatted);
        setLoading(false);
    };

    const getIconForCategory = (cat) => {
        switch (cat) {
            case 'gas': return <Fuel size={24} color="#E5A61D" />;
            case 'meat': return <ShoppingBag size={24} color="#E5A61D" />;
            case 'transport': return <Car size={24} color="#E5A61D" />;
            case 'bowling': return <Car size={24} color="#3D5A47" />;
            case 'cinema': return <Ticket size={24} color="#3D5A47" />;
            default: return <Trophy size={24} color="#3D5A47" />;
        }
    };

    return (
        <View style={styles.container}>
            {/* Header Section */}
            <View style={[styles.header, isAr && { alignItems: 'flex-end' }]}>
                <Text style={styles.title}>{isAr ? 'مكافآتك' : 'Your Rewards'}</Text>
                <Text style={[styles.subtitle, isAr && { textAlign: 'right' }]}>
                    {activeType === 'ZAD'
                        ? (isAr ? 'أساسيات لتجهيز رحلتك' : 'Essentials for your trip preparation')
                        : (isAr ? 'أنشطة ترفيهية تفتح بعد إقامتك' : 'Fun activities unlocked after your stay')}
                </Text>
            </View>

            {/* Toggle Tabs */}
            <View style={[styles.toggleContainer, isAr && { flexDirection: 'row-reverse' }]}>
                <TouchableOpacity
                    style={[styles.toggleBtn, activeType === 'ZAD' && styles.activeToggle]}
                    onPress={() => setActiveType('ZAD')}
                >
                    <Text style={[styles.toggleText, activeType === 'ZAD' && styles.activeToggleText]}>
                        {isAr ? 'زاد (الأساسيات)' : 'ZAD (Essentials)'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.toggleBtn, activeType === 'KAIF' && styles.activeToggle]}
                    onPress={() => setActiveType('KAIF')}
                >
                    <Text style={[styles.toggleText, activeType === 'KAIF' && styles.activeToggleText]}>
                        {isAr ? 'كيف (الترفيه)' : 'KAIF (Fun)'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Rewards List */}
            {/* Rewards List */}
            {loading ? (
                <View style={{ marginTop: 40 }}>
                    <ActivityIndicator size="large" color="#1E3932" />
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
                    {discounts.map((item) => (
                        <DiscountCard
                            key={item.id}
                            item={item}
                            isLocked={item.locked}
                            onPress={() => console.log('Open discount', item.id)}
                        />
                    ))}
                    {discounts.length === 0 && (
                        <Text style={{ textAlign: 'center', color: '#9CA3AF', marginTop: 20 }}>
                            {isAr ? 'لا توجد مكافآت حالياً' : 'No rewards found.'}
                        </Text>
                    )}
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        marginTop: 0, // App has padding
    },
    header: {
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1E3932',
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
    },
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: '#E5E7EB',
        borderRadius: 12, // Slightly rounder
        padding: 4,
        marginBottom: 24,
    },
    toggleBtn: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 10,
    },
    activeToggle: {
        backgroundColor: 'white',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    toggleText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6B7280',
    },
    activeToggleText: {
        color: '#1E3932',
    },
    listContent: {
        paddingBottom: 100,
        gap: 12,
    },
});
