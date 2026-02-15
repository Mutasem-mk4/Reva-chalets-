export const API_URL = 'https://riva-jo.me/api';

export const api = {
    async getDiscounts(type, category) {
        try {
            const params = new URLSearchParams();
            if (type) params.append('type', type);
            if (category) params.append('category', category);

            const res = await fetch(`${API_URL}/discounts?${params.toString()}`);
            if (!res.ok) throw new Error('Failed to fetch discounts');
            return await res.json();
        } catch (error) {
            console.error('API Error (getDiscounts):', error);
            return []; // Return empty array on failure
        }
    },

    async getGoldenCardStatus() {
        try {
            const res = await fetch(`${API_URL}/golden-card`);
            if (!res.ok) throw new Error('Failed to fetch status');
            return await res.json();
        } catch (error) {
            console.error('API Error (getGoldenCardStatus):', error);
            // Default fallback
            return { phase: 'WAITING', details: {} };
        }
    },

    async getTrips(userId) {
        try {
            const res = await fetch(`${API_URL}/bookings?userId=${userId}`);
            if (!res.ok) throw new Error('Failed to fetch trips');
            const bookings = await res.json();

            // Map backend booking to frontend Trip object
            return bookings.map(b => ({
                id: b.id,
                name: b.chalet?.name || 'Unknown Chalet',
                date: new Date(b.startDate).toLocaleDateString(),
                time: 'Check-in 2:00 PM', // Fixed time for now or fetch from chalet rules
                status: b.status,
                location: 'Jordan', // Or fetch from chalet.location
                image: b.chalet?.images ? JSON.parse(b.chalet.images)[0] : 'https://via.placeholder.com/150',
                type: new Date(b.startDate) > new Date() ? 'UPCOMING' : 'PAST'
            }));
        } catch (error) {
            console.error('API Error (getTrips):', error);
            return [];
        }
    },

    async verifyCoupon(code, price) {
        try {
            const res = await fetch(`${API_URL}/verify-coupon`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, price })
            });
            return await res.json();
        } catch (error) {
            console.error('API Error (verifyCoupon):', error);
            return { valid: false, message: 'Network error' };
        }
    },

    async getChalets(filters = {}) {
        try {
            const params = new URLSearchParams();
            // @ts-ignore
            if (filters.search) params.append('search', filters.search);
            // @ts-ignore
            if (filters.minPrice) params.append('minPrice', filters.minPrice);
            // @ts-ignore
            if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
            // @ts-ignore
            if (filters.location) params.append('location', filters.location);

            const res = await fetch(`${API_URL}/chalets?${params.toString()}`);
            if (!res.ok) throw new Error('Failed to fetch chalets');
            return await res.json();
        } catch (error) {
            console.error('API Error (getChalets):', error);
            return [];
        }
    },

    async getChaletById(id) {
        try {
            const res = await fetch(`${API_URL}/chalets/${id}`);
            if (!res.ok) throw new Error('Failed to fetch chalet details');
            return await res.json();
        } catch (error) {
            console.error('API Error (getChaletById):', error);
            return null;
        }
    },

    async createBooking(data) {
        try {
            const res = await fetch(`${API_URL}/bookings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!res.ok) throw new Error('Failed to create booking');
            return await res.json();
        } catch (error) {
            console.error('API Error (createBooking):', error);
            return null;
        }
    },

    async getBookings(userId) {
        try {
            const res = await fetch(`${API_URL}/bookings?userId=${userId || ''}`);
            if (!res.ok) throw new Error('Failed to fetch bookings');
            return await res.json();
        } catch (error) {
            console.error('API Error (getBookings):', error);
            return [];
        }
    },

    async submitReview(data) {
        try {
            const res = await fetch(`${API_URL}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!res.ok) throw new Error('Failed to submit review');
            return await res.json();
        } catch (error) {
            console.error('API Error (submitReview):', error);
            return null;
        }
    },

    async getProfile(userId) {
        try {
            const res = await fetch(`${API_URL}/profile?userId=${userId}`);
            if (!res.ok) throw new Error('Failed to fetch profile');
            return await res.json();
        } catch (error) {
            console.error('API Error (getProfile):', error);
            return null;
        }
    },

    async updateProfile(data) {
        try {
            const res = await fetch(`${API_URL}/profile`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!res.ok) throw new Error('Failed to update profile');
            return await res.json();
        } catch (error) {
            console.error('API Error (updateProfile):', error);
            return null;
        }
    }
};
