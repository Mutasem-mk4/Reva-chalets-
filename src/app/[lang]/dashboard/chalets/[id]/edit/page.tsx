'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getChaletById, Chalet } from '@/lib/data';
import styles from '@/styles/dashboard-chalets.module.css';

export default function EditChaletPage() { // params are async in Next.js 15, but useParams is easier for client components
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState<Partial<Chalet>>({
        name: '',
        location: '',
        price: 0,
        description: '',
        images: [],
    });

    useEffect(() => {
        if (id) {
            getChaletById(id).then(data => {
                if (data) {
                    setFormData(data);
                }
                setLoading(false);
            });
        }
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        // Simulate API update
        await new Promise(resolve => setTimeout(resolve, 1500));

        alert('Chalet updated successfully!');
        setSaving(false);
        router.push('/dashboard/chalets');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (loading) return <div>Loading chalet data...</div>;

    return (
        <div className="add-chalet-page">
            <h1 style={{ marginBottom: '2rem' }}>Edit Chalet</h1>

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
                    <label>Photos</label>
                    <div className="image-grid">
                        {formData.images?.map((img, idx) => (
                            <div key={idx} className="image-preview">
                                <img src={img} alt={`Chalet ${idx + 1}`} />
                                <button
                                    type="button"
                                    className="delete-img-btn"
                                    onClick={() => {
                                        const newImages = formData.images?.filter((_, i) => i !== idx);
                                        setFormData({ ...formData, images: newImages });
                                    }}
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                        <div className="upload-box">
                            <span>+ Add Photos</span>
                            <input type="file" multiple accept="image/*" onChange={(e) => {
                                // Mock upload: just add a placeholder if file selected
                                if (e.target.files && e.target.files.length > 0) {
                                    // In real app: upload to S3/Cloudinary
                                    // Here: just mock pushing the same image or a placeholder
                                    const mockNewImage = '/images/chalet-1.png'; // Reusing existing for demo
                                    setFormData({
                                        ...formData,
                                        images: [...(formData.images || []), mockNewImage]
                                    });
                                }
                            }} />
                        </div>
                    </div>
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
 
          .cancel-btn {
             background: transparent;
             border: 1px solid hsl(var(--border));
             padding: 0.75rem 1rem;
             border-radius: var(--radius);
             flex: 1;
             cursor: pointer;
          }
 
          .image-grid {
             display: grid;
             grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
             gap: 1rem;
             margin-top: 0.5rem;
          }

          .image-preview {
             position: relative;
             aspect-ratio: 1;
             border-radius: var(--radius);
             overflow: hidden;
             border: 1px solid hsl(var(--border));
          }

          .image-preview img {
             width: 100%;
             height: 100%;
             object-fit: cover;
          }

          .delete-img-btn {
             position: absolute;
             top: 4px;
             right: 4px;
             background: rgba(239, 68, 68, 0.9);
             color: white;
             border: none;
             border-radius: 50%;
             width: 20px;
             height: 20px;
             font-size: 14px;
             line-height: 1;
             cursor: pointer;
             display: flex;
             align-items: center;
             justify-content: center;
          }

          .upload-box {
             border: 2px dashed hsl(var(--border));
             border-radius: var(--radius);
             display: flex;
             align-items: center;
             justify-content: center;
             cursor: pointer;
             aspect-ratio: 1;
             position: relative;
             color: hsl(var(--muted-foreground));
             font-size: 0.875rem;
             font-weight: 500;
             transition: border-color 0.2s;
          }

          .upload-box:hover {
             border-color: hsl(var(--primary));
             color: hsl(var(--primary));
             background: hsl(var(--primary) / 0.05);
          }

          .upload-box input {
             position: absolute;
             inset: 0;
             opacity: 0;
             cursor: pointer;
             width: 100%;
             height: 100%;
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
