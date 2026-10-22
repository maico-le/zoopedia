import React from 'react';
import { useTranslation } from 'react-i18next';
import { HelpCircle, ExternalLink } from 'lucide-react';

interface EmptyTraitBadgeProps {
  label: string;
  sourceUrl?: string | null;
}

export const EmptyTraitBadge: React.FC<EmptyTraitBadgeProps> = ({
  label,
  sourceUrl,
}) => {
  const { t } = useTranslation();

  return (
    <div className="p-5 rounded-2xl field-panel border-2 border-dashed border-natgeo-yellow/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-300">
      <div className="flex items-center gap-2.5">
        <HelpCircle className="w-4 h-4 text-natgeo-yellow shrink-0" />
        <span className="font-sans">
          <strong className="text-natgeo-yellow font-bold uppercase font-mono">{label}:</strong> {t('emptyTrait.unverified')}
        </span>
      </div>

      {sourceUrl && (
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-natgeo-yellow hover:underline font-mono font-bold shrink-0"
        >
          <span>{t('emptyTrait.crossRef')}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      )}
    </div>
  );
};
