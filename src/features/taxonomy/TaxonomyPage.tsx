import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Radio } from 'lucide-react';
import taxaTreeData from '../../../data/taxa/tree.json';
import speciesIndexData from '../../../data/species-index.json';

const PHYLA_META: Record<string, { nameVi: string; nameEn: string; icon: string; descVi: string; descEn: string }> = {
  Chordata: {
    nameVi: 'Ngành Dây sống',
    nameEn: 'Phylum Chordata (Vertebrates & Allies)',
    icon: '🐅',
    descVi: 'Động vật có dây sống / xương sống: lớp Thú, Chim, Bò sát, Lưỡng cư và các nhóm Cá.',
    descEn: 'Vertebrates with notochord or vertebral column: mammals, birds, reptiles, amphibians, and fishes.',
  },
  Arthropoda: {
    nameVi: 'Ngành Chân khớp',
    nameEn: 'Phylum Arthropoda (Joint-legged Invertebrates)',
    icon: '🦋',
    descVi: 'Ngành động vật phong phú nhất: Côn trùng, Hình nhện, Giáp xác và Nhiều chân.',
    descEn: 'The most diverse animal phylum: insects, arachnids, crustaceans, and myriapods with chitinous exoskeletons.',
  },
  Mollusca: {
    nameVi: 'Ngành Thân mềm',
    nameEn: 'Phylum Mollusca (Mollusks)',
    icon: '🐙',
    descVi: 'Bạch tuộc, Mực ống, Ốc sên, Sò trai với cơ thể mềm và nhiều loài có vỏ đá vôi.',
    descEn: 'Octopuses, squids, snails, and bivalves with soft unsegmented bodies, radula, and calcareous shells.',
  },
  Cnidaria: {
    nameVi: 'Ngành Thích ty bào',
    nameEn: 'Phylum Cnidaria (Stinging Animals)',
    icon: '🪼',
    descVi: 'Sứa biển, San hô, Hải quỳ có các tế bào gai châm độc quyền bảo vệ và bắt mồi.',
    descEn: 'Jellyfish, corals, and sea anemones possessing specialized stinging cnidocytes for prey capture and defense.',
  },
  Echinodermata: {
    nameVi: 'Ngành Da gai',
    nameEn: 'Phylum Echinodermata (Echinoderms)',
    icon: '⭐',
    descVi: 'Sao biển, Nhím biển, Hải sâm sở hữu cấu trúc cơ thể đối xứng tỏa tròn năm cạnh.',
    descEn: 'Sea stars, sea urchins, and sea cucumbers exhibiting pentaradial symmetry and a water vascular system.',
  },
  Annelida: {
    nameVi: 'Ngành Giun đốt',
    nameEn: 'Phylum Annelida (Segmented Worms)',
    icon: '🪱',
    descVi: 'Giun đất, Đỉa, Rươi biển với các đốt cơ thể lặp lại và hệ tuần hoàn khép kín.',
    descEn: 'Earthworms, leeches, and marine polychaetes with true metameric segmentation and a closed circulatory system.',
  },
  Porifera: {
    nameVi: 'Ngành Thân lỗ (Hải miên)',
    nameEn: 'Phylum Porifera (Sponges)',
    icon: '🧽',
    descVi: 'Bọt biển nguyên sơ cấu tạo từ các tế bào cổ áo lọc nước, không có mô chuyên hóa.',
    descEn: 'Basal aquatic sponges with porous bodies and choanocytes filtering nutrients without true organized tissues.',
  },
  Platyhelminthes: {
    nameVi: 'Ngành Giun dẹp',
    nameEn: 'Phylum Platyhelminthes (Flatworms)',
    icon: '〰️',
    descVi: 'Sán lá, Sán dây, Giun dẹp tự do không có xoang cơ thể với khả năng tái sinh cao.',
    descEn: 'Free-living planarians, flukes, and tapeworms characterized by dorsoventrally flattened acoelomate bodies.',
  },
};

export const TaxonomyPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const tree = taxaTreeData as Record<string, { speciesCount: number; classes: Record<string, unknown> }>;
  const speciesList = speciesIndexData as Array<{ id: string; nameVi: string; nameEn?: string; scientific: string; phylum: string }>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Editorial Header */}
      <div className="mb-12">
        <div className="flex items-center gap-2 text-emerald-700 text-xs font-mono font-bold uppercase tracking-widest mb-2">
          <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
          GBIF Backbone Field Taxonomy System
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          {isEn ? 'Taxonomy of the 8 Animal Phyla (Kingdom Animalia)' : 'Cây Phân Loại 8 Ngành Động Vật (Animalia)'}
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-3xl leading-relaxed font-sans">
          {isEn
            ? 'Phylogenetic hierarchy from Phylum \u2192 Class \u2192 Order \u2192 Family \u2192 Genus \u2192 Species according to international catalog standards.'
            : 'Hệ thống phát sinh chủng loại từ Ngành (Phylum) \u2192 Lớp (Class) \u2192 Bộ (Order) \u2192 Họ (Family) \u2192 Chi (Genus) \u2192 Loài (Species).'}
        </p>
      </div>

      {/* 8 Phyla Grid: Field Expedition Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(PHYLA_META).map(([phylumKey, meta]) => {
          const phylumData = tree[phylumKey];
          const count = phylumData ? phylumData.speciesCount : 0;
          const classesCount = phylumData ? Object.keys(phylumData.classes).length : 0;
          const representativeSpecies = speciesList.find((s) => s.phylum === phylumKey);

          return (
            <div
              key={phylumKey}
              className="p-6 rounded-3xl bg-white border-2 border-emerald-100 hover:border-emerald-400 hover:shadow-xl transition-all flex flex-col justify-between group shadow-sm"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-3xl mb-5 group-hover:scale-105 transition-transform shadow-sm">
                  {meta.icon}
                </div>

                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-emerald-700 font-extrabold">
                    Phylum {phylumKey}
                  </span>
                </div>

                <h2 className="font-serif text-2xl font-bold text-slate-900 mb-1 group-hover:text-emerald-700 transition-colors">
                  {isEn ? meta.nameEn : meta.nameVi}
                </h2>

                <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-3">
                  <span>{count} {isEn ? 'specimens' : 'loài mẫu'}</span>
                  <span>•</span>
                  <span>{classesCount} {isEn ? 'classes' : 'lớp'}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-6 font-sans">
                  {isEn ? meta.descEn : meta.descVi}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                <Link
                  to={`/taxa/phylum/${phylumKey}`}
                  className="btn-expedition-secondary w-full !text-xs justify-between"
                >
                  <span>{isEn ? `Explore ${phylumKey} Tree` : `Xem cây ngành ${phylumKey}`}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                {representativeSpecies && (
                  <Link
                    to={`/species/${representativeSpecies.id}`}
                    className="flex items-center justify-between text-[11px] text-slate-500 hover:text-emerald-700 transition-colors px-1 font-mono"
                  >
                    <span>{isEn ? 'Representative:' : 'Đại diện:'} {isEn ? (representativeSpecies.nameEn || representativeSpecies.nameVi) : representativeSpecies.nameVi}</span>
                    <span>&rarr;</span>
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
