'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function EditChaletPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        price: '',
        description: '',
        imageUrl: '',
        amenities: ''
    });

    useEffect(() => {
        fetch(`/api/chalets/${id}`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to load chalet');
                return res.json();
            })
            .then(data => {
                setFormData({
                    name: data.name,
                    location: data.location,
                    price: data.price.toString(),
                    description: data.description,
                    imageUrl: data.images[0] || '',
                    amenities: data.amenities.join(', ')
                });
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            const res = await fetch(`/api/chalets/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    location: formData.location,
                    price: formData.price,
                    description: formData.description,
                    capacity: 2,
                    images: formData.imageUrl ? [formData.imageUrl] : [],
                    amenities: formData.amenities.split(',').map(s => s.trim()).filter(Boolean)
                })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to update chalet');
            }

            router.push('/dashboard/chalets');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="add-chalet-page">
            <h1 style={{ marginBottom: '2rem' }}>Edit Chalet</h1>

            {error && (
                <div style={{ background: '#fee2e2', color: '#ef4444', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="form-container">
                <div className="form-group">
                    <label>Chalet Name</label>
                    <input
                        name="name"
                        placeholder="e.g. Sunset Villa"
                        required
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Location</label>
                        <input
                            name="location"
                            placeholder="e.g. Dead Sea"
                            required
                            value={formData.location}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Price per night (JOD)</label>
                        <input
                            name="price"
                            type="number"
                            placeholder="e.g. 250"
                            required
                            value={formData.price}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        name="description"
                        rows={5}
                        placeholder="Describe your chalet..."
                        required
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Image URL (Temporary)</label>
                    <input
                        name="imageUrl"
                        placeholder="https://example.com/image.jpg"
                        value={formData.imageUrl}
                        onChange={handleChange}
                    />
                    <small style={{ color: '#666', marginTop: '0.25rem' }}>
                        * Real file upload will be added later. Use a public image URL for testing.
                    </small>
                </div>

                <div className="form-group">
                    <label>Amenities (Comma separated)</label>
                    <input
                        name="amenities"
                        placeholder="Pool, WiFi, BBQ, AC"
                        value={formData.amenities}
                        onChange={handleChange}
                    />
                </div>

                <div className="actions">
                    <button type="button" onClick={() => router.back()} className="cancel-btn">
                        Cancel
                    </button>
                    <button type="submit" className="save-btn" disabled={saving}>
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>

            <style jsx>{`
         .add-chalet-page {
            max-width: 800px;
            margin: 0 auto;
         }

         .form-container {
            background: hsl(var(--card));
            padding: 2rem;
            border-radius: var(--radius);
            border: 1px solid hsl(var(--border));
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
         }

         .form-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
         }

         .form-row {
            display: flex;
            gap: 1.5rem;
         }
         
         .form-row .form-group {
            flex: 1;
         }

         label {
            font-weight: 500;
            font-size: 0.875rem;
         }

         input, textarea {
            padding: 0.75rem;
            border: 1px solid hsl(var(--input));
            border-radius: var(--radius);
            background: hsl(var(--background));
            font-size: 1rem;
            width: 100%;
         }

         .actions {
            display: flex;
            gap: 1rem;
            margin-top: 1rem;
         }

         .save-btn {
            background: hsl(var(--primary));
            color: hsl(var(--primary-foreground));
            padding: 0.75rem 2rem;
            border-radius: var(--radius);
            border: none;
            font-weight: 600;
            flex: 2;
            cursor: pointer;
         }
         
         .save-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
         }

         .cancel-btn {
            background: transparent;
            border: 1px solid hsl(var(--border));
            padding: 0.75rem 1rem;
            border-radius: var(--radius);
            flex: 1;
            cursor: pointer;
         }

         @media (max-width: 600px) {
            .form-row {
                flex-direction: column;
                gap: 1.5rem;
            }
            
            .form-container {
                padding: 1rem;
            }
         }
       `}</style>
        </div>
    );
}
