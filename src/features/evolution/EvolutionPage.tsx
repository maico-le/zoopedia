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
  Globe
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

// --- GEOLOGICAL TIMELINE EPOCHS ---

interface GeologicalEpoch {
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
  const [activeTab, setActiveTab] = useState<'tree' | 'timeline' | 'homology'>('tree');

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

  // Timeline active epoch
  const [selectedEpochId, setSelectedEpochId] = useState<string>('cenozoic_early');

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
    return GEOLOGICAL_EPOCHS.find((e) => e.id === selectedEpochId) || GEOLOGICAL_EPOCHS[4];
  }, [selectedEpochId]);

  return (
    <div className="min-h-screen bg-expedition-dark text-stone-100 font-sans pb-24 selection:bg-natgeo-yellow selection:text-black">
      {/* Top Telemetry Header Bar */}
      <div className="bg-black/60 border-b border-natgeo-yellow/20 backdrop-blur-md sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-natgeo-yellow/20 border border-natgeo-yellow flex items-center justify-center text-natgeo-yellow">
              <Dna className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-natgeo-yellow">
                  {isEn ? 'DEEP-TIME PHYLOGENY & ADAPTIVE EVOLUTION' : 'PHẢ HỆ ĐỊA CHẤT & TIẾN HÓA THÍCH NGHI'}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 font-mono">
                  540 Ma - Present
                </span>
              </div>
              <div className="text-[11px] font-mono text-stone-400">
                {isEn ? '160 Taxa mapped across Tree of Life' : 'Định danh 160 loài trên bản đồ tiến hóa sự sống'}
              </div>
            </div>
          </div>

          {/* Tab Navigation Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-expedition-canvas rounded-xl border border-white/10 text-xs font-mono">
            <button
              onClick={() => setActiveTab('tree')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-2 transition-all ${
                activeTab === 'tree'
                  ? 'bg-natgeo-yellow text-stone-950 shadow-natgeo'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <GitFork className="w-3.5 h-3.5" />
              {isEn ? 'Phylogenetic Tree' : 'Cây Phả Hệ Sự Sống'}
            </button>

            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-2 transition-all ${
                activeTab === 'timeline'
                  ? 'bg-natgeo-yellow text-stone-950 shadow-natgeo'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              {isEn ? 'Deep-Time Timeline' : 'Biên Niên Sử Địa Chất'}
            </button>

            <button
              onClick={() => setActiveTab('homology')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-2 transition-all ${
                activeTab === 'homology'
                  ? 'bg-natgeo-yellow text-stone-950 shadow-natgeo'
                  : 'text-stone-300 hover:text-white hover:bg-white/5'
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
            TAB 2: DEEP-TIME GEOLOGICAL TIMELINE
        ========================================================================= */}
        {activeTab === 'timeline' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Mission Briefing */}
            <div className="p-6 sm:p-8 rounded-3xl field-panel border border-natgeo-yellow/30 relative overflow-hidden shadow-2xl">
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center gap-2 text-xs font-mono text-natgeo-yellow uppercase tracking-widest">
                  <Clock className="w-3.5 h-3.5 text-natgeo-yellow" />
                  <span>{isEn ? '540 MILLION YEARS OF GEOLOGICAL DEEP TIME' : '540 TRIỆU NĂM ĐỊA CHẤT SÂU'}</span>
                </div>
                <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
                  {isEn ? 'Evolutionary Chronology & Mass Extinctions' : 'Biên Niên Sử Tiến Hóa & Các Đại Tuyệt Chủng'}
                </h1>
                <p className="text-sm text-stone-300 leading-relaxed font-sans">
                  {isEn
                    ? 'Travel across the geological epochs to witness the great leaps of morphology: the Cambrian explosion of body plans, the water-to-land tetrapod transition, amniote terrestrial conquests, and the explosive rise of mammals following asteroid impacts.'
                    : 'Hành trình xuyên qua các kỷ địa chất để chứng kiến những bước nhảy vọt hình thái học vĩ đại: vụ nổ Cambri khai sinh cấu trúc cơ thể, cuộc đổ bộ lên cạn của động vật 4 chân, cuộc cách mạng trứng màng ối và sự trỗi dậy của Lớp Thú sau thảm họa thiên thạch.'}
                </p>
              </div>
            </div>

            {/* Horizontal Epoch Selector Strip */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {GEOLOGICAL_EPOCHS.map((epoch, index) => {
                const isSelected = epoch.id === selectedEpochId;
                return (
                  <button
                    key={epoch.id}
                    onClick={() => setSelectedEpochId(epoch.id)}
                    className={`p-4 rounded-2xl text-left transition-all border flex flex-col justify-between h-36 relative overflow-hidden group ${
                      isSelected
                        ? 'bg-natgeo-yellow text-stone-950 border-natgeo-yellow shadow-natgeo font-bold scale-105'
                        : 'bg-stone-950/70 border-white/10 hover:border-natgeo-yellow/40 text-stone-300'
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

                    {epoch.extinctionEvent && (
                      <div className="flex items-center gap-1 text-[9px] text-rose-500 font-mono font-bold">
                        <Flame className="w-2.5 h-2.5" />
                        <span>EXTINCTION</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected Epoch Detailed Field Dossier */}
            <div className="p-6 sm:p-10 rounded-3xl field-panel border-2 border-natgeo-yellow/40 shadow-2xl space-y-8 relative overflow-hidden">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-natgeo-yellow/20">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="field-stamp field-stamp-success text-xs">
                      {selectedEpoch.timeRange}
                    </span>
                    <span className="text-xs font-mono text-stone-400">
                      {isEn ? 'GEOLOGICAL CHRONO-STRATUM' : 'TẦNG ĐỊA TẦNG ĐỘC QUYỀN'}
                    </span>
                  </div>
                  <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white uppercase tracking-tight mt-2">
                    {isEn ? selectedEpoch.nameEn : selectedEpoch.nameVi}
                  </h2>
                </div>

                <div className="p-3 rounded-2xl bg-black/60 border border-white/10 text-right">
                  <div className="text-[10px] font-mono text-natgeo-yellow uppercase">{isEn ? 'Keystone Ancestral Taxon' : 'Tổ Tiên Hóa Thạch Điển Hình'}</div>
                  <div className="text-sm font-bold text-white font-serif italic">{selectedEpoch.highlightAncestorVi}</div>
                </div>
              </div>

              {/* Epoch Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
