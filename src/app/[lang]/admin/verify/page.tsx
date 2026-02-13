'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Check, X, MapPin, Eye } from '@/components/ui/Icons';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import styles from '@/styles/dashboard-chalets.module.css';

export default function VerifyChaletsPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [chalets, setChalets] = useState<any[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);

    useEffect(() => {
        if (!loading) {
            if (!user || user.user_metadata?.role !== 'admin') {
                router.push('/dashboard');
                return;
            }

            // Fetch pending chalets
            fetch('/api/admin/verify')
                .then(res => res.json())
                .then(data => {
                    setChalets(data);
                    setIsLoadingData(false);
                })
                .catch(err => {
                    console.error(err);
                    setIsLoadingData(false);
                });
        }
    }, [user, loading, router]);

    const handleAction = async (id: string, action: 'approve' | 'reject') => {
        try {
            const res = await fetch(`/api/admin/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, action })
            });

            if (res.ok) {
                setChalets(chalets.filter(c => c.id !== id));
            } else {
                alert('Failed to update status');
            }
        } catch (error) {
            console.error(error);
            alert('Error updating status');
        }
    };

    if (loading || isLoadingData) return <LoadingSpinner />;

    return (
        <div>
            <div className={styles.header}>
                <h1>Pending Approvals</h1>
                <div className={styles.statusBadge + ' ' + styles.pending}>
                    {chalets.length} Pending
                </div>
            </div>

            {chalets.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '16px' }}>
                    <p style={{ color: '#666', fontSize: '1.1rem' }}>🎉 All caught up! No pending chalets.</p>
                </div>
            ) : (
                <div className={styles.grid}>
                    {chalets.map((chalet) => (
                        <div key={chalet.id} className={styles.card}>
                            <div className={styles.imageWrapper}>
                                {chalet.images && JSON.parse(chalet.images).length > 0 ? (
                                    <img src={JSON.parse(chalet.images)[0]} alt={chalet.name} />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', background: '#eee' }} />
                                )}
                                <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.7)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem' }}>
                                    {chalet.owner?.name || 'Unknown Host'}
                                </div>
                            </div>
                            <div className={styles.content}>
                                <h3>{chalet.name}</h3>
                                <p className={styles.location}>
                                    <MapPin size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
                                    {chalet.location}
                                </p>
                                <div className={styles.price}>{chalet.price} JOD / night</div>

                                <div className={styles.actions} style={{ marginTop: '1.5rem' }}>
                                    <button
                                        className={styles.editBtn}
                                        style={{ background: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0' }}
                                        onClick={() => handleAction(chalet.id, 'approve')}
                                    >
                                        <Check size={16} style={{ marginRight: '0.25rem' }} /> Approve
                                    </button>
                                    <button
                                        className={styles.deleteBtn}
                                        onClick={() => handleAction(chalet.id, 'reject')}
                                    >
                                        <X size={16} style={{ marginRight: '0.25rem' }} /> Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
