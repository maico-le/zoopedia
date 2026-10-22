import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store/useAppStore';
import { Globe, Moon, Sun, Layers, Compass, Award, Search, Shuffle, Radio, Network } from 'lucide-react';
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
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-expedition-dark/90 border-b border-natgeo-yellow/20 text-stone-100 transition-colors shadow-2xl">
      {/* Top Telemetry Ruler Border */}
      <div className="h-1 w-full bg-gradient-to-r from-natgeo-yellow via-amber-500 to-natgeo-yellow opacity-80" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Emblem: NatGeo Expedition Badge */}
        <Link to="/" className="flex items-center gap-3.5 group">
          {/* Iconic Yellow Rectangle Border */}
          <div className="relative">
            <div className="w-10 h-12 rounded bg-black border-2 border-natgeo-yellow p-0.5 shadow-natgeo group-hover:scale-105 transition-all flex items-center justify-center">
              <span className="text-xl">🦁</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-natgeo-yellow rounded-full border-2 border-stone-950 flex items-center justify-center">
              <div className="w-1 h-1 bg-stone-950 rounded-full" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-2xl font-extrabold tracking-wider text-white group-hover:text-natgeo-yellow transition-colors uppercase">
                Zoopedia
              </span>
              <span className="text-[10px] font-mono uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-natgeo-yellow/15 text-natgeo-yellow border border-natgeo-yellow/40">
                FIELD EXPEDITION
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-stone-400 uppercase tracking-widest">
              <Radio className="w-2.5 h-2.5 text-natgeo-yellow animate-pulse" />
              <span>{t('nav.subBrand')}</span>
              <span className="text-stone-600">•</span>
              <span className="text-amber-400/80">LAT 12°N 104°E</span>
            </div>
          </div>
        </Link>

        {/* Archival Navigation: Field Journal Style */}
        <nav className="hidden md:flex items-center gap-2 text-xs font-mono font-bold tracking-wider uppercase">
          <Link
            to="/explore"
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 border ${
              isActive('/explore')
                ? 'bg-natgeo-yellow/15 text-natgeo-yellow border-natgeo-yellow/50 shadow-glow font-extrabold'
                : 'border-transparent text-stone-300 hover:text-natgeo-yellow hover:bg-white/[0.04]'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-natgeo-yellow" />
            {t('nav.explore')}
          </Link>

          <Link
            to="/taxa"
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 border ${
              isActive('/taxa')
                ? 'bg-natgeo-yellow/15 text-natgeo-yellow border-natgeo-yellow/50 shadow-glow font-extrabold'
                : 'border-transparent text-stone-300 hover:text-natgeo-yellow hover:bg-white/[0.04]'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-natgeo-yellow" />
            {t('nav.taxonomy')}
          </Link>

          <Link
            to="/ecosystem"
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 border ${
              isActive('/ecosystem')
                ? 'bg-natgeo-yellow/15 text-natgeo-yellow border-natgeo-yellow/50 shadow-glow font-extrabold'
                : 'border-transparent text-stone-300 hover:text-natgeo-yellow hover:bg-white/[0.04]'
            }`}
          >
            <Network className="w-3.5 h-3.5 text-natgeo-yellow" />
            {t('nav.ecosystem')}
          </Link>

          <Link
            to="/species/panthera-tigris"
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 border ${
              location.pathname.startsWith('/species')
                ? 'bg-natgeo-yellow/15 text-natgeo-yellow border-natgeo-yellow/50 shadow-glow font-extrabold'
                : 'border-transparent text-stone-300 hover:text-natgeo-yellow hover:bg-white/[0.04]'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-natgeo-yellow" />
            {t('nav.anatomy')}
          </Link>

          <Link
            to="/credits"
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 border ${
              isActive('/credits')
                ? 'bg-natgeo-yellow/15 text-natgeo-yellow border-natgeo-yellow/50 shadow-glow font-extrabold'
                : 'border-transparent text-stone-300 hover:text-natgeo-yellow hover:bg-white/[0.04]'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-natgeo-yellow" />
            {t('nav.credits')}
          </Link>
        </nav>

        {/* Global Field Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleRandomSpecimen}
            className="btn-expedition-secondary hidden sm:inline-flex"
            title={language === 'en' ? 'Examine random field specimen' : 'Xem mẫu vật thực địa ngẫu nhiên'}
          >
            <Shuffle className="w-3.5 h-3.5 text-natgeo-yellow" />
            <span>{t('nav.random')}</span>
          </button>

          <button
            onClick={handleLanguageToggle}
            className="btn-expedition-secondary"
            title={language === 'en' ? 'Switch Language (Vietnamese / English)' : 'Đổi ngôn ngữ (Tiếng Việt / English)'}
          >
            <Globe className="w-3.5 h-3.5 text-natgeo-yellow" />
            <span className="font-mono font-bold text-natgeo-yellow">{language.toUpperCase()}</span>
          </button>

          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-xl border border-natgeo-yellow/20 bg-stone-900/90 hover:bg-white/10 text-stone-300 hover:text-natgeo-yellow transition-all"
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-natgeo-yellow" /> : <Moon className="w-4 h-4 text-sky-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};
