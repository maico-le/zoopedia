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
    <header className="sticky top-0 z-50 backdrop-blur-2xl bg-[#080c14]/90 border-b border-slate-800/80 text-slate-100 transition-colors shadow-2xl">
      {/* Top Luminous Accent Line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-80" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Emblem: Modern Wildlife Discovery */}
        <Link to="/" className="flex items-center gap-3.5 group shrink-0">
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-500 p-0.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-all flex items-center justify-center">
              <div className="w-full h-full bg-[#080c14] rounded-[14px] flex items-center justify-center">
                <span className="text-xl group-hover:scale-110 transition-transform">🦁</span>
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full border-2 border-[#080c14] flex items-center justify-center" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-2xl font-extrabold tracking-tight text-white group-hover:text-amber-400 transition-colors">
                Zoopedia
              </span>
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/30">
                PRO 3D
              </span>
            </div>
            <div className="text-[11px] font-sans text-slate-400 tracking-wide">
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
                ? 'bg-amber-400/15 text-amber-400 border border-amber-400/40 shadow-sm font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Search className="w-4 h-4 text-amber-400" />
            <span>{t('nav.explore')}</span>
          </Link>

          <Link
            to="/taxa"
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 ${
              isCurrent('/taxa')
                ? 'bg-amber-400/15 text-amber-400 border border-amber-400/40 shadow-sm font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Compass className="w-4 h-4 text-amber-400" />
            <span>{t('nav.taxonomy')}</span>
          </Link>

          <Link
            to="/species/panthera-tigris"
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 ${
              location.pathname.startsWith('/species')
                ? 'bg-amber-400/15 text-amber-400 border border-amber-400/40 shadow-sm font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Layers className="w-4 h-4 text-amber-400" />
            <span>{t('nav.anatomy')}</span>
          </Link>

          {/* Specialized Research Modules Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsExpeditionDropdownOpen(!isExpeditionDropdownOpen)}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 ${
                isExpeditionActive
                  ? 'bg-amber-400/15 text-amber-400 border border-amber-400/40 shadow-sm font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{language === 'en' ? 'Expeditions & Labs' : 'Chuyên đề dã ngoại'}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isExpeditionDropdownOpen ? 'rotate-180 text-amber-400' : 'text-slate-400'
                }`}
              />
            </button>

            {/* Dropdown Menu Panel */}
            {isExpeditionDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 rounded-2xl bg-[#0f172a] border border-slate-700/80 shadow-2xl p-2 z-50 divide-y divide-slate-800 animate-fadeIn backdrop-blur-2xl">
                <div className="space-y-1 pb-1">
                  <Link
                    to="/ecosystem"
                    onClick={() => setIsExpeditionDropdownOpen(false)}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-800 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                      <Network className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-xs group-hover:text-amber-400">
                        {language === 'en' ? 'Food Web & Ecosystem' : 'Chuỗi thức ăn & Hệ sinh thái'}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {language === 'en' ? 'Trophic cascade simulator' : 'Mô phỏng động lực quần thể'}
                      </div>
                    </div>
                  </Link>

                  <Link
                    to="/evolution"
                    onClick={() => setIsExpeditionDropdownOpen(false)}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-800 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                      <GitFork className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-xs group-hover:text-amber-400">
                        {language === 'en' ? 'Evolution & Paleomap' : 'Cây tiến hóa & Bản đồ cổ địa lý'}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {language === 'en' ? 'Continental drift 540 Ma' : 'Phân bố loài 540 triệu năm'}
                      </div>
                    </div>
                  </Link>

                  <Link
                    to="/migration"
                    onClick={() => setIsExpeditionDropdownOpen(false)}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-800 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 group-hover:scale-105 transition-transform">
                      <Navigation className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-xs group-hover:text-amber-400">
                        {language === 'en' ? 'Migration Radar' : 'Radar di cư toàn cầu'}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {language === 'en' ? 'Flyways & oceanic currents' : 'Tuyến bay & hải lưu xuyên biển'}
                      </div>
                    </div>
                  </Link>

                  <Link
                    to="/vision"
                    onClick={() => setIsExpeditionDropdownOpen(false)}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-800 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                      <Eye className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-xs group-hover:text-amber-400">
                        {language === 'en' ? 'Animal Sensory Vision' : 'Thị giác & Giác quan động vật'}
                      </div>
                      <div className="text-[10px] text-slate-400">
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
                ? 'bg-amber-400/15 text-amber-400 border border-amber-400/40 shadow-sm font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Award className="w-4 h-4 text-amber-400" />
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
            <Shuffle className="w-3.5 h-3.5 text-amber-400" />
            <span>{t('nav.random')}</span>
          </button>

          <button
            onClick={handleLanguageToggle}
            className="btn-expedition-secondary text-xs"
            title={language === 'en' ? 'Switch Language (Vietnamese / English)' : 'Đổi ngôn ngữ (Tiếng Việt / English)'}
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono font-bold text-amber-400">{language.toUpperCase()}</span>
          </button>

          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-xl border border-slate-700/80 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-amber-400 transition-all"
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};
