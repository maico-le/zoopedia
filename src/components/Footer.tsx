import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-stone-800 bg-stone-950 py-10 text-stone-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <div className="font-bold text-stone-200">Zoopedia</div>
          <p className="text-xs text-stone-500 mt-1 max-w-md">
            {t('tagline')}
          </p>
        </div>

        <div className="flex flex-wrap gap-6 text-xs font-medium">
          <Link to="/credits" className="hover:text-emerald-400 transition-colors">
            {t('nav.credits')}
          </Link>
          <Link to="/dev/data-quality" className="hover:text-emerald-400 transition-colors">
            {t('nav.dataQuality')}
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-emerald-400 transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};
