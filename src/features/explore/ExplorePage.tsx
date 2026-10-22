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
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-natgeo-yellow uppercase tracking-widest mb-2">
          <Radio className="w-4 h-4 text-natgeo-yellow animate-pulse" />
          {t('explore.badge')}
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white uppercase tracking-tight">
          {t('explore.title')}
        </h1>
        <p className="text-stone-400 text-sm mt-1 max-w-2xl font-sans">
          {t('explore.desc')}
        </p>
      </div>

      {/* Main Expedition Search Bar */}
      <div className="relative mb-6">
        <div className="relative flex items-center field-panel field-ruler-bottom rounded-2xl border-2 border-natgeo-yellow/30 shadow-2xl focus-within:border-natgeo-yellow focus-within:shadow-natgeo transition-all overflow-hidden">
          <div className="w-2.5 self-stretch bg-natgeo-yellow shrink-0" />
          <Search className="w-5 h-5 absolute left-6 text-natgeo-yellow pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isEn ? "Search specimen archive (e.g. tiger, wolf, shark, octopus, Panthera)..." : "Tra cứu kho mẫu vật (ví dụ: hổ, chó sói, ca map, bach tuoc, Panthera)..."}
            className="w-full pl-14 pr-12 py-4 bg-transparent text-white placeholder-stone-400 text-sm focus:outline-none font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 p-1.5 rounded-lg text-stone-400 hover:text-natgeo-yellow"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Field Filter Control Drawer */}
      <div className="p-6 rounded-3xl field-panel border-2 border-natgeo-yellow/20 mb-8 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-natgeo-yellow">
            <Filter className="w-4 h-4 text-natgeo-yellow" />
            {t('explore.filterBoxTitle')}
          </div>

          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-rose-400 hover:text-rose-300 font-mono font-bold flex items-center gap-1 uppercase tracking-wider"
              >
                <X className="w-3.5 h-3.5" />
                {t('explore.resetFilters')}
              </button>
            )}

            <div className="flex items-center gap-1.5 text-xs text-stone-300 font-mono">
              <ArrowUpDown className="w-3.5 h-3.5 text-natgeo-yellow" />
              <span>{isEn ? 'Sort:' : 'Sắp xếp:'}</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'scientific' | 'iucn')}
                className="bg-black/80 border border-natgeo-yellow/30 rounded-lg px-2.5 py-1 text-white text-xs cursor-pointer focus:outline-none focus:border-natgeo-yellow font-sans"
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
            <label className="block text-[11px] font-mono uppercase text-stone-400 mb-1.5 font-bold">
              {t('explore.phylum')}
            </label>
            <select
              value={selectedPhylum}
              onChange={(e) => {
                setSelectedPhylum(e.target.value);
                setSelectedClass('ALL');
              }}
              className="w-full bg-black/70 border border-white/15 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-natgeo-yellow cursor-pointer"
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
            <label className="block text-[11px] font-mono uppercase text-stone-400 mb-1.5 font-bold">
              {t('explore.class')}
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full bg-black/70 border border-white/15 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-natgeo-yellow cursor-pointer"
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
            <label className="block text-[11px] font-mono uppercase text-stone-400 mb-1.5 font-bold">
              {t('explore.iucn')}
            </label>
            <div className="flex items-center gap-1">
              {iucnOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedIucn(status)}
                  className={`flex-1 py-1.5 rounded-lg font-mono text-[11px] font-bold transition-all border ${
                    selectedIucn === status
                      ? 'bg-natgeo-yellow text-stone-950 border-natgeo-yellow shadow-glow font-extrabold'
                      : 'bg-black/60 border-white/10 text-stone-400 hover:text-white'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* 3D Capabilities Toggle */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-stone-400 mb-1.5 font-bold">
              {isEn ? '3D Models' : 'Mô hình 3D'}
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setHas3DOnly(!has3DOnly)}
                className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all border ${
                  has3DOnly
                    ? 'bg-natgeo-yellow text-stone-950 border-natgeo-yellow shadow-glow'
                    : 'bg-black/60 border-white/10 text-stone-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{isEn ? '3D Only' : 'Có 3D'}</span>
              </button>

              <button
                onClick={() => setTierAOnly(!tierAOnly)}
                className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all border ${
                  tierAOnly
                    ? 'bg-gradient-to-r from-natgeo-yellow to-amber-500 text-stone-950 border-natgeo-yellow shadow-glow'
                    : 'bg-black/60 border-white/10 text-stone-400 hover:text-white'
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
        <div className="text-xs font-mono font-bold text-stone-400 tracking-wider uppercase">
          {t('explore.showingResults', { count: results.length })}
        </div>
      </div>

      {/* Results Grid: Field Specimen Cards */}
      {results.length === 0 ? (
        <div className="py-24 text-center field-panel rounded-3xl border-2 border-natgeo-yellow/20 p-8">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="font-display text-xl font-bold text-white mb-2 uppercase">
            {isEn ? 'No matching specimens found' : 'Không tìm thấy mẫu vật phù hợp'}
          </h3>
          <p className="text-xs text-stone-400 max-w-sm mx-auto mb-4 font-sans">
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
              className="p-5 rounded-3xl field-panel field-panel-interactive transition-all group flex flex-col justify-between border border-natgeo-yellow/20 hover:border-natgeo-yellow/60"
            >
              <div>
                {/* Thumbnail / 3D Badge */}
                <div className="h-44 rounded-2xl bg-black/80 mb-4 overflow-hidden relative border border-white/10 flex items-center justify-center">
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
                  <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded font-mono text-[10px] font-extrabold bg-black/85 backdrop-blur-md text-amber-400 border border-amber-400/40">
                    IUCN: {specimen.iucn}
                  </div>

                  {/* Bottom-left 3D Tier Pill */}
                  <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-natgeo-yellow/20 backdrop-blur-md text-natgeo-yellow border border-natgeo-yellow/40">
                    Tier {specimen.tier} {specimen.has3D ? '3D' : '2D'}
                  </div>
                </div>

                {/* Specimen Names */}
                <h3 className="font-serif text-xl font-bold text-white group-hover:text-natgeo-yellow transition-colors">
                  {isEn ? (specimen.nameEn || specimen.nameVi) : specimen.nameVi}
                </h3>
                <div className="text-xs text-stone-400 font-serif italic mb-2">
                  {specimen.scientific}
                </div>

                {/* Taxonomy breadcrumb pills */}
                <div className="flex flex-wrap gap-1 text-[10px] font-mono text-stone-400">
                  <span className="px-2 py-0.5 rounded bg-black/60 border border-white/5">{specimen.phylum}</span>
                  <span className="px-2 py-0.5 rounded bg-black/60 border border-white/5">{specimen.class}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono font-bold text-natgeo-yellow">
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
