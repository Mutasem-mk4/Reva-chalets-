'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/dashboard-chalets.module.css'; // Reusing styles where applicable

export default function NewChaletPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        price: '',
        description: '',
        amenities: [] as string[] // Simplification for now
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API save
        await new Promise(resolve => setTimeout(resolve, 1500));

        setLoading(false);
        router.push('/dashboard/chalets');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="add-chalet-page">
            <h1 style={{ marginBottom: '2rem' }}>Add New Chalet</h1>

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
                    <label>Images (Mock)</label>
                    <div className="file-upload">
                        <span>📁 Click to upload images</span>
                        <input type="file" multiple />
                    </div>
                </div>

                <div className="actions">
                    <button type="button" onClick={() => router.back()} className="cancel-btn">
                        Cancel
                    </button>
                    <button type="submit" className="save-btn" disabled={loading}>
                        {loading ? 'Saving...' : 'Create Chalet'}
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

         .file-upload {
            border: 2px dashed hsl(var(--border));
            padding: 2rem;
            text-align: center;
            border-radius: var(--radius);
            cursor: pointer;
            position: relative;
         }

         .file-upload input {
            position: absolute;
            inset: 0;
            opacity: 0;
            cursor: pointer;
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
