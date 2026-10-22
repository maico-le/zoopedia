import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Navigation,
  Route,
  Waves,
  Wind,
  Satellite,
  Compass,
  Radio,
  Play,
  Pause,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

// --- DATA STRUCTURES FOR GLOBAL MIGRATION & SATELLITE RADAR ---

export interface MigrationWaypoint {
  id: string;
  nameVi: string;
  nameEn: string;
  lat: number; // -90 to 90
  lng: number; // -180 to 180
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  monthRangeVi: string;
  monthRangeEn: string;
  activityVi: string;
  activityEn: string;
  altitudeMeters?: number;
  depthMeters?: number;
  waterTempC?: number;
}

export interface OceanCurrentLayer {
  id: string;
  nameVi: string;
  nameEn: string;
  temp: 'warm' | 'cold';
  pathD: string; // SVG path
  flowVi: string;
  flowEn: string;
}

export interface MigrationRoute {
  id: string;
  titleVi: string;
  titleEn: string;
  speciesSlug: string;
  speciesNameVi: string;
  speciesNameEn: string;
  scientific: string;
  icon: string;
  category: 'avian' | 'marine' | 'terrestrial';
  roundtripKm: number;
  durationDays: number;
  satelliteTagId: string;
  transmitterType: string;
  departureVi: string;
  departureEn: string;
  destinationVi: string;
  destinationEn: string;
  primaryDriverVi: string;
  primaryDriverEn: string;
  environmentalCurrent: {
    nameVi: string;
    nameEn: string;
    type: 'ocean_current' | 'wind_belt' | 'seasonal_rainfall';
    descriptionVi: string;
    descriptionEn: string;
  };
  climateThreatsVi: string[];
  climateThreatsEn: string[];
  waypoints: MigrationWaypoint[];
}

// Major Global Ocean Currents for the radar overlay
const GLOBAL_CURRENTS: OceanCurrentLayer[] = [
  {
    id: 'gulf_stream',
    nameVi: 'Hải lưu Gulf Stream',
    nameEn: 'Gulf Stream Current',
    temp: 'warm',
    pathD: 'M 250 240 Q 300 200 420 150 T 520 120',
    flowVi: 'Mang nước ấm từ Vịnh Mexico sang Bắc Đại Tây Dương, làm ấm khí hậu Tây Âu.',
    flowEn: 'Pumps warm equatorial water to North Atlantic, creating temperate microclimates in Western Europe.',
  },
  {
    id: 'kuroshio',
    nameVi: 'Hải lưu Kuroshio',
    nameEn: 'Kuroshio Current',
    temp: 'warm',
    pathD: 'M 750 250 Q 820 220 880 180 T 960 160',
    flowVi: 'Hải lưu ấm Tây Thái Bình Dương đẩy các đàn cá ngừ và rùa biển sang bờ biển Bắc Mỹ.',
    flowEn: 'Warm Western Pacific highway transporting pelagic tuna and sea turtles toward North America.',
  },
  {
    id: 'humboldt',
    nameVi: 'Hải lưu Humboldt',
    nameEn: 'Humboldt (Peru) Current',
    temp: 'cold',
    pathD: 'M 280 460 Q 275 380 270 300',
    flowVi: 'Hải lưu lạnh cực mạnh mang dòng nước trồi giàu dinh dưỡng nuôi sống quần thể cá voi khổng lồ.',
    flowEn: 'Powerful frigid upwelling current from Antarctica, driving massive krill and fish abundance for whales.',
  },
  {
    id: 'california',
    nameVi: 'Hải lưu California',
    nameEn: 'California Current',
    temp: 'cold',
    pathD: 'M 180 140 Q 190 200 210 260',
    flowVi: 'Dòng hải lưu lạnh chảy dọc bờ tây Bắc Mỹ, tạo vùng kiếm ăn giàu sứa của rùa da.',
    flowEn: 'Cold southward current along Western North America, supporting jellyfish feasts for leatherbacks.',
  },
  {
    id: 'benguela',
    nameVi: 'Hải lưu Benguela',
    nameEn: 'Benguela Current',
    temp: 'cold',
    pathD: 'M 520 440 Q 510 380 490 320',
    flowVi: 'Nước trồi lạnh giá Tây Nam Phi thúc đẩy năng suất sinh học rực rỡ.',
    flowEn: 'Cold South Atlantic upwelling fueling incredible pelagic fish blooms off Namibia.',
  },
];

