import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MapPin, Calendar, Clock, ArrowRight, ArrowLeft, CheckCircle, XCircle } from 'lucide-react-native';
import { api } from '../lib/api';

export default function TripsView({ onOpenChat, lang = 'ar' }) {
    const [activeTab, setActiveTab] = useState('UPCOMING');
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    const isAr = lang === 'ar';

    useEffect(() => {
        loadTrips();
    }, []);

    const loadTrips = async () => {
        setLoading(true);
        const data = await api.getTrips();
        setTrips(data);
        setLoading(false);
    };

    const getStatusLabel = (status) => {
        if (!isAr) return status;
        switch (status) {
            case 'Confirmed': return 'مؤكد';
            case 'Pending': return 'قيد الانتظار';
            case 'Cancelled': return 'ملغي';
            case 'Completed': return 'مكتملة';
            default: return status;
        }
    };

    const filteredTrips = trips.filter(t => t.type === activeTab);

    const renderCard = ({ item }) => (
        <View style={styles.card}>
            {/* Status Badge */}
            <View style={[styles.statusBadge,
            item.status === 'Confirmed' ? styles.statusConfirmed :
                item.status === 'Pending' ? styles.statusPending :
                    item.status === 'Cancelled' ? styles.statusCancelled : styles.statusCompleted,
            isAr && { alignSelf: 'flex-end' }
            ]}>
                <Text style={[styles.statusText,
                item.status === 'Confirmed' ? styles.textConfirmed :
                    item.status === 'Pending' ? styles.textPending :
                        item.status === 'Cancelled' ? styles.textCancelled : styles.textCompleted
                ]}>{getStatusLabel(item.status)}</Text>
            </View>

            <Text style={[styles.tripName, isAr && { textAlign: 'right' }]}>{item.name}</Text>

            <View style={[styles.detailsRow, isAr && { flexDirection: 'row-reverse' }]}>
                <View style={[styles.detailItem, isAr && { flexDirection: 'row-reverse' }]}>
                    <Calendar size={14} color="#6B7280" />
                    <Text style={styles.detailText}>{item.date}</Text>
                </View>
                <View style={[styles.detailItem, isAr && { flexDirection: 'row-reverse' }]}>
                    <Clock size={14} color="#6B7280" />
                    <Text style={styles.detailText}>{item.time}</Text>
                </View>
            </View>

            <View style={[styles.locationRow, isAr && { flexDirection: 'row-reverse' }]}>
                <MapPin size={14} color="#6B7280" />
                <Text style={styles.detailText}>{item.location}</Text>
            </View>

            <View style={[styles.actionsRow, isAr && { flexDirection: 'row-reverse' }]}>
                <TouchableOpacity
                    style={[styles.actionBtn, styles.chatBtn, isAr && { flexDirection: 'row-reverse' }]}
                    onPress={() => onOpenChat && onOpenChat(item.id)}
                >
                    <Text style={styles.chatBtnText}>{isAr ? 'دردشة المجموعة' : 'Group Chat'}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.actionBtn, isAr && { flexDirection: 'row-reverse' }]}>
                    <Text style={styles.actionText}>{isAr ? 'تفاصيل الرحلة' : 'Trip Details'}</Text>
                    {isAr ? <ArrowLeft size={16} color="#1E3932" /> : <ArrowRight size={16} color="#1E3932" />}
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={[styles.header, isAr && { alignItems: 'flex-end' }]}>
                <Text style={styles.title}>{isAr ? 'رحلاتي' : 'My Trips'}</Text>
            </View>

            {/* Tabs */}
            <View style={[styles.tabContainer, isAr && { flexDirection: 'row-reverse' }]}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'UPCOMING' && styles.activeTab]}
                    onPress={() => setActiveTab('UPCOMING')}
                >
                    <Text style={[styles.tabText, activeTab === 'UPCOMING' && styles.activeTabText]}>
                        {isAr ? 'القادمة' : 'Upcoming'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'PAST' && styles.activeTab]}
                    onPress={() => setActiveTab('PAST')}
                >
                    <Text style={[styles.tabText, activeTab === 'PAST' && styles.activeTabText]}>
                        {isAr ? 'السابقة' : 'Past'}
                    </Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={{ marginTop: 40 }}>
                    <ActivityIndicator size="large" color="#1E3932" />
                </View>
            ) : (
                <FlatList
                    data={filteredTrips}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                    renderItem={renderCard}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>
                                {isAr ? 'لا يوجد رحلات حالياً' : `No ${activeTab.toLowerCase()} trips found.`}
                            </Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        marginTop: 0,
    },
    header: {
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1E3932',
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#E5E7EB',
        borderRadius: 12,
        padding: 4,
        marginBottom: 24,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 10,
    },
    activeTab: {
        backgroundColor: 'white',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    tabText: {
        fontWeight: '600',
        color: '#6B7280',
    },
    activeTabText: {
        color: '#1E3932',
    },
    list: {
        paddingBottom: 100,
        gap: 16,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        marginBottom: 12,
    },
    statusConfirmed: { backgroundColor: '#ECFDF5' }, // Green bg
    statusPending: { backgroundColor: '#FFFBEB' }, // Yellow bg
    statusCompleted: { backgroundColor: '#F3F4F6' }, // Gray bg
    statusCancelled: { backgroundColor: '#FEF2F2' }, // Red bg

    statusText: { fontSize: 12, fontWeight: 'bold' },
    textConfirmed: { color: '#047857' },
    textPending: { color: '#B45309' },
    textCompleted: { color: '#374151' },
    textCancelled: { color: '#DC2626' },

    tripName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 12,
    },
    detailsRow: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 8,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 16,
    },
    detailText: {
        color: '#6B7280',
        fontSize: 14,
    },
    actionsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        gap: 12,
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    chatBtn: {
        backgroundColor: '#1E3932',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    chatBtnText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 13,
    },
    actionText: {
        color: '#1E3932',
        fontWeight: 'bold',
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 40,
    },
    emptyText: {
        color: '#9CA3AF',
        fontStyle: 'italic',
    }
});
