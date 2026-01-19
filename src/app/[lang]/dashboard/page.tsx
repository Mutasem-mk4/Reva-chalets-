'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { TrendingUp, Calendar, Home, StarFilled } from '@/components/ui/Icons';
import styles from '@/styles/dashboard.module.css';

export default function DashboardOverview() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const role = user?.user_metadata?.role;
        if (!loading && user && role !== 'admin') {
            router.push('/dashboard/chalets');
        }
    }, [user, loading, router]);

    if (loading || !user || user.user_metadata?.role !== 'admin') return null;

    // Mock Data for Dashboard
    const stats = [
        { label: 'Total Revenue', value: '12,450 JOD', icon: <TrendingUp size={24} color="#16a34a" /> },
        { label: 'Active Bookings', value: '24', icon: <Calendar size={24} color="#3b82f6" /> },
        { label: 'Chalets Listed', value: '4', icon: <Home size={24} color="#8b5cf6" /> },
        { label: 'Avg. Rating', value: '4.8', icon: <StarFilled size={24} color="#f5a623" /> },
    ];

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Dashboard Overview</h1>

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
                        <tr>
                            <td>Sarah Connor</td>
                            <td>Dead Sea Villa</td>
                            <td>Oct 24 - 26</td>
                            <td><span className={styles.statusConfirmed}>Confirmed</span></td>
                            <td>500 JOD</td>
                        </tr>
                        <tr>
                            <td>John Wick</td>
                            <td>Petra Lodge</td>
                            <td>Nov 10 - 15</td>
                            <td><span className={styles.statusPending}>Pending</span></td>
                            <td>900 JOD</td>
                        </tr>
                        <tr>
                            <td>Ellen Ripley</td>
                            <td>Aqaba Suite</td>
                            <td>Dec 01 - 05</td>
                            <td><span className={styles.statusConfirmed}>Confirmed</span></td>
                            <td>1200 JOD</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
