import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Star, MessageSquare, CheckCircle2 } from 'lucide-react-native';
import GenericHeader from './GenericHeader';
import { api } from '../lib/api';

export default function RatingView({ chaletId, chaletName, onClose, onRatingSuccess, lang = 'ar' }) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const isAr = lang === 'ar';

    const handleSubmit = async () => {
        setLoading(true);
        const result = await api.submitReview({
            rating,
            comment,
            chaletId,
            userId: 'user_123', // Demo user
            groupId: 'group_123' // Demo group
        });
        setLoading(false);

        if (result) {
            setSuccess(true);
            setTimeout(() => {
                if (onRatingSuccess) onRatingSuccess();
            }, 2500);
        } else {
            Alert.alert("Error", "Failed to submit rating. Please try again.");
        }
    };

    if (success) {
        return (
            <View style={styles.successContainer}>
                <CheckCircle2 size={80} color="#3B82F6" />
                <Text style={styles.successTitle}>{isAr ? 'شكراً لك!' : 'Thank You!'}</Text>
                <Text style={styles.successSub}>
                    {isAr
                        ? 'تقييمك يساعد الآخرين، وقد حصلت الآن على **خصومات كيف**! 🎳🏎️'
                        : "Your review helps others, and you've unlocked **Kaif Discounts**! 🎳🏎️"}
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <GenericHeader title={isAr ? 'قيّم إقامتك' : 'Rate Your Stay'} onBack={onClose} lang={lang} />

            <View style={styles.content}>
                <Text style={styles.chaletName}>{chaletName}</Text>
                <Text style={styles.subtext}>{isAr ? 'كيف كانت تجربتك؟' : 'How was your experience?'}</Text>

                <View style={styles.starsRow}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <TouchableOpacity key={star} onPress={() => setRating(star)}>
                            <Star
                                size={44}
                                color={star <= rating ? "#F59E0B" : "#D1D5DB"}
                                fill={star <= rating ? "#F59E0B" : "transparent"}
                            />
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.inputContainer}>
                    <Text style={[styles.label, isAr && { textAlign: 'right' }]}>{isAr ? 'أخبرنا المزيد (اختياري)' : 'Tell us more (Optional)'}</Text>
                    <TextInput
                        style={[styles.input, isAr && { textAlign: 'right' }]}
                        placeholder={isAr ? 'اكتب تقييمك هنا...' : 'Write your review here...'}
                        multiline
                        numberOfLines={4}
                        value={comment}
                        onChangeText={setComment}
                    />
                </View>

                <TouchableOpacity
                    style={[styles.submitBtn, loading && { opacity: 0.7 }]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.submitBtnText}>{isAr ? 'إرسال التقييم' : 'Submit Review'}</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAF9F6',
    },
    content: {
        padding: 24,
        alignItems: 'center',
    },
    successContainer: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    successTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1E3A8A',
        marginTop: 20,
    },
    successSub: {
        fontSize: 16,
        color: '#4B5563',
        marginTop: 10,
        textAlign: 'center',
        lineHeight: 24,
    },
    chaletName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1F2937',
        marginTop: 10,
    },
    subtext: {
        fontSize: 16,
        color: '#6B7280',
        marginTop: 8,
    },
    starsRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 30,
        marginBottom: 40,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 30,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    input: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 16,
        padding: 16,
        height: 120,
        textAlignVertical: 'top',
        fontSize: 16,
        color: '#1F2937',
    },
    submitBtn: {
        backgroundColor: '#1E3932',
        width: '100%',
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitBtnText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    }
});
