import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import tigerData from '../../../data/species/panthera-tigris.json';
import { Species } from '../../types/species';
import { Copy, Check, Layers, ExternalLink, ShieldCheck } from 'lucide-react';

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
  const { slug: _slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [copied, setCopied] = useState(false);

  // In M0/M1, we have tigerData seeded
  const species: Species = (tigerData as unknown) as Species;

  const handleCopyScientific = () => {
    navigator.clipboard.writeText(species.names.scientific);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isEn = i18n.language === 'en';
  const commonName = isEn ? species.names.en[0] : species.names.vi[0];
  const secondaryName = isEn ? species.names.vi[0] : species.names.en[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-stone-400 mb-6 flex-wrap">
        <Link to="/" className="hover:text-emerald-400">Trang chủ</Link>
        <span>/</span>
        <Link to="/taxa" className="hover:text-emerald-400">{species.taxonomy.phylum}</Link>
        <span>/</span>
        <span>{species.taxonomy.class}</span>
        <span>/</span>
        <span>{species.taxonomy.order}</span>
        <span>/</span>
        <span className="text-emerald-400 font-semibold">{species.names.scientific}</span>
      </nav>

      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-black text-white">{commonName}</h1>
            <span className="text-lg text-stone-400">({secondaryName})</span>
            {species.conservation?.iucn && (
              <span className="px-2.5 py-1 rounded-full text-xs font-black bg-rose-500/20 text-rose-300 border border-rose-500/30">
                IUCN: {species.conservation.iucn} (Nguy cấp)
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="italic text-stone-300 font-medium">{species.names.scientific}</span>
            <span className="text-stone-500 text-xs">{species.names.authorship}</span>
            <button
              onClick={handleCopyScientific}
              className="p-1 text-stone-400 hover:text-white transition-colors"
              title="Sao chép tên khoa học"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
            <Layers className="w-4 h-4" />
            Tier {species.media.model3d?.tier || 'A'} 3D Model
          </span>
        </div>
      </div>

      {/* Main 3D Canvas / Media Placeholder Area */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-stone-950 rounded-3xl border border-stone-800 overflow-hidden relative min-h-[460px] flex flex-col items-center justify-center p-6 text-center shadow-2xl">
          <div className="w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-4xl mb-4">
            🐅
          </div>
          <h3 className="text-xl font-bold text-white mb-2">3D Animal Viewer</h3>
          <p className="text-stone-400 text-sm max-w-md mb-4">
            Mô hình giải phẫu 3D (Panthera tigris) sẽ được kích hoạt ở Milestone M1 với OrbitControls, giải phẫu nhiều tầng và camera presets.
          </p>
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <span>Model: {species.media.model3d?.glb}</span>
            <span>•</span>
            <span>Giấy phép: {species.media.model3d?.license}</span>
          </div>
        </div>

        {/* Quick Biological Facts Column */}
        <div className="lg:col-span-4 bg-stone-800/40 rounded-3xl border border-stone-800 p-6 flex flex-col gap-5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Thông số sinh học chính
          </h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-stone-800">
              <span className="text-stone-400">Chiều dài</span>
              <span className="font-semibold text-stone-200">
                {species.morphology?.lengthCm ? `${species.morphology.lengthCm[0]} - ${species.morphology.lengthCm[1]} cm` : 'Chưa có dữ liệu'}
              </span>
            </div>

            <div className="flex justify-between py-2 border-b border-stone-800">
              <span className="text-stone-400">Khối lượng</span>
              <span className="font-semibold text-stone-200">
                {species.morphology?.weightKg ? `${species.morphology.weightKg[0]} - ${species.morphology.weightKg[1]} kg` : 'Chưa có dữ liệu'}
              </span>
            </div>

            <div className="flex justify-between py-2 border-b border-stone-800">
              <span className="text-stone-400">Chế độ ăn</span>
              <span className="font-semibold text-emerald-400 capitalize">
                {species.diet?.type || 'Chưa rõ'}
              </span>
            </div>

            <div className="flex justify-between py-2 border-b border-stone-800">
              <span className="text-stone-400">Tập tính hoạt động</span>
              <span className="font-semibold text-stone-200 capitalize">
                {species.behavior?.activityPattern || 'Chưa rõ'}
              </span>
            </div>

            <div className="flex justify-between py-2 border-b border-stone-800">
              <span className="text-stone-400">Tuổi thọ tự nhiên</span>
              <span className="font-semibold text-stone-200">
                {species.lifeCycle?.lifespanYears?.wild ? `${species.lifeCycle.lifespanYears.wild[0]} - ${species.lifeCycle.lifespanYears.wild[1]} năm` : 'Chưa rõ'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mt-12 border-b border-stone-800 flex gap-2 overflow-x-auto pb-px">
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
            className={`px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === tab.key
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-stone-400 hover:text-stone-200 hover:border-stone-700'
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
    </div>
  );
};
