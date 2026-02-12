import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image, ActivityIndicator, Modal, Switch } from 'react-native';
import { Search, MapPin, SlidersHorizontal, Star, X, Check, Droplet, Trees, Users, Home } from 'lucide-react-native';
import GenericHeader from './GenericHeader';
import { api } from '../lib/api';

// 1. Smart Collections Configuration
const COLLECTIONS = [
    { id: 'All', label: 'All', icon: null },
    { id: 'luxury', label: 'Luxury', icon: Star },
    { id: 'nature', label: 'Nature', icon: Trees },
    { id: 'family', label: 'Families', icon: Users },
    { id: 'pool', label: 'Pools', icon: Droplet },
];

export default function SearchView({ initialQuery = '', onClose, onSelectChalet, lang = 'ar' }) {
    const [query, setQuery] = useState(initialQuery);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeCollection, setActiveCollection] = useState('All');
    const [showFilterModal, setShowFilterModal] = useState(false);

    // Advanced Filters
    const [priceMax, setPriceMax] = useState(500);
    const [minGuests, setMinGuests] = useState(1);
    const [selectedAmenities, setSelectedAmenities] = useState([]);

    const isAr = lang === 'ar';

    useEffect(() => {
        handleSearch();
    }, [activeCollection]); // Auto-search on collection change

    const handleSearch = async () => {
        setLoading(true);
        // Simulate API filtering (In real app, pass these params to API)
        const filters = {
            search: query,
            collection: activeCollection !== 'All' ? activeCollection : null
        };
        const data = await api.getChalets(filters);

        // Client-side filtering for demo (since API is mock)
        let filtered = data;

        // A. Collection Logic
        if (activeCollection === 'luxury') filtered = filtered.filter(c => c.price >= 200);
        if (activeCollection === 'nature') filtered = filtered.filter(c => ['Ajloun', 'Salt'].includes(c.location));
        if (activeCollection === 'family') filtered = filtered.filter(c => c.capacity >= 8);

        // B. Advanced Filter Logic
        filtered = filtered.filter(c => c.price <= priceMax);
        filtered = filtered.filter(c => c.capacity >= minGuests);

        setResults(filtered);
        setLoading(false);
    };

    const getLocalizedLabel = (label) => {
        if (!isAr) return label;
        const map = {
            'All': 'الكل', 'Luxury': 'فخامة', 'Nature': 'طبيعة',
            'Families': 'عائلات', 'Pools': 'مسابح'
        };
        return map[label] || label;
    };

    return (
        <View style={styles.container}>
            <GenericHeader title={isAr ? 'البحث الذكي' : 'Smart Search'} onBack={onClose} lang={lang} />

            {/* Search Input Area */}
            <View style={[styles.searchSection, isAr && { flexDirection: 'row-reverse' }]}>
                <View style={[styles.searchBar, isAr && { flexDirection: 'row-reverse' }]}>
                    <Search color="#9CA3AF" size={20} />
                    <TextInput
                        style={[styles.input, isAr && { textAlign: 'right', marginLeft: 0, marginRight: 8 }]}
                        placeholder={isAr ? 'ابحث عن شاليهات...' : 'Search chalets...'}
                        value={query}
                        onChangeText={setQuery}
                        onSubmitEditing={handleSearch}
                        placeholderTextColor="#9CA3AF"
                    />
                </View>
                <TouchableOpacity
                    style={[styles.filterBtn, (priceMax < 500 || minGuests > 1) && styles.filterBtnActive]}
                    onPress={() => setShowFilterModal(true)}
                >
                    <SlidersHorizontal color="white" size={20} />
                </TouchableOpacity>
            </View>

            {/* Smart Collections Scroll */}
            <View style={{ height: 50 }}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={[{ paddingHorizontal: 20 }, isAr && { flexDirection: 'row-reverse' }]}
                >
                    {COLLECTIONS.map((col) => {
                        const Icon = col.icon;
                        const isActive = activeCollection === col.id;
                        return (
                            <TouchableOpacity
                                key={col.id}
                                style={[styles.pill, isActive && styles.activePill, isAr && { marginRight: 0, marginLeft: 10 }]}
                                onPress={() => setActiveCollection(col.id)}
                            >
                                {Icon && <Icon size={14} color={isActive ? 'white' : '#4B5563'} style={{ marginRight: isAr ? 0 : 6, marginLeft: isAr ? 6 : 0 }} />}
                                <Text style={[styles.pillText, isActive && styles.activePillText]}>{getLocalizedLabel(col.label)}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            {/* Results List */}
            {loading ? (
                <View style={{ marginTop: 50 }}>
                    <ActivityIndicator size="large" color="#1B3B36" />
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.resultsList}>
                    <Text style={[styles.resultCount, isAr && { textAlign: 'right' }]}>
                        {results.length} {isAr ? 'شاليهات متاحة' : 'chalets found'}
                    </Text>

                    {results.length > 0 ? (
                        results.map(chalet => (
                            <TouchableOpacity key={chalet.id} style={styles.card} onPress={() => onSelectChalet && onSelectChalet(chalet.id)}>
                                <Image source={{ uri: JSON.parse(chalet.images)[0] }} style={styles.cardImage} />
                                <View style={styles.cardContent}>
                                    <View style={[styles.rowBetween, isAr && { flexDirection: 'row-reverse' }]}>
                                        <Text style={styles.cardTitle}>{chalet.name}</Text>
                                        <View style={[styles.ratingBadge, isAr && { flexDirection: 'row-reverse' }]}>
                                            <Star size={12} fill="#E5A61D" color="#E5A61D" />
                                            <Text style={styles.ratingText}>{chalet.rating}</Text>
                                        </View>
                                    </View>
                                    <View style={[styles.locationRow, isAr && { flexDirection: 'row-reverse' }]}>
                                        <MapPin size={14} color="#6B7280" />
                                        <Text style={styles.locationText}>{chalet.location}</Text>
                                    </View>
                                    <View style={[styles.rowBetween, isAr && { flexDirection: 'row-reverse' }]}>
                                        <Text style={styles.priceText}>{chalet.price} {isAr ? 'د.أ' : 'JOD'}</Text>
                                        <View style={styles.bookBtn}>
                                            <Text style={styles.bookBtnText}>{isAr ? 'تفاصيل' : 'Details'}</Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>{isAr ? 'لم يتم العثور على نتائج' : 'No results found.'}</Text>
                        </View>
                    )}
                </ScrollView>
            )}

            {/* Advanced Filter Modal */}
            <Modal
                visible={showFilterModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowFilterModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={[styles.modalHeader, isAr && { flexDirection: 'row-reverse' }]}>
                            <Text style={styles.modalTitle}>{isAr ? 'فلاتر متقدمة' : 'Advanced Filters'}</Text>
                            <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                                <X size={24} color="#1F2937" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalBody}>
                            {/* Max Price */}
                            <View style={styles.filterSection}>
                                <Text style={[styles.filterLabel, isAr && { textAlign: 'right' }]}>{isAr ? `الحد الأقصى للسعر: ${priceMax} د.أ` : `Max Price: ${priceMax} JOD`}</Text>
                                <View style={styles.sliderPlaceholder}>
                                    {/* Using simple buttons for demo as Slider needs extra package */}
                                    <TouchableOpacity onPress={() => setPriceMax(Math.max(100, priceMax - 50))} style={styles.stepperBtn}><Text>-</Text></TouchableOpacity>
                                    <Text style={{ fontWeight: 'bold' }}>{priceMax}</Text>
                                    <TouchableOpacity onPress={() => setPriceMax(priceMax + 50)} style={styles.stepperBtn}><Text>+</Text></TouchableOpacity>
                                </View>
                            </View>

                            {/* Guests */}
                            <View style={styles.filterSection}>
                                <Text style={[styles.filterLabel, isAr && { textAlign: 'right' }]}>{isAr ? 'الضيوف' : 'Guests'}</Text>
                                <View style={[styles.stepperRow, isAr && { flexDirection: 'row-reverse', justifyContent: 'flex-end' }]}>
                                    <TouchableOpacity onPress={() => setMinGuests(Math.max(1, minGuests - 1))} style={styles.stepperBtn}><Text>-</Text></TouchableOpacity>
                                    <Text style={{ marginHorizontal: 15, fontSize: 18 }}>{minGuests}+</Text>
                                    <TouchableOpacity onPress={() => setMinGuests(minGuests + 1)} style={styles.stepperBtn}><Text>+</Text></TouchableOpacity>
                                </View>
                            </View>
                        </ScrollView>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={styles.applyBtn}
                                onPress={() => { setShowFilterModal(false); handleSearch(); }}
                            >
                                <Text style={styles.applyBtnText}>{isAr ? 'تطبيق الفلاتر' : 'Apply Filters'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAF9F6',
    },
    searchSection: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 12,
        marginBottom: 16,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    input: { flex: 1, marginLeft: 8, fontSize: 16, color: '#1F2937' },
    filterBtn: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#1B3B36', alignItems: 'center', justifyContent: 'center' },
    filterBtnActive: { backgroundColor: '#B45309' },

    pill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: 'white', marginRight: 10, borderWidth: 1, borderColor: '#E5E7EB' },
    activePill: { backgroundColor: '#1B3B36', borderColor: '#1B3B36' },
    pillText: { color: '#4B5563', fontWeight: '600' },
    activePillText: { color: 'white' },

    resultsList: { paddingHorizontal: 20, paddingBottom: 100 },
    resultCount: { fontSize: 13, color: '#6B7280', marginBottom: 10, fontWeight: '600' },

    card: { backgroundColor: 'white', borderRadius: 16, overflow: 'hidden', marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
    cardImage: { width: '100%', height: 180 },
    cardContent: { padding: 16 },
    cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    ratingBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FFFBEB', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
    ratingText: { fontWeight: 'bold', color: '#92400E', fontSize: 12 },
    locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 12 },
    locationText: { color: '#6B7280' },
    priceText: { fontSize: 18, fontWeight: '800', color: '#1B3B36' },
    bookBtn: { backgroundColor: '#F3F4F6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
    bookBtnText: { fontSize: 12, fontWeight: 'bold', color: '#374151' },

    emptyState: { alignItems: 'center', marginTop: 60 },
    emptyText: { color: '#9CA3AF' },

    // Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, height: '60%', padding: 20 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
    modalTitle: { fontSize: 20, fontWeight: 'bold' },
    filterSection: { marginBottom: 24 },
    filterLabel: { fontSize: 16, fontWeight: '600', marginBottom: 12, color: '#374151' },
    sliderPlaceholder: { flexDirection: 'row', alignItems: 'center', gap: 20, backgroundColor: '#F9FAFB', padding: 10, borderRadius: 12 },
    stepperBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'white', borderWidth: 1, borderColor: '#D1D5DB', alignItems: 'center', justifyContent: 'center' },
    stepperRow: { flexDirection: 'row', alignItems: 'center' },
    modalFooter: { marginTop: 'auto', paddingTop: 20 },
    applyBtn: { backgroundColor: '#1B3B36', padding: 16, borderRadius: 16, alignItems: 'center' },
    applyBtnText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});
