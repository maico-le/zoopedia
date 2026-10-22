import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Compass, Sparkles, ArrowRight, Layers, AlertTriangle, Shuffle, ShieldCheck } from 'lucide-react';
import { matchVietnameseText } from '../../lib/normalize-vi';
import { getRandomSpeciesSlug } from '../../lib/data-loader';
import { AnimalViewer } from '../viewer/AnimalViewer';

interface ExhibitSpecimen {
  id: string;
  nameVi: string;
  nameEn: string;
  scientific: string;
  class: string;
  order: string;
  iucn: string;
  modelGlb: string;
  desc: string;
  icon: string;
}

const EXHIBIT_SPECIMENS: ExhibitSpecimen[] = [
  {
    id: 'panthera-tigris',
    nameVi: 'Hổ Đông Dương',
    nameEn: 'Bengal Tiger',
    scientific: 'Panthera tigris',
    class: 'Mammalia',
    order: 'Carnivora',
    iucn: 'EN',
    modelGlb: 'models/panthera-tigris.glb',
    desc: 'Loài thú ăn thịt đầu bảng với bộ lông sọc vằn đặc trưng và cú cắn uy lực.',
    icon: '🐅',
  },
  {
    id: 'canis-lupus',
    nameVi: 'Chó sói xám',
    nameEn: 'Gray Wolf',
    scientific: 'Canis lupus',
    class: 'Mammalia',
    order: 'Carnivora',
    iucn: 'LC',
    modelGlb: 'models/canis-lupus.glb',
    desc: 'Thú săn mồi có tổ chức bầy đàn chặt chẽ và tiếng hú định danh lãnh thổ.',
    icon: '🐺',
  },
  {
    id: 'equus-caballus',
    nameVi: 'Ngựa hoang',
    nameEn: 'Wild Horse',
    scientific: 'Equus caballus',
    class: 'Mammalia',
    order: 'Perissodactyla',
    iucn: 'LC',
    modelGlb: 'models/equus-caballus.glb',
    desc: 'Động vật móng guốc đơn thích nghi với tốc độ chạy bền bỉ trên thảo nguyên.',
    icon: '🐎',
  },
  {
    id: 'flamingo',
    nameVi: 'Hồng hạc lớn',
    nameEn: 'Greater Flamingo',
    scientific: 'Phoenicopterus roseus',
    class: 'Aves',
    order: 'Phoenicopteriformes',
    iucn: 'LC',
    modelGlb: 'models/flamingo.glb',
    desc: 'Loài chim lội nước có bộ lông hồng rực rỡ nhờ sắc tố carotenoid từ thức ăn.',
    icon: '🦩',
  },
  {
    id: 'vulpes-vulpes',
    nameVi: 'Cáo đỏ',
    nameEn: 'Red Fox',
    scientific: 'Vulpes vulpes',
    class: 'Mammalia',
    order: 'Carnivora',
    iucn: 'LC',
    modelGlb: 'models/vulpes-vulpes.glb',
    desc: 'Loài thú ăn thịt nhỏ thông minh, thích nghi rộng rãi với nhiều môi trường.',
    icon: '🦊',
  },
];

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSpecimenIndex, setActiveSpecimenIndex] = useState(0);

  const activeSpecimen = EXHIBIT_SPECIMENS[activeSpecimenIndex];

  const filtered = EXHIBIT_SPECIMENS.filter(
    (s) =>
      matchVietnameseText(s.nameVi, searchQuery) ||
      matchVietnameseText(s.nameEn, searchQuery) ||
      matchVietnameseText(s.scientific, searchQuery)
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    } else if (filtered.length > 0) {
      navigate(`/species/${filtered[0].id}`);
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />
      <div className="absolute inset-0 bg-museum-grid bg-[size:40px_40px] opacity-40 pointer-events-none" />

      {/* Hero Exhibition Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Editorial Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bio-glass border border-emerald-500/30 text-emerald-300 text-xs font-mono tracking-wider uppercase mb-6 shadow-glow">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Phòng Trưng Bày Động Vật Học Tương Tác 3D</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.08]">
            Khám phá Giới Động Vật qua{' '}
            <span className="italic font-normal bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-200 bg-clip-text text-transparent">
              Mẫu vật 3D Sống động
            </span>
          </h1>

          <p className="text-base sm:text-lg text-stone-300 font-sans max-w-2xl mx-auto leading-relaxed">
            Học tập sinh học đa chiều chuẩn mực. Quan sát hình thái học, cấu trúc giải phẫu và dữ liệu phân loại học chính xác theo chuẩn dữ liệu bảo tàng quốc tế.
          </p>
        </div>

        {/* Specimen Search Terminal */}
        <div className="max-w-2xl mx-auto mb-14">
          <form onSubmit={handleSearchSubmit} className="relative group">
            <div className="relative flex items-center bio-glass-panel rounded-2xl border border-white/15 shadow-specimen group-focus-within:border-emerald-500/60 group-focus-within:shadow-glow transition-all">
              <div className="pl-5 text-emerald-400">
                <Search className="w-5 h-5" />
              </div>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tra cứu mẫu vật (Hổ Đông Dương, Chó sói, Panthera tigris)..."
                className="w-full pl-3.5 pr-24 py-4 bg-transparent text-white placeholder-stone-400 text-sm focus:outline-none"
              />

              <div className="absolute right-3 flex items-center gap-1.5 pointer-events-none">
                <kbd className="hidden sm:inline-block px-2 py-1 text-[10px] font-mono font-bold text-stone-400 bg-white/5 border border-white/10 rounded-md">
                  ENTER
                </kbd>
              </div>
            </div>

            {/* Quick Autocomplete Dropdown */}
            {searchQuery && filtered.length > 0 && (
              <div className="absolute left-0 right-0 mt-3 bio-glass-panel border border-white/15 rounded-2xl overflow-hidden shadow-2xl z-30 divide-y divide-white/5">
                {filtered.map((s) => (
                  <Link
                    key={s.id}
                    to={`/species/${s.id}`}
                    className="flex items-center justify-between p-4 hover:bg-emerald-500/10 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{s.icon}</span>
                      <div>
                        <div className="font-semibold text-white group-hover:text-emerald-300 transition-colors">
                          {s.nameVi} <span className="text-stone-400 text-xs font-normal">({s.nameEn})</span>
                        </div>
                        <div className="text-xs text-stone-400 font-serif italic">{s.scientific}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {s.class}
                      </span>
                      <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-emerald-400 transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </form>

          {/* Quick Explorer Shortcuts */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-5 text-xs">
            <Link
              to="/taxa"
              className="btn-specimen flex items-center gap-1.5 py-1.5 px-3"
            >
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span>Khám phá theo ngành</span>
            </Link>

            <button
              onClick={() => navigate(`/species/${getRandomSpeciesSlug()}`)}
              className="btn-specimen flex items-center gap-1.5 py-1.5 px-3"
            >
              <Shuffle className="w-3.5 h-3.5 text-amber-300" />
              <span>Mẫu vật ngẫu nhiên</span>
            </button>

            <Link
              to="/explore?tierA=true"
              className="btn-specimen flex items-center gap-1.5 py-1.5 px-3"
            >
              <Layers className="w-3.5 h-3.5 text-emerald-300" />
              <span>Mô hình 3D Tier A</span>
            </Link>

            <Link
              to="/explore?iucn=EN"
              className="btn-specimen flex items-center gap-1.5 py-1.5 px-3"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>Sắp nguy cấp (IUCN)</span>
            </Link>
          </div>

          {/* Botanical Filter Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
            <span className="text-stone-400 font-medium mr-1">Mẫu vật tuyển chọn:</span>
            {EXHIBIT_SPECIMENS.map((specimen, idx) => (
              <button
                key={specimen.id}
                onClick={() => setActiveSpecimenIndex(idx)}
                className={`btn-specimen ${
                  activeSpecimenIndex === idx ? 'btn-specimen-active' : ''
                }`}
              >
                <span>{specimen.icon}</span>
                <span>{specimen.nameVi}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Live Interactive 3D Showcase Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main 3D Viewport Box */}
          <div className="lg:col-span-8">
            <div className="relative rounded-3xl overflow-hidden border border-white/15 shadow-specimen bg-specimen-dark">
              {/* Header Telemetry Bar */}
              <div className="px-5 py-3 bio-glass border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{activeSpecimen.icon}</span>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                      {activeSpecimen.nameVi}
                      <span className="font-sans text-xs text-stone-400 font-normal">
                        ({activeSpecimen.nameEn})
                      </span>
                    </h3>
                    <p className="text-xs text-emerald-400 font-serif italic">
                      {activeSpecimen.scientific} • Lớp {activeSpecimen.class}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    IUCN: {activeSpecimen.iucn}
                  </span>
                  <Link
                    to={`/species/${activeSpecimen.id}`}
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-all"
                  >
                    Hồ sơ chi tiết &rarr;
                  </Link>
                </div>
              </div>

              {/* 3D Canvas */}
              <div className="h-[420px] sm:h-[500px] relative">
                <AnimalViewer
                  key={activeSpecimen.id}
                  modelGlb={activeSpecimen.modelGlb}
                  speciesName={activeSpecimen.nameVi}
                />
              </div>
            </div>
          </div>

          {/* Specimen Curated Insight Column */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            <div className="p-6 rounded-3xl bio-glass-panel border border-white/10 shadow-xl">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 mb-3">
                <ShieldCheck className="w-4 h-4" />
                Hồ sơ định danh mẫu vật
              </div>

              <h4 className="font-serif text-2xl font-bold text-white mb-2">
                {activeSpecimen.nameVi}
              </h4>
              <p className="text-xs text-stone-400 font-serif italic mb-4">
                {activeSpecimen.scientific}
              </p>

              <p className="text-sm text-stone-300 leading-relaxed mb-6">
                {activeSpecimen.desc}
              </p>

              <div className="space-y-3 pt-4 border-t border-white/10 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-stone-400">Giới (Kingdom)</span>
                  <span className="text-stone-200">Animalia</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-stone-400">Ngành (Phylum)</span>
                  <span className="text-emerald-400">Chordata (Dây sống)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-stone-400">Lớp (Class)</span>
                  <span className="text-stone-200">{activeSpecimen.class}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-stone-400">Bộ (Order)</span>
                  <span className="text-stone-200">{activeSpecimen.order}</span>
                </div>
              </div>

              <Link
                to={`/species/${activeSpecimen.id}`}
                className="mt-6 w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-stone-950 font-bold text-sm text-center shadow-lg shadow-emerald-900/40 transition-all flex items-center justify-center gap-2"
              >
                <span>Xem giải phẫu & đặc điểm sinh học</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Quick Switch Carousel Cards */}
            <div className="grid grid-cols-2 gap-3">
              {EXHIBIT_SPECIMENS.filter((_, i) => i !== activeSpecimenIndex).slice(0, 2).map((other) => (
                <button
                  key={other.id}
                  onClick={() => {
                    const idx = EXHIBIT_SPECIMENS.findIndex((s) => s.id === other.id);
                    setActiveSpecimenIndex(idx);
                  }}
                  className="p-3.5 rounded-2xl bio-glass hover:border-emerald-500/40 text-left transition-all group"
                >
                  <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">{other.icon}</div>
                  <div className="text-xs font-bold text-white group-hover:text-emerald-300 truncate">
                    {other.nameVi}
                  </div>
                  <div className="text-[10px] text-stone-400 font-serif italic truncate">
                    {other.scientific}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Biological Departments Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-white/10">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold mb-2">
              Phân loại học sinh vật học (Taxonomy)
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Cây phân loại 8 Ngành Động Vật
            </h2>
            <p className="text-sm text-stone-400 mt-1 max-w-xl">
              Từ ngành Dây sống (Chordata), Chân khớp (Arthropoda) đến Thân mềm (Mollusca).
            </p>
          </div>

          <Link
            to="/taxa"
            className="btn-specimen flex items-center gap-2 text-xs"
          >
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>Xem toàn bộ sơ đồ 8 ngành</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { phylum: 'Chordata', name: 'Ngành Dây sống', icon: '🐅', count: '~65,000 loài', desc: 'Động vật có xương sống: thú, chim, bò sát, lưỡng cư, cá.' },
            { phylum: 'Arthropoda', name: 'Ngành Chân khớp', icon: '🦋', count: '>1,300,000 loài', desc: 'Đa dạng nhất hành tinh: côn trùng, nhện, giáp xác.' },
            { phylum: 'Mollusca', name: 'Ngành Thân mềm', icon: '🐙', count: '~85,000 loài', desc: 'Bạch tuộc, mực, ốc sên, sò trai đối xứng hai bên.' },
            { phylum: 'Cnidaria', name: 'Ngành Ruột khoang', icon: '🪼', count: '~11,000 loài', desc: 'Sứa biển, san hô, hải quỳ với tế bào gai châm đốt độc đáo.' },
          ].map((item) => (
            <Link
              key={item.phylum}
              to="/taxa"
              className="p-6 rounded-3xl bio-glass hover:border-emerald-500/50 hover:bg-white/[0.04] transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-stone-900 border border-white/10 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="font-serif text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {item.name}
                </h3>
                <div className="text-xs font-mono text-emerald-400 mb-2">{item.phylum} • {item.count}</div>
                <p className="text-xs text-stone-300 leading-relaxed">{item.desc}</p>
              </div>

              <div className="mt-6 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-emerald-400">
                <span>Khám phá ngành</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};
