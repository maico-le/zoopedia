import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ChevronRight } from 'lucide-react';

const MAJOR_PHYLA = [
  { id: 'chordata', nameVi: 'Ngành Dây sống', nameEn: 'Chordata', speciesCount: '~65,000', icon: '🐅', desc: 'Gồm các loài động vật có xương sống: Thú, Chim, Bò sát, Lưỡng cư, Cá.' },
  { id: 'arthropoda', nameVi: 'Ngành Chân khớp', nameEn: 'Arthropoda', speciesCount: '>1,300,000', icon: '🦋', desc: 'Nhóm đa dạng nhất: Côn trùng, Nhện, Giáp xác, Nhiều chân.' },
  { id: 'mollusca', nameVi: 'Ngành Thân mềm', nameEn: 'Mollusca', speciesCount: '~85,000', icon: '🐙', desc: 'Bạch tuộc, Mực, Ốc, Sò, Trai và các loài thân mềm khác.' },
  { id: 'annelida', nameVi: 'Ngành Giun đốt', nameEn: 'Annelida', speciesCount: '~22,000', icon: '🪱', desc: 'Giun đất, Đỉa, Rươi với cơ thể phân đốt đối xứng hai bên.' },
  { id: 'cnidaria', nameVi: 'Ngành Thích ty bào (Ruột khoang)', nameEn: 'Cnidaria', speciesCount: '~11,000', icon: '🪼', desc: 'Sứa biển, San hô, Hải quỳ có tế bào gai châm đốt đặc trưng.' },
  { id: 'echinodermata', nameVi: 'Ngành Da gai', nameEn: 'Echinodermata', speciesCount: '~7,000', icon: '⭐', desc: 'Sao biển, Nhím biển, Hải sâm với cấu trúc đối xứng tỏa tròn.' },
  { id: 'porifera', nameVi: 'Ngành Thân lỗ (Hải miên)', nameEn: 'Porifera', speciesCount: '~9,000', icon: '🧽', desc: 'Bọt biển nguyên sơ, cấu trúc cơ thể lọc nước không có mô thực sự.' },
  { id: 'platyhelminthes', nameVi: 'Ngành Giun dẹp', nameEn: 'Platyhelminthes', speciesCount: '~20,000', icon: '〰️', desc: 'Sán lá, Sán dây, Giun dẹp tự do không có xoang cơ thể.' },
];

export const TaxonomyPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Compass className="w-4 h-4" />
          Cây phân loại sinh vật (GBIF Backbone Taxonomy)
        </div>
        <h1 className="text-3xl font-black text-white">8 Ngành Động Vật Chủ Yếu</h1>
        <p className="text-stone-400 text-sm mt-1 max-w-2xl">
          Duyệt theo cây phân loại từ Ngành (Phylum) &rarr; Lớp (Class) &rarr; Bộ (Order) &rarr; Họ (Family) &rarr; Chi (Genus) &rarr; Loài (Species).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {MAJOR_PHYLA.map((p) => (
          <div
            key={p.id}
            className="rounded-2xl bg-stone-800/40 border border-stone-800 p-6 hover:border-emerald-500/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-stone-800 flex items-center justify-center text-2xl mb-4">
                {p.icon}
              </div>
              <h2 className="text-lg font-bold text-white">{p.nameVi}</h2>
              <div className="text-xs text-stone-400 italic mb-2">{p.nameEn} • {p.speciesCount} loài</div>
              <p className="text-xs text-stone-300 leading-relaxed mb-4">{p.desc}</p>
            </div>

            <Link
              to={p.id === 'chordata' ? '/species/panthera-tigris' : '#'}
              className="mt-4 pt-3 border-t border-stone-800/60 flex items-center justify-between text-xs font-semibold text-emerald-400 hover:text-emerald-300"
            >
              <span>{p.id === 'chordata' ? 'Khám phá loài đại diện (Hổ)' : 'Đang cập nhật'}</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