// Curated Wildlife Migration Corridors mapped directly to species in DB
const MIGRATION_ROUTES: MigrationRoute[] = [
  {
    id: 'humpback_whale',
    titleVi: 'Hành Trình Cá Voi Lưng Gù Vượt Nam Bán Cầu',
    titleEn: 'Southern Humpback Oceanic Odyssey',
    speciesSlug: 'megaptera-novaeangliae',
    speciesNameVi: 'Cá Voi Lưng Gù',
    speciesNameEn: 'Humpback Whale',
    scientific: 'Megaptera novaeangliae',
    icon: '🐋',
    category: 'marine',
    roundtripKm: 16500,
    durationDays: 240,
    satelliteTagId: 'SPOT-6-SAT #49021',
    transmitterType: 'Argos Biotelemetry Hydro-Pressure Sensor',
    departureVi: 'Vùng nước băng giá Nam Cực (Antarctica)',
    departureEn: 'Subantarctic Feeding Ice Edge',
    destinationVi: 'Vùng biển nhiệt đới Costa Rica & Rạn san hô Nam Thái Bình Dương',
    destinationEn: 'Tropical Calving Lagoons (Costa Rica / Tonga)',
    primaryDriverVi: 'Tránh nước đóng băng mùa đông vùng cực để sinh con và nuôi con non trong làn nước ấm lặng sóng.',
    primaryDriverEn: 'Fleeing polar winter freezing to nurse fragile calves in calm, predator-sheltered warm tropics.',
    environmentalCurrent: {
      nameVi: 'Hải lưu Humboldt & Vùng Nước Trồi Nam Cực',
      nameEn: 'Humboldt Upwelling Current',
      type: 'ocean_current',
      descriptionVi: 'Cá voi nạp năng lượng sinh khối từ hàng tỷ con nhuyễn thể (krill) tại vùng nước trồi Nam Cực trước khi nhịn đói suốt 6 tháng di cư lên xích đạo.',
      descriptionEn: 'Whales gorge on immense Antarctic krill swarms before fasting for 6 months along their northward migration.',
    },
    climateThreatsVi: [
      'Băng biển Nam Cực thu hẹp làm sụt giảm 80% sinh khối nhuyễn thể (krill).',
      'Tàu hàng siêu trọng tải đâm va trên các luồng hàng hải quốc tế.',
      'Ô nhiễm tiếng ồn siêu âm từ thăm dò dầu khí làm gián đoạn bài hát liên lạc cá voi.'
    ],
    climateThreatsEn: [
      'Antarctic sea ice loss collapses krill biomass by up to 80%.',
      'Vessel strike mortality in heavy commercial shipping corridors.',
      'Anthropogenic sonar and seismic noise disrupts acoustic communication songs.'
    ],
    waypoints: [
      {
        id: 'hw_1',
        nameVi: 'Bán đảo Nam Cực - Vịnh Băng',
        nameEn: 'Antarctic Peninsula Feeding Ground',
        lat: -65.2,
        lng: -64.1,
        season: 'summer',
        monthRangeVi: 'Tháng 1 - Tháng 3',
        monthRangeEn: 'Jan - Mar',
        activityVi: 'Kiếm ăn điên cuồng: Tiêu thụ tới 2 tấn nhuyễn thể/ngày, tích lũy lớp mỡ dày 15 cm.',
        activityEn: 'Hyperphagia: Consumes up to 2 tons of krill daily, building a 15-cm insulating blubber coat.',
        depthMeters: 180,
        waterTempC: 1.2,
      },
      {
        id: 'hw_2',
        nameVi: 'Hải trình Dọc Bờ Biển Chile',
        nameEn: 'Chilean Coastline Transit Corridor',
        lat: -36.5,
        lng: -74.8,
        season: 'autumn',
        monthRangeVi: 'Tháng 4 - Tháng 5',
        monthRangeEn: 'Apr - May',
        activityVi: 'Di chuyển theo dòng hải lưu lạnh Humboldt, bơi liên tục 80-120 km mỗi ngày.',
        activityEn: 'Cruising northward along the cold Humboldt highway, averaging 80-120 km daily.',
        depthMeters: 45,
        waterTempC: 11.5,
      },
      {
        id: 'hw_3',
        nameVi: 'Quần đảo Galapagos - Điểm Dừng Chân',
        nameEn: 'Galapagos Marine Staging Point',
        lat: -0.8,
        lng: -90.5,
        season: 'winter',
        monthRangeVi: 'Tháng 6 - Tháng 7',
        monthRangeEn: 'Jun - Jul',
        activityVi: 'Đàn cá voi đực bắt đầu biểu diễn các bài ca phức tạp dài 20 phút để thu hút bạn tình.',
        activityEn: 'Males start vocalizing intricate 20-minute rhythmic mating songs across hundreds of miles.',
        depthMeters: 30,
        waterTempC: 22.0,
      },
      {
        id: 'hw_4',
        nameVi: 'Vịnh Golfo Dulce, Costa Rica',
        nameEn: 'Golfo Dulce Calving Sanctuary',
        lat: 8.5,
        lng: -83.5,
        season: 'spring',
        monthRangeVi: 'Tháng 8 - Tháng 10',
        monthRangeEn: 'Aug - Oct',
        activityVi: 'Sinh cá voi con nặng 1 tấn; mẹ dạy con thở và lặn trong vịnh nhiệt đới nước nông an toàn.',
        activityEn: 'Birthing 1-ton calves; mothers teach nursing and blowhole surfacing in sheltered warm coves.',
        depthMeters: 15,
        waterTempC: 28.5,
      },
    ],
  },
  {
    id: 'leatherback_turtle',
    titleVi: 'Hải Trình Xuyên Thái Bình Dương Của Rùa Da',
    titleEn: 'Trans-Pacific Leatherback Odyssey',
    speciesSlug: 'dermochelys-coriacea',
    speciesNameVi: 'Rùa Da Biển Sâu',
    speciesNameEn: 'Leatherback Sea Turtle',
    scientific: 'Dermochelys coriacea',
    icon: '🐢',
    category: 'marine',
    roundtripKm: 19800,
    durationDays: 360,
    satelliteTagId: 'TELONICS-GPS #61183',
    transmitterType: 'Backpack Satellite Argos Depth Logger',
    departureVi: 'Bãi đẻ Tây Thái Bình Dương (Indonesia / Quần đảo Solomon)',
    departureEn: 'Jamursba Medi Nesting Beaches, Indonesia',
    destinationVi: 'Vùng nước kiếm ăn giàu sứa ngoài khơi Vịnh Monterey, California',
    destinationEn: 'Monterey Bay Jellyfish Upwelling, California',
    primaryDriverVi: 'Băng qua toàn bộ bồn trũng Thái Bình Dương để săn các bầy sứa khổng lồ nở rộ vào cuối hè ở Bắc Mỹ.',
    primaryDriverEn: 'Crossing the immense Pacific expanse to feast on seasonal coastal blooms of Pacific sea nettle jellyfish.',
    environmentalCurrent: {
      nameVi: 'Dòng Kuroshio Extension & Hải lưu Bắc Thái Bình Dương',
      nameEn: 'North Pacific Gyre & Kuroshio Drift',
      type: 'ocean_current',
      descriptionVi: 'Rùa da thả trôi cơ thể hình giọt nước theo vành đai hải lưu xoáy thuận, tiết kiệm tối đa năng lượng khi bơi hàng vạn km.',
      descriptionEn: 'Turtles lock into the North Pacific drift, passively drafting on current eddies to minimize caloric expenditure.',
    },
    climateThreatsVi: [
      'Nước biển dâng và bão cát xói mòn bãi đẻ nhiệt đới.',
      'Mắc vào lưới rê và dây câu cá ngừ ngầm ngoài khơi (Bycatch).',
      'Nuốt phải túi nilon đại dương vì nhầm lẫn với thức ăn ưa thích là sứa.'
    ],
    climateThreatsEn: [
      'Sea level rise and coastal storms wash away fragile sandy nesting sites.',
      'Longline pelagic fishing bycatch drowning adults.',
      'Ingesting floating plastic bags misidentified as translucent jellyfish.'
    ],
    waypoints: [
      {
        id: 'lt_1',
        nameVi: 'Bãi cát Jamursba Medi, Papua',
        nameEn: 'Jamursba Medi Nesting Beach, Papua',
        lat: -0.5,
        lng: 132.8,
        season: 'summer',
        monthRangeVi: 'Tháng 6 - Tháng 7',
        monthRangeEn: 'Jun - Jul',
        activityVi: 'Đẻ 80-100 trứng trong các hố cát sâu 1 mét dưới màn đêm yên tĩnh.',
        activityEn: 'Deposits 80-100 ping-pong sized eggs in 1-meter deep sand nests under cover of night.',
        depthMeters: 0,
        waterTempC: 29.0,
      },
      {
        id: 'lt_2',
        nameVi: 'Vùng Nước Biển Sâu Marianas',
        nameEn: 'Mariana Trench Pelagic Transit',
        lat: 16.5,
        lng: 145.0,
        season: 'autumn',
        monthRangeVi: 'Tháng 8 - Tháng 10',
        monthRangeEn: 'Aug - Oct',
        activityVi: 'Lặn sâu tới 1.200 mét săn sứa phát quang; cơ chế giữ nhiệt gigantothermy giúp thân nhiệt không hạ.',
        activityEn: 'Deep dives to 1,200m; countercurrent gigantothermy keeps core temperature 10°C above frigid depths.',
        depthMeters: 850,
        waterTempC: 6.0,
      },
      {
        id: 'lt_3',
        nameVi: 'Dải Nước Mở Giữa Thái Bình Dương',
        nameEn: 'Subtropical Convergence Zone',
        lat: 32.0,
        lng: -170.0,
        season: 'winter',
        monthRangeVi: 'Tháng 11 - Tháng 2',
        monthRangeEn: 'Nov - Feb',
        activityVi: 'Định vị bằng từ trường Trái Đất (magnetoreception) qua con đường không có mốc địa hình.',
        activityEn: 'Navigates thousands of miles of featureless ocean using geomagnetic inclination mapping.',
        depthMeters: 120,
        waterTempC: 15.0,
      },
      {
        id: 'lt_4',
        nameVi: 'Vịnh Monterey, California',
        nameEn: 'Monterey Bay Foraging Sanctuary',
        lat: 36.8,
        lng: -122.0,
        season: 'spring',
        monthRangeVi: 'Tháng 3 - Tháng 5',
        monthRangeEn: 'Mar - May',
        activityVi: 'Săn sứa biển liên tục: Tiêu thụ khối lượng sứa bằng 73% trọng lượng cơ thể mỗi ngày.',
        activityEn: 'Massive jellyfish feeding frenzy: Consumes up to 73% of its body weight in jellies per day.',
        depthMeters: 40,
        waterTempC: 13.0,
      },
    ],
  },
  {
    id: 'golden_eagle',
    titleVi: 'Tuyến Bay Xuyên Núi Cao Tuyết Trắng Của Đại Bàng Vàng',
    titleEn: 'Himalayan High-Altitude Eagle Flyway',
    speciesSlug: 'aquila-chrysaetos',
    speciesNameVi: 'Đại Bàng Vàng',
    speciesNameEn: 'Golden Eagle',
    scientific: 'Aquila chrysaetos',
    icon: '🦅',
    category: 'avian',
    roundtripKm: 7800,
    durationDays: 90,
    satelliteTagId: 'MOVEBANK-SOLAR #88194',
    transmitterType: 'Solar Backpack 3D Accelerometer & Barometer',
    departureVi: 'Thảo nguyên Altai & Lãnh nguyên Siberia',
    departureEn: 'Sayan-Altai Mountain Steppes, Siberia',
    destinationVi: 'Thung lũng Indus & Cao nguyên Tây Tạng',
    destinationEn: 'Tibetan Plateau & Indus River Basin',
    primaryDriverVi: 'Tránh mùa đông Siberia âm 50 độ C khi tuyết dày chôn vùi thỏ rừng và chuột chũi.',
    primaryDriverEn: 'Escaping brutal -50°C Siberian blizzards that bury prey beneath feet of hard-packed snow.',
    environmentalCurrent: {
      nameVi: 'Luồng Gió Tây Ôn Đới & Nhiệt Khí Động Núi Cao (Mountain Thermals)',
      nameEn: 'Mountain Ridge Thermal Lift & Jet Stream',
      type: 'wind_belt',
      descriptionVi: 'Đại bàng mở rộng sải cánh 2,3 mét để lướt trên các cột không khí nóng bốc lên từ sườn núi đá vôi, bay hàng trăm km mà hầu như không cần vỗ cánh.',
      descriptionEn: 'Eagles ride rising hot thermal updrafts hugging sheer granite cliffs, gliding hundreds of miles with minimal flapping.',
    },
    climateThreatsVi: [
      'Các trang trại điện gió và cột truyền tải điện cao thế gây va chạm tử vong.',
      'Ngộ độc chì do ăn xác động vật trúng đạn săn của thợ săn.',
      'Sự thay đổi thời điểm ấm lên mùa xuân làm lệch chu kỳ sinh sản và xuất hiện con mồi.'
    ],
    climateThreatsEn: [
      'Collisions with expanding wind turbine farms and high-voltage transmission lines.',
      'Lead poisoning from scavenging gut piles left by big game hunters.',
      'Spring phenological shifts decoupling migration timing from rodent emergence peaks.'
    ],
    waypoints: [
      {
        id: 'ge_1',
        nameVi: 'Dãy Núi Altai, Siberia',
        nameEn: 'Altai Mountain Breeding Cliffs',
        lat: 51.5,
        lng: 88.0,
        season: 'summer',
        monthRangeVi: 'Tháng 6 - Tháng 8',
        monthRangeEn: 'Jun - Aug',
        activityVi: 'Nuôi dưỡng chim non trên vách đá cheo leo; săn thỏ tuyết và sóc đất thảo nguyên.',
        activityEn: 'Rearing eaglets on sheer cliff eyries; hunting mountain hares and marmots.',
        altitudeMeters: 2400,
      },
      {
        id: 'ge_2',
        nameVi: 'Hẻm Núi Dzungarian, Tân Cương',
        nameEn: 'Dzungarian Gate Wind Corridor',
        lat: 45.2,
        lng: 82.3,
        season: 'autumn',
        monthRangeVi: 'Tháng 9 - Tháng 10',
        monthRangeEn: 'Sep - Oct',
        activityVi: 'Vượt qua "Cánh Cổng Dzungarian" nơi tốc độ gió giật đạt 120 km/h, bứt tốc với tốc độ bay 180 km/h.',
        activityEn: 'Threading the treacherous windy gorge, leveraging ferocious mountain gale drafts to sprint at 180 km/h.',
        altitudeMeters: 4200,
      },
      {
        id: 'ge_3',
        nameVi: 'Đèo Khunjerab - Dãy Karakoram',
        nameEn: 'Karakoram Pass Snowfields',
        lat: 36.8,
        lng: 75.5,
        season: 'winter',
        monthRangeVi: 'Tháng 11 - Tháng 1',
        monthRangeEn: 'Nov - Jan',
        activityVi: 'Bay vút qua các đỉnh núi phủ tuyết vĩnh cửu ở độ cao 6.500 mét với đôi mắt lọc tia UV cực hạn.',
        activityEn: 'Cruising over glaciated peaks at 6,500m; specialized pecten ocular membrane shields against UV glare.',
        altitudeMeters: 6500,
      },
      {
        id: 'ge_4',
        nameVi: 'Thung Lũng Sông Indus, Ladakh',
        nameEn: 'Indus Valley Wintering Haven',
        lat: 34.1,
        lng: 77.5,
        season: 'spring',
        monthRangeVi: 'Tháng 2 - Tháng 4',
        monthRangeEn: 'Feb - Apr',
        activityVi: 'Trú đông nơi thung lũng đá ấm áp không bị tuyết phủ hoàn toàn, săn gà rừng tuyết và cừu đá non.',
        activityEn: 'Overwintering in sunlit rocky river gorges, foraging snowcock and Himalayan blue sheep carrion.',
        altitudeMeters: 3100,
      },
    ],
  },
  {
    id: 'african_elephant',
    titleVi: 'Hành Trình Vượt Sa Mạc & Vùng Đất Ngập Nước Của Đàn Voi',
    titleEn: 'Kalahari-Okavango Elephant Drought Circuit',
    speciesSlug: 'loxodonta-africana',
    speciesNameVi: 'Voi Châu Phi',
    speciesNameEn: 'African Bush Elephant',
    scientific: 'Loxodonta africana',
    icon: '🐘',
    category: 'terrestrial',
    roundtripKm: 1450,
    durationDays: 180,
    satelliteTagId: 'AWT-COLLAR #31049',
    transmitterType: 'Iridium Satellite Heavy-Duty Geofenced Collar',
    departureVi: 'Rừng cây Mopane Chobe & Sa mạc Kalahari',
    departureEn: 'Chobe Mopane Woodlands, Botswana',
    destinationVi: 'Đồng bằng châu thổ ngập nước Okavango Delta',
    destinationEn: 'Okavango Floodplain Wetlands',
    primaryDriverVi: 'Ký ức địa lý của voi đầu đàn truyền qua nhiều thế hệ: Tìm kiếm nguồn nước ngọt trong mùa khô khốc liệt.',
    primaryDriverEn: 'Generational spatial memory of matriarchs navigating toward receding water holes during hyper-arid drought.',
    environmentalCurrent: {
      nameVi: 'Vành Đai Hội Tụ Nhiệt Đới (ITCZ) & Chu Kỳ Lũ Okavango',
      nameEn: 'ITCZ Monsoonal Flood Pulse',
      type: 'seasonal_rainfall',
      descriptionVi: 'Mưa rơi ở vùng cao nguyên Angola mất tới 6 tháng để chảy chậm rãi về sa mạc Kalahari, tạo ra một ốc đảo xanh thần kỳ đúng thời điểm khô hạn nhất trong năm.',
      descriptionEn: 'Rain falling in Angolan highlands takes 6 months to crawl into the Kalahari, creating a lush green delta just as surrounding lands dry out.',
    },
    climateThreatsVi: [
      'Hàng rào thú y kiểm soát dịch bệnh ngăn chặn các tuyến hành lang di cư cổ xưa.',
      'Biến đổi khí hậu làm cạn kiệt các hố nước ngầm truyền thống.',
      'Xung đột giữa Người và Voi (HWC) khi đàn voi đi ngang qua cánh đồng nông nghiệp.'
    ],
    climateThreatsEn: [
      'Veterinary cordon fences block ancient inter-country migration corridors.',
      'Climate warming accelerates evaporation of traditional mud wallows and boreholes.',
      'Human-Elephant Conflict (HEC) as ancient paths intersect smallholder crop fields.'
    ],
    waypoints: [
      {
        id: 'ae_1',
        nameVi: 'Rừng Chobe - Bờ Sông Zambezi',
        nameEn: 'Chobe Riverfront Woodlands',
        lat: -17.8,
        lng: 25.1,
        season: 'summer',
        monthRangeVi: 'Tháng 1 - Tháng 3',
        monthRangeEn: 'Jan - Mar',
        activityVi: 'Mùa mưa: Đàn voi phân tán rộng khắp rừng rậm, ăn lá non giàu protein và tắm bùn.',
        activityEn: 'Wet season dispersal: Herds roam widely across mopane woodlands, feasting on tender new browse.',
        altitudeMeters: 920,
      },
      {
        id: 'ae_2',
        nameVi: 'Hành Lang Sa Mạc Savuti',
        nameEn: 'Savuti Marsh Trekway',
        lat: -18.5,
        lng: 24.1,
        season: 'autumn',
        monthRangeVi: 'Tháng 4 - Tháng 6',
        monthRangeEn: 'Apr - Jun',
        activityVi: 'Hành quân theo hàng một dài hàng km do voi bà đầu đàn dẫn đường, lắng nghe sóng hạ âm 15 Hz báo hiệu vị trí nguồn nước.',
        activityEn: 'Single-file march led by oldest matriarch, sensing 15 Hz infrasonic seismic vibrations from distant thunder.',
        altitudeMeters: 950,
      },
      {
        id: 'ae_3',
        nameVi: 'Rìa Lũ Châu Thổ Okavango',
        nameEn: 'Okavango Flood Wave Ingress',
        lat: -19.3,
        lng: 23.2,
        season: 'winter',
        monthRangeVi: 'Tháng 7 - Tháng 9',
        monthRangeEn: 'Jul - Sep',
        activityVi: 'Nước lũ từ Angola tràn về: Đàn voi thỏa sức bơi lội qua các đầm sen súng, ăn cỏ papyrus và củ sen bổ dưỡng.',
        activityEn: 'Angolan floodwaters arrive: Herds plunge into crystal channels, feasting on sweet water lilies and tender papyrus.',
        altitudeMeters: 930,
      },
      {
        id: 'ae_4',
        nameVi: 'Vùng Đất Muối Makgadikgadi',
        nameEn: 'Makgadikgadi Salt Crust Transition',
        lat: -20.5,
        lng: 25.5,
        season: 'spring',
        monthRangeVi: 'Tháng 10 - Tháng 12',
        monthRangeEn: 'Oct - Dec',
        activityVi: 'Liếm đất khoáng và muối để bổ sung canxi và natri cần thiết cho ngà voi trước mùa mưa mới.',
        activityEn: 'Mineral licking at salt pans to replenish essential sodium and calcium for massive ivory tusk growth.',
        altitudeMeters: 900,
      },
    ],
  },
  {
    id: 'atlantic_salmon',
    titleVi: 'Hành Trình Vượt Thác Ngược Dòng Của Cá Hồi Đại Tây Dương',
    titleEn: 'Atlantic Salmon Anadromous River-Ocean Run',
    speciesSlug: 'salmo-salar',
    speciesNameVi: 'Cá Hồi Đại Tây Dương',
    speciesNameEn: 'Atlantic Salmon',
    scientific: 'Salmo salar',
    icon: '🐟',
    category: 'marine',
    roundtripKm: 5400,
    durationDays: 450,
    satelliteTagId: 'VEMCO-ACOUSTIC #1092',
    transmitterType: 'Acoustic Ultrasonic Hydrophone Tag',
    departureVi: 'Đầu nguồn suối nước lạnh vùng núi Na Uy / Scotland',
    departureEn: 'Headwater Spawning Gravel Shallows, Norway',
    destinationVi: 'Băng đảo Greenland & Vùng biển cận cực Bắc Đại Tây Dương',
    destinationEn: 'Subpolar Pelagic Feeding Gyre, West Greenland',
    primaryDriverVi: 'Di cư hai chiều (anadromous): Lớn lên ở biển sâu giàu dinh dưỡng nhưng vượt nghìn trùng quay về đúng con suối nơi sinh ra để đẻ trứng.',
    primaryDriverEn: 'Anadromous homing: Growing colossal in oceanic food webs, returning with pinpoint olfactory accuracy to natal streams.',
    environmentalCurrent: {
      nameVi: 'Nhánh Hải Lưu Bắc Đại Tây Dương (North Atlantic Drift)',
      nameEn: 'North Atlantic Subpolar Gyre',
      type: 'ocean_current',
      descriptionVi: 'Cá hồi di chuyển dọc theo rìa pha trộn giữa dòng nước ấm Gulf Stream và dòng nước lạnh Greenland nơi các đàn tôm cá nhỏ sinh sôi dày đặc.',
      descriptionEn: 'Salmon ride thermal front boundaries between the Gulf Stream extension and subpolar cold waters teeming with capelin.',
    },
    climateThreatsVi: [
      'Đập thủy điện và kè sông ngăn chặn cá mẹ nhảy ngược dòng.',
      'Nhiệt độ nước suối vượt 20°C gây sốc nhiệt và cạn kiệt oxy hòa tan.',
      'Trang trại nuôi cá hồi ven biển lây lan rận biển ký sinh sang cá hồi hoang dã.'
    ],
    climateThreatsEn: [
      'Hydroelectric dams and concrete weirs blocking upstream leaping access.',
      'River water warming exceeding 20°C causing lethal thermal hypoxia.',
      'Intensive aquaculture salmon farms spreading lethal sea lice to wild smolts.'
    ],
    waypoints: [
      {
        id: 'as_1',
        nameVi: 'Đầu Suối Sỏi Sông Vosso, Na Uy',
        nameEn: 'River Vosso Spawning Bed, Norway',
        lat: 60.6,
        lng: 6.2,
        season: 'autumn',
        monthRangeVi: 'Tháng 10 - Tháng 11',
        monthRangeEn: 'Oct - Nov',
        activityVi: 'Cá cái quẫy đuôi đào hố sỏi (redd) đẻ 8.000 trứng; cá đực hàm khoằm thụ tinh bảo vệ tổ.',
        activityEn: 'Females excavate clean gravel nests (redds) laying 8,000 eggs; hook-jawed kype males fertilize.',
        depthMeters: 1.5,
        waterTempC: 5.5,
      },
      {
        id: 'as_2',
        nameVi: 'Vùng Vịnh Hẹp Fjord Ra Biển Bắc',
        nameEn: 'Fjord Smolt Outmigration Corridor',
        lat: 60.8,
        lng: 4.8,
        season: 'spring',
        monthRangeVi: 'Tháng 4 - Tháng 5',
        monthRangeEn: 'Apr - May',
        activityVi: 'Biến thái Smoltification: Thay đổi tế bào mang để có thể chuyển đổi từ nước ngọt sang nước mặn.',
        activityEn: 'Physiological smoltification: Gill ionocytes invert polarity to handle high saline osmotic pressure.',
        depthMeters: 8.0,
        waterTempC: 8.0,
      },
      {
        id: 'as_3',
        nameVi: 'Vùng Nước Kiếm Ăn Tây Greenland',
        nameEn: 'West Greenland Pelagic Foraging Sea',
        lat: 64.0,
        lng: -52.0,
        season: 'summer',
        monthRangeVi: 'Tháng 6 - Tháng 9',
        monthRangeEn: 'Jun - Sep',
        activityVi: 'Tăng trọng lượng gấp 10 lần: Săn cá ốt (capelin) và tôm giáp xác biển sâu.',
        activityEn: 'Exponential somatic growth: Gaining 10x body mass hunting pelagic capelin and krill.',
        depthMeters: 60,
        waterTempC: 3.5,
      },
      {
        id: 'as_4',
        nameVi: 'Vượt Thác Ngược Dòng Về Cội Nguồn',
        nameEn: 'Upstream Waterfall Leaping Ascent',
        lat: 60.5,
        lng: 5.9,
        season: 'summer',
        monthRangeVi: 'Tháng 7 - Tháng 9',
        monthRangeEn: 'Jul - Sep',
        activityVi: 'Nhảy vọt qua các thác nước cao tới 3,5 mét ngược dòng xiết, lần theo "mùi hương hóa học" chính xác của dòng suối mẹ.',
        activityEn: 'Leaping 3.5m over foaming waterfalls, guided upstream by ultra-sensitive chemical olfactory imprinting.',
        depthMeters: 3.0,
        waterTempC: 12.0,
      },
    ],
  },
];

