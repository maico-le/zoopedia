import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Network,
  Play,
  Pause,
  RotateCcw,
  AlertTriangle,
  Leaf,
  Activity,
  Compass,
  ArrowRight,
  ShieldAlert,
  Flame,
  CheckCircle2,
  Sliders,
  Radio
} from 'lucide-react';

interface FoodWebNode {
  id: string;
  nameVi: string;
  nameEn: string;
  scientific: string;
  trophicLevel: 1 | 2 | 3 | 4; // 1: Producer, 2: Herbivore, 3: Mesopredator, 4: Apex
  tierLevelLabel: { vi: string; en: string };
  icon: string;
  biomassKcal: number;
  eats: string[]; // IDs of nodes this organism consumes
  speciesSlug?: string;
  thumbnail?: string;
}

interface BiomeEcosystem {
  id: 'rainforest' | 'savanna' | 'marine' | 'arctic';
  titleVi: string;
  titleEn: string;
  subtitleVi: string;
  subtitleEn: string;
  shannonIndex: number;
  resilienceRating: string;
  nodes: FoodWebNode[];
}

const ECOSYSTEM_DATA: Record<string, BiomeEcosystem> = {
  rainforest: {
    id: 'rainforest',
    titleVi: 'Rừng Mưa Nhiệt Đới Dãy Trường Sơn & Đông Nam Á',
    titleEn: 'Annamite & Southeast Asian Tropical Rainforest',
    subtitleVi: 'Hệ sinh thái đa tầng tán giàu đa dạng sinh học bậc nhất thế giới với chuỗi thức ăn phức hợp.',
    subtitleEn: 'High-biodiversity multi-tiered canopy ecosystem featuring complex trophic interdependencies.',
    shannonIndex: 4.38,
    resilienceRating: 'Cao (High)',
    nodes: [
      // Level 4: Apex Predators
      {
        id: 'tiger',
        nameVi: 'Hổ Đông Dương',
        nameEn: 'Indochinese Tiger',
        scientific: 'Panthera tigris',
        trophicLevel: 4,
        tierLevelLabel: { vi: 'Thú Săn Mồi Đỉnh Cao', en: 'Apex Predator' },
        icon: '🐅',
        biomassKcal: 250000,
        eats: ['gaur', 'boar', 'saola', 'douc'],
        speciesSlug: 'panthera-tigris',
      },
      {
        id: 'python',
        nameVi: 'Trăn gấm',
        nameEn: 'Reticulated Python',
        scientific: 'Malayopython reticulatus',
        trophicLevel: 4,
        tierLevelLabel: { vi: 'Kẻ Săn Mồi Phục Kích', en: 'Apex Ambush Predator' },
        icon: '🐍',
        biomassKcal: 120000,
        eats: ['douc', 'boar', 'civet'],
        speciesSlug: 'malayopython-reticulatus',
      },

      // Level 3: Mesopredators
      {
        id: 'dhole',
        nameVi: 'Sói đỏ',
        nameEn: 'Dhole',
        scientific: 'Cuon alpinus',
        trophicLevel: 3,
        tierLevelLabel: { vi: 'Thú Săn Mồi Bầy Đàn', en: 'Pack Mesopredator' },
        icon: '🐺',
        biomassKcal: 60000,
        eats: ['boar', 'saola'],
        speciesSlug: 'cuon-alpinus',
      },
      {
        id: 'civet',
        nameVi: 'Cầy vòi hương',
        nameEn: 'Asian Palm Civet',
        scientific: 'Paradoxurus hermaphroditus',
        trophicLevel: 3,
        tierLevelLabel: { vi: 'Thú Ăn Tạp Tầng Tán', en: 'Arboreal Omnivore' },
        icon: '🦡',
        biomassKcal: 15000,
        eats: ['fruit', 'insects'],
        speciesSlug: 'paradoxurus-hermaphroditus',
      },

      // Level 2: Primary Consumers / Herbivores
      {
        id: 'gaur',
        nameVi: 'Bò tót',
        nameEn: 'Gaur',
        scientific: 'Bos gaurus',
        trophicLevel: 2,
        tierLevelLabel: { vi: 'Thú Ăn Cỏ Khổng Lồ', en: 'Megaherbivore' },
        icon: '🐂',
        biomassKcal: 1200000,
        eats: ['grass', 'bamboo'],
        speciesSlug: 'bos-gaurus',
      },
      {
        id: 'saola',
        nameVi: 'Sao la',
        nameEn: 'Saola',
        scientific: 'Pseudoryx nghetinhensis',
        trophicLevel: 2,
        tierLevelLabel: { vi: 'Thú Móng Guốc Đặc Hữu', en: 'Endemic Herbivore' },
        icon: '🦌',
        biomassKcal: 90000,
        eats: ['leaf', 'fruit'],
        speciesSlug: 'pseudoryx-nghetinhensis',
      },
      {
        id: 'douc',
        nameVi: 'Voọc chà vá chân nâu',
        nameEn: 'Red-shanked Douc',
        scientific: 'Pygathrix nemaeus',
        trophicLevel: 2,
        tierLevelLabel: { vi: 'Linh Trưởng Ăn Lá', en: 'Canopy Folivore' },
        icon: '🐒',
        biomassKcal: 25000,
        eats: ['leaf', 'fruit'],
        speciesSlug: 'pygathrix-nemaeus',
      },
      {
        id: 'boar',
        nameVi: 'Lợn rừng',
        nameEn: 'Wild Boar',
        scientific: 'Sus scrofa',
        trophicLevel: 2,
        tierLevelLabel: { vi: 'Động Vật Đào Bới Rừng', en: 'Forest Forager' },
        icon: '🐗',
        biomassKcal: 150000,
        eats: ['fruit', 'leaf', 'insects'],
      },

      // Level 1: Primary Producers
      {
        id: 'bamboo',
        nameVi: 'Rừng nứa & Tre gai Trường Sơn',
        nameEn: 'Bamboo & Karst Flora',
        scientific: 'Bambusoideae',
        trophicLevel: 1,
        tierLevelLabel: { vi: 'Sinh Vật Sản Xuất Thô', en: 'Primary Producer' },
        icon: '🎋',
        biomassKcal: 8500000,
        eats: [],
      },
      {
        id: 'fruit',
        nameVi: 'Cây Quả Sung Đa Cổ Thụ',
        nameEn: 'Strangler Fig & Forest Fruits',
        scientific: 'Ficus & Dipterocarps',
        trophicLevel: 1,
        tierLevelLabel: { vi: 'Nguồn Năng Lượng Tán Rừng', en: 'Canopy Keystone Producer' },
        icon: '🌳',
        biomassKcal: 12000000,
        eats: [],
      },
      {
        id: 'grass',
        nameVi: 'Thảm Cỏ Rừng Khộp Nhiệt Đới',
        nameEn: 'Tropical Understory Grasses',
        scientific: 'Poaceae',
        trophicLevel: 1,
        tierLevelLabel: { vi: 'Thảm Thực Vật Đáy Rừng', en: 'Herbaceous Producer' },
        icon: '🌿',
        biomassKcal: 9500000,
        eats: [],
      },
    ],
  },
  savanna: {
    id: 'savanna',
    titleVi: 'Thảo Nguyên Xavan Đông & Nam Phi (Serengeti)',
    titleEn: 'Serengeti & East African Savanna',
    subtitleVi: 'Thảo nguyên đồng bằng rộng lớn với cuộc đại di cư của hàng triệu động vật móng guốc.',
    subtitleEn: 'Expansive savanna plains driven by the colossal annual migration of ungulate herds.',
    shannonIndex: 3.92,
    resilienceRating: 'Trung Bình - Cao (Mod-High)',
    nodes: [
      {
        id: 'lion',
        nameVi: 'Sư tử châu Phi',
        nameEn: 'African Lion',
        scientific: 'Panthera leo',
        trophicLevel: 4,
        tierLevelLabel: { vi: 'Chúa Tể Thảo Nguyên', en: 'Apex Pack Hunter' },
        icon: '🦁',
        biomassKcal: 220000,
        eats: ['zebra', 'buffalo', 'rhino_calf'],
        speciesSlug: 'panthera-leo',
      },
      {
        id: 'cheetah',
        nameVi: 'Báo săn (Cheetah)',
        nameEn: 'Cheetah',
        scientific: 'Acinonyx jubatus',
        trophicLevel: 4,
        tierLevelLabel: { vi: 'Kẻ Săn Tốc Độ Đỉnh Cao', en: 'High-Speed Cursor' },
        icon: '🐆',
        biomassKcal: 65000,
        eats: ['gazelle', 'hare'],
        speciesSlug: 'acinonyx-jubatus',
      },
      {
        id: 'meerkat',
        nameVi: 'Chồn Meerkat',
        nameEn: 'Meerkat',
        scientific: 'Suricata suricatta',
        trophicLevel: 3,
        tierLevelLabel: { vi: 'Lính Canh Ăn Côn Trùng', en: 'Insectivorous Sentry' },
        icon: '🦡',
        biomassKcal: 3500,
        eats: ['scorpions', 'insects'],
        speciesSlug: 'suricata-suricatta',
      },
      {
        id: 'zebra',
        nameVi: 'Ngựa vằn',
        nameEn: 'Plains Zebra',
        scientific: 'Equus quagga',
        trophicLevel: 2,
        tierLevelLabel: { vi: 'Động Vật Di Cư Bầy Đàn', en: 'Migratory Grazer' },
        icon: '🦓',
        biomassKcal: 380000,
        eats: ['savanna_grass'],
        speciesSlug: 'equus-quagga',
      },
      {
        id: 'white_rhino',
        nameVi: 'Tê giác trắng',
        nameEn: 'White Rhinoceros',
        scientific: 'Ceratotherium simum',
        trophicLevel: 2,
        tierLevelLabel: { vi: 'Thú Gặm Cỏ Môi Vuông', en: 'Square-lipped Megaherbivore' },
        icon: '🦏',
        biomassKcal: 1800000,
        eats: ['savanna_grass'],
        speciesSlug: 'ceratotherium-simum',
      },
      {
        id: 'savanna_grass',
        nameVi: 'Thảm Cỏ Xavan Serengeti',
        nameEn: 'Red Oat & Savanna Grasses',
        scientific: 'Themeda triandra',
        trophicLevel: 1,
        tierLevelLabel: { vi: 'Sinh Vật Sản Xuất Thảo Nguyên', en: 'Savanna Grassland Producer' },
        icon: '🌾',
        biomassKcal: 25000000,
        eats: [],
      },
    ],
  },
  marine: {
    id: 'marine',
    titleVi: 'Đại Dương & Rạn San Hô Ấn Độ Dương - Thái Bình Dương',
    titleEn: 'Indo-Pacific Coral Reef & Pelagic Abyss',
    subtitleVi: 'Chuỗi thức ăn thủy sinh phức hợp kết nối rạn san hô ven bờ đến tầng biển sâu.',
    subtitleEn: 'Intricate pelagic-to-benthic marine web sustaining rich trophic cascades.',
    shannonIndex: 4.65,
    resilienceRating: 'Dễ Bị Tổn Thương (Vulnerable)',
    nodes: [
      {
        id: 'great_white',
        nameVi: 'Cá mập trắng lớn',
        nameEn: 'Great White Shark',
        scientific: 'Carcharodon carcharias',
        trophicLevel: 4,
        tierLevelLabel: { vi: 'Chúa Tể Đại Dương', en: 'Marine Apex Predator' },
        icon: '🦈',
        biomassKcal: 850000,
        eats: ['tuna', 'sea_turtle'],
        speciesSlug: 'carcharodon-carcharias',
      },
      {
        id: 'hammerhead',
        nameVi: 'Cá mập đầu búa lớn',
        nameEn: 'Great Hammerhead',
        scientific: 'Sphyrna mokarran',
        trophicLevel: 4,
        tierLevelLabel: { vi: 'Thợ Săn Cảm Ứng Điện', en: 'Electro-Sensory Apex' },
        icon: '🦈',
        biomassKcal: 420000,
        eats: ['stingray', 'tuna'],
        speciesSlug: 'sphyrna-mokarran',
      },
      {
        id: 'tuna',
        nameVi: 'Cá ngừ vây xanh',
        nameEn: 'Atlantic Bluefin Tuna',
        scientific: 'Thunnus thynnus',
        trophicLevel: 3,
        tierLevelLabel: { vi: 'Thợ Săn Biển Khơi Tốc Độ', en: 'Pelagic Mesopredator' },
        icon: '🐟',
        biomassKcal: 250000,
        eats: ['clownfish', 'krill'],
        speciesSlug: 'thunnus-thynnus',
      },
      {
        id: 'mantis_shrimp',
        nameVi: 'Tôm tít công',
        nameEn: 'Peacock Mantis Shrimp',
        scientific: 'Odontodactylus scyllarus',
        trophicLevel: 3,
        tierLevelLabel: { vi: 'Thợ Săn Đấm Búa San Hô', en: 'Reef Benthic Hunter' },
        icon: '🦐',
        biomassKcal: 1200,
        eats: ['clams', 'crabs'],
        speciesSlug: 'odontodactylus-scyllarus',
      },
      {
        id: 'sea_turtle',
        nameVi: 'Rùa xanh',
        nameEn: 'Green Sea Turtle',
        scientific: 'Chelonia mydas',
        trophicLevel: 2,
        tierLevelLabel: { vi: 'Động Vật Ăn Cỏ Biển', en: 'Seagrass Grazer' },
        icon: '🐢',
        biomassKcal: 160000,
        eats: ['seagrass'],
        speciesSlug: 'chelonia-mydas',
      },
      {
        id: 'seagrass',
        nameVi: 'Thảm Cỏ Biển & Vi Tảo Phù Du',
        nameEn: 'Seagrass Meadows & Phytoplankton',
        scientific: 'Halophila & Plankton',
        trophicLevel: 1,
        tierLevelLabel: { vi: 'Nguồn Năng Lượng Đại Dương', en: 'Marine Primary Producer' },
        icon: '🌱',
        biomassKcal: 35000000,
        eats: [],
      },
    ],
  },
};

