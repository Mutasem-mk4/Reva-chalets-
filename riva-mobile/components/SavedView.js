import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { Heart, Star } from 'lucide-react-native';

const FAVORITES = [
    {
        id: '1',
        name: 'Sunny Side Farm',
        price: '250 JOD',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&q=80',
    },
    {
        id: '2',
        name: 'Hidden Valley',
        price: '180 JOD',
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=500&q=80',
    }
];

export default function SavedView({ lang = 'ar' }) {
    const isAr = lang === 'ar';
    return (
        <View style={styles.container}>
            <Text style={[styles.title, isAr && { textAlign: 'right' }]}>{isAr ? 'الشاليهات المفضلة' : 'Saved Chalets'}</Text>

            <FlatList
                data={FAVORITES}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.card}>
                        <Image source={{ uri: item.image }} style={styles.image} />
                        <View style={[styles.info, isAr && { flexDirection: 'row-reverse' }]}>
                            <View style={isAr && { alignItems: 'flex-end' }}>
                                <Text style={styles.name}>{isAr ? (item.name === 'Sunny Side Farm' ? 'مزرعة الجانب المشمس' : 'الوادي المخفي') : item.name}</Text>
                                <Text style={[styles.price, isAr && { flexDirection: 'row-reverse' }]}>
                                    {isAr ? `${item.price.replace('JOD', 'دينار')}` : item.price}
                                    <Text style={styles.perNight}> {isAr ? '/ ليلة' : '/ night'}</Text>
                                </Text>
                            </View>
                            <View style={[styles.rating, isAr && { flexDirection: 'row-reverse' }]}>
                                <Star size={16} fill="#FBBF24" color="#FBBF24" />
                                <Text style={styles.ratingText}>{item.rating}</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={[styles.heartBtn, isAr ? { left: 10 } : { right: 10 }]}>
                            <Heart size={20} fill="#EF4444" color="#EF4444" />
                        </TouchableOpacity>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        marginTop: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1E3932',
        marginBottom: 20,
    },
    list: {
        gap: 16,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    image: {
        width: '100%',
        height: 150,
    },
    info: {
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 4,
    },
    price: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1E3932',
    },
    perNight: {
        fontSize: 12,
        fontWeight: 'normal',
        color: '#6B7280',
    },
    rating: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#FFFBEB',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    ratingText: {
        fontWeight: 'bold',
        color: '#B45309',
    },
    heartBtn: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'white',
        padding: 8,
        borderRadius: 20,
        shadowOpacity: 0.1,
    }
});
