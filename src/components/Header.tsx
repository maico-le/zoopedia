import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store/useAppStore';
import { Globe, Moon, Sun, Layers, Compass, Award } from 'lucide-react';

export const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { darkMode, toggleDarkMode, language, setLanguage } = useAppStore();
  const location = useLocation();

  const handleLanguageToggle = () => {
    const nextLang = language === 'vi' ? 'en' : 'vi';
    setLanguage(nextLang);
    i18n.changeLanguage(nextLang);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-stone-900/80 border-b border-stone-800 text-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center font-bold text-xl text-stone-950 shadow-lg shadow-emerald-950/40 group-hover:scale-105 transition-transform">
            🦁
          </div>
          <div>
            <span className="text-xl font-black tracking-tight bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
              Zoopedia
            </span>
            <span className="block text-[10px] uppercase font-semibold text-stone-400 tracking-wider">
              3D Animalia
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            to="/taxa"
            className={`flex items-center gap-1.5 transition-colors ${
              isActive('/taxa') ? 'text-emerald-400 font-semibold' : 'text-stone-300 hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4" />
            {t('nav.taxonomy')}
          </Link>

          <Link
            to="/species/panthera-tigris"
            className={`flex items-center gap-1.5 transition-colors ${
              location.pathname.startsWith('/species')
                ? 'text-emerald-400 font-semibold'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            {t('nav.anatomy')}
          </Link>

          <Link
            to="/credits"
            className={`flex items-center gap-1.5 transition-colors ${
              isActive('/credits') ? 'text-emerald-400 font-semibold' : 'text-stone-300 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4" />
            {t('nav.credits')}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={handleLanguageToggle}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-stone-700 bg-stone-800/80 hover:bg-stone-700 text-xs font-semibold uppercase tracking-wider transition-all"
            title="Switch Language (VI/EN)"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language.toUpperCase()}</span>
          </button>

          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg border border-stone-700 bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white transition-all"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};
