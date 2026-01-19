'use client';

import { useState } from 'react';
import styles from '@/styles/dashboard.module.css';

interface Booking {
    id: string;
    guestName: string;
    chaletName: string;
    dates: string;
    amount: string;
    status: 'Confirmed' | 'Pending' | 'Cancelled';
}

const MOCK_BOOKINGS: Booking[] = [
    { id: '1', guestName: 'Sarah Connor', chaletName: 'Dead Sea Villa', dates: 'Oct 24 - 26', amount: '500 JOD', status: 'Confirmed' },
    { id: '2', guestName: 'John Wick', chaletName: 'Petra Lodge', dates: 'Nov 10 - 15', amount: '900 JOD', status: 'Pending' },
    { id: '3', guestName: 'Ellen Ripley', chaletName: 'Aqaba Suite', dates: 'Dec 01 - 05', amount: '1200 JOD', status: 'Confirmed' },
    { id: '4', guestName: 'James Bond', chaletName: 'Royal Chalet', dates: 'Dec 24 - 30', amount: '3500 JOD', status: 'Pending' },
    { id: '5', guestName: 'Tony Stark', chaletName: 'Skyline Penthouse', dates: 'Jan 01 - 03', amount: '2000 JOD', status: 'Cancelled' },
];

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);

    const handleStatusChange = (id: string, newStatus: 'Confirmed' | 'Cancelled') => {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
    };

    return (
        <div>
            <h1 className={styles.tableTitle}>Booking Management</h1>

            <div className={styles.tableCard}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Guest</th>
                            <th>Chalet</th>
                            <th>Dates</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking) => (
                            <tr key={booking.id}>
                                <td>#{booking.id}</td>
                                <td>{booking.guestName}</td>
                                <td>{booking.chaletName}</td>
                                <td>{booking.dates}</td>
                                <td>{booking.amount}</td>
                                <td>
                                    <span className={
                                        booking.status === 'Confirmed' ? styles.statusConfirmed :
                                            booking.status === 'Pending' ? styles.statusPending :
                                                'status-cancelled' // We might need to add this style
                                    } style={booking.status === 'Cancelled' ? { color: '#ef4444', background: '#fee2e2', padding: '0.25rem 0.5rem', borderRadius: '999px', fontSize: '0.75rem' } : {}}>
                                        {booking.status}
                                    </span>
                                </td>
                                <td>
                                    {booking.status === 'Pending' && (
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => handleStatusChange(booking.id, 'Confirmed')}
                                                style={{ border: 'none', background: '#dcfce7', color: '#16a34a', cursor: 'pointer', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleStatusChange(booking.id, 'Cancelled')}
                                                style={{ border: 'none', background: '#fee2e2', color: '#ef4444', cursor: 'pointer', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
