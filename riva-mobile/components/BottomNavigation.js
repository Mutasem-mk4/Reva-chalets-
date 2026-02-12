import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { Home, Briefcase, Heart, User, Flower } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');
const TAB_HEIGHT = 80;

export default function BottomNavigation({ activeTab, onTabChange, lang = 'ar' }) {
    const isAr = lang === 'ar';
    const center = width / 2;
    const curveHalfWidth = 45;
    const curveDepth = 50;

    // Custom SVG path for the curve
    const d = `
    M 0 0 
    L ${center - curveHalfWidth} 0
    C ${center - curveHalfWidth + 10} 0, ${center - 20} ${curveDepth}, ${center} ${curveDepth}
    C ${center + 20} ${curveDepth}, ${center + curveHalfWidth - 10} 0, ${center + curveHalfWidth} 0
    L ${width} 0
    L ${width} ${TAB_HEIGHT}
    L 0 ${TAB_HEIGHT}
    Z
  `;

    return (
        <View style={styles.wrapper}>
            {/* Background Shape */}
            <View style={styles.svgContainer}>
                <Svg width={width} height={TAB_HEIGHT} style={styles.shadow}>
                    <Path d={d} fill="#C5E1D4" />
                </Svg>
            </View>

            {/* Floating Button */}
            <View style={styles.centerButtonWrapper}>
                <TouchableOpacity
                    style={styles.centerButton}
                    onPress={() => onTabChange && onTabChange('rewards')}
                >
                    <Flower size={28} color="white" strokeWidth={2.5} />
                    <Text style={styles.centerLabel}>{isAr ? 'مكافآت' : 'Rewards'}</Text>
                </TouchableOpacity>
            </View>

            {/* Tab Icons */}
            <View style={[styles.tabsContainer, isAr && { flexDirection: 'row-reverse' }]}>
                <View style={[styles.leftTabs, isAr && { flexDirection: 'row-reverse' }]}>
                    <TouchableOpacity style={styles.tab} onPress={() => onTabChange && onTabChange('home')}>
                        <Home size={26} color={activeTab === 'home' ? "#1B3B36" : "#000000"} strokeWidth={2.5} />
                        <Text style={activeTab === 'home' ? styles.activeLabel : styles.label}>{isAr ? 'الرئيسية' : 'Home'}</Text>
                        {activeTab === 'home' && <View style={styles.activeDot} />}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.tab} onPress={() => onTabChange && onTabChange('trips')}>
                        <Briefcase size={26} color={activeTab === 'trips' ? "#1B3B36" : "#000000"} strokeWidth={2.5} />
                        <Text style={activeTab === 'trips' ? styles.activeLabel : styles.label}>{isAr ? 'رحلاتي' : 'Trips'}</Text>
                        {activeTab === 'trips' && <View style={styles.activeDot} />}
                    </TouchableOpacity>
                </View>

                {/* Space for center button */}
                <View style={{ width: 80 }} />

                <View style={[styles.rightTabs, isAr && { flexDirection: 'row-reverse' }]}>
                    <TouchableOpacity style={styles.tab} onPress={() => onTabChange && onTabChange('saved')}>
                        <Heart size={26} color={activeTab === 'saved' ? "#1B3B36" : "#000000"} strokeWidth={2.5} />
                        <Text style={activeTab === 'saved' ? styles.activeLabel : styles.label}>{isAr ? 'المفضلة' : 'Saved'}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.tab} onPress={() => onTabChange && onTabChange('account')}>
                        <User size={26} color={activeTab === 'account' ? "#1B3B36" : "#000000"} strokeWidth={2.5} />
                        <Text style={activeTab === 'account' ? styles.activeLabel : styles.label}>{isAr ? 'حسابي' : 'Account'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: TAB_HEIGHT,
        justifyContent: 'flex-end',
        backgroundColor: 'transparent',
    },
    svgContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    centerButtonWrapper: {
        position: 'absolute',
        bottom: 15,
        alignSelf: 'center',
        zIndex: 50,
        elevation: 50,
    },
    centerButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#1E3932',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
        paddingTop: 4,
    },
    centerLabel: {
        color: '#8CA999',
        fontSize: 9,
        fontWeight: 'bold',
        marginTop: 2,
    },
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%',
        paddingHorizontal: 16,
        paddingBottom: Platform.OS === 'ios' ? 20 : 0,
        zIndex: 10,
        elevation: 10,
    },
    leftTabs: {
        flexDirection: 'row',
        width: '40%',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    rightTabs: {
        flexDirection: 'row',
        width: '40%',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    tab: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        fontSize: 11,
        color: '#000000',
        marginTop: 4,
        fontWeight: 'bold',
    },
    activeLabel: {
        fontSize: 11,
        color: '#1B3B36',
        marginTop: 4,
        fontWeight: '900',
    },
    activeDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#0F2922',
        marginTop: 2,
    },
});
