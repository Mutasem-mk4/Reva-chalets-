'use client';

import { useState, useEffect } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import styles from '@/styles/calendar.module.css';
import { createClient } from '@/lib/supabase/client';

interface Chalet {
    id: string;
    name: string;
}

interface Booking {
    id: string;
    startDate: string;
    endDate: string;
    status: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
    guestName: string;
}

export default function CalendarPage() {
    const [chalets, setChalets] = useState<Chalet[]>([]);
    const [selectedChaletId, setSelectedChaletId] = useState<string>('');
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());

    // Fetch User's Chalets
    useEffect(() => {
        async function fetchChalets() {
            try {
                const res = await fetch('/api/chalets?mine=true');
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    setChalets(data);
                    setSelectedChaletId(data[0].id);
                } else {
                    setLoading(false);
                }
            } catch (error) {
                console.error('Failed to fetch chalets', error);
                setLoading(false);
            }
        }
        fetchChalets();
    }, []);

    // Fetch Availability when chalet or month changes
    useEffect(() => {
        if (!selectedChaletId) return;

        setLoading(true);
        fetch(`/api/availability?chaletId=${selectedChaletId}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setBookings(data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [selectedChaletId]);

    // Calendar Logic
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month, 1).getDay();
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const checkDateStatus = (day: number) => {
        const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        checkDate.setHours(0, 0, 0, 0);

        // Find booking that covers this date
        // Note: endDate is usually checkout date (morning), so it might be available for check-in purely by logic,
        // but for simplicity let's mark it if it falls within start (inclusive) and end (exclusive) or inclusive-inclusive depending on business logic.
        // Usually: Start (Check-in 2PM) -> End (Check-out 11AM).
        // So a date is "booked" if it is >= startDate AND < endDate.

        const booking = bookings.find(b => {
            const start = new Date(b.startDate);
            const end = new Date(b.endDate);
            start.setHours(0, 0, 0, 0);
            end.setHours(0, 0, 0, 0);

            return checkDate >= start && checkDate < end;
        });

        return booking;
    };

    const handleDateClick = async (day: number) => {
        if (!selectedChaletId) return;

        const booking = checkDateStatus(day);
        if (booking) {
            alert(`This date is booked by ${booking.guestName} (${booking.status})`);
            return;
        }

        if (!confirm(`Do you want to block this date (${day}/${currentDate.getMonth() + 1})?`)) return;

        // Block for 1 night
        const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const end = new Date(currentDate.getFullYear(), currentDate.getMonth(), day + 1);

        // Adjust for timezone offset to avoid "yesterday" issues when sending to API as string
        // Or simply send YYYY-MM-DD strings
        const startStr = start.toLocaleDateString('en-CA'); // YYYY-MM-DD
        const endStr = end.toLocaleDateString('en-CA');

        try {
            const res = await fetch('/api/availability', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chaletId: selectedChaletId,
                    startDate: startStr,
                    endDate: endStr
                })
            });

            if (!res.ok) throw new Error('Failed to block date');

            const newBooking = await res.json();
            setBookings([...bookings, newBooking]);
        } catch (error) {
            console.error(error);
            alert('Failed to block date');
        }
    };

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const empties = Array.from({ length: firstDay }, (_, i) => i);

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    if (loading && chalets.length === 0) return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
            <LoadingSpinner size={40} color="hsl(var(--primary))" />
        </div>
    );

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Availability Calendar</h1>
            </div>

            <div className={styles.controls}>
                <div className={styles.monthNav}>
                    <button onClick={handlePrevMonth} className={styles.navBtn}>&lt;</button>
                    <div className={styles.monthTitle}>
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </div>
                    <button onClick={handleNextMonth} className={styles.navBtn}>&gt;</button>
                </div>

                <select
                    className={styles.chaletSelect}
                    value={selectedChaletId}
                    onChange={(e) => setSelectedChaletId(e.target.value)}
                >
                    {chalets.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
            </div>

            <div className={styles.grid}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className={styles.dayHeader}>{day}</div>
                ))}

                {empties.map(i => <div key={`empty-${i}`} className={`${styles.dayCell} ${styles.empty}`} />)}

                {days.map(day => {
                    const booking = checkDateStatus(day);
                    let statusClass = '';
                    if (booking) {
                        if (booking.guestName === 'Manual Block') statusClass = styles.blocked;
                        else if (booking.status === 'CONFIRMED') statusClass = styles.booked;
                        else if (booking.status === 'PENDING') statusClass = styles.pending;
                    }

                    return (
                        <div
                            key={day}
                            className={`${styles.dayCell} ${statusClass}`}
                            onClick={() => handleDateClick(day)}
                        >
                            <span className={styles.dateNumber}>{day}</span>
                            {booking && (
                                <span className={`${styles.statusIndicator} ${statusClass}`}>
                                    {booking.guestName === 'Manual Block' ? 'Blocked' : booking.guestName.split(' ')[0]}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className={styles.legend}>
                <div className={styles.legendItem}>
                    <div className={`${styles.legendDot} ${styles.booked}`} style={{ background: '#fee2e2' }}></div>
                    Booked
                </div>
                <div className={styles.legendItem}>
                    <div className={`${styles.legendDot} ${styles.pending}`} style={{ background: '#fef3c7' }}></div>
                    Pending
                </div>
                <div className={styles.legendItem}>
                    <div className={`${styles.legendDot} ${styles.blocked}`} style={{ background: '#f3f4f6' }}></div>
                    Blocked
                </div>
            </div>
        </div>
    );
}
