// Utility functions for guest verification

export interface Booking {
    chaletId: string;
    chaletName: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    status: 'upcoming' | 'completed' | 'cancelled';
    bookedAt: string;
}

// Get all bookings from localStorage
export function getBookings(): Booking[] {
    if (typeof window === 'undefined') return [];
    const bookings = localStorage.getItem('reva-bookings');
    return bookings ? JSON.parse(bookings) : [];
}

// Save a booking to localStorage
export function saveBooking(booking: Booking): void {
    const bookings = getBookings();
    bookings.push(booking);
    localStorage.setItem('reva-bookings', JSON.stringify(bookings));
}

// Check if user has a completed stay at a specific chalet
export function hasCompletedStayAt(chaletId: string): boolean {
    const bookings = getBookings();
    const today = new Date();

    return bookings.some(booking => {
        if (booking.chaletId !== chaletId) return false;
        if (booking.status === 'cancelled') return false;

        // Check if checkout date has passed (completed stay)
        const checkoutDate = new Date(booking.checkOut);
        return checkoutDate < today;
    });
}

// Check if user has any booking (past or upcoming) at a chalet
export function hasBookingAt(chaletId: string): boolean {
    const bookings = getBookings();
    return bookings.some(b => b.chaletId === chaletId && b.status !== 'cancelled');
}

// Get completed stays for a specific chalet
export function getCompletedStaysAt(chaletId: string): Booking[] {
    const bookings = getBookings();
    const today = new Date();

    return bookings.filter(booking => {
        if (booking.chaletId !== chaletId) return false;
        if (booking.status === 'cancelled') return false;
        const checkoutDate = new Date(booking.checkOut);
        return checkoutDate < today;
    });
}

// Create a demo/mock booking for testing purposes
export function createMockBooking(chaletId: string, chaletName: string): void {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 7); // 7 days ago

    const checkoutDate = new Date();
    checkoutDate.setDate(checkoutDate.getDate() - 5); // 5 days ago

    const mockBooking: Booking = {
        chaletId,
        chaletName,
        checkIn: pastDate.toISOString().split('T')[0],
        checkOut: checkoutDate.toISOString().split('T')[0],
        guests: 2,
        status: 'completed',
        bookedAt: new Date(pastDate.getTime() - 86400000 * 14).toISOString(), // 2 weeks before check-in
    };

    saveBooking(mockBooking);
}
