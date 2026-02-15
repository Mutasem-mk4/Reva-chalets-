import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const RECOMMENDATIONS = [
    {
        id: '1',
        name: 'Mountain View Chalet',
        price: '150 JOD',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60', // Placeholder
        location: 'Ajloun'
    },
    {
        id: '2',
        name: 'Dead Sea Villa',
        price: '200 JOD',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        location: 'Dead Sea'
    }
];

export default function RecommendedList({ lang = 'ar', onSelect }) {
    const isAr = lang === 'ar';

    const getLocalizedName = (name) => {
        if (!isAr) return name;
        switch (name) {
            case 'Mountain View Chalet': return 'شاليه مطل على الجبل';
            case 'Dead Sea Villa': return 'فيلا البحر الميت';
            default: return name;
        }
    };

    const getLocalizedLocation = (loc) => {
        if (!isAr) return loc;
        switch (loc) {
            case 'Ajloun': return 'عجلون';
            case 'Dead Sea': return 'البحر الميت';
            default: return loc;
        }
    };

    return (
        <View style={styles.container}>
            {RECOMMENDATIONS.map((item) => (
                <TouchableOpacity
                    key={item.id}
                    style={styles.card}
                    onPress={() => onSelect && onSelect(item)}
                >
                    <Image source={{ uri: item.image }} style={styles.image} />

                    <View style={styles.content}>
                        <View style={[styles.header, isAr && { flexDirection: 'row-reverse' }]}>
                            <Text style={styles.name}>{getLocalizedName(item.name)}</Text>
                            <Text style={[styles.rating, isAr && { flexDirection: 'row-reverse' }]}>⭐ {item.rating}</Text>
                        </View>

                        <Text style={[styles.location, isAr && { textAlign: 'right' }]}>
                            {isAr ? `📍 ${getLocalizedLocation(item.location)}` : `📍 ${item.location}`}
                        </Text>

                        <View style={[styles.footer, isAr && { flexDirection: 'row-reverse' }]}>
                            <Text style={[styles.price, isAr && { flexDirection: 'row-reverse' }]}>
                                {isAr ? `${item.price.replace('JOD', 'دينار')}` : item.price}
                                <Text style={styles.period}> {isAr ? '/ ليلة' : '/ night'}</Text>
                            </Text>
                            <TouchableOpacity style={styles.bookBtn} onPress={() => onSelect && onSelect(item)}>
                                <Text style={styles.bookBtnText}>{isAr ? 'احجز الآن' : 'Book'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
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
    content: {
        padding: 12,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
    },
    rating: {
        fontSize: 14,
        color: '#F59E0B',
    },
    location: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 12,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#3D5A47',
    },
    period: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: 'normal',
    },
    bookBtn: {
        backgroundColor: '#E5A61D',
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    bookBtnText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
});
