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
      <ChaletFilters chalets={chalets} onFilter={setFilteredChalets} lang={lang} />

      {/* Map */}
      <div className="map-wrapper">
        <MapWrapper chalets={filteredChalets} />
      </div>

      {/* Results Count */}
      <p className="results-count">
        {filteredChalets.length} {lang === 'ar'
          ? (filteredChalets.length === 1 ? 'شاليه' : 'شاليهات')
          : (filteredChalets.length === 1 ? 'chalet' : 'chalets')
        } {lang === 'ar' ? '' : 'found'}
      </p>

      {/* Grid */}
      <div className="chalet-grid">
        {filteredChalets.length > 0 ? (
          filteredChalets.map((chalet, idx) => (
            <ScrollReveal key={chalet.id} delay={idx * 0.08}>
              <ChaletCard chalet={chalet} lang={lang} dict={dict} />
            </ScrollReveal>
          ))
        ) : (
          <div className="no-results">
            <span className="no-results-icon">🔍</span>
            <p>{lang === 'ar' ? 'لا توجد نتائج مطابقة' : 'No chalets match your search.'}</p>
            <button onClick={() => setFilteredChalets(chalets)}>
              {lang === 'ar' ? 'مسح الفلاتر' : 'Clear Filters'}
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .map-wrapper {
          margin-bottom: 2rem;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
        }

        .results-count {
          color: var(--color-gray-500);
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .chalet-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          width: 100%;
        }

        .no-results {
          grid-column: 1 / -1;
          text-align: center;
          padding: 4rem 2rem;
          background: var(--color-cream-light);
          border-radius: 20px;
          border: 1px dashed var(--color-gray-200);
        }

        .no-results-icon {
          font-size: 2.5rem;
          display: block;
          margin-bottom: 1rem;
        }

        .no-results p {
          color: var(--color-gray-500);
          margin-bottom: 1.25rem;
          font-size: 1.05rem;
        }

        .no-results button {
          background: var(--gradient-gold);
          color: #ffffff;
          padding: 0.7rem 1.75rem;
          border: none;
          border-radius: 99px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.9rem;
          box-shadow: 0 4px 15px rgba(229, 166, 29, 0.3);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .no-results button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(229, 166, 29, 0.4);
        }

        @media (max-width: 1024px) {
          .chalet-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .chalet-grid {
            grid-template-columns: 1fr;
            gap: 1.25rem;
          }

          .map-wrapper {
            border-radius: 16px;
            margin-bottom: 1.5rem;
          }
        }
      `}</style>
    </>
  );
}
