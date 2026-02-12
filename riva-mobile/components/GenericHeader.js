import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function GenericHeader({ title, onBack, lang = 'ar' }) {
    const isAr = lang === 'ar';
    return (
        <View style={styles.headerContainer}>
            <SafeAreaView>
                <View style={[styles.headerContent, isAr && { flexDirection: 'row-reverse' }]}>
                    <TouchableOpacity onPress={onBack} style={styles.backButton}>
                        <ArrowLeft color="#FFFFFF" size={24} style={isAr && { transform: [{ rotate: '180deg' }] }} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{title}</Text>
                    <View style={{ width: 40 }} /> {/* Spacer for centering */}
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: '#1B3B36',
        paddingTop: 10,
        paddingBottom: 20,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        marginBottom: 10,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginTop: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
