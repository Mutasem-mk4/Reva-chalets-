'use client';

import HostCalendar from '@/components/dashboard/HostCalendar';

export default function CalendarPage() {
    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: '#1c1917', marginBottom: '0.5rem' }}>Availability Calendar</h1>
                <p style={{ color: '#78716c' }}>Manage your bookings and block dates.</p>
            </div>

            <HostCalendar />
        </div>
    );
}
