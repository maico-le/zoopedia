import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  GitFork,
  Dna,
  Clock,
  Search,
  Sparkles,
  ArrowRight,
  Radio,
  ChevronDown,
  ChevronRight,
  Info,
  Layers,
  Flame,
  Globe,
  Play,
  Pause
} from 'lucide-react';
import taxaTreeData from '../../../data/taxa/tree.json';
import speciesIndexData from '../../../data/species-index.json';
import { SpeciesIndexItem } from '../../lib/data-loader';

// --- DATA STRUCTURES & TAXONOMY EVOLUTIONARY METADATA ---

interface TaxaClassNode {
  speciesCount?: number;
  orders?: Record<string, string[]>;
}

interface TaxaPhylumNode {
  speciesCount?: number;
  classes?: Record<string, TaxaClassNode>;
}

type TaxaTreeStructure = Record<string, TaxaPhylumNode>;

interface CladeMeta {
  divergenceMya: number; // Million years ago
  epochVi: string;
  epochEn: string;
  keyInnovationVi: string;
  keyInnovationEn: string;
  ancestralForm: string;
  icon: string;
}

const PHYLUM_EVOLUTION_META: Record<string, CladeMeta> = {
  Chordata: {
    divergenceMya: 540,
    epochVi: 'Kỷ Cambri (540 Triệu năm)',
    epochEn: 'Cambrian Period (540 Ma)',
    keyInnovationVi: 'Xuất hiện dây sống (notochord), ống thần kinh lưng và khe mang hầu.',
    keyInnovationEn: 'Appearance of dorsal nerve cord, notochord, and pharyngeal gill slits.',
    ancestralForm: 'Pikaia / Haikouichthys',
    icon: '🐅',
  },
  Arthropoda: {
    divergenceMya: 535,
    epochVi: 'Kỷ Cambri (535 Triệu năm)',
    epochEn: 'Cambrian Period (535 Ma)',
    keyInnovationVi: 'Bộ xương ngoài bằng chitin, cơ thể phân đốt và chân có khớp vận động linh hoạt.',
    keyInnovationEn: 'Hard chitinous exoskeleton, segmented body tagmata, and jointed appendages.',
    ancestralForm: 'Anomalocaris / Trilobita',
    icon: '🦋',
  },
  Mollusca: {
    divergenceMya: 545,
    epochVi: 'Kỷ Cambri sớm (545 Triệu năm)',
    epochEn: 'Early Cambrian (545 Ma)',
    keyInnovationVi: 'Lớp màng áo manti tiết vỏ canxi, chân cơ vận động và lưỡi bào (radula) ăn thức ăn.',
    keyInnovationEn: 'Muscular mantle secreting calcareous shell, radular feeding apparatus.',
    ancestralForm: 'Kimberella / Helcionellids',
    icon: '🐙',
  },
  Cnidaria: {
    divergenceMya: 580,
    epochVi: 'Kỷ Ediacara (580 Triệu năm)',
    epochEn: 'Ediacaran Period (580 Ma)',
    keyInnovationVi: 'Tế bào gai trâm độc quyền (cnidocytes), đối xứng tỏa tròn và mạng thần kinh phân tán.',
    keyInnovationEn: 'Specialized stinging cnidocytes, radial symmetry, and decentralized nerve net.',
    ancestralForm: 'Haootia quadriformis',
    icon: '🪼',
  },
  Echinodermata: {
    divergenceMya: 530,
    epochVi: 'Kỷ Cambri (530 Triệu năm)',
    epochEn: 'Cambrian Period (530 Ma)',
    keyInnovationVi: 'Hệ thống mạch nước thủy lực vận động, đối xứng ngũ tỏa tròn ở con trưởng thành.',
    keyInnovationEn: 'Hydraulic water vascular system and secondary pentaradial symmetry in adults.',
    ancestralForm: 'Ctenoimbricata',
    icon: '⭐',
  },
  Annelida: {
    divergenceMya: 530,
    epochVi: 'Kỷ Cambri (530 Triệu năm)',
    epochEn: 'Cambrian Period (530 Ma)',
    keyInnovationVi: 'Phân đốt thực sự (metamerism), thể xoang chính thức và hệ tuần hoàn kín.',
    keyInnovationEn: 'True metameric segmentation, true coelom, and closed circulatory system.',
    ancestralForm: 'Canadia spinosa',
    icon: '🪱',
  },
  Porifera: {
    divergenceMya: 600,
    epochVi: 'Tiền Cambri (600 Triệu năm)',
    epochEn: 'Precambrian Cryogenian (600 Ma)',
    keyInnovationVi: 'Tế bào cổ áo (choanocytes) bơm nước lọc dưỡng chất, cấu trúc tế bào chưa phân hóa thành mô.',
    keyInnovationEn: 'Aquiferous water filtration with flagellated choanocytes, lacking true tissue layers.',
    ancestralForm: 'Otavia antiqua',
    icon: '🧽',
  },
  Platyhelminthes: {
    divergenceMya: 550,
    epochVi: 'Kỷ Ediacara muộn (550 Triệu năm)',
    epochEn: 'Late Ediacaran (550 Ma)',
    keyInnovationVi: 'Đối xứng hai bên sơ khai, hệ thần kinh tập trung về đầu (cephalization) nhưng chưa có xoang cơ thể.',
    keyInnovationEn: 'Bilateral symmetry, primitive cephalization, and flat unsegmented acoelomate body.',
    ancestralForm: 'Ikaria wariootia',
    icon: '〰️',
  },
};

const CLASS_EVOLUTION_META: Record<string, CladeMeta> = {
  Mammalia: {
    divergenceMya: 210,
    epochVi: 'Kỷ Tam Điệp muộn (210 Triệu năm)',
    epochEn: 'Late Triassic (210 Ma)',
    keyInnovationVi: 'Tuyến sữa nuôi con, lông mao giữ nhiệt, tuần hoàn hằng nhiệt và 3 xương tai giữa.',
    keyInnovationEn: 'Mammary lactation, hair pelage insulation, endothermy, and 3 middle ear ossicles.',
    ancestralForm: 'Morganucodon / Cynodontia',
    icon: '🦁',
  },
  Aves: {
    divergenceMya: 150,
    epochVi: 'Kỷ Jura muộn (150 Triệu năm)',
    epochEn: 'Late Jurassic (150 Ma)',
    keyInnovationVi: 'Tiến hóa từ Khủng long chân thú Theropoda: Lông vũ vũ lực bay, xương xốp rỗng và túi khí hô hấp kép.',
    keyInnovationEn: 'Evolved from Maniraptoran Theropods: aerodynamic feathers, hollow pneumatized bones, unidirectional lung airflow.',
    ancestralForm: 'Archaeopteryx lithographica',
    icon: '🦅',
  },
  Reptilia: {
    divergenceMya: 315,
    epochVi: 'Kỷ Than Đá muộn (315 Triệu năm)',
    epochEn: 'Late Carboniferous (315 Ma)',
    keyInnovationVi: 'Trứng màng ối (amniotic egg) đẻ trên cạn, da phủ vảy sừng keratin chống bốc hơi nước.',
    keyInnovationEn: 'Cleidoic amniotic egg resisting desiccation, tough keratinous scales.',
    ancestralForm: 'Hylonomus lyelli',
    icon: '🦎',
  },
  Amphibia: {
    divergenceMya: 370,
    epochVi: 'Kỷ Devon muộn (370 Triệu năm)',
    epochEn: 'Late Devonian (370 Ma)',
    keyInnovationVi: 'Những bước chân đầu tiên lên cạn: Phát triển 4 chi có khớp ngón (tetrapod), hô hấp qua da & phổi.',
    keyInnovationEn: 'First vertebrate land pioneers: pentadactyl limb joints, cutaneous and pulmonary respiration.',
    ancestralForm: 'Tiktaalik / Acanthostega',
    icon: '🐸',
  },
  Chondrichthyes: {
    divergenceMya: 450,
    epochVi: 'Kỷ Ordovic (450 Triệu năm)',
    epochEn: 'Ordovician Period (450 Ma)',
    keyInnovationVi: 'Bộ xương hoàn toàn bằng sụn đàn hồi, vảy tấm bì (placoid scales) và cảm biến điện từ Lorenzeni.',
    keyInnovationEn: 'Elastic cartilaginous endoskeleton, dermal denticles, and ampullae of Lorenzini electroreception.',
    ancestralForm: 'Cladoselache / Elegestolepis',
    icon: '🦈',
  },
  Actinopterygii: {
    divergenceMya: 425,
    epochVi: 'Kỷ Silur (425 Triệu năm)',
    epochEn: 'Silurian Period (425 Ma)',
    keyInnovationVi: 'Bộ xương cốt hóa bằng vôi, vây tia có tia vây linh hoạt, bong bóng cá điều tiết độ nổi.',
    keyInnovationEn: 'Ossified bone skeleton, lepidotrichia fin rays, and gas bladder hydrostatic buoyancy control.',
    ancestralForm: 'Andreolepis hedei',
    icon: '🐟',
  },
  Insecta: {
    divergenceMya: 480,
    epochVi: 'Kỷ Ordovic sớm (480 Triệu năm)',
    epochEn: 'Early Ordovician (480 Ma)',
    keyInnovationVi: 'Cơ thể 3 phần (Đầu - Ngực - Bụng), 6 chân có khớp, sinh vật đầu tiên trên Trái Đất tiến hóa cánh bay.',
    keyInnovationEn: 'Three-part body plan, hexapod legs, first organisms on Earth to evolve powered winged flight.',
    ancestralForm: 'Rhyniella praecursor',
    icon: '🐝',
  },
  Cephalopoda: {
    divergenceMya: 500,
    epochVi: 'Kỷ Cambri muộn (500 Triệu năm)',
    epochEn: 'Late Cambrian (500 Ma)',
    keyInnovationVi: 'Hệ thần kinh tập trung bậc cao, mắt có thấu kính tinh vi (camera eye) không có điểm mù, khả năng đổi màu sắc tế bào sắc tố.',
    keyInnovationEn: 'Advanced centralized cephalization, complex lens-bearing camera eye with zero blind spot, chromatophore camouflage.',
    ancestralForm: 'Plectronoceras cambria',
    icon: '🦑',
  },
};

const ORDER_EVOLUTION_META: Record<string, { divergenceMya: number; descVi: string; descEn: string }> = {
  Carnivora: { divergenceMya: 55, descVi: 'Răng nanh bén nhọn, khối cơ cắn phát triển và bộ răng hàm biến thành răng xé thịt (carnassial).', descEn: 'Adapted carnassial shear teeth, hypertrophied temporalis masticatory musculature.' },
  Cetacea: { divergenceMya: 50, descVi: 'Tổ tiên 4 chân trên cạn (Pakicetus) di cư xuống biển, chi trước biến thành vây bơi, chi sau tiêu biến thành xương chậu thoái hóa.', descEn: 'Terrestrial artiodactyl ancestor (Pakicetus) reinvaded ocean; forelimbs remodeled into hydrofoils, hindlimbs vestigialized.' },
  Artiodactyla: { divergenceMya: 55, descVi: 'Động vật móng guốc chẵn (ngón số 3 và 4 chịu lực), dạ dày 4 ngăn lên men dạ cỏ tiêu hóa cellulose thô.', descEn: 'Paraxonic even-toed ungulates with 4-chambered ruminant foregut fermenting tough cellulose.' },
  Perissodactyla: { divergenceMya: 55, descVi: 'Động vật móng guốc lẻ (ngón số 3 chịu lực trọng tâm), tiêu hóa lên men manh tràng ruột sau.', descEn: 'Mesaxonic odd-toed ungulates with hindgut caecal fermentation.' },
  Primates: { divergenceMya: 65, descVi: 'Mắt hướng về phía trước có thị giác chiều sâu 3D, ngón tay đối diện có vân tay cầm nắm cành cây, vỏ não phát triển.', descEn: 'Forward-facing stereoscopic binocular vision, opposable pollex grasping thumbs, expanded neocortex.' },
  Proboscidea: { divergenceMya: 60, descVi: 'Mũi và môi trên kéo dài thành vòi cơ linh hoạt gồm hơn 40.000 bó cơ, răng cửa trên biến đổi thành ngà dài.', descEn: 'Hypertrophied muscular proboscis with 40,000+ muscle fascicles, elongated tusk incisors.' },
  Chiroptera: { divergenceMya: 52, descVi: 'Chi trước biến thành màng cánh bay lượn hoàn chỉnh, hệ thống định vị tiếng vang (echolocation) tần số cao.', descEn: 'Elongated digit phalanges supporting dactylopatagium wing membranes, ultrasonic bio-sonar echolocation.' },
  Rodentia: { divergenceMya: 60, descVi: 'Hai cặp răng cửa tự mài sắc, mọc dài liên tục suốt đời để gặm nhấm hạt và vỏ cây cứng.', descEn: 'Continuously growing, open-rooted chisel incisors with reinforced anterior enamel.' },
  Accipitriformes: { divergenceMya: 50, descVi: 'Mỏ khoằm xé mồi sắc bén, thị giác phân giải gấp 4-8 lần con người, móng vuốt cong kẹp chặt con mồi.', descEn: 'Hooked tearing beaks, ultra-high retinal fovea visual acuity 4-8x humans, curved talons.' },
  Sphenisciformes: { divergenceMya: 62, descVi: 'Cánh tiêu biến thành vây bơi đặc quánh chịu áp lực nước sâu, xương nặng đặc giảm độ nổi để lặn săn cá.', descEn: 'Wings stiffened into rigid underwater hydrofoils, dense pachyostotic bones for diving ballast.' },
  Squamata: { divergenceMya: 240, descVi: 'Khớp sọ linh động (streptostyly) có thể mở rộng nuốt mồi to hơn đầu, cơ quan Jacobson thụ cảm mùi bằng lưỡi chẻ.', descEn: 'Kinetic skull streptostylic joint swallows prey exceeding cranial girth, bifurcated tongue Jacobson organ.' },
  Testudines: { divergenceMya: 230, descVi: 'Xương sườn và đốt sống mở rộng hợp nhất tạo thành mai (carapace) và yếm (plastron) bọc toàn bộ cơ quan nội tạng.', descEn: 'Ribs and thoracic vertebrae expanded and fused into an osseous carapace and ventral plastron shield.' },
  Crocodylia: { divergenceMya: 235, descVi: 'Hộp sọ kiên cố với lực cắn hàng đầu giới sinh vật, tim 4 ngăn hoàn chỉnh có lỗ Panizza điều hòa oxy khi lặn.', descEn: 'Massive robust skull generating colossal bite force, 4-chambered heart with Foramen of Panizza shunt.' },
  Anura: { divergenceMya: 200, descVi: 'Chi sau dài gấp nhiều lần thân thể chuyên hóa cho những cú nhảy bứt tốc, biến thái từ nòng nọc mang sang ếch phổi.', descEn: 'Elongated saltatorial hindlimbs with urostyle pelvic rod, aquatic tadpole to terrestrial adult metamorphosis.' },
  Lamniformes: { divergenceMya: 140, descVi: 'Hệ tuần hoàn trao đổi nhiệt ngược dòng (rete mirabile) giữ cơ bắp ấm hơn nước biển, răng thay thế liên tục vô tận.', descEn: 'Countercurrent vascular heat exchangers (rete mirabile) keeping core swimming muscles warm, serial polyphyodont teeth.' }
};

