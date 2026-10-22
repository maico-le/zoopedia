import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, Compass, ArrowRight, Layers, AlertTriangle, Shuffle, MapPin, Radio } from 'lucide-react';
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
  descVi: string;
  descEn: string;
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
    descVi: 'Loài thú ăn thịt đầu bảng với bộ lông sọc vằn chân thực, cấu trúc giải phẫu uy lực.',
    descEn: 'Apex hypercarnivore featuring distinctive striped camouflage and formidable biomechanical musculature.',
    icon: '🐅',
  },
  {
    id: 'panthera-leo',
    nameVi: 'Sư tử châu Phi',
    nameEn: 'African Lion',
    scientific: 'Panthera leo',
    class: 'Mammalia',
    order: 'Carnivora',
    iucn: 'VU',
    modelGlb: 'models/panthera-leo.glb',
    descVi: 'Chúa tể thảo nguyên với bờm vàng oai vệ, sinh sống theo bầy đàn có tổ chức cao.',
    descEn: 'Monarch of the savanna exhibiting prominent sexual dimorphism with majestic manes and coordinated cooperative hunting.',
    icon: '🦁',
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
    descVi: 'Thú săn mồi có tổ chức bầy đàn chặt chẽ, khứu giác tinh nhạy và tiếng hú định danh.',
    descEn: 'Highly social apex canid with sophisticated pack coordination, extraordinary olfactory acuity, and acoustic territorial howling.',
    icon: '🐺',
  },
  {
    id: 'ursus-arctos',
    nameVi: 'Gấu nâu',
    nameEn: 'Brown Bear',
    scientific: 'Ursus arctos',
    class: 'Mammalia',
    order: 'Carnivora',
    iucn: 'LC',
    modelGlb: 'models/ursus-arctos.glb',
    descVi: 'Loài thú ăn tạp to lớn với lớp mỡ dày, vuốt khỏe thích nghi bắt cá hồi và đào bới.',
    descEn: 'Massive omnivorous carnivoran adapted for seasonal hyperphagia, hibernation, and versatile foraging with powerful excavating claws.',
    icon: '🐻',
  },
  {
    id: 'ailuropoda-melanoleuca',
    nameVi: 'Gấu trúc lớn',
    nameEn: 'Giant Panda',
    scientific: 'Ailuropoda melanoleuca',
    class: 'Mammalia',
    order: 'Carnivora',
    iucn: 'VU',
    modelGlb: 'models/ailuropoda-melanoleuca.glb',
    descVi: 'Bảo vật tự nhiên với hai màu lông đen trắng tương phản, ăn trúc chuyên biệt.',
    descEn: 'Iconic folivorous bear specialized in bamboo consumption, characterized by its distinctive pseudo-thumb and striking bicolored pelage.',
    icon: '🐼',
  },
  {
    id: 'carcharodon-carcharias',
    nameVi: 'Cá mập trắng lớn',
    nameEn: 'Great White Shark',
    scientific: 'Carcharodon carcharias',
    class: 'Chondrichthyes',
    order: 'Lamniformes',
    iucn: 'VU',
    modelGlb: 'models/carcharodon-carcharias.glb',
    descVi: 'Kẻ săn mồi đỉnh chóp đại dương với cơ thể hình thoi khí động học và khứu giác siêu đẳng.',
    descEn: 'Apex marine predator possessing a hydrodynamic fusiform body, serrated triangular dentition, and electroreceptive ampullae of Lorenzini.',
    icon: '🦈',
  },
  {
    id: 'chelonia-mydas',
    nameVi: 'Rùa xanh',
    nameEn: 'Green Sea Turtle',
    scientific: 'Chelonia mydas',
    class: 'Reptilia',
    order: 'Testudines',
    iucn: 'EN',
    modelGlb: 'models/chelonia-mydas.glb',
    descVi: 'Loài bò sát biển cổ xưa với mai sừng phẳng lướt nước và hành trình di cư nghìn dặm.',
    descEn: 'Ancient marine chelonian with a streamlined carapace, paddle-like flippers, and transatlantic natal homing navigation.',
    icon: '🐢',
  },
];

