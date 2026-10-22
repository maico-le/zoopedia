import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import tigerData from '../../../data/species/panthera-tigris.json';
import { Species } from '../../types/species';
import { Copy, Check, Layers, ExternalLink, ArrowRightLeft, Sparkles, HeartHandshake, AlertTriangle, MapPin, Compass, Network, ArrowRight, GitFork } from 'lucide-react';
import { AnimalViewer } from '../viewer/AnimalViewer';
import { loadSpeciesBySlug } from '../../lib/data-loader';
import { SpeciesCompareModal } from './SpeciesCompareModal';
import { SizeComparison } from './SizeComparison';
import { LifeCycleTimeline } from './LifeCycleTimeline';
import { DietCard } from './DietCard';
import { DistributionMap } from './DistributionMap';
import { SubspeciesSection } from './SubspeciesSection';
import { AnatomyPanel } from './AnatomyPanel';
import { BioacousticsPlayer } from './BioacousticsPlayer';
import { useViewerStore } from '../viewer/useViewerStore';
import { EmptyTraitBadge } from '../../components/EmptyTraitBadge';

type TabKey =
  | 'overview'
  | 'anatomy'
  | 'morphology'
  | 'habitat'
  | 'diet'
  | 'behavior'
  | 'lifeCycle'
  | 'reproduction'
  | 'conservation'
  | 'funFacts'
  | 'provenance';

