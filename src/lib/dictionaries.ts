const dictionaries = {
    en: {
        nav: {
            home: 'Home',
            chalets: 'Chalets',
            about: 'About',
            contact: 'Contact',
            bookNow: 'Book Now',
            signIn: 'Sign In',
        },
        home: {
            heroTitle: 'Experience Luxury in Jordan',
            heroSubtitle: 'Find your perfect getaway with Riva Chalets.',
            featured: 'Featured Chalets',
            viewAll: 'View All',
        },
        chalet: {
            pricePerNight: 'per night',
            capacity: 'Guests',
            book: 'Book this Chalet',
            amenities: 'Amenities',
            description: 'Description',
            guestReviews: 'Guest Reviews',
            thingsToKnow: 'Things to Know',
            checkIn: 'Check-in',
            checkOut: 'Check-out',
            checkInTime: '15:00 onwards',
            checkOutTime: 'Before 11:00',
            cancellation: 'Cancellation',
            cancellationPolicy: 'Free up to 48 hours before check-in.',
            noPayment: 'No payment required today.',
        },
        booking: {
            checkIn: 'Check-in',
            checkOut: 'Check-out',
            guestName: 'Full Name',
            guestPhone: 'Phone Number',
            confirm: 'Confirm Booking',
            success: 'Booking Successful!',
        },
        common: {
            loading: 'Loading...',
            error: 'Something went wrong',
        },
        rewards: {
            wallet: 'My Wallet',
            trips: 'My Trips',
            settings: 'Settings',
            noRewards: 'No active rewards yet.',
            scanInfo: 'Show this QR code to our partners to redeem your exclusive offer.',
        },
        reviews: {
            title: 'Guest Reviews',
            writeReview: 'Write a Review',
            yourRating: 'Your Rating',
            comment: 'Comment',
            submit: 'Submit Review',
            thankYou: 'Thank you!',
            submitted: 'Your review has been submitted for approval.',
            noReviews: 'No reviews yet. Be the first to share your experience!',
            verified: 'Verified Guest',
        },
        filters: {
            search: 'Search chalets...',
            allLocations: 'All Locations',
            found: 'chalets found',
            noResults: 'No chalets match your search.',
            clearFilters: 'Clear Filters',
        },
        footer: {
            quickLinks: 'Quick Links',
            legal: 'Legal',
            terms: 'Terms of Service',
            privacy: 'Privacy Policy',
            payments: 'Secure Payments',
            allRights: 'All rights reserved.',
        },
    },
    ar: {
        nav: {
            home: 'الرئيسية',
            chalets: 'الشاليهات',
            about: 'من نحن',
            contact: 'تواصل معنا',
            bookNow: 'احجز الآن',
            signIn: 'تسجيل دخول',
        },
        home: {
            heroTitle: 'عيش الرفاهية في الأردن',
            heroSubtitle: 'اكتشف أفضل الشاليهات لقضاء عطلتك مع ريفا.',
            featured: 'شاليهات مميزة',
            viewAll: 'عرض الكل',
        },
        chalet: {
            pricePerNight: 'في الليلة',
            capacity: 'ضيوف',
            book: 'احجز هذا الشاليه',
            amenities: 'المرافق',
            description: 'الوصف',
            guestReviews: 'آراء الضيوف',
            thingsToKnow: 'معلومات مهمة',
            checkIn: 'الدخول',
            checkOut: 'الخروج',
            checkInTime: 'من الساعة 15:00',
            checkOutTime: 'قبل الساعة 11:00',
            cancellation: 'الإلغاء',
            cancellationPolicy: 'مجاناً حتى 48 ساعة قبل الدخول.',
            noPayment: 'لا يلزم الدفع اليوم.',
        },
        booking: {
            checkIn: 'تاريخ الدخول',
            checkOut: 'تاريخ الخروج',
            guestName: 'الاسم الكامل',
            guestPhone: 'رقم الهاتف',
            confirm: 'تأكيد الحجز',
            success: 'تم الحجز بنجاح!',
        },
        common: {
            loading: 'جاري التحميل...',
            error: 'حدث خطأ ما',
        },
        rewards: {
            wallet: 'محفظتي',
            trips: 'رحلاتي',
            settings: 'الإعدادات',
            noRewards: 'لا توجد مكافآت نشطة بعد.',
            scanInfo: 'أظهر رمز الاستجابة السريعة لشركائنا للاستفادة من العرض.',
        },
        reviews: {
            title: 'آراء الضيوف',
            writeReview: 'اكتب تقييماً',
            yourRating: 'تقييمك',
            comment: 'التعليق',
            submit: 'إرسال التقييم',
            thankYou: 'شكراً لك!',
            submitted: 'تم إرسال تقييمك للمراجعة.',
            noReviews: 'لا توجد تقييمات بعد. كن أول من يشارك تجربته!',
            verified: 'ضيف موثق',
        },
        filters: {
            search: 'ابحث عن شاليه...',
            allLocations: 'جميع المواقع',
            found: 'شاليهات',
            noResults: 'لا توجد نتائج مطابقة.',
            clearFilters: 'مسح الفلاتر',
        },
        footer: {
            quickLinks: 'روابط سريعة',
            legal: 'قانوني',
            terms: 'شروط الخدمة',
            privacy: 'سياسة الخصوصية',
            payments: 'دفع آمن',
            allRights: 'جميع الحقوق محفوظة.',
        },
    }
};

export type Locale = keyof typeof dictionaries;
export type Dictionary = typeof dictionaries.en;

export const getDictionary = (lang: Locale | string | undefined): Dictionary => {
    if (lang === 'ar') {
        return dictionaries.ar;
    }
    return dictionaries.en;
};

