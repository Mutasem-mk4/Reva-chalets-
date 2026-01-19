'use client';

import { useState } from 'react';
import type { Chalet } from '@/lib/data';

interface ChaletFiltersProps {
  chalets: Chalet[];
  onFilter: (filtered: Chalet[]) => void;
}

export default function ChaletFilters({ chalets, onFilter }: ChaletFiltersProps) {
  const [location, setLocation] = useState('all');

  // Get unique locations
  const locations = Array.from(new Set(chalets.map(c => c.location)));

  const handleLocationChange = (value: string) => {
    setLocation(value);

    if (value === 'all') {
      onFilter(chalets);
    } else {
      onFilter(chalets.filter(c => c.location === value));
    }
  };

  return (
    <div className="filters-container">
      <div className="location-filter">
        <select
          value={location}
          onChange={(e) => handleLocationChange(e.target.value)}
        >
          <option value="all">All Locations</option>
          {locations.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      <style jsx>{`
                .filters-container {
                    display: flex;
                    gap: 1rem;
                    flex-wrap: wrap;
                    margin-bottom: 2rem;
                    padding: 1rem 1.5rem;
                    background: hsl(var(--card));
                    border-radius: var(--radius);
                    border: 1px solid hsl(var(--border));
                }

                .location-filter select {
                    padding: 0.75rem 2rem 0.75rem 1rem;
                    border: 1px solid hsl(var(--border));
                    border-radius: var(--radius);
                    background: hsl(var(--background));
                    color: hsl(var(--foreground));
                    font-size: 1rem;
                    cursor: pointer;
                    min-width: 200px;
                    appearance: none;
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
                    background-repeat: no-repeat;
                    background-position: right 1rem center;
                }

                .location-filter select:focus {
                    outline: none;
                    border-color: hsl(var(--primary));
                }

                @media (max-width: 640px) {
                    .filters-container {
                        padding: 0.75rem 1rem;
                    }

                    .location-filter select {
                        width: 100%;
                    }
                }
            `}</style>
    </div>
  );
}

