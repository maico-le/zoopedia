import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, Compass, Sparkles, AlertTriangle } from 'lucide-react';
import { matchVietnameseText } from '../../lib/normalize-vi';

// Initial seed index
const FEATURED_SPECIES = [
  {
    id: 'panthera-tigris',
    nameVi: 'Hổ (Cọp)',
    nameEn: 'Tiger',
    scientific: 'Panthera tigris',
    class: 'Mammalia',
    order: 'Carnivora',
    iucn: 'EN',
    tier: 'A',
  },
];

export const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = FEATURED_SPECIES.filter(
    (s) =>
      matchVietnameseText(s.nameVi, searchQuery) ||
      matchVietnameseText(s.nameEn, searchQuery) ||
      matchVietnameseText(s.scientific, searchQuery)
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (filtered.length > 0) {
      navigate(`/species/${filtered[0].id}`);
    }
  };

  return (
    <div className="relative">
      {/* Hero section */}
      <section className="relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8 border-b border-stone-800 bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Zoopedia v0.1 • 3D Biological Explorer</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-6">
            Khám phá Giới Động Vật qua{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Mô hình 3D & Giải Phẫu
            </span>
          </h1>

          <p className="text-lg text-stone-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Học tập sinh học tương tác đa chiều. Bóc tách từng lớp cơ quan, quan sát giải phẫu sống động và dữ liệu khoa học chính xác theo chuẩn GBIF & IUCN.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto relative mb-8">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 absolute left-4 text-stone-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search.placeholder')}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-stone-800/90 border border-stone-700 text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xl transition-all"
              />
            </div>

            {searchQuery && filtered.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-stone-800 border border-stone-700 rounded-xl overflow-hidden shadow-2xl z-20 text-left">
                {filtered.map((s) => (
                  <Link
                    key={s.id}
                    to={`/species/${s.id}`}
                    className="flex items-center justify-between px-4 py-3 hover:bg-stone-700/60 transition-colors border-b border-stone-700/40 last:border-0"
                  >
                    <div>
                      <div className="font-semibold text-white">{s.nameVi} <span className="text-stone-400 text-sm font-normal">({s.nameEn})</span></div>
                      <div className="text-xs text-stone-400 italic">{s.scientific}</div>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Tier {s.tier} 3D
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </form>

          {/* Quick links */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
            <span className="text-stone-500 font-medium">Lối tắt:</span>
            <Link
              to="/species/panthera-tigris"
              className="px-3 py-1.5 rounded-lg bg-stone-800 border border-stone-700 hover:border-emerald-500/50 text-stone-300 hover:text-white transition-all flex items-center gap-1.5"
            >
              🐅 Hổ Đông Dương (Giải phẫu 3D)
            </Link>
            <Link
              to="/taxa"
              className="px-3 py-1.5 rounded-lg bg-stone-800 border border-stone-700 hover:border-emerald-500/50 text-stone-300 hover:text-white transition-all flex items-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              Cây phân loại 8 ngành
            </Link>
          </div>
        </div>
      </section>

      {/* Featured cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Mô hình giải phẫu nổi bật</h2>
            <p className="text-sm text-stone-400">Xem cấu trúc giải phẫu nhiều lớp chi tiết</p>
          </div>
          <Link to="/species/panthera-tigris" className="text-sm font-semibold text-emerald-400 hover:underline">
            Xem tất cả &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/species/panthera-tigris"
            className="group block rounded-2xl bg-stone-800/40 border border-stone-800 hover:border-emerald-500/40 p-6 transition-all hover:shadow-xl hover:shadow-emerald-950/20"
          >
            <div className="h-44 rounded-xl bg-stone-800/80 mb-4 overflow-hidden relative flex items-center justify-center">
              <span className="text-6xl group-hover:scale-110 transition-transform">🐅</span>
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                IUCN: EN
              </div>
              <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Tier A Giải Phẫu
              </div>
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
              Hổ Đông Dương (Tiger)
            </h3>
            <p className="text-xs text-stone-400 italic mb-2">Panthera tigris</p>
            <p className="text-xs text-stone-300 line-clamp-2">
              Loài thú ăn thịt lớn nhất họ Mèo, có mô hình giải phẫu 3D bóc tách da, cơ, xương, tim và phổi.
            </p>
          </Link>

          <div className="rounded-2xl bg-stone-800/20 border border-stone-800/60 p-6 flex flex-col justify-center items-center text-center">
            <AlertTriangle className="w-8 h-8 text-stone-600 mb-2" />
            <h4 className="text-sm font-bold text-stone-400">Đang nạp thêm loài</h4>
            <p className="text-xs text-stone-500 mt-1 max-w-xs">
              Pipeline M2 đang tổng hợp ~100 loài đa dạng trải dài 8 ngành động vật.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