type ScenarioType = 'baseline' | 'extirpate_apex' | 'deforestation' | 'invasive_species';

export const EcosystemPage: React.FC = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language.startsWith('en') ? 'en' : 'vi';

  const [activeBiomeId, setActiveBiomeId] = useState<'rainforest' | 'savanna' | 'marine'>('rainforest');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('tiger');
  const [scenario, setScenario] = useState<ScenarioType>('baseline');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simYear, setSimYear] = useState<number>(0);

  // Lotka-Volterra Population State (Apex, Herbivores, Vegetation)
  const [apexPop, setApexPop] = useState<number>(100);
  const [herbPop, setHerbPop] = useState<number>(100);
  const [vegPop, setVegPop] = useState<number>(100);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const historyRef = useRef<{ year: number; apex: number; herb: number; veg: number }[]>([
    { year: 0, apex: 100, herb: 100, veg: 100 },
  ]);

  const activeBiome = ECOSYSTEM_DATA[activeBiomeId];

  // Selected node details
  const selectedNode = useMemo(() => {
    return activeBiome.nodes.find((n) => n.id === selectedNodeId) || activeBiome.nodes[0];
  }, [activeBiome, selectedNodeId]);

  // Predators that eat the selected node
  const predatorsOfSelected = useMemo(() => {
    return activeBiome.nodes.filter((n) => n.eats.includes(selectedNode.id));
  }, [activeBiome, selectedNode]);

  // Prey eaten by selected node
  const preyOfSelected = useMemo(() => {
    return activeBiome.nodes.filter((n) => selectedNode.eats.includes(n.id));
  }, [activeBiome, selectedNode]);

  // Reset simulation when scenario or biome changes
  const resetSimulation = (newScenario: ScenarioType = 'baseline') => {
    setScenario(newScenario);
    setSimYear(0);
    setIsSimulating(false);

    let initApex = 100;
    let initHerb = 100;
    let initVeg = 100;

    if (newScenario === 'extirpate_apex') {
      initApex = 0;
      initHerb = 130;
      initVeg = 80;
    } else if (newScenario === 'deforestation') {
      initApex = 60;
      initHerb = 50;
      initVeg = 25;
    } else if (newScenario === 'invasive_species') {
      initApex = 70;
      initHerb = 160;
      initVeg = 40;
    }

    setApexPop(initApex);
    setHerbPop(initHerb);
    setVegPop(initVeg);
    historyRef.current = [{ year: 0, apex: initApex, herb: initHerb, veg: initVeg }];
  };

  // Lotka-Volterra Simulation Step Engine
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setSimYear((prevYear) => {
        if (prevYear >= 20) {
          setIsSimulating(false);
          return prevYear;
        }

        const nextYear = prevYear + 1;

        setApexPop((prevApex) => {
          setHerbPop((prevHerb) => {
            setVegPop((prevVeg) => {
              let newApex = prevApex;
              let newHerb = prevHerb;
              let newVeg = prevVeg;

              if (scenario === 'baseline') {
                // Stable harmonic equilibrium
                newVeg = Math.max(70, Math.min(130, 100 + Math.sin(nextYear * 0.7) * 12));
                newHerb = Math.max(70, Math.min(130, 100 + Math.sin(nextYear * 0.7 - 0.8) * 15));
                newApex = Math.max(70, Math.min(130, 100 + Math.sin(nextYear * 0.7 - 1.6) * 12));
              } else if (scenario === 'extirpate_apex') {
                // Trophic cascade: No apex -> Herbivore explosion -> Overgrazing -> Total collapse
                newApex = 0;
                if (nextYear < 6) {
                  newHerb = prevHerb + 22; // Exponential boom
                  newVeg = Math.max(10, prevVeg - 18); // Devastated forest
                } else if (nextYear < 12) {
                  // Starvation crisis
                  newHerb = Math.max(15, prevHerb - 28);
                  newVeg = Math.max(5, prevVeg - 4);
                } else {
                  // Barren wasteland equilibrium
                  newHerb = Math.max(12, 18 + Math.sin(nextYear) * 5);
                  newVeg = Math.max(10, 15 + Math.cos(nextYear) * 3);
                }
              } else if (scenario === 'deforestation') {
                // Vegetation shock
                newVeg = Math.max(12, prevVeg * 0.88);
                newHerb = Math.max(10, prevHerb * 0.85);
                newApex = Math.max(5, prevApex * 0.82);
              } else if (scenario === 'invasive_species') {
                // Super competitive pressure
                newVeg = Math.max(15, prevVeg * 0.82);
                newHerb = Math.min(220, prevHerb + 14);
                newApex = Math.max(20, prevApex * 0.92);
              }

              // Record history for graph
              historyRef.current.push({
                year: nextYear,
                apex: Math.round(newApex),
                herb: Math.round(newHerb),
                veg: Math.round(newVeg),
              });

              return newVeg;
            });
            return prevHerb;
          });
          return prevApex;
        });

        return nextYear;
      });
    }, 700);

    return () => clearInterval(interval);
  }, [isSimulating, scenario]);

  // Render Real-time Population Dynamics Graph on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 35;
    const graphWidth = width - padding * 2;
    const graphHeight = height - padding * 2;

    ctx.clearRect(0, 0, width, height);

    // Canvas Field Background Grid
    ctx.fillStyle = '#0c0a09';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = 'rgba(234, 179, 8, 0.12)';
    ctx.lineWidth = 1;

    // Horizontal grid lines (Population index 0 - 200)
    for (let p = 0; p <= 200; p += 50) {
      const y = height - padding - (p / 200) * graphHeight;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();

      ctx.fillStyle = 'rgba(168, 162, 158, 0.6)';
      ctx.font = '10px monospace';
      ctx.fillText(`${p}%`, 6, y + 3);
    }

    // Vertical grid lines (Year 0 - 20)
    for (let yr = 0; yr <= 20; yr += 5) {
      const x = padding + (yr / 20) * graphWidth;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();

      ctx.fillStyle = 'rgba(168, 162, 158, 0.6)';
      ctx.font = '10px monospace';
      ctx.fillText(`Y${yr}`, x - 8, height - 12);
    }

    const history = historyRef.current;
    if (history.length < 2) return;

    // Helper to draw smooth series
    const drawSeries = (key: 'apex' | 'herb' | 'veg', strokeColor: string) => {
      ctx.beginPath();
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 2.5;

      history.forEach((point, index) => {
        const x = padding + (point.year / 20) * graphWidth;
        const val = Math.min(220, Math.max(0, point[key]));
        const y = height - padding - (val / 200) * graphHeight;

        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Draw active point pulse
      const lastPoint = history[history.length - 1];
      const lx = padding + (lastPoint.year / 20) * graphWidth;
      const lVal = Math.min(220, Math.max(0, lastPoint[key]));
      const ly = height - padding - (lVal / 200) * graphHeight;

      ctx.fillStyle = strokeColor;
      ctx.beginPath();
      ctx.arc(lx, ly, 4.5, 0, Math.PI * 2);
      ctx.fill();
    };

    // Draw Vegetation (Green)
    drawSeries('veg', '#22c55e');
    // Draw Herbivores (Yellow)
    drawSeries('herb', '#eab308');
    // Draw Apex Predators (Red/Crimson)
    drawSeries('apex', '#ef4444');
  }, [simYear, apexPop, herbPop, vegPop]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Field Navigation Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-stone-400 border-b border-natgeo-yellow/20 pb-4">
        <Link to="/" className="hover:text-natgeo-yellow uppercase font-bold">
          ZOOPEDIA
        </Link>
        <span>/</span>
        <span className="text-natgeo-yellow uppercase font-bold tracking-wider">
          {currentLang === 'en' ? 'Ecosystem & Trophic Cascades' : 'Chuỗi Thức Ăn & Hệ Sinh Thái'}
        </span>
      </div>

      {/* Main Field Header HUD */}
      <div className="field-journal-card p-6 sm:p-8 bg-gradient-to-br from-stone-900/95 via-stone-900/90 to-amber-950/20 border-natgeo-yellow/30 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-natgeo-yellow/20">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className="ink-stamp-badge border-natgeo-yellow/50 text-natgeo-yellow bg-natgeo-yellow/10">
                ECOSYSTEM BIOLOGY LAB • LEVEL IV
              </span>
              <span className="font-mono text-xs text-amber-400/80 tracking-widest uppercase">
                #TROPHIC-CASCADE-SIMULATOR
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif font-black text-white tracking-wide flex items-center gap-3">
              <Network className="w-8 h-8 text-natgeo-yellow" />
              <span>
                {currentLang === 'en'
                  ? 'Ecosystem Food Web & Trophic Cascades'
                  : 'Mạng Lưới Chuỗi Thức Ăn & Thác Sinh Thái'}
              </span>
            </h1>

            <p className="text-sm sm:text-base text-stone-300 font-serif max-w-3xl mt-2 leading-relaxed">
              {currentLang === 'en'
                ? 'Explore multileveled energy transfer, keystone predators, and trophic cascade dynamics. Simulate how the loss of an apex predator collapses entire biomes according to Lotka-Volterra dynamics.'
                : 'Khám phá dòng năng lượng sinh thái, vai trò của loài chủ chốt và cơ chế thác sinh thái. Mô phỏng tác động dây chuyền khi một loài săn mồi đầu bảng biến mất làm sụp đổ toàn bộ thảm thực vật.'}
            </p>
          </div>

          {/* Biome Switcher Pills */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                setActiveBiomeId('rainforest');
                setSelectedNodeId('tiger');
                resetSimulation('baseline');
              }}
              className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeBiomeId === 'rainforest'
                  ? 'btn-expedition-primary !py-2.5 !px-4'
                  : 'bg-stone-900 text-stone-300 border border-white/10 hover:border-natgeo-yellow/40'
              }`}
            >
              🌴 {currentLang === 'en' ? 'Rainforest' : 'Rừng Mưa'}
            </button>

            <button
              onClick={() => {
                setActiveBiomeId('savanna');
                setSelectedNodeId('lion');
                resetSimulation('baseline');
              }}
              className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeBiomeId === 'savanna'
                  ? 'btn-expedition-primary !py-2.5 !px-4'
                  : 'bg-stone-900 text-stone-300 border border-white/10 hover:border-natgeo-yellow/40'
              }`}
            >
              🦁 {currentLang === 'en' ? 'Savanna' : 'Xavan'}
            </button>

            <button
              onClick={() => {
                setActiveBiomeId('marine');
                setSelectedNodeId('great_white');
                resetSimulation('baseline');
              }}
              className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeBiomeId === 'marine'
                  ? 'btn-expedition-primary !py-2.5 !px-4'
                  : 'bg-stone-900 text-stone-300 border border-white/10 hover:border-natgeo-yellow/40'
              }`}
            >
              🌊 {currentLang === 'en' ? 'Ocean Reef' : 'Đại Dương'}
            </button>
          </div>
        </div>

        {/* Biome Overview Sub-bar */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-4 text-stone-300">
            <span className="text-natgeo-yellow font-bold uppercase">
              {activeBiome[currentLang === 'en' ? 'titleEn' : 'titleVi']}
            </span>
            <span className="text-stone-600">•</span>
            <span className="text-stone-400">
              Shannon-Wiener (H&apos;):{' '}
              <strong className="text-amber-300">{activeBiome.shannonIndex}</strong>
            </span>
            <span className="text-stone-600">•</span>
            <span className="text-stone-400">
              {currentLang === 'en' ? 'Resilience:' : 'Độ ổn định:'}{' '}
              <strong className="text-emerald-400">{activeBiome.resilienceRating}</strong>
            </span>
          </div>

          <div className="text-[11px] text-stone-400 italic font-serif">
            {activeBiome[currentLang === 'en' ? 'subtitleEn' : 'subtitleVi']}
          </div>
        </div>
      </div>

      {/* Main Interactive Food Web Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Trophic Levels Diagram */}
        <div className="lg:col-span-8 space-y-6">
          <div className="field-journal-card p-6 bg-stone-900/90 border-natgeo-yellow/20 relative">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-natgeo-yellow flex items-center gap-2">
                <Compass className="w-4 h-4 text-natgeo-yellow" />
                <span>
                  {currentLang === 'en'
                    ? 'Trophic Web Hierarchy & Energy Transfer'
                    : 'Thứ Bậc Tầng Dinh Dưỡng & Dòng Năng Lượng'}
                </span>
              </h2>
              <span className="text-[10px] font-mono text-stone-400">
                10% LINDEMAN RULE (Kcal Transfer)
              </span>
            </div>

            {/* Trophic Tiers: Level 4 to Level 1 */}
            <div className="mt-6 space-y-6">
              {[4, 3, 2, 1].map((lvl) => {
                const nodesInLevel = activeBiome.nodes.filter((n) => n.trophicLevel === lvl);
                const levelTitles: Record<number, { vi: string; en: string; color: string; bg: string }> = {
                  4: {
                    vi: 'TẦNG 4: THÚ SĂN MỒI ĐỈNH CAO (APEX)',
                    en: 'LEVEL 4: APEX PREDATORS',
                    color: 'text-rose-400 border-rose-500/40',
                    bg: 'bg-rose-950/20',
                  },
                  3: {
                    vi: 'TẦNG 3: SINH VẬT TIÊU THỤ BẬC 2 (MESOPREDATORS)',
                    en: 'LEVEL 3: SECONDARY CONSUMERS',
                    color: 'text-amber-400 border-amber-500/40',
                    bg: 'bg-amber-950/20',
                  },
                  2: {
                    vi: 'TẦNG 2: SINH VẬT TIÊU THỤ BẬC 1 (HERBIVORES)',
                    en: 'LEVEL 2: PRIMARY HERBIVORES',
                    color: 'text-yellow-400 border-yellow-500/40',
                    bg: 'bg-yellow-950/20',
                  },
                  1: {
                    vi: 'TẦNG 1: SINH VẬT SẢN XUẤT THÔ (PRODUCERS)',
                    en: 'LEVEL 1: PRIMARY PRODUCERS',
                    color: 'text-emerald-400 border-emerald-500/40',
                    bg: 'bg-emerald-950/20',
                  },
                };

                const meta = levelTitles[lvl];

                return (
                  <div key={lvl} className={`p-4 rounded-2xl border ${meta.bg} ${meta.color} relative`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider">
                        {meta[currentLang === 'en' ? 'en' : 'vi']}
                      </span>
                      <span className="text-[10px] font-mono opacity-70">
                        {lvl === 1 ? '100% Biomass' : `${Math.pow(10, lvl - 1) / 10}% Efficiency`}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {nodesInLevel.map((node) => {
                        const isSelected = selectedNode.id === node.id;
                        const isPrey = selectedNode.eats.includes(node.id);
                        const isPredator = node.eats.includes(selectedNode.id);

                        let cardRing = 'border-white/10 bg-stone-900/90 text-stone-200';
                        if (isSelected) {
                          cardRing =
                            'border-natgeo-yellow bg-amber-950/50 text-white shadow-glow ring-2 ring-natgeo-yellow';
                        } else if (isPrey) {
                          cardRing =
                            'border-emerald-500/60 bg-emerald-950/30 text-emerald-200 ring-1 ring-emerald-500/50';
                        } else if (isPredator) {
                          cardRing =
                            'border-rose-500/60 bg-rose-950/30 text-rose-200 ring-1 ring-rose-500/50';
                        }

                        return (
                          <div
                            key={node.id}
                            onClick={() => setSelectedNodeId(node.id)}
                            className={`p-3 rounded-xl border transition-all cursor-pointer relative group flex flex-col justify-between ${cardRing}`}
                          >
                            {/* Role Badge Tag */}
                            {isPrey && (
                              <span className="absolute -top-2 -right-1 px-1.5 py-0.2 rounded bg-emerald-500 text-stone-950 text-[8px] font-mono font-extrabold uppercase tracking-widest">
                                PREY
                              </span>
                            )}
                            {isPredator && (
                              <span className="absolute -top-2 -right-1 px-1.5 py-0.2 rounded bg-rose-500 text-white text-[8px] font-mono font-extrabold uppercase tracking-widest">
                                PREDATOR
                              </span>
                            )}

                            <div className="flex items-center gap-2">
                              <span className="text-xl p-1 rounded-lg bg-black/40 border border-white/5">
                                {node.icon}
                              </span>
                              <div className="min-w-0">
                                <div className="text-xs font-bold font-serif truncate text-white">
                                  {node[currentLang === 'en' ? 'nameEn' : 'nameVi']}
                                </div>
                                <div className="text-[10px] font-serif italic text-stone-400 truncate">
                                  {node.scientific}
                                </div>
                              </div>
                            </div>

                            <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[9px] font-mono text-stone-400">
                              <span>L{node.trophicLevel}</span>
                              <span>{Math.round(node.biomassKcal / 1000)}k kcal</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Node Telemetry & Trophic Connections */}
        <div className="lg:col-span-4 space-y-6">
          {/* Active Node Detail Card */}
          <div className="field-journal-card p-6 bg-stone-900/95 border-natgeo-yellow/30 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-natgeo-yellow/20">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-natgeo-yellow">
                {currentLang === 'en' ? 'Trophic Node Inspector' : 'Phân Tích Nút Sinh Thái'}
              </span>
              <span className="text-[10px] font-mono text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                LEVEL {selectedNode.trophicLevel}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-black border-2 border-natgeo-yellow/40 flex items-center justify-center text-3xl shadow-xl shrink-0">
                {selectedNode.icon}
              </div>
              <div>
                <h3 className="text-xl font-serif font-black text-white">
                  {selectedNode[currentLang === 'en' ? 'nameEn' : 'nameVi']}
                </h3>
                <div className="text-xs font-serif italic text-amber-300/80">
                  {selectedNode.scientific}
                </div>
                <div className="mt-1 inline-block text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-natgeo-yellow/15 text-natgeo-yellow border border-natgeo-yellow/30">
                  {selectedNode.tierLevelLabel[currentLang === 'en' ? 'en' : 'vi']}
                </div>
              </div>
            </div>

            {/* Direct Link to Specimen 3D Page */}
            {selectedNode.speciesSlug && (
              <Link
                to={`/species/${selectedNode.speciesSlug}`}
                className="btn-expedition-primary w-full text-center flex items-center justify-center gap-2 !py-2.5 text-xs font-mono"
              >
                <span>{currentLang === 'en' ? 'Inspect 3D Specimen Record' : 'Mở Hồ Sơ Tiêu Bản 3D'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}

            {/* Direct Trophic Interactions */}
            <div className="space-y-4 pt-2">
              {/* Predators */}
              <div>
                <span className="text-[11px] font-mono font-bold text-rose-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" />
                  <span>{currentLang === 'en' ? 'Natural Predators (Who eats this):' : 'Kẻ săn mồi tự nhiên:'}</span>
                </span>
                {predatorsOfSelected.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {predatorsOfSelected.map((pred) => (
                      <button
                        key={pred.id}
                        onClick={() => setSelectedNodeId(pred.id)}
                        className="px-2.5 py-1 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs font-serif hover:bg-rose-900/50 transition-all flex items-center gap-1.5"
                      >
                        <span>{pred.icon}</span>
                        <span>{pred[currentLang === 'en' ? 'nameEn' : 'nameVi']}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs font-serif italic text-stone-500">
                    {currentLang === 'en'
                      ? 'No natural predators (Apex status)'
                      : 'Không có kẻ thù tự nhiên (Đứng đầu chuỗi)'}
                  </div>
                )}
              </div>

              {/* Prey */}
              <div>
                <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                  <Leaf className="w-3.5 h-3.5" />
                  <span>{currentLang === 'en' ? 'Prey / Food Source (Consumes):' : 'Nguồn thức ăn / Con mồi:'}</span>
                </span>
                {preyOfSelected.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {preyOfSelected.map((prey) => (
                      <button
                        key={prey.id}
                        onClick={() => setSelectedNodeId(prey.id)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs font-serif hover:bg-emerald-900/50 transition-all flex items-center gap-1.5"
                      >
                        <span>{prey.icon}</span>
                        <span>{prey[currentLang === 'en' ? 'nameEn' : 'nameVi']}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs font-serif italic text-stone-500">
                    {currentLang === 'en'
                      ? 'Autotrophic solar energy synthesis'
                      : 'Tự dưỡng quang hợp qua ánh sáng mặt trời'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trophic Cascade Real-time Simulator Section */}
      <div className="field-journal-card p-6 sm:p-8 bg-stone-900/90 border-natgeo-yellow/30 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-natgeo-yellow/20">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-natgeo-yellow border border-amber-500/40">
                DYNAMIC POPULATION SIMULATION
              </span>
              <span className="text-xs font-mono text-stone-500">•</span>
              <span className="text-xs font-mono text-stone-300">
                YEAR: <strong className="text-natgeo-yellow font-bold">{simYear} / 20</strong>
              </span>
            </div>
            <h2 className="text-2xl font-serif font-black text-white flex items-center gap-2.5">
              <Activity className="w-6 h-6 text-natgeo-yellow" />
              <span>
                {currentLang === 'en'
                  ? 'Trophic Cascade Simulator (Lotka-Volterra Mechanics)'
                  : 'Mô Phỏng Động Thái Thác Sinh Thái (Trophic Cascade)'}
              </span>
            </h2>
          </div>

          {/* Simulation Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSimulating(!isSimulating)}
              className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md ${
                isSimulating
                  ? 'bg-amber-400 text-stone-950 shadow-glow font-extrabold'
                  : 'bg-natgeo-yellow/20 text-natgeo-yellow border border-natgeo-yellow/40 hover:bg-natgeo-yellow/30'
              }`}
            >
              {isSimulating ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isSimulating ? (currentLang === 'en' ? 'Pause Sim' : 'Tạm Dừng') : (currentLang === 'en' ? 'Run Simulation' : 'Chạy Mô Phỏng')}</span>
            </button>

            <button
              onClick={() => resetSimulation(scenario)}
              className="p-2.5 rounded-xl bg-stone-950 border border-white/10 text-stone-400 hover:text-natgeo-yellow transition-all"
              title="Khôi phục lại từ đầu"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Intervention Scenarios Radio Bar */}
        <div>
          <label className="text-xs font-mono font-bold text-natgeo-yellow uppercase tracking-wider block mb-2.5 flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5" />
            <span>{currentLang === 'en' ? 'Select Intervention Scenario:' : 'Chọn Kịch Bản Can Thiệp Thực Địa:'}</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <button
              onClick={() => resetSimulation('baseline')}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                scenario === 'baseline'
                  ? 'bg-amber-950/40 border-natgeo-yellow text-white ring-1 ring-natgeo-yellow'
                  : 'bg-stone-950/60 border-white/10 text-stone-400 hover:border-white/30'
              }`}
            >
              <div className="font-mono text-xs font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{currentLang === 'en' ? 'Natural Equilibrium' : 'Cân Bằng Tự Nhiên'}</span>
              </div>
              <div className="text-[11px] font-serif text-stone-400 mt-1">
                {currentLang === 'en'
                  ? 'All trophic levels operate in steady harmonic equilibrium.'
                  : 'Các loài săn mồi và con mồi dao động điều hòa ổn định.'}
              </div>
            </button>

            <button
              onClick={() => resetSimulation('extirpate_apex')}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                scenario === 'extirpate_apex'
                  ? 'bg-rose-950/40 border-rose-500 text-white ring-1 ring-rose-500'
                  : 'bg-stone-950/60 border-white/10 text-stone-400 hover:border-rose-500/40'
              }`}
            >
              <div className="font-mono text-xs font-bold text-rose-300 flex items-center gap-2">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span>{currentLang === 'en' ? 'Extirpate Apex Predator' : 'Tuyệt Diệt Thú Đầu Bảng'}</span>
              </div>
              <div className="text-[11px] font-serif text-stone-400 mt-1">
                {currentLang === 'en'
                  ? 'Remove tiger/lion -> herbivore population explodes -> forest wiped out.'
                  : 'Bắt hết Hổ/Sói -> thú ăn cỏ bùng nổ -> rừng bị gặm trơ trọi.'}
              </div>
            </button>

            <button
              onClick={() => resetSimulation('deforestation')}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                scenario === 'deforestation'
                  ? 'bg-amber-950/40 border-amber-500 text-white ring-1 ring-amber-500'
                  : 'bg-stone-950/60 border-white/10 text-stone-400 hover:border-amber-500/40'
              }`}
            >
              <div className="font-mono text-xs font-bold text-amber-300 flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>{currentLang === 'en' ? 'Habitat Deforestation' : 'Mất Thảm Thực Vật (Phá Rừng)'}</span>
              </div>
              <div className="text-[11px] font-serif text-stone-400 mt-1">
                {currentLang === 'en'
                  ? 'Severe loss of primary producers triggers bottom-up starvation.'
                  : 'Mất sinh khối thô kéo sụt giảm toàn bộ chuỗi thức ăn.'}
              </div>
            </button>

            <button
              onClick={() => resetSimulation('invasive_species')}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                scenario === 'invasive_species'
                  ? 'bg-purple-950/40 border-purple-500 text-white ring-1 ring-purple-500'
                  : 'bg-stone-950/60 border-white/10 text-stone-400 hover:border-purple-500/40'
              }`}
            >
              <div className="font-mono text-xs font-bold text-purple-300 flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-purple-400" />
                <span>{currentLang === 'en' ? 'Invasive Species Invasion' : 'Loài Ngoại Lai Xâm Lấn'}</span>
              </div>
              <div className="text-[11px] font-serif text-stone-400 mt-1">
                {currentLang === 'en'
                  ? 'Foreign consumer displaces native species and exhausts vegetation.'
                  : 'Loài ngoại lai cạnh tranh khốc liệt, vắt kiệt nguồn cỏ rừng.'}
              </div>
            </button>
          </div>
        </div>

        {/* Dynamic Simulation Canvas Graph & Ecological Diagnosis */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Canvas Graph */}
          <div className="lg:col-span-8 bg-stone-950 rounded-2xl p-4 border border-natgeo-yellow/20 relative shadow-inner">
            <canvas
              ref={canvasRef}
              width={640}
              height={260}
              className="w-full h-[260px] rounded-xl block"
            />

            {/* Legend Overlay */}
            <div className="absolute top-6 right-6 flex items-center gap-4 bg-stone-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[10px] font-mono">
              <span className="flex items-center gap-1.5 text-rose-400">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                Apex ({Math.round(apexPop)}%)
              </span>
              <span className="flex items-center gap-1.5 text-yellow-400">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                Herbivores ({Math.round(herbPop)}%)
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Vegetation ({Math.round(vegPop)}%)
              </span>
            </div>
          </div>

          {/* Dynamic Diagnosis Narrative Card */}
          <div className="lg:col-span-4 field-panel p-5 rounded-2xl border border-natgeo-yellow/20 space-y-3">
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-natgeo-yellow">
              <Activity className="w-4 h-4" />
              <span>{currentLang === 'en' ? 'Field Ecological Diagnosis' : 'Chẩn Đoán Sinh Thái Học'}</span>
            </div>

            {scenario === 'baseline' && (
              <p className="text-xs font-serif text-stone-300 leading-relaxed">
                {currentLang === 'en'
                  ? 'Ecological equilibrium is robust. The apex predator regulates herbivore numbers, preventing overbrowsing of saplings and maintaining clear flowing streams.'
                  : 'Hệ sinh thái đang ở trạng thái cân bằng tuyệt hảo. Loài thú đầu bảng kiểm soát số lượng thú ăn cỏ vừa phải, bảo vệ thảm cây non phát triển và duy trì dòng chảy trong lành.'}
              </p>
            )}

            {scenario === 'extirpate_apex' && (
              <div className="space-y-2 text-xs font-serif leading-relaxed">
                <p className="text-rose-300 font-bold">
                  {currentLang === 'en'
                    ? 'CRITICAL COLLAPSE: Trophic cascade triggered!'
                    : 'BÁO ĐỘNG ĐỎ: Hiệu ứng thác sinh thái đổ vỡ!'}
                </p>
                <p className="text-stone-300">
                  {currentLang === 'en'
                    ? 'Without top-down predation pressure, herbivores rapidly multiply by +60%. Uncontrolled grazing strips forest saplings and riverbanks bare. Severe soil erosion ensues, followed by widespread herbivore starvation.'
                    : 'Không còn áp lực săn mồi từ thú đầu bảng, thú ăn cỏ sinh sôi mất kiểm soát (+60%). Chúng gặm trơ trọi cây non và bờ sông, gây xói mòn đất nghiêm trọng và cuối cùng dẫn đến nạn đói hàng loạt.'}
                </p>
              </div>
            )}

            {scenario === 'deforestation' && (
              <p className="text-xs font-serif text-stone-300 leading-relaxed">
                {currentLang === 'en'
                  ? 'Bottom-up primary producer crash. Loss of floral biomass ripples upward through the pyramid, causing sharp multi-trophic population declines.'
                  : 'Sụp đổ từ đáy tháp sinh thái. Mất sinh khối thực vật khiến động vật ăn cỏ kiệt quệ thức ăn, kéo theo sự sụt giảm nghiêm trọng của toàn bộ các loài săn mồi.'}
              </p>
            )}

            {scenario === 'invasive_species' && (
              <p className="text-xs font-serif text-stone-300 leading-relaxed">
                {currentLang === 'en'
                  ? 'Competitive exclusion in progress. The invasive population consumes disproportionate vegetation, driving native herbivores toward regional extirpation.'
                  : 'Cạnh tranh sinh thái gay gắt. Loài xâm lấn tiêu thụ cạn kiệt thảm cỏ, đẩy các loài thú bản địa đến bờ vực diệt vong cục bộ.'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
