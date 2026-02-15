import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Calendar, User, Phone, Mail, Users, ArrowLeft, CheckCircle2 } from 'lucide-react-native';
import GenericHeader from './GenericHeader';
import { api } from '../lib/api';

export default function BookingView({ chalet, onClose, onBookingSuccess, lang = 'ar' }) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const isAr = lang === 'ar';

    // Form State
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(null); // { code, amount }
    const [verifyingCoupon, setVerifyingCoupon] = useState(false);

    const [formData, setFormData] = useState({
        guestName: isAr ? 'أحمد محمد' : 'John Doe',
        guestEmail: 'john@example.com',
        guestPhone: '0790000000',
        guestCount: '2',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    });

    const calculateTotal = () => {
        let total = chalet.price;
        // Logic for nights * price would go here if we had date diff logic
        if (discount) {
            total -= discount.amount;
        }
        return Math.max(0, total);
    };

    const handleApplyCoupon = async () => {
        if (!couponCode) return;
        setVerifyingCoupon(true);
        const res = await api.verifyCoupon(couponCode, chalet.price);
        setVerifyingCoupon(false);

        if (res.valid) {
            setDiscount({ code: res.code, amount: res.discountAmount });
            Alert.alert(isAr ? 'نجاح' : 'Success', isAr ? `تم خصم ${res.discountAmount} دينار` : `Discount of ${res.discountAmount} Applied`);
        } else {
            setDiscount(null);
            Alert.alert(isAr ? 'خطأ' : 'Error', res.message || (isAr ? 'كود غير صالح' : 'Invalid Code'));
        }
    };

    const handleBooking = async () => {
        setLoading(true);
        const bookingData = {
            chaletId: chalet.id,
            userId: 'user_123',
            ...formData,
            guestCount: parseInt(formData.guestCount),
            totalPrice: calculateTotal(),
            pricePerNight: chalet.price,
            nights: 1,
            couponCode: discount ? discount.code : null
        };

        const result = await api.createBooking(bookingData);
        setLoading(false);

        if (result) {
            setSuccess(true);
            setTimeout(() => {
                if (onBookingSuccess) onBookingSuccess(result);
            }, 2000);
        } else {
            Alert.alert(
                isAr ? 'خطأ' : 'Error',
                isAr ? 'فشل إنشاء الحجز. يرجى المحاولة مرة أخرى.' : "Failed to create booking. Please try again."
            );
        }
    };

    if (success) {
        return (
            <View style={styles.successContainer}>
                <CheckCircle2 size={80} color="#10B981" />
                <Text style={styles.successTitle}>{isAr ? 'تم تأكيد الحجز!' : 'Booking Confirmed!'}</Text>
                <Text style={styles.successSub}>{isAr ? `إقامتك في ${chalet.name} جاهزة.` : `Your stay at ${chalet.name} is all set.`}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <GenericHeader title={isAr ? 'تأكيد الحجز' : 'Confirm Booking'} onBack={onClose} lang={lang} />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={[styles.chaletSummary, isAr && { alignItems: 'flex-end' }]}>
                    <Text style={styles.summaryTitle}>{chalet.name}</Text>
                    <Text style={styles.summaryPrice}>
                        {discount ? (
                            <Text style={{ textDecorationLine: 'line-through', color: '#9CA3AF', fontSize: 14 }}>
                                {chalet.price} {isAr ? 'دينار' : 'JOD'}
                            </Text>
                        ) : null}
                        {' '}
                        {calculateTotal()} {isAr ? 'دينار / ليلة' : 'JOD / Night'}
                    </Text>
                </View>

                <View style={styles.form}>
                    <Text style={[styles.label, isAr && { textAlign: 'right' }]}>{isAr ? 'الاسم الكامل' : 'Full Name'}</Text>
                    <View style={[styles.inputRow, isAr && { flexDirection: 'row-reverse' }]}>
                        <User size={20} color="#9CA3AF" />
                        <TextInput
                            style={[styles.input, isAr && { textAlign: 'right' }]}
                            value={formData.guestName}
                            onChangeText={(val) => setFormData({ ...formData, guestName: val })}
                        />
                    </View>

                    <Text style={[styles.label, isAr && { textAlign: 'right' }]}>{isAr ? 'البريد الإلكتروني' : 'Email Address'}</Text>
                    <View style={[styles.inputRow, isAr && { flexDirection: 'row-reverse' }]}>
                        <Mail size={20} color="#9CA3AF" />
                        <TextInput
                            style={[styles.input, isAr && { textAlign: 'right' }]}
                            value={formData.guestEmail}
                            keyboardType="email-address"
                            onChangeText={(val) => setFormData({ ...formData, guestEmail: val })}
                        />
                    </View>

                    <Text style={[styles.label, isAr && { textAlign: 'right' }]}>{isAr ? 'رقم الهاتف' : 'Phone Number'}</Text>
                    <View style={[styles.inputRow, isAr && { flexDirection: 'row-reverse' }]}>
                        <Phone size={20} color="#9CA3AF" />
                        <TextInput
                            style={[styles.input, isAr && { textAlign: 'right' }]}
                            value={formData.guestPhone}
                            keyboardType="phone-pad"
                            onChangeText={(val) => setFormData({ ...formData, guestPhone: val })}
                        />
                    </View>

                    <View style={[styles.row, isAr && { flexDirection: 'row-reverse' }]}>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.label, isAr && { textAlign: 'right' }]}>{isAr ? 'الضيوف' : 'Guests'}</Text>
                            <View style={[styles.inputRow, isAr && { flexDirection: 'row-reverse' }]}>
                                <Users size={20} color="#9CA3AF" />
                                <TextInput
                                    style={[styles.input, isAr && { textAlign: 'right' }]}
                                    value={formData.guestCount}
                                    keyboardType="numeric"
                                    onChangeText={(val) => setFormData({ ...formData, guestCount: val })}
                                />
                            </View>
                        </View>
                    </View>

                    <View style={[styles.row, isAr && { flexDirection: 'row-reverse' }]}>
                        <View style={[{ flex: 1 }, isAr ? { marginLeft: 10 } : { marginRight: 10 }]}>
                            <Text style={[styles.label, isAr && { textAlign: 'right' }]}>{isAr ? 'الدخول' : 'Check In'}</Text>
                            <View style={[styles.inputRow, isAr && { flexDirection: 'row-reverse' }]}>
                                <Calendar size={20} color="#9CA3AF" />
                                <TextInput
                                    style={[styles.input, isAr && { textAlign: 'right' }]}
                                    value={formData.startDate}
                                    onChangeText={(val) => setFormData({ ...formData, startDate: val })}
                                />
                            </View>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.label, isAr && { textAlign: 'right' }]}>{isAr ? 'المغادرة' : 'Check Out'}</Text>
                            <View style={[styles.inputRow, isAr && { flexDirection: 'row-reverse' }]}>
                                <Calendar size={20} color="#9CA3AF" />
                                <TextInput
                                    style={[styles.input, isAr && { textAlign: 'right' }]}
                                    value={formData.endDate}
                                    onChangeText={(val) => setFormData({ ...formData, endDate: val })}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Coupon Section */}
                    <View style={{ marginTop: 10 }}>
                        <Text style={[styles.label, isAr && { textAlign: 'right' }]}>{isAr ? 'كود الخصم' : 'Promo Code'}</Text>
                        <View style={[styles.inputRow, isAr && { flexDirection: 'row-reverse' }, { paddingRight: 6 }]}>
                            <TextInput
                                style={[styles.input, isAr && { textAlign: 'right' }]}
                                placeholder={isAr ? 'أدخل الكود' : 'Enter Code'}
                                value={couponCode}
                                onChangeText={setCouponCode}
                                editable={!discount} // Disable if applied
                            />
                            <TouchableOpacity
                                style={{ backgroundColor: discount ? '#10B981' : '#1B3B36', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 }}
                                onPress={handleApplyCoupon}
                                disabled={verifyingCoupon || !!discount}
                            >
                                {verifyingCoupon ? <ActivityIndicator color="white" size="small" /> : (
                                    <Text style={{ color: 'white', fontWeight: 'bold' }}>{discount ? (isAr ? 'مطبق' : 'Applied') : (isAr ? 'تطبيق' : 'Apply')}</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>

                <TouchableOpacity
                    style={[styles.confirmBtn, loading && { opacity: 0.7 }]}
                    onPress={handleBooking}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.confirmBtnText}>
                            {isAr ? `تأكيد والحجز (${calculateTotal()} د.أ)` : `Confirm & Pay (${calculateTotal()} JOD)`}
                        </Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAF9F6',
    },
    scrollContent: {
        padding: 24,
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
        color: '#1B3B36',
        marginTop: 20,
        textAlign: 'center',
    },
    successSub: {
        fontSize: 16,
        color: '#6B7280',
        marginTop: 10,
        textAlign: 'center',
    },
    chaletSummary: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    summaryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    summaryPrice: {
        fontSize: 16,
        color: '#1B3B36',
        marginTop: 4,
        fontWeight: '600',
    },
    form: {
        gap: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 4,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 52,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        gap: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#1F2937',
    },
    row: {
        flexDirection: 'row',
    },
    confirmBtn: {
        backgroundColor: '#1E3932',
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
        marginBottom: 40,
    },
    confirmBtnText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    }
});