export const MigrationPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const [searchParams] = useSearchParams();

  // Active Selected Route
  const [selectedRouteId, setSelectedRouteId] = useState<string>('humpback_whale');

  // Seasonal scrubber state: 0 (Spring), 1 (Summer), 2 (Autumn), 3 (Winter)
  const [currentSeasonStep, setCurrentSeasonStep] = useState<number>(0);
  const [isPlayingAnimation, setIsPlayingAnimation] = useState<boolean>(true);

  // Radar Layer toggles
  const [showOceanCurrents, setShowOceanCurrents] = useState<boolean>(true);
  const [showWindVectors, setShowWindVectors] = useState<boolean>(true);
  const [showTelemetryPings, setShowTelemetryPings] = useState<boolean>(true);

  // Selected Route from URL param if available
  useEffect(() => {
    const routeParam = searchParams.get('route');
    if (routeParam) {
      const match = MIGRATION_ROUTES.find((r) => r.id === routeParam || r.speciesSlug === routeParam);
      if (match) setSelectedRouteId(match.id);
    }
  }, [searchParams]);

  const activeRoute = useMemo(() => {
    return MIGRATION_ROUTES.find((r) => r.id === selectedRouteId) || MIGRATION_ROUTES[0];
  }, [selectedRouteId]);

  // Current waypoint based on seasonal step
  const currentWaypoint = useMemo(() => {
    const totalWaypoints = activeRoute.waypoints.length;
    const index = Math.min(currentSeasonStep, totalWaypoints - 1);
    return activeRoute.waypoints[index];
  }, [activeRoute, currentSeasonStep]);

  // Auto-play seasonal animation ticker
  useEffect(() => {
    if (!isPlayingAnimation) return;
    const interval = setInterval(() => {
      setCurrentSeasonStep((prev) => (prev + 1) % activeRoute.waypoints.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPlayingAnimation, activeRoute]);

  // Convert (lat, lng) to SVG 1000x500 equirectangular coordinates
  const projectGeo = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 1000;
    const y = ((90 - lat) / 180) * 500;
    return { x, y };
  };

  const seasonsList = [
    { key: 0, labelVi: 'MÙA XUÂN (THÁNG 3-5)', labelEn: 'SPRING (MAR - MAY)' },
    { key: 1, labelVi: 'MÙA HẠ (THÁNG 6-8)', labelEn: 'SUMMER (JUN - AUG)' },
    { key: 2, labelVi: 'MÙA THU (THÁNG 9-11)', labelEn: 'AUTUMN (SEP - NOV)' },
    { key: 3, labelVi: 'MÙA ĐÔNG (THÁNG 12-2)', labelEn: 'WINTER (DEC - FEB)' },
  ];

  return (
    <div className="min-h-screen bg-expedition-dark text-stone-100 font-sans pb-24 selection:bg-natgeo-yellow selection:text-black">
      {/* Top Operations Header Bar */}
      <div className="bg-black/60 border-b border-natgeo-yellow/20 backdrop-blur-md sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-natgeo-yellow/20 border border-natgeo-yellow flex items-center justify-center text-natgeo-yellow">
              <Satellite className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-natgeo-yellow">
                  {isEn ? 'GLOBAL WILDLIFE TELEMETRY RADAR & CORRIDORS' : 'TRẠM RADAR ĐỊNH VỊ DI CƯ & HÀNH LANG KHÍ HẬU'}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 font-mono">
                  ARGOS LIVE FEED
                </span>
              </div>
              <div className="text-[11px] font-mono text-stone-400">
                {isEn ? 'Planetary flyways, oceanic drifts and continental circuits' : 'Theo dõi hải trình biển sâu, tuyến bay xuyên lục địa và đại di cư'}
              </div>
            </div>
          </div>

          {/* Quick Telemetry Layer Filters */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <button
              onClick={() => setShowOceanCurrents(!showOceanCurrents)}
              className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                showOceanCurrents
                  ? 'bg-sky-500/20 text-sky-300 border-sky-400 font-bold'
                  : 'bg-black/60 text-stone-400 border-white/10 hover:text-white'
              }`}
            >
              <Waves className="w-3.5 h-3.5" />
              <span>{isEn ? 'Ocean Currents' : 'Dòng Hải Lưu'}</span>
            </button>

            <button
              onClick={() => setShowWindVectors(!showWindVectors)}
              className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                showWindVectors
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400 font-bold'
                  : 'bg-black/60 text-stone-400 border-white/10 hover:text-white'
              }`}
            >
              <Wind className="w-3.5 h-3.5" />
              <span>{isEn ? 'Atmospheric Jets' : 'Luồng Khí Quyền'}</span>
            </button>

            <button
              onClick={() => setShowTelemetryPings(!showTelemetryPings)}
              className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                showTelemetryPings
                  ? 'bg-natgeo-yellow/20 text-natgeo-yellow border-natgeo-yellow font-bold'
                  : 'bg-black/60 text-stone-400 border-white/10 hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>{isEn ? 'GPS Satellite Pings' : 'Tín Hiệu Vệ Tinh'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Mission Briefing Banner */}
        <div className="p-6 sm:p-8 rounded-3xl field-panel border border-natgeo-yellow/30 relative overflow-hidden shadow-2xl">
          <div className="space-y-2 max-w-3xl relative z-10">
            <div className="flex items-center gap-2 text-xs font-mono text-natgeo-yellow uppercase tracking-widest">
              <Navigation className="w-3.5 h-3.5 text-natgeo-yellow" />
              <span>{isEn ? 'GLOBAL CORRIDORS & ANTHROPOGENIC CHOKEPOINTS' : 'CÁC ĐẠI HẢI TRÌNH & NÚT THẮT KHÍ HẬU TOÀN CẦU'}</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
              {isEn ? 'Planetary Wildlife Migrations & Climate Radar' : 'Hành Trình Di Cư Toàn Cầu & Radar Khí Hậu'}
            </h1>
            <p className="text-sm text-stone-300 leading-relaxed font-sans">
              {isEn
                ? 'From deep-sea leatherbacks traversing the entire Pacific to humpbacks fasting along subpolar currents and eagles scaling Himalayan thermals: discover how wildlife relies on Earth’s fluid oceanic and atmospheric systems to survive.'
                : 'Từ những chú rùa da vượt 19.000 km qua Thái Bình Dương, cá voi lưng gù nhịn đói men theo dòng hải lưu Nam Cực đến đại bàng lướt trên cột nhiệt dãy Himalaya: khám phá cách các loài sinh vật nương tựa vào các dòng chảy của Trái Đất để duy trì sự sống.'}
            </p>
          </div>
        </div>

        {/* Route Selector Cards Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {MIGRATION_ROUTES.map((route) => {
            const isSelected = route.id === selectedRouteId;
            return (
              <button
                key={route.id}
                onClick={() => {
                  setSelectedRouteId(route.id);
                  setCurrentSeasonStep(0);
                }}
                className={`p-4 rounded-2xl text-left transition-all border flex flex-col justify-between h-40 relative overflow-hidden group ${
                  isSelected
                    ? 'bg-natgeo-yellow text-stone-950 border-natgeo-yellow shadow-natgeo font-bold scale-105'
                    : 'bg-stone-950/70 border-white/10 hover:border-natgeo-yellow/40 text-stone-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-2xl">{route.icon}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    isSelected ? 'bg-stone-900 text-natgeo-yellow' : 'bg-black/60 text-natgeo-yellow border border-white/10'
                  }`}>
                    {route.roundtripKm.toLocaleString()} KM
                  </span>
                </div>

                <div>
                  <div className="font-display text-xs font-extrabold uppercase leading-tight line-clamp-2">
                    {isEn ? route.speciesNameEn : route.speciesNameVi}
                  </div>
                  <div className={`text-[10px] font-mono mt-1 ${isSelected ? 'text-stone-900' : 'text-stone-400'}`}>
                    {route.durationDays} {isEn ? 'days expedition' : 'ngày hành trình'}
                  </div>
                </div>

                <div className="text-[9px] font-mono uppercase tracking-wider flex items-center gap-1 opacity-80">
                  <Route className="w-2.5 h-2.5" />
                  <span>{route.category.toUpperCase()}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Interactive Flight & Ocean Radar Map Viewport */}
        <div className="rounded-3xl field-panel border-2 border-natgeo-yellow/40 shadow-2xl p-4 sm:p-6 space-y-6 relative overflow-hidden">
          {/* Telemetry Radar Top Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-natgeo-yellow/20">
            <div>
              <div className="flex items-center gap-2">
                <span className="field-stamp field-stamp-success text-xs">
                  {activeRoute.satelliteTagId}
                </span>
                <span className="text-xs font-mono text-natgeo-yellow">
                  {activeRoute.transmitterType}
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white uppercase mt-1">
                {isEn ? activeRoute.titleEn : activeRoute.titleVi}
              </h2>
            </div>

            {/* Play/Pause Animation & Season Switcher */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlayingAnimation(!isPlayingAnimation)}
                className="p-2.5 rounded-xl bg-black/70 border border-natgeo-yellow/40 text-natgeo-yellow hover:bg-natgeo-yellow hover:text-black transition-all flex items-center gap-1.5 text-xs font-mono font-bold"
              >
                {isPlayingAnimation ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlayingAnimation ? (isEn ? 'Pause Radar' : 'Tạm Dừng') : (isEn ? 'Play Radar' : 'Tiếp Tục')}</span>
              </button>

              <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-white/10 text-xs font-mono">
                {seasonsList.map((s, idx) => (
                  <button
                    key={s.key}
                    onClick={() => {
                      setCurrentSeasonStep(idx);
                      setIsPlayingAnimation(false);
                    }}
                    className={`px-2.5 py-1.5 rounded-lg transition-all ${
                      currentSeasonStep === idx
                        ? 'bg-natgeo-yellow text-stone-950 font-bold shadow-natgeo'
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    {isEn ? s.labelEn.split(' ')[0] : s.labelVi.split(' ')[1]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SVG Map Canvas (Equirectangular Global Projection) */}
          <div className="relative w-full aspect-[2/1] rounded-2xl bg-stone-950 border border-white/10 overflow-hidden shadow-inner">
            {/* Viewfinder reticles */}
            <div className="viewfinder-corner-tl" />
            <div className="viewfinder-corner-tr" />
            <div className="viewfinder-corner-bl" />
            <div className="viewfinder-corner-br" />

            {/* Latitude / Longitude Telemetry Grid Lines */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
              <div className="w-full h-full grid grid-cols-6 grid-rows-4 divide-x divide-y divide-white/20" />
            </div>

            <svg viewBox="0 0 1000 500" className="w-full h-full">
              {/* World Continents Rough Vector Silhouettes */}
              <g fill="#1a1c1e" stroke="#2a2e33" strokeWidth="1" opacity="0.85">
                {/* North America */}
                <path d="M 120 70 L 220 60 L 260 120 L 230 180 L 190 250 L 150 220 L 110 140 Z" />
                {/* South America */}
                <path d="M 230 260 L 310 280 L 330 350 L 290 440 L 250 450 L 220 340 Z" />
                {/* Eurasia */}
                <path d="M 460 70 L 820 60 L 880 140 L 820 220 L 680 240 L 600 200 L 520 180 L 460 120 Z" />
                {/* Africa */}
                <path d="M 460 190 L 570 190 L 600 260 L 580 380 L 520 420 L 460 340 L 440 240 Z" />
                {/* Australia */}
                <path d="M 780 320 L 870 320 L 890 380 L 820 410 L 760 370 Z" />
                {/* Antarctica */}
                <path d="M 100 480 L 900 480 L 850 460 L 500 455 L 150 465 Z" />
              </g>

              {/* Ocean Currents Overlay Layer */}
              {showOceanCurrents && (
                <g className="animate-pulse">
                  {GLOBAL_CURRENTS.map((c) => (
                    <path
                      key={c.id}
                      d={c.pathD}
                      fill="none"
                      stroke={c.temp === 'warm' ? '#f59e0b' : '#38bdf8'}
                      strokeWidth="2.5"
                      strokeDasharray="6 4"
                      opacity="0.6"
                    />
                  ))}
                </g>
              )}

              {/* Active Migration Route Path */}
              <g>
                {/* Full Migration Track Dashed Polyline */}
                {(() => {
                  const pointsStr = activeRoute.waypoints
                    .map((wp) => {
                      const p = projectGeo(wp.lat, wp.lng);
                      return `${p.x},${p.y}`;
                    })
                    .join(' ');

                  return (
                    <>
                      <polyline
                        points={pointsStr}
                        fill="none"
                        stroke="#f5b800"
                        strokeWidth="3.5"
                        strokeDasharray="8 6"
                        className="opacity-90"
                      />
                      {/* Secondary glowing bloom line */}
                      <polyline
                        points={pointsStr}
                        fill="none"
                        stroke="#f5b800"
                        strokeWidth="10"
                        strokeOpacity="0.2"
                      />
                    </>
                  );
                })()}

                {/* Waypoints Beacons */}
                {activeRoute.waypoints.map((wp, index) => {
                  const p = projectGeo(wp.lat, wp.lng);
                  const isCurrent = wp.id === currentWaypoint.id;

                  return (
                    <g key={wp.id} className="cursor-pointer" onClick={() => setCurrentSeasonStep(index)}>
                      {/* Outer pulse circle for current waypoint */}
                      {isCurrent && (
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r="16"
                          fill="none"
                          stroke="#f5b800"
                          strokeWidth="2"
                          className="animate-ping origin-center"
                        />
                      )}

                      {/* Main Node Circle */}
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={isCurrent ? '8' : '5'}
                        fill={isCurrent ? '#f5b800' : '#111315'}
                        stroke="#f5b800"
                        strokeWidth="2.5"
                      />

                      {/* Waypoint Number Label */}
                      <text
                        x={p.x}
                        y={p.y - 12}
                        textAnchor="middle"
                        fill={isCurrent ? '#f5b800' : '#d6d3d1'}
                        fontSize="10"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        {index + 1}. {isEn ? wp.nameEn.split(' ')[0] : wp.nameVi.split(' ')[0]}
                      </text>
                    </g>
                  );
                })}

                {/* Active Animal Animated Avatar Pin */}
                {(() => {
                  const p = projectGeo(currentWaypoint.lat, currentWaypoint.lng);
                  return (
                    <g transform={`translate(${p.x}, ${p.y})`}>
                      <circle cx="0" cy="0" r="14" fill="#000000" stroke="#f5b800" strokeWidth="2" />
                      <text x="0" y="4" textAnchor="middle" fontSize="12">
                        {activeRoute.icon}
                      </text>
                    </g>
                  );
                })()}
              </g>
            </svg>

            {/* Bottom Real-time Telemetry Readout Strip */}
            <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-white font-bold">
                  {isEn ? currentWaypoint.nameEn : currentWaypoint.nameVi}
                </span>
                <span className="text-stone-400">
                  [{currentWaypoint.lat.toFixed(1)}°N, {currentWaypoint.lng.toFixed(1)}°E]
                </span>
              </div>

              <div className="flex items-center gap-4 text-[11px] text-stone-300">
                <span>
                  🗓️ <strong className="text-natgeo-yellow">{isEn ? currentWaypoint.monthRangeEn : currentWaypoint.monthRangeVi}</strong>
                </span>

                {currentWaypoint.altitudeMeters !== undefined && (
                  <span>
                    🏔️ {isEn ? 'Alt: ' : 'Độ cao: '} <strong className="text-white">{currentWaypoint.altitudeMeters}m</strong>
                  </span>
                )}

                {currentWaypoint.depthMeters !== undefined && (
                  <span>
                    🌊 {isEn ? 'Depth: ' : 'Độ sâu: '} <strong className="text-white">{currentWaypoint.depthMeters}m</strong>
                  </span>
                )}

                {currentWaypoint.waterTempC !== undefined && (
                  <span>
                    🌡️ {isEn ? 'Temp: ' : 'Nhiệt độ: '} <strong className="text-white">{currentWaypoint.waterTempC}°C</strong>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Current Waypoint Action & Biological Activity Card */}
          <div className="p-5 rounded-2xl bg-black/60 border border-natgeo-yellow/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <div className="text-xs font-mono text-natgeo-yellow uppercase font-bold flex items-center gap-2">
                <Compass className="w-3.5 h-3.5" />
                <span>{isEn ? 'CURRENT BEACON STAGE ACTIVITY' : 'HOẠT ĐỘNG THỰC ĐỊA TẠI CỘT MỐC'}</span>
              </div>
              <p className="text-sm text-stone-200 font-sans leading-relaxed">
                {isEn ? currentWaypoint.activityEn : currentWaypoint.activityVi}
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <Link
                to={`/species/${activeRoute.speciesSlug}`}
                className="px-4 py-2.5 rounded-xl bg-natgeo-yellow text-stone-950 font-mono font-bold text-xs uppercase tracking-wider shadow-natgeo hover:bg-amber-400 transition-all flex items-center gap-2"
              >
                <span>{isEn ? 'Inspect Specimen 3D' : 'Khám Phá Mẫu Vật 3D'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Detailed Corridor Analysis: Climate Driver, Ocean Currents & Anthropogenic Threats */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Environmental Flow & Physics (6 Cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="p-6 rounded-3xl field-panel border border-natgeo-yellow/30 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-natgeo-yellow uppercase">
                <Waves className="w-4 h-4" />
                <span>{isEn ? 'PLANETARY FLUID ENGINE & ENVIRONMENTAL DRIVER' : 'DÒNG HẢI LƯU & LUỒNG KHÍ QUYỂN DẪN ĐƯỜNG'}</span>
              </div>

              <div className="space-y-2">
                <h3 className="font-display text-xl font-bold text-white uppercase">
                  {isEn ? activeRoute.environmentalCurrent.nameEn : activeRoute.environmentalCurrent.nameVi}
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed font-sans">
                  {isEn ? activeRoute.environmentalCurrent.descriptionEn : activeRoute.environmentalCurrent.descriptionVi}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 text-xs font-mono space-y-2">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-stone-400">{isEn ? 'Departure Zone' : 'Điểm Xuất Phát'}:</span>
                  <span className="text-white font-bold">{isEn ? activeRoute.departureEn : activeRoute.departureVi}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-stone-400">{isEn ? 'Destination Sanctuary' : 'Điểm Đến Sinh Tồn'}:</span>
                  <span className="text-natgeo-yellow font-bold">{isEn ? activeRoute.destinationEn : activeRoute.destinationVi}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-stone-400">{isEn ? 'Evolutionary Driver' : 'Động Lực Tiến Hóa'}:</span>
                  <span className="text-stone-200">{isEn ? activeRoute.primaryDriverEn : activeRoute.primaryDriverVi}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Climate Hazards & Human Bottlenecks (6 Cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="p-6 rounded-3xl bg-rose-950/30 border border-rose-500/40 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-400 uppercase">
                <ShieldAlert className="w-4 h-4" />
                <span>{isEn ? 'CLIMATE HAZARDS & ANTHROPOGENIC CHOKEPOINTS' : 'HIỂM HỌA KHÍ HẬU & NÚT THẮT NHÂN SINH'}</span>
              </div>

              <p className="text-xs text-rose-200/90 leading-relaxed font-sans">
                {isEn
                  ? 'Migratory species face escalating ecological bottlenecks as global warming shifts thermal regimes and human industrial infrastructure fragments natural paths.'
                  : 'Các loài di cư đang đối mặt với những nút thắt sinh thái nghiêm trọng khi sự ấm lên toàn cầu làm thay đổi các dòng hải lưu và hàng rào nhân tạo chia cắt hành lang di truyền.'}
              </p>

              <div className="space-y-2.5 pt-2">
                {(isEn ? activeRoute.climateThreatsEn : activeRoute.climateThreatsVi).map((threat, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-black/60 border border-rose-500/20 text-xs text-stone-200 flex items-start gap-2.5 font-sans"
                  >
                    <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0 mt-1" />
                    <span>{threat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
