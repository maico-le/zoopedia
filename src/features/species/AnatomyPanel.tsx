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
  scientificName,
}) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language.startsWith('en') ? 'en' : 'vi';

  const [anatomyData, setAnatomyData] = useState<AnatomyData | null>(null);
  const [_loading, setLoading] = useState<boolean>(true);

  const {
    isAnatomyMode,
    setIsAnatomyMode,
    activeLayers,
    toggleLayer,
    setLayerActive,
    explodeAmount,
    setExplodeAmount,
    selectedAnatomyPart,
    setSelectedAnatomyPart,
  } = useViewerStore();

  // Load anatomy JSON descriptor for this species
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetch(`/anatomy/${speciesId}.json`)
      .then((res) => {
        if (!res.ok) throw new Error('No specific anatomy descriptor');
        return res.json();
      })
      .then((data: AnatomyData) => {
        if (isMounted) {
          setAnatomyData(data);
          setLoading(false);
        }
      })
      .catch(() => {
        // Fallback for tiger or archetypes
        if (speciesId.includes('tigris') || speciesId.includes('leo') || speciesId.includes('panthera')) {
          fetch('/anatomy/panthera-tigris.json')
            .then((r) => r.json())
            .then((data) => {
              if (isMounted) {
                setAnatomyData(data);
                setLoading(false);
              }
            })
            .catch(() => {
              if (isMounted) setLoading(false);
            });
        } else {
          if (isMounted) setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [speciesId]);

  const layerIcons: Record<string, React.ReactNode> = {
    skin: <Layers className="w-4 h-4 text-amber-500" />,
    muscle: <Activity className="w-4 h-4 text-rose-500" />,
    skeleton: <ShieldAlert className="w-4 h-4 text-stone-200" />,
    circulatory: <Heart className="w-4 h-4 text-red-500 animate-pulse" />,
    respiratory: <Wind className="w-4 h-4 text-sky-400" />,
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
      <div className="field-journal-card p-6 sm:p-8 bg-gradient-to-br from-stone-900/95 via-stone-900/90 to-amber-950/20 border-natgeo-yellow/30">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-natgeo-yellow/20">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="ink-stamp-badge border-natgeo-yellow/50 text-natgeo-yellow bg-natgeo-yellow/10">
                FIELD ANATOMY LAB • BIO-SCAN 3D
              </span>
              <span className="font-mono text-xs text-amber-400/80 tracking-widest uppercase">
                #ANAT-{speciesId.slice(0, 8).toUpperCase()}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-white tracking-wide flex items-center gap-3">
              <span>{currentLang === 'en' ? 'Internal Anatomy & Biomechanics' : 'Giải Phẫu Học & Cơ Sinh Học'}</span>
              <span className="text-sm font-sans font-normal text-stone-400 italic">({scientificName})</span>
            </h2>
            <p className="text-sm text-stone-300 font-serif max-w-3xl mt-1 leading-relaxed">
              {currentLang === 'en'
                ? 'High-precision anatomical dissection view. Explore internal systems, musculoskeletal leverage, cardiac capacity, and evolutionary hunting adaptations.'
                : 'Mô phỏng giải phẫu học đa lớp độ nét cao. Bóc tách từng tầng cơ quan, hệ cơ bắp bộc phát, cấu trúc hộp sọ và tim mạch thích nghi săn mồi đỉnh cao.'}
            </p>
          </div>

          {/* Quick Activate 3D Anatomy Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAnatomyMode(!isAnatomyMode)}
              className={`px-5 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2.5 transition-all shadow-lg ${
                isAnatomyMode
                  ? 'bg-natgeo-yellow text-stone-950 shadow-glow font-black border-2 border-amber-300 scale-105'
                  : 'bg-stone-800 text-stone-200 border border-natgeo-yellow/40 hover:bg-stone-700 hover:text-natgeo-yellow'
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
          <div className="md:col-span-5 bg-stone-950/70 p-4 rounded-2xl border border-natgeo-yellow/20">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono font-bold tracking-wider text-natgeo-yellow uppercase flex items-center gap-2">
                <Maximize2 className="w-3.5 h-3.5" />
                <span>{currentLang === 'en' ? 'Explode View Separation' : 'Bung Tách Không Gian (Explode)'}</span>
              </label>
              <span className="font-mono text-xs font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                {Math.round(explodeAmount * 100)}%
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-stone-500">0mm</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.02"
                value={explodeAmount}
                onChange={(e) => setExplodeAmount(parseFloat(e.target.value))}
                className="w-full accent-natgeo-yellow h-2 bg-stone-800 rounded-lg cursor-pointer transition-all"
              />
              <span className="text-[10px] font-mono text-stone-500">300mm</span>
            </div>
            <p className="text-[11px] font-mono text-stone-400 mt-2">
              {currentLang === 'en'
                ? 'Slide to mechanically separate organ assemblies in 3D coordinate space.'
                : 'Kéo thanh trượt để bung tách các lớp cơ và nội tạng theo tọa độ không gian 3D.'}
            </p>
          </div>

          {/* Quick Presets for Layers */}
          <div className="md:col-span-7 flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleIsolateLayer('skeleton')}
              className="px-3 py-2 rounded-xl text-xs font-mono font-bold bg-stone-800/90 text-stone-200 border border-stone-700 hover:border-natgeo-yellow hover:text-natgeo-yellow transition-all"
            >
              💀 {currentLang === 'en' ? 'Skeleton Only' : 'Chỉ Xem Xương Khớp'}
            </button>
            <button
              onClick={() => handleIsolateLayer('circulatory')}
              className="px-3 py-2 rounded-xl text-xs font-mono font-bold bg-stone-800/90 text-stone-200 border border-stone-700 hover:border-red-400 hover:text-red-400 transition-all"
            >
              🫀 {currentLang === 'en' ? 'Cardiovascular' : 'Hệ Tim Mạch'}
            </button>
            <button
              onClick={() => handleIsolateLayer('muscle')}
              className="px-3 py-2 rounded-xl text-xs font-mono font-bold bg-stone-800/90 text-stone-200 border border-stone-700 hover:border-rose-400 hover:text-rose-400 transition-all"
            >
              🥩 {currentLang === 'en' ? 'Musculature' : 'Hệ Cơ Bắp'}
            </button>
            <button
              onClick={handleShowAllLayers}
              className="px-3 py-2 rounded-xl text-xs font-mono font-bold bg-amber-500/10 text-natgeo-yellow border border-amber-500/30 hover:bg-amber-500/20 transition-all flex items-center gap-1.5"
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
          <div className="field-journal-card p-5 bg-stone-900/90 border-natgeo-yellow/20">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-natgeo-yellow flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>{currentLang === 'en' ? 'Layer Peeling' : 'Bóc Tách Từng Tầng Lớp'}</span>
              </h3>
              <span className="text-[10px] font-mono text-stone-400">
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
                        ? 'bg-stone-950/80 border-natgeo-yellow/30 text-white'
                        : 'bg-stone-950/30 border-white/5 text-stone-500'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-lg bg-stone-900 border border-white/10">
                        {layerIcons[layer.id] || <Layers className="w-4 h-4 text-stone-400" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold font-mono">
                          {layer.name[currentLang] || layer.name.vi}
                        </div>
                        <div className="text-[10px] font-mono text-stone-500 uppercase">
                          ID: {layer.id}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleLayer(layer.id)}
                      className={`p-2 rounded-lg border transition-all ${
                        isActive
                          ? 'bg-natgeo-yellow/20 border-natgeo-yellow/50 text-natgeo-yellow hover:bg-natgeo-yellow/30'
                          : 'bg-stone-900 border-stone-800 text-stone-500 hover:text-stone-300'
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
          <div className="field-journal-card p-5 bg-stone-900/90 border-natgeo-yellow/20 text-xs font-serif leading-relaxed text-stone-300 space-y-3">
            <div className="flex items-center gap-2 text-natgeo-yellow font-mono font-bold uppercase tracking-wider text-[11px]">
              <Info className="w-3.5 h-3.5" />
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
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-natgeo-yellow flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span>{currentLang === 'en' ? 'Organ Registry & Biomechanics' : 'Hồ Sơ Chi Tiết Cơ Quan Giải Phẫu'}</span>
            </h3>
            <span className="text-xs font-mono text-stone-400">
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
                      ? 'bg-amber-950/40 border-natgeo-yellow shadow-glow text-white'
                      : 'bg-stone-900/80 border-natgeo-yellow/20 hover:border-natgeo-yellow/50 hover:bg-stone-900 text-stone-200'
                  }`}
                >
                  {/* Active reticle badge */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-natgeo-yellow text-stone-950 font-mono text-[9px] font-extrabold uppercase tracking-widest">
                      ACTIVE PIN
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-stone-950 border border-white/10 shrink-0">
                      {layerIcons[part.layer] || <Layers className="w-4 h-4 text-amber-500" />}
                    </div>
                    <div>
                      <h4 className="text-base font-bold font-serif text-white group-hover:text-natgeo-yellow transition-colors">
                        {part.name[currentLang] || part.name.vi}
                      </h4>
                      {part.name.latin && (
                        <div className="text-xs font-serif italic text-amber-300/80 mb-2">
                          {part.name.latin}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-white/10 space-y-2 text-xs">
                    <div>
                      <span className="font-mono text-[10px] text-natgeo-yellow uppercase font-bold tracking-wider block mb-0.5">
                        {currentLang === 'en' ? 'Biological Function:' : 'Chức năng cơ sinh học:'}
                      </span>
                      <p className="font-serif text-stone-300 leading-relaxed">
                        {part.function[currentLang] || part.function.vi}
                      </p>
                    </div>

                    <div>
                      <span className="font-mono text-[10px] text-stone-400 uppercase font-bold tracking-wider block mb-0.5">
                        {currentLang === 'en' ? 'Histology & Anatomy:' : 'Chi tiết giải phẫu học:'}
                      </span>
                      <p className="font-serif text-stone-400 leading-relaxed">
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
