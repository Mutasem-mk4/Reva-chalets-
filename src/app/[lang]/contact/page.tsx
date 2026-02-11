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
                    <p className={styles.subtitle}>Have a question? We'd love to hear from you. Reach out to the Riva Concierge team.</p>

                    <div className={styles.contactDetails}>
                        <div className={styles.detailItem}>
                            <span className={styles.icon}><MapPin size={24} /></span>
                            <div>
                                <h3>Visit Us</h3>
                                <p>Riva HQ, Campbell Gray Living<br />Abdali Boulevard, Amman</p>
                            </div>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.icon}><Phone size={24} /></span>
                            <div>
                                <h3>Call Us</h3>
                                <p><a href="tel:+962790000000" style={{ color: 'inherit' }}>+962 79 000 0000</a></p>
                                <p className={styles.note}>Daily 9am - 10pm</p>
                            </div>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.icon}><Email size={24} /></span>
                            <div>
                                <h3>Email Us</h3>
                                <p><a href="mailto:hello@riva.jo" style={{ color: 'inherit' }}>hello@riva.jo</a></p>
                                <p><a href="mailto:partners@riva.jo" style={{ color: 'inherit' }}>partners@riva.jo</a></p>
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
