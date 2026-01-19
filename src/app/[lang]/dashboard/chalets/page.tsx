'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getChalets, Chalet } from '@/lib/data';
import { MapPin, Plus, Edit, Trash } from '@/components/ui/Icons';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import styles from '@/styles/dashboard-chalets.module.css';

export default function MyChaletsPage() {
    const [chalets, setChalets] = useState<Chalet[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app, we'd fetch only the owner's chalets
        getChalets().then(data => {
            setChalets(data);
            setLoading(false);
        });
    }, []);

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
            <LoadingSpinner size={40} color="hsl(var(--primary))" />
        </div>
    );

    return (
        <div>
            <div className={styles.header}>
                <h1>My Chalets</h1>
                <Link href="/dashboard/chalets/new" className={styles.addBtn}>
                    <Plus size={18} /> Add New Chalet
                </Link>
            </div>

            <div className={styles.grid}>
                {chalets.map((chalet) => (
                    <div key={chalet.id} className={styles.card}>
                        <div className={styles.imageWrapper}>
                            <img src={chalet.images[0]} alt={chalet.name} />
                        </div>
                        <div className={styles.content}>
                            <h3>{chalet.name}</h3>
                            <p className={styles.location}>
                                <MapPin size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
                                {chalet.location}
                            </p>
                            <div className={styles.price}>{chalet.price} JOD / night</div>
                            <div className={styles.actions}>
                                <Link href={`/dashboard/chalets/${chalet.id}/edit`} className={styles.editBtn}>
                                    <Edit size={14} style={{ marginRight: '0.25rem' }} /> Edit
                                </Link>
                                <button className={styles.deleteBtn}>
                                    <Trash size={14} style={{ marginRight: '0.25rem' }} /> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
