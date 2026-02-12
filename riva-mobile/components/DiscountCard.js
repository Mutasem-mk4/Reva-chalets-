import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Lock, ChevronRight } from 'lucide-react-native';

export default function DiscountCard({ item, isLocked, onPress }) {
    return (
        <TouchableOpacity
            style={[styles.card, isLocked && styles.lockedCard]}
            onPress={isLocked ? null : onPress}
            activeOpacity={isLocked ? 1 : 0.7}
        >
            {/* Icon Box */}
            <View style={[styles.iconBox, { backgroundColor: isLocked ? '#E5E7EB' : item.color }]}>
                {item.icon}
            </View>

            {/* Content */}
            <View style={styles.cardInfo}>
                <View style={styles.headerRow}>
                    <Text style={[styles.cardTitle, isLocked && styles.lockedText]}>
                        {item.nameAr}
                    </Text>
                    {isLocked && <Lock size={14} color="#9CA3AF" style={styles.lockIcon} />}
                </View>

                <Text style={styles.cardName}>{item.name}</Text>

                {isLocked ? (
                    <Text style={styles.lockReason}>Rate your trip to unlock</Text>
                ) : (
                    <Text style={styles.cardDesc}>{item.description}</Text>
                )}
            </View>

            {/* Action Button */}
            {!isLocked && (
                <View style={styles.actionArrow}>
                    <ChevronRight size={20} color="#D1D5DB" />
                </View>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    lockedCard: {
        backgroundColor: '#F9FAFB',
        borderColor: '#E5E7EB',
        shadowOpacity: 0,
    },
    iconBox: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    cardInfo: {
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1E3932',
    },
    lockedText: {
        color: '#9CA3AF',
    },
    cardName: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 2,
    },
    cardDesc: {
        fontSize: 13,
        color: '#E5A61D', // Gold
        fontWeight: '700',
        marginTop: 6,
    },
    lockReason: {
        fontSize: 12,
        color: '#EF4444', // Red for locked reason
        fontWeight: '500',
        marginTop: 6,
    },
    actionArrow: {
        marginLeft: 8,
    }
});
