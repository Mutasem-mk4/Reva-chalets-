'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { TrendingUp, Calendar, Home, StarFilled } from '@/components/ui/Icons';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import styles from '@/styles/dashboard.module.css';

export default function DashboardOverview() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState<any[]>([]);
    const [recentBookings, setRecentBookings] = useState<any[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);

    useEffect(() => {
        const role = user?.user_metadata?.role;
        if (!loading && user && role !== 'admin' && role !== 'HOST') { // Allow HOST too
            router.push('/');
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (user) {
            fetch('/api/dashboard/stats')
                .then(res => res.json())
                .then(data => {
                    const iconMap: any = {
                        'revenue': <TrendingUp size={24} color="#16a34a" />,
                        'bookings': <Calendar size={24} color="#3b82f6" />,
                        'chalets': <Home size={24} color="#8b5cf6" />,
                        'rating': <StarFilled size={24} color="#f5a623" />
                    };

                    if (data.stats) {
                        setStats(data.stats.map((s: any) => ({
                            ...s,
                            icon: iconMap[s.type]
                        })));
                    }
                    if (data.recentBookings) {
                        setRecentBookings(data.recentBookings);
                    }
                    setIsLoadingData(false);
                })
                .catch(err => {
                    console.error(err);
                    setIsLoadingData(false);
                });
        }
    }, [user]);

    if (loading || !user) return <LoadingSpinner />;

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Dashboard Overview</h1>

            {isLoadingData ? (
                <LoadingSpinner />
            ) : (
                <>
                    <div className={styles.statsGrid}>
                        {stats.map((stat, idx) => (
                            <div key={idx} className={styles.statCard}>
                                <div className="flex justify-between items-start mb-2">
                                    <div className={styles.statLabel}>{stat.label}</div>
                                    {stat.icon}
                                </div>
                                <div className={styles.statValue}>{stat.value}</div>
                            </div>
                        ))}
                    </div>

                    <div className={styles.tableCard}>
                        <h2 className={styles.tableTitle}>Recent Bookings</h2>
                        {recentBookings.length === 0 ? (
                            <p style={{ padding: '1rem', color: '#6b7280' }}>No bookings yet.</p>
                        ) : (
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Guest</th>
                                        <th>Chalet</th>
                                        <th>Dates</th>
                                        <th>Status</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentBookings.map((booking: any) => (
                                        <tr key={booking.id}>
                                            <td>{booking.guestName}</td>
                                            <td>{booking.chaletName}</td>
                                            <td>{booking.dates}</td>
                                            <td>
                                                <span className={
                                                    booking.status === 'CONFIRMED' ? styles.statusConfirmed :
                                                        booking.status === 'PENDING' ? styles.statusPending :
                                                            styles.statusCancelled || ''
                                                }>
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td>{booking.amount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