// --- PALEOGEOGRAPHIC MAP SPECIMEN DATA STRUCTURES ---

export interface PaleomapSpecimenPoint {
  id: string;
  nameVi: string;
  nameEn: string;
  scientific: string;
  icon: string;
  x: number; // 0 to 1000 SVG coordinates
  y: number; // 0 to 500 SVG coordinates
  paleoLocationVi: string;
  paleoLocationEn: string;
  habitatVi: string;
  habitatEn: string;
  distributionVi: string;
  distributionEn: string;
  descendantNameVi?: string;
  descendantNameEn?: string;
  descendantSlug?: string;
}

export interface PaleomapData {
  supercontinentVi: string;
  supercontinentEn: string;
  oceanVi: string;
  oceanEn: string;
  climateZoneVi: string;
  climateZoneEn: string;
  landmassPath: string; // SVG path defining the continental shapes
  shallowSeasPath?: string; // SVG path for coastal shallow waters
  iceCapsPath?: string; // SVG path for polar glaciers
  specimens: PaleomapSpecimenPoint[];
}

export interface GeologicalEpoch {
  id: string;
  nameVi: string;
  nameEn: string;
  timeRange: string;
  myaStart: number;
  myaEnd: number;
  highlightAncestorVi: string;
  highlightAncestorEn: string;
  ancestorTaxon: string;
  geologicalContextVi: string;
  geologicalContextEn: string;
  evolutionaryLeapVi: string;
  evolutionaryLeapEn: string;
  extinctionEvent?: {
    nameVi: string;
    nameEn: string;
    impactVi: string;
    impactEn: string;
  };
  connectedSpeciesSlugs: string[];
  paleoMap: PaleomapData;
}

