import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import tigerData from '../../../data/species/panthera-tigris.json';
import { Species } from '../../types/species';
import { Copy, Check, Layers, ExternalLink, ShieldCheck, ArrowRightLeft, Sparkles, HeartHandshake, AlertTriangle } from 'lucide-react';
import { AnimalViewer } from '../viewer/AnimalViewer';
import { loadSpeciesBySlug } from '../../lib/data-loader';
import { SpeciesCompareModal } from './SpeciesCompareModal';
import { SizeComparison } from './SizeComparison';
import { LifeCycleTimeline } from './LifeCycleTimeline';
import { DietCard } from './DietCard';
import { EmptyTraitBadge } from '../../components/EmptyTraitBadge';

type TabKey =
  | 'overview'
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
              setSelectedModelGlb('models/flamingo.glb');
            } else if (data.taxonomy.class === 'Chondrichthyes') {
              setSelectedModelGlb('models/shark.glb');
            } else if (data.taxonomy.order === 'Cetacea') {
              setSelectedModelGlb('models/dolphin.glb');
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Specimen Breadcrumb & Ref Code */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs mb-8 pb-4 border-b border-white/[0.08]">
        <nav className="flex items-center gap-2 text-stone-400 flex-wrap font-mono">
          <Link to="/" className="hover:text-emerald-400 transition-colors">TRANG CHỦ</Link>
          <span className="text-stone-600">/</span>
          <Link to="/taxa" className="hover:text-emerald-400 transition-colors uppercase">{species.taxonomy.phylum}</Link>
          <span className="text-stone-600">/</span>
          <span className="text-stone-300 uppercase">{species.taxonomy.class}</span>
          <span className="text-stone-600">/</span>
          <span className="text-stone-300 uppercase">{species.taxonomy.order}</span>
          <span className="text-stone-600">/</span>
          <span className="text-emerald-400 font-bold uppercase">{species.names.scientific}</span>
        </nav>

        <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-stone-400">
          CATALOG REF: <span className="text-emerald-400 font-bold">GBIF-{species.taxonKey?.gbif || '5219416'}</span>
        </div>
      </div>

      {/* Specimen Title Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-8 border-b border-white/[0.08]">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-white">
              {commonName}
            </h1>
            <span className="text-xl text-stone-400 font-serif italic">({secondaryName})</span>

            {species.conservation?.iucn && (
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm">
                IUCN: {species.conservation.iucn} • NGUY CẤP
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5 mt-2">
            <span className="font-serif italic text-stone-300 text-lg">{species.names.scientific}</span>
            <span className="text-stone-400 text-xs font-mono">{species.names.authorship}</span>
            <button
              onClick={handleCopyScientific}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Sao chép tên khoa học"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Specimen 3D Model Variants Switcher */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 p-1.5 bio-glass-panel rounded-2xl border border-white/10 shadow-xl">
            <button
              onClick={() => setSelectedModelGlb('models/panthera-tigris.glb')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedModelGlb === 'models/panthera-tigris.glb'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-stone-950 font-bold shadow-lg shadow-emerald-500/20'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              🐅 Hổ Bengal (3D Thực)
            </button>
            <button
              onClick={() => setSelectedModelGlb('models/canis-lupus.glb')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                selectedModelGlb === 'models/canis-lupus.glb'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-stone-950 font-bold shadow-lg shadow-emerald-500/20'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              🐺 Sói xám (Hoạt họa)
            </button>
            <button
              onClick={() => setSelectedModelGlb('models/equus-caballus.glb')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                selectedModelGlb === 'models/equus-caballus.glb'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-stone-950 font-bold shadow-lg shadow-emerald-500/20'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              🐎 Ngựa hoang
            </button>
          </div>

          <button
            onClick={() => setShowCompareModal(true)}
            className="btn-specimen flex items-center gap-2 text-xs py-2 px-3.5"
            title="So sánh với loài khác"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-amber-300" />
            <span>So sánh loài</span>
          </button>

          <span className="px-3.5 py-2 rounded-2xl bio-glass text-emerald-300 text-xs font-mono font-semibold flex items-center gap-1.5 border border-emerald-500/30">
            <Layers className="w-4 h-4 text-emerald-400" />
            TIER A SPECIMEN
          </span>
        </div>
      </div>

      {/* Main 3D Canvas Viewer */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <AnimalViewer
            modelGlb={selectedModelGlb}
            images={species.media.images}
            speciesName={commonName}
            isRepresentative={species.media.model3d?.isRepresentative}
            representativeFor={species.media.model3d?.representativeFor}
          />
        </div>

        {/* Quick Biological Facts Column */}
        <div className="lg:col-span-4 p-6 rounded-3xl bio-glass-panel border border-white/10 shadow-xl flex flex-col gap-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Thông số sinh học
            </h3>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 text-stone-400">
              Traited
            </span>
          </div>

          <div className="space-y-3.5 text-sm">
            <div className="flex justify-between items-center py-1.5 border-b border-white/5">
              <span className="text-stone-400 text-xs uppercase font-mono tracking-wider">Chiều dài</span>
              <span className="font-semibold text-stone-100 font-mono">
                {species.morphology?.lengthCm ? `${species.morphology.lengthCm[0]} – ${species.morphology.lengthCm[1]} cm` : 'Chưa có dữ liệu'}
              </span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-white/5">
              <span className="text-stone-400 text-xs uppercase font-mono tracking-wider">Khối lượng</span>
              <span className="font-semibold text-stone-100 font-mono">
                {species.morphology?.weightKg ? `${species.morphology.weightKg[0]} – ${species.morphology.weightKg[1]} kg` : 'Chưa có dữ liệu'}
              </span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-white/5">
              <span className="text-stone-400 text-xs uppercase font-mono tracking-wider">Chế độ ăn</span>
              <span className="font-semibold text-emerald-400 capitalize px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-xs">
                {species.diet?.type || 'Chưa rõ'}
              </span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-white/5">
              <span className="text-stone-400 text-xs uppercase font-mono tracking-wider">Tập tính</span>
              <span className="font-semibold text-stone-200 capitalize text-xs">
                {species.behavior?.activityPattern || 'Chưa rõ'}
              </span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-white/5">
              <span className="text-stone-400 text-xs uppercase font-mono tracking-wider">Tuổi thọ tự nhiên</span>
              <span className="font-semibold text-stone-100 font-mono">
                {species.lifeCycle?.lifespanYears?.wild ? `${species.lifeCycle.lifespanYears.wild[0]} – ${species.lifeCycle.lifespanYears.wild[1]} năm` : 'Chưa rõ'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mt-14 border-b border-white/10 flex gap-2 overflow-x-auto pb-px">
        {[
          { key: 'overview', label: t('species.overview') },
          { key: 'morphology', label: t('species.morphology') },
          { key: 'habitat', label: t('species.habitat') },
          { key: 'diet', label: t('species.diet') },
          { key: 'behavior', label: t('species.behavior') },
          { key: 'lifeCycle', label: t('species.lifeCycle') },
          { key: 'reproduction', label: t('species.reproduction') },
          { key: 'conservation', label: t('species.conservation') },
          { key: 'funFacts', label: t('species.funFacts') },
          { key: 'provenance', label: t('species.provenance') },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as TabKey)}
            className={`px-5 py-3 text-sm font-serif font-bold transition-all border-b-2 whitespace-nowrap ${
              activeTab === tab.key
                ? 'border-emerald-400 text-emerald-300 text-base scale-[1.02]'
                : 'border-transparent text-stone-400 hover:text-stone-200 hover:border-white/20'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="py-8 text-stone-300 leading-relaxed">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="p-6 sm:p-8 rounded-3xl bio-glass-panel border border-white/10 shadow-xl space-y-3">
              <h3 className="font-serif text-2xl font-bold text-white">Mô tả Tổng quan Loài</h3>
              <p className="text-stone-200 text-base leading-relaxed">
                {species.morphology?.description?.vi || species.morphology?.description?.en || (
                  <EmptyTraitBadge label="Mô tả sinh học" sourceUrl={species.distribution?.gbifOccurrenceMapUrl} />
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-6 rounded-3xl bio-glass-panel border border-white/10 shadow-lg space-y-2">
                <div className="font-serif font-bold text-emerald-300 text-lg">Môi trường sống tự nhiên</div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {species.habitat?.description?.vi || species.habitat?.description?.en || 'Môi trường sống tự nhiên đa dạng theo khu hệ sinh thái.'}
                </p>
                {species.habitat?.biomes && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {species.habitat.biomes.map((b) => (
                      <span key={b} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 font-mono">
                        {b}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-6 rounded-3xl bio-glass-panel border border-white/10 shadow-lg space-y-2">
                <div className="font-serif font-bold text-emerald-300 text-lg">Vùng phân bố địa lý</div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {species.distribution?.text?.vi || species.distribution?.text?.en || 'Ghi nhận phân bố tự nhiên theo GBIF Occurrence records.'}
                </p>
                {species.distribution?.gbifOccurrenceMapUrl && (
                  <div className="pt-2">
                    <a
                      href={species.distribution.gbifOccurrenceMapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 hover:text-emerald-300 underline"
                    >
                      <span>Xem bản đồ phân bố GBIF</span>
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
          </div>
        )}

        {activeTab === 'morphology' && (
          <div className="space-y-8">
            <SizeComparison
              lengthCm={species.morphology?.lengthCm ?? null}
              weightKg={species.morphology?.weightKg ?? null}
              speciesName={commonName}
            />

            <div className="p-6 sm:p-8 rounded-3xl bio-glass-panel border border-white/10 shadow-xl space-y-4">
              <h3 className="font-serif text-2xl font-bold text-white">Đặc điểm Hình thái học & Giải phẫu ngoài</h3>
              <p className="text-stone-200 text-sm leading-relaxed">
                {species.morphology?.description?.vi || species.morphology?.description?.en}
              </p>

              {species.morphology?.sexualDimorphism && (
                <div className="mt-4 p-5 rounded-2xl bg-stone-900/70 border border-emerald-500/20 text-xs">
                  <div className="font-serif font-bold text-emerald-400 text-sm mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>Dị hình giới tính (Sexual Dimorphism):</span>
                  </div>
                  <p className="text-stone-300 leading-relaxed">{species.morphology.sexualDimorphism}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'habitat' && (
          <div className="p-6 sm:p-8 rounded-3xl bio-glass-panel border border-white/10 shadow-xl space-y-6">
            <h3 className="font-serif text-2xl font-bold text-white">Môi trường sống & Vùng phân bố</h3>
            <div className="space-y-2">
              <div className="font-semibold text-emerald-300 text-sm">Sinh cảnh đặc trưng:</div>
              <p className="text-sm text-stone-200 leading-relaxed">{species.habitat?.description?.vi || species.habitat?.description?.en}</p>
            </div>
            <div className="space-y-2">
              <div className="font-semibold text-emerald-300 text-sm">Ghi nhận địa lý:</div>
              <p className="text-sm text-stone-200 leading-relaxed">{species.distribution?.text?.vi || species.distribution?.text?.en}</p>
            </div>
          </div>
        )}

        {activeTab === 'diet' && (
          <DietCard diet={species.diet} speciesName={commonName} />
        )}

        {activeTab === 'behavior' && (
          <div className="p-6 sm:p-8 rounded-3xl bio-glass-panel border border-white/10 shadow-xl space-y-6">
            <h3 className="font-serif text-2xl font-bold text-white">Tập tính Sinh thái học</h3>
            <p className="text-sm text-stone-200 leading-relaxed">{species.behavior?.text?.vi || species.behavior?.text?.en}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-5 rounded-2xl bg-stone-900/60 border border-white/5 space-y-1.5">
                <span className="font-serif font-bold text-emerald-300 text-sm block">Giao tiếp & Định danh</span>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {species.behavior?.communication?.vi || 'Giao tiếp qua âm thanh đặc trưng, thị giác và pheromone.'}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-stone-900/60 border border-white/5 space-y-1.5">
                <span className="font-serif font-bold text-emerald-300 text-sm block">Tập tính Phòng thủ & Lãnh thổ</span>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {species.behavior?.defense?.vi || 'Cảnh giác cao độ trước kẻ thù, ngụy trang hoặc chủ động phản đòn phòng vệ.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'lifeCycle' && (
          <LifeCycleTimeline lifeCycle={species.lifeCycle} speciesName={commonName} />
        )}

        {activeTab === 'reproduction' && (
          <div className="p-6 sm:p-8 rounded-3xl bio-glass-panel border border-white/10 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <h3 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-rose-400" />
                Sinh sản & Tập tính Nuôi con
              </h3>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
                Hình thức: {species.reproduction?.mode || 'Sinh sản hữu tính'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bio-glass border border-white/10">
                <span className="text-[10px] font-mono text-stone-400 uppercase block">Thời gian mang thai / ấp trứng</span>
                <span className="text-base font-serif font-bold text-white mt-1 block">
                  {species.reproduction?.gestationDays ? `${species.reproduction.gestationDays[0]} – ${species.reproduction.gestationDays[1]} ngày` : 'Chưa rõ'}
                </span>
              </div>

              <div className="p-4 rounded-2xl bio-glass border border-white/10">
                <span className="text-[10px] font-mono text-stone-400 uppercase block">Số lượng con / lứa (hoặc trứng)</span>
                <span className="text-base font-serif font-bold text-white mt-1 block">
                  {species.reproduction?.clutchOrLitterSize ? `${species.reproduction.clutchOrLitterSize[0]} – ${species.reproduction.clutchOrLitterSize[1]}` : 'Chưa rõ'}
                </span>
              </div>

              <div className="p-4 rounded-2xl bio-glass border border-white/10">
                <span className="text-[10px] font-mono text-stone-400 uppercase block">Chế độ giao phối</span>
                <span className="text-base font-serif font-bold text-emerald-300 mt-1 block capitalize">
                  {species.reproduction?.matingSystem || 'Đơn phối hoặc đa phối'}
                </span>
              </div>
            </div>

            {species.reproduction?.parentalCare?.vi && (
              <div className="p-5 rounded-2xl bg-stone-900/60 border border-white/5 space-y-1">
                <span className="text-xs font-serif font-bold text-emerald-400 uppercase tracking-wider block">
                  Chăm sóc con non:
                </span>
                <p className="text-sm text-stone-200 leading-relaxed">
                  {species.reproduction.parentalCare.vi}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'conservation' && (
          <div className="p-6 sm:p-8 rounded-3xl bio-glass-panel border border-white/10 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <h3 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                Tình trạng Bảo tồn & Các mối Đe dọa
              </h3>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                IUCN: {species.conservation?.iucn || 'Chưa đánh giá'}
              </span>
            </div>

            {species.conservation?.threats && species.conservation.threats.length > 0 ? (
              <div className="space-y-3">
                <div className="font-semibold text-stone-200 text-sm">Các mối đe dọa sinh học chính:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {species.conservation.threats.map((threat, i) => (
                    <div key={i} className="p-4 rounded-2xl bio-glass border border-white/10 text-xs text-stone-300 flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0" />
                      <span>{threat}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-stone-300">
                Loài hiện đang nằm trong danh mục theo dõi và bảo tồn đa dạng sinh học theo Sách Đỏ IUCN.
              </p>
            )}
          </div>
        )}

        {activeTab === 'funFacts' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {species.funFacts && species.funFacts.length > 0 ? (
              species.funFacts.map((fact, index) => (
                <div key={index} className="p-6 rounded-3xl bio-glass-panel border border-white/10 shadow-lg relative overflow-hidden group hover:border-emerald-500/40 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      SỰ THẬT #{index + 1}
                    </span>
                    <Sparkles className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="text-sm text-stone-200 leading-relaxed font-sans">{fact.vi}</p>
                  <p className="text-xs text-stone-400 italic mt-2 font-serif">"{fact.en}"</p>
                </div>
              ))
            ) : (
              <EmptyTraitBadge label="Sự thật thú vị" sourceUrl={species.distribution?.gbifOccurrenceMapUrl} />
            )}
          </div>
        )}

        {activeTab === 'provenance' && (
          <div className="p-6 sm:p-8 rounded-3xl bio-glass-panel border border-white/10 shadow-xl space-y-4">
            <h3 className="font-serif text-2xl font-bold text-white">Xuất xứ Dữ liệu & Bản quyền (Provenance)</h3>
            <p className="text-xs text-stone-400">
              Minh bạch 100% về nguồn gốc, bản quyền và phương pháp thu thập cho từng thông số của mẫu vật này.
            </p>
            <div className="overflow-x-auto pt-2">
              <table className="w-full text-xs text-left border border-white/10 rounded-2xl overflow-hidden">
                <thead className="bg-stone-900/90 text-stone-300 uppercase font-mono text-[11px]">
                  <tr>
                    <th className="p-3.5">Trường dữ liệu</th>
                    <th className="p-3.5">Cơ sở dữ liệu</th>
                    <th className="p-3.5">Giấy phép</th>
                    <th className="p-3.5">Phương pháp</th>
                    <th className="p-3.5">Ngày cập nhật</th>
                    <th className="p-3.5">Liên kết</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-sans">
                  {species.provenance.map((prov, i) => (
                    <tr key={i} className="hover:bg-white/[0.03] transition-colors">
                      <td className="p-3.5 font-mono text-emerald-400 font-semibold">{prov.field}</td>
                      <td className="p-3.5 text-stone-200">{prov.source}</td>
                      <td className="p-3.5 font-mono font-semibold text-stone-300">{prov.license}</td>
                      <td className="p-3.5 text-stone-400">{prov.method}</td>
                      <td className="p-3.5 font-mono text-stone-400">{prov.retrievedAt}</td>
                      <td className="p-3.5">
                        {prov.url ? (
                          <a href={prov.url} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1">
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