export const HomePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSpecimenIndex, setActiveSpecimenIndex] = useState(0);

  const isEn = i18n.language === 'en';
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

  const getSpecimenPrimaryName = (s: ExhibitSpecimen) => (isEn ? s.nameEn : s.nameVi);
  const getSpecimenSecondaryName = (s: ExhibitSpecimen) => (isEn ? s.nameVi : s.nameEn);
  const getSpecimenDesc = (s: ExhibitSpecimen) => (isEn ? s.descEn : s.descVi);

  const phylaCards = [
    {
      phylum: 'Chordata',
      nameVi: 'Ngành Dây sống',
      nameEn: 'Phylum Chordata (Vertebrates)',
      icon: '🐅',
      count: '~65,000',
      descVi: 'Động vật có xương sống: thú, chim, bò sát, lưỡng cư, cá.',
      descEn: 'Vertebrates including mammals, birds, reptiles, amphibians, and fishes.',
    },
    {
      phylum: 'Arthropoda',
      nameVi: 'Ngành Chân khớp',
      nameEn: 'Phylum Arthropoda (Joint-Legged)',
      icon: '🦋',
      count: '>1,300,000',
      descVi: 'Đa dạng nhất hành tinh: côn trùng, nhện, giáp xác.',
      descEn: 'The most diverse phylum: insects, arachnids, crustaceans, and myriapods.',
    },
    {
      phylum: 'Mollusca',
      nameVi: 'Ngành Thân mềm',
      nameEn: 'Phylum Mollusca (Soft-Bodied)',
      icon: '🐙',
      count: '~85,000',
      descVi: 'Bạch tuộc, mực, ốc sên, sò trai đối xứng hai bên.',
      descEn: 'Octopuses, squids, snails, and bivalves with soft unsegmented bodies.',
    },
    {
      phylum: 'Cnidaria',
      nameVi: 'Ngành Thích ty bào',
      nameEn: 'Phylum Cnidaria (Stinging Animals)',
      icon: '🪼',
      count: '~11,000',
      descVi: 'Sứa biển, san hô, hải quỳ với tế bào gai châm đốt độc đáo.',
      descEn: 'Jellyfish, corals, and sea anemones characterized by cnidocyte stinging cells.',
    },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Background Ambience: Topographic Field Canvas */}
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />
      <div className="absolute inset-0 bg-topo-grid bg-[size:48px_48px] opacity-35 pointer-events-none" />

      {/* Hero Field Expedition Section */}
      <section className="relative pt-10 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Editorial Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          {/* Field Dispatch Stamp Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-amber-400/30 text-amber-400 text-xs font-mono tracking-wider mb-6 shadow-sm">
            <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>{t('home.galleryBadge')}</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">DISPATCH #2026-BIO</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.15]">
            {t('home.heroTitle1')}{' '}
            <span className="block mt-2 italic font-serif font-normal bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
              {t('home.heroTitleHighlight')}
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 font-sans max-w-2xl mx-auto leading-relaxed">
            {t('home.heroSubtitle')}
          </p>
        </div>

        {/* Expedition Specimen Search Terminal */}
        <div className="max-w-2xl mx-auto mb-14">
          <form onSubmit={handleSearchSubmit} className="relative group">
            <div className="relative flex items-center bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-700/80 shadow-2xl group-focus-within:border-amber-400 group-focus-within:shadow-[0_0_25px_rgba(245,158,11,0.2)] transition-all overflow-hidden">
              <div className="pl-4 text-amber-400">
                <Search className="w-5 h-5" />
              </div>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('home.searchPlaceholder')}
                className="w-full pl-3.5 pr-28 py-4 bg-transparent text-white placeholder-slate-400 text-sm focus:outline-none font-sans"
              />

              <div className="absolute right-3 flex items-center gap-1.5 pointer-events-none">
                <kbd className="hidden sm:inline-block px-2.5 py-1 text-[10px] font-mono font-bold text-amber-400 bg-slate-800 border border-amber-400/30 rounded-md">
                  SEARCH [↵]
                </kbd>
              </div>
            </div>

            {/* Quick Autocomplete Dropdown */}
            {searchQuery && filtered.length > 0 && (
              <div className="absolute left-0 right-0 mt-3 field-panel border-2 border-natgeo-yellow/30 rounded-2xl overflow-hidden shadow-2xl z-30 divide-y divide-white/5">
                {filtered.map((s) => (
                  <Link
                    key={s.id}
                    to={`/species/${s.id}`}
                    className="flex items-center justify-between p-4 hover:bg-natgeo-yellow/10 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{s.icon}</span>
                      <div>
                        <div className="font-semibold text-white group-hover:text-natgeo-yellow transition-colors">
                          {getSpecimenPrimaryName(s)}{' '}
                          <span className="text-stone-400 text-xs font-normal">
                            ({getSpecimenSecondaryName(s)})
                          </span>
                        </div>
                        <div className="text-xs text-stone-400 font-serif italic">{s.scientific}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-natgeo-yellow/15 text-natgeo-yellow border border-natgeo-yellow/30">
                        {s.class}
                      </span>
                      <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-natgeo-yellow transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </form>

          {/* Quick Expedition Shortcuts: Tactile Mechanical Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6 text-xs font-mono">
            <Link
              to="/taxa"
              className="btn-expedition-secondary"
            >
              <Compass className="w-4 h-4 text-natgeo-yellow" />
              <span>{t('home.byPhylum')}</span>
            </Link>

            <button
              onClick={() => navigate(`/species/${getRandomSpeciesSlug()}`)}
              className="btn-expedition-secondary"
            >
              <Shuffle className="w-4 h-4 text-amber-400" />
              <span>{t('home.randomSpecimen')}</span>
            </button>

            <Link
              to="/explore?tierA=true"
              className="btn-expedition-secondary"
            >
              <Layers className="w-4 h-4 text-natgeo-yellow" />
              <span>{t('home.tierAModels')}</span>
            </Link>

            <Link
              to="/explore?iucn=EN"
              className="btn-expedition-secondary"
            >
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>{t('home.endangeredIucn')}</span>
            </Link>
          </div>

          {/* Expedition Field Specimen Filter Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-5 text-xs">
            <span className="text-stone-400 font-mono text-[11px] uppercase tracking-wider mr-1">
              {t('home.curatedSpecimens')}
            </span>
            {EXHIBIT_SPECIMENS.map((specimen, idx) => (
              <button
                key={specimen.id}
                onClick={() => setActiveSpecimenIndex(idx)}
                className={`btn-field-tag ${
                  activeSpecimenIndex === idx ? 'btn-field-tag-active' : ''
                }`}
              >
                <span>{specimen.icon}</span>
                <span>{getSpecimenPrimaryName(specimen)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Live Interactive 3D Field Specimen Viewport */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main 3D Viewport Box with Viewfinder Crosshairs */}
          <div className="lg:col-span-8">
            <div className="relative rounded-3xl overflow-hidden border-2 border-natgeo-yellow/30 shadow-2xl bg-expedition-dark">
              {/* Corner Viewfinder Camera Reticles */}
              <div className="viewfinder-corner-tl" />
              <div className="viewfinder-corner-tr" />
              <div className="viewfinder-corner-bl" />
              <div className="viewfinder-corner-br" />

              {/* Header Field Telemetry Bar */}
              <div className="px-5 py-3 bg-expedition-canvas/90 border-b border-natgeo-yellow/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{activeSpecimen.icon}</span>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                      {getSpecimenPrimaryName(activeSpecimen)}
                      <span className="font-sans text-xs text-stone-400 font-normal">
                        ({getSpecimenSecondaryName(activeSpecimen)})
                      </span>
                    </h3>
                    <p className="text-xs text-natgeo-yellow font-serif italic">
                      {activeSpecimen.scientific} • {t('home.class')} {activeSpecimen.class}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="field-stamp field-stamp-warning">
                    IUCN: {activeSpecimen.iucn}
                  </span>
                  <Link
                    to={`/species/${activeSpecimen.id}`}
                    className="btn-expedition-primary text-xs py-1.5 px-3.5 hidden sm:inline-flex"
                  >
                    <span>{t('home.specimenDetailLink')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* 3D Canvas Viewport */}
              <div className="h-[460px] sm:h-[540px] relative">
                <AnimalViewer
                  key={activeSpecimen.id}
                  modelGlb={activeSpecimen.modelGlb}
                  speciesName={getSpecimenPrimaryName(activeSpecimen)}
                  className="w-full h-full rounded-none border-none shadow-none"
                  hideTitleBadge={true}
                />
              </div>
            </div>
          </div>

          {/* Specimen Field Dispatch Dossier Column */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            <div className="p-6 rounded-3xl field-panel border-2 border-natgeo-yellow/25 shadow-2xl relative overflow-hidden">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-natgeo-yellow mb-3">
                <MapPin className="w-4 h-4 text-natgeo-yellow" />
                {t('home.specimenProfile')}
              </div>

              <h4 className="font-serif text-3xl font-bold text-white mb-1">
                {getSpecimenPrimaryName(activeSpecimen)}
              </h4>
              <p className="text-xs text-stone-400 font-serif italic mb-4">
                {activeSpecimen.scientific}
              </p>

              <p className="text-sm text-stone-300 leading-relaxed mb-6 font-sans">
                {getSpecimenDesc(activeSpecimen)}
              </p>

              <div className="space-y-3 pt-4 border-t border-white/10 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-stone-400">{t('home.kingdom')} (Kingdom)</span>
                  <span className="text-stone-200">Animalia</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-stone-400">{t('home.phylum')} (Phylum)</span>
                  <span className="text-natgeo-yellow font-bold">Chordata</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-stone-400">{t('home.class')} (Class)</span>
                  <span className="text-stone-200">{activeSpecimen.class}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-stone-400">{t('home.order')} (Order)</span>
                  <span className="text-stone-200">{activeSpecimen.order}</span>
                </div>
              </div>

              <Link
                to={`/species/${activeSpecimen.id}`}
                className="btn-expedition-primary mt-6 w-full py-3.5 flex items-center justify-center gap-2"
              >
                <span>{t('home.viewBioDetails')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Quick Switch Specimen Cards */}
            <div className="grid grid-cols-2 gap-3">
              {EXHIBIT_SPECIMENS.filter((_, i) => i !== activeSpecimenIndex).slice(0, 2).map((other) => (
                <button
                  key={other.id}
                  onClick={() => {
                    const idx = EXHIBIT_SPECIMENS.findIndex((s) => s.id === other.id);
                    setActiveSpecimenIndex(idx);
                  }}
                  className="p-3.5 rounded-2xl field-panel hover:border-natgeo-yellow/50 text-left transition-all group border border-white/10"
                >
                  <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">{other.icon}</div>
                  <div className="text-xs font-bold text-white group-hover:text-natgeo-yellow truncate">
                    {getSpecimenPrimaryName(other)}
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold mb-2">
              GBIF Backbone Field Taxonomy
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {t('home.taxonomyTitle')}
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              {t('home.taxonomySub')}
            </p>
          </div>

          <Link
            to="/taxa"
            className="btn-expedition-secondary text-xs"
          >
            <Compass className="w-4 h-4 text-amber-400" />
            <span>{t('home.viewFullTree')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {phylaCards.map((item) => (
            <Link
              key={item.phylum}
              to="/taxa"
              className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-amber-400/40 hover:bg-slate-800/60 transition-all shadow-xl group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="font-display text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                  {isEn ? item.nameEn : item.nameVi}
                </h3>
                <div className="text-xs font-mono text-amber-400 mb-2 mt-0.5">{item.phylum} • {item.count} {isEn ? 'species' : 'loài'}</div>
                <p className="text-xs text-slate-300 leading-relaxed">{isEn ? item.descEn : item.descVi}</p>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-sans font-bold text-amber-400">
                <span>{t('home.explorePhylum')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};
