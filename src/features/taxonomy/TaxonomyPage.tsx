import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowRight } from 'lucide-react';
import taxaTreeData from '../../../data/taxa/tree.json';
import speciesIndexData from '../../../data/species-index.json';

const PHYLA_META: Record<string, { nameVi: string; icon: string; desc: string }> = {
  Chordata: {
    nameVi: 'Ngành Dây sống',
    icon: '🐅',
    desc: 'Động vật có dây sống / xương sống: lớp Thú, Chim, Bò sát, Lưỡng cư và các nhóm Cá.',
  },
  Arthropoda: {
    nameVi: 'Ngành Chân khớp',
    icon: '🦋',
    desc: 'Ngành động vật phong phú nhất: Côn trùng, Hình nhện, Giáp xác và Nhiều chân.',
  },
  Mollusca: {
    nameVi: 'Ngành Thân mềm',
    icon: '🐙',
    desc: 'Bạch tuộc, Mực ống, Ốc sên, Sò trai với cơ thể mềm và nhiều loài có vỏ đá vôi.',
  },
  Cnidaria: {
    nameVi: 'Ngành Thích ty bào',
    icon: '🪼',
    desc: 'Sứa biển, San hô, Hải quỳ có các tế bào gai châm độc quyền bảo vệ và bắt mồi.',
  },
  Echinodermata: {
    nameVi: 'Ngành Da gai',
    icon: '⭐',
    desc: 'Sao biển, Nhím biển, Hải sâm sở hữu cấu trúc cơ thể đối xứng tỏa tròn năm cạnh.',
  },
  Annelida: {
    nameVi: 'Ngành Giun đốt',
    icon: '🪱',
    desc: 'Giun đất, Đỉa, Rươi biển với các đốt cơ thể lặp lại và hệ tuần hoàn khép kín.',
  },
  Porifera: {
    nameVi: 'Ngành Thân lỗ (Hải miên)',
    icon: '🧽',
    desc: 'Bọt biển nguyên sơ cấu tạo từ các tế bào cổ áo lọc nước, không có mô chuyên hóa.',
  },
  Platyhelminthes: {
    nameVi: 'Ngành Giun dẹp',
    icon: '〰️',
    desc: 'Sán lá, Sán dây, Giun dẹp tự do không có xoang cơ thể với khả năng tái sinh cao.',
  },
};

export const TaxonomyPage: React.FC = () => {
  const tree = taxaTreeData as Record<string, { speciesCount: number; classes: Record<string, unknown> }>;
  const speciesList = speciesIndexData as Array<{ id: string; nameVi: string; scientific: string; phylum: string }>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Editorial Header */}
      <div className="mb-12">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
          <Compass className="w-4 h-4" />
          GBIF Backbone Taxonomy System
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white">
          Cây Phân Loại 8 Ngành Động Vật (Animalia)
        </h1>
        <p className="text-stone-300 text-sm sm:text-base mt-2 max-w-3xl leading-relaxed">
          Hệ thống phát sinh chủng loại từ Ngành (Phylum) &rarr; Lớp (Class) &rarr; Bộ (Order) &rarr; Họ (Family) &rarr; Chi (Genus) &rarr; Loài (Species).
        </p>
      </div>

      {/* 8 Phyla Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(PHYLA_META).map(([phylumKey, meta]) => {
          const phylumData = tree[phylumKey];
          const count = phylumData ? phylumData.speciesCount : 0;
          const classesCount = phylumData ? Object.keys(phylumData.classes).length : 0;
          const representativeSpecies = speciesList.find((s) => s.phylum === phylumKey);

          return (
            <div
              key={phylumKey}
              className="p-6 rounded-3xl bio-glass-panel border border-white/10 hover:border-emerald-500/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-stone-900 border border-white/10 flex items-center justify-center text-3xl mb-5 group-hover:scale-105 transition-transform shadow-lg">
                  {meta.icon}
                </div>

                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-emerald-400 font-bold">
                    Phylum {phylumKey}
                  </span>
                </div>

                <h2 className="font-serif text-2xl font-bold text-white mb-1 group-hover:text-emerald-300 transition-colors">
                  {meta.nameVi}
                </h2>

                <div className="flex items-center gap-2 text-xs font-mono text-stone-400 mb-3">
                  <span>{count} loài mẫu</span>
                  <span>•</span>
                  <span>{classesCount} lớp</span>
                </div>

                <p className="text-xs text-stone-300 leading-relaxed mb-6">
                  {meta.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
                <Link
                  to={`/taxa/phylum/${phylumKey}`}
                  className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-emerald-500/20 text-emerald-300 border border-white/10 hover:border-emerald-500/30 flex items-center justify-between text-xs font-semibold transition-all"
                >
                  <span>Xem cây ngành {phylumKey}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                {representativeSpecies && (
                  <Link
                    to={`/species/${representativeSpecies.id}`}
                    className="flex items-center justify-between text-[11px] text-stone-400 hover:text-white transition-colors px-1"
                  >
                    <span>Đại diện: {representativeSpecies.nameVi}</span>
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
