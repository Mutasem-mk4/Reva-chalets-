'use client';

import { use } from 'react';
import { getDictionary } from '@/lib/dictionaries';
import styles from '@/styles/guest.module.css';

export default function GuestProfilePage({ params }: { params: Promise<{ lang: string }> }) {
    // Unwrap params using React.use()
    const { lang } = use(params);
    const dict = getDictionary(lang);

    return (
        <div className="profile-page">
            <h1 className={styles.pageTitle}>{dict.rewards.settings}</h1>

            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <h3>{dict.booking.guestName}</h3>
                </div>
                <div className={styles.cardBody}>
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" defaultValue="Guest User" disabled className="form-input" />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" defaultValue="guest@example.com" disabled className="form-input" />
                    </div>
                </div>
            </div>

            <style jsx>{`
                .profile-page {
                    animation: fadeIn 0.5s ease-out;
                }
                .form-group {
                    margin-bottom: 1rem;
                }
                .form-group label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-weight: 500;
                }
                .form-input {
                    width: 100%;
                    padding: 0.75rem;
                    border: 1px solid #e2e8f0;
                    border-radius: 0.5rem;
                    background: #f8fafc;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
