import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Eye,
  Scan,
  Glasses,
  Sparkles,
  ArrowRight,
  Sliders,
  Zap
} from 'lucide-react';

// --- VISION SENSORY SCENE DATA STRUCTURES ---

export interface SensoryVisionScene {
  id: string;
  titleVi: string;
  titleEn: string;
  animalVi: string;
  animalEn: string;
  scientific: string;
  speciesSlug: string;
  icon: string;
  photoreceptorsVi: string;
  photoreceptorsEn: string;
  wavelengthRange: string;
  fieldOfView: string;
  biologicalMechanismVi: string;
  biologicalMechanismEn: string;
  humanPerceptionVi: string;
  humanPerceptionEn: string;
  animalPerceptionVi: string;
  animalPerceptionEn: string;
  evolutionaryAdvantageVi: string;
  evolutionaryAdvantageEn: string;
  filterMode: 'thermal' | 'ultraviolet' | 'dichromatic' | 'telescopic' | 'night_vision' | 'polarized';
}

const VISION_SCENES: SensoryVisionScene[] = [
  {
    id: 'tiger_camouflage',
    titleVi: 'Hổ Rình Mồi Trong Rừng Cỏ - Thị Giác Nhị Sắc Của Con Mồi',
    titleEn: 'Tiger Camouflage - Prey Dichromatic Vision',
    animalVi: 'Hươu & Thú Móng Guốc (Con mồi của Hổ)',
    animalEn: 'Deer & Ungulates (Tiger Prey)',
    scientific: 'Cervidae / Panthera tigris',
    speciesSlug: 'panthera-tigris',
    icon: '🐅',
    photoreceptorsVi: 'Thị giác Nhị sắc (2 loại tế bào nón: Xanh lam & Xanh lục, không có thụ thể màu đỏ)',
    photoreceptorsEn: 'Dichromatic Vision (2 cone photopigments: S & M cones, missing red L-cone)',
    wavelengthRange: '420 nm - 535 nm',
    fieldOfView: '310° Góc nhìn bao quát phòng thủ',
    biologicalMechanismVi: 'Con người có 3 tế bào nón (Trichromat) phân biệt được màu cam và màu xanh lá. Hươu và thú móng guốc chỉ có 2 tế bào nón (Dichromat), không thể phân biệt dải quang phổ đỏ - xanh lục.',
    biologicalMechanismEn: 'Humans have 3 cone opsins. Deer and grazing ungulates are red-green colorblind (dichromatic), rendering bright orange into dull muted brownish-green.',
    humanPerceptionVi: 'Con người nhìn thấy bộ lông cam rực rỡ có sọc đen của Hổ nổi bần bật trên nền lá cây cỏ xanh.',
    humanPerceptionEn: 'Humans clearly detect the bright orange fur and black stripes contrasting sharply against lush green foliage.',
    animalPerceptionVi: 'Dưới mắt của Hươu, màu cam của lông hổ biến hoàn toàn thành màu nâu xám / xanh lục xỉn, hòa tan tàng hình 100% vào bụi cỏ!',
    animalPerceptionEn: 'Through the eyes of a deer, the tiger’s vibrant orange morphs into camouflage olive-green/brown, perfectly blending into the grass canopy!',
    evolutionaryAdvantageVi: 'Bộ lông màu cam giúp Hổ trở thành kẻ săn mồi vô hình trong mắt con mồi mà không cần phải tiến hóa sắc tố lông màu xanh lục (vốn rất khó tổng hợp ở lớp thú).',
    evolutionaryAdvantageEn: 'Allows tigers to be completely stealthy invisible apex stalkers without needing green mammalian fur pigment (which does not exist in nature).',
    filterMode: 'dichromatic',
  },
  {
    id: 'snake_thermal',
    titleVi: 'Rắn Săn Mồi Trong Đêm Tối - Cảm Biến Hố Nhiệt Hồng Ngoại',
    titleEn: 'Snake Nocturnal Strike - Loreal Pit Infrared Sensor',
    animalVi: 'Rắn Chuông & Trăn Khổng Lồ',
    animalEn: 'Pit Vipers & Pythons',
    scientific: 'Crotalinae / Boidae',
    speciesSlug: 'malayopython-reticulatus',
    icon: '🐍',
    photoreceptorsVi: 'Kênh ion thụ cảm nhiệt độ TRPA1 trong màng hố nhiệt loreal pit',
    photoreceptorsEn: 'TRPA1 thermal ion channels inside bilateral loreal pit membranes',
    wavelengthRange: '5.000 nm - 15.000 nm (Bức xạ hồng ngoại nhiệt)',
    fieldOfView: '180° Khối lập thể nhiệt 3D',
    biologicalMechanismVi: 'Cặp hố nhiệt nằm giữa mắt và lỗ mũi hoạt động như máy đo nhiệt độ bức xạ pinhole, phát hiện chênh lệch nhiệt độ cực nhỏ tới 0.003°C phát ra từ thân nhiệt động vật hằng nhiệt.',
    biologicalMechanismEn: 'Pinhole radiation thermal pits detect heat fluctuations as tiny as 0.003°C from warm-blooded endotherms.',
    humanPerceptionVi: 'Con người nhìn vào rừng cây lúc nửa đêm: Mọi thứ đen kịt, không thể phát hiện con chuột đang nấp trong hốc đá.',
    humanPerceptionEn: 'Humans looking into pitch-black midnight brush see zero photon light; prey is completely concealed.',
    animalPerceptionVi: 'Rắn nhìn thấy "bản đồ nhiệt quang phổ FLIR": Thân nhiệt ấm 37°C của chuột phát sáng rực rỡ màu vàng, đỏ và trắng trên nền đất lạnh màu xanh tím.',
    animalPerceptionEn: 'Snakes perceive a glowing FLIR thermal infrared map: 37°C warm prey glows vivid yellow-orange-white against chilly violet background rocks.',
    evolutionaryAdvantageVi: 'Tung đòn đớp chính xác tới từng milimet trong bóng đêm tuyệt đối mà không cần bất kỳ ánh sáng khả kiến nào.',
    evolutionaryAdvantageEn: 'Executes lethal surgical strikes in absolute 0-lux darkness with millimeter precision purely through radiative thermal guidance.',
    filterMode: 'thermal',
  },
  {
    id: 'bee_ultraviolet',
    titleVi: 'Ong & Chim Săn Mật - Thị Giác Tia Cực Tím (UV Spectrum)',
    titleEn: 'Bee & Bird Foraging - Ultraviolet Spectrum & Nectar Guides',
    animalVi: 'Ong Mật Phương Tây & Vẹt Đuôi Dài',
    animalEn: 'Honeybees & Avian Pollinators',
    scientific: 'Apis mellifera / Psittacidae',
    speciesSlug: 'apis-mellifera',
    icon: '🐝',
    photoreceptorsVi: 'Thị giác Tứ sắc (4 loại tế bào nón: UV 350nm, Xanh lam 440nm, Xanh lục 540nm, Đỏ 600nm)',
    photoreceptorsEn: 'Tetrachromatic Vision (4 cones: Ultraviolet 350nm, Blue 440nm, Green 540nm, Red 600nm)',
    wavelengthRange: '300 nm - 650 nm',
    fieldOfView: '360° Mắt kép đa thấu kính',
    biologicalMechanismVi: 'Mắt ong và chim có thụ thể cực nhạy với bước sóng cực tím (UV). Thủy tinh thể của chúng không chặn tia UV như mắt người, giúp nhìn thấy dải màu sắc bí mật của tự nhiên.',
    biologicalMechanismEn: 'Crystalline lenses do not filter out UV radiation, unlocking an invisible electromagnetic spectrum hidden to human physiology.',
    humanPerceptionVi: 'Con người nhìn hoa bồ công anh hoặc hoa dại: Chỉ thấy những cánh hoa màu vàng hoặc trắng đơn điệu.',
    humanPerceptionEn: 'Humans see plain uniform yellow petals with no obvious navigation landing patterns.',
    animalPerceptionVi: 'Dưới mắt Ong: Xuất hiện các "Đường dẫn mật hoa" (Nectar Guides) phát quang tia cực tím hình bia ngắm rực rỡ dẫn thẳng vào nhụy mật; lông chim phát sáng hoa văn huỳnh quang.',
    animalPerceptionEn: 'Under UV bee sight: Spectacular bullseye "Nectar Guides" glow intensely in UV wavelengths pointing directly to pollen reservoirs.',
    evolutionaryAdvantageVi: 'Định vị nguồn phấn hoa siêu tốc từ xa; nhận diện bạn tình qua hoa văn lông phát quang UV mà kẻ thù không thể nhìn thấy.',
    evolutionaryAdvantageEn: 'Rapid long-distance floral discovery and private mate signaling via secret UV plumage codes invisible to mammalian predators.',
    filterMode: 'ultraviolet',
  },
  {
    id: 'eagle_telescopic',
    titleVi: 'Đại Bàng Săn Mồi - Hai Hố Thị Giác Viễn Vọng Phóng Đại 8x',
    titleEn: 'Raptor High-Acuity Zoom - Dual Fovea Telescopic Sight',
    animalVi: 'Đại Bàng Vàng & Chim Ưng Peregrine',
    animalEn: 'Golden Eagle & Falcons',
    scientific: 'Aquila chrysaetos',
    speciesSlug: 'aquila-chrysaetos',
    icon: '🦅',
    photoreceptorsVi: 'Hai hố thị giác độc lập (Dual Fovea) với mật độ 1.000.000 tế bào nón/mm² (gấp 5 lần người)',
    photoreceptorsEn: 'Dual independent foveae with 1,000,000 cones/mm² (5x human retinal density)',
    wavelengthRange: '320 nm - 700 nm',
    fieldOfView: '340° Với trung tâm phóng đại quang học 8x',
    biologicalMechanismVi: 'Mỗi mắt đại bàng có hai hố thị giác (Deep Fovea và Shallow Fovea). Nhãn cầu hình chuông với thấu kính điều tiết cực mạnh tạo ra hiệu ứng ống nhòm viễn vọng quang học.',
    biologicalMechanismEn: 'Flattened bell-shaped eyeballs equipped with deep concave foveae acting as natural built-in telephoto zoom lenses.',
    humanPerceptionVi: 'Con người nhìn từ độ cao 1.000 mét: Toàn cảnh thung lũng bao la, con thỏ chỉ là một chấm nhỏ li ti không thể nhận diện chuyển động.',
    humanPerceptionEn: 'Humans at 1,000m altitude see sweeping panorama; a rabbit is a microscopic unresolvable speck.',
    animalPerceptionVi: 'Đại bàng nhìn thấy: Toàn cảnh góc rộng 340° kèm một "Kính ngắm viễn vọng 8x" trung tâm phóng to rõ từng sợi lông và nhịp thở của con thỏ đang gặm cỏ cách xa 3 km!',
    animalPerceptionEn: 'Eagle vision: Seamless 340° situational awareness overlaid with a crystal-clear 8x optical zoom resolving every whisker of a rabbit 3km away!',
    evolutionaryAdvantageVi: 'Phát hiện con mồi ngụy trang siêu nhỏ từ tầng mây cao trước khi gập cánh lao bổ nhào bứt tốc 300 km/h.',
    evolutionaryAdvantageEn: 'Pins down camouflaged prey from cloud altitudes before initiating terrifying 300 km/h gravity-assisted hunting stoops.',
    filterMode: 'telescopic',
  },
  {
    id: 'feline_night_vision',
    titleVi: 'Mèo Rừng & Thú Ăn Đêm - Màng Phản Xạ Ánh Biển Tapetum Lucidum',
    titleEn: 'Feline Night Optics - Tapetum Lucidum Photomultiplier',
    animalVi: 'Báo Hoa Mai, Mèo Rừng & Cú Mèo',
    animalEn: 'Leopards & Nocturnal Felids',
    scientific: 'Panthera pardus',
    speciesSlug: 'panthera-pardus',
    icon: '🐆',
    photoreceptorsVi: 'Tỉ lệ tế bào que (Rods) áp đảo 25:1 tế bào nón; Màng phản xạ tinh thể kẽm Tapetum Lucidum',
    photoreceptorsEn: '25:1 Rods to Cones ratio backed by retroreflective zinc-cysteine Tapetum Lucidum mirror layer',
    wavelengthRange: '380 nm - 650 nm',
    fieldOfView: '200° Với 140° Thị giác lập thể 3D sâu',
    biologicalMechanismVi: 'Lớp màng gương sinh học Tapetum Lucidum nằm ngay sau võng mạc, phản xạ các photon ánh sáng chưa được hấp thụ ngược trở lại tế bào que lần thứ hai, tăng độ nhạy sáng lên 6-8 lần.',
    biologicalMechanismEn: 'A retroreflective cellular mirror layer behind the retina bounces missed photons back through rods a second time, multiplying low-light sensitivity 6-8x.',
    humanPerceptionVi: 'Con người trong rừng lúc nửa đêm: Mù mờ, chỉ thấy bóng đen mờ nhạt và dễ vấp ngã chướng ngại vật.',
    humanPerceptionEn: 'Humans in night forests are visually crippled, barely discerning dark silhouettes in 0.01 lux moonlight.',
    animalPerceptionVi: 'Báo nhìn thấy: Toàn cảnh đêm sáng rõ như ban ngày dưới tông màu xanh phosphor dịu mắt; mắt con mồi phản chiếu ánh sáng thành hai đốm sáng phát quang (eyeshine).',
    animalPerceptionEn: 'Leopard sight: Bright illuminated night landscape in crisp high-contrast phosphor green, detecting eyeshine reflections from prey yards away.',
    evolutionaryAdvantageVi: 'Rình mồi và vồ chính xác con mồi đang di chuyển trong điều kiện ánh sáng yếu hơn 6 lần ngưỡng tối thiểu của con người.',
    evolutionaryAdvantageEn: 'Stalks and ambushes fleeing prey in light conditions 6 times dimmer than what human eyes can perceive.',
    filterMode: 'night_vision',
  },
  {
    id: 'marine_polarized',
    titleVi: 'Mực Nang Biển Sâu - Thị Giác Phân Cực Dưới Nước (Polarized Light)',
    titleEn: 'Cephalopod Polarization - Ocean Glare Penetration',
    animalVi: 'Mực Nang Châu Âu & Bạch Tuộc',
    animalEn: 'Cuttlefish & Octopuses',
    scientific: 'Sepia officinalis',
    speciesSlug: 'sepia-officinalis',
    icon: '🦑',
    photoreceptorsVi: 'Tế bào thụ cảm vi nhung mao (rhabdomeric microvilli) xếp vuông góc 90° phát hiện góc phân cực (e-vector)',
    photoreceptorsEn: 'Perpendicularly arranged rhabdomeric microvilli detecting linear polarization e-vectors',
    wavelengthRange: '450 nm - 520 nm',
    fieldOfView: '360° Mắt có đồng tử chữ W điều tiết độc lập',
    biologicalMechanismVi: 'Nước biển phân tán ánh sáng gây lóa mờ. Mực nang cảm nhận hướng dao động của sóng ánh sáng (phân cực), bóc tách lớp sương mù của nước biển để phát hiện vật thể trong suốt.',
    biologicalMechanismEn: 'Underwater light is heavily scattered. Cephalopods sense polarized light orientation, cutting through marine haze to detect transparent organisms.',
    humanPerceptionVi: 'Con người nhìn xuống biển: Mặt nước lóa sáng chói chang, tôm cá trong suốt hoàn toàn hòa lẫn vào dòng nước biển đục.',
    humanPerceptionEn: 'Humans see blinding surface water glare; transparent glass shrimp and jellyfish are completely invisible.',
    animalPerceptionVi: 'Mực nang nhìn thấy: Khử sạch ánh sáng lóa; cơ thể trong suốt của con mồi phát sáng tương phản rõ nét với các vân màu phân cực huỳnh quang.',
    animalPerceptionEn: 'Cuttlefish vision: All water glare is eliminated; transparent prey tissues glow with dramatic high-contrast polarization stripes.',
    evolutionaryAdvantageVi: 'Phát hiện con mồi ngụy trang tàng hình trong làn nước sâu và giao tiếp bí mật với đồng loại bằng hoa văn da phân cực.',
    evolutionaryAdvantageEn: 'Reveals transparent prey and reads secret polarization signals rippling across mates’ skin undetected by fish predators.',
    filterMode: 'polarized',
  },
];