const GEOLOGICAL_EPOCHS: GeologicalEpoch[] = [
  {
    id: 'cambrian',
    nameVi: 'Kỷ Cambri - Vụ Nổ Sinh Giới',
    nameEn: 'Cambrian Explosion',
    timeRange: '541 - 485 Ma (Triệu năm trước)',
    myaStart: 541,
    myaEnd: 485,
    highlightAncestorVi: 'Pikaia & Haikouichthys (Tổ tiên Dây sống)',
    highlightAncestorEn: 'Pikaia gracilens & Haikouichthys ercaicunensis',
    ancestorTaxon: 'Proto-Chordata',
    geologicalContextVi: 'Đại dương nông ấm áp giàu oxy hòa tan; các ngành động vật đa bào bùng nổ chỉ trong vòng chưa đầy 25 triệu năm.',
    geologicalContextEn: 'Warm shallow seas saturated with dissolved oxygen; almost all major animal body architectures emerged in 25 million years.',
    evolutionaryLeapVi: 'Sự hình thành Dây sống lưng (notochord), mắt phân giải cao sơ khai, vỏ cứng bảo vệ và cơ chế săn mồi chủ động.',
    evolutionaryLeapEn: 'Invention of dorsal notochord, bilateral visual eyes, protective biomineralized shells, and active predatory pursuit.',
    connectedSpeciesSlugs: ['octopus-vulgaris', 'sepia-officinalis', 'asterias-rubens', 'acanthaster-planci', 'strongylocentrotus-purpuratus'],
    paleoMap: {
      supercontinentVi: 'Quần đảo Laurentia, Baltica & Vành đai Gondwana Cổ',
      supercontinentEn: 'Proto-Gondwana & Laurentian Island Arc System',
      oceanVi: 'Siêu Đại dương Toàn cầu Panthalassa & Biển Iapetus',
      oceanEn: 'Global Panthalassa Ocean & Iapetus Seaway',
      climateZoneVi: 'Khí hậu nhà kính ấm áp, hầu như không có băng ở hai cực; biển nông xích đạo bao phủ phần lớn lục địa.',
      climateZoneEn: 'Super-greenhouse ice-free planet; vast shallow warm epicontinental shelves.',
      landmassPath: 'M 160 170 Q 230 150 290 190 Q 260 250 190 240 Z M 360 190 Q 430 170 470 210 Q 440 260 370 240 Z M 510 290 Q 660 240 830 310 Q 860 410 690 430 Q 560 410 490 350 Z M 660 150 Q 730 130 770 170 Q 740 210 670 190 Z',
      shallowSeasPath: 'M 140 150 Q 250 130 310 180 Q 280 270 170 260 Z M 490 270 Q 680 220 850 290 Q 880 430 670 450 Q 540 430 470 340 Z',
      specimens: [
        {
          id: 'cb_1',
          nameVi: 'Haikouichthys ercaicunensis',
          nameEn: 'Haikouichthys (First Vertebrate Fish)',
          scientific: 'Haikouichthys ercaicunensis',
          icon: '🐟',
          x: 720,
          y: 170,
          paleoLocationVi: 'Rạn đá ngầm Trừng Giang (Chengjiang, Nam Trung Hoa Cổ)',
          paleoLocationEn: 'Chengjiang Lagerstätte (South China Shelf)',
          habitatVi: 'Biển nông xích đạo, bơi uốn lượn lơ lửng gần đáy bùn.',
          habitatEn: 'Shallow equatorial shelf, undulating above microbial mats.',
          distributionVi: 'Mẫu vật dài 2.5 cm, sở hữu cột sống sụn sơ khai, vây lưng và mắt thấu kính đầu tiên trên Trái Đất.',
          distributionEn: '2.5cm proto-fish with earliest cartilaginous vertebral column, dorsal fin, and camera eyes.',
          descendantNameVi: 'Cá sụn & Toàn bộ Động vật Có xương sống',
          descendantNameEn: 'Chondrichthyes & Vertebrates',
          descendantSlug: 'carcharodon-carcharias',
        },
        {
          id: 'cb_2',
          nameVi: 'Pikaia & Anomalocaris',
          nameEn: 'Pikaia & Anomalocaris (Apex Apex Predator)',
          scientific: 'Anomalocaris canadensis',
          icon: '🦐',
          x: 220,
          y: 200,
          paleoLocationVi: 'Đới sạt trượt Burgess Shale, Biển Laurentia (Bắc Mỹ Cổ)',
          paleoLocationEn: 'Burgess Shale, Laurentian Shelf (Ancient North America)',
          habitatVi: 'Rìa thềm lục địa sâu giàu sinh vật trôi dạt.',
          habitatEn: 'Deep-water carbonate reef escarpment.',
          distributionVi: 'Quái vật săn mồi đầu bảng dài 1 mét với hai càng cuộn gai và mắt kép phân giải cao săn bọ ba thùy.',
          distributionEn: '1-meter apex carnivore with segmented spiked grasping appendages and compound eyes.',
          descendantNameVi: 'Tôm hùm & Động vật Chân khớp',
          descendantNameEn: 'American Lobster & Arthropods',
          descendantSlug: 'homarus-americanus',
        },
        {
          id: 'cb_3',
          nameVi: 'Trilobita (Bọ Ba Thùy Nguyên Thủy)',
          nameEn: 'Primitive Trilobites (Olenellus)',
          scientific: 'Olenellus thompsoni',
          icon: '🪲',
          x: 620,
          y: 350,
          paleoLocationVi: 'Thềm lục địa Proto-Gondwana (Australia & Nam Cực Cổ)',
          paleoLocationEn: 'Proto-Gondwana Marine Shelf',
          habitatVi: 'Đáy bùn biển cát giàu khoáng chất.',
          habitatEn: 'Benthic sandy substrate and microbial reefs.',
          distributionVi: 'Loài bò đáy thống trị đại dương Cambri với mắt khoáng calcite và lớp giáp chitin phân đốt.',
          distributionEn: 'Ubiquitous benthic scavengers equipped with mineralized calcite lenses and rigid exoskeletons.',
          descendantNameVi: 'Sam biển (Hóa thạch sống)',
          descendantNameEn: 'Atlantic Horseshoe Crab',
          descendantSlug: 'limulus-polyphemus',
        },
      ],
    },
  },
  {
    id: 'devonian',
    nameVi: 'Kỷ Devon - Kỷ Nguyên Loài Cá & Bước Lên Cạn',
    nameEn: 'Devonian - The Age of Fishes & First Steps on Land',
    timeRange: '419 - 359 Ma',
    myaStart: 419,
    myaEnd: 359,
    highlightAncestorVi: 'Tiktaalik roseae (Mắt xích Cá sang Tứ túc)',
    highlightAncestorEn: 'Tiktaalik roseae (The Fishapod)',
    ancestorTaxon: 'Tetrapodomorpha',
    geologicalContextVi: 'Khí hậu nhiệt đới ẩm, đại dương ngự trị bởi cá bọc giáp Placodermi khổng lồ; đầm lầy cạn ven biển thúc đẩy sinh vật hít thở không khí.',
    geologicalContextEn: 'Humid greenhouse earth; oceans ruled by armored placoderm apex hunters; hypoxic shallows drove air breathing.',
    evolutionaryLeapVi: 'Vây có tia vây biến đổi thành xương chi có khớp cổ tay và ngón (Pentadactyl limb), phát triển phổi thở khí trời tự do.',
    evolutionaryLeapEn: 'Pectoral fins remodeled into weight-bearing wrist joints and digits; air-breathing primitive lungs.',
    connectedSpeciesSlugs: ['carcharodon-carcharias', 'rhincodon-typus', 'ambystoma-mexicanum', 'andrias-davidianus', 'rana-temporaria'],
    extinctionEvent: {
      nameVi: 'Đại Tuyệt Chủng Kỷ Devon Muộn (Late Devonian Extinction)',
      nameEn: 'Late Devonian Extinction (~372 Ma)',
      impactVi: 'Thiếu hụt oxy đại dương xóa sổ 70-80% loài biển, mở đường cho động vật 4 chân lan rộng lên lục địa.',
      impactEn: 'Severe ocean anoxia wiped out 75% of marine taxa, paving the evolutionary highway for land colonization.',
    },
    paleoMap: {
      supercontinentVi: 'Lục địa Euramerica (Old Red Sandstone) & Gondwana',
      supercontinentEn: 'Euramerica (Old Red Continent) & Gondwana Collision',
      oceanVi: 'Đại dương Rheic & Panthalassa',
      oceanEn: 'Rheic Ocean & Panthalassa Basin',
      climateZoneVi: 'Ấm ẩm xích đạo; rừng cây thân gỗ sơ khai (Archaeopteris) bắt đầu hấp thụ CO2 tạo lớp đất bùn đầu tiên.',
      climateZoneEn: 'Equatorial wet tropical; first progymnosperm forests stabilizing coastal floodplains.',
      landmassPath: 'M 190 130 Q 330 110 430 160 Q 400 270 260 260 Q 190 220 190 130 Z M 490 230 Q 710 190 860 270 Q 890 420 660 450 Q 500 410 470 310 Z',
      shallowSeasPath: 'M 160 110 Q 350 90 450 150 Q 420 300 240 280 Z',
      specimens: [
        {
          id: 'dv_1',
          nameVi: 'Tiktaalik roseae (Cá Bò Lên Cạn)',
          nameEn: 'Tiktaalik roseae (The Fishapod)',
          scientific: 'Tiktaalik roseae',
          icon: '🦎',
          x: 250,
          y: 140,
          paleoLocationVi: 'Hệ thống sông ngòi Đảo Ellesmere, Bắc Cực Cổ Canada',
          paleoLocationEn: 'Ellesmere Island River Delta, Ancient Canada',
          habitatVi: 'Đầm lầy cạn nước ngọt nghèo oxy ven biển xích đạo.',
          habitatEn: 'Hypoxic shallow freshwater meander rivers.',
          distributionVi: 'Sở hữu cổ xoay linh hoạt tách khỏi vai, vây ngực có xương cổ tay và xương ngón có thể nâng đỡ nửa thân trên bò lên bờ.',
          distributionEn: 'Possessed a mobile neck distinct from shoulders, wrist joints, and primitive lungs for crawling out of water.',
          descendantNameVi: 'Kỳ giông Axolotl & Lớp Lưỡng Cư',
          descendantNameEn: 'Axolotl & Amphibians',
          descendantSlug: 'ambystoma-mexicanum',
        },
        {
          id: 'dv_2',
          nameVi: 'Dunkleosteus terrelli (Quái Thú Cá Bọc Thép)',
          nameEn: 'Dunkleosteus (Armored Placoderm Apex)',
          scientific: 'Dunkleosteus terrelli',
          icon: '🦈',
          x: 370,
          y: 210,
          paleoLocationVi: 'Biển Nông Nội Địa Bắc Mỹ & Tây Âu Cổ',
          paleoLocationEn: 'Euramerican Inland Epicontinental Seaway',
          habitatVi: 'Biển sâu trung bình và vịnh mở.',
          habitatEn: 'Pelagic and nearshore marine ecosystems.',
          distributionVi: 'Dài tới 9 mét, nặng 4 tấn với đầu bọc giáp xương thép và phiến xương sắc như dao cạo với lực cắn khủng khiếp nhất thời bấy giờ.',
          distributionEn: '9-meter armored hypercarnivore delivering 5,000 N shear bite force with self-sharpening gnathal plates.',
          descendantNameVi: 'Cá mập trắng lớn',
          descendantNameEn: 'Great White Shark',
          descendantSlug: 'carcharodon-carcharias',
        },
        {
          id: 'dv_3',
          nameVi: 'Latimeria & Sarcopterygii (Cá Vây Tay)',
          nameEn: 'Gogo Sarcopterygian Lungfish',
          scientific: 'Gogonasus andrewsae',
          icon: '🐟',
          x: 770,
          y: 330,
          paleoLocationVi: 'Rạn San Hô Cổ Gogo, Tây Úc',
          paleoLocationEn: 'Gogo Fossil Reef, Western Australia',
          habitatVi: 'Rạn san hô đá vôi nhiệt đới ấm áp.',
          habitatEn: 'Thriving tropical barrier reef lagoon.',
          distributionVi: 'Cá có vây cơ bắp gắn vào đai hông và đai vai, tiền thân giải phẫu của 4 chân động vật có xương sống trên cạn.',
          distributionEn: 'Lobe-finned fish preserving exquisite 3D internal anatomy of humerus and radius precursors.',
          descendantNameVi: 'Cá Coelacanth Hóa Thạch Sống',
          descendantNameEn: 'Living Coelacanth',
          descendantSlug: 'latimeria-chalumnae',
        },
      ],
    },
  },
  {
    id: 'carboniferous_permian',
    nameVi: 'Kỷ Than Đá & Kỷ Permi - Khai Sinh Trứng Màng Ối',
    nameEn: 'Carboniferous & Permian - The Amniote Revolution',
    timeRange: '359 - 252 Ma',
    myaStart: 359,
    myaEnd: 252,
    highlightAncestorVi: 'Dimetrodon (Tổ tiên Nhánh Thú Synapsida)',
    highlightAncestorEn: 'Dimetrodon grandis (Sphenacodontid Synapsid)',
    ancestorTaxon: 'Synapsida / Amniota',
    geologicalContextVi: 'Rừng đầm lầy than đá khổng lồ đẩy nồng độ oxy khí quyển lên tới 35%; hình thành siêu lục địa Pangea.',
    geologicalContextEn: 'Sprawling swamp forests spiked atmospheric oxygen to 35%; assembly of supercontinent Pangea with arid inland deserts.',
    evolutionaryLeapVi: 'Trứng màng ối (Amniotic Egg) giải phóng sinh vật khỏi sự phụ thuộc vào ao hồ để sinh sản; da vảy sừng ngăn thoát nước.',
    evolutionaryLeapEn: 'Cleidoic amniotic egg emancipated terrestrial vertebrates from water for reproduction; keratinized desiccation-proof skin.',
    connectedSpeciesSlugs: ['crocodylus-porosus', 'alligator-mississippiensis', 'varanus-komodoensis', 'chelonia-mydas'],
    extinctionEvent: {
      nameVi: 'Đại Tuyệt Chủng Permi-Trias (The Great Dying - 252 Ma)',
      nameEn: 'Permian-Triassic Extinction (The Great Dying)',
      impactVi: 'Núi lửa bẫy đá Siberia phun trào khiến 95% sinh vật biển và 70% sinh vật trên cạn diệt vong hoàn toàn.',
      impactEn: 'Siberian Traps mega-volcanism eradicated 96% of marine species and 70% of land vertebrates.',
    },
    paleoMap: {
      supercontinentVi: 'SIÊU LỤC ĐỊA PANGEA DUY NHẤT (THE SUPERCONTINENT PANGEA)',
      supercontinentEn: 'Single Supercontinent Pangea',
      oceanVi: 'Đại dương Khổng lồ Panthalassa & Vịnh Tethys Cổ',
      oceanEn: 'Vast Panthalassa & Paleo-Tethys Bay',
      climateZoneVi: 'Vành đai đầm lầy xích đạo siêu oxy hóa nhường chỗ cho hoang mạc khô cằn khắc nghiệt ở vùng trung tâm siêu lục địa Pangea.',
      climateZoneEn: 'Equatorial hyperoxic coal swamps evolving into hyper-arid red desert interiors.',
      landmassPath: 'M 350 60 Q 530 50 590 110 Q 490 170 430 210 Q 390 260 450 300 Q 550 330 690 310 Q 650 420 470 450 Q 330 430 290 330 Q 270 210 310 120 Z',
      shallowSeasPath: 'M 400 240 Q 550 280 660 270 Q 580 340 450 320 Z',
      iceCapsPath: 'M 330 410 Q 470 430 630 400 Q 530 460 380 450 Z',
      specimens: [
        {
          id: 'cp_1',
          nameVi: 'Dimetrodon grandis (Tổ Tiên Nhánh Thú)',
          nameEn: 'Dimetrodon grandis (Stem-Mammal)',
          scientific: 'Dimetrodon grandis',
          icon: '🦁',
          x: 350,
          y: 200,
          paleoLocationVi: 'Bãi Đất Đỏ Texas Red Beds (Nội Địa Pangea)',
          paleoLocationEn: 'Texas Red Beds (Pangea Equatorial Basin)',
          habitatVi: 'Đồng bằng đất trũng bán khô hạn xích đạo.',
          habitatEn: 'Semi-arid floodplain and ephemeral river margins.',
          distributionVi: 'Thú bò sát Synapsid có "cánh buồm" xương sống điều hòa thân nhiệt và răng nanh phân hóa chuyên biệt.',
          distributionEn: 'Carnivorous synapsid with dorsal neural spine sail for thermoregulation and differentiated heterodont teeth.',
          descendantNameVi: 'Hổ & Toàn bộ Lớp Thú hiện đại',
          descendantNameEn: 'Tiger & All Living Mammals',
          descendantSlug: 'panthera-tigris',
        },
        {
          id: 'cp_2',
          nameVi: 'Arthropleura & Meganeura (Côn Trùng Khổng Lồ)',
          nameEn: 'Arthropleura (Giant Millipede)',
          scientific: 'Arthropleura armata',
          icon: '🐛',
          x: 430,
          y: 150,
          paleoLocationVi: 'Rừng Dương Xỉ Đầm Lầy Than Đá, Châu Âu Pangea',
          paleoLocationEn: 'Equatorial Coal Forest Basin, Pangea',
          habitatVi: 'Rừng đầm lầy rậm rạp nồng độ oxy đạt mức kỷ lục 35%.',
          habitatEn: 'Hyperoxic lepidodendron swamp canopy.',
          distributionVi: 'Rết nhiều chân dài 2.5 mét nặng 50 kg bò lướt qua thảm lá mục; chuồn chuồn Meganeura sải cánh 70 cm săn mồi trên không.',
          distributionEn: '2.5-meter giant myriapod crawling through peat swamps fueled by 35% atmospheric oxygen.',
          descendantNameVi: 'Rết khổng lồ châu Á',
          descendantNameEn: 'Giant Asian Centipede',
          descendantSlug: 'scolopendra-subspinipes',
        },
        {
          id: 'cp_3',
          nameVi: 'Scutosaurus & Thú Bò Sát Phương Bắc',
          nameEn: 'Scutosaurus (Armored Pareiasaur)',
          scientific: 'Scutosaurus karpinskii',
          icon: '🦏',
          x: 490,
          y: 100,
          paleoLocationVi: 'Lưu Vực Sông Bắc Dvina, Nga (Phía Bắc Pangea)',
          paleoLocationEn: 'Northern Pangea River Basins, Urals',
          habitatVi: 'Vùng đất trũng khô cằn cận cực bắc.',
          habitatEn: 'High-latitude seasonal semi-deserts.',
          distributionVi: 'Bò sát bọc vảy giáp xương nặng 1.5 tấn ăn rễ cây khô và thực vật gai góc.',
          distributionEn: 'Heavily osteoderm-armored 1.5-ton herbivore adapted to grinding abrasive desert vegetation.',
          descendantNameVi: 'Rùa cạn & Rùa biển',
          descendantNameEn: 'Green Sea Turtle',
          descendantSlug: 'chelonia-mydas',
        },
      ],
    },
  },
  {
    id: 'mesozoic',
    nameVi: 'Đại Trung Sinh - Khủng Long, Chim & Thú Sơ Khai',
    nameEn: 'Mesozoic - Dinosaurs, Early Mammals & First Birds',
    timeRange: '252 - 66 Ma',
    myaStart: 252,
    myaEnd: 66,
    highlightAncestorVi: 'Archaeopteryx & Morganucodon',
    highlightAncestorEn: 'Archaeopteryx lithographica & Morganucodon watsoni',
    ancestorTaxon: 'Theropoda & Mammaliaformes',
    geologicalContextVi: 'Kỷ nguyên ấm nóng kéo dài, rừng lá kim và dương xỉ bao phủ địa cầu; khủng long thống trị tuyệt đối ổ sinh thái ban ngày.',
    geologicalContextEn: 'Prolonged greenhouse era; dinosaurs totally monopolized terrestrial diurnal niches, forcing proto-mammals into the night.',
    evolutionaryLeapVi: 'Tiến hóa lông vũ khí động học ở chim; thính giác siêu nhạy 3 xương tai, lông mao cách nhiệt và hằng nhiệt ở thú kiếm ăn đêm.',
    evolutionaryLeapEn: 'Aerodynamic feather flight in Avian dinosaurs; nocturnal acoustic acuity (3 middle ear bones) and endothermic pelage in mammals.',
    connectedSpeciesSlugs: ['haliaeetus-leucocephalus', 'aquila-chrysaetos', 'aptodytes-forsteri', 'bubo-scandiacus', 'ornithorhynchus-anatinus'],
    extinctionEvent: {
      nameVi: 'Đại Tuyệt Chủng K-Pg (K-Pg Asteroid Impact - 66 Ma)',
      nameEn: 'Cretaceous-Paleogene Extinction (66 Ma)',
      impactVi: 'Thiên thạch Chicxulub va chạm bán đảo Yucatan xóa sạch khủng long phi điểu, mở toang cánh cửa cho Lớp Thú trỗi dậy.',
      impactEn: 'Chicxulub asteroid impact eradicated non-avian dinosaurs, unlocking a vacant biosphere for mammalian radiation.',
    },
    paleoMap: {
      supercontinentVi: 'LAURASIA (BẮC MỸ / Á-ÂU) & GONDWANA (NAM MỸ / CHÂU PHI / ÚC)',
      supercontinentEn: 'Laurasia (North) & Gondwana (South) Continental Split',
      oceanVi: 'Biển Tethys Mở Rộng & Đại Tây Dương Sơ Khai',
      oceanEn: 'Widening Tethys Seaway & Proto-Atlantic Rift',
      climateZoneVi: 'Khí hậu nhiệt đới đồng đều từ xích đạo tới hai cực; không có chỏm băng vĩnh cửu; rừng lá kim rậm rạp.',
      climateZoneEn: 'Equable warm greenhouse globally; lush conifers and ferns reaching the polar circles.',
      landmassPath: 'M 140 100 Q 320 90 400 140 Q 360 220 220 230 Q 150 190 130 130 Z M 440 100 Q 760 80 840 150 Q 780 230 600 240 Q 480 200 440 140 Z M 220 270 Q 340 270 340 380 Q 280 450 220 410 Z M 440 260 Q 600 250 580 380 Q 520 440 440 370 Z M 720 340 Q 840 330 840 430 Q 760 450 700 390 Z',
      shallowSeasPath: 'M 350 130 Q 480 180 580 200 Q 460 240 340 220 Z',
      specimens: [
        {
          id: 'mz_1',
          nameVi: 'Archaeopteryx lithographica (Chim Đầu Tiên)',
          nameEn: 'Archaeopteryx (The First Feathered Bird)',
          scientific: 'Archaeopteryx lithographica',
          icon: '🦅',
          x: 520,
          y: 160,
          paleoLocationVi: 'Quần Đảo Đầm Phá Solnhofen, Đức (Laurasia Châu Âu)',
          paleoLocationEn: 'Solnhofen Archipelago Lagoons, Germany',
          habitatVi: 'Quần đảo san hô bán khô hạn với các đầm nước mặn yên bình.',
          habitatEn: 'Hypersaline arid island archipelago with calm lagoons.',
          distributionVi: 'Hóa thạch chuyển tiếp vĩ đại: Đôi cánh lông vũ hoàn chỉnh giúp lướt gió nhưng vẫn giữ hàm răng nhọn và móng vuốt trên cánh.',
          distributionEn: 'The iconic transitional fossil displaying asymmetric flight feathers, clawed wing digits, and sharp dinosaurian teeth.',
          descendantNameVi: 'Đại bàng vàng & Lớp Chim hiện đại',
          descendantNameEn: 'Golden Eagle & All Modern Birds',
          descendantSlug: 'aquila-chrysaetos',
        },
        {
          id: 'mz_2',
          nameVi: 'Morganucodon & Thú Kiếm Ăn Đêm',
          nameEn: 'Morganucodon (Nocturnal Mammaliaform)',
          scientific: 'Morganucodon watsoni',
          icon: '🐀',
          x: 230,
          y: 140,
          paleoLocationVi: 'Lục Địa Đảo Laramidia (Tây Bắc Mỹ Cổ)',
          paleoLocationEn: 'Laramidian Subtropical Woodland',
          habitatVi: 'Hang hốc và gốc cây dương xỉ cổ dưới bóng của Khủng long.',
          habitatEn: 'Subterranean burrows and leaf litter under dinosaur feet.',
          distributionVi: 'Thú cổ nhỏ bằng chuột, tiến hóa lông mao cách nhiệt và tai giữa siêu nhạy để săn côn trùng trong bóng đêm.',
          distributionEn: 'Tiny shrew-sized ancestor that evolved endothermy, pelage, and 3 middle ear bones for nocturnal foraging.',
          descendantNameVi: 'Khỉ & Động vật Linh trưởng',
          descendantNameEn: 'Chimpanzee & Primates',
          descendantSlug: 'pan-troglodytes',
        },
        {
          id: 'mz_3',
          nameVi: 'Ornithorhynchus Ancestor (Thú Đơn Huyệt Cổ)',
          nameEn: 'Steropodon (Gondwana Monotreme)',
          scientific: 'Steropodon galmani',
          icon: '🦆',
          x: 780,
          y: 390,
          paleoLocationVi: 'Rừng Lá Rộng Nam Cực - Úc (Đông Gondwana)',
          paleoLocationEn: 'Lightning Ridge, Ancient Australia-Antarctica',
          habitatVi: 'Hồ nước ngọt vùng cực ôn đới ẩm ướt.',
          habitatEn: 'Cool temperate polar floodplain river.',
          distributionVi: 'Nhánh thú đẻ trứng sơ khai phân lập tại vùng đất cô lập Gondwana, giữ nguyên cơ chế đẻ trứng và thụ cảm điện từ ở mỏ.',
          distributionEn: 'Basal egg-laying monotreme developing electroreceptive bills in isolated southern Gondwanan waters.',
          descendantNameVi: 'Thú mỏ vịt độc đáo',
          descendantNameEn: 'Platypus',
          descendantSlug: 'ornithorhynchus-anatinus',
        },
      ],
    },
  },
  {
    id: 'cenozoic_early',
    nameVi: 'Đại Tân Sinh Sớm - Bùng Nổ Thích Nghi Của Lớp Thú',
    nameEn: 'Early Cenozoic - The Adaptive Radiation of Mammals',
    timeRange: '66 - 2.6 Ma',
    myaStart: 66,
    myaEnd: 2.6,
    highlightAncestorVi: 'Pakicetus (Tổ tiên Cá voi) & Moeritherium (Tổ tiên Voi)',
    highlightAncestorEn: 'Pakicetus inachus & Moeritherium lyonsi',
    ancestorTaxon: 'Archaeoceti & Proboscidea',
    geologicalContextVi: 'Các mảng lục địa trôi dạt về vị trí hiện đại; rừng rậm dần nhường chỗ cho thảo nguyên cỏ bao la (savanna).',
    geologicalContextEn: 'Continents drifted to modern configurations; cooling climate shifted dense jungles into vast open grassy savannas.',
    evolutionaryLeapVi: 'Não bộ vỏ mới (Neocortex) bành trướng; tổ tiên cá voi chuyển từ cạn xuống biển; răng nanh và vuốt thú săn mồi phân hóa tột bậc.',
    evolutionaryLeapEn: 'Massive encephalization of the neocortex; evolutionary return of cetaceans to the sea; extreme dental carnassial specialization.',
    connectedSpeciesSlugs: ['balaenoptera-musculus', 'orcinus-orca', 'elephas-maximus', 'loxodonta-africana', 'panthera-tigris', 'panthera-leo'],
    paleoMap: {
      supercontinentVi: 'CÁC LỤC ĐỊA TRÔI DẠT & BIỂN TETHYS DẦN KHÉP LẠI',
      supercontinentEn: 'Modernizing Continents & Tethys Closure',
      oceanVi: 'Đại Tây Dương Rộng Mở & Dòng Hải Lưu Vòng Nam Cực',
      oceanEn: 'Circum-Antarctic Current & Atlantic Expansion',
      climateZoneVi: 'Trái Đất bắt đầu hạ nhiệt sau đợt cực nhiệt Eocene (PETM); đồng cỏ savanna thay thế rừng rậm xích đạo.',
      climateZoneEn: 'Cooling from the PETM thermal maximum; expansion of open grasslands and savannas.',
      landmassPath: 'M 120 80 Q 260 70 320 130 Q 280 220 180 230 Z M 420 90 Q 780 70 860 160 Q 800 240 620 230 Q 480 210 420 140 Z M 230 260 Q 330 260 320 390 Q 270 450 210 390 Z M 440 220 Q 580 210 570 370 Q 510 420 440 340 Z M 640 220 Q 690 200 700 260 Q 660 270 640 240 Z M 750 330 Q 860 320 870 400 Q 800 430 740 380 Z',
      shallowSeasPath: 'M 480 200 Q 640 180 670 230 Q 560 250 470 230 Z',
      specimens: [
        {
          id: 'cz_1',
          nameVi: 'Pakicetus inachus (Tổ Tiên Cá Voi 4 Chân)',
          nameEn: 'Pakicetus inachus (Amphibious Proto-Cetacean)',
          scientific: 'Pakicetus inachus',
          icon: '🐋',
          x: 650,
          y: 200,
          paleoLocationVi: 'Bờ Biển Nông Tethys, Pakistan Cổ (Nam Á)',
          paleoLocationEn: 'Kuldana Formation, Ancient Pakistan',
          habitatVi: 'Vùng nước lợ ven cửa sông và vịnh Tethys cạn.',
          habitatEn: 'Hypersaline shallow estuaries of the narrowing Tethys.',
          distributionVi: 'Thú ăn thịt 4 chân lội nước săn cá; xương tai trong dày đặc (involucrum) chuyên hóa thu âm dưới nước - bước đầu chuyển từ cạn xuống đại dương!',
          distributionEn: 'Quadrupedal land mammal diving for fish; thick auditory bulla involucrum adapted for underwater acoustics.',
          descendantNameVi: 'Cá voi xanh & Cá voi sát thủ',
          descendantNameEn: 'Blue Whale & Orca',
          descendantSlug: 'balaenoptera-musculus',
        },
        {
          id: 'cz_2',
          nameVi: 'Moeritherium lyonsi (Tổ Tiên Cổ Của Loài Voi)',
          nameEn: 'Moeritherium (Basal Proboscidean)',
          scientific: 'Moeritherium lyonsi',
          icon: '🐘',
          x: 500,
          y: 230,
          paleoLocationVi: 'Đầm Lầy Rừng Ngập Mặn Faiyum, Ai Cập (Bắc Phi Cổ)',
          paleoLocationEn: 'Qasr el Sagha Formation, Faiyum, Egypt',
          habitatVi: 'Đầm lầy nhiệt đới nước ngọt và rừng đước ven biển.',
          habitatEn: 'Tropical river swamps and coastal mangrove lagoons.',
          distributionVi: 'Kích thước như heo vòi (dài 2m), sống bán thủy sinh; môi trên và mũi bắt đầu kéo dài thành vòi ngắn để hít thở khi lặn ngập dưới nước.',
          distributionEn: 'Tapir-like semi-aquatic feeder with elongated upper lip and incisor tusks browsing aquatic flora.',
          descendantNameVi: 'Voi châu Á & Voi châu Phi',
          descendantNameEn: 'Asian & African Elephants',
          descendantSlug: 'elephas-maximus',
        },
        {
          id: 'cz_3',
          nameVi: 'Miacidae & Pseudaelurus (Tổ Tiên Họ Mèo)',
          nameEn: 'Pseudaelurus (First True Felid)',
          scientific: 'Pseudaelurus lorteti',
          icon: '🐅',
          x: 520,
          y: 130,
          paleoLocationVi: 'Rừng Thảo Nguyên Ôn Đới Sansan, Pháp (Tây Á-Âu)',
          paleoLocationEn: 'Sansan Basin, France (Eurasian Forest Mosaic)',
          habitatVi: 'Rừng cây thưa xen lẫn trảng cỏ savanna.',
          habitatEn: 'Temperate mixed woodland and savanna mosaic.',
          distributionVi: 'Thú săn mồi có vuốt co rút linh hoạt, răng hàm biến thành lưỡi kéo xé thịt (carnassial shear) - tổ tiên trực tiếp của tất cả loài Mèo lớn.',
          distributionEn: 'Slender digitigrade stalker with retractable claws and perfected shearing carnassials.',
          descendantNameVi: 'Hổ Bengal & Báo săn',
          descendantNameEn: 'Bengal Tiger & Cheetah',
          descendantSlug: 'panthera-tigris',
        },
      ],
    },
  },
  {
    id: 'quaternary',
    nameVi: 'Kỷ Đệ Tứ - Kỷ Băng Hà & Thú Khổng Lồ Pleistocene',
    nameEn: 'Quaternary - The Ice Ages & Pleistocene Megafauna',
    timeRange: '2.6 Ma - Hiện Tại',
    myaStart: 2.6,
    myaEnd: 0,
    highlightAncestorVi: 'Mammuthus primigenius & Smilodon',
    highlightAncestorEn: 'Woolly Mammoth & Saber-toothed Cat',
    ancestorTaxon: 'Mammuthus & Machairodontinae',
    geologicalContextVi: 'Chu kỳ băng hà - gian băng liên tục làm thay đổi mực nước biển; cầu đất Beringia nối liền các châu lục.',
    geologicalContextEn: 'Glacial-interglacial oscillations dynamically lowered sea levels, creating intercontinental land bridges.',
    evolutionaryLeapVi: 'Thích nghi cực hạn với giá rét (mỡ dày, lớp lông tơ kép), hành vi xã hội săn mồi theo đàn phối hợp cao độ.',
    evolutionaryLeapEn: 'Extreme cryo-insulation (thick adipose blubber and dense woolly underfur), complex cooperative pack sociality.',
    connectedSpeciesSlugs: ['ursus-maritimus', 'canis-lupus', 'pan-troglodytes', 'gorilla-beringei', 'bison-bison'],
    paleoMap: {
      supercontinentVi: 'KỶ BĂNG HÀ PLEISTOCENE - CẦU ĐẤT BERINGIA & THỀM LỤC ĐỊA SUNDA',
      supercontinentEn: 'Last Glacial Maximum - Beringia & Sunda Shelf Landbridges',
      oceanVi: 'Mực nước biển toàn cầu hạ thấp 120 mét; Băng bao phủ 30% lục địa',
      oceanEn: 'Sea Level Drop -120m; 30% Terrestrial Ice Sheets',
      climateZoneVi: 'Khí hậu khô lạnh cực hạn; thảo nguyên lãnh nguyên khô hạn (Mammoth Steppe) trải dài từ Tây Âu qua Siberia sang Alaska.',
      climateZoneEn: 'Arid hyper-cold; vast hyper-productive Mammoth Steppe spanning 10,000 miles.',
      landmassPath: 'M 110 90 Q 280 80 340 140 Q 290 240 170 240 Z M 410 90 Q 820 70 890 170 Q 820 250 640 250 Q 480 220 410 150 Z M 220 260 Q 320 260 310 400 Q 270 460 200 400 Z M 430 200 Q 580 200 580 380 Q 520 430 430 350 Z M 760 320 Q 870 310 880 410 Q 810 440 750 380 Z',
      iceCapsPath: 'M 110 50 Q 320 50 360 120 Q 240 150 120 120 Z M 430 50 Q 720 50 700 110 Q 560 120 440 90 Z',
      shallowSeasPath: 'M 880 90 Q 940 70 990 80 L 120 80 M 710 240 Q 770 260 760 310 Q 700 300 680 260 Z',
      specimens: [
        {
          id: 'qt_1',
          nameVi: 'Mammuthus primigenius (Voi Ma Mút Lông Xoăn)',
          nameEn: 'Woolly Mammoth (Beringian Keystone)',
          scientific: 'Mammuthus primigenius',
          icon: '🦣',
          x: 890,
          y: 90,
          paleoLocationVi: 'Cầu Đất Beringia Nối Siberia & Alaska',
          paleoLocationEn: 'Bering Land Bridge (Mammoth Steppe)',
          habitatVi: 'Thảo nguyên lãnh nguyên băng giá bão tuyết âm 60°C.',
          habitatEn: 'Permafrost dry mammoth steppe grassland.',
          distributionVi: 'Lớp mỡ dày 10 cm, lông mao kép dài 1 mét và cặp ngà xoắn khổng lồ dài 4 mét gạt tuyết kiếm cỏ khô.',
          distributionEn: '10cm adipose blubber, dense underwool, and 4-meter sweeping curved tusks clearing snow crusts.',
          descendantNameVi: 'Voi châu Á (Họ hàng gần nhất)',
          descendantNameEn: 'Asian Elephant (Closest Living Relative)',
          descendantSlug: 'elephas-maximus',
        },
        {
          id: 'qt_2',
          nameVi: 'Panthera tigris (Hổ Thềm Lục Địa Sunda)',
          nameEn: 'Sunda Tigers (Panthera tigris)',
          scientific: 'Panthera tigris',
          icon: '🐅',
          x: 730,
          y: 280,
          paleoLocationVi: 'Thềm Lục Địa Sunda Nối Liền Việt Nam - Mã Lai - Java - Sumatra',
          paleoLocationEn: 'Sunda Shelf Landmass (Indochina to Java Bridge)',
          habitatVi: 'Rừng mưa nhiệt đới gió mùa liên tục kết nối các hòn đảo.',
          habitatEn: 'Continuous continental tropical rainforest corridor.',
          distributionVi: 'Nhờ mực nước biển rút 120 mét lộ ra đồng bằng Sundaland khổng lồ, quần thể hổ di cư tự do từ Đông Dương qua Sumatra và Java tạo nên các phân loài trứ danh.',
          distributionEn: 'Lowered sea levels exposed Sundaland, allowing tiger lineages to migrate seamlessly across Southeast Asia.',
          descendantNameVi: 'Hổ Đông Dương & Hổ Bengal',
          descendantNameEn: 'Indochinese & Bengal Tiger',
          descendantSlug: 'panthera-tigris',
        },
        {
          id: 'qt_3',
          nameVi: 'Smilodon populator (Hổ Răng Kiếm Nam Mỹ)',
          nameEn: 'Smilodon populator (Saber-toothed Cat)',
          scientific: 'Smilodon populator',
          icon: '🐯',
          x: 280,
          y: 310,
          paleoLocationVi: 'Đồng Cỏ Thảo Nguyên Pampas, Nam Mỹ',
          paleoLocationEn: 'Pampas Savanna, South America',
          habitatVi: 'Thảo nguyên mở rộng lớn nhiều thú ăn cỏ khổng lồ.',
          habitatEn: 'Open pampas plains hunting giant ground sloths.',
          distributionVi: 'Cặp răng nanh hình thanh kiếm dài 28 cm cắn đứt yết hầu con mồi nặng hàng tấn chỉ trong một cú vồ bộc phát.',
          distributionEn: 'Colossal 400kg ambush predator wielding 28cm serrated saber canines delivering fatal throat bites.',
          descendantNameVi: 'Báo đốm Mỹ',
          descendantNameEn: 'Jaguar',
          descendantSlug: 'panthera-onca',
        },
      ],
    },
  },
];

