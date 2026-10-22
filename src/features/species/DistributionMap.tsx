import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Globe, Compass, ExternalLink, Radio, Layers } from 'lucide-react';
import { SpeciesDistribution } from '../../types/species';

interface DistributionMapProps {
  distribution?: SpeciesDistribution | null;
  biomes?: string[];
  speciesName: string;
  scientificName: string;
}

interface RegionHighlight {
  id: string;
  nameVi: string;
  nameEn: string;
  cx: number;
  cy: number;
  r: number;
  lat: string;
  lon: string;
}

// Global biodiversity hotspot coordinates for species range mapping
const CONTINENT_COORDINATES: Record<string, RegionHighlight[]> = {
  asia: [
    { id: 'se-asia', nameVi: 'Đông Nam Á (Việt Nam, Lào, Thái Lan)', nameEn: 'Southeast Asia (Indochina & Sundaland)', cx: 720, cy: 300, r: 28, lat: "14°00'N", lon: "102°00'E" },
    { id: 's-asia', nameVi: 'Nam Á (Ấn Độ, Nepal, Sri Lanka)', nameEn: 'South Asia (Indian Subcontinent)', cx: 645, cy: 280, r: 24, lat: "20°35'N", lon: "78°57'E" },
    { id: 'e-asia', nameVi: 'Đông Á & Siberia (Nga, Trung Quốc, Triều Tiên)', nameEn: 'East Asia & Siberia (Amur Basin)', cx: 760, cy: 190, r: 32, lat: "48°00'N", lon: "135°00'E" },
  ],
  africa: [
    { id: 'e-africa', nameVi: 'Đông Phi (Serengeti, Thảo nguyên Savanna)', nameEn: 'East Africa (Serengeti & Rift Valley)', cx: 540, cy: 330, r: 26, lat: "02°15'S", lon: "34°50'E" },
    { id: 's-africa', nameVi: 'Nam Phi (Kalahari & Cape)', nameEn: 'Southern Africa', cx: 520, cy: 400, r: 22, lat: "28°00'S", lon: "24°00'E" },
    { id: 'c-africa', nameVi: 'Trung Phi (Lòng chảo Rừng mưa Congo)', nameEn: 'Central Africa (Congo Basin)', cx: 495, cy: 310, r: 24, lat: "00°00'N", lon: "25°00'E" },
  ],
  north_america: [
    { id: 'na-rockies', nameVi: 'Dãy Rockies & Rừng Boreal Bắc Mỹ', nameEn: 'North American Rockies & Boreal Forests', cx: 210, cy: 180, r: 30, lat: "45°00'N", lon: "112°00'W" },
    { id: 'na-arctic', nameVi: 'Bắc Cực & Alaska / Canada', nameEn: 'Arctic & Subarctic Tundra', cx: 220, cy: 110, r: 34, lat: "68°00'N", lon: "140°00'W" },
  ],
  south_america: [
    { id: 'sa-amazon', nameVi: 'Lòng chảo Rừng mưa Amazon', nameEn: 'Amazon Rainforest Basin', cx: 310, cy: 340, r: 30, lat: "03°28'S", lon: "60°12'W" },
    { id: 'sa-pantanal', nameVi: 'Đầm lầy Pantanal & Đồng cỏ Chaco', nameEn: 'Pantanal Wetlands & Chaco', cx: 320, cy: 400, r: 22, lat: "16°00'S", lon: "57°00'W" },
  ],
  europe: [
    { id: 'eu-forests', nameVi: 'Rừng hỗn giao & Dãy Alps Châu Âu', nameEn: 'European Mixed Forests & Alps', cx: 490, cy: 175, r: 22, lat: "46°00'N", lon: "10°00'E" },
  ],
  oceania: [
    { id: 'oc-aus', nameVi: 'Châu Đại Dương & Rạn san hô Great Barrier', nameEn: 'Oceania & Great Barrier Reef', cx: 780, cy: 410, r: 28, lat: "25°00'S", lon: "135°00'E" },
  ],
  polar: [
    { id: 'polar-arctic', nameVi: 'Vành đai Băng Bắc Cực (Băng biển)', nameEn: 'Circumpolar Arctic Sea Ice', cx: 480, cy: 60, r: 40, lat: "78°00'N", lon: "00°00'E" },
    { id: 'polar-antarctic', nameVi: 'Châu Nam Cực (Băng tuyết vĩnh cửu)', nameEn: 'Antarctica Continental Shelf', cx: 500, cy: 500, r: 45, lat: "80°00'S", lon: "00°00'E" },
  ],
  oceans: [
    { id: 'oceans-pacific', nameVi: 'Thái Bình Dương (Vùng biển nhiệt đới)', nameEn: 'Pacific Ocean (Pelagic & Coral Reefs)', cx: 880, cy: 290, r: 40, lat: "05°00'N", lon: "160°00'W" },
    { id: 'oceans-atlantic', nameVi: 'Đại Tây Dương', nameEn: 'Atlantic Ocean Pelagic Zone', cx: 390, cy: 260, r: 35, lat: "15°00'N", lon: "35°00'W" },
    { id: 'oceans-indian', nameVi: 'Ấn Độ Dương', nameEn: 'Indian Ocean Pelagic Realm', cx: 620, cy: 370, r: 35, lat: "10°00'S", lon: "75°00'E" },
  ],
};

