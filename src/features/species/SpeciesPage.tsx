import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import tigerData from '../../../data/species/panthera-tigris.json';
import { Species } from '../../types/species';
import { Copy, Check, Layers, ExternalLink, ShieldCheck, ArrowRightLeft } from 'lucide-react';
import { AnimalViewer } from '../viewer/AnimalViewer';
import { loadSpeciesBySlug } from '../../lib/data-loader';
import { SpeciesCompareModal } from './SpeciesCompareModal';

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
            setSelectedModelGlb('models/panthera-tigris.glb');
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
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Mô tả tổng quát</h3>
            <p>{species.morphology?.description?.vi}</p>
            <div className="p-4 rounded-xl bg-stone-800/40 border border-stone-800 text-sm">
              <div className="font-semibold text-stone-200 mb-1">Môi trường sống tự nhiên:</div>
              <p>{species.habitat?.description?.vi}</p>
            </div>
          </div>
        )}

        {activeTab === 'morphology' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Hình thái & Kích thước</h3>
            <p>{species.morphology?.description?.vi}</p>
            <p><strong className="text-stone-200">Dị hình giới tính:</strong> {species.morphology?.sexualDimorphism}</p>
          </div>
        )}

        {activeTab === 'habitat' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Môi trường sống & Vùng phân bố</h3>
            <p>{species.habitat?.description?.vi}</p>
            <p>{species.distribution?.text?.vi}</p>
          </div>
        )}

        {activeTab === 'diet' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Dinh dưỡng & Săn mồi</h3>
            <p>{species.diet?.feedingBehavior?.vi}</p>
            <div>
              <div className="font-semibold text-stone-200 mb-2">Thức ăn chủ yếu:</div>
              <div className="flex flex-wrap gap-2">
                {species.diet?.preyOrFood?.map((item) => (
                  <span key={item} className="px-3 py-1 rounded-lg bg-stone-800 border border-stone-700 text-xs">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'behavior' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Tập tính sinh thái</h3>
            <p>{species.behavior?.text?.vi}</p>
            <p><strong className="text-stone-200">Giao tiếp:</strong> {species.behavior?.communication?.vi}</p>
            <p><strong className="text-stone-200">Tập tính phòng thủ:</strong> {species.behavior?.defense?.vi}</p>
          </div>
        )}

        {activeTab === 'lifeCycle' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white">Chu kỳ phát triển cá thể</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {species.lifeCycle?.stages?.map((stage, idx) => (
                <div key={stage.key} className="p-4 rounded-xl bg-stone-800/40 border border-stone-800">
                  <div className="text-xs font-bold text-emerald-400 mb-1">Giai đoạn {idx + 1}</div>
                  <div className="font-bold text-white mb-2">{stage.name.vi}</div>
                  <p className="text-xs text-stone-400">{stage.description?.vi}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reproduction' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Sinh sản & Nuôi con</h3>
            <p>{species.reproduction?.text?.vi}</p>
            <p><strong className="text-stone-200">Chăm sóc con non:</strong> {species.reproduction?.parentalCare?.vi}</p>
          </div>
        )}

        {activeTab === 'conservation' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Tình trạng bảo tồn & Các mối đe dọa</h3>
            <p><strong className="text-stone-200">Đánh giá IUCN:</strong> {species.conservation?.iucn}</p>
            <div>
              <div className="font-semibold text-stone-200 mb-2">Mối đe dọa chính:</div>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {species.conservation?.threats?.map((threat) => (
                  <li key={threat}>{threat}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'funFacts' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {species.funFacts?.map((fact, index) => (
              <div key={index} className="p-5 rounded-2xl bg-stone-800/40 border border-stone-800">
                <div className="text-emerald-400 text-lg mb-2 font-bold"># {index + 1}</div>
                <p className="text-sm">{fact.vi}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'provenance' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Nguồn dữ liệu & Giấy phép (Provenance)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-stone-800 rounded-xl">
                <thead className="bg-stone-800 text-stone-300 uppercase">
                  <tr>
                    <th className="p-3">Trường dữ liệu</th>
                    <th className="p-3">Nguồn</th>
                    <th className="p-3">Giấy phép</th>
                    <th className="p-3">Phương pháp</th>
                    <th className="p-3">Ngày lấy</th>
                    <th className="p-3">Liên kết</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800">
                  {species.provenance.map((prov, i) => (
                    <tr key={i} className="hover:bg-stone-800/30">
                      <td className="p-3 font-mono text-emerald-400">{prov.field}</td>
                      <td className="p-3">{prov.source}</td>
                      <td className="p-3 font-semibold">{prov.license}</td>
                      <td className="p-3">{prov.method}</td>
                      <td className="p-3 text-stone-400">{prov.retrievedAt}</td>
                      <td className="p-3">
                        {prov.url ? (
                          <a href={prov.url} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline inline-flex items-center gap-1">
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