export const SpeciesPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [copied, setCopied] = useState(false);
  const [selectedModelGlb, setSelectedModelGlb] = useState<string>('models/panthera-tigris.glb');
  const [species, setSpecies] = useState<Species>((tigerData as unknown) as Species);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const { setIsAnatomyMode } = useViewerStore();

  useEffect(() => {
    if (slug) {
      loadSpeciesBySlug(slug).then((data) => {
        if (data) {
          setSpecies(data);
          if (data.media?.model3d?.glb) {
            setSelectedModelGlb(data.media.model3d.glb);
          } else {
            // High-fidelity archetype fallback based on class and order
            if (data.taxonomy.class === 'Aves') {
              setSelectedModelGlb('models/aquila-chrysaetos.glb');
            } else if (data.taxonomy.class === 'Chondrichthyes') {
              setSelectedModelGlb('models/carcharodon-carcharias.glb');
            } else if (data.taxonomy.order === 'Testudines') {
              setSelectedModelGlb('models/chelonia-mydas.glb');
            } else if (data.taxonomy.family === 'Equidae') {
              setSelectedModelGlb('models/equus-caballus.glb');
            } else if (data.taxonomy.family === 'Canidae') {
              setSelectedModelGlb('models/canis-lupus.glb');
            } else {
              setSelectedModelGlb('models/panthera-tigris.glb');
            }
          }
        }
      });
    }
  }, [slug]);

  const handleCopyScientific = () => {
    navigator.clipboard.writeText(species.names.scientific);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isEn = i18n.language === 'en';
  const commonName = isEn ? species.names.en[0] : species.names.vi[0];
  const secondaryName = isEn ? species.names.vi[0] : species.names.en[0];

  const tabs: { key: TabKey; num: string; label: string }[] = [
    { key: 'overview', num: '01', label: t('species.overview') },
    { key: 'anatomy', num: '02', label: isEn ? '3D Anatomy' : 'Giải Phẫu 3D' },
    { key: 'morphology', num: '03', label: t('species.morphology') },
    { key: 'habitat', num: '04', label: t('species.habitat') },
    { key: 'diet', num: '05', label: t('species.diet') },
    { key: 'behavior', num: '06', label: t('species.behavior') },
    { key: 'lifeCycle', num: '07', label: t('species.lifeCycle') },
    { key: 'reproduction', num: '08', label: t('species.reproduction') },
    { key: 'conservation', num: '09', label: t('species.conservation') },
    { key: 'funFacts', num: '10', label: t('species.funFacts') },
    { key: 'provenance', num: '11', label: t('species.provenance') },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Specimen Field Breadcrumb & Coordinates Code */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs mb-8 pb-4 border-b border-natgeo-yellow/20">
        <nav className="flex items-center gap-2 text-stone-400 flex-wrap font-mono">
          <Link to="/" className="hover:text-natgeo-yellow transition-colors uppercase font-bold">{t('nav.home')}</Link>
          <span className="text-stone-600">/</span>
          <Link to="/taxa" className="hover:text-natgeo-yellow transition-colors uppercase">{species.taxonomy.phylum}</Link>
          <span className="text-stone-600">/</span>
          <span className="text-stone-300 uppercase">{species.taxonomy.class}</span>
          <span className="text-stone-600">/</span>
          <span className="text-stone-300 uppercase">{species.taxonomy.order}</span>
          <span className="text-stone-600">/</span>
          <span className="text-natgeo-yellow font-bold uppercase">{species.names.scientific}</span>
        </nav>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded bg-black/60 border border-natgeo-yellow/30 text-[11px] font-mono text-stone-300">
            {t('species.catalogRef')} <span className="text-natgeo-yellow font-bold">GBIF-{species.taxonKey?.gbif || '5219416'}</span>
          </div>
          <div className="px-3 py-1 rounded bg-expedition-canvas border border-white/10 text-[11px] font-mono text-stone-400 hidden sm:block">
            IN SITU EXPEDITION LOG
          </div>
        </div>
      </div>

      {/* Specimen Header: Magazine Editorial Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-8 border-b border-natgeo-yellow/20">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-white uppercase">
              {commonName}
            </h1>
            <span className="text-xl text-stone-400 font-serif italic">({secondaryName})</span>

            {species.conservation?.iucn && (
              <span className="field-stamp field-stamp-danger">
                IUCN: {species.conservation.iucn}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5 mt-2">
            <span className="font-serif italic text-stone-300 text-lg">{species.names.scientific}</span>
            <span className="text-stone-400 text-xs font-mono">{species.names.authorship}</span>
            <button
              onClick={handleCopyScientific}
              className="p-1.5 rounded-lg text-stone-400 hover:text-natgeo-yellow hover:bg-white/10 transition-colors"
              title={copied ? t('species.copiedScientific') : t('species.copyScientific')}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-natgeo-yellow" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Specimen 3D Model Variants Switcher: Tactile Mechanical Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {species.media.model3d?.glb && (
            <div className="flex items-center gap-1.5 p-1.5 field-panel rounded-2xl border border-natgeo-yellow/30 shadow-xl">
              <button
                onClick={() => setSelectedModelGlb(species.media.model3d!.glb)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                  selectedModelGlb === species.media.model3d!.glb
                    ? 'btn-expedition-primary !py-2 !px-3.5 !rounded-xl'
                    : 'text-stone-300 hover:text-white hover:bg-white/5'
                }`}
              >
                🔬 {commonName} ({isEn ? '3D Model' : '3D Thực'})
              </button>

              {species.id !== 'panthera-tigris' && (
                <button
                  onClick={() => setSelectedModelGlb('models/panthera-tigris.glb')}
                  className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                    selectedModelGlb === 'models/panthera-tigris.glb'
                      ? 'btn-expedition-primary !py-2 !px-3.5 !rounded-xl'
                      : 'text-stone-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  🐅 {isEn ? 'Bengal Tiger' : 'Hổ Bengal'}
                </button>
              )}

              {species.id !== 'panthera-leo' && (
                <button
                  onClick={() => setSelectedModelGlb('models/panthera-leo.glb')}
                  className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                    selectedModelGlb === 'models/panthera-leo.glb'
                      ? 'btn-expedition-primary !py-2 !px-3.5 !rounded-xl'
                      : 'text-stone-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  🦁 {isEn ? 'African Lion' : 'Sư tử'}
                </button>
              )}
            </div>
          )}

          <button
            onClick={() => setShowCompareModal(true)}
            className="btn-expedition-secondary text-xs"
            title={t('species.compareSpecies')}
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-natgeo-yellow" />
            <span>{t('species.compareSpecies')}</span>
          </button>

          <Link
            to={`/evolution?species=${species.id}`}
            className="btn-expedition-secondary text-xs"
            title={isEn ? 'Trace on Phylogenetic Tree' : 'Xem trên Cây Tiến Hóa'}
          >
            <GitFork className="w-3.5 h-3.5 text-natgeo-yellow" />
            <span>{isEn ? 'Phylogeny Tree' : 'Cây Tiến Hóa'}</span>
          </Link>

          <span className="px-3.5 py-2 rounded-xl bg-black/60 text-natgeo-yellow text-xs font-mono font-bold flex items-center gap-1.5 border border-natgeo-yellow/40">
            <Layers className="w-4 h-4 text-natgeo-yellow" />
            {species.media.model3d?.tier === 'A' ? 'TIER A SPECIMEN' : species.media.model3d?.tier === 'B' ? 'TIER B ARCHETYPE' : 'TIER C SPECIMEN'}
          </span>
        </div>
      </div>

      {/* Main 3D Canvas Viewer & Field Dossier */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 relative rounded-3xl overflow-hidden border-2 border-natgeo-yellow/30 shadow-2xl bg-expedition-dark">
          {/* Viewfinder reticles */}
          <div className="viewfinder-corner-tl" />
          <div className="viewfinder-corner-tr" />
          <div className="viewfinder-corner-bl" />
          <div className="viewfinder-corner-br" />

          <AnimalViewer
            modelGlb={selectedModelGlb}
            anatomyGlb={species.id.includes('tigris') ? 'models/panthera-tigris-anatomy.glb' : undefined}
            images={species.media.images}
            speciesName={commonName}
            isRepresentative={species.media.model3d?.isRepresentative}
            representativeFor={species.media.model3d?.representativeFor}
          />
        </div>

        {/* Quick Biological Facts Column: Field Notebook Style */}
        <div className="lg:col-span-4 p-6 rounded-3xl field-panel border-2 border-natgeo-yellow/25 shadow-2xl flex flex-col gap-5">
          <div className="flex items-center justify-between pb-3 border-b border-natgeo-yellow/20">
            <h3 className="font-display text-lg font-bold text-white flex items-center gap-2 uppercase">
              <Compass className="w-5 h-5 text-natgeo-yellow" />
              {t('species.bioTraitsTitle')}
            </h3>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-natgeo-yellow/15 text-natgeo-yellow border border-natgeo-yellow/30 font-bold">
              VERIFIED
            </span>
          </div>

          <div className="space-y-3.5 text-sm">
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-stone-400 text-xs uppercase font-mono tracking-wider">{t('species.length')}</span>
              <span className="font-bold text-stone-100 font-mono">
                {species.morphology?.lengthCm ? `${species.morphology.lengthCm[0]} – ${species.morphology.lengthCm[1]} cm` : t('species.noData')}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-stone-400 text-xs uppercase font-mono tracking-wider">{t('species.weight')}</span>
              <span className="font-bold text-stone-100 font-mono">
                {species.morphology?.weightKg ? `${species.morphology.weightKg[0]} – ${species.morphology.weightKg[1]} kg` : t('species.noData')}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-stone-400 text-xs uppercase font-mono tracking-wider">{t('species.dietType')}</span>
              <span className="font-bold text-natgeo-yellow capitalize px-2.5 py-0.5 rounded bg-natgeo-yellow/10 border border-natgeo-yellow/30 text-xs font-mono">
                {species.diet?.type ? t(`diet.${species.diet.type}`, species.diet.type) : t('species.unspecified')}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-stone-400 text-xs uppercase font-mono tracking-wider">{t('species.activity')}</span>
              <span className="font-bold text-stone-200 capitalize text-xs">
                {species.behavior?.activityPattern || t('species.unspecified')}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-stone-400 text-xs uppercase font-mono tracking-wider">{t('species.wildLifespan')}</span>
              <span className="font-bold text-stone-100 font-mono">
                {species.lifeCycle?.lifespanYears?.wild ? `${species.lifeCycle.lifespanYears.wild[0]} – ${species.lifeCycle.lifespanYears.wild[1]} ${t('lifecycle.years')}` : t('species.unspecified')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Field Bioacoustics Sonogram Player */}
      <div className="mt-8">
        <BioacousticsPlayer
          speciesId={species.id}
          speciesNameVi={species.names.vi[0] || commonName}
          speciesNameEn={species.names.en[0] || commonName}
          scientificName={species.names.scientific}
          order={species.taxonomy.order}
          family={species.taxonomy.family}
        />
      </div>

      {/* Field Journal Index Tabs Bar */}
      <div className="mt-14 border-b-2 border-natgeo-yellow/20 flex gap-1 overflow-x-auto pb-px bg-expedition-canvas/50 rounded-t-2xl px-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              if (tab.key === 'anatomy') {
                setIsAnatomyMode(true);
              }
            }}
            className={`field-journal-tab flex items-center gap-2 ${
              activeTab === tab.key ? 'field-journal-tab-active' : ''
            }`}
          >
            <span className="text-[10px] opacity-60 font-mono font-bold">{tab.num} //</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="py-8 text-stone-300 leading-relaxed">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="p-6 sm:p-8 rounded-3xl field-panel border border-natgeo-yellow/25 shadow-xl space-y-3 field-ruler-bottom">
              <h3 className="font-serif text-2xl font-bold text-white">{t('species.overviewDescTitle')}</h3>
              <p className="text-stone-200 text-base leading-relaxed">
                {(isEn ? (species.morphology?.description?.en || species.morphology?.description?.vi) : (species.morphology?.description?.vi || species.morphology?.description?.en)) || (
                  <EmptyTraitBadge label={t('species.overview')} sourceUrl={species.distribution?.gbifOccurrenceMapUrl} />
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-6 rounded-3xl field-panel border border-natgeo-yellow/20 shadow-lg space-y-2">
                <div className="font-display font-bold text-natgeo-yellow text-lg uppercase flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-natgeo-yellow" />
                  {t('species.habitatTitle')}
                </div>
                <p className="text-xs text-stone-300 leading-relaxed font-sans">
                  {(isEn ? (species.habitat?.description?.en || species.habitat?.description?.vi) : (species.habitat?.description?.vi || species.habitat?.description?.en)) || (isEn ? 'Diverse ecological biomes and terrestrial niches.' : 'Môi trường sống tự nhiên đa dạng theo khu hệ sinh thái.')}
                </p>
                {species.habitat?.biomes && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {species.habitat.biomes.map((b) => (
                      <span key={b} className="px-2.5 py-1 rounded-lg bg-natgeo-yellow/10 border border-natgeo-yellow/30 text-[11px] text-natgeo-yellow font-mono">
                        {b}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-6 rounded-3xl field-panel border border-natgeo-yellow/20 shadow-lg space-y-2">
                <div className="font-display font-bold text-natgeo-yellow text-lg uppercase flex items-center gap-2">
                  <Compass className="w-4 h-4 text-natgeo-yellow" />
                  {t('species.distributionTitle')}
                </div>
                <p className="text-xs text-stone-300 leading-relaxed font-sans">
                  {(isEn ? (species.distribution?.text?.en || species.distribution?.text?.vi) : (species.distribution?.text?.vi || species.distribution?.text?.en)) || (isEn ? 'Recorded native distribution according to GBIF occurrences.' : 'Ghi nhận phân bố tự nhiên theo GBIF Occurrence records.')}
                </p>
                {species.distribution?.gbifOccurrenceMapUrl && (
                  <div className="pt-2">
                    <a
                      href={species.distribution.gbifOccurrenceMapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-natgeo-yellow hover:underline"
                    >
                      <span>{t('species.viewGbifMap')}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            </div>

            <SizeComparison
              lengthCm={species.morphology?.lengthCm ?? null}
              weightKg={species.morphology?.weightKg ?? null}
              speciesName={commonName}
            />

            {/* Geographical Distribution Map Component */}
            <DistributionMap
              distribution={species.distribution}
              biomes={species.habitat?.biomes}
              speciesName={commonName}
              scientificName={species.names.scientific}
            />

            {/* Subspecies & Evolutionary Lineages */}
            <SubspeciesSection
              speciesId={species.id}
              speciesName={commonName}
            />
          </div>
        )}

        {activeTab === 'anatomy' && (
          <AnatomyPanel
            speciesId={species.id}
            speciesNameVi={species.names.vi[0] || commonName}
            speciesNameEn={species.names.en[0] || commonName}
            scientificName={species.names.scientific}
          />
        )}

        {activeTab === 'morphology' && (
          <div className="space-y-8">
            <SizeComparison
              lengthCm={species.morphology?.lengthCm ?? null}
              weightKg={species.morphology?.weightKg ?? null}
              speciesName={commonName}
            />

            <div className="p-6 sm:p-8 rounded-3xl field-panel border border-natgeo-yellow/25 shadow-xl space-y-4">
              <h3 className="font-serif text-2xl font-bold text-white">{t('species.morphologyTitle')}</h3>
              <p className="text-stone-200 text-sm leading-relaxed">
                {isEn ? (species.morphology?.description?.en || species.morphology?.description?.vi) : (species.morphology?.description?.vi || species.morphology?.description?.en)}
              </p>

              {species.morphology?.sexualDimorphism && (
                <div className="mt-4 p-5 rounded-2xl bg-black/50 border border-natgeo-yellow/30 text-xs">
                  <div className="font-mono font-bold text-natgeo-yellow text-sm mb-1 flex items-center gap-1.5 uppercase">
                    <Sparkles className="w-4 h-4 text-natgeo-yellow" />
                    <span>{t('species.sexualDimorphism')}</span>
                  </div>
                  <p className="text-stone-300 leading-relaxed font-sans">{species.morphology.sexualDimorphism}</p>
                </div>
              )}
            </div>

            <SubspeciesSection
              speciesId={species.id}
              speciesName={commonName}
            />
          </div>
        )}

        {activeTab === 'habitat' && (
          <div className="space-y-8">
            <div className="p-6 sm:p-8 rounded-3xl field-panel border border-natgeo-yellow/25 shadow-xl space-y-6">
              <h3 className="font-serif text-2xl font-bold text-white">{t('species.habitatSectionTitle')}</h3>
              <div className="space-y-2">
                <div className="font-mono font-bold text-natgeo-yellow text-sm uppercase">{t('species.characteristicBiome')}</div>
                <p className="text-sm text-stone-200 leading-relaxed">{isEn ? (species.habitat?.description?.en || species.habitat?.description?.vi) : (species.habitat?.description?.vi || species.habitat?.description?.en)}</p>
              </div>
              <div className="space-y-2">
                <div className="font-mono font-bold text-natgeo-yellow text-sm uppercase">{t('species.geoRecords')}</div>
                <p className="text-sm text-stone-200 leading-relaxed">{isEn ? (species.distribution?.text?.en || species.distribution?.text?.vi) : (species.distribution?.text?.vi || species.distribution?.text?.en)}</p>
              </div>
            </div>

            <DistributionMap
              distribution={species.distribution}
              biomes={species.habitat?.biomes}
              speciesName={commonName}
              scientificName={species.names.scientific}
            />
          </div>
        )}

        {activeTab === 'diet' && (
          <div className="space-y-8">
            <DietCard diet={species.diet} speciesName={commonName} />

            {/* Food Web & Trophic Level Link Card */}
            <div className="field-journal-card p-6 bg-stone-900/90 border-natgeo-yellow/20 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-black border-2 border-natgeo-yellow/40 flex items-center justify-center text-natgeo-yellow text-2xl shrink-0">
                  <Network className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold font-serif text-white">
                    {isEn ? 'Food Web Position & Trophic Cascades' : 'Vị Trí Trong Mạng Lưới Thức Ăn & Thác Sinh Thái'}
                  </h4>
                  <p className="text-xs text-stone-300 font-serif mt-0.5">
                    {isEn
                      ? 'Simulate food web interactions, predation balance, and trophic cascading effects in the ecosystem.'
                      : 'Mô phỏng mối quan hệ săn mồi, cân bằng tháp dinh dưỡng và hiệu ứng thác sinh thái trong tự nhiên.'}
                  </p>
                </div>
              </div>

              <Link to="/ecosystem" className="btn-expedition-primary whitespace-nowrap text-xs font-mono">
                <span>{isEn ? 'Open Ecosystem Simulator' : 'Mở Phòng Thí Nghiệm Sinh Thái'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {activeTab === 'behavior' && (
          <div className="p-6 sm:p-8 rounded-3xl field-panel border border-natgeo-yellow/25 shadow-xl space-y-6">
            <h3 className="font-serif text-2xl font-bold text-white">{t('species.behaviorTitle')}</h3>
            <p className="text-sm text-stone-200 leading-relaxed">{isEn ? (species.behavior?.text?.en || species.behavior?.text?.vi) : (species.behavior?.text?.vi || species.behavior?.text?.en)}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-5 rounded-2xl bg-black/50 border border-white/5 space-y-1.5">
                <span className="font-mono font-bold text-natgeo-yellow text-sm block uppercase">{t('species.communication')}</span>
                <p className="text-xs text-stone-300 leading-relaxed font-sans">
                  {(isEn ? species.behavior?.communication?.en : species.behavior?.communication?.vi) || (isEn ? 'Acoustic vocalizations, visual posturing, and chemical scent marking.' : 'Giao tiếp qua âm thanh đặc trưng, thị giác và pheromone.')}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-black/50 border border-white/5 space-y-1.5">
                <span className="font-mono font-bold text-natgeo-yellow text-sm block uppercase">{t('species.defense')}</span>
                <p className="text-xs text-stone-300 leading-relaxed font-sans">
                  {(isEn ? species.behavior?.defense?.en : species.behavior?.defense?.vi) || (isEn ? 'High vigilance against predators, natural camouflage, or active counter-attacks.' : 'Cảnh giác cao độ trước kẻ thù, ngụy trang hoặc chủ động phản đòn phòng vệ.')}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'lifeCycle' && (
          <LifeCycleTimeline lifeCycle={species.lifeCycle} speciesName={commonName} />
        )}

        {activeTab === 'reproduction' && (
          <div className="p-6 sm:p-8 rounded-3xl field-panel border border-natgeo-yellow/25 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <h3 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-rose-400" />
                {t('species.reproductionTitle')}
              </h3>
              <span className="field-stamp field-stamp-warning">
                {t('species.reproductionMode')}: {species.reproduction?.mode || (isEn ? 'Sexual reproduction' : 'Sinh sản hữu tính')}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl field-panel border border-white/10">
                <span className="text-[10px] font-mono text-stone-400 uppercase block">{t('species.gestationPeriod')}</span>
                <span className="text-base font-mono font-bold text-white mt-1 block">
                  {species.reproduction?.gestationDays ? `${species.reproduction.gestationDays[0]} – ${species.reproduction.gestationDays[1]} ${t('lifecycle.days')}` : t('species.unspecified')}
                </span>
              </div>

              <div className="p-4 rounded-2xl field-panel border border-white/10">
                <span className="text-[10px] font-mono text-stone-400 uppercase block">{t('species.clutchSize')}</span>
                <span className="text-base font-mono font-bold text-white mt-1 block">
                  {species.reproduction?.clutchOrLitterSize ? `${species.reproduction.clutchOrLitterSize[0]} – ${species.reproduction.clutchOrLitterSize[1]}` : t('species.unspecified')}
                </span>
              </div>

              <div className="p-4 rounded-2xl field-panel border border-white/10">
                <span className="text-[10px] font-mono text-stone-400 uppercase block">{t('species.matingSystem')}</span>
                <span className="text-base font-mono font-bold text-natgeo-yellow mt-1 block capitalize">
                  {species.reproduction?.matingSystem || (isEn ? 'Monogamous or polygynous' : 'Đơn phối hoặc đa phối')}
                </span>
              </div>
            </div>

            {(species.reproduction?.parentalCare?.vi || species.reproduction?.parentalCare?.en) && (
              <div className="p-5 rounded-2xl bg-black/50 border border-white/5 space-y-1">
                <span className="text-xs font-mono font-bold text-natgeo-yellow uppercase tracking-wider block">
                  {t('species.parentalCare')}
                </span>
                <p className="text-sm text-stone-200 leading-relaxed font-sans">
                  {isEn
                    ? (species.reproduction.parentalCare.en || species.reproduction.parentalCare.vi)
                    : (species.reproduction.parentalCare.vi || species.reproduction.parentalCare.en)}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'conservation' && (
          <div className="p-6 sm:p-8 rounded-3xl field-panel border border-natgeo-yellow/25 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <h3 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                {t('species.conservationTitle')}
              </h3>
              <span className="field-stamp field-stamp-danger">
                IUCN: {species.conservation?.iucn || (isEn ? 'Not Evaluated' : 'Chưa đánh giá')}
              </span>
            </div>

            {species.conservation?.threats && species.conservation.threats.length > 0 ? (
              <div className="space-y-3">
                <div className="font-mono font-bold text-stone-200 text-sm uppercase">{t('species.threatsTitle')}</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {species.conservation.threats.map((threat, i) => (
                    <div key={i} className="p-4 rounded-2xl field-panel border border-white/10 text-xs text-stone-300 flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0" />
                      <span>{threat}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-stone-300">
                {isEn
                  ? 'This species is monitored in biodiversity assessments under the IUCN Red List of Threatened Species.'
                  : 'Loài hiện đang nằm trong danh mục theo dõi và bảo tồn đa dạng sinh học theo Sách Đỏ IUCN.'}
              </p>
            )}
          </div>
        )}

        {activeTab === 'funFacts' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {species.funFacts && species.funFacts.length > 0 ? (
              species.funFacts.map((fact, index) => (
                <div key={index} className="p-6 rounded-3xl field-panel border border-natgeo-yellow/25 shadow-lg relative overflow-hidden group hover:border-natgeo-yellow transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-natgeo-yellow/15 text-natgeo-yellow border border-natgeo-yellow/30">
                      {t('species.funFactPrefix')} #{index + 1}
                    </span>
                    <Sparkles className="w-4 h-4 text-natgeo-yellow group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="text-sm text-stone-200 leading-relaxed font-sans">
                    {isEn ? fact.en : fact.vi}
                  </p>
                  <p className="text-xs text-stone-400 italic mt-2 font-serif">
                    "{isEn ? fact.vi : fact.en}"
                  </p>
                </div>
              ))
            ) : (
              <EmptyTraitBadge label={t('species.funFacts')} sourceUrl={species.distribution?.gbifOccurrenceMapUrl} />
            )}
          </div>
        )}

        {activeTab === 'provenance' && (
          <div className="p-6 sm:p-8 rounded-3xl field-panel border border-natgeo-yellow/25 shadow-xl space-y-4">
            <h3 className="font-serif text-2xl font-bold text-white">{t('species.provenanceTitle')}</h3>
            <p className="text-xs text-stone-400">
              {t('species.provenanceDesc')}
            </p>
            <div className="overflow-x-auto pt-2">
              <table className="w-full text-xs text-left border border-white/10 rounded-2xl overflow-hidden">
                <thead className="bg-black/80 text-stone-300 uppercase font-mono text-[11px]">
                  <tr>
                    <th className="p-3.5">{t('species.fieldCol')}</th>
                    <th className="p-3.5">{t('species.sourceCol')}</th>
                    <th className="p-3.5">{t('species.licenseCol')}</th>
                    <th className="p-3.5">{t('species.methodCol')}</th>
                    <th className="p-3.5">{t('species.updatedCol')}</th>
                    <th className="p-3.5">{t('species.linkCol')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-sans">
                  {species.provenance.map((prov, i) => (
                    <tr key={i} className="hover:bg-white/[0.03] transition-colors">
                      <td className="p-3.5 font-mono text-natgeo-yellow font-semibold">{prov.field}</td>
                      <td className="p-3.5 text-stone-200">{prov.source}</td>
                      <td className="p-3.5 font-mono font-semibold text-stone-300">{prov.license}</td>
                      <td className="p-3.5 text-stone-400">{prov.method}</td>
                      <td className="p-3.5 font-mono text-stone-400">{prov.retrievedAt}</td>
                      <td className="p-3.5">
                        {prov.url ? (
                          <a href={prov.url} target="_blank" rel="noopener noreferrer" className="text-natgeo-yellow hover:underline inline-flex items-center gap-1 font-mono">
                            Link <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Species Comparison Modal */}
      {showCompareModal && (
        <SpeciesCompareModal
          currentSpecies={species}
          onClose={() => setShowCompareModal(false)}
        />
      )}
    </div>
  );
};
