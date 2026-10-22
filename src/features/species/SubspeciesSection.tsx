import React from 'react';
import { useTranslation } from 'react-i18next';
import { GitBranch, MapPin } from 'lucide-react';

interface SubspeciesEntry {
  scientific: string;
  nameVi: string;
  nameEn: string;
  rangeVi: string;
  rangeEn: string;
  iucn: 'CR' | 'EN' | 'VU' | 'NT' | 'LC' | 'EX' | 'EW';
  notesVi: string;
  notesEn: string;
}

// Curated authentic biological database of subspecies & lineages
const SUBSPECIES_DATABASE: Record<string, SubspeciesEntry[]> = {
  'panthera-tigris': [
    {
      scientific: 'Panthera tigris tigris',
      nameVi: 'Hổ Bengal',
      nameEn: 'Bengal Tiger',
      rangeVi: 'Ấn Độ, Bangladesh, Nepal, Bhutan',
      rangeEn: 'India, Bangladesh, Nepal, Bhutan',
      iucn: 'EN',
      notesVi: 'Phân loài phổ biến nhất, chiếm hơn 70% tổng số lượng hổ hoang dã toàn cầu. Sức mạnh phi thường và khả năng bơi lội siêu đẳng.',
      notesEn: 'Most populous subspecies comprising over 70% of wild tigers. Renowned apex predator and exceptional swimmer in Sundarbans mangroves.',
    },
    {
      scientific: 'Panthera tigris corbetti',
      nameVi: 'Hổ Đông Dương',
      nameEn: 'Indochinese Tiger',
      rangeVi: 'Việt Nam, Lào, Campuchia, Thái Lan, Myanmar',
      rangeEn: 'Vietnam, Laos, Cambodia, Thailand, Myanmar',
      iucn: 'CR',
      notesVi: 'Phân loài bản địa Việt Nam và bán đảo Đông Dương. Vóc dáng thon gọn hơn hổ Bengal, các dải vằn hẹp và sẫm màu thích nghi rừng mưa rậm rạp.',
      notesEn: 'Native to Vietnam and the Indochina peninsula. Darker pelage with narrower stripes adapted for dense tropical rainforest canopies.',
    },
    {
      scientific: 'Panthera tigris altaica',
      nameVi: 'Hổ Siberia (Hổ Amur)',
      nameEn: 'Siberian / Amur Tiger',
      rangeVi: 'Viễn Đông Nga, Đông Bắc Trung Quốc',
      rangeEn: 'Russian Far East, Northeast China',
      iucn: 'EN',
      notesVi: 'Phân loài hổ lớn nhất thế giới (con đực có thể vượt 300kg). Bộ lông dày màu cam nhạt cùng lớp mỡ bụng dày thích nghi nhiệt độ âm 40°C.',
      notesEn: 'The largest felid on Earth, weighing up to 300+ kg. Possesses a dense winter coat and thick subcutaneous fat layer enduring -40°C extremes.',
    },
    {
      scientific: 'Panthera tigris sumatrae',
      nameVi: 'Hổ Sumatra',
      nameEn: 'Sumatran Tiger',
      rangeVi: 'Đảo Sumatra, Indonesia',
      rangeEn: 'Sumatra Island, Indonesia',
      iucn: 'CR',
      notesVi: 'Phân loài hổ nhỏ nhất còn sống sót trên đảo biệt lập. Bộ lông màu cam sẫm, vằn dày khít và có bờm lông quanh cổ rất đặc trưng.',
      notesEn: 'Smallest surviving island tiger subspecies. Characterized by dark ochre pelage, dense stripes, and a prominent neck ruff.',
    },
    {
      scientific: 'Panthera tigris jacksoni',
      nameVi: 'Hổ Mã Lai',
      nameEn: 'Malayan Tiger',
      rangeVi: 'Bán đảo Mã Lai',
      rangeEn: 'Southern and central Malay Peninsula',
      iucn: 'CR',
      notesVi: 'Quần thể hoang dã cực kỳ nguy cấp với ước tính dưới 150 cá thể sinh sống trong rừng nhiệt đới bán đảo Mã Lai.',
      notesEn: 'Critically endangered endemic subspecies with an estimated wild population below 150 individuals.',
    },
    {
      scientific: 'Panthera tigris amoyensis',
      nameVi: 'Hổ Hoa Nam',
      nameEn: 'South China Tiger',
      rangeVi: 'Nam Trung Quốc',
      rangeEn: 'Southern China',
      iucn: 'CR',
      notesVi: 'Được coi là phân loài hổ cổ xưa nhất. Không còn ghi nhận cá thể nào ngoài tự nhiên từ thập niên 1990, chỉ còn vài chục cá thể nuôi bảo tồn.',
      notesEn: 'Considered the stem tiger lineage. Functionally extinct in the wild since the 1990s, surviving only in dedicated captive breeding programs.',
    },
    {
      scientific: 'Panthera tigris virgata',
      nameVi: 'Hổ Caspia (Hổ Ba Tư)',
      nameEn: 'Caspian Tiger',
      rangeVi: 'Thổ Nhĩ Kỳ, Iran, Trung Á, Tân Cương',
      rangeEn: 'Turkey, Iran, Central Asia, Xinjiang',
      iucn: 'EX',
      notesVi: 'Đã tuyệt chủng vào thập niên 1970 do săn bắn và mất sinh cảnh ven sông Tugay. Rất gần gũi về mặt di truyền với hổ Siberia.',
      notesEn: 'Declared extinct in the 1970s due to habitat destruction of riparian Tugay forests. Genetically near-identical to the Amur tiger.',
    },
    {
      scientific: 'Panthera tigris balica',
      nameVi: 'Hổ Bali',
      nameEn: 'Bali Tiger',
      rangeVi: 'Đảo Bali, Indonesia',
      rangeEn: 'Bali Island, Indonesia',
      iucn: 'EX',
      notesVi: 'Tuyệt chủng năm 1937. Phân loài hổ nhỏ nhất trong lịch sử, chỉ nặng từ 65 đến 100kg.',
      notesEn: 'Extinct since 1937. Smallest tiger subspecies ever recorded, uniquely adapted to small Sunda island ecosystems.',
    },
    {
      scientific: 'Panthera tigris sondaica',
      nameVi: 'Hổ Java',
      nameEn: 'Javan Tiger',
      rangeVi: 'Đảo Java, Indonesia',
      rangeEn: 'Java Island, Indonesia',
      iucn: 'EX',
      notesVi: 'Tuyệt chủng vào giữa thập niên 1970 do chuyển đổi đất nông nghiệp quy mô lớn trên đảo Java đông dân cư.',
      notesEn: 'Extinct in the mid-1970s resulting from agricultural expansion and intensive land conversion across Java.',
    },
  ],
  'ursus-arctos': [
    {
      scientific: 'Ursus arctos horribilis',
      nameVi: 'Gấu xám Bắc Mỹ (Grizzly)',
      nameEn: 'North American Grizzly Bear',
      rangeVi: 'Alaska, Tây Canada, Bắc Rockies (Mỹ)',
      rangeEn: 'Alaska, Western Canada, Northern Rockies',
      iucn: 'LC',
      notesVi: 'Nổi tiếng với bướu cơ bắp lớn ở vai cung cấp lực đào bới khủng khiếp và bộ lông xám bạc pha nâu.',
      notesEn: 'Iconic apex omnivore possessing a massive shoulder muscle hump for excavating roots and dens, with silver-tipped fur.',
    },
    {
      scientific: 'Ursus arctos middendorffi',
      nameVi: 'Gấu Kodiak',
      nameEn: 'Kodiak Bear',
      rangeVi: 'Quần đảo Kodiak, Alaska',
      rangeEn: 'Kodiak Archipelago, Alaska',
      iucn: 'LC',
      notesVi: 'Cùng với gấu bắc cực là hai loài thú ăn thịt trên cạn to lớn nhất hành tinh. Con đực có thể nặng tới 680kg.',
      notesEn: 'Rivals the polar bear as the largest terrestrial carnivoran, with massive males occasionally exceeding 680 kg on salmon-rich diets.',
    },
    {
      scientific: 'Ursus arctos arctos',
      nameVi: 'Gấu nâu Á-Âu',
      nameEn: 'Eurasian Brown Bear',
      rangeVi: 'Bắc Âu, Nga, Siberia',
      rangeEn: 'Northern Europe, Russia, Siberia',
      iucn: 'LC',
      notesVi: 'Phân loài gấu nâu phổ biến trên khắp vành đai rừng taiga Á-Âu, xuất hiện nhiều trong thần thoại Slavic và Bắc Âu.',
      notesEn: 'Widespread across Eurasian boreal taiga, central to Slavic and Nordic folklore.',
    },
    {
      scientific: 'Ursus arctos isabellinus',
      nameVi: 'Gấu nâu Himalaya',
      nameEn: 'Himalayan Brown Bear',
      rangeVi: 'Himalaya, Pakistan, Tây Tạng',
      rangeEn: 'Himalayas, Pakistan, Tibetan Plateau',
      iucn: 'CR',
      notesVi: 'Sinh sống ở độ cao lớn trên 5.000m, được cho là nguồn gốc thực tế của truyền thuyết sinh vật thần thoại "Người tuyết Yeti".',
      notesEn: 'Inhabits alpine meadows above 5,000m; scientifically recognized as the primary biological basis for the Yeti folklore.',
    },
  ],
  'canis-lupus': [
    {
      scientific: 'Canis lupus lupus',
      nameVi: 'Chó sói Á-Âu',
      nameEn: 'Eurasian Wolf',
      rangeVi: 'Châu Âu, Nga, Trung Á',
      rangeEn: 'Europe, Russia, Central Asia',
      iucn: 'LC',
      notesVi: 'Phân loài sói xám lớn nhất lục địa Á-Âu, cấu trúc xã hội bầy đàn cực kỳ chặt chẽ.',
      notesEn: 'Largest Eurasian gray wolf subspecies with complex multi-generational pack hierarchy.',
    },
    {
      scientific: 'Canis lupus arctos',
      nameVi: 'Chó sói Bắc Cực',
      nameEn: 'Arctic Wolf',
      rangeVi: 'Quần đảo Bắc Cực thuộc Canada, Greenland',
      rangeEn: 'Canadian Arctic Archipelago, Greenland',
      iucn: 'LC',
      notesVi: 'Toàn thân phủ lông trắng muốt như tuyết, tai ngắn và mõm nhỏ hơn để giảm thiểu sự mất nhiệt trong bóng đêm vùng cực.',
      notesEn: 'Pristine pure white winter pelage with smaller ears and shorter muzzles reducing heat dissipation in polar winters.',
    },
    {
      scientific: 'Canis lupus dingo',
      nameVi: 'Chó Dingo Úc',
      nameEn: 'Dingo',
      rangeVi: 'Lục địa Úc',
      rangeEn: 'Continental Australia',
      iucn: 'VU',
      notesVi: 'Kẻ săn mồi đầu bảng trên lục địa Úc, tách biệt tiến hóa từ chó sói cổ đại hơn 4.000 năm.',
      notesEn: 'Apex terrestrial predator of mainland Australia, isolated from ancestral canids for over 4,000 years.',
    },
  ],
  'panthera-leo': [
    {
      scientific: 'Panthera leo melanochaita',
      nameVi: 'Sư tử Nam & Đông Phi',
      nameEn: 'Southern & Eastern African Lion',
      rangeVi: 'Serengeti, Kruger, Maasai Mara, Kalahari',
      rangeEn: 'Serengeti, Kruger, Maasai Mara, Kalahari',
      iucn: 'VU',
      notesVi: 'Đại diện tiêu biểu nhất của chúa tể thảo nguyên với bầy đàn đông đảo và bờm sẫm màu uy lực.',
      notesEn: 'Archetypal savanna predator with large coordinated prides and dense dark manes.',
    },
    {
      scientific: 'Panthera leo leo',
      nameVi: 'Sư tử châu Á (Sư tử Ấn Độ)',
      nameEn: 'Asiatic Lion',
      rangeVi: 'Vườn quốc gia Rừng Gir, Gujarat, Ấn Độ',
      rangeEn: 'Gir National Park, Gujarat, India',
      iucn: 'EN',
      notesVi: 'Quần thể sư tử duy nhất còn sót lại ở châu Á ngoài thiên nhiên, có nếp gấp da bụng đặc trưng.',
      notesEn: 'Sole surviving wild lion population in Asia, featuring a characteristic longitudinal fold of skin along its belly.',
    },
  ],
};

