'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from '@/components/ui/Icons';
import styles from '@/styles/dashboard-calendar.module.css';

interface Booking {
    id: string;
    startDate: string;
    endDate: string;
    status: string;
    guestName: string;
    chalet: {
        name: string;
    };
}

export default function HostCalendar({ chaletId }: { chaletId?: string }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const query = chaletId ? `?chaletId=${chaletId}` : '';
        fetch(`/api/availability${query}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setBookings(data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, [chaletId]);

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const renderCalendar = () => {
        const totalDays = getDaysInMonth(currentDate);
        const startDay = getFirstDayOfMonth(currentDate); // 0 = Sunday
        const days = [];

        // Empty cells for previous month
        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} className={styles.dayEmpty} />);
        }

        // Days of current month
        for (let day = 1; day <= totalDays; day++) {
            const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];

            // Find bookings on this day
            const dailyBookings = bookings.filter(b => {
                const start = new Date(b.startDate).toISOString().split('T')[0];
                const end = new Date(b.endDate).toISOString().split('T')[0];
                return dateStr >= start && dateStr < end; // < end because checkout day is free
            });

            days.push(
                <div key={day} className={`${styles.day} ${dailyBookings.length > 0 ? styles.hasBooking : ''}`}>
                    <span className={styles.dayNumber}>{day}</span>
                    {dailyBookings.map((booking, idx) => (
                        <div key={idx} className={`${styles.event} ${booking.guestName === 'Blocked by Host' ? styles.blocked : ''}`}>
                            {booking.guestName === 'Blocked by Host' ? 'Blocked' : booking.guestName}
                        </div>
                    ))}
                </div>
            );
        }

        return days;
    };

    return (
        <div className={styles.calendarContainer}>
            <div className={styles.header}>
                <button onClick={prevMonth} className={styles.navBtn}><ChevronLeft size={20} /></button>
                <h2>{currentDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })}</h2>
                <button onClick={nextMonth} className={styles.navBtn}><ChevronRight size={20} /></button>
            </div>

            <div className={styles.weekdays}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} className={styles.weekday}>{d}</div>
                ))}
            </div>

            <div className={styles.grid}>
                {renderCalendar()}
            </div>
        </div>
    );
}
