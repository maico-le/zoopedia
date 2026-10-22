import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store/useAppStore';
import {
  Globe,
  Moon,
  Sun,
  Layers,
  Compass,
  Award,
  Search,
  Shuffle,
  Network,
  GitFork,
  Navigation,
  Eye,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { getRandomSpeciesSlug } from '../lib/data-loader';

export const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { darkMode, toggleDarkMode, language, setLanguage } = useAppStore();
  const location = useLocation();
  const navigate = useNavigate();

  // Dropdown for specialized research modules
  const [isExpeditionDropdownOpen, setIsExpeditionDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsExpeditionDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageToggle = () => {
    const nextLang = language === 'vi' ? 'en' : 'vi';
    setLanguage(nextLang);
    i18n.changeLanguage(nextLang);
  };

  const handleRandomSpecimen = () => {
    const slug = getRandomSpeciesSlug();
    navigate(`/species/${slug}`);
  };

  const isCurrent = (path: string) => location.pathname === path;
  const isExpeditionActive = ['/ecosystem', '/evolution', '/migration', '/vision'].some((p) =>
    location.pathname.startsWith(p)
  );

  return (
    <header className="sticky top-0 z-50 backdrop-blur-2xl bg-white/95 border-b border-emerald-100 text-slate-800 transition-colors shadow-sm">
      {/* Top Luminous Emerald Accent Line */}
      <div className="h-[2.5px] w-full bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-85" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Emblem: Modern Botanical & Wildlife Discovery */}
        <Link to="/" className="flex items-center gap-3.5 group shrink-0">
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700 p-0.5 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-all flex items-center justify-center">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <span className="text-xl group-hover:scale-110 transition-transform">🌿</span>
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-2xl font-extrabold tracking-tight text-slate-900 group-hover:text-emerald-600 transition-colors">
                Zoopedia
              </span>
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                PRO 3D
              </span>
            </div>
            <div className="text-[11px] font-sans text-slate-500 tracking-wide font-medium">
              {t('nav.subBrand')}
            </div>
          </div>
        </Link>

        {/* Clean, Non-wrapping Navigation Menu */}
        <nav className="hidden lg:flex items-center gap-1.5 text-xs font-sans font-semibold">
          <Link
            to="/explore"
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 ${
              isCurrent('/explore')
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm font-bold'
                : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/70'
            }`}
          >
            <Search className="w-4 h-4 text-emerald-600" />
            <span>{t('nav.explore')}</span>
          </Link>

          <Link
            to="/taxa"
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 ${
              isCurrent('/taxa')
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm font-bold'
                : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/70'
            }`}
          >
            <Compass className="w-4 h-4 text-emerald-600" />
            <span>{t('nav.taxonomy')}</span>
          </Link>

          <Link
            to="/species/panthera-tigris"
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 ${
              location.pathname.startsWith('/species')
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm font-bold'
                : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/70'
            }`}
          >
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>{t('nav.anatomy')}</span>
          </Link>

          {/* Specialized Research Modules Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsExpeditionDropdownOpen(!isExpeditionDropdownOpen)}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 ${
                isExpeditionActive
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/70'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>{language === 'en' ? 'Expeditions & Labs' : 'Chuyên đề dã ngoại'}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isExpeditionDropdownOpen ? 'rotate-180 text-emerald-600' : 'text-slate-400'
                }`}
              />
            </button>

            {/* Dropdown Menu Panel */}
            {isExpeditionDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 rounded-2xl bg-white border border-emerald-100 shadow-xl p-2 z-50 divide-y divide-slate-100 animate-fadeIn backdrop-blur-2xl">
                <div className="space-y-1 pb-1">
                  <Link
                    to="/ecosystem"
                    onClick={() => setIsExpeditionDropdownOpen(false)}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-emerald-50/80 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 group-hover:scale-105 transition-transform">
                      <Network className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 text-xs group-hover:text-emerald-700">
                        {language === 'en' ? 'Food Web & Ecosystem' : 'Chuỗi thức ăn & Hệ sinh thái'}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {language === 'en' ? 'Trophic cascade simulator' : 'Mô phỏng động lực quần thể'}
                      </div>
                    </div>
                  </Link>

                  <Link
                    to="/evolution"
                    onClick={() => setIsExpeditionDropdownOpen(false)}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-emerald-50/80 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-teal-100 border border-teal-200 flex items-center justify-center text-teal-700 group-hover:scale-105 transition-transform">
                      <GitFork className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 text-xs group-hover:text-emerald-700">
                        {language === 'en' ? 'Evolution & Paleomap' : 'Cây tiến hóa & Bản đồ cổ địa lý'}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {language === 'en' ? 'Continental drift 540 Ma' : 'Phân bố loài 540 triệu năm'}
                      </div>
                    </div>
                  </Link>

                  <Link
                    to="/migration"
                    onClick={() => setIsExpeditionDropdownOpen(false)}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-emerald-50/80 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 group-hover:scale-105 transition-transform">
                      <Navigation className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 text-xs group-hover:text-emerald-700">
                        {language === 'en' ? 'Migration Radar' : 'Radar di cư toàn cầu'}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {language === 'en' ? 'Flyways & oceanic currents' : 'Tuyến bay & hải lưu xuyên biển'}
                      </div>
                    </div>
                  </Link>

                  <Link
                    to="/vision"
                    onClick={() => setIsExpeditionDropdownOpen(false)}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-emerald-50/80 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-teal-100 border border-teal-200 flex items-center justify-center text-teal-700 group-hover:scale-105 transition-transform">
                      <Eye className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 text-xs group-hover:text-emerald-700">
                        {language === 'en' ? 'Animal Sensory Vision' : 'Thị giác & Giác quan động vật'}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {language === 'en' ? 'FLIR thermal, UV & night optics' : 'Kính tầm nhiệt, tia cực tím UV'}
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link
            to="/credits"
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 ${
              isCurrent('/credits')
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm font-bold'
                : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/70'
            }`}
          >
            <Award className="w-4 h-4 text-emerald-600" />
            <span>{t('nav.credits')}</span>
          </Link>
        </nav>

        {/* Global Action Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleRandomSpecimen}
            className="btn-expedition-secondary hidden sm:inline-flex text-xs"
            title={language === 'en' ? 'Examine random specimen' : 'Xem mẫu vật ngẫu nhiên'}
          >
            <Shuffle className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t('nav.random')}</span>
          </button>

          <button
            onClick={handleLanguageToggle}
            className="btn-expedition-secondary text-xs"
            title={language === 'en' ? 'Switch Language (Vietnamese / English)' : 'Đổi ngôn ngữ (Tiếng Việt / English)'}
          >
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-mono font-bold text-emerald-700">{language.toUpperCase()}</span>
          </button>

          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-xl border border-emerald-200 bg-white hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 transition-all shadow-sm"
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-emerald-600" /> : <Moon className="w-4 h-4 text-emerald-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};
