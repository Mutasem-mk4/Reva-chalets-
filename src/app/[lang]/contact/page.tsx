'use client';

import { useState } from 'react';
import styles from '@/styles/contact.module.css';
import { MapPin, Phone, Email, Sparkles } from '@/components/ui/Icons';

export default function ContactPage() {
    const [status, setStatus] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        setTimeout(() => {
            setStatus('success');
        }, 1500);
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.infoSection}>
                    <h1>Get in Touch</h1>
                    <p className={styles.subtitle}>Have a question? We'd love to hear from you.</p>

                    <div className={styles.contactDetails}>
                        <div className={styles.detailItem}>
                            <span className={styles.icon}><MapPin size={24} /></span>
                            <div>
                                <h3>Visit Us</h3>
                                <p>Abdali Boulevard, Floor 15<br />Amman, Jordan</p>
                            </div>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.icon}><Phone size={24} /></span>
                            <div>
                                <h3>Call Us</h3>
                                <p>+962 79 000 0000</p>
                            </div>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.icon}><Email size={24} /></span>
                            <div>
                                <h3>Email Us</h3>
                                <p>hello@reva-chalets.com</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.formSection}>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        {status === 'success' ? (
                            <div className={styles.successMessage}>
                                <h3>Message Sent! <Sparkles size={20} style={{ display: 'inline', marginLeft: '0.25rem' }} /></h3>
                                <p>We'll get back to you shortly.</p>
                                <button type="button" onClick={() => setStatus('')} className={styles.resetBtn}>Send Another</button>
                            </div>
                        ) : (
                            <>
                                <div className={styles.formGroup}>
                                    <label>Full Name</label>
                                    <input type="text" placeholder="Your Name" required />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Email Address</label>
                                    <input type="email" placeholder="email@example.com" required />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Message</label>
                                    <textarea rows={5} placeholder="How can we help?" required></textarea>
                                </div>
                                <button type="submit" disabled={status === 'sending'} className={styles.submitBtn}>
                                    {status === 'sending' ? 'Sending...' : 'Send Message'}
                                </button>
                            </>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
