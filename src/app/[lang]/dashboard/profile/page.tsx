'use client';

import { useState, use, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { User, Email, Phone, Camera, Check, ArrowRight } from '@/components/ui/Icons';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function ProfilePage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = use(params);
    const { user, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.user_metadata?.name || '',
                email: user.email || '',
                phone: user.user_metadata?.phone || '',
            });
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setSuccess(true);
        setLoading(false);
        setTimeout(() => setSuccess(false), 3000);
    };

    if (authLoading) {
        return (
            <div className="profile-loading">
                <LoadingSpinner size={40} />
            </div>
        );
    }

    return (
        <div className="profile-page">
            <header className="profile-header">
                <h1>My Profile</h1>
                <p>Manage your account information and preferences</p>
            </header>

            <div className="profile-content">
                <div className="profile-avatar-section">
                    <div className="avatar">
                        {formData.name ? formData.name[0].toUpperCase() : 'U'}
                    </div>
                    <button className="avatar-upload">
                        <Camera size={16} />
                        Change Photo
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="profile-form">
                    {success && (
                        <div className="success-message">
                            <Check size={20} />
                            Profile updated successfully!
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <div className="input-wrapper">
                            <User size={20} className="input-icon" />
                            <input
                                id="name"
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Your full name"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <div className="input-wrapper">
                            <Email size={20} className="input-icon" />
                            <input
                                id="email"
                                type="email"
                                value={formData.email}
                                disabled
                                className="disabled"
                            />
                        </div>
                        <span className="input-hint">Email cannot be changed</span>
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <div className="input-wrapper">
                            <Phone size={20} className="input-icon" />
                            <input
                                id="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="+962 7X XXX XXXX"
                            />
                        </div>
                    </div>

                    <button type="submit" className="save-btn" disabled={loading}>
                        {loading ? <LoadingSpinner size={20} /> : (
                            <>
                                Save Changes
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <div className="danger-zone">
                    <h3>Danger Zone</h3>
                    <p>Permanently delete your account and all associated data.</p>
                    <button className="delete-btn">Delete Account</button>
                </div>
            </div>

            <style jsx>{`
                .profile-page {
                    max-width: 600px;
                }
                
                .profile-loading {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 400px;
                }
                
                .profile-header {
                    margin-bottom: 2rem;
                }
                
                .profile-header h1 {
                    font-family: var(--font-serif);
                    font-size: 1.75rem;
                    color: hsl(var(--foreground));
                    margin-bottom: 0.25rem;
                }
                
                .profile-header p {
                    color: hsl(var(--muted-foreground));
                }
                
                .profile-content {
                    background: hsl(var(--card));
                    border-radius: 1rem;
                    padding: 2rem;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                }
                
                .profile-avatar-section {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin-bottom: 2rem;
                    padding-bottom: 2rem;
                    border-bottom: 1px solid hsl(var(--border));
                }
                
                .avatar {
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.7) 100%);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2.5rem;
                    font-weight: 600;
                    margin-bottom: 1rem;
                }
                
                .avatar-upload {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    background: hsl(var(--secondary));
                    border: none;
                    border-radius: 2rem;
                    font-size: 0.875rem;
                    color: hsl(var(--foreground));
                    cursor: pointer;
                    transition: background 0.2s;
                }
                
                .avatar-upload:hover {
                    background: hsl(var(--secondary) / 0.8);
                }
                
                .profile-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                
                .success-message {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 1rem;
                    background: hsl(142 76% 36% / 0.1);
                    color: hsl(142 76% 36%);
                    border-radius: 0.5rem;
                    font-weight: 500;
                }
                
                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                
                .form-group label {
                    font-weight: 500;
                    font-size: 0.875rem;
                    color: hsl(var(--foreground));
                }
                
                .input-wrapper {
                    position: relative;
                    display: flex;
                    align-items: center;
                }
                
                :global(.input-icon) {
                    position: absolute;
                    left: 1rem;
                    color: hsl(var(--muted-foreground));
                }
                
                .input-wrapper input {
                    width: 100%;
                    padding: 0.875rem 1rem 0.875rem 3rem;
                    border: 1px solid hsl(var(--border));
                    border-radius: 0.5rem;
                    font-size: 1rem;
                    background: hsl(var(--background));
                    color: hsl(var(--foreground));
                    transition: border-color 0.2s;
                }
                
                .input-wrapper input:focus {
                    outline: none;
                    border-color: hsl(var(--primary));
                }
                
                .input-wrapper input.disabled {
                    background: hsl(var(--secondary));
                    cursor: not-allowed;
                    opacity: 0.7;
                }
                
                .input-hint {
                    font-size: 0.75rem;
                    color: hsl(var(--muted-foreground));
                }
                
                .save-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    padding: 1rem 2rem;
                    background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.8) 100%);
                    color: hsl(var(--primary-foreground));
                    border: none;
                    border-radius: 0.5rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                
                .save-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 20px hsl(var(--primary) / 0.3);
                }
                
                .save-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }
                
                .danger-zone {
                    margin-top: 2rem;
                    padding-top: 2rem;
                    border-top: 1px solid hsl(var(--border));
                }
                
                .danger-zone h3 {
                    color: hsl(0 84% 60%);
                    font-size: 1rem;
                    margin-bottom: 0.5rem;
                }
                
                .danger-zone p {
                    color: hsl(var(--muted-foreground));
                    font-size: 0.875rem;
                    margin-bottom: 1rem;
                }
                
                .delete-btn {
                    padding: 0.75rem 1.5rem;
                    background: transparent;
                    border: 1px solid hsl(0 84% 60%);
                    color: hsl(0 84% 60%);
                    border-radius: 0.5rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .delete-btn:hover {
                    background: hsl(0 84% 60%);
                    color: white;
                }
            `}</style>
        </div>
    );
}
