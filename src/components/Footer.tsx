import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Radio } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-emerald-100 bg-white py-12 text-slate-500 text-sm relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-display font-extrabold text-slate-900 text-lg tracking-wider">Zoopedia</span>
            <span className="text-[10px] font-mono uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              ARCHIVE 3D
            </span>
          </div>
          <p className="text-xs text-slate-500 max-w-md font-sans leading-relaxed">
            {t('tagline')}
          </p>
          <div className="flex items-center gap-2 mt-2 text-[10px] font-mono text-emerald-700 font-semibold">
            <Radio className="w-2.5 h-2.5 text-emerald-600 animate-pulse" />
            <span>GBIF FIELD BACKBONE • OPEN HERITAGE DATA</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-6 text-xs font-sans font-semibold tracking-wider">
          <Link to="/credits" className="text-slate-600 hover:text-emerald-700 transition-colors">
            {t('nav.credits')}
          </Link>
          <Link to="/dev/data-quality" className="text-slate-600 hover:text-emerald-700 transition-colors">
            {t('nav.dataQuality')}
          </Link>
          <a
            href="https://github.com/maico-le/zoopedia"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-600 hover:text-emerald-700 transition-colors font-bold"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};
