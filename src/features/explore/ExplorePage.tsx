import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, Layers, X, ArrowUpDown, ArrowRight, Compass } from 'lucide-react';
import { searchSpecies, getAllPhylaList, getAllClassesList, SearchableSpecies } from '../../lib/search-engine';

export const ExplorePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialQuery = searchParams.get('q') || '';
  const initialPhylum = searchParams.get('phylum') || 'ALL';
  const initialClass = searchParams.get('class') || 'ALL';
  const initialIucn = searchParams.get('iucn') || 'ALL';
  const initialHas3D = searchParams.get('has3D') === 'true';
  const initialTierA = searchParams.get('tierA') === 'true';

  const [query, setQuery] = useState(initialQuery);
  const [selectedPhylum, setSelectedPhylum] = useState(initialPhylum);
  const [selectedClass, setSelectedClass] = useState(initialClass);
  const [selectedIucn, setSelectedIucn] = useState(initialIucn);
  const [has3DOnly, setHas3DOnly] = useState(initialHas3D);
  const [tierAOnly, setTierAOnly] = useState(initialTierA);
  const [sortBy, setSortBy] = useState<'name' | 'scientific' | 'iucn'>('name');

  const phyla = ['ALL', ...getAllPhylaList()];
  const classes = ['ALL', ...getAllClassesList(selectedPhylum)];

  const iucnOptions = ['ALL', 'CR', 'EN', 'VU', 'NT', 'LC'];

  // Sync state with search params
  useEffect(() => {
    const params: Record<string, string> = {};
    if (query) params.q = query;
    if (selectedPhylum !== 'ALL') params.phylum = selectedPhylum;
    if (selectedClass !== 'ALL') params.class = selectedClass;
    if (selectedIucn !== 'ALL') params.iucn = selectedIucn;
    if (has3DOnly) params.has3D = 'true';
    if (tierAOnly) params.tierA = 'true';
    setSearchParams(params, { replace: true });
  }, [query, selectedPhylum, selectedClass, selectedIucn, has3DOnly, tierAOnly, setSearchParams]);

  // Execute search and filters
  let results: SearchableSpecies[] = searchSpecies(query, {
    phylum: selectedPhylum,
    class: selectedClass,
    iucn: selectedIucn,
    has3DOnly,
    tierAOnly,
  });

  // Sort
  results = results.sort((a, b) => {
    if (sortBy === 'scientific') return a.scientific.localeCompare(b.scientific);
    if (sortBy === 'iucn') {
      const order: Record<string, number> = { CR: 1, EN: 2, VU: 3, NT: 4, LC: 5 };
      return (order[a.iucn] || 99) - (order[b.iucn] || 99);
    }
    return a.nameVi.localeCompare(b.nameVi);
  });

  const handleResetFilters = () => {
    setQuery('');
    setSelectedPhylum('ALL');
    setSelectedClass('ALL');
    setSelectedIucn('ALL');
    setHas3DOnly(false);
    setTierAOnly(false);
  };

  const hasActiveFilters =
    query !== '' ||
    selectedPhylum !== 'ALL' ||
    selectedClass !== 'ALL' ||
    selectedIucn !== 'ALL' ||
    has3DOnly ||
    tierAOnly;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider mb-2">
          <Compass className="w-4 h-4" />
          Kho Mẫu Vật & Tra Cứu Toàn Diện
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white">
          Khám Phá Giới Động Vật
        </h1>
        <p className="text-stone-400 text-sm mt-1 max-w-2xl">
          Tìm kiếm nhanh có dấu/không dấu tiếng Việt, phân loại học theo 8 ngành, lọc theo cấp độ IUCN và mô hình 3D.
        </p>
      </div>

      {/* Main Search Bar */}
      <div className="relative mb-6">
        <div className="relative flex items-center bio-glass-panel rounded-2xl border border-white/15 shadow-specimen focus-within:border-emerald-500/60 transition-all">
          <Search className="w-5 h-5 absolute left-4 text-emerald-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tra cứu (ví dụ: hổ, chó sói, ca map, bach tuoc, Panthera, Mammalia)..."
            className="w-full pl-12 pr-10 py-4 bg-transparent text-white placeholder-stone-500 text-sm focus:outline-none font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 p-1 rounded-lg text-stone-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Control Drawer */}
      <div className="p-5 rounded-3xl bio-glass-panel border border-white/10 mb-8 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
            <Filter className="w-4 h-4" />
            Bộ lọc tiêu chí sinh học
          </div>

          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                Xóa tất cả bộ lọc
              </button>
            )}

            <div className="flex items-center gap-1.5 text-xs text-stone-400">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sắp xếp:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'scientific' | 'iucn')}
                className="bg-stone-900 border border-white/15 rounded-lg px-2.5 py-1 text-white text-xs cursor-pointer focus:outline-none"
              >
                <option value="name">Tên tiếng Việt (A-Z)</option>
                <option value="scientific">Danh pháp Latin</option>
                <option value="iucn">Mức độ đe dọa (IUCN)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filter Rows */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 text-xs">
          {/* Phylum Filter */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-stone-400 mb-1.5">
              Ngành (Phylum)
            </label>
            <select
              value={selectedPhylum}
              onChange={(e) => {
                setSelectedPhylum(e.target.value);
                setSelectedClass('ALL');
              }}
              className="w-full bg-stone-900 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              {phyla.map((p) => (
                <option key={p} value={p}>
                  {p === 'ALL' ? 'Tất cả các ngành' : p}
                </option>
              ))}
            </select>
          </div>

          {/* Class Filter */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-stone-400 mb-1.5">
              Lớp (Class)
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full bg-stone-900 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              {classes.map((c) => (
                <option key={c} value={c}>
                  {c === 'ALL' ? 'Tất cả các lớp' : c}
                </option>
              ))}
            </select>
          </div>

          {/* IUCN Red List Filter */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-stone-400 mb-1.5">
              Tình trạng bảo tồn (IUCN)
            </label>
            <div className="flex items-center gap-1">
              {iucnOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedIucn(status)}
                  className={`flex-1 py-1.5 rounded-lg font-mono text-[11px] font-bold transition-all ${
                    selectedIucn === status
                      ? 'bg-emerald-500 text-stone-950 shadow'
                      : 'bg-stone-900 border border-white/10 text-stone-400 hover:text-white'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* 3D Capabilities Toggle */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-stone-400 mb-1.5">
              Mô hình 3D tương tác
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setHas3DOnly(!has3DOnly)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  has3DOnly
                    ? 'bg-emerald-500 text-stone-950 font-bold shadow'
                    : 'bg-stone-900 border border-white/10 text-stone-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Có 3D</span>
              </button>

              <button
                onClick={() => setTierAOnly(!tierAOnly)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  tierAOnly
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 font-bold shadow'
                    : 'bg-stone-900 border border-white/10 text-stone-400 hover:text-white'
                }`}
              >
                <span>Tier A</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-xs font-mono text-stone-400">
          Tìm thấy <span className="text-emerald-400 font-bold">{results.length}</span> mẫu vật sinh học
        </div>
      </div>

      {/* Results Grid */}
      {results.length === 0 ? (
        <div className="py-24 text-center bio-glass-panel rounded-3xl border border-white/10 p-8">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="font-serif text-xl font-bold text-white mb-2">Không tìm thấy mẫu vật phù hợp</h3>
          <p className="text-xs text-stone-400 max-w-sm mx-auto mb-4">
            Thử thay đổi từ khóa tìm kiếm (bỏ dấu tiếng Việt, tìm theo tên Latin hoặc đổi bộ lọc).
          </p>
          <button
            onClick={handleResetFilters}
            className="btn-specimen text-xs"
          >
            Đặt lại tất cả bộ lọc
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {results.map((specimen) => (
            <Link
              key={specimen.id}
              to={`/species/${specimen.id}`}
              className="p-5 rounded-3xl bio-glass hover:border-emerald-500/50 hover:bg-white/[0.04] transition-all group flex flex-col justify-between"
            >
              <div>
                {/* Thumbnail / 3D Badge */}
                <div className="h-40 rounded-2xl bg-stone-900/80 mb-4 overflow-hidden relative border border-white/10 flex items-center justify-center">
                  {specimen.thumbnail ? (
                    <img
                      src={specimen.thumbnail}
                      alt={specimen.nameVi}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-5xl group-hover:scale-110 transition-transform">🐾</span>
                  )}

                  {/* Top-right IUCN Badge */}
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full font-mono text-[10px] font-bold bg-black/70 backdrop-blur-md text-amber-300 border border-white/10">
                    {specimen.iucn}
                  </div>

                  {/* Bottom-left 3D Tier Pill */}
                  <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-emerald-500/20 backdrop-blur-md text-emerald-300 border border-emerald-500/30">
                    Tier {specimen.tier} {specimen.has3D ? '3D' : '2D'}
                  </div>
                </div>

                {/* Specimen Names */}
                <h3 className="font-serif text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {specimen.nameVi}
                </h3>
                <div className="text-xs text-stone-400 font-serif italic mb-2">
                  {specimen.scientific}
                </div>

                {/* Taxonomy breadcrumb pills */}
                <div className="flex flex-wrap gap-1 text-[10px] font-mono text-stone-400">
                  <span className="px-1.5 py-0.5 rounded bg-white/5">{specimen.phylum}</span>
                  <span className="px-1.5 py-0.5 rounded bg-white/5">{specimen.class}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-emerald-400">
                <span>Xem hồ sơ</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
