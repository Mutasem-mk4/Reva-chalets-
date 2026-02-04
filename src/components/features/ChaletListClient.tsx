'use client';

import { useState } from 'react';
import ChaletCard from '@/components/features/ChaletCard';
import ChaletFilters from '@/components/features/ChaletFilters';
import ScrollReveal from '@/components/ui/ScrollReveal';
import MapWrapper from '@/components/ui/MapWrapper';
import type { Chalet } from '@/lib/data';

interface ChaletListClientProps {
  chalets: Chalet[];
  lang: string;
  dict: any;
}

export default function ChaletListClient({ chalets, lang, dict }: ChaletListClientProps) {
  const [filteredChalets, setFilteredChalets] = useState<Chalet[]>(chalets);

  return (
    <>
      {/* Filters */}
      <ChaletFilters chalets={chalets} onFilter={setFilteredChalets} />

      {/* Map */}
      <div className="mb-12">
        <MapWrapper chalets={filteredChalets} />
      </div>

      {/* Results Count */}
      <p className="results-count">
        {filteredChalets.length} {filteredChalets.length === 1 ? 'chalet' : 'chalets'} found
      </p>

      {/* Grid */}
      <div className="chalet-grid">
        {filteredChalets.length > 0 ? (
          filteredChalets.map((chalet, idx) => (
            <ScrollReveal key={chalet.id} delay={idx * 0.1}>
              <ChaletCard chalet={chalet} lang={lang} dict={dict} />
            </ScrollReveal>
          ))
        ) : (
          <div className="no-results">
            <p>No chalets match your search.</p>
            <button onClick={() => setFilteredChalets(chalets)}>Clear Filters</button>
          </div>
        )}
      </div>

      <style jsx>{`
        .results-count {
          color: hsl(var(--muted-foreground));
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
        }

        .chalet-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(100%, 340px), 1fr));
          gap: 2rem;
          width: 100%;
        }

        .no-results {
          grid-column: 1 / -1;
          text-align: center;
          padding: 4rem 2rem;
          background: hsl(var(--card));
          border-radius: var(--radius);
          border: 1px dashed hsl(var(--border));
        }

        .no-results p {
          color: hsl(var(--muted-foreground));
          margin-bottom: 1rem;
        }

        .no-results button {
          background: linear-gradient(135deg, #f5a623, #d4920a);
          color: #ffffff;
          padding: 0.6rem 1.5rem;
          border: none;
          border-radius: 3rem;
          cursor: pointer;
          font-weight: 600;
          box-shadow: 0 4px 15px rgba(245, 166, 35, 0.3);
        }

        @media (max-width: 768px) {
          .chalet-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
        }
      `}</style>
    </>
  );
}
