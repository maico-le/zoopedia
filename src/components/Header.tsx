import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store/useAppStore';
import { Globe, Moon, Sun, Layers, Compass, Award, Search, Shuffle } from 'lucide-react';
import { getRandomSpeciesSlug } from '../lib/data-loader';

export const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { darkMode, toggleDarkMode, language, setLanguage } = useAppStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLanguageToggle = () => {
    const nextLang = language === 'vi' ? 'en' : 'vi';
    setLanguage(nextLang);
    i18n.changeLanguage(nextLang);
  };

  const handleRandomSpecimen = () => {
    const slug = getRandomSpeciesSlug();
    navigate(`/species/${slug}`);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-specimen-dark/85 border-b border-white/[0.08] text-stone-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Emblem */}
        <Link to="/" className="flex items-center gap-3.5 group">
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 via-emerald-600 to-teal-800 p-0.5 shadow-glow group-hover:scale-105 transition-all">
              <div className="w-full h-full bg-stone-950 rounded-[14px] flex items-center justify-center text-xl">
                🦁
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-stone-950" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl font-bold tracking-wide text-white group-hover:text-emerald-300 transition-colors">
                Zoopedia
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                3D BIO
              </span>
            </div>
            <span className="block text-[11px] text-stone-400 font-sans tracking-wider uppercase font-medium">
              {t('nav.subBrand')}
            </span>
          </div>
        </Link>

        {/* Archival Navigation */}
        <nav className="hidden md:flex items-center gap-1.5 text-sm font-medium">
          <Link
            to="/explore"
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
              isActive('/explore')
                ? 'bg-emerald-500/15 text-emerald-300 font-semibold border border-emerald-500/30 shadow-sm'
                : 'text-stone-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Search className="w-4 h-4 text-emerald-400" />
            {t('nav.explore')}
          </Link>

          <Link
            to="/taxa"
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
              isActive('/taxa')
                ? 'bg-emerald-500/15 text-emerald-300 font-semibold border border-emerald-500/30 shadow-sm'
                : 'text-stone-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Compass className="w-4 h-4 text-emerald-400" />
            {t('nav.taxonomy')}
          </Link>

          <Link
            to="/species/panthera-tigris"
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
              location.pathname.startsWith('/species')
                ? 'bg-emerald-500/15 text-emerald-300 font-semibold border border-emerald-500/30 shadow-sm'
                : 'text-stone-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-4 h-4 text-emerald-400" />
            {t('nav.anatomy')}
          </Link>

          <Link
            to="/credits"
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
              isActive('/credits')
                ? 'bg-emerald-500/15 text-emerald-300 font-semibold border border-emerald-500/30 shadow-sm'
                : 'text-stone-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Award className="w-4 h-4 text-emerald-400" />
            {t('nav.credits')}
          </Link>
        </nav>

        {/* Global Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleRandomSpecimen}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-stone-900/80 hover:bg-white/10 text-xs font-mono font-semibold uppercase tracking-wider text-amber-300 hover:text-amber-200 transition-all hover:border-amber-500/40"
            title={language === 'en' ? 'View random specimen' : 'Xem mẫu vật ngẫu nhiên'}
          >
            <Shuffle className="w-3.5 h-3.5 text-amber-400" />
            <span>{t('nav.random')}</span>
          </button>

          <button
            onClick={handleLanguageToggle}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-stone-900/80 hover:bg-white/10 text-xs font-mono font-semibold uppercase tracking-wider text-stone-200 transition-all hover:border-emerald-500/40"
            title={language === 'en' ? 'Switch Language (Vietnamese / English)' : 'Đổi ngôn ngữ (Tiếng Việt / English)'}
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language.toUpperCase()}</span>
          </button>

          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-full border border-white/10 bg-stone-900/80 hover:bg-white/10 text-stone-300 hover:text-white transition-all hover:border-amber-500/40"
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};