// --- HOMOLOGY & CONVERGENT EVOLUTION DATA ---

interface HomologyModel {
  speciesNameVi: string;
  speciesNameEn: string;
  scientific: string;
  lifestyleVi: string;
  lifestyleEn: string;
  icon: string;
  bones: {
    humerus: string;
    radiusUlna: string;
    carpals: string;
    phalanges: string;
  };
}

const HOMOLOGY_MODELS: HomologyModel[] = [
  {
    speciesNameVi: 'Bàn tay Con người',
    speciesNameEn: 'Human Hand',
    scientific: 'Homo sapiens',
    lifestyleVi: 'Cầm nắm khéo léo, chế tạo công cụ chính xác với ngón cái đối diện.',
    lifestyleEn: 'Precision manipulation, tool use, opposable thumb dexterity.',
    icon: '🖐️',
    bones: {
      humerus: 'Xương cánh tay dài vừa phải, chuyển động xoay 360 độ linh hoạt tại khớp vai.',
      radiusUlna: 'Xương quay và xương trụ tự do bắt chéo cho phép xoay lật bàn tay (pronation & supination).',
      carpals: '8 xương cổ tay xếp 2 hàng tạo vòm cổ tay đàn hồi.',
      phalanges: '5 ngón tay dài tự do với các cơ vân điều khiển độc lập siêu tinh vi.',
    },
  },
  {
    speciesNameVi: 'Cánh Dơi Bay Lượn',
    speciesNameEn: 'Bat Wing',
    scientific: 'Chiroptera',
    lifestyleVi: 'Bay lượn chủ động trên không trung, ngoặt góc hẹp bắt côn trùng trong đêm.',
    lifestyleEn: 'Powered aerial flight, extreme mid-air maneuverability hunting nocturnal prey.',
    icon: '🦇',
    bones: {
      humerus: 'Ngắn và chịu lực uốn cực tốt khi cơ ngực co kéo nhịp đập cánh.',
      radiusUlna: 'Xương quay kéo dài chịu lực chính, xương trụ tiêu giảm thành mảnh nhỏ.',
      carpals: 'Khối xương cổ tay hợp nhất vững chãi làm điểm tựa cho màng cánh.',
      phalanges: 'Các đốt ngón tay kéo dài phi thường gấp nhiều lần chiều dài cơ thể để căng màng cánh da dactylopatagium.',
    },
  },
  {
    speciesNameVi: 'Vây Cá Voi Bơi Lặn',
    speciesNameEn: 'Whale Flipper',
    scientific: 'Balaenoptera musculus',
    lifestyleVi: 'Bánh lái thủy động lực học, cân bằng và điều hướng khối thân 150 tấn dưới đại dương.',
    lifestyleEn: 'Hydrodynamic stabilizing rudder, steering immense 150-ton bulk in deep seas.',
    icon: '🐋',
    bones: {
      humerus: 'Cực ngắn, mập và dẹt để làm chân đế chịu áp lực thủy tĩnh nước biển.',
      radiusUlna: 'Xương quay và trụ dẹp song song, cố định bất động tăng độ cứng cáp chống gãy.',
      carpals: 'Khối xương cổ tay lồng vào nhau bất động như gạch lát lát đệm.',
      phalanges: 'Hiện tượng Đa đốt ngón (hyperphalangy): Số đốt ngón tăng vọt tới 10-14 đốt mỗi ngón để tạo thành mái chèo phẳng hoàn hảo.',
    },
  },
  {
    speciesNameVi: 'Chân Trước Thú Ăn Thịt (Hổ)',
    speciesNameEn: 'Tiger Forelimb & Paw',
    scientific: 'Panthera tigris',
    lifestyleVi: 'Chạy nước rút bứt tốc, vật ngã con mồi nặng hàng tạ và vuốt sắc tóm giữ mồi.',
    lifestyleEn: 'Explosive ambush sprinting, tackling massive prey, and protractile claws.',
    icon: '🐅',
    bones: {
      humerus: 'Dày đặc xương đặc pachyostosis, gờ cơ bắp lồi lớn chịu lực va đập khi nhảy vồ.',
      radiusUlna: 'Xương quay và trụ to khỏe, có khả năng xoay vặn để bẻ gãy cổ con mồi.',
      carpals: 'Khối cổ tay vững chắc đệm mút đệm thịt giảm chấn động khi tiếp đất từ độ cao.',
      phalanges: 'Đốt ngón tận cùng mang bao móng vuốt co rút được (retractile claws) bảo vệ lưỡi vuốt luôn sắc bén.',
    },
  },
];

