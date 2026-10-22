import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Compass, ArrowRight, ChevronDown, ChevronRight, Layers } from 'lucide-react';
import taxaTreeData from '../../../data/taxa/tree.json';
import speciesIndexData from '../../../data/species-index.json';
import { SearchableSpecies } from '../../lib/search-engine';

interface TaxonClassData {
  speciesCount?: number;
  orders?: Record<string, unknown>;
}

interface TaxonPhylumData {
  classes?: Record<string, TaxonClassData>;
}

export const TaxonDetailPage: React.FC = () => {
  const { rank, name } = useParams<{ rank: string; name: string }>();
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const [treeExpanded, setTreeExpanded] = useState(true);

  const taxonRank = (rank || 'phylum').toLowerCase();
  const taxonName = name || 'Chordata';

  const allSpecies = speciesIndexData as SearchableSpecies[];
  const tree = taxaTreeData as Record<string, TaxonPhylumData>;

  // Filter species belonging to this taxon rank
  const matchedSpecies = allSpecies.filter((s) => {
    if (taxonRank === 'phylum') return s.phylum.toLowerCase() === taxonName.toLowerCase();
    if (taxonRank === 'class') return s.class.toLowerCase() === taxonName.toLowerCase();
    if (taxonRank === 'order') return s.order.toLowerCase() === taxonName.toLowerCase();
    return false;
  });

  // Extract children taxa hierarchy
  let childClasses: Record<string, TaxonClassData> = {};
  if (taxonRank === 'phylum' && tree[taxonName]) {
    childClasses = tree[taxonName].classes || {};
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-mono text-stone-400 mb-8 flex-wrap">
        <Link to="/" className="hover:text-emerald-400 uppercase">{t('nav.home')}</Link>
        <span>/</span>
        <Link to="/taxa" className="hover:text-emerald-400">ANIMALIA (8 PHYLA)</Link>
        <span>/</span>
        <span className="text-stone-300 uppercase">{taxonRank}</span>
        <span>/</span>
        <span className="text-emerald-400 font-bold uppercase">{taxonName}</span>
      </nav>

      {/* Taxon Banner */}
      <div className="p-8 rounded-3xl bio-glass-panel border border-white/10 mb-10 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-semibold uppercase tracking-wider mb-3">
              <Compass className="w-3.5 h-3.5" />
              {isEn ? `Taxon Rank: ${taxonRank.toUpperCase()}` : `Cấp phân loại: ${taxonRank.toUpperCase()}`}
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-2">
              {taxonName}
            </h1>
            <p className="text-sm text-stone-300 max-w-2xl leading-relaxed">
              {isEn
                ? `Biological taxon classified under the GBIF Backbone Taxonomy. Includes representative orders and morphologically specialized species.`
                : `Nhóm phân loại sinh học trực thuộc cơ sở dữ liệu GBIF Backbone Taxonomy. Bao gồm các bộ và loài thích nghi đặc trưng.`}
            </p>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 p-4 rounded-2xl bg-white/5 border border-white/10 font-mono text-right">
            <div className="text-xs text-stone-400 uppercase">{isEn ? 'Catalogued' : 'Mẫu vật ghi nhận'}</div>
            <div className="font-serif text-3xl font-bold text-emerald-400">{matchedSpecies.length}</div>
            <div className="text-[10px] text-stone-500">{isEn ? 'Identified species' : 'Loài đã định danh'}</div>
          </div>
        </div>
      </div>

      {/* Collapsible Sub-taxa Tree (if viewing a Phylum) */}
      {taxonRank === 'phylum' && Object.keys(childClasses).length > 0 && (
        <div className="mb-10 bio-glass-panel rounded-3xl border border-white/10 p-6 shadow-lg">
          <button
            onClick={() => setTreeExpanded(!treeExpanded)}
            className="w-full flex items-center justify-between text-left text-sm font-serif font-bold text-white pb-3 border-b border-white/10"
          >
            <span className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              {isEn ? `Classes under Phylum ${taxonName}` : `Sơ đồ các Lớp (Classes) trực thuộc ngành ${taxonName}`}
            </span>
            {treeExpanded ? <ChevronDown className="w-4 h-4 text-stone-400" /> : <ChevronRight className="w-4 h-4 text-stone-400" />}
          </button>

          {treeExpanded && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
              {Object.entries(childClasses).map(([className, classData]) => (
                <Link
                  key={className}
                  to={`/taxa/class/${className}`}
                  className="p-3.5 rounded-2xl bio-glass hover:border-emerald-500/40 transition-all flex items-center justify-between group"
                >
                  <div>
                    <div className="text-xs font-serif font-bold text-white group-hover:text-emerald-300">
                      Class {className}
                    </div>
                    <div className="text-[10px] font-mono text-stone-400">
                      {classData.speciesCount || 0} {isEn ? 'species' : 'loài'} • {Object.keys(classData.orders || {}).length} {isEn ? 'orders' : 'bộ'}
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-stone-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Species in this Taxon Grid */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-serif text-2xl font-bold text-white">
          {isEn ? `Specimens in this Group (${matchedSpecies.length})` : `Danh Sách Mẫu Vật Trong Nhóm (${matchedSpecies.length})`}
        </h2>
        <Link to="/explore" className="text-xs text-emerald-400 hover:underline">
          {isEn ? 'Explore all species \u2192' : 'Tra cứu toàn bộ giới động vật \u2192'}
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {matchedSpecies.map((s) => (
          <Link
            key={s.id}
            to={`/species/${s.id}`}
            className="p-5 rounded-3xl bio-glass hover:border-emerald-500/50 hover:bg-white/[0.04] transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="h-40 rounded-2xl bg-stone-900/80 mb-4 overflow-hidden relative border border-white/10 flex items-center justify-center">
                {s.thumbnail ? (
                  <img
                    src={s.thumbnail}
                    alt={isEn ? (s.nameEn || s.nameVi) : s.nameVi}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-5xl group-hover:scale-110 transition-transform">🐾</span>
                )}
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full font-mono text-[10px] font-bold bg-black/70 backdrop-blur-md text-amber-300 border border-white/10">
                  {s.iucn}
                </div>
                <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-emerald-500/20 backdrop-blur-md text-emerald-300 border border-emerald-500/30">
                  Tier {s.tier} {s.has3D ? '3D' : '2D'}
                </div>
              </div>

              <h3 className="font-serif text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                {isEn ? (s.nameEn || s.nameVi) : s.nameVi}
              </h3>
              <div className="text-xs text-stone-400 font-serif italic mb-2">{s.scientific}</div>
              <div className="flex flex-wrap gap-1 text-[10px] font-mono text-stone-400">
                <span className="px-1.5 py-0.5 rounded bg-white/5">{s.order}</span>
                <span className="px-1.5 py-0.5 rounded bg-white/5">{s.family}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-emerald-400">
              <span>{isEn ? 'View 3D Record' : 'Khám phá 3D'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
