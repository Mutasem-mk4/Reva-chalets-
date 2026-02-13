'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewChaletPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        price: '',
        description: '',
        imageUrl: '',
        amenities: '' // Comma separated for now
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/chalets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    images: formData.imageUrl ? [formData.imageUrl] : [],
                    amenities: formData.amenities.split(',').map(s => s.trim()).filter(Boolean),
                    capacity: 2 // Default for now
                })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to create chalet');
            }

            router.push('/dashboard/chalets');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const isAr = document.documentElement.lang === 'ar'; // Simple check since we are in client component and layout sets lang

    const labels = {
        title: isAr ? 'إضافة شاليه جديد' : 'Add New Chalet',
        name: isAr ? 'اسم الشاليه' : 'Chalet Name',
        namePlaceholder: isAr ? 'مثال: فيلا الغروب' : 'e.g. Sunset Villa',
        location: isAr ? 'الموقع' : 'Location',
        locationPlaceholder: isAr ? 'مثال: البحر الميت' : 'e.g. Dead Sea',
        price: isAr ? 'السعر لليلة (دينار)' : 'Price per night (JOD)',
        pricePlaceholder: isAr ? '250' : 'e.g. 250',
        description: isAr ? 'الوصف' : 'Description',
        descPlaceholder: isAr ? 'وصف تفصيلي للشاليه...' : 'Describe your chalet...',
        image: isAr ? 'رابط الصورة (مؤقت)' : 'Image URL (Temporary)',
        amenities: isAr ? 'المرافق (مفصولة بفاصلة)' : 'Amenities (Comma separated)',
        amenitiesPlaceholder: isAr ? 'مسبح، واي فاي، استجمام' : 'Pool, WiFi, BBQ, AC',
        cancel: isAr ? 'إلغاء' : 'Cancel',
        save: isAr ? 'حفظ الشاليه' : 'Create Chalet',
        saving: isAr ? 'جاري الحفظ...' : 'Saving...'
    };

    return (
        <div className="add-chalet-page" dir={isAr ? 'rtl' : 'ltr'}>
            <h1 style={{ marginBottom: '2rem' }}>{labels.title}</h1>

            {error && (
                <div style={{ background: '#fee2e2', color: '#ef4444', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="form-container">
                <div className="form-group">
                    <label>{labels.name}</label>
                    <input
                        name="name"
                        placeholder={labels.namePlaceholder}
                        required
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>{labels.location}</label>
                        <input
                            name="location"
                            placeholder={labels.locationPlaceholder}
                            required
                            value={formData.location}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>{labels.price}</label>
                        <input
                            name="price"
                            type="number"
                            placeholder={labels.pricePlaceholder}
                            required
                            value={formData.price}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>{labels.description}</label>
                    <textarea
                        name="description"
                        rows={5}
                        placeholder={labels.descPlaceholder}
                        required
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>{labels.image}</label>
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
                    <label>{labels.amenities}</label>
                    <input
                        name="amenities"
                        placeholder={labels.amenitiesPlaceholder}
                        value={formData.amenities}
                        onChange={handleChange}
                    />
                </div>

                <div className="actions">
                    <button type="button" onClick={() => router.back()} className="cancel-btn">
                        {labels.cancel}
                    </button>
                    <button type="submit" className="save-btn" disabled={loading}>
                        {loading ? labels.saving : labels.save}
                    </button>
                </div>
            </form>

            <style jsx>{`
         .add-chalet-page {
            max-width: 800px;
            margin: 0 auto;
         }

         .form-container {
            background: white;
            padding: 2.5rem;
            border-radius: 16px;
            border: 1px solid rgba(0,0,0,0.04);
            box-shadow: 0 4px 20px rgba(0,0,0,0.02);
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
            font-size: 0.9rem;
            color: #1c1917;
         }

         input, textarea {
            padding: 0.875rem;
            border: 1px solid #e5e5e5;
            border-radius: 10px;
            background: white;
            font-size: 1rem;
            width: 100%;
            transition: all 0.2s;
            font-family: inherit;
         }

         input:focus, textarea:focus {
            outline: none;
            border-color: #1c1917;
            box-shadow: 0 0 0 2px rgba(28, 25, 23, 0.05);
         }

         .actions {
            display: flex;
            gap: 1rem;
            margin-top: 1rem;
            padding-top: 1.5rem;
            border-top: 1px solid #f5f5f4;
         }

         .save-btn {
            background: #1c1917;
            color: white;
            padding: 0.875rem 2rem;
            border-radius: 10px;
            border: none;
            font-weight: 600;
            flex: 2;
            cursor: pointer;
            transition: all 0.2s;
         }
         
         .save-btn:hover {
            background: #292524;
            transform: translateY(-1px);
         }
         
         .save-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none;
         }

         .cancel-btn {
            background: white;
            border: 1px solid #e5e5e5;
            padding: 0.875rem 1rem;
            border-radius: 10px;
            flex: 1;
            cursor: pointer;
            font-weight: 500;
            color: #57534e;
            transition: all 0.2s;
         }

         .cancel-btn:hover {
            background: #f5f5f4;
            color: #1c1917;
         }

         @media (max-width: 600px) {
            .form-row {
                flex-direction: column;
                gap: 1.5rem;
            }
            
            .form-container {
                padding: 1.5rem;
            }
         }
       `}</style>
        </div>
    );
}