interface ConvergentCase {
  id: string;
  titleVi: string;
  titleEn: string;
  traitVi: string;
  traitEn: string;
  ecologicalPressureVi: string;
  ecologicalPressureEn: string;
  clades: {
    nameVi: string;
    nameEn: string;
    scientificGroup: string;
    divergenceTime: string;
    icon: string;
    detailVi: string;
    detailEn: string;
  }[];
}

const CONVERGENT_CASES: ConvergentCase[] = [
  {
    id: 'hydrodynamic_streamlining',
    titleVi: 'Thân Hình Thủy Động Lực Học (Fusiform Body Plan)',
    titleEn: 'Fusiform Hydrodynamic Streamlining',
    traitVi: 'Thân hình thon như quả lôi ngư, vây lưng giữ thăng bằng, vây đuôi tạo lực đẩy phản lực.',
    traitEn: 'Torpedo-like fusiform profile, stabilizing dorsal fin, powerful oscillatory caudal propulsion.',
    ecologicalPressureVi: 'Định luật thủy động học trong môi trường nước đặc gấp 800 lần không khí đòi hỏi giảm tối đa lực cản nhớt ma sát để săn mồi tốc độ.',
    ecologicalPressureEn: 'Water density is 800x that of air; minimizing turbulent skin friction drag is compulsory for high-speed marine hunting.',
    clades: [
      {
        nameVi: 'Cá Mập Trắng',
        nameEn: 'Great White Shark',
        scientificGroup: 'Chondrichthyes (Cá Sụn)',
        divergenceTime: '~450 Triệu năm trước',
        icon: '🦈',
        detailVi: 'Bộ xương sụn mềm dẻo, vảy tấm bì giảm ma sát xoáy nước, vây đuôi dị hình tạo lực nâng.',
        detailEn: 'Cartilaginous skeleton, dermal denticles reducing micro-vortices, heterocercal tail lift.',
      },
      {
        nameVi: 'Cá Heo Mũi Chai',
        nameEn: 'Bottlenose Dolphin',
        scientificGroup: 'Mammalia (Thú có vú)',
        divergenceTime: '~50 Triệu năm trước',
        icon: '🐬',
        detailVi: 'Tổ tiên 4 chân trên cạn quay lại biển; đuôi nằm ngang đập lên xuống do cột sống thú uốn dọc.',
        detailEn: 'Terrestrial artiodactyl ancestor reinvaded sea; horizontal fluke moving dorsoventrally.',
      },
      {
        nameVi: 'Ngư Long Cổ Đại',
        nameEn: 'Ichthyosaur (Extinct)',
        scientificGroup: 'Reptilia (Bò sát đã tuyệt chủng)',
        divergenceTime: '~250 Triệu năm trước',
        icon: '🦴',
        detailVi: 'Bò sát đất liền thích nghi hoàn toàn với biển, đẻ con trực tiếp trong nước biển sâu kỷ Mesozoic.',
        detailEn: 'Terrestrial reptile adapted completely to pelagic marine life, giving live birth in open seas.',
      },
    ],
  },
  {
    id: 'echolocation',
    titleVi: 'Hệ Thống Định Vị Siêu Âm Sinh Học (Bio-Sonar Echolocation)',
    titleEn: 'Biological Sonar & Ultrasonic Echolocation',
    traitVi: 'Phát sóng siêu âm tần số cao và thu nhận tiếng vọng dội lại để dựng bản đồ không gian 3D trong bóng tối mịt mù.',
    traitEn: 'Emitting ultrasonic pulses and interpreting auditory echoes to map real-time 3D environments without light.',
    ecologicalPressureVi: 'Săn mồi trong điều kiện hoàn toàn không có ánh sáng (đêm tối đen kịt hoặc đại dương sâu thẳm đục ngầu).',
    ecologicalPressureEn: 'Hunting fast elusive prey in total zero-lux optical absence (pitch-black nights or murky pelagic abyss).',
    clades: [
      {
        nameVi: 'Loài Dơi (Chiroptera)',
        nameEn: 'Microbats (Microchiroptera)',
        scientificGroup: 'Mammalia / Laurasiatheria',
        divergenceTime: '~52 Triệu năm trước',
        icon: '🦇',
        detailVi: 'Phát sóng âm từ thanh quản qua mũi hoặc miệng; tai có lá tai (tragus) tinh xảo phân tích sóng âm đa chiều.',
        detailEn: 'Laryngeal pulse emission via noseleaf or mouth; tragus in pinnae decodes elevation and azimuth.',
      },
      {
        nameVi: 'Cá Heo & Cá Voi Răng',
        nameEn: 'Toothed Whales (Odontoceti)',
        scientificGroup: 'Mammalia / Cetartiodactyla',
        divergenceTime: '~34 Triệu năm trước',
        icon: '🐋',
        detailVi: 'Tạo tiếng lách cách qua môi âm thanh (phonic lips), hội tụ sóng âm qua khối mỡ trán (melon), thu sóng qua xương hàm dưới chứa dầu mỡ.',
        detailEn: 'Phonic lips click production, acoustic beam focused through lipid melon, echoes captured via fat-filled mandibular canals.',
      },
    ],
  },
  {
    id: 'camera_eye',
    titleVi: 'Mắt Ống Kính Tinh Vi Độc Lập (Camera-Type Lens Eye)',
    titleEn: 'Camera-Type Lens Eye Architecture',
    traitVi: 'Cấu trúc mắt gồm giác mạc, đồng tử, thủy tinh thể điều tiết tiêu cự và võng mạc thụ cảm ánh sáng sắc nét.',
    traitEn: 'Refractive cornea, adjustable iris pupil, focusing crystalline lens, and photoreceptive sensory retina.',
    ecologicalPressureVi: 'Áp lực nhận diện con mồi, kẻ thù và chướng ngại vật với độ phân giải góc cực cao trong môi trường không gian 3D.',
    ecologicalPressureEn: 'Need for high-resolution spatial contrast to detect predators and navigate complex spatial topography.',
    clades: [
      {
        nameVi: 'Động Vật Có Xương Sống (Thú & Người)',
        nameEn: 'Vertebrates (Mammals, Birds)',
        scientificGroup: 'Chordata / Craniata',
        divergenceTime: '~500 Triệu năm trước',
        icon: '👁️',
        detailVi: 'Võng mạc "ngược": Dây thần kinh và mạch máu nằm phía trước tế bào que/nón, tạo ra điểm mù (blind spot).',
        detailEn: 'Inverted retina: Photoreceptors point inward, nerves exit through optic disc creating a blind spot.',
      },
      {
        nameVi: 'Bạch Tuộc & Mực Ống',
        nameEn: 'Octopus & Squid (Cephalopods)',
        scientificGroup: 'Mollusca / Cephalopoda',
        divergenceTime: '~540 Triệu năm trước',
        icon: '🐙',
        detailVi: 'Võng mạc "thuận": Tế bào thụ cảm ánh sáng hướng trực tiếp ra trước; hoàn toàn KHÔNG CÓ ĐIỂM MÙ, một thiết kế quang học hoàn hảo hơn mắt người!',
        detailEn: 'Everted retina: Photoreceptors face forward toward incoming light; ABSOLUTELY NO BLIND SPOT, optically superior to human eyes!',
      },
    ],
  },
];

