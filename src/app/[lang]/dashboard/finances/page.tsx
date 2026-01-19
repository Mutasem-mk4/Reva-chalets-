'use client';

import { CreditCard, Lightning, DollarSign, Wallet } from '@/components/ui/Icons';
import styles from '@/styles/dashboard.module.css';

export default function FinancesPage() {
    const transactions = [
        { id: 'TXN-9982', method: 'Credit Card', amount: '500 JOD', date: 'Oct 24, 2024', status: 'Completed' },
        { id: 'TXN-8871', method: 'CliQ', amount: '900 JOD', date: 'Nov 10, 2024', status: 'Pending' },
        { id: 'TXN-7732', method: 'Credit Card', amount: '1200 JOD', date: 'Dec 01, 2024', status: 'Completed' },
        { id: 'TXN-6643', method: 'CliQ', amount: '450 JOD', date: 'Dec 05, 2024', status: 'Completed' },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className={styles.tableTitle} style={{ margin: 0 }}>Financial Overview</h1>
                <button style={{ background: 'hsl(var(--primary))', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
                    Request Payout
                </button>
            </div>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className="flex justify-between items-start mb-1">
                        <div className={styles.statLabel}>Total Revenue</div>
                        <DollarSign size={20} color="#16a34a" />
                    </div>
                    <div className={styles.statValue}>12,450 JOD</div>
                    <small style={{ color: '#16a34a' }}>+15% from last month</small>
                </div>
                <div className={styles.statCard}>
                    <div className="flex justify-between items-start mb-1">
                        <div className={styles.statLabel}>Pending Payout</div>
                        <Wallet size={20} color="#d97706" />
                    </div>
                    <div className={styles.statValue}>1,350 JOD</div>
                    <small style={{ color: '#d97706' }}>Available on Jan 30</small>
                </div>
                <div className={styles.statCard}>
                    <div className="flex justify-between items-start mb-1">
                        <div className={styles.statLabel}>CliQ Transactions</div>
                        <Lightning size={20} color="#3b82f6" />
                    </div>
                    <div className={styles.statValue}>4,200 JOD</div>
                    <small style={{ color: '#64748b' }}>34% of total volume</small>
                </div>
            </div>

            <div className={styles.tableCard}>
                <h2 className={styles.tableTitle}>Transaction History</h2>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Transaction ID</th>
                            <th>Method</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((txn, idx) => (
                            <tr key={idx}>
                                <td style={{ fontFamily: 'monospace' }}>{txn.id}</td>
                                <td>
                                    {txn.method === 'Credit Card' ? (
                                        <span className="flex items-center gap-1">
                                            <CreditCard size={14} /> Credit Card
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1">
                                            <Lightning size={14} /> CliQ
                                        </span>
                                    )}
                                </td>
                                <td>{txn.date}</td>
                                <td>
                                    <span style={{
                                        color: txn.status === 'Completed' ? '#16a34a' : '#d97706',
                                        fontWeight: 600,
                                        fontSize: '0.9rem'
                                    }}>
                                        {txn.status}
                                    </span>
                                </td>
                                <td style={{ fontWeight: 700 }}>{txn.amount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