export const DistributionMap: React.FC<DistributionMapProps> = ({
  distribution,
  biomes,
  speciesName: _speciesName,
  scientificName,
}) => {
  const { i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const [activeRegion, setActiveRegion] = useState<RegionHighlight | null>(null);
  const [mapMode, setMapMode] = useState<'svg' | 'gbif'>('svg');

  // Determine which global hotspots are relevant to this species
  const getRelevantHotspots = (): RegionHighlight[] => {
    const textLower = `${distribution?.text?.vi || ''} ${distribution?.text?.en || ''} ${(biomes || []).join(' ')} ${scientificName}`.toLowerCase();
    const hotspots: RegionHighlight[] = [];

    if (textLower.includes('châu á') || textLower.includes('asia') || textLower.includes('việt nam') || textLower.includes('ấn độ') || textLower.includes('tigris') || textLower.includes('bengal') || textLower.includes('indochina')) {
      hotspots.push(...CONTINENT_COORDINATES.asia);
    }
    if (textLower.includes('châu phi') || textLower.includes('africa') || textLower.includes('leo') || textLower.includes('savanna') || textLower.includes('serengeti')) {
      hotspots.push(...CONTINENT_COORDINATES.africa);
    }
    if (textLower.includes('bắc mỹ') || textLower.includes('north america') || textLower.includes('lupus') || textLower.includes('alaska') || textLower.includes('canada')) {
      hotspots.push(...CONTINENT_COORDINATES.north_america);
    }
    if (textLower.includes('nam mỹ') || textLower.includes('south america') || textLower.includes('amazon') || textLower.includes('brazil') || textLower.includes('onca')) {
      hotspots.push(...CONTINENT_COORDINATES.south_america);
    }
    if (textLower.includes('châu âu') || textLower.includes('europe') || textLower.includes('arctos') || textLower.includes('alps')) {
      hotspots.push(...CONTINENT_COORDINATES.europe);
    }
    if (textLower.includes('đại dương') || textLower.includes('ocean') || textLower.includes('carcharodon') || textLower.includes('chelonia') || textLower.includes('cá') || textLower.includes('san hô') || textLower.includes('sứa')) {
      hotspots.push(...CONTINENT_COORDINATES.oceans);
    }
    if (textLower.includes('bắc cực') || textLower.includes('arctic') || textLower.includes('maritimus') || textLower.includes('antarctic') || textLower.includes('chim cánh cụt') || textLower.includes('forsteri')) {
      hotspots.push(...CONTINENT_COORDINATES.polar);
    }
    if (textLower.includes('úc') || textLower.includes('australia') || textLower.includes('oceania')) {
      hotspots.push(...CONTINENT_COORDINATES.oceania);
    }

    // Default to at least Southeast Asia and East Asia if empty
    return hotspots.length > 0 ? hotspots : CONTINENT_COORDINATES.asia;
  };

  const hotspots = getRelevantHotspots();
  const selectedHotspot = activeRegion || hotspots[0];

  return (
    <div className="p-6 sm:p-8 rounded-3xl field-panel border-2 border-natgeo-yellow/25 shadow-2xl relative overflow-hidden field-ruler-bottom">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-natgeo-yellow/20 gap-4 mb-6">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-natgeo-yellow font-bold mb-1 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-natgeo-yellow animate-pulse" />
            <span>GEO-SPATIAL EXPEDITION SURVEY // IUCN & GBIF</span>
          </div>
          <h3 className="font-display text-2xl font-extrabold text-white flex items-center gap-2 uppercase tracking-tight">
            <Globe className="w-6 h-6 text-natgeo-yellow" />
            <span>{isEn ? 'Geographical Distribution & Range' : 'Bản Đồ Vùng Phân Bố Tự Nhiên'}</span>
          </h3>
          <p className="text-xs text-stone-400 mt-1 font-sans">
            {distribution?.text?.vi || distribution?.text?.en || (isEn ? 'Global geographical native distribution based on museum field records.' : 'Khu vực phân bố tự nhiên và sinh cảnh đặc trưng của loài theo dữ liệu GBIF.')}
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-2 bg-black/60 p-1.5 rounded-2xl border border-natgeo-yellow/30">
          <button
            onClick={() => setMapMode('svg')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
              mapMode === 'svg'
                ? 'bg-natgeo-yellow text-stone-950 shadow-glow font-extrabold'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{isEn ? 'Field Map' : 'Bản đồ thực địa'}</span>
          </button>

          {distribution?.gbifOccurrenceMapUrl && (
            <button
              onClick={() => setMapMode('gbif')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                mapMode === 'gbif'
                  ? 'bg-natgeo-yellow text-stone-950 shadow-glow font-extrabold'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{isEn ? 'GBIF Satellite' : 'Vệ tinh GBIF'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Map Content Viewport */}
      {mapMode === 'svg' ? (
        <div className="relative rounded-2xl overflow-hidden border-2 border-natgeo-yellow/30 bg-[#070d0a] shadow-inner">
          {/* Corner Viewfinder brackets */}
          <div className="viewfinder-corner-tl !w-3 !h-3" />
          <div className="viewfinder-corner-tr !w-3 !h-3" />
          <div className="viewfinder-corner-bl !w-3 !h-3" />
          <div className="viewfinder-corner-br !w-3 !h-3" />

          {/* Map Top HUD Telemetry */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-black/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-natgeo-yellow/30 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-natgeo-yellow animate-ping" />
            <span className="text-natgeo-yellow font-extrabold">LIVE RADAR:</span>
            <span className="text-stone-300">{selectedHotspot.lat} • {selectedHotspot.lon}</span>
          </div>

          <div className="absolute top-3 right-3 z-10 hidden sm:flex items-center gap-1.5 bg-black/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[11px] font-mono text-stone-400">
            <span>PROJECTION: MERCATOR 1:50M</span>
          </div>

          {/* SVG World Map Vector Canvas */}
          <div className="w-full h-[320px] sm:h-[400px] flex items-center justify-center p-2 relative">
            <svg
              viewBox="0 0 1000 520"
              className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Radial Glow for Range Hotspots */}
                <radialGradient id="rangeGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffcc00" stopOpacity="0.8" />
                  <stop offset="60%" stopColor="#ea580c" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#ffcc00" stopOpacity="0" />
                </radialGradient>
                <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 204, 0, 0.06)" strokeWidth="0.5" />
                </pattern>
              </defs>

              {/* Ocean Grid Background */}
              <rect width="1000" height="520" fill="#060c09" />
              <rect width="1000" height="520" fill="url(#mapGrid)" />

              {/* Simplified stylized world landmass contours */}
              {/* North America */}
              <path
                d="M 120 70 Q 180 50 260 70 T 320 120 T 260 210 T 200 240 T 140 180 Z"
                fill="#16231d"
                stroke="rgba(255, 204, 0, 0.2)"
                strokeWidth="1"
              />
              {/* South America */}
              <path
                d="M 270 260 Q 340 270 370 340 T 330 460 T 280 430 T 250 310 Z"
                fill="#16231d"
                stroke="rgba(255, 204, 0, 0.2)"
                strokeWidth="1"
              />
              {/* Europe */}
              <path
                d="M 460 110 Q 530 100 550 140 T 520 210 T 450 190 T 430 140 Z"
                fill="#16231d"
                stroke="rgba(255, 204, 0, 0.2)"
                strokeWidth="1"
              />
              {/* Africa */}
              <path
                d="M 450 210 Q 560 200 580 270 T 550 420 T 490 440 T 430 300 Z"
                fill="#16231d"
                stroke="rgba(255, 204, 0, 0.2)"
                strokeWidth="1"
              />
              {/* Asia & Siberia */}
              <path
                d="M 550 90 Q 750 80 880 140 T 850 260 T 730 330 T 600 280 T 550 170 Z"
                fill="#16231d"
                stroke="rgba(255, 204, 0, 0.2)"
                strokeWidth="1"
              />
              {/* Australia & Oceania */}
              <path
                d="M 740 370 Q 840 360 860 410 T 820 470 T 730 450 T 710 390 Z"
                fill="#16231d"
                stroke="rgba(255, 204, 0, 0.2)"
                strokeWidth="1"
              />
              {/* Antarctica */}
              <path
                d="M 350 495 Q 500 485 700 495 T 500 515 Z"
                fill="#16231d"
                stroke="rgba(255, 204, 0, 0.2)"
                strokeWidth="1"
              />

              {/* Equator & Tropic lines */}
              <line x1="0" y1="260" x2="1000" y2="260" stroke="rgba(255, 204, 0, 0.15)" strokeDasharray="4 4" strokeWidth="0.8" />
              <text x="15" y="255" fill="rgba(255, 204, 0, 0.4)" fontSize="9" fontFamily="monospace">EQUATOR 0°</text>

              {/* Render Active Range Hotspot Glow Zones */}
              {hotspots.map((hs) => {
                const isSelected = selectedHotspot.id === hs.id;
                return (
                  <g
                    key={hs.id}
                    onClick={() => setActiveRegion(hs)}
                    className="cursor-pointer group"
                  >
                    {/* Pulsing Area Halo */}
                    <circle
                      cx={hs.cx}
                      cy={hs.cy}
                      r={hs.r * 1.5}
                      fill="url(#rangeGlow)"
                      className="animate-pulse"
                    />

                    {/* Core Range Disc */}
                    <circle
                      cx={hs.cx}
                      cy={hs.cy}
                      r={hs.r}
                      fill={isSelected ? 'rgba(255, 204, 0, 0.4)' : 'rgba(234, 88, 12, 0.3)'}
                      stroke={isSelected ? '#ffcc00' : '#ea580c'}
                      strokeWidth={isSelected ? 2 : 1}
                      strokeDasharray={isSelected ? 'none' : '3 2'}
                    />

                    {/* Central Target Pin */}
                    <circle
                      cx={hs.cx}
                      cy={hs.cy}
                      r="4"
                      fill="#ffcc00"
                      stroke="#000"
                      strokeWidth="1.5"
                    />

                    {/* Pulsing Target Radar Ring */}
                    <circle
                      cx={hs.cx}
                      cy={hs.cy}
                      r="9"
                      fill="none"
                      stroke="#ffcc00"
                      strokeWidth="1"
                      opacity="0.8"
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Active Hotspot Radar Readout Card */}
          <div className="p-4 bg-black/90 border-t-2 border-natgeo-yellow/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-natgeo-yellow text-stone-950 flex items-center justify-center font-bold font-mono text-sm shadow-glow shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-display font-extrabold text-white uppercase flex items-center gap-2">
                  <span>{isEn ? selectedHotspot.nameEn : selectedHotspot.nameVi}</span>
                </div>
                <div className="text-[11px] font-mono text-natgeo-yellow mt-0.5">
                  Tọa độ thực địa: <span className="font-bold">{selectedHotspot.lat} • {selectedHotspot.lon}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {distribution?.gbifOccurrenceMapUrl && (
                <a
                  href={distribution.gbifOccurrenceMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-expedition-primary !text-xs !py-1.5 !px-3"
                >
                  <span>GBIF Occurrence Map</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Embedded Live GBIF Occurrence Map */
        <div className="relative rounded-2xl overflow-hidden border-2 border-natgeo-yellow/30 bg-black h-[420px] flex flex-col items-center justify-center p-6 text-center">
          <Globe className="w-12 h-12 text-natgeo-yellow mb-3 animate-spin" />
          <h4 className="font-display text-lg font-bold text-white mb-2 uppercase">
            {isEn ? 'Global GBIF Biodiversity Occurrence Network' : 'Mạng Lưới Tọa Độ Phân Bố Sinh Học Toàn Cầu (GBIF)'}
          </h4>
          <p className="text-xs text-stone-300 max-w-lg mb-6 font-sans">
            {isEn
              ? `Real-time occurrence density records for ${scientificName} gathered from international museums, satellite collars, and field research surveys.`
              : `Bản đồ mật độ tọa độ thực tế của ${scientificName} được tổng hợp từ các trạm quan sát vệ tinh và mẫu vật bảo tàng quốc tế.`}
          </p>

          <a
            href={distribution?.gbifOccurrenceMapUrl || 'https://www.gbif.org'}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-expedition-primary"
          >
            <span>{isEn ? 'Open Full GBIF Global Heatmap' : 'Mở Bản Đồ Mật Độ Toàn Cầu GBIF'}</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      )}

      {/* Biomes and Native Ecosystems Chips */}
      {biomes && biomes.length > 0 && (
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-natgeo-yellow mr-2 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5" />
            {isEn ? 'Native Biomes:' : 'Sinh cảnh tự nhiên:'}
          </span>
          {biomes.map((biome, i) => (
            <span
              key={i}
              className="btn-field-tag !text-xs !py-1 !px-2.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-natgeo-yellow" />
              {biome}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
