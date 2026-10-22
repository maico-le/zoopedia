import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useViewerStore } from '../viewer/useViewerStore';
import { 
  Layers, 
  Eye, 
  EyeOff, 
  Maximize2, 
  Activity, 
  Heart, 
  Wind, 
  ShieldAlert, 
  Sparkles,
  Info,
  RotateCcw
} from 'lucide-react';

interface AnatomyLayer {
  id: string;
  name: {
    vi: string;
    en: string;
  };
  default?: boolean;
}

interface AnatomyPart {
  node: string;
  layer: string;
  name: {
    vi: string;
    en: string;
    latin?: string;
  };
  function: {
    vi: string;
    en: string;
  };
  description: {
    vi: string;
    en: string;
  };
  explodeVector?: [number, number, number];
  labelAnchor?: [number, number, number];
  relatedParts?: string[];
}

interface AnatomyData {
  model: string;
  layers: AnatomyLayer[];
  parts: AnatomyPart[];
}

interface AnatomyPanelProps {
  speciesId: string;
  speciesNameVi: string;
  speciesNameEn: string;
  scientificName: string;
}

export const AnatomyPanel: React.FC<AnatomyPanelProps> = ({
  speciesId,
  speciesNameVi,
  speciesNameEn,
  scientificName
}) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language === 'en' ? 'en' : 'vi';

  const {
    isAnatomyMode,
    setIsAnatomyMode,
    activeLayers,
    setLayerActive,
    toggleLayer,
    explodeAmount,
    setExplodeAmount,
    selectedAnatomyPart,
    setSelectedAnatomyPart
  } = useViewerStore();

  const [anatomyData, setAnatomyData] = useState<AnatomyData | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadAnatomy = async () => {
      try {
        const res = await fetch(`/data/anatomy/panthera-tigris-anatomy.json`);
        if (res.ok) {
          const json = await res.json();
          if (isMounted) {
            setAnatomyData(json);
            json.layers.forEach((l: AnatomyLayer) => {
              if (activeLayers[l.id] === undefined) {
                setLayerActive(l.id, l.default !== false);
              }
            });
          }
        }
      } catch (err) {
        console.warn('Could not load specific anatomy profile, using mock fallback', err);
        const fallback: AnatomyData = {
          model: 'models/panthera-tigris-anatomy.glb',
          layers: [
            { id: 'skin', name: { vi: 'Lớp Da & Lông Ngoài', en: 'Integument & Pelage' }, default: true },
            { id: 'muscle', name: { vi: 'Hệ Cơ Vân Săn Mồi', en: 'Striated Musculature' }, default: true },
            { id: 'skeleton', name: { vi: 'Bộ Khung Xương Đòn Bẩy', en: 'Endoskeleton' }, default: true },
            { id: 'circulatory', name: { vi: 'Hệ Tuần Hoàn Áp Lực Cao', en: 'Circulatory System' }, default: false },
            { id: 'respiratory', name: { vi: 'Hệ Hô Hấp Dung Tích Lớn', en: 'Respiratory System' }, default: false },
          ],
          parts: [
            {
              node: 'Cranium_Jaws',
              layer: 'skeleton',
              name: { vi: 'Hộp Sọ & Khớp Hàm Khóa Chặt', en: 'Cranium & Temporal Condyle', latin: 'Cranium & Mandibula' },
              function: { vi: 'Tạo lực cắn 1,050 psi bóp nghẹt khí quản con mồi', en: 'Delivers 1,050 psi bite force capable of severing spinal vertebrae' },
              description: { vi: 'Cung gò má mở rộng chứa bó cơ thái dương khổng lồ', en: 'Flared zygomatic arches accommodating immense temporalis muscle mass' }
            },
            {
              node: 'Pectoral_Deltoid',
              layer: 'muscle',
              name: { vi: 'Khối Cơ Bả Vai & Chi Trước', en: 'Deltoid & Pectoral Muscle Complex', latin: 'Musculus pectoralis major' },
              function: { vi: 'Giữ chặt con mồi nặng gấp 3 lần trọng lượng cơ thể', en: 'Stabilizes and pins heavy prey down with explosive lateral torque' },
              description: { vi: 'Sợi cơ co nhanh loại II chiếm tỷ lệ 80% cho cú vồ chết người', en: 'Fast-twitch type II fibers dominate enabling sudden dynamic bursts' }
            },
            {
              node: 'Heart_Hypertrophy',
              layer: 'circulatory',
              name: { vi: 'Tim 4 Ngăn Bơm Áp Suất Cao', en: 'High-Volume 4-Chambered Heart', latin: 'Cor' },
              function: { vi: 'Đẩy máu giàu oxy đến các chi chỉ trong vài nhịp đập', en: 'Accelerates oxygenated hemoglobin to locomotor muscles instantaneously' },
              description: { vi: 'Thất trái phì đại thích nghi với các pha rượt đuổi tốc độ cao', en: 'Hypertrophied left ventricle adapted for explosive short-sprint chases' }
            },
            {
              node: 'Spine_Flex',
              layer: 'skeleton',
              name: { vi: 'Cột Sống Đàn Hồi Giảm Chấn', en: 'Flexible Lumbar Spine', latin: 'Columna vertebralis' },
              function: { vi: 'Kéo dài bước nhảy lên tới 10 mét trong một nhịp thở', en: 'Acts like a biological spring stretching strides up to 10 meters' },
              description: { vi: 'Đĩa đệm dày với dây chằng đàn hồi cao bảo vệ tủy sống', en: 'Thick intervertebral discs dissipate landing kinetic shock loads' }
            }
          ]
        };
        if (isMounted) {
          setAnatomyData(fallback);
        }
      }
    };

    loadAnatomy();

    return () => {
      isMounted = false;
    };
  }, [speciesId]);

  const layerIcons: Record<string, React.ReactNode> = {
    skin: <Layers className="w-4 h-4 text-emerald-600" />,
    muscle: <Activity className="w-4 h-4 text-rose-500" />,
    skeleton: <ShieldAlert className="w-4 h-4 text-slate-700" />,
    circulatory: <Heart className="w-4 h-4 text-red-500 animate-pulse" />,
    respiratory: <Wind className="w-4 h-4 text-teal-600" />,
  };

  const handleIsolateLayer = (layerId: string) => {
    if (!anatomyData) return;
    anatomyData.layers.forEach((l) => {
      setLayerActive(l.id, l.id === layerId);
    });
  };

  const handleShowAllLayers = () => {
    if (!anatomyData) return;
    anatomyData.layers.forEach((l) => {
      setLayerActive(l.id, true);
    });
  };

  return (
    <div className="space-y-6">
      {/* Field Expedition Anatomy HUD Card */}
      <div className="p-6 sm:p-8 bg-white rounded-3xl border-2 border-emerald-200 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-emerald-100">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-full font-mono text-[10px] font-bold border border-emerald-200 text-emerald-800 bg-emerald-50">
                FIELD ANATOMY LAB • BIO-SCAN 3D
              </span>
              <span className="font-mono text-xs text-emerald-700 tracking-widest uppercase font-semibold">
                #ANAT-{speciesId.slice(0, 8).toUpperCase()}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-wide flex items-center gap-3">
              <span>{currentLang === 'en' ? 'Internal Anatomy & Biomechanics' : 'Giải Phẫu Học & Cơ Sinh Học'}</span>
              <span className="text-sm font-sans font-normal text-slate-500 italic">({scientificName})</span>
            </h2>
            <p className="text-sm text-slate-600 font-serif max-w-3xl mt-1 leading-relaxed">
              {currentLang === 'en'
                ? 'High-precision anatomical dissection view. Explore internal systems, musculoskeletal leverage, cardiac capacity, and evolutionary hunting adaptations.'
                : 'Mô phỏng giải phẫu học đa lớp độ nét cao. Bóc tách từng tầng cơ quan, hệ cơ bắp bộc phát, cấu trúc hộp sọ và tim mạch thích nghi săn mồi đỉnh cao.'}
            </p>
          </div>

          {/* Quick Activate 3D Anatomy Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAnatomyMode(!isAnatomyMode)}
              className={`px-5 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2.5 transition-all shadow-sm ${
                isAnatomyMode
                  ? 'bg-emerald-600 text-white shadow-md font-black scale-105'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {isAnatomyMode
                  ? (currentLang === 'en' ? '3D Anatomy Mode Active' : 'Chế Độ Giải Phẫu Đang Bật')
                  : (currentLang === 'en' ? 'Enable 3D Dissection' : 'Bật Giải Phẫu 3D')}
              </span>
            </button>
          </div>
        </div>

        {/* Explode View Slider HUD */}
        <div className="pt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-5 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono font-bold tracking-wider text-emerald-700 uppercase flex items-center gap-2">
                <Maximize2 className="w-3.5 h-3.5" />
                <span>{currentLang === 'en' ? 'Explode View Separation' : 'Bung Tách Không Gian (Explode)'}</span>
              </label>
              <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                {Math.round(explodeAmount * 100)}%
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-slate-400 font-semibold">0mm</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.02"
                value={explodeAmount}
                onChange={(e) => setExplodeAmount(parseFloat(e.target.value))}
                className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer transition-all"
              />
              <span className="text-[10px] font-mono text-slate-400 font-semibold">300mm</span>
            </div>
            <p className="text-[11px] font-mono text-slate-500 mt-2">
              {currentLang === 'en'
                ? 'Slide to mechanically separate organ assemblies in 3D coordinate space.'
                : 'Kéo thanh trượt để bung tách các lớp cơ và nội tạng theo tọa độ không gian 3D.'}
            </p>
          </div>

          {/* Quick Presets for Layers */}
          <div className="md:col-span-7 flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleIsolateLayer('skeleton')}
              className="px-3 py-2 rounded-xl text-xs font-mono font-bold bg-slate-50 text-slate-700 border border-slate-200 hover:border-emerald-400 hover:text-emerald-700 transition-all"
            >
              💀 {currentLang === 'en' ? 'Skeleton Only' : 'Chỉ Xem Xương Khớp'}
            </button>
            <button
              onClick={() => handleIsolateLayer('circulatory')}
              className="px-3 py-2 rounded-xl text-xs font-mono font-bold bg-slate-50 text-slate-700 border border-slate-200 hover:border-red-400 hover:text-red-600 transition-all"
            >
              🫀 {currentLang === 'en' ? 'Cardiovascular' : 'Hệ Tim Mạch'}
            </button>
            <button
              onClick={() => handleIsolateLayer('muscle')}
              className="px-3 py-2 rounded-xl text-xs font-mono font-bold bg-slate-50 text-slate-700 border border-slate-200 hover:border-rose-400 hover:text-rose-600 transition-all"
            >
              🥩 {currentLang === 'en' ? 'Musculature' : 'Hệ Cơ Bắp'}
            </button>
            <button
              onClick={handleShowAllLayers}
              className="px-3 py-2 rounded-xl text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-all flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{currentLang === 'en' ? 'Show All Layers' : 'Hiện Toàn Bộ Lớp'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Layer Peeling Dashboard & Component Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Layer Peeling Switches */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 bg-white rounded-3xl border border-emerald-100 shadow-sm">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>{currentLang === 'en' ? 'Layer Peeling' : 'Bóc Tách Từng Tầng Lớp'}</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-400 font-semibold">
                {anatomyData ? `${anatomyData.layers.length} Layers` : 'Layers'}
              </span>
            </div>

            <div className="space-y-2">
              {anatomyData?.layers.map((layer) => {
                const isActive = activeLayers[layer.id] ?? true;
                return (
                  <div
                    key={layer.id}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      isActive
                        ? 'bg-emerald-50/60 border-emerald-200 text-slate-900 font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-lg bg-white border border-slate-200">
                        {layerIcons[layer.id] || <Layers className="w-4 h-4 text-slate-400" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold font-mono">
                          {layer.name[currentLang] || layer.name.vi}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 uppercase">
                          ID: {layer.id}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleLayer(layer.id)}
                      className={`p-2 rounded-lg border transition-all ${
                        isActive
                          ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700'
                          : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600'
                      }`}
                      title={isActive ? 'Ẩn lớp này' : 'Hiện lớp này'}
                    >
                      {isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Biomechanical Field Notes */}
          <div className="p-5 bg-emerald-50/50 rounded-3xl border border-emerald-200 text-xs font-serif leading-relaxed text-slate-700 space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 font-mono font-bold uppercase tracking-wider text-[11px]">
              <Info className="w-3.5 h-3.5 text-emerald-600" />
              <span>{currentLang === 'en' ? 'Expedition Anatomical Note' : 'Ghi Chú Sinh Học Dã Ngoại'}</span>
            </div>
            <p>
              {currentLang === 'en'
                ? `The anatomical architecture of ${speciesNameEn} demonstrates extreme evolutionary refinement. Heavy skeletal density supports explosive pouncing vectors, while high vascularity in cardiac tissues enables immediate anaerobic bursts.`
                : `Hệ thống giải phẫu của ${speciesNameVi} đại diện cho sự tiến hóa tối thượng. Khung xương chắc khỏe tạo điểm tựa cho lực cắn nghẹt thở, trong khi lưu lượng tim mạch được thiết kế cho những cú bứt tốc bùng nổ cự ly ngắn.`}
            </p>
          </div>
        </div>

        {/* Right Column: Detailed Organ & Part Breakdown */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span>{currentLang === 'en' ? 'Organ Registry & Biomechanics' : 'Hồ Sơ Chi Tiết Cơ Quan Giải Phẫu'}</span>
            </h3>
            <span className="text-xs font-mono text-slate-500 font-semibold">
              {currentLang === 'en' ? 'Click card to highlight in 3D' : 'Click thẻ để định vị trên mô hình 3D'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {anatomyData?.parts.map((part) => {
              const isSelected = selectedAnatomyPart === part.node;
              return (
                <div
                  key={part.node}
                  onClick={() => setSelectedAnatomyPart(isSelected ? null : part.node)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-500 shadow-md text-slate-900'
                      : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-md text-slate-700'
                  }`}
                >
                  {/* Active reticle badge */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-emerald-600 text-white font-mono text-[9px] font-extrabold uppercase tracking-widest">
                      ACTIVE PIN
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 shrink-0">
                      {layerIcons[part.layer] || <Layers className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <div>
                      <h4 className="text-base font-bold font-serif text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {part.name[currentLang] || part.name.vi}
                      </h4>
                      {part.name.latin && (
                        <div className="text-xs font-serif italic text-emerald-700 mb-2">
                          {part.name.latin}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-2 text-xs">
                    <div>
                      <span className="font-mono text-[10px] text-emerald-800 uppercase font-bold tracking-wider block mb-0.5">
                        {currentLang === 'en' ? 'Biological Function:' : 'Chức năng cơ sinh học:'}
                      </span>
                      <p className="font-serif text-slate-700 leading-relaxed">
                        {part.function[currentLang] || part.function.vi}
                      </p>
                    </div>

                    <div>
                      <span className="font-mono text-[10px] text-slate-500 uppercase font-bold tracking-wider block mb-0.5">
                        {currentLang === 'en' ? 'Histology & Anatomy:' : 'Chi tiết giải phẫu học:'}
                      </span>
                      <p className="font-serif text-slate-600 leading-relaxed">
                        {part.description[currentLang] || part.description.vi}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
