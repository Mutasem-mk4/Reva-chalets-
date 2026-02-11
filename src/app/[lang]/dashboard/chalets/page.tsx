'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Chalet } from '@/lib/data';
import { MapPin, Plus, Edit, Trash } from '@/components/ui/Icons';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import styles from '@/styles/dashboard-chalets.module.css';

export default function MyChaletsPage() {
    const [chalets, setChalets] = useState<Chalet[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/chalets?mine=true')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setChalets(data);
                } else {
                    console.error('Failed to fetch chalets', data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this chalet?')) return;

        try {
            const res = await fetch(`/api/chalets/${id}`, {
                method: 'DELETE'
            });

            if (!res.ok) throw new Error('Failed to delete');

            setChalets(chalets.filter(c => c.id !== id));
        } catch (error) {
            console.error(error);
            alert('Failed to delete chalet');
        }
    };

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

            {chalets.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '12px' }}>
                    <p style={{ color: '#666', marginBottom: '1rem' }}>You haven't listed any chalets yet.</p>
                    <Link href="/dashboard/chalets/new" className={styles.addBtn} style={{ display: 'inline-flex' }}>
                        Create Your First Listing
                    </Link>
                </div>
            ) : (
                <div className={styles.grid}>
                    {chalets.map((chalet) => (
                        <div key={chalet.id} className={styles.card}>
                            <div className={styles.imageWrapper}>
                                {chalet.images && chalet.images.length > 0 ? (
                                    <img src={chalet.images[0]} alt={chalet.name} />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', background: '#eee' }} />
                                )}
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
                                    <button
                                        className={styles.deleteBtn}
                                        onClick={() => handleDelete(chalet.id)}
                                    >
                                        <Trash size={14} style={{ marginRight: '0.25rem' }} /> Delete
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