interface SubspeciesSectionProps {
  speciesId: string;
  speciesName: string;
}

export const SubspeciesSection: React.FC<SubspeciesSectionProps> = ({
  speciesId,
  speciesName,
}) => {
  const { i18n } = useTranslation();
  const isEn = i18n.language === 'en';

  const subspeciesList = SUBSPECIES_DATABASE[speciesId];

  if (!subspeciesList || subspeciesList.length === 0) {
    return null;
  }

  const getStatusBadge = (status: SubspeciesEntry['iucn']) => {
    switch (status) {
      case 'EX':
        return <span className="field-stamp field-stamp-danger !border-stone-500 !bg-stone-800 !text-stone-300">TUYỆT CHỦNG // EXTINCT</span>;
      case 'CR':
        return <span className="field-stamp field-stamp-danger">CR // CỰC KỲ NGUY CẤP</span>;
      case 'EN':
        return <span className="field-stamp field-stamp-danger">EN // NGUY CẤP</span>;
      case 'VU':
        return <span className="field-stamp field-stamp-warning">VU // SẮP NGUY CẤP</span>;
      case 'LC':
        return <span className="field-stamp field-stamp-verified">LC // ÍT LO NGẠI</span>;
      default:
        return <span className="field-stamp field-stamp-warning">{status}</span>;
    }
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl field-panel border-2 border-natgeo-yellow/25 shadow-2xl relative overflow-hidden field-ruler-bottom">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-natgeo-yellow/20 gap-3 mb-6">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-natgeo-yellow font-bold mb-1 flex items-center gap-1.5">
            <GitBranch className="w-3.5 h-3.5 text-natgeo-yellow" />
            <span>PHYLOGENETIC SUBSPECIES & LINEAGES TAXONOMY</span>
          </div>
          <h3 className="font-display text-2xl font-extrabold text-white flex items-center gap-2 uppercase tracking-tight">
            <span>{isEn ? `Subspecies & Genetic Lineages (${subspeciesList.length})` : `Các Phân Loài & Dòng Dõi Tiến Hóa (${subspeciesList.length} Dòng)`}</span>
          </h3>
          <p className="text-xs text-stone-400 mt-1 font-sans">
            {isEn
              ? `Detailed biological breakdown of recognized geographic subspecies, evolutionary adaptations, and regional conservation status for ${speciesName}.`
              : `Bảng đối chiếu chi tiết các phân loài địa lý, đặc điểm hình thái thích nghi và tình trạng bảo tồn từng dòng của ${speciesName}.`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-black/60 border border-natgeo-yellow/30 text-xs font-mono font-bold text-natgeo-yellow">
            GBIF INTRA-SPECIES TAXA
          </span>
        </div>
      </div>

      {/* Subspecies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {subspeciesList.map((sub, idx) => (
          <div
            key={sub.scientific}
            className="p-5 rounded-2xl bg-black/60 border border-natgeo-yellow/20 hover:border-natgeo-yellow/60 transition-all flex flex-col justify-between group shadow-lg"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="w-7 h-7 rounded-lg bg-natgeo-yellow/15 border border-natgeo-yellow/30 text-natgeo-yellow font-mono font-extrabold text-xs flex items-center justify-center">
                  #{idx + 1}
                </span>
                {getStatusBadge(sub.iucn)}
              </div>

              <h4 className="font-serif text-xl font-bold text-white group-hover:text-natgeo-yellow transition-colors">
                {isEn ? sub.nameEn : sub.nameVi}
              </h4>
              <div className="text-xs font-serif italic text-natgeo-yellow mb-3 font-semibold">
                {sub.scientific}
              </div>

              <div className="mb-3 flex items-start gap-1.5 text-xs font-mono text-stone-300">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span className="font-sans text-[11px] text-stone-300">{isEn ? sub.rangeEn : sub.rangeVi}</span>
              </div>

              <p className="text-xs text-stone-300 leading-relaxed font-sans bg-black/40 p-3 rounded-xl border border-white/5">
                {isEn ? sub.notesEn : sub.notesVi}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
