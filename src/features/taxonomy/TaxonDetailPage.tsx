import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ChevronDown, ChevronRight, Layers, Radio } from 'lucide-react';
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
        <Link to="/" className="hover:text-natgeo-yellow uppercase font-bold">{t('nav.home')}</Link>
        <span>/</span>
        <Link to="/taxa" className="hover:text-natgeo-yellow font-bold">ANIMALIA (8 PHYLA)</Link>
        <span>/</span>
        <span className="text-stone-300 uppercase">{taxonRank}</span>
        <span>/</span>
        <span className="text-natgeo-yellow font-bold uppercase">{taxonName}</span>
      </nav>

      {/* Taxon Banner */}
      <div className="p-8 rounded-3xl field-panel border-2 border-natgeo-yellow/25 mb-10 shadow-2xl relative overflow-hidden field-ruler-bottom">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-black/60 border border-natgeo-yellow/30 text-natgeo-yellow text-xs font-mono font-bold uppercase tracking-widest mb-3">
              <Radio className="w-3.5 h-3.5 text-natgeo-yellow animate-pulse" />
              {isEn ? `Taxon Rank: ${taxonRank.toUpperCase()}` : `Cấp phân loại: ${taxonRank.toUpperCase()}`}
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white mb-2 uppercase tracking-tight">
              {taxonName}
            </h1>
            <p className="text-sm text-stone-300 max-w-2xl leading-relaxed font-sans">
              {isEn
                ? `Biological taxon classified under the GBIF Backbone Taxonomy. Includes representative orders and morphologically specialized species.`
                : `Nhóm phân loại sinh học trực thuộc cơ sở dữ liệu GBIF Backbone Taxonomy. Bao gồm các bộ và loài thích nghi đặc trưng.`}
            </p>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 p-5 rounded-2xl bg-black/60 border border-natgeo-yellow/30 font-mono text-right">
            <div className="text-xs text-stone-400 uppercase">{isEn ? 'Catalogued' : 'Mẫu vật ghi nhận'}</div>
            <div className="font-display text-4xl font-extrabold text-natgeo-yellow">{matchedSpecies.length}</div>
            <div className="text-[10px] text-stone-400 font-bold">{isEn ? 'Identified species' : 'Loài đã định danh'}</div>
          </div>
        </div>
      </div>

      {/* Collapsible Sub-taxa Tree (if viewing a Phylum) */}
      {taxonRank === 'phylum' && Object.keys(childClasses).length > 0 && (
        <div className="mb-10 field-panel rounded-3xl border-2 border-natgeo-yellow/20 p-6 shadow-xl">
          <button
            onClick={() => setTreeExpanded(!treeExpanded)}
            className="w-full flex items-center justify-between text-left text-sm font-mono font-bold text-white pb-3 border-b border-white/10 uppercase"
          >
            <span className="flex items-center gap-2 text-natgeo-yellow">
              <Layers className="w-4 h-4 text-natgeo-yellow" />
              {isEn ? `Classes under Phylum ${taxonName}` : `Sơ đồ các Lớp (Classes) trực thuộc ngành ${taxonName}`}
            </span>
            {treeExpanded ? <ChevronDown className="w-4 h-4 text-natgeo-yellow" /> : <ChevronRight className="w-4 h-4 text-stone-400" />}
          </button>

          {treeExpanded && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
              {Object.entries(childClasses).map(([className, classData]) => (
                <Link
                  key={className}
                  to={`/taxa/class/${className}`}
                  className="p-3.5 rounded-2xl field-panel hover:border-natgeo-yellow/50 transition-all flex items-center justify-between group border border-white/10"
                >
                  <div>
                    <div className="text-xs font-mono font-bold text-white group-hover:text-natgeo-yellow uppercase">
                      Class {className}
                    </div>
                    <div className="text-[10px] font-mono text-stone-400">
                      {classData.speciesCount || 0} {isEn ? 'species' : 'loài'} • {Object.keys(classData.orders || {}).length} {isEn ? 'orders' : 'bộ'}
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-stone-500 group-hover:text-natgeo-yellow group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Species in this Taxon Grid */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-2xl font-extrabold text-white uppercase tracking-tight">
          {isEn ? `Specimens in this Group (${matchedSpecies.length})` : `Danh Sách Mẫu Vật Trong Nhóm (${matchedSpecies.length})`}
        </h2>
        <Link to="/explore" className="text-xs font-mono font-bold text-natgeo-yellow hover:underline">
          {isEn ? 'Explore all species \u2192' : 'Tra cứu toàn bộ giới động vật \u2192'}
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {matchedSpecies.map((s) => (
          <Link
            key={s.id}
            to={`/species/${s.id}`}
            className="p-5 rounded-3xl field-panel field-panel-interactive transition-all group flex flex-col justify-between border border-natgeo-yellow/20 hover:border-natgeo-yellow/60"
          >
            <div>
              <div className="h-44 rounded-2xl bg-black/80 mb-4 overflow-hidden relative border border-white/10 flex items-center justify-center">
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
                <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded font-mono text-[10px] font-bold bg-black/85 backdrop-blur-md text-amber-400 border border-amber-400/40">
                  IUCN: {s.iucn}
                </div>
                <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-natgeo-yellow/20 backdrop-blur-md text-natgeo-yellow border border-natgeo-yellow/40">
                  Tier {s.tier} {s.has3D ? '3D' : '2D'}
                </div>
              </div>

              <h3 className="font-serif text-xl font-bold text-white group-hover:text-natgeo-yellow transition-colors">
                {isEn ? (s.nameEn || s.nameVi) : s.nameVi}
              </h3>
              <div className="text-xs text-stone-400 font-serif italic mb-2">{s.scientific}</div>
              <div className="flex flex-wrap gap-1 text-[10px] font-mono text-stone-400">
                <span className="px-2 py-0.5 rounded bg-black/60 border border-white/5">{s.order}</span>
                <span className="px-2 py-0.5 rounded bg-black/60 border border-white/5">{s.family}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono font-bold text-natgeo-yellow">
              <span>{isEn ? 'View 3D Record' : 'Khám phá 3D'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
