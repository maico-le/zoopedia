import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Radio } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="border-t-2 border-natgeo-yellow/20 bg-expedition-dark py-12 text-stone-400 text-sm relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-display font-extrabold text-white text-lg tracking-wider uppercase">Zoopedia</span>
            <span className="text-[10px] font-mono uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-natgeo-yellow/15 text-natgeo-yellow border border-natgeo-yellow/30">
              EXPEDITION ARCHIVE
            </span>
          </div>
          <p className="text-xs text-stone-400 max-w-md font-sans">
            {t('tagline')}
          </p>
          <div className="flex items-center gap-2 mt-2 text-[10px] font-mono text-stone-500">
            <Radio className="w-2.5 h-2.5 text-natgeo-yellow" />
            <span>GBIF FIELD BACKBONE • OPEN HERITAGE DATA</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-6 text-xs font-mono font-bold uppercase tracking-wider">
          <Link to="/credits" className="hover:text-natgeo-yellow transition-colors">
            {t('nav.credits')}
          </Link>
          <Link to="/dev/data-quality" className="hover:text-natgeo-yellow transition-colors">
            {t('nav.dataQuality')}
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-natgeo-yellow transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};
