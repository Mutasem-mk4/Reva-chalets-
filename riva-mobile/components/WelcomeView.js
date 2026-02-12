import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Globe, LogIn, UserRound, ArrowRight, ArrowLeft } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function WelcomeView({ onFinish, setLang, currentLang }) {
    const isAr = currentLang === 'ar';
    const [fadeAnim] = useState(new Animated.Value(0));

    React.useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleLanguageSelect = (code) => {
        setLang(code);
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#1B3B36', '#122622']}
                style={styles.background}
            />

            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                {/* Branding Section */}
                <View style={styles.logoSection}>
                    <View style={styles.logoOuter}>
                        <LinearGradient
                            colors={['#E5A61D', '#BF8A10']}
                            style={styles.logoInner}
                        >
                            <Text style={styles.logoText}>R</Text>
                        </LinearGradient>
                    </View>
                    <Text style={styles.brandTitle}>{isAr ? 'ريفـا' : 'REVA'}</Text>
                    <Text style={styles.brandSubtitle}>
                        {isAr ? 'شاليهات ومزارع الأردن الراقية' : 'Premium Jordanian Chalets'}
                    </Text>
                </View>

                {/* Language Selection */}
                <View style={styles.languageSection}>
                    <Text style={styles.sectionLabel}>
                        {isAr ? 'اختر اللغة' : 'Choose Language'}
                    </Text>
                    <View style={[styles.langRow, isAr && { flexDirection: 'row-reverse' }]}>
                        <TouchableOpacity
                            style={[styles.langBtn, !isAr && styles.activeLang]}
                            onPress={() => handleLanguageSelect('en')}
                        >
                            <Text style={[styles.langText, !isAr && styles.activeLangText]}>English</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.langBtn, isAr && styles.activeLang]}
                            onPress={() => handleLanguageSelect('ar')}
                        >
                            <Text style={[styles.langText, isAr && styles.activeLangText]}>العربية</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Action Section */}
                <View style={styles.actionSection}>
                    <TouchableOpacity
                        style={styles.primaryBtn}
                        onPress={() => onFinish('login')}
                    >
                        <View style={[styles.btnContent, isAr && { flexDirection: 'row-reverse' }]}>
                            <LogIn size={20} color="#1B3B36" />
                            <Text style={styles.primaryBtnText}>
                                {isAr ? 'تسجيل الدخول' : 'Sign In'}
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.secondaryBtn}
                        onPress={() => onFinish('guest')}
                    >
                        <View style={[styles.btnContent, isAr && { flexDirection: 'row-reverse' }]}>
                            <UserRound size={20} color="white" />
                            <Text style={styles.secondaryBtnText}>
                                {isAr ? 'الدخول كضيف' : 'Continue as Guest'}
                            </Text>
                        </View>
                        {isAr ? (
                            <ArrowLeft size={18} color="rgba(255,255,255,0.6)" />
                        ) : (
                            <ArrowRight size={18} color="rgba(255,255,255,0.6)" />
                        )}
                    </TouchableOpacity>
                </View>

                {/* Footer Decor */}
                <Text style={styles.footerText}>
                    {isAr ? 'صنع بحب في الأردن 🇯🇴' : 'Made with love in Jordan 🇯🇴'}
                </Text>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1B3B36',
    },
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    content: {
        flex: 1,
        paddingHorizontal: 30,
        justifyContent: 'space-between',
        paddingTop: height * 0.15,
        paddingBottom: 40,
    },
    logoSection: {
        alignItems: 'center',
    },
    logoOuter: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: 5,
        marginBottom: 20,
    },
    logoInner: {
        width: '100%',
        height: '100%',
        borderRadius: 45,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoText: {
        fontSize: 48,
        fontWeight: '900',
        color: 'white',
        includeFontPadding: false,
    },
    brandTitle: {
        fontSize: 40,
        fontWeight: 'bold',
        color: 'white',
        letterSpacing: 4,
    },
    brandSubtitle: {
        fontSize: 14,
        color: '#A7F3D0',
        marginTop: 8,
        letterSpacing: 1,
    },
    languageSection: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 24,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    sectionLabel: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    langRow: {
        flexDirection: 'row',
        gap: 12,
    },
    langBtn: {
        flex: 1,
        height: 50,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    activeLang: {
        backgroundColor: '#E5A61D',
        borderColor: '#E5A61D',
    },
    langText: {
        color: 'rgba(255,255,255,0.6)',
        fontWeight: '600',
    },
    activeLangText: {
        color: '#1B3B36',
    },
    actionSection: {
        gap: 16,
    },
    primaryBtn: {
        backgroundColor: '#E5A61D',
        height: 60,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    primaryBtnText: {
        color: '#1B3B36',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
        marginRight: 10,
    },
    secondaryBtn: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        height: 60,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    btnContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    secondaryBtnText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 12,
        marginRight: 12,
    },
    footerText: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 12,
        textAlign: 'center',
    }
});
