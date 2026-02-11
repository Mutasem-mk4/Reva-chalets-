'use client';

import { useState } from 'react';
import type { Chalet } from '@/lib/data';

interface ChaletFiltersProps {
  chalets: Chalet[];
  onFilter: (filtered: Chalet[]) => void;
  lang?: string;
}

export default function ChaletFilters({ chalets, onFilter, lang = 'en' }: ChaletFiltersProps) {
  const [location, setLocation] = useState('all');
  const [search, setSearch] = useState('');

  const locations = Array.from(new Set(chalets.map(c => c.location)));

  const applyFilters = (loc: string, query: string) => {
    let filtered = chalets;

    if (loc !== 'all') {
      filtered = filtered.filter(c => c.location === loc);
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q)
      );
    }

    onFilter(filtered);
  };

  const handleLocationChange = (value: string) => {
    setLocation(value);
    applyFilters(value, search);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    applyFilters(location, value);
  };

  return (
    <div className="filters-bar">
      {/* Search Input */}
      <div className="search-wrapper">
        <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
          <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={e => handleSearchChange(e.target.value)}
          placeholder={lang === 'ar' ? 'ابحث عن شاليه...' : 'Search chalets...'}
          className="search-input"
        />
      </div>

      {/* Location Filter */}
      <div className="select-wrapper">
        <select
          value={location}
          onChange={(e) => handleLocationChange(e.target.value)}
        >
          <option value="all">{lang === 'ar' ? 'جميع المواقع' : 'All Locations'}</option>
          {locations.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      <style jsx>{`
        .filters-bar {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          padding: 1rem;
          background: var(--color-cream-light);
          border-radius: 16px;
          border: 1px solid var(--color-gray-200);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .search-wrapper {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          color: var(--color-gray-400);
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.75rem;
          border: 1px solid var(--color-gray-200);
          border-radius: 12px;
          background: white;
          color: var(--color-forest);
          font-size: 0.95rem;
          font-family: var(--font-sans);
          transition: border-color 0.2s;
        }

        .search-input:focus {
          outline: none;
          border-color: var(--color-forest);
        }

        .search-input::placeholder {
          color: var(--color-gray-400);
        }

        .select-wrapper select {
          padding: 0.75rem 2.25rem 0.75rem 1rem;
          border: 1px solid var(--color-gray-200);
          border-radius: 12px;
          background: white;
          color: var(--color-forest);
          font-size: 0.95rem;
          cursor: pointer;
          min-width: 180px;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%231B3B36' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          font-family: var(--font-sans);
          transition: border-color 0.2s;
        }

        .select-wrapper select:focus {
          outline: none;
          border-color: var(--color-forest);
        }

        @media (max-width: 640px) {
          .filters-bar {
            flex-direction: column;
            gap: 0.75rem;
            padding: 0.75rem;
          }

          .select-wrapper select {
            width: 100%;
            min-width: unset;
          }
        }
      `}</style>
    </div>
  );
}
