import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, Filter, Layers, X, ArrowUpDown, ArrowRight, Radio } from 'lucide-react';
import { searchSpecies, getAllPhylaList, getAllClassesList, SearchableSpecies } from '../../lib/search-engine';

export const ExplorePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
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
    const nameA = isEn ? (a.nameEn || a.nameVi) : a.nameVi;
    const nameB = isEn ? (b.nameEn || b.nameVi) : b.nameVi;
    return nameA.localeCompare(nameB);
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
      {/* Expedition Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-700 uppercase tracking-widest mb-2">
          <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
          {t('explore.badge')}
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          {t('explore.title')}
        </h1>
        <p className="text-slate-600 text-sm mt-1 max-w-2xl font-sans">
          {t('explore.desc')}
        </p>
      </div>

      {/* Main Expedition Search Bar */}
      <div className="relative mb-6">
        <div className="relative flex items-center bg-white field-ruler-bottom rounded-2xl border-2 border-emerald-200 shadow-md focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all overflow-hidden">
          <div className="w-2.5 self-stretch bg-emerald-600 shrink-0" />
          <Search className="w-5 h-5 absolute left-6 text-emerald-600 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isEn ? "Search specimen archive (e.g. tiger, wolf, shark, octopus, Panthera)..." : "Tra cứu kho mẫu vật (ví dụ: hổ, chó sói, cá mập, bạch tuộc, Panthera)..."}
            className="w-full pl-14 pr-12 py-4 bg-transparent text-slate-800 placeholder-slate-400 text-sm focus:outline-none font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 p-1.5 rounded-lg text-slate-400 hover:text-emerald-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Field Filter Control Drawer */}
      <div className="p-6 rounded-3xl bg-white border-2 border-emerald-200 mb-8 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-emerald-700">
            <Filter className="w-4 h-4 text-emerald-600" />
            {t('explore.filterBoxTitle')}
          </div>

          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-rose-600 hover:text-rose-700 font-mono font-bold flex items-center gap-1 uppercase tracking-wider"
              >
                <X className="w-3.5 h-3.5" />
                {t('explore.resetFilters')}
              </button>
            )}

            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-mono font-semibold">
              <ArrowUpDown className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isEn ? 'Sort:' : 'Sắp xếp:'}</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'scientific' | 'iucn')}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 text-xs cursor-pointer focus:outline-none focus:border-emerald-500 font-sans font-medium"
              >
                <option value="name">{t('explore.sortByName')}</option>
                <option value="scientific">{t('explore.sortByScientific')}</option>
                <option value="iucn">{t('explore.sortByIucn')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filter Rows */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 text-xs font-mono">
          {/* Phylum Filter */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-slate-500 mb-1.5 font-bold">
              {t('explore.phylum')}
            </label>
            <select
              value={selectedPhylum}
              onChange={(e) => {
                setSelectedPhylum(e.target.value);
                setSelectedClass('ALL');
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 text-xs focus:outline-none focus:border-emerald-500 cursor-pointer font-sans"
            >
              {phyla.map((p) => (
                <option key={p} value={p}>
                  {p === 'ALL' ? (isEn ? 'All Phyla' : 'Tất cả các ngành') : p}
                </option>
              ))}
            </select>
          </div>

          {/* Class Filter */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-slate-500 mb-1.5 font-bold">
              {t('explore.class')}
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 text-xs focus:outline-none focus:border-emerald-500 cursor-pointer font-sans"
            >
              {classes.map((c) => (
                <option key={c} value={c}>
                  {c === 'ALL' ? (isEn ? 'All Classes' : 'Tất cả các lớp') : c}
                </option>
              ))}
            </select>
          </div>

          {/* IUCN Red List Filter: Stamped Style */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-slate-500 mb-1.5 font-bold">
              {t('explore.iucn')}
            </label>
            <div className="flex items-center gap-1">
              {iucnOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedIucn(status)}
                  className={`flex-1 py-1.5 rounded-lg font-mono text-[11px] font-bold transition-all border ${
                    selectedIucn === status
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm font-extrabold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* 3D Capabilities Toggle */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-slate-500 mb-1.5 font-bold">
              {isEn ? '3D Models' : 'Mô hình 3D'}
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setHas3DOnly(!has3DOnly)}
                className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all border ${
                  has3DOnly
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{isEn ? '3D Only' : 'Có 3D'}</span>
              </button>

              <button
                onClick={() => setTierAOnly(!tierAOnly)}
                className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all border ${
                  tierAOnly
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
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
        <div className="text-xs font-mono font-bold text-slate-500 tracking-wider uppercase">
          {t('explore.showingResults', { count: results.length })}
        </div>
      </div>

      {/* Results Grid: Field Specimen Cards */}
      {results.length === 0 ? (
        <div className="py-24 text-center bg-white rounded-3xl border-2 border-emerald-200 p-8 shadow-sm">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="font-display text-xl font-bold text-slate-900 mb-2">
            {isEn ? 'No matching specimens found' : 'Không tìm thấy mẫu vật phù hợp'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4 font-sans">
            {isEn
              ? 'Try adjusting your search query, searching by Latin binomial name, or clearing filters.'
              : 'Thử thay đổi từ khóa tìm kiếm (bỏ dấu tiếng Việt, tìm theo tên Latin hoặc đổi bộ lọc).'}
          </p>
          <button
            onClick={handleResetFilters}
            className="btn-expedition-primary text-xs"
          >
            {t('explore.resetFilters')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {results.map((specimen) => (
            <Link
              key={specimen.id}
              to={`/species/${specimen.id}`}
              className="p-5 rounded-3xl bg-white transition-all group flex flex-col justify-between border border-emerald-100 hover:border-emerald-400 hover:shadow-xl shadow-sm"
            >
              <div>
                {/* Thumbnail / 3D Badge */}
                <div className="h-44 rounded-2xl bg-slate-900 mb-4 overflow-hidden relative border border-slate-200 flex items-center justify-center">
                  {specimen.thumbnail ? (
                    <img
                      src={specimen.thumbnail}
                      alt={isEn ? (specimen.nameEn || specimen.nameVi) : specimen.nameVi}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-5xl group-hover:scale-110 transition-transform">🐾</span>
                  )}

                  {/* Corner reticle on thumbnail */}
                  <div className="viewfinder-corner-tl !w-2 !h-2" />
                  <div className="viewfinder-corner-tr !w-2 !h-2" />
                  <div className="viewfinder-corner-bl !w-2 !h-2" />
                  <div className="viewfinder-corner-br !w-2 !h-2" />

                  {/* Top-right Stamped IUCN Badge */}
                  <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded font-mono text-[10px] font-extrabold bg-white/90 backdrop-blur-md text-amber-700 border border-amber-300 shadow-sm">
                    IUCN: {specimen.iucn}
                  </div>

                  {/* Bottom-left 3D Tier Pill */}
                  <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-700/85 backdrop-blur-md text-white border border-emerald-500 shadow-sm">
                    Tier {specimen.tier} {specimen.has3D ? '3D' : '2D'}
                  </div>
                </div>

                {/* Specimen Names */}
                <h3 className="font-serif text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {isEn ? (specimen.nameEn || specimen.nameVi) : specimen.nameVi}
                </h3>
                <div className="text-xs text-emerald-600 font-serif italic mb-2">
                  {specimen.scientific}
                </div>

                {/* Taxonomy breadcrumb pills */}
                <div className="flex flex-wrap gap-1 text-[10px] font-mono text-slate-500">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-100">{specimen.phylum}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-50 text-slate-700 border border-slate-200">{specimen.class}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono font-bold text-emerald-700">
                <span>{isEn ? 'View Dossier' : 'Xem hồ sơ'}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
