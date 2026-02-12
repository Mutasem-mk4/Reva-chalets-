import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';

const CATEGORIES = [
    {
        id: '1',
        name: 'Extra\nActivities',
        image: 'https://images.unsplash.com/photo-1544367563-12123d832d34?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' // Tent/Glamping
    },
    {
        id: '2',
        name: 'Large\nGroups',
        image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' // Big House
    },
    {
        id: '3',
        name: 'Nature\nView',
        image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60' // Nature/Mountain
    },
];

export default function CategoryGrid({ lang = 'ar' }) {
    const isAr = lang === 'ar';

    const getLocalizedName = (name) => {
        if (!isAr) return name;
        switch (name) {
            case 'Extra\nActivities': return 'أنشطة\nإضافية';
            case 'Large\nGroups': return 'مجموعات\nكبيرة';
            case 'Nature\nView': return 'إطلالة\nطبيعية';
            default: return name;
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[styles.scrollContent, isAr && { flexDirection: 'row-reverse' }]}
            >
                {CATEGORIES.map((cat) => (
                    <TouchableOpacity key={cat.id} activeOpacity={0.8}>
                        <ImageBackground
                            source={{ uri: cat.image }}
                            style={styles.card}
                            imageStyle={styles.cardImage}
                        >
                            <View style={styles.overlay}>
                                <Text style={styles.label}>{getLocalizedName(cat.name)}</Text>
                            </View>
                        </ImageBackground>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 8,
    },
    scrollContent: {
        gap: 12,
    },
    card: {
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardImage: {
        borderRadius: 16,
    },
    overlay: {
        backgroundColor: 'rgba(0,0,0,0.2)', // Light overlay for readability
        ...StyleSheet.absoluteFillObject,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'BOLD',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
        paddingHorizontal: 4,
    },
});
