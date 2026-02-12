'use client';

import { useState, useMemo } from 'react';
import type { Chalet } from '@/lib/data';
import { SlidersHorizontal, X, Check, Search, MapPin, Users, Star, Trees, Droplet, Flame } from 'lucide-react';
// Note: Lucide icons used for "Smart" feel

interface ChaletFiltersProps {
  chalets: Chalet[];
  onFilter: (filtered: Chalet[]) => void;
  lang?: string;
}

// 1. Genius Collections Logic
const getCollections = (lang: string) => [
  { id: 'all', label: lang === 'ar' ? 'الكل' : 'All', icon: null },
  { id: 'luxury', label: lang === 'ar' ? 'فخامة' : 'Luxury', icon: <Star size={14} /> },
  { id: 'nature', label: lang === 'ar' ? 'طبيعة' : 'Nature', icon: <Trees size={14} /> },
  { id: 'family', label: lang === 'ar' ? 'عائلات' : 'Families', icon: <Users size={14} /> },
  { id: 'pool', label: lang === 'ar' ? 'مسبح' : 'Pools', icon: <Droplet size={14} /> },
];

export default function ChaletFilters({ chalets, onFilter, lang = 'en' }: ChaletFiltersProps) {
  const [activeCollection, setActiveCollection] = useState('all');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Advanced Filters State
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [minGuests, setMinGuests] = useState(1);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const locations = Array.from(new Set(chalets.map(c => c.location)));
  const allAmenities = Array.from(new Set(chalets.flatMap(c => c.amenities)));
  const collections = getCollections(lang);

  // 2. The Genius Filter Engine
  const filteredChalets = useMemo(() => {
    return chalets.filter(chalet => {
      // A. Collection Filter
      if (activeCollection === 'luxury' && chalet.price < 200) return false;
      if (activeCollection === 'nature' && !['Ajloun', 'Salt', 'Jerash'].includes(chalet.location)) return false;
      if (activeCollection === 'family' && chalet.capacity < 6) return false;
      if (activeCollection === 'pool' && !chalet.amenities.some(a => a.toLowerCase().includes('pool'))) return false;

      // B. Search (Name/Location)
      if (search) {
        const q = search.toLowerCase();
        const matches =
          chalet.name.toLowerCase().includes(q) ||
          chalet.location.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // C. Advanced Filters (from Modal)
      if (chalet.price < priceRange[0] || chalet.price > priceRange[1]) return false;
      if (chalet.capacity < minGuests) return false;

      if (selectedAmenities.length > 0) {
        const hasAll = selectedAmenities.every(am => chalet.amenities.includes(am));
        if (!hasAll) return false;
      }

      return true;
    });
  }, [chalets, activeCollection, search, priceRange, minGuests, selectedAmenities]);

  // Update parent when filter results change
  useMemo(() => {
    onFilter(filteredChalets);
  }, [filteredChalets, onFilter]);

  const toggleAmenity = (am: string) => {
    setSelectedAmenities(prev =>
      prev.includes(am) ? prev.filter(x => x !== am) : [...prev, am]
    );
  };

  return (
    <div className="filter-system">
      {/* Top Bar: Search + Smart Chips + Filter Btn */}
      <div className="top-bar">
        {/* Search Input */}
        <div className="search-wrapper">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={lang === 'ar' ? 'ابحث باسم الشاليه أو المنطقة...' : 'Search for chalets...'}
            className="search-input"
          />
        </div>

        {/* Filter Trigger */}
        <button
          className={`filter-btn ${selectedAmenities.length > 0 || minGuests > 1 ? 'active' : ''}`}
          onClick={() => setShowModal(true)}
        >
          <SlidersHorizontal size={18} />
          <span className="desktop-only">{lang === 'ar' ? 'فلاتر' : 'Filters'}</span>
        </button>
      </div>

      {/* Smart Collections (Horizontal Scroll) */}
      <div className="collections-scroll">
        {collections.map(col => (
          <button
            key={col.id}
            className={`chip ${activeCollection === col.id ? 'active' : ''}`}
            onClick={() => setActiveCollection(col.id)}
          >
            {col.icon}
            <span>{col.label}</span>
          </button>
        ))}
      </div>

      {/* Advanced Filter Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{lang === 'ar' ? 'تصفية النتائج' : 'Filters'}</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              {/* 1. Price Range */}
              <div className="filter-section">
                <h4>{lang === 'ar' ? 'نطاق السعر (ليلة)' : 'Price Range (nightly)'}</h4>
                <div className="range-inputs">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="price-input"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="price-input"
                  />
                  <span className="currency">JOD</span>
                </div>
              </div>

              {/* 2. Guests */}
              <div className="filter-section">
                <h4>{lang === 'ar' ? 'عدد الضيوف' : 'Guests'}</h4>
                <div className="stepper">
                  <button onClick={() => setMinGuests(Math.max(1, minGuests - 1))}>-</button>
                  <span>{minGuests}+</span>
                  <button onClick={() => setMinGuests(minGuests + 1)}>+</button>
                </div>
              </div>

              {/* 3. Amenities */}
              <div className="filter-section">
                <h4>{lang === 'ar' ? 'المرافق' : 'Amenities'}</h4>
                <div className="amenities-grid">
                  {allAmenities.slice(0, 8).map(am => (
                    <button
                      key={am}
                      className={`amenity-chip ${selectedAmenities.includes(am) ? 'selected' : ''}`}
                      onClick={() => toggleAmenity(am)}
                    >
                      {am}
                      {selectedAmenities.includes(am) && <Check size={14} />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="clear-btn"
                onClick={() => {
                  setPriceRange([0, 1000]);
                  setMinGuests(1);
                  setSelectedAmenities([]);
                }}
              >
                {lang === 'ar' ? 'مسح الكل' : 'Clear all'}
              </button>
              <button className="apply-btn" onClick={() => setShowModal(false)}>
                {lang === 'ar' ? `عرض ${filteredChalets.length} نتائج` : `Show ${filteredChalets.length} homes`}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .filter-system {
            margin-bottom: 2rem;
        }

        .top-bar {
            display: flex;
            gap: 1rem;
            margin-bottom: 1rem;
        }

        .search-wrapper {
            flex: 1;
            position: relative;
            display: flex;
            align-items: center;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 99px;
            padding: 0.5rem 1rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.02);
            transition: all 0.2s;
        }

        .search-wrapper:focus-within {
            border-color: var(--color-forest);
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        .search-input {
            width: 100%;
            border: none;
            outline: none;
            margin: 0 0.5rem;
            font-size: 0.95rem;
            color: var(--color-forest);
        }

        .filter-btn {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0 1.25rem;
            border-radius: 99px;
            border: 1px solid #e5e7eb;
            background: white;
            cursor: pointer;
            font-weight: 600;
            color: #374151;
            transition: all 0.2s;
        }

        .filter-btn:hover {
            border-color: #374151;
            background: #f9fafb;
        }
        
        .filter-btn.active {
            border-color: var(--color-forest);
            background: #f0fdf4;
            color: var(--color-forest);
        }

        /* Collections */
        .collections-scroll {
            display: flex;
            gap: 0.75rem;
            overflow-x: auto;
            padding-bottom: 0.5rem;
            scrollbar-width: none; /* Hide scrollbar Firefox */
        }
        .collections-scroll::-webkit-scrollbar { display: none; }

        .chip {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.6rem 1rem;
            border-radius: 99px;
            border: none;
            background: rgba(255,255,255,0.6);
            color: #4b5563;
            cursor: pointer;
            font-size: 0.9rem;
            font-weight: 500;
            white-space: nowrap;
            transition: all 0.2s;
            border: 1px solid transparent;
        }

        .chip:hover {
            background: white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .chip.active {
            background: #1f2937; /* Dark charcoal */
            color: white;
            box-shadow: 0 4px 10px rgba(0,0,0,0.15);
        }

        /* Modal */
        .modal-overlay {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 100;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(4px);
        }

        .modal-content {
            background: white;
            width: 100%;
            max-width: 500px;
            border-radius: 20px;
            box-shadow: 0 20px 50px rgba(0,0,0,0.2);
            animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            max-height: 85vh;
            display: flex;
            flex-direction: column;
        }

        @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }

        .modal-header {
            padding: 1.25rem 1.5rem;
            border-bottom: 1px solid #f3f4f6;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .modal-header h3 { font-weight: 700; margin: 0; }
        .close-btn { background: none; border: none; cursor: pointer; padding: 0.25rem; border-radius: 50%; }
        .close-btn:hover { background: #f3f4f6; }

        .modal-body {
            padding: 1.5rem;
            overflow-y: auto;
        }

        .filter-section {
            margin-bottom: 2rem;
        }

        .filter-section h4 {
            font-size: 1rem;
            margin-bottom: 1rem;
            color: #1f2937;
        }

        .range-inputs {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .price-input {
            width: 100px;
            padding: 0.5rem;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            text-align: center;
        }

        .stepper {
            display: flex;
            align-items: center;
            gap: 1.5rem;
        }
        
        .stepper button {
            width: 32px; height: 32px;
            border-radius: 50%;
            border: 1px solid #d1d5db;
            background: white;
            cursor: pointer;
        }

        .amenities-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 0.75rem;
        }

        .amenity-chip {
            padding: 0.5rem 1rem;
            border-radius: 99px;
            border: 1px solid #e5e7eb;
            background: white;
            cursor: pointer;
            font-size: 0.9rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .amenity-chip.selected {
            border-color: black;
            background: black;
            color: white;
        }

        .modal-footer {
            padding: 1.25rem;
            border-top: 1px solid #f3f4f6;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .clear-btn {
            background: none; border: none;
            text-decoration: underline; cursor: pointer;
            font-size: 0.9rem; color: #4b5563;
        }

        .apply-btn {
            background: black; color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            border: none; cursor: pointer;
            font-weight: 600;
        }

        @media (max-width: 640px) {
            .desktop-only { display: none; }
            .filter-btn { padding: 0.5rem; }
            .modal-content { height: 100vh; max-height: none; border-radius: 0; }
        }
      `}</style>
    </div>
  );
}
