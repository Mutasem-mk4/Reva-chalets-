import { getBookings, saveBooking, hasCompletedStayAt, createMockBooking, Booking } from './bookingVerification';

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: jest.fn((key: string) => store[key] || null),
        setItem: jest.fn((key: string, value: string) => {
            store[key] = value.toString();
        }),
        clear: jest.fn(() => {
            store = {};
        }),
    };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('bookingVerification', () => {
    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
    });

    it('should return empty array if no bookings present', () => {
        expect(getBookings()).toEqual([]);
    });

    it('should save and retrieve a booking', () => {
        const mockBooking: Booking = {
            id: 'test-1',
            chaletId: 'chalet-1',
            chaletName: 'Test Chalet',
            checkIn: '2025-01-01',
            checkOut: '2025-01-05',
            guests: 2,
            status: 'completed',
            bookedAt: new Date().toISOString()
        };

        saveBooking(mockBooking);
        const bookings = getBookings();
        expect(bookings).toHaveLength(1);
        expect(bookings[0].chaletId).toBe('chalet-1');
    });

    it('should correctly identify a completed stay', () => {
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 10);
        const checkoutDate = new Date();
        checkoutDate.setDate(checkoutDate.getDate() - 5);

        const completedBooking: Booking = {
            chaletId: 'chalet-completed',
            chaletName: 'Completed Chalet',
            checkIn: pastDate.toISOString().split('T')[0],
            checkOut: checkoutDate.toISOString().split('T')[0],
            guests: 2,
            status: 'completed',
            bookedAt: pastDate.toISOString()
        };

        saveBooking(completedBooking);
        expect(hasCompletedStayAt('chalet-completed')).toBe(true);
    });

    it('should return false for upcoming stays', () => {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 5);
        const checkoutDate = new Date();
        checkoutDate.setDate(checkoutDate.getDate() + 10);

        const upcomingBooking: Booking = {
            chaletId: 'chalet-upcoming',
            chaletName: 'Upcoming Chalet',
            checkIn: futureDate.toISOString().split('T')[0],
            checkOut: checkoutDate.toISOString().split('T')[0],
            guests: 2,
            status: 'upcoming',
            bookedAt: new Date().toISOString()
        };

        saveBooking(upcomingBooking);
        expect(hasCompletedStayAt('chalet-upcoming')).toBe(false);
    });

    it('should create a valid mock booking via createMockBooking', () => {
        createMockBooking('chalet-mock', 'Mock Chalet');
        const bookings = getBookings();
        expect(bookings).toHaveLength(1);
        expect(bookings[0].chaletName).toBe('Mock Chalet');
        expect(bookings[0].status).toBe('completed');
        expect(hasCompletedStayAt('chalet-mock')).toBe(true);
    });
});