export const EvolutionPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const [searchParams] = useSearchParams();

  // Active Main Tab
  const [activeTab, setActiveTab] = useState<'tree' | 'timeline' | 'homology'>('timeline');

  // Search in tree
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpeciesSlug, setSelectedSpeciesSlug] = useState<string>('panthera-tigris');
  const [expandedPhyla, setExpandedPhyla] = useState<Record<string, boolean>>({
    Chordata: true,
    Arthropoda: false,
    Mollusca: false,
    Cnidaria: false,
    Echinodermata: false,
  });

  // Timeline active epoch & Paleomap Specimen
  const [selectedEpochIndex, setSelectedEpochIndex] = useState<number>(5); // Default to Pleistocene Ice Age
  const [selectedPaleoSpecimenId, setSelectedPaleoSpecimenId] = useState<string>('qt_1');
  const [isTimeMachinePlaying, setIsTimeMachinePlaying] = useState<boolean>(false);

  // Homology bone highlight toggle
  const [highlightedBone, setHighlightedBone] = useState<string | null>(null);

  // Initialize selected species from URL param if available
  useEffect(() => {
    const speciesParam = searchParams.get('species');
    if (speciesParam) {
      setSelectedSpeciesSlug(speciesParam);
      setActiveTab('tree');
    }
  }, [searchParams]);

  const allSpecies = useMemo(() => speciesIndexData as SpeciesIndexItem[], []);
  const treeData = useMemo(() => taxaTreeData as TaxaTreeStructure, []);

  // Selected species full object
  const selectedSpecies = useMemo(() => {
    return allSpecies.find((s) => s.id === selectedSpeciesSlug) || allSpecies[0];
  }, [allSpecies, selectedSpeciesSlug]);

  // Sister species sharing the same genus or family
  const sisterSpecies = useMemo(() => {
    if (!selectedSpecies) return [];
    return allSpecies
      .filter((s) => s.id !== selectedSpecies.id && (s.family === selectedSpecies.family || s.order === selectedSpecies.order))
      .slice(0, 5);
  }, [allSpecies, selectedSpecies]);

  // Filtered species based on search query
  const filteredSpecies = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return allSpecies.filter(
      (s) =>
        s.nameVi.toLowerCase().includes(q) ||
        s.nameEn.toLowerCase().includes(q) ||
        s.scientific.toLowerCase().includes(q) ||
        s.order.toLowerCase().includes(q) ||
        s.class.toLowerCase().includes(q) ||
        s.family.toLowerCase().includes(q)
    );
  }, [allSpecies, searchQuery]);

  const togglePhylum = (phylumKey: string) => {
    setExpandedPhyla((prev) => ({ ...prev, [phylumKey]: !prev[phylumKey] }));
  };

  const selectedEpoch = useMemo(() => {
    return GEOLOGICAL_EPOCHS[selectedEpochIndex] || GEOLOGICAL_EPOCHS[5];
  }, [selectedEpochIndex]);

  // Selected Paleo specimen point on the map
  const activePaleoSpecimen = useMemo(() => {
    const specs = selectedEpoch.paleoMap.specimens;
    return specs.find((sp) => sp.id === selectedPaleoSpecimenId) || specs[0];
  }, [selectedEpoch, selectedPaleoSpecimenId]);

  // Auto-play Geological Time Machine
  useEffect(() => {
    if (!isTimeMachinePlaying) return;
    const timer = setInterval(() => {
      setSelectedEpochIndex((prev) => {
        const next = (prev + 1) % GEOLOGICAL_EPOCHS.length;
        const nextEpoch = GEOLOGICAL_EPOCHS[next];
        if (nextEpoch && nextEpoch.paleoMap.specimens.length > 0) {
          setSelectedPaleoSpecimenId(nextEpoch.paleoMap.specimens[0].id);
        }
        return next;
      });
    }, 4500);
    return () => clearInterval(timer);
  }, [isTimeMachinePlaying]);

  return (
    <div className="min-h-screen bg-[#f8faf9] text-slate-800 font-sans pb-24 selection:bg-emerald-500/20 selection:text-emerald-900">
      {/* Top Telemetry Header Bar */}
      <div className="bg-white/95 border-b border-emerald-100 backdrop-blur-md sticky top-20 z-40 text-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <Dna className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700">
                  {isEn ? 'DEEP-TIME PHYLOGENY & PALEOGEOGRAPHY' : 'PHẢ HỆ ĐỊA CHẤT & BẢN ĐỒ CỔ ĐỊA LÝ'}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono font-bold">
                  540 Ma - Present
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-500">
                {isEn ? 'Continental drift & ancient animal distributions' : 'Sự trôi dạt lục địa & phân bố sinh vật qua các kỷ địa chất'}
              </div>
            </div>
          </div>

          {/* Tab Navigation Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-mono">
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-2 transition-all ${
                activeTab === 'timeline'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              {isEn ? 'Paleomap & Epochs' : 'Bản Đồ Cổ Địa Lý & Các Kỷ'}
            </button>

            <button
              onClick={() => setActiveTab('tree')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-2 transition-all ${
                activeTab === 'tree'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <GitFork className="w-3.5 h-3.5" />
              {isEn ? 'Phylogenetic Tree' : 'Cây Phả Hệ Sự Sống'}
            </button>

            <button
              onClick={() => setActiveTab('homology')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-2 transition-all ${
                activeTab === 'homology'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              {isEn ? 'Comparative Homology' : 'Giải Phẫu So Sánh'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* =========================================================================
            TAB 2: PALEOGEOGRAPHIC MAP & DEEP-TIME TIMELINE (DEFAULT / HIGHLIGHTED)
        ========================================================================= */}
        {activeTab === 'timeline' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Mission Briefing Header */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-emerald-200 relative overflow-hidden shadow-md">
              <div className="space-y-2 max-w-3xl relative z-10">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 uppercase tracking-widest font-bold">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isEn ? 'CONTINENTAL DRIFT & PALEONTOLOGICAL DISTRIBUTION' : 'SỰ TRÔI DẠT LỤC ĐỊA & PHÂN BỐ CỔ SINH VẬT'}</span>
                </div>
                <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight uppercase">
                  {isEn ? 'Paleogeographic Map: Animals Across Geological Time' : 'Bản Đồ Cổ Địa Lý & Phân Bố Sinh Giới Qua Các Thời Kỳ'}
                </h1>
                <p className="text-sm text-slate-600 leading-relaxed font-sans">
                  {isEn
                    ? 'Watch the continents drift across 540 million years from the ocean world of the Cambrian, through the colossal supercontinent Pangea, to the frozen Beringia landbridge of the Ice Age. Click the fossil specimen pins on the paleomap to trace where ancient life lived and how modern animals evolved from them.'
                    : 'Chiêm ngưỡng sự trôi dạt của các mảng lục địa suốt 540 triệu năm từ đại dương Cambri, qua siêu lục địa Pangea vĩ đại, cho đến Cầu đất Beringia và Thềm lục địa Sunda trong Kỷ Băng Hà. Bấm vào các điểm tọa độ hóa thạch trên bản đồ để khám phá nơi sinh sống của các loài cổ sinh và mối liên kết với động vật hiện đại ngày nay.'}
                </p>
              </div>
            </div>

            {/* Epoch Timeline Scrubber / Horizontal Selector Strip */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-2 text-xs font-mono text-stone-400">
                <span className="flex items-center gap-2">
                  <Radio className="w-3 h-3 text-natgeo-yellow animate-pulse" />
                  <span>{isEn ? 'GEOLOGICAL EPOCH CHRONO-STRIP' : 'DÒNG THỜI GIAN ĐỊA CHẤT (540 Ma ➔ HIỆN TẠI)'}</span>
                </span>

                <button
                  onClick={() => setIsTimeMachinePlaying(!isTimeMachinePlaying)}
                  className="px-3 py-1 rounded-lg bg-black/60 border border-natgeo-yellow/40 text-natgeo-yellow hover:bg-natgeo-yellow hover:text-black transition-all flex items-center gap-1.5 text-xs font-bold font-mono"
                >
                  {isTimeMachinePlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isTimeMachinePlaying ? (isEn ? 'Pause Drift' : 'Tạm Dừng Trôi Dạt') : (isEn ? 'Time-Lapse Drift' : 'Tua Nhanh Trôi Dạt')}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {GEOLOGICAL_EPOCHS.map((epoch, index) => {
                  const isSelected = index === selectedEpochIndex;
                  return (
                    <button
                      key={epoch.id}
                      onClick={() => {
                        setSelectedEpochIndex(index);
                        setIsTimeMachinePlaying(false);
                        if (epoch.paleoMap.specimens.length > 0) {
                          setSelectedPaleoSpecimenId(epoch.paleoMap.specimens[0].id);
                        }
                      }}
                      className={`p-4 rounded-2xl text-left transition-all border flex flex-col justify-between h-36 relative overflow-hidden group ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-md font-bold scale-105'
                          : 'bg-white border-slate-200 hover:border-emerald-400 text-slate-700 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span>{`0${index + 1}`}</span>
                        <span className={isSelected ? 'text-stone-900 font-extrabold' : 'text-natgeo-yellow'}>
                          {epoch.myaStart} Ma
                        </span>
                      </div>

                      <div>
                        <div className="font-display text-xs font-extrabold uppercase leading-tight line-clamp-2">
                          {isEn ? epoch.nameEn.split('-')[0] : epoch.nameVi.split('-')[0]}
                        </div>
                        <div className={`text-[10px] font-mono mt-1 ${isSelected ? 'text-stone-900' : 'text-stone-400'}`}>
                          {epoch.timeRange.split('(')[0]}
                        </div>
                      </div>

                      {epoch.extinctionEvent ? (
                        <div className="flex items-center gap-1 text-[9px] text-rose-500 font-mono font-bold">
                          <Flame className="w-2.5 h-2.5" />
                          <span>EXTINCTION</span>
                        </div>
                      ) : (
                        <div className="text-[9px] font-mono text-stone-400">
                          {epoch.paleoMap.specimens.length} {isEn ? 'specimens' : 'hóa thạch'}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* THE INTERACTIVE PALEOGEOGRAPHIC WORLD MAP VIEWPORT */}
            <div className="p-6 sm:p-8 rounded-3xl field-panel border-2 border-natgeo-yellow/40 shadow-2xl space-y-6 relative overflow-hidden">
              {/* Map Header Status Bar */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-natgeo-yellow/20">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="field-stamp field-stamp-success text-xs">
                      {selectedEpoch.timeRange}
                    </span>
                    <span className="text-xs font-mono text-natgeo-yellow font-bold uppercase">
                      {isEn ? selectedEpoch.paleoMap.supercontinentEn : selectedEpoch.paleoMap.supercontinentVi}
                    </span>
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white uppercase mt-1">
                    {isEn ? selectedEpoch.nameEn : selectedEpoch.nameVi}
                  </h2>
                </div>

                <div className="text-right text-xs font-mono text-stone-300 bg-black/60 p-2.5 rounded-xl border border-white/10">
                  <div className="text-[10px] text-natgeo-yellow uppercase">{isEn ? 'Paleo-Ocean Basin' : 'Bồn Địa Siêu Đại Dương'}</div>
                  <div className="font-bold text-white">{isEn ? selectedEpoch.paleoMap.oceanEn : selectedEpoch.paleoMap.oceanVi}</div>
                </div>
              </div>

              {/* Paleogeographic Vector Map (SVG Canvas 1000x500) */}
              <div className="relative w-full aspect-[2/1] rounded-2xl bg-[#090d14] border border-white/10 overflow-hidden shadow-inner">
                {/* Viewfinder reticles */}
                <div className="viewfinder-corner-tl" />
                <div className="viewfinder-corner-tr" />
                <div className="viewfinder-corner-bl" />
                <div className="viewfinder-corner-br" />

                {/* Latitude & Longitude Paleogrid */}
                <div className="absolute inset-0 pointer-events-none opacity-20">
                  <div className="w-full h-full grid grid-cols-6 grid-rows-4 divide-x divide-y divide-white/20" />
                </div>

                <svg viewBox="0 0 1000 500" className="w-full h-full">
                  {/* Deep Ocean Water Background */}
                  <rect width="1000" height="500" fill="#090d14" />

                  {/* Shallow Seas / Continental Shelves (Cyan Glow) */}
                  {selectedEpoch.paleoMap.shallowSeasPath && (
                    <path
                      d={selectedEpoch.paleoMap.shallowSeasPath}
                      fill="#0e7490"
                      opacity="0.35"
                    />
                  )}

                  {/* Main Paleocontinental Landmasses */}
                  <path
                    d={selectedEpoch.paleoMap.landmassPath}
                    fill="#27272a"
                    stroke="#ca8a04"
                    strokeWidth="1.5"
                    opacity="0.95"
                    className="transition-all duration-700 ease-in-out"
                  />

                  {/* Polar Ice Caps (White/Pale Blue) if applicable */}
                  {selectedEpoch.paleoMap.iceCapsPath && (
                    <path
                      d={selectedEpoch.paleoMap.iceCapsPath}
                      fill="#e0f2fe"
                      stroke="#38bdf8"
                      strokeWidth="1"
                      opacity="0.8"
                    />
                  )}

                  {/* Interactive Specimen Distribution Radar Pins */}
                  {selectedEpoch.paleoMap.specimens.map((specimen, idx) => {
                    const isSelected = specimen.id === activePaleoSpecimen?.id;
                    return (
                      <g
                        key={specimen.id}
                        className="cursor-pointer group"
                        onClick={() => setSelectedPaleoSpecimenId(specimen.id)}
                      >
                        {/* Radar Ping Ripple for Selected Pin */}
                        {isSelected && (
                          <circle
                            cx={specimen.x}
                            cy={specimen.y}
                            r="18"
                            fill="none"
                            stroke="#f5b800"
                            strokeWidth="2"
                            className="animate-ping origin-center"
                          />
                        )}

                        {/* Outer Ring */}
                        <circle
                          cx={specimen.x}
                          cy={specimen.y}
                          r={isSelected ? '10' : '7'}
                          fill={isSelected ? '#f5b800' : '#18181b'}
                          stroke="#f5b800"
                          strokeWidth="2"
                          className="group-hover:scale-125 transition-transform origin-center"
                        />

                        {/* Center Icon/Dot */}
                        <circle
                          cx={specimen.x}
                          cy={specimen.y}
                          r="3"
                          fill={isSelected ? '#000000' : '#f5b800'}
                        />

                        {/* Specimen Name Tag */}
                        <text
                          x={specimen.x}
                          y={specimen.y - 14}
                          textAnchor="middle"
                          fill={isSelected ? '#f5b800' : '#e7e5e4'}
                          fontSize="11"
                          fontFamily="monospace"
                          fontWeight="bold"
                          className="drop-shadow-md select-none pointer-events-none"
                        >
                          {idx + 1}. {specimen.icon} {isEn ? specimen.nameEn.split('(')[0] : specimen.nameVi.split('(')[0]}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Map Bottom Legend Overlay */}
                <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-black/85 backdrop-blur-md border border-white/10 flex flex-wrap items-center justify-between gap-4 text-[11px] font-mono">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-natgeo-yellow border border-black animate-pulse" />
                      <span className="text-white font-bold">{isEn ? 'Fossil Specimens / Lineages' : 'Điểm Định Danh Hóa Thạch'}</span>
                    </span>

                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-sm bg-cyan-700/60 border border-cyan-400/40" />
                      <span className="text-stone-300">{isEn ? 'Shallow Seas' : 'Biển Nông Biển Cạn'}</span>
                    </span>

                    {selectedEpoch.paleoMap.iceCapsPath && (
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-sm bg-sky-100 border border-sky-400" />
                        <span className="text-stone-300">{isEn ? 'Glacial Ice Sheets' : 'Băng Hà Cực Đại'}</span>
                      </span>
                    )}
                  </div>

                  <div className="text-natgeo-yellow italic">
                    {isEn ? selectedEpoch.paleoMap.climateZoneEn : selectedEpoch.paleoMap.climateZoneVi}
                  </div>
                </div>
              </div>

              {/* SPECIMEN DETAIL INSPECTOR CARD: CLICKED PIN DOSSIER */}
              {activePaleoSpecimen && (
                <div className="p-6 rounded-2xl bg-black/70 border-2 border-natgeo-yellow/50 shadow-xl space-y-4 relative overflow-hidden">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pb-3 border-b border-natgeo-yellow/20">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{activePaleoSpecimen.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-natgeo-yellow uppercase">
                            {isEn ? activePaleoSpecimen.paleoLocationEn : activePaleoSpecimen.paleoLocationVi}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 font-mono">
                            {isEn ? 'PALEONTOLOGY PIN' : 'TỌA ĐỘ CỔ SINH'}
                          </span>
                        </div>
                        <h3 className="font-display text-xl font-extrabold text-white uppercase mt-0.5">
                          {isEn ? activePaleoSpecimen.nameEn : activePaleoSpecimen.nameVi}
                        </h3>
                        <div className="text-xs font-serif italic text-stone-400">
                          {activePaleoSpecimen.scientific}
                        </div>
                      </div>
                    </div>

                    {/* Modern Descendant Link if available */}
                    {activePaleoSpecimen.descendantSlug && (
                      <div className="shrink-0">
                        <Link
                          to={`/species/${activePaleoSpecimen.descendantSlug}`}
                          className="px-4 py-2.5 rounded-xl bg-natgeo-yellow text-stone-950 font-mono font-bold text-xs uppercase tracking-wider shadow-natgeo hover:bg-amber-400 transition-all flex items-center gap-2"
                        >
                          <span>{isEn ? 'Trace Living Descendant 3D' : 'Xem Hậu Duệ Hiện Đại 3D'}</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                    <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                      <div className="font-mono font-bold text-natgeo-yellow uppercase text-[11px]">
                        {isEn ? 'Paleo-Habitat & Ancient Climate:' : 'Sinh Cảnh Cổ Điển & Môi Trường:'}
                      </div>
                      <p className="text-stone-300 leading-relaxed">
                        {isEn ? activePaleoSpecimen.habitatEn : activePaleoSpecimen.habitatVi}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                      <div className="font-mono font-bold text-natgeo-yellow uppercase text-[11px]">
                        {isEn ? 'Geographic Distribution & Evolutionary Role:' : 'Phân Bố Địa Lý & Vai Trò Tiến Hóa:'}
                      </div>
                      <p className="text-stone-300 leading-relaxed">
                        {isEn ? activePaleoSpecimen.distributionEn : activePaleoSpecimen.distributionVi}
                      </p>
                    </div>
                  </div>

                  {activePaleoSpecimen.descendantNameVi && (
                    <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-emerald-400 font-bold">↳ {isEn ? 'Direct Lineage in Zoopedia DB:' : 'Dòng Dõi Trực Tiếp Trong Zoopedia:'}</span>
                        <span className="text-white font-bold">{isEn ? activePaleoSpecimen.descendantNameEn : activePaleoSpecimen.descendantNameVi}</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 uppercase">100% PHYLOGENETIC MATCH</span>
                    </div>
                  )}
                </div>
              )}

              {/* Epoch Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
                {/* Geological Environment */}
                <div className="space-y-3 p-6 rounded-2xl bg-black/40 border border-white/10">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-natgeo-yellow uppercase">
                    <Globe className="w-4 h-4" />
                    <span>{isEn ? 'Paleoclimate & Geological Setting' : 'Bối Cảnh Cổ Địa Lý & Khí Hậu'}</span>
                  </div>
                  <p className="text-sm text-stone-300 leading-relaxed font-sans">
                    {isEn ? selectedEpoch.geologicalContextEn : selectedEpoch.geologicalContextVi}
                  </p>
                </div>

                {/* Major Evolutionary Leap */}
                <div className="space-y-3 p-6 rounded-2xl bg-natgeo-yellow/5 border border-natgeo-yellow/30">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-natgeo-yellow uppercase">
                    <Sparkles className="w-4 h-4" />
                    <span>{isEn ? 'Key Anatomical Leap' : 'Đột Phá Hình Thái Học Then Chốt'}</span>
                  </div>
                  <p className="text-sm text-stone-200 leading-relaxed font-sans">
                    {isEn ? selectedEpoch.evolutionaryLeapEn : selectedEpoch.evolutionaryLeapVi}
                  </p>
                </div>
              </div>

              {/* Mass Extinction Event Warning if applicable */}
              {selectedEpoch.extinctionEvent && (
                <div className="p-6 rounded-2xl bg-rose-950/40 border border-rose-500/40 flex items-start gap-4">
                  <Flame className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
                      {isEn ? selectedEpoch.extinctionEvent.nameEn : selectedEpoch.extinctionEvent.nameVi}
                    </div>
                    <p className="text-xs text-rose-200/90 leading-relaxed">
                      {isEn ? selectedEpoch.extinctionEvent.impactEn : selectedEpoch.extinctionEvent.impactVi}
                    </p>
                  </div>
                </div>
              )}

              {/* Living Species Inheriting Traits From This Era */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="text-xs font-mono font-bold uppercase text-stone-300">
                  {isEn
                    ? 'Living Specimens In Database Rooted in this Epoch:'
                    : 'Các Mẫu Vật Trong Cơ Sở Dữ Liệu Thừa Hưởng Đặc Điểm Từ Cột Mốc Này:'}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {selectedEpoch.connectedSpeciesSlugs.map((slug) => {
                    const sp = allSpecies.find((s) => s.id === slug);
                    if (!sp) return null;
                    return (
                      <Link
                        key={sp.id}
                        to={`/species/${sp.id}`}
                        className="p-3 rounded-xl bg-black/60 hover:bg-natgeo-yellow/20 border border-white/10 hover:border-natgeo-yellow/40 transition-all group block text-left"
                      >
                        <div className="text-xs font-bold text-white group-hover:text-natgeo-yellow truncate">
                          {isEn ? sp.nameEn : sp.nameVi}
                        </div>
                        <div className="text-[10px] font-serif italic text-stone-400 truncate">
                          {sp.scientific}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 1: PHYLOGENETIC TREE EXPLORER
        ========================================================================= */}
        {activeTab === 'tree' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Mission Briefing Card */}
            <div className="p-6 sm:p-8 rounded-3xl field-panel border border-natgeo-yellow/30 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-80 h-80 bg-natgeo-yellow/5 rounded-full blur-3xl pointer-events-none" />
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
                <div className="space-y-2 max-w-3xl">
                  <div className="flex items-center gap-2 text-xs font-mono text-natgeo-yellow uppercase tracking-widest">
                    <Radio className="w-3 h-3 text-natgeo-yellow animate-pulse" />
                    <span>{isEn ? 'CLADISTIC LINEAGE MATRIX' : 'BẢN ĐỒ TIẾN HÓA CHỦNG LOẠI'}</span>
                  </div>
                  <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
                    {isEn ? 'Tree of Life & Lineage Tracing' : 'Cây Phả Hệ Sinh Giới & Dòng Dõi Tiến Hóa'}
                  </h1>
                  <p className="text-sm text-stone-300 leading-relaxed font-sans">
                    {isEn
                      ? 'Explore the evolutionary branching points from the first Bilaterian common ancestors 580 million years ago to modern living species. Trace any specimen to uncover its anatomical innovations and closest phylogenetic cousins.'
                      : 'Truy vết các mốc phân nhánh tiến hóa từ tổ tiên chung đối xứng hai bên 580 triệu năm trước cho tới các loài sinh vật hiện đại. Nhấp vào bất kỳ loài nào để mở hồ sơ giải mã các đột phá hình thái học và họ hàng gần nhất.'}
                  </p>
                </div>

                {/* Search Specimen Bar */}
                <div className="w-full lg:w-80 relative">
                  <div className="relative">
                    <Search className="w-4 h-4 text-natgeo-yellow absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={isEn ? 'Trace species (Tiger, Shark, Eagle)...' : 'Tra cứu loài (Hổ, Cá mập, Đại bàng)...'}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/80 border border-natgeo-yellow/40 text-xs font-mono text-white placeholder-stone-400 focus:outline-none focus:border-natgeo-yellow focus:ring-1 focus:ring-natgeo-yellow transition-all"
                    />
                  </div>

                  {/* Dropdown Live Search Results */}
                  {filteredSpecies.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 max-h-72 overflow-y-auto bg-stone-900 border border-natgeo-yellow/40 rounded-xl shadow-2xl z-50 divide-y divide-white/5">
                      {filteredSpecies.slice(0, 8).map((sp) => (
                        <button
                          key={sp.id}
                          onClick={() => {
                            setSelectedSpeciesSlug(sp.id);
                            setSearchQuery('');
                          }}
                          className="w-full text-left p-3 hover:bg-natgeo-yellow/15 flex items-center justify-between gap-3 transition-colors group"
                        >
                          <div>
                            <div className="text-xs font-bold text-white group-hover:text-natgeo-yellow">
                              {isEn ? sp.nameEn : sp.nameVi}
                            </div>
                            <div className="text-[10px] font-serif italic text-stone-400">
                              {sp.scientific} • {sp.class}
                            </div>
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/60 border border-white/10 text-stone-400">
                            {sp.order}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Main Interactive Grid: Tree Explorer (Left) & Specimen Dossier (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: The Cladogram Tree Hierarchy (7 Cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between px-2 text-xs font-mono text-stone-400 uppercase">
                  <span>{isEn ? 'PHYLUM / CLASS / ORDER CLADOGRAM' : 'SƠ ĐỒ PHÂN NHÁNH NGÀNH / LỚP / BỘ'}</span>
                  <span>{isEn ? 'CLICK TO EXPAND' : 'BẤM ĐỂ MỞ NHÁNH'}</span>
                </div>

                {/* Common Root Node: Bilateria */}
                <div className="p-4 rounded-2xl bg-black/60 border-2 border-dashed border-natgeo-yellow/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🌱</span>
                    <div>
                      <div className="text-xs font-mono font-bold text-natgeo-yellow uppercase">
                        {isEn ? 'Root Common Ancestor' : 'Gốc Tổ Tiên Chung'} (~580 Ma)
                      </div>
                      <div className="text-sm font-bold text-white">
                        Metazoa / Bilateria ({isEn ? 'Bilateral Symmetry' : 'Động vật đối xứng hai bên'})
                      </div>
                    </div>
                  </div>
                  <span className="field-stamp field-stamp-success text-[10px]">ANCESTRAL ROOT</span>
                </div>

                {/* Phyla Branches */}
                <div className="space-y-4 pl-4 border-l-2 border-dashed border-natgeo-yellow/30">
                  {Object.keys(treeData).map((phylumKey) => {
                    const phylumData = treeData[phylumKey];
                    const phylumMeta = PHYLUM_EVOLUTION_META[phylumKey];
                    const isExpanded = !!expandedPhyla[phylumKey];
                    const isSelectedInThisPhylum = selectedSpecies?.phylum === phylumKey;

                    return (
                      <div
                        key={phylumKey}
                        className={`rounded-2xl transition-all border overflow-hidden ${
                          isSelectedInThisPhylum
                            ? 'bg-stone-900/90 border-natgeo-yellow shadow-lg'
                            : 'bg-stone-950/60 border-white/10 hover:border-white/20'
                        }`}
                      >
                        {/* Phylum Header Accordion */}
                        <div
                          onClick={() => togglePhylum(phylumKey)}
                          className="p-4 cursor-pointer flex items-center justify-between gap-4 hover:bg-white/[0.02]"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{phylumMeta?.icon || '🔬'}</span>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-display text-base font-bold text-white tracking-wide uppercase">
                                  {phylumKey}
                                </span>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-natgeo-yellow/15 text-natgeo-yellow border border-natgeo-yellow/30">
                                  ~{phylumMeta?.divergenceMya || 540} Ma
                                </span>
                              </div>
                              <div className="text-xs text-stone-400 font-sans mt-0.5">
                                {isEn ? phylumMeta?.keyInnovationEn : phylumMeta?.keyInnovationVi}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-xs font-mono text-stone-400">
                              {phylumData.speciesCount || 0} {isEn ? 'species' : 'loài'}
                            </span>
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4 text-natgeo-yellow" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-stone-400" />
                            )}
                          </div>
                        </div>

                        {/* Expanded Classes & Orders */}
                        {isExpanded && phylumData.classes && (() => {
                          const phylumClasses = phylumData.classes;
                          return (
                            <div className="p-4 bg-black/40 border-t border-white/5 space-y-4">
                              {Object.keys(phylumClasses).map((classKey) => {
                                const classData = phylumClasses[classKey];
                                const classMeta = CLASS_EVOLUTION_META[classKey];
                                const isSelectedInThisClass = selectedSpecies?.class === classKey;
                                const classOrders = classData?.orders || {};

                                return (
                                  <div
                                    key={classKey}
                                    className={`p-3.5 rounded-xl border text-xs transition-all ${
                                      isSelectedInThisClass
                                        ? 'bg-natgeo-yellow/10 border-natgeo-yellow/60'
                                        : 'bg-white/[0.02] border-white/5'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center gap-2">
                                        <span className="text-lg">{classMeta?.icon || '🐾'}</span>
                                        <span className="font-mono font-bold text-stone-200 uppercase tracking-wider">
                                          {isEn ? 'Class' : 'Lớp'} {classKey}
                                        </span>
                                        {classMeta && (
                                          <span className="text-[10px] font-mono text-amber-400">
                                            (~{classMeta.divergenceMya} Ma)
                                          </span>
                                        )}
                                      </div>
                                      <span className="text-[10px] font-mono text-stone-400">
                                        {classData?.speciesCount || 0} {isEn ? 'taxa' : 'loài'}
                                      </span>
                                    </div>

                                    {classMeta && (
                                      <p className="text-[11px] text-stone-300 italic mb-3 font-serif">
                                        "{isEn ? classMeta.keyInnovationEn : classMeta.keyInnovationVi}"
                                      </p>
                                    )}

                                    {/* Orders and Species Pills */}
                                    <div className="space-y-2 pt-2 border-t border-white/5">
                                      {Object.keys(classOrders).map((orderKey) => {
                                        const orderSpeciesIds: string[] = classOrders[orderKey] || [];
                                        const orderMeta = ORDER_EVOLUTION_META[orderKey];
                                        const isSelectedInThisOrder = selectedSpecies?.order === orderKey;

                                        return (
                                          <div key={orderKey} className="space-y-1.5">
                                            <div className="flex items-center justify-between text-[11px] font-mono">
                                              <span
                                                className={`font-semibold ${
                                                  isSelectedInThisOrder ? 'text-natgeo-yellow' : 'text-stone-300'
                                                }`}
                                              >
                                                ↳ {isEn ? 'Order' : 'Bộ'} {orderKey}
                                                {orderMeta ? ` (~${orderMeta.divergenceMya} Ma)` : ''}
                                              </span>
                                            </div>

                                            {/* Specimen Buttons in this order */}
                                            <div className="flex flex-wrap gap-1.5 pl-3">
                                              {orderSpeciesIds.map((slug) => {
                                                const sp = allSpecies.find((s) => s.id === slug);
                                                if (!sp) return null;
                                                const isCurrentSelected = sp.id === selectedSpeciesSlug;

                                                return (
                                                  <button
                                                    key={slug}
                                                    onClick={() => setSelectedSpeciesSlug(slug)}
                                                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono transition-all flex items-center gap-1.5 ${
                                                      isCurrentSelected
                                                        ? 'bg-natgeo-yellow text-stone-950 font-bold shadow-natgeo scale-105'
                                                        : 'bg-black/60 text-stone-300 hover:text-natgeo-yellow hover:bg-white/10 border border-white/5'
                                                    }`}
                                                  >
                                                    <span>{isEn ? sp.nameEn : sp.nameVi}</span>
                                                    {sp.has3D && <span className="text-[9px] text-amber-500 font-bold">3D</span>}
                                                  </button>
                                                );
                                              })}
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })()}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Specimen Evolutionary Dossier (5 Cols Sticky) */}
              <div className="lg:col-span-5 sticky top-36 space-y-6">
                <div className="p-6 rounded-3xl field-panel border-2 border-natgeo-yellow/50 shadow-2xl space-y-6 relative overflow-hidden">
                  <div className="flex items-center justify-between pb-4 border-b border-natgeo-yellow/20">
                    <span className="field-stamp field-stamp-success text-xs">
                      {isEn ? 'PHYLOGENETIC DOSSIER' : 'HỒ SƠ PHẢ HỆ TIẾN HÓA'}
                    </span>
                    <span className="text-xs font-mono text-natgeo-yellow">GBIF-{selectedSpecies?.id}</span>
                  </div>

                  {/* Specimen Profile Header */}
                  <div className="space-y-1">
                    <h2 className="font-display text-2xl font-extrabold text-white uppercase tracking-tight">
                      {isEn ? selectedSpecies?.nameEn : selectedSpecies?.nameVi}
                    </h2>
                    <div className="font-serif italic text-natgeo-yellow text-sm">
                      {selectedSpecies?.scientific}
                    </div>
                  </div>

                  {/* Evolutionary Lineage Pathway (Breadcrumb Breakdown) */}
                  <div className="space-y-3 p-4 rounded-2xl bg-black/70 border border-white/10 text-xs font-mono">
                    <div className="text-[11px] text-natgeo-yellow uppercase font-bold tracking-wider flex items-center gap-2">
                      <GitFork className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Ancestral Divergence Lineage' : 'Dòng Phân Nhánh Tiến Hóa'}</span>
                    </div>

                    <div className="space-y-2 pt-1 divide-y divide-white/5 text-[11px]">
                      <div className="flex justify-between py-1">
                        <span className="text-stone-400">1. {isEn ? 'Phylum' : 'Ngành'}:</span>
                        <span className="text-white font-bold">{selectedSpecies?.phylum} (~540 Ma)</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-stone-400">2. {isEn ? 'Class' : 'Lớp'}:</span>
                        <span className="text-white font-bold">{selectedSpecies?.class}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-stone-400">3. {isEn ? 'Order' : 'Bộ'}:</span>
                        <span className="text-white font-bold">{selectedSpecies?.order}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-stone-400">4. {isEn ? 'Family' : 'Họ'}:</span>
                        <span className="text-amber-400 font-bold">{selectedSpecies?.family}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-stone-400">5. {isEn ? 'Species' : 'Loài'}:</span>
                        <span className="text-natgeo-yellow font-bold italic">{selectedSpecies?.scientific}</span>
                      </div>
                    </div>
                  </div>

                  {/* Evolutionary Innovations & Traits */}
                  <div className="space-y-2">
                    <div className="text-xs font-mono font-bold uppercase text-stone-200">
                      {isEn ? 'Diagnostic Evolutionary Innovations' : 'Đột Phá Hình Thái Học Đặc Trưng'}
                    </div>
                    <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-stone-300 leading-relaxed font-sans">
                      {CLASS_EVOLUTION_META[selectedSpecies?.class]?.keyInnovationVi ||
                        PHYLUM_EVOLUTION_META[selectedSpecies?.phylum]?.keyInnovationVi ||
                        'Mang cấu trúc thích nghi cao độ đáp ứng môi trường sinh thái riêng biệt.'}
                    </div>
                  </div>

                  {/* Sister Taxa / Close Evolutionary Cousins in the Database */}
                  <div className="space-y-2">
                    <div className="text-xs font-mono font-bold uppercase text-stone-200">
                      {isEn ? 'Closest Evolutionary Relatives in DB' : 'Họ Hàng Tiến Hóa Gần Nhất'}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {sisterSpecies.map((sis) => (
                        <button
                          key={sis.id}
                          onClick={() => setSelectedSpeciesSlug(sis.id)}
                          className="px-2.5 py-1.5 rounded-xl bg-black/60 hover:bg-natgeo-yellow/20 border border-white/10 hover:border-natgeo-yellow/40 text-[11px] font-mono text-stone-200 transition-all flex items-center gap-1.5"
                        >
                          <span>{isEn ? sis.nameEn : sis.nameVi}</span>
                          <span className="text-[9px] text-stone-400 italic">({sis.scientific})</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Action Link to Full Specimen Page */}
                  <Link
                    to={`/species/${selectedSpecies?.id}`}
                    className="w-full py-3 rounded-2xl bg-natgeo-yellow text-stone-950 font-mono font-bold text-xs uppercase tracking-wider shadow-natgeo hover:bg-amber-400 transition-all flex items-center justify-center gap-2"
                  >
                    <span>{isEn ? 'Inspect Full 3D Specimen Profile' : 'Khảo Sát Mô Hình 3D & Giải Phẫu'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: COMPARATIVE HOMOLOGY & CONVERGENT EVOLUTION
        ========================================================================= */}
        {activeTab === 'homology' && (
          <div className="space-y-12 animate-fadeIn">
            {/* Mission Briefing */}
            <div className="p-6 sm:p-8 rounded-3xl field-panel border border-natgeo-yellow/30 relative overflow-hidden shadow-2xl">
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center gap-2 text-xs font-mono text-natgeo-yellow uppercase tracking-widest">
                  <Layers className="w-3.5 h-3.5 text-natgeo-yellow" />
                  <span>{isEn ? 'ANATOMICAL HOMOLOGY & CONVERGENT EVOLUTION' : 'GIẢI PHẪU TƯƠNG ĐỒNG & TIẾN HÓA HỘI TỤ'}</span>
                </div>
                <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
                  {isEn ? 'Homologous Architectures & Convergent Solutions' : 'Cấu Trúc Tương Đồng & Thích Nghi Hội Tụ'}
                </h1>
                <p className="text-sm text-stone-300 leading-relaxed font-sans">
                  {isEn
                    ? 'Discover how divergent evolution remodels one ancestral bone blueprint into wildly different functions (human hands, bat wings, whale flippers), and how identical environmental pressures force totally unrelated species to independently evolve identical solutions.'
                    : 'Khám phá cách tiến hóa phân ly tái cấu trúc cùng một bản thiết kế xương tổ tiên thành những công năng hoàn toàn khác nhau (tay người, cánh dơi, vây cá voi), và cách các áp lực môi trường khắc nghiệt buộc các loài xa lạ độc lập tiến hóa những giải pháp hình thái giống hệt nhau.'}
                </p>
              </div>
            </div>

            {/* Section 1: The Pentadactyl Limb Homology Sandbox */}
            <div className="p-6 sm:p-10 rounded-3xl field-panel border-2 border-natgeo-yellow/30 shadow-2xl space-y-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-natgeo-yellow/20">
                <div>
                  <span className="field-stamp field-stamp-success text-xs">HOMOLOGY SANDBOX</span>
                  <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white uppercase mt-2">
                    {isEn ? 'The Pentadactyl Forelimb Blueprint' : 'Bản Thiết Kế Chi Ngũ Giác (Pentadactyl Limb)'}
                  </h2>
                  <p className="text-xs text-stone-300 mt-1 max-w-2xl font-sans">
                    {isEn
                      ? 'All terrestrial vertebrates inherited the same 1-2-many bone structure from ancient sarcopterygian fish 370 Ma ago. Click a bone segment below to highlight its evolutionary remodeling:'
                      : 'Tất cả động vật có xương sống trên cạn đều thừa hưởng cấu trúc xương 1-2-nhiều từ tổ tiên cá vây tay cổ đại 370 triệu năm trước. Bấm vào một đoạn xương để làm nổi bật sự biến đổi tiến hóa:'}
                  </p>
                </div>

                {/* Interactive Bone Highlight Controls */}
                <div className="flex flex-wrap gap-2 text-xs font-mono">
                  <button
                    onClick={() => setHighlightedBone(highlightedBone === 'humerus' ? null : 'humerus')}
                    className={`px-3 py-1.5 rounded-xl border transition-all ${
                      highlightedBone === 'humerus'
                        ? 'bg-amber-400 text-stone-950 font-bold border-amber-300 shadow-lg'
                        : 'bg-black/60 text-amber-300 border-amber-400/40 hover:bg-amber-400/10'
                    }`}
                  >
                    🦴 {isEn ? 'Humerus (Upper arm)' : 'Xương cánh tay'}
                  </button>

                  <button
                    onClick={() => setHighlightedBone(highlightedBone === 'radiusUlna' ? null : 'radiusUlna')}
                    className={`px-3 py-1.5 rounded-xl border transition-all ${
                      highlightedBone === 'radiusUlna'
                        ? 'bg-sky-400 text-stone-950 font-bold border-sky-300 shadow-lg'
                        : 'bg-black/60 text-sky-300 border-sky-400/40 hover:bg-sky-400/10'
                    }`}
                  >
                    🦴 {isEn ? 'Radius & Ulna (Forearm)' : 'Xương quay & trụ'}
                  </button>

                  <button
                    onClick={() => setHighlightedBone(highlightedBone === 'carpals' ? null : 'carpals')}
                    className={`px-3 py-1.5 rounded-xl border transition-all ${
                      highlightedBone === 'carpals'
                        ? 'bg-emerald-400 text-stone-950 font-bold border-emerald-300 shadow-lg'
                        : 'bg-black/60 text-emerald-300 border-emerald-400/40 hover:bg-emerald-400/10'
                    }`}
                  >
                    🦴 {isEn ? 'Carpals (Wrist)' : 'Xương cổ tay'}
                  </button>

                  <button
                    onClick={() => setHighlightedBone(highlightedBone === 'phalanges' ? null : 'phalanges')}
                    className={`px-3 py-1.5 rounded-xl border transition-all ${
                      highlightedBone === 'phalanges'
                        ? 'bg-rose-400 text-stone-950 font-bold border-rose-300 shadow-lg'
                        : 'bg-black/60 text-rose-300 border-rose-400/40 hover:bg-rose-400/10'
                    }`}
                  >
                    🦴 {isEn ? 'Phalanges (Digits)' : 'Đốt ngón tay'}
                  </button>
                </div>
              </div>

              {/* 4 Pentadactyl Species Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {HOMOLOGY_MODELS.map((model) => (
                  <div
                    key={model.speciesNameEn}
                    className="p-5 rounded-2xl bg-black/60 border border-white/10 space-y-4 hover:border-natgeo-yellow/40 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-3xl">{model.icon}</span>
                        <span className="text-[10px] font-mono text-natgeo-yellow uppercase">TETRAPOD HOMOLOGY</span>
                      </div>
                      <h3 className="font-display text-lg font-bold text-white uppercase mt-2">
                        {isEn ? model.speciesNameEn : model.speciesNameVi}
                      </h3>
                      <div className="text-xs font-serif italic text-stone-400">{model.scientific}</div>
                      <p className="text-xs text-stone-300 pt-1 font-sans">
                        {isEn ? model.lifestyleEn : model.lifestyleVi}
                      </p>
                    </div>

                    {/* Bone Segment Details */}
                    <div className="space-y-2 pt-3 border-t border-white/10 text-[11px] font-mono">
                      <div
                        className={`p-2 rounded-lg transition-all ${
                          highlightedBone === 'humerus' ? 'bg-amber-400/20 border border-amber-400 text-amber-200' : 'text-stone-400'
                        }`}
                      >
                        <span className="font-bold text-amber-300">1. {isEn ? 'Humerus' : 'Cánh tay'}:</span>{' '}
                        {model.bones.humerus}
                      </div>

                      <div
                        className={`p-2 rounded-lg transition-all ${
                          highlightedBone === 'radiusUlna' ? 'bg-sky-400/20 border border-sky-400 text-sky-200' : 'text-stone-400'
                        }`}
                      >
                        <span className="font-bold text-sky-300">2. {isEn ? 'Radius/Ulna' : 'Cẳng tay'}:</span>{' '}
                        {model.bones.radiusUlna}
                      </div>

                      <div
                        className={`p-2 rounded-lg transition-all ${
                          highlightedBone === 'carpals' ? 'bg-emerald-400/20 border border-emerald-400 text-emerald-200' : 'text-stone-400'
                        }`}
                      >
                        <span className="font-bold text-emerald-300">3. {isEn ? 'Carpals' : 'Cổ tay'}:</span>{' '}
                        {model.bones.carpals}
                      </div>

                      <div
                        className={`p-2 rounded-lg transition-all ${
                          highlightedBone === 'phalanges' ? 'bg-rose-400/20 border border-rose-400 text-rose-200' : 'text-stone-400'
                        }`}
                      >
                        <span className="font-bold text-rose-300">4. {isEn ? 'Phalanges' : 'Đốt ngón'}:</span>{' '}
                        {model.bones.phalanges}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2: Convergent Evolution Case Studies */}
            <div className="space-y-6">
              <div className="px-2">
                <span className="field-stamp field-stamp-danger text-xs">CONVERGENT EVOLUTION</span>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white uppercase mt-2">
                  {isEn ? 'Unrelated Lineages, Identical Biological Inventions' : 'Khác Nhau Tổ Tiên, Giống Nhau Giải Pháp'}
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {CONVERGENT_CASES.map((c) => (
                  <div
                    key={c.id}
                    className="p-6 rounded-3xl field-panel border border-natgeo-yellow/30 shadow-xl space-y-6 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="text-xs font-mono font-bold text-natgeo-yellow uppercase tracking-wider">
                        {isEn ? c.titleEn : c.titleVi}
                      </div>

                      <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 text-xs text-stone-200 font-sans">
                        <span className="font-mono font-bold text-natgeo-yellow">{isEn ? 'Feature: ' : 'Đặc tính: '}</span>
                        {isEn ? c.traitEn : c.traitVi}
                      </div>

                      <p className="text-xs text-stone-400 italic font-serif">
                        "{isEn ? c.ecologicalPressureEn : c.ecologicalPressureVi}"
                      </p>
                    </div>

                    {/* Independent Clades Showcase */}
                    <div className="space-y-3 pt-3 border-t border-white/10">
                      {c.clades.map((clade) => (
                        <div key={clade.nameEn} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                          <div className="flex items-center justify-between text-xs font-mono font-bold">
                            <span className="text-white flex items-center gap-1.5">
                              <span>{clade.icon}</span>
                              <span>{isEn ? clade.nameEn : clade.nameVi}</span>
                            </span>
                            <span className="text-amber-400 text-[10px]">{clade.divergenceTime}</span>
                          </div>
                          <div className="text-[10px] font-mono text-stone-400">{clade.scientificGroup}</div>
                          <p className="text-[11px] text-stone-300 pt-1 font-sans">
                            {isEn ? clade.detailEn : clade.detailVi}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: Vestigial Organs (Cơ quan Thoái hóa) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-black/70 border border-natgeo-yellow/30 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-natgeo-yellow uppercase">
                <Info className="w-4 h-4" />
                <span>{isEn ? 'VESTIGIAL STRUCTURES: GHOSTS OF EVOLUTIONARY PAST' : 'CƠ QUAN THOÁI HÓA: DẤU VẾT QUÁ KHỨ TIẾN HÓA'}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-stone-300 leading-relaxed font-sans">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                  <div className="font-bold text-white flex items-center gap-2">
                    <span>🐋</span>
                    <span>{isEn ? 'Vestigial Pelvic Bones in Whales' : 'Xương Chậu Thoái Hóa Ở Cá Voi Xanh'}</span>
                  </div>
                  <p>
                    {isEn
                      ? 'Deep within the blubber of blue whales and bowheads float detached pelvic and femur bones. Having walked on four legs 50 million years ago as Pakicetus, modern whales still carry the genetic code and skeleton traces of terrestrial ancestors.'
                      : 'Nằm sâu bên trong lớp mỡ của Cá voi xanh là các mảnh xương chậu và xương đùi tiêu biến lơ lửng không còn gắn vào cột sống. Sau khi tổ tiên Pakicetus rời bỏ đất liền 50 triệu năm trước, bộ gen của cá voi hiện đại vẫn lưu giữ dấu vết chi sau của thú 4 chân.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                  <div className="font-bold text-white flex items-center gap-2">
                    <span>🐍</span>
                    <span>{isEn ? 'Pelvic Spurs in Boas & Pythons' : 'Móng Vuốt Chi Sau Thoái Hóa Ở Trăn & Trăn Khổng Lồ'}</span>
                  </div>
                  <p>
                    {isEn
                      ? 'Pythons and boas possess tiny external clawed spurs on either side of their cloaca. Dissections reveal these spurs connect directly to an internal vestigial pelvis and femur, proving snakes evolved from burrowing 4-legged lizards.'
                      : 'Các loài trăn khổng lồ (Pythonidae) sở hữu những cựa móng nhỏ hai bên huyệt bài tiết. Giải phẫu cho thấy những cựa này gắn vào xương chậu và xương đùi thoái hóa bên trong, chứng minh rắn đã tiến hóa từ thằn lằn 4 chân đào hang trong kỷ Jura.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
