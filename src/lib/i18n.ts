import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  vi: {
    translation: {
      appName: 'Zoopedia',
      tagline: 'Bách khoa toàn thư thế giới động vật 3D tương tác đa chiều',
      nav: {
        home: 'Trang chủ',
        taxonomy: 'Cây phân loại',
        anatomy: 'Mô hình giải phẫu',
        explore: 'Khám phá',
        credits: 'Ghi công & Giấy phép',
        dataQuality: 'Chất lượng dữ liệu',
      },
      search: {
        placeholder: 'Tìm kiếm loài (Hổ, Tiger, Panthera tigris)...',
        noResults: 'Không tìm thấy loài phù hợp',
        filters: 'Bộ lọc',
      },
      species: {
        overview: 'Tổng quan',
        morphology: 'Hình thái',
        habitat: 'Môi trường & Phân bố',
        diet: 'Dinh dưỡng',
        behavior: 'Tập tính',
        lifeCycle: 'Chu kỳ sống',
        reproduction: 'Sinh sản',
        conservation: 'Bảo tồn',
        funFacts: 'Thông tin thú vị',
        provenance: 'Nguồn & Giấy phép',
        representativeNotice: 'Mô hình đại diện cho nhóm, không phải chính xác loài này.',
        unverifiedNotice: 'Tên hoặc nội dung chưa kiểm chứng thực tế.',
      },
      viewer: {
        rotate: 'Tự động xoay',
        reset: 'Đặt lại góc nhìn',
        screenshot: 'Chụp ảnh',
        fullscreen: 'Toàn màn hình',
        layers: 'Các lớp giải phẫu',
        explode: 'Tách rời bộ phận (Explode)',
        quiz: 'Kiểm tra giải phẫu',
      },
    },
  },
  en: {
    translation: {
      appName: 'Zoopedia',
      tagline: 'Interactive 3D Animalia Encyclopedia & Anatomy',
      nav: {
        home: 'Home',
        taxonomy: 'Taxonomy',
        anatomy: 'Anatomy Models',
        explore: 'Explore',
        credits: 'Credits & Licenses',
        dataQuality: 'Data Quality',
      },
      search: {
        placeholder: 'Search species (Tiger, Panthera tigris)...',
        noResults: 'No species found',
        filters: 'Filters',
      },
      species: {
        overview: 'Overview',
        morphology: 'Morphology',
        habitat: 'Habitat & Range',
        diet: 'Diet',
        behavior: 'Behavior',
        lifeCycle: 'Life Cycle',
        reproduction: 'Reproduction',
        conservation: 'Conservation',
        funFacts: 'Fun Facts',
        provenance: 'Sources & Licenses',
        representativeNotice: 'Representative archetype model for this taxonomic group.',
        unverifiedNotice: 'Unverified automated name or translation.',
      },
      viewer: {
        rotate: 'Auto Rotate',
        reset: 'Reset Camera',
        screenshot: 'Screenshot',
        fullscreen: 'Fullscreen',
        layers: 'Anatomy Layers',
        explode: 'Explode View',
        quiz: 'Anatomy Quiz',
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'vi',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
