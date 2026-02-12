import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Search, SlidersHorizontal, Calendar, MapPin, Users } from 'lucide-react-native';

export default function SearchBar({ onPress, lang = 'ar' }) {
    const isAr = lang === 'ar';
    return (
        <TouchableOpacity style={styles.container} activeOpacity={0.9} onPress={onPress}>
            {/* Top Row: Search Input & Filter */}
            <View style={[styles.topRow, isAr && { flexDirection: 'row-reverse' }]}>
                <View style={[styles.searchLabelContainer, isAr && { flexDirection: 'row-reverse' }]}>
                    <Search size={22} color="white" strokeWidth={2.5} />
                    <Text style={styles.searchText}>{isAr ? 'ابحث عن مزارع' : 'Search farms'}</Text>
                </View>
                <TouchableOpacity>
                    <SlidersHorizontal size={22} color="white" strokeWidth={2.5} />
                </TouchableOpacity>
            </View>

            {/* Bottom Row: Filter Pills */}
            <View style={[styles.filtersRow, isAr && { flexDirection: 'row-reverse' }]}>
                <TouchableOpacity style={[styles.pill, isAr && { flexDirection: 'row-reverse' }]}>
                    <Calendar size={16} color="#D1D5DB" />
                    <Text style={styles.pillText}>{isAr ? 'التاريخ' : 'Date'}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.pill, styles.centerPill, isAr && { flexDirection: 'row-reverse' }]}>
                    <MapPin size={16} color="#D1D5DB" />
                    <Text style={styles.pillText}>{isAr ? 'الموقع' : 'Location'}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.pill, isAr && { flexDirection: 'row-reverse' }]}>
                    <Users size={16} color="#D1D5DB" />
                    <Text style={styles.pillText}>{isAr ? 'الضيوف' : 'Guests'}</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1B3B36', // Matches Header Color
        borderRadius: 24,
        padding: 20,
        marginHorizontal: 20,
        marginBottom: 20,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    searchLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    searchText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 16,
        fontWeight: '600',
    },
    filtersRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    pill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 12,
        gap: 6,
        flex: 1,
        justifyContent: 'center',
    },
    centerPill: {
        flex: 1.2,
    },
    pillText: {
        color: '#E5E7EB',
        fontSize: 12,
        fontWeight: '600',
    },
});
