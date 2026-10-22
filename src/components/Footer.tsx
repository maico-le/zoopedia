import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Radio } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-slate-800 bg-[#060910] py-12 text-slate-400 text-sm relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-display font-extrabold text-white text-lg tracking-wider">Zoopedia</span>
            <span className="text-[10px] font-mono uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/30">
              ARCHIVE 3D
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-md font-sans">
            {t('tagline')}
          </p>
          <div className="flex items-center gap-2 mt-2 text-[10px] font-mono text-slate-500">
            <Radio className="w-2.5 h-2.5 text-amber-400" />
            <span>GBIF FIELD BACKBONE • OPEN HERITAGE DATA</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-6 text-xs font-sans font-semibold tracking-wider">
          <Link to="/credits" className="hover:text-amber-400 transition-colors">
            {t('nav.credits')}
          </Link>
          <Link to="/dev/data-quality" className="hover:text-amber-400 transition-colors">
            {t('nav.dataQuality')}
          </Link>
          <a
            href="https://github.com/maico-le/zoopedia"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-amber-400 transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};