export const VisionPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isEn = i18n.language === 'en';

  // Active scene
  const [selectedSceneId, setSelectedSceneId] = useState<string>('tiger_camouflage');

  // Interactive Split Slider (0 = All Human, 100 = All Animal Vision)
  const [sliderPosition, setSliderPosition] = useState<number>(50);

  // Wavelength Slider (nm)
  const [currentWavelength, setCurrentWavelength] = useState<number>(550);

  const activeScene = useMemo(() => {
    return VISION_SCENES.find((s) => s.id === selectedSceneId) || VISION_SCENES[0];
  }, [selectedSceneId]);

  return (
    <div className="min-h-screen bg-expedition-dark text-stone-100 font-sans pb-24 selection:bg-natgeo-yellow selection:text-black">
      {/* Top Operations Header Bar */}
      <div className="bg-black/60 border-b border-natgeo-yellow/20 backdrop-blur-md sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-natgeo-yellow/20 border border-natgeo-yellow flex items-center justify-center text-natgeo-yellow">
              <Eye className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-natgeo-yellow">
                  {isEn ? 'ANIMAL SENSORY OPTICS & SIGHT SIMULATOR' : 'PHÒNG THÍ NGHIỆM THỊ GIÁC & GIÁC QUAN ĐỘNG VẬT'}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 font-mono">
                  MULTISPECTRAL SENSORS
                </span>
              </div>
              <div className="text-[11px] font-mono text-stone-400">
                {isEn ? 'Thermal FLIR, Ultraviolet, Dichromatic, Telescopic & Night Optics' : 'Kính tầm nhiệt, tia cực tím UV, thị giác nhị sắc hổ, kính nhìn đêm & phân cực'}
              </div>
            </div>
          </div>

          {/* Quick Scene Tabs Strip */}
          <div className="flex items-center gap-1 bg-expedition-canvas p-1 rounded-xl border border-white/10 text-xs font-mono overflow-x-auto max-w-full">
            {VISION_SCENES.map((scene) => (
              <button
                key={scene.id}
                onClick={() => setSelectedSceneId(scene.id)}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  selectedSceneId === scene.id
                    ? 'bg-natgeo-yellow text-stone-950 shadow-natgeo'
                    : 'text-stone-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{scene.icon}</span>
                <span>{isEn ? scene.animalEn.split(' ')[0] : scene.animalVi.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Mission Briefing Header */}
        <div className="p-6 sm:p-8 rounded-3xl field-panel border border-natgeo-yellow/30 relative overflow-hidden shadow-2xl">
          <div className="space-y-2 max-w-3xl relative z-10">
            <div className="flex items-center gap-2 text-xs font-mono text-natgeo-yellow uppercase tracking-widest">
              <Scan className="w-3.5 h-3.5 text-natgeo-yellow" />
              <span>{isEn ? 'BEYOND THE HUMAN VISIBLE SPECTRUM' : 'VƯỢT RA NGOÀI QUANG PHỔ THỊ GIÁC CON NGƯỜI'}</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
              {isEn ? 'How Animals Truly See The World' : 'Thế Giới Qua Đôi Mắt Các Loài Động Vật'}
            </h1>
            <p className="text-sm text-stone-300 leading-relaxed font-sans">
              {isEn
                ? 'Human vision is trapped in a narrow slice of wavelengths between 380 and 700 nm. Use the interactive comparison slider below to experience how snakes hunt using heat, why deer cannot see the orange coat of a stalking tiger, and how bees follow glowing ultraviolet runways on flowers.'
                : 'Mắt con người chỉ cảm nhận được một dải sóng hẹp từ 380 đến 700 nm. Hãy kéo thanh trượt so sánh phân đôi bên dưới để trải nghiệm cách loài rắn săn mồi bằng cảm biến nhiệt, lý do tại sao hươu không nhìn thấy màu cam của hổ, và cách ong lần theo những đường bay tia cực tím trên cánh hoa.'}
            </p>
          </div>
        </div>

        {/* MAIN INTERACTIVE SENSORY VIEWPORT (SPLIT SCREEN COMPARISON SLIDER) */}
        <div className="rounded-3xl field-panel border-2 border-natgeo-yellow/40 shadow-2xl p-4 sm:p-6 space-y-6 relative overflow-hidden">
          {/* Header of Viewport */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-natgeo-yellow/20">
            <div>
              <div className="flex items-center gap-2">
                <span className="field-stamp field-stamp-success text-xs">
                  {activeScene.wavelengthRange}
                </span>
                <span className="text-xs font-mono text-natgeo-yellow font-bold uppercase">
                  FOV: {activeScene.fieldOfView}
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white uppercase mt-1">
                {isEn ? activeScene.titleEn : activeScene.titleVi}
              </h2>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-stone-300">
                {isEn ? 'Slider: ' : 'Vị trí phân đôi: '}<strong className="text-natgeo-yellow">{sliderPosition}%</strong>
              </span>
            </div>
          </div>

          {/* Interactive Visual Comparison Screen */}
          <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-2xl bg-stone-950 border border-white/10 overflow-hidden shadow-inner select-none">
            {/* Viewfinder reticles */}
            <div className="viewfinder-corner-tl" />
            <div className="viewfinder-corner-tr" />
            <div className="viewfinder-corner-bl" />
            <div className="viewfinder-corner-br" />

            {/* Left Layer: Human Vision (Baseline) */}
            <div
              className="absolute inset-0 overflow-hidden flex items-center justify-center"
              style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
            >
              {/* Human Simulated Landscape Canvas */}
              <div className="w-full h-full relative flex items-center justify-center bg-gradient-to-br from-emerald-900 via-stone-900 to-amber-950">
                {/* Scene Content Based on Active Preset */}
                {activeScene.filterMode === 'dichromatic' && (
                  <div className="relative w-full h-full flex items-center justify-center">
                    {/* Lush Green Forest Backdrop */}
                    <div className="absolute inset-0 bg-[radial-gradient(#15803d_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
                    {/* Tiger: Bright Orange with Black Stripes */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-48 h-32 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 border-4 border-amber-400 shadow-2xl flex items-center justify-center p-4 relative overflow-hidden">
                        {/* Black stripes */}
                        <div className="absolute inset-0 opacity-80 flex justify-around">
                          <div className="w-3 h-full bg-black skew-x-12" />
                          <div className="w-4 h-full bg-black -skew-x-12" />
                          <div className="w-3 h-full bg-black skew-x-6" />
                          <div className="w-4 h-full bg-black -skew-x-6" />
                        </div>
                        <span className="text-4xl relative z-10">🐅</span>
                      </div>
                      <div className="mt-3 px-3 py-1 rounded-full bg-black/70 border border-orange-500 text-orange-400 text-xs font-mono font-bold">
                        {isEn ? 'VIBRANT ORANGE COAT (HUMAN SIGHT)' : 'LÔNG CAM RỰC RỠ (MẮT NGƯỜI NHÌN THẤY)'}
                      </div>
                    </div>
                  </div>
                )}

                {activeScene.filterMode === 'thermal' && (
                  <div className="relative w-full h-full flex items-center justify-center bg-black">
                    {/* Dark Cold Midnight */}
                    <div className="text-center space-y-2 opacity-40">
                      <div className="w-16 h-12 rounded-full bg-stone-800 mx-auto" />
                      <div className="text-stone-500 text-xs font-mono">
                        {isEn ? 'Pitch Black Night (Human Eyes See Nothing)' : 'Đêm Tối Đen Kịt (Mắt Người Không Thấy Gì)'}
                      </div>
                    </div>
                  </div>
                )}

                {activeScene.filterMode === 'ultraviolet' && (
                  <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-900 to-emerald-950">
                    <div className="text-center space-y-2">
                      <div className="w-36 h-36 rounded-full bg-yellow-400 border-8 border-yellow-500 shadow-xl flex items-center justify-center mx-auto">
                        <span className="text-4xl">🌻</span>
                      </div>
                      <div className="text-yellow-400 text-xs font-mono font-bold">
                        {isEn ? 'Plain Uniform Yellow Flower' : 'Hoa Vàng Đơn Điệu (Mắt Người)'}
                      </div>
                    </div>
                  </div>
                )}

                {activeScene.filterMode === 'telescopic' && (
                  <div className="relative w-full h-full flex items-center justify-center bg-stone-900">
                    <div className="text-center space-y-2">
                      <div className="w-4 h-4 rounded-full bg-stone-500 mx-auto" />
                      <div className="text-stone-400 text-xs font-mono">
                        {isEn ? '1x Normal Panorama: Prey is tiny blurred speck at 2km' : 'Góc nhìn 1x: Con thỏ chỉ là chấm mờ cách 2km'}
                      </div>
                    </div>
                  </div>
                )}

                {activeScene.filterMode === 'night_vision' && (
                  <div className="relative w-full h-full flex items-center justify-center bg-stone-950">
                    <div className="text-center space-y-2 opacity-30">
                      <span className="text-6xl">🌑</span>
                      <div className="text-stone-400 text-xs font-mono">
                        {isEn ? 'Starlight 0.01 Lux: Murky Dark Silhouette' : 'Ánh Trăng Mờ 0.01 Lux: Tối Mịt Nhạt Nhòa'}
                      </div>
                    </div>
                  </div>
                )}

                {activeScene.filterMode === 'polarized' && (
                  <div className="relative w-full h-full flex items-center justify-center bg-cyan-950/80">
                    <div className="text-center space-y-2 opacity-60">
                      <div className="w-32 h-16 rounded-full bg-cyan-700/40 border border-cyan-400/20 mx-auto flex items-center justify-center">
                        <span className="text-3xl opacity-30">🦐</span>
                      </div>
                      <div className="text-cyan-300 text-xs font-mono">
                        {isEn ? 'Water Glare Haze: Transparent prey is invisible' : 'Lóa Nước Biển: Con mồi trong suốt hòa lẫn vào nước'}
                      </div>
                    </div>
                  </div>
                )}

                {/* Left Label Stamp */}
                <div className="absolute top-4 left-4 field-stamp field-stamp-success text-xs font-mono">
                  👁️ {isEn ? 'HUMAN SIGHT (TRICHROMAT)' : 'MẮT CON NGƯỜI (TAM SẮC)'}
                </div>
              </div>
            </div>

            {/* Right Layer: Animal Sensory Vision */}
            <div
              className="absolute inset-0 overflow-hidden flex items-center justify-center"
              style={{ clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)` }}
            >
              {/* Animal Simulated Sensory Canvas */}
              <div className="w-full h-full relative flex items-center justify-center">
                {/* 1. Dichromatic Filter (Deer Vision) */}
                {activeScene.filterMode === 'dichromatic' && (
                  <div className="w-full h-full relative flex items-center justify-center bg-gradient-to-br from-stone-800 via-stone-900 to-emerald-950/90 filter saturate-50">
                    <div className="relative z-10 flex flex-col items-center">
                      {/* Tiger turns into camouflage dull muted grayish-green */}
                      <div className="w-48 h-32 rounded-3xl bg-gradient-to-r from-stone-700 via-stone-600 to-emerald-900 border-4 border-stone-600 shadow-none flex items-center justify-center p-4 relative overflow-hidden">
                        {/* Faded stripes */}
                        <div className="absolute inset-0 opacity-40 flex justify-around">
                          <div className="w-3 h-full bg-stone-950 skew-x-12" />
                          <div className="w-4 h-full bg-stone-950 -skew-x-12" />
                          <div className="w-3 h-full bg-stone-950 skew-x-6" />
                          <div className="w-4 h-full bg-stone-950 -skew-x-6" />
                        </div>
                        <span className="text-4xl relative z-10 opacity-70">🐅</span>
                      </div>
                      <div className="mt-3 px-3 py-1 rounded-full bg-black/80 border border-emerald-500 text-emerald-400 text-xs font-mono font-bold animate-pulse">
                        {isEn ? 'MUTED GREEN-BROWN: 100% INVISIBLE TO PREY!' : 'MÀU NÂU-XANH CỎ: TÀNG HÌNH 100% TRƯỚC MẮT HƯƠU!'}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Thermal FLIR Infrared Filter (Snake Vision) */}
                {activeScene.filterMode === 'thermal' && (
                  <div className="w-full h-full relative flex items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-950 to-blue-950">
                    {/* Glowing heat signature of prey */}
                    <div className="relative z-10 flex flex-col items-center animate-pulse">
                      <div className="w-36 h-28 rounded-full bg-gradient-to-r from-yellow-300 via-rose-500 to-white shadow-[0_0_80px_rgba(239,68,68,0.9)] flex items-center justify-center border-4 border-amber-300">
                        <span className="text-4xl text-black">🐀</span>
                      </div>
                      <div className="mt-3 px-3 py-1 rounded-full bg-black/90 border border-rose-500 text-rose-400 text-xs font-mono font-bold">
                        37.4°C {isEn ? 'THERMAL INFRARED TARGET LOCKED' : 'BỨC XẠ THÂN NHIỆT KHÓA MỤC TIÊU'}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Ultraviolet Filter (Bee Vision) */}
                {activeScene.filterMode === 'ultraviolet' && (
                  <div className="w-full h-full relative flex items-center justify-center bg-gradient-to-br from-violet-950 via-fuchsia-950 to-indigo-950">
                    {/* UV Bullseye Nectar Guide */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-44 h-44 rounded-full bg-gradient-to-r from-fuchsia-600 via-violet-700 to-cyan-400 shadow-[0_0_60px_rgba(192,132,252,0.8)] border-4 border-cyan-300 flex items-center justify-center relative">
                        {/* Concentric UV concentric rings */}
                        <div className="w-24 h-24 rounded-full border-4 border-dashed border-white animate-spin-slow flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-white animate-ping" />
                        </div>
                      </div>
                      <div className="mt-3 px-3 py-1 rounded-full bg-black/80 border border-fuchsia-400 text-fuchsia-300 text-xs font-mono font-bold">
                        {isEn ? 'UV NECTAR RUNWAY GLOWING AT 350 NM' : 'ĐƯỜNG DẪN MẬT HOA PHÁT QUANG TIA CỰC TÍM 350 NM'}
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Telescopic Zoom 8x Filter (Eagle Vision) */}
                {activeScene.filterMode === 'telescopic' && (
                  <div className="w-full h-full relative flex items-center justify-center bg-stone-950 overflow-hidden">
                    {/* Reticle reticle circular zoom scope */}
                    <div className="w-64 h-64 rounded-full border-4 border-natgeo-yellow shadow-[0_0_80px_rgba(245,184,0,0.4)] flex items-center justify-center relative bg-gradient-to-br from-stone-800 to-stone-900">
                      {/* Reticle Crosshairs */}
                      <div className="absolute inset-x-0 h-[1px] bg-natgeo-yellow/60" />
                      <div className="absolute inset-y-0 w-[1px] bg-natgeo-yellow/60" />
                      <div className="w-48 h-48 rounded-full border border-dashed border-natgeo-yellow/40 flex items-center justify-center">
                        <span className="text-6xl animate-bounce">🐇</span>
                      </div>
                    </div>
                    <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-black/80 border border-natgeo-yellow text-natgeo-yellow text-xs font-mono font-bold">
                      {isEn ? '8X OPTICAL DUAL-FOVEA ZOOM (RANGE: 2,400 M)' : 'PHÓNG ĐẠI QUANG HỌC 8X (CỰ LY 2.400 M)'}
                    </div>
                  </div>
                )}

                {/* 5. Phosphor Night Vision (Feline Tapetum Lucidum) */}
                {activeScene.filterMode === 'night_vision' && (
                  <div className="w-full h-full relative flex items-center justify-center bg-[#052e16] border-2 border-emerald-500 shadow-inner">
                    {/* Scanlines & Grain */}
                    <div className="absolute inset-0 bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:8px_8px] opacity-25" />
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-48 h-32 rounded-3xl bg-emerald-950/80 border-2 border-emerald-400 p-4 flex items-center justify-center relative">
                        {/* Glowing Eyeshine */}
                        <div className="flex gap-12">
                          <div className="w-4 h-4 rounded-full bg-emerald-300 shadow-[0_0_20px_#4ade80] animate-pulse" />
                          <div className="w-4 h-4 rounded-full bg-emerald-300 shadow-[0_0_20px_#4ade80] animate-pulse" />
                        </div>
                      </div>
                      <div className="mt-3 px-3 py-1 rounded-full bg-black/90 border border-emerald-400 text-emerald-400 text-xs font-mono font-bold">
                        {isEn ? '8X TAPETUM LUCIDUM LIGHT GAIN + EYESHINE' : 'KHUẾCH ĐẠI SÁNG 8X + PHẢN QUANG MẮT THÚ'}
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. Polarized Marine Light Filter (Cephalopod Vision) */}
                {activeScene.filterMode === 'polarized' && (
                  <div className="w-full h-full relative flex items-center justify-center bg-gradient-to-br from-cyan-900 to-indigo-950">
                    <div className="relative z-10 flex flex-col items-center">
                      {/* Transparent prey glows with high-contrast rainbow fringes */}
                      <div className="w-48 h-24 rounded-full bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-yellow-300 border-2 border-cyan-200 shadow-[0_0_50px_rgba(34,211,238,0.7)] flex items-center justify-center p-3 animate-pulse">
                        <span className="text-4xl">🦐</span>
                      </div>
                      <div className="mt-3 px-3 py-1 rounded-full bg-black/90 border border-cyan-400 text-cyan-300 text-xs font-mono font-bold">
                        {isEn ? 'E-VECTOR POLARIZATION: WATER GLARE CUT 100%' : 'GÓC PHÂN CỰC E-VECTOR: KHỬ SẠCH ÁNH SÁNG LÓA'}
                      </div>
                    </div>
                  </div>
                )}

                {/* Right Label Stamp */}
                <div className="absolute top-4 right-4 field-stamp field-stamp-danger text-xs font-mono">
                  {activeScene.icon} {isEn ? `${activeScene.animalEn.toUpperCase()} SIGHT` : `THỊ GIÁC ${activeScene.animalVi.toUpperCase()}`}
                </div>
              </div>
            </div>

            {/* Draggable Split Screen Divider Handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-natgeo-yellow shadow-[0_0_15px_#f5b800] z-20 pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-natgeo-yellow text-stone-950 flex items-center justify-center shadow-2xl font-bold text-xs pointer-events-auto cursor-ew-resize">
                ⇄
              </div>
            </div>

            {/* Hidden HTML Range Input for Dragging */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              className="absolute inset-0 opacity-0 cursor-ew-resize z-30 w-full h-full"
            />
          </div>

          {/* Slider Instruction Bar */}
          <div className="flex items-center justify-between text-xs font-mono text-stone-400 px-2">
            <span>⇦ {isEn ? 'Drag left: Reveal Animal Sensory Vision' : 'Kéo sang trái: Xem Giác quan Động vật'}</span>
            <span className="text-natgeo-yellow font-bold">{isEn ? 'SLIDE TO COMPARE SENSORY WORLDS' : 'KÉO QUA LẠI ĐỂ SO SÁNH GIÁC QUAN'}</span>
            <span>{isEn ? 'Drag right: Reveal Human Sight' : 'Kéo sang phải: Xem Mắt Người'} ⇨</span>
          </div>
        </div>

        {/* COMPARATIVE BIOLOGICAL MECHANISM & EVOLUTIONARY ANALYSIS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Biological Mechanism & Retinal Architecture (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 rounded-3xl field-panel border border-natgeo-yellow/30 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-natgeo-yellow/20">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-natgeo-yellow uppercase">
                  <Glasses className="w-4 h-4" />
                  <span>{isEn ? 'RETINAL OPTOELECTRONICS & RECEPTORS' : 'QUANG SINH HỌC & TẾ BÀO THỤ CẢM VÕNG MẠC'}</span>
                </div>
                <span className="field-stamp field-stamp-success text-[10px]">GBIF-{activeScene.speciesSlug}</span>
              </div>

              {/* Photoreceptor Spec */}
              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-1.5">
                <div className="text-[11px] font-mono text-natgeo-yellow uppercase font-bold">
                  {isEn ? 'Photoreceptor Opsins & Sensors:' : 'Tế Bào Thụ Cảm & Cảm Biến Sinh Học:'}
                </div>
                <div className="text-sm font-bold text-white font-sans">
                  {isEn ? activeScene.photoreceptorsEn : activeScene.photoreceptorsVi}
                </div>
              </div>

              {/* Biological Mechanism Description */}
              <div className="space-y-2">
                <div className="text-xs font-mono font-bold uppercase text-stone-200">
                  {isEn ? 'How The Optical Mechanism Works:' : 'Cơ Chế Quang Học Hoạt Động Như Thế Nào:'}
                </div>
                <p className="text-sm text-stone-300 font-sans leading-relaxed">
                  {isEn ? activeScene.biologicalMechanismEn : activeScene.biologicalMechanismVi}
                </p>
              </div>

              {/* Evolutionary Advantage */}
              <div className="p-4 rounded-2xl bg-natgeo-yellow/10 border border-natgeo-yellow/30 space-y-1.5">
                <div className="text-[11px] font-mono text-natgeo-yellow uppercase font-bold flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Adaptive Evolutionary Advantage:' : 'Ưu Thế Tiến Hóa Sinh Tồn:'}</span>
                </div>
                <p className="text-xs text-stone-200 font-sans leading-relaxed">
                  {isEn ? activeScene.evolutionaryAdvantageEn : activeScene.evolutionaryAdvantageVi}
                </p>
              </div>

              {/* Action Button to Full 3D Model */}
              <Link
                to={`/species/${activeScene.speciesSlug}`}
                className="w-full py-3 rounded-2xl bg-natgeo-yellow text-stone-950 font-mono font-bold text-xs uppercase tracking-wider shadow-natgeo hover:bg-amber-400 transition-all flex items-center justify-center gap-2"
              >
                <span>{isEn ? 'Inspect Animal in 3D Anatomy Lab' : 'Khảo Sát Giải Phẫu 3D Của Loài Này'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Electromagnetic Spectrum Tuner & Anatomical Secrets (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Wavelength Spectrum Tuner */}
            <div className="p-6 rounded-3xl field-panel border border-natgeo-yellow/30 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-natgeo-yellow uppercase">
                <Sliders className="w-4 h-4" />
                <span>{isEn ? 'ELECTROMAGNETIC SPECTRUM TUNER' : 'MÁY DÒ BƯỚC SÓNG ĐIỆN TỪ'}</span>
              </div>

              <div className="space-y-3 p-4 rounded-2xl bg-black/60 border border-white/10">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-stone-400">{isEn ? 'Current Wavelength:' : 'Bước Sóng Đang Chọn:'}</span>
                  <span className="text-natgeo-yellow font-bold text-sm">{currentWavelength} nm</span>
                </div>

                {/* Spectrum Color Bar */}
                <div className="h-4 w-full rounded-full bg-gradient-to-r from-purple-600 via-blue-500 via-green-500 via-yellow-400 to-red-600 shadow-inner" />

                <input
                  type="range"
                  min="300"
                  max="1000"
                  value={currentWavelength}
                  onChange={(e) => setCurrentWavelength(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />

                <div className="flex justify-between text-[10px] font-mono text-stone-400 pt-1">
                  <span>300nm (UV)</span>
                  <span>550nm (Lục)</span>
                  <span>700nm (Đỏ)</span>
                  <span>1.000nm+ (IR)</span>
                </div>
              </div>

              {/* Spectrum Verdict */}
              <div className="text-xs text-stone-300 font-sans p-3 rounded-xl bg-white/[0.02] border border-white/5">
                {currentWavelength < 380 && (
                  <span className="text-purple-300">
                    🟣 <strong>Tia Cực Tím (UV):</strong> Mắt người mù hoàn toàn; mắt Ong Mật & Chim phát hiện các đường dẫn mật hoa rực rỡ.
                  </span>
                )}
                {currentWavelength >= 380 && currentWavelength <= 700 && (
                  <span className="text-emerald-300">
                    🟢 <strong>Ánh Sáng Khả Kiến:</strong> Dải quang phổ con người nhìn thấy; hươu và thú săn mồi chỉ nhận biết được xanh lam và xanh lục.
                  </span>
                )}
                {currentWavelength > 700 && (
                  <span className="text-rose-300">
                    🔴 <strong>Hồng Ngoại Nhiệt (Infrared):</strong> Mắt người chỉ cảm thấy nóng; hố nhiệt của Rắn chuyển thành hình ảnh nhiệt 3D sắc nét.
                  </span>
                )}
              </div>
            </div>

            {/* Quick Anatomical Wonders Cards */}
            <div className="p-6 rounded-3xl bg-black/70 border border-natgeo-yellow/30 space-y-4">
              <div className="text-xs font-mono font-bold text-natgeo-yellow uppercase flex items-center gap-2">
                <Zap className="w-3.5 h-3.5" />
                <span>{isEn ? 'OPTICAL ADAPTATIONS CHEAT SHEET' : 'BẢNG KỲ QUAN GIẢI PHẪU THỊ GIÁC'}</span>
              </div>

              <div className="space-y-3 text-xs font-sans">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                  <div className="font-bold text-white flex items-center gap-1.5 font-mono">
                    <span>🪞</span>
                    <span>Tapetum Lucidum (Màng Gương)</span>
                  </div>
                  <p className="text-stone-300 text-[11px]">
                    Lớp tế bào gương phản chiếu ánh sáng lần thứ hai ở mèo rừng, cú và cá mập giúp nhìn rõ trong đêm tối.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                  <div className="font-bold text-white flex items-center gap-1.5 font-mono">
                    <span>👁️</span>
                    <span>Dual Fovea (Hai Hố Thị Giác)</span>
                  </div>
                  <p className="text-stone-300 text-[11px]">
                    Đại bàng và chim ưng sở hữu 2 hố thị giác độc lập trên mỗi mắt: vừa bao quát toàn cảnh, vừa zoom viễn vọng 8x cực nét.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                  <div className="font-bold text-white flex items-center gap-1.5 font-mono">
                    <span>🌡️</span>
                    <span>Loreal Pit Organ (Hố Nhiệt)</span>
                  </div>
                  <p className="text-stone-300 text-[11px]">
                    Màng tế bào chứa kênh TRPA1 giúp rắn phát hiện bức xạ nhiệt từ khoảng cách 1 mét với độ nhạy 0.003°C.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
