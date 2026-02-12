import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';
import { User, Mail, Phone, Settings, Shield, Bell, HelpCircle, LogOut, ChevronRight, MapPin, Award } from 'lucide-react-native';
import { api } from '../lib/api';

export default function AccountView({ lang = 'ar', onLogout }) {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const isAr = lang === 'ar';

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        setLoading(true);
        const data = await api.getProfile('user_123'); // Demo user
        if (data) setProfile(data);
        setLoading(false);
    };

    const handleLogout = () => {
        Alert.alert("Logout", "Are you sure you want to log out?", [
            { text: "Cancel", style: "cancel" },
            { text: "Logout", style: "destructive", onPress: () => console.log("Logout pressed") }
        ]);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1E3932" />
            </View>
        );
    }

    const stats = [
        { label: isAr ? 'الحجوزات' : 'Bookings', value: profile?._count?.bookings || 0, icon: <MapPin size={18} color="#10B981" /> },
        { label: isAr ? 'التقييمات' : 'Reviews', value: profile?._count?.reviews || 0, icon: <Award size={18} color="#3B82F6" /> },
        { label: isAr ? 'الكوبونات' : 'Coupons', value: profile?._count?.discountUsage || 0, icon: <Award size={18} color="#F59E0B" /> },
    ];

    const menuItems = [
        { title: isAr ? 'المعلومات الشخصية' : 'Personal Information', icon: <User size={22} color="#4B5563" /> },
        { title: isAr ? 'الأمان' : 'Security', icon: <Shield size={22} color="#4B5563" /> },
        { title: isAr ? 'الإشعارات' : 'Notifications', icon: <Bell size={22} color="#4B5563" /> },
        { title: isAr ? 'المساعدة والدعم' : 'Help & Support', icon: <HelpCircle size={22} color="#4B5563" /> },
    ];

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* Header Section */}
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    {profile?.image ? (
                        <Image source={{ uri: profile.image }} style={styles.avatar} />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <User size={40} color="#9CA3AF" />
                        </View>
                    )}
                    <TouchableOpacity style={styles.editBadge}>
                        <Settings size={14} color="white" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.name}>{profile?.name || 'User Name'}</Text>
                <Text style={styles.email}>{profile?.email || 'user@example.com'}</Text>
            </View>

            {/* Stats Row */}
            <View style={styles.statsRow}>
                {stats.map((stat, idx) => (
                    <View key={idx} style={styles.statBox}>
                        <View style={styles.statIcon}>{stat.icon}</View>
                        <Text style={styles.statLabel}>{stat.label}</Text>
                        <Text style={styles.statValue}>{stat.value}</Text>
                    </View>
                ))}
            </View>

            {/* Menu Sections */}
            <View style={styles.menuSection}>
                {menuItems.map((item, idx) => (
                    <TouchableOpacity key={idx} style={styles.menuItem}>
                        <View style={styles.menuItemLeft}>
                            {item.icon}
                            <Text style={styles.menuItemTitle}>{item.title}</Text>
                        </View>
                        <ChevronRight size={20} color="#D1D5DB" />
                    </TouchableOpacity>
                ))}
            </View>

            {/* Logout Button */}
            <TouchableOpacity style={[styles.logoutBtn, isAr && { flexDirection: 'row-reverse' }]} onPress={onLogout}>
                <LogOut size={22} color="#EF4444" />
                <Text style={styles.logoutText}>{isAr ? 'تسجيل الخروج' : 'Log Out'}</Text>
            </TouchableOpacity>

            <Text style={styles.versionText}>{isAr ? 'الإصدار 1.0.2 (بناء 45)' : 'Version 1.0.2 (Build 45)'}</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAF9F6',
    },
    content: {
        paddingBottom: 40,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        paddingVertical: 30,
        backgroundColor: 'white',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#1E3932',
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#1E3932',
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'white',
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    email: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
    },
    statsRow: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginTop: 24,
        justifyContent: 'space-between',
    },
    statBox: {
        flex: 1,
        backgroundColor: 'white',
        marginHorizontal: 4,
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    statIcon: {
        marginBottom: 8,
    },
    statLabel: {
        fontSize: 12,
        color: '#6B7280',
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
        marginTop: 2,
    },
    menuSection: {
        backgroundColor: 'white',
        marginTop: 24,
        marginHorizontal: 20,
        borderRadius: 20,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    menuItemTitle: {
        fontSize: 16,
        color: '#374151',
        fontWeight: '500',
    },
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEF2F2',
        marginTop: 24,
        marginHorizontal: 20,
        paddingVertical: 16,
        borderRadius: 16,
        justifyContent: 'center',
        gap: 10,
        borderWidth: 1,
        borderColor: '#FEE2E2',
    },
    logoutText: {
        color: '#EF4444',
        fontSize: 16,
        fontWeight: 'bold',
    },
    versionText: {
        textAlign: 'center',
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 30,
    }
});
