'use client';

import { useState, useEffect } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
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
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetch('/api/bookings?host=true')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setBookings(data);
                } else {
                    console.error('Failed to fetch bookings', data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/bookings/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (!res.ok) throw new Error('Failed to update status');

            setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
        } catch (error) {
            console.error('Error updating booking:', error);
            alert('Failed to update booking status');
        }
    };

    const filteredBookings = bookings.filter(b => {
        if (filter === 'all') return true;
        if (filter === 'pending') return b.status === 'PENDING';
        if (filter === 'confirmed') return b.status === 'CONFIRMED';
        if (filter === 'cancelled') return b.status === 'REJECTED' || b.status === 'CANCELLED';
        return true;
    });

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
            <LoadingSpinner size={40} color="hsl(var(--primary))" />
        </div>
    );

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Booking Management</h1>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                {['all', 'pending', 'confirmed', 'cancelled'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '20px',
                            border: '1px solid #ddd',
                            background: filter === f ? 'hsl(var(--primary))' : 'white',
                            color: filter === f ? 'white' : 'black',
                            textTransform: 'capitalize',
                            cursor: 'pointer'
                        }}
                    >
                        {f}
                    </button>
                ))}
            </div>

            <div className={styles.tableCard}>
                {filteredBookings.length === 0 ? (
                    <p style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>No bookings found.</p>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Guest</th>
                                <th>Chalet</th>
                                <th>Dates</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBookings.map((booking) => (
                                <tr key={booking.id}>
                                    <td>
                                        <div style={{ fontWeight: 500 }}>{booking.guestName}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#666' }}>{booking.guestEmail}</div>
                                    </td>
                                    <td>
                                        {booking.chalet?.name}
                                    </td>
                                    <td>
                                        {new Date(booking.startDate).toLocaleDateString()} - <br />
                                        {new Date(booking.endDate).toLocaleDateString()}
                                    </td>
                                    <td>{booking.totalPrice} JOD</td>
                                    <td>
                                        <span className={
                                            booking.status === 'CONFIRMED' ? styles.statusConfirmed :
                                                booking.status === 'PENDING' ? styles.statusPending :
                                                    styles.statusCancelled || ''
                                        }>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td>
                                        {booking.status === 'PENDING' && (
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    onClick={() => handleStatusUpdate(booking.id, 'CONFIRMED')}
                                                    style={{ background: '#16a34a', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(booking.id, 'REJECTED')}
                                                    style={{ background: '#dc2626', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
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
                )}
            </div>
        </div>
    );
}
