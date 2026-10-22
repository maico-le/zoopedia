import React from 'react';
import { useTranslation } from 'react-i18next';
import { User, Ruler, Compass } from 'lucide-react';

interface SizeComparisonProps {
  lengthCm?: number[] | null;
  weightKg?: number[] | null;
  speciesName: string;
}

export const SizeComparison: React.FC<SizeComparisonProps> = ({
  lengthCm,
  weightKg,
  speciesName,
}) => {
  const { t } = useTranslation();

  if (!lengthCm || lengthCm.length < 2) {
    return (
      <div className="p-6 rounded-2xl field-panel border border-white/10 text-xs text-stone-400 font-mono">
        {t('morphometrics.noData')}
      </div>
    );
  }

  const humanHeightCm = 175;
  const humanWeightKg = 70;

  const minLen = lengthCm[0];
  const maxLen = lengthCm[1];
  const avgLen = (minLen + maxLen) / 2;

  const minWeight = weightKg ? weightKg[0] : null;
  const maxWeight = weightKg ? weightKg[1] : null;

  // Proportional scale factor relative to 175cm
  const ratio = avgLen / humanHeightCm;
  const isLarger = ratio >= 1;

  // Visual bar width bounded between 15% and 100%
  const humanBarPct = isLarger ? Math.max(15, (humanHeightCm / avgLen) * 100) : 100;
  const animalBarPct = isLarger ? 100 : Math.max(12, ratio * 100);

  return (
    <div className="p-6 sm:p-8 rounded-3xl field-panel border-2 border-natgeo-yellow/25 shadow-2xl relative overflow-hidden field-ruler-bottom">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-white/10 mb-6 gap-3">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-natgeo-yellow font-bold mb-1 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-natgeo-yellow" />
            {t('morphometrics.subtitle')}
          </div>
          <h3 className="font-display text-2xl font-extrabold text-white flex items-center gap-2 uppercase">
            <Ruler className="w-5 h-5 text-natgeo-yellow" />
            {t('morphometrics.title')}
          </h3>
        </div>

        <span className="field-stamp field-stamp-verified">
          {ratio >= 1
            ? t('morphometrics.largerThanHuman', { val: ratio.toFixed(1) })
            : t('morphometrics.percentOfHuman', { val: (ratio * 100).toFixed(0) })}
        </span>
      </div>

      {/* Silhouette & Metric Scale Comparison Stage */}
      <div className="space-y-6">
        {/* Animal Metric Bar */}
        <div>
          <div className="flex justify-between items-center text-xs mb-2">
            <span className="font-serif font-bold text-natgeo-yellow flex items-center gap-2 text-sm">
              🐾 {speciesName}
            </span>
            <span className="font-mono font-bold text-stone-200">
              {minLen} – {maxLen} cm {maxWeight ? `• ${minWeight} – ${maxWeight} kg` : ''}
            </span>
          </div>
          <div className="h-9 bg-black/80 rounded-xl overflow-hidden border border-natgeo-yellow/30 p-1 flex items-center">
            <div
              className="h-full bg-gradient-to-r from-natgeo-yellow to-amber-500 rounded-lg shadow-glow transition-all duration-700 flex items-center justify-end pr-3 text-[11px] font-mono font-extrabold text-stone-950"
              style={{ width: `${animalBarPct}%` }}
            >
              {avgLen >= 100 ? `${(avgLen / 100).toFixed(1)}m` : `${avgLen.toFixed(0)}cm`}
            </div>
          </div>
        </div>

        {/* Standard Human Reference Bar */}
        <div>
          <div className="flex justify-between items-center text-xs mb-2">
            <span className="text-stone-400 flex items-center gap-1.5 font-medium font-sans">
              <User className="w-4 h-4 text-stone-400" />
              {t('morphometrics.humanRef')}
            </span>
            <span className="font-mono text-stone-400">
              {humanHeightCm} cm • ~{humanWeightKg} kg
            </span>
          </div>
          <div className="h-9 bg-black/80 rounded-xl overflow-hidden border border-white/10 p-1 flex items-center">
            <div
              className="h-full bg-stone-700/90 rounded-lg transition-all duration-700 flex items-center justify-end pr-3 text-[11px] font-mono font-bold text-stone-200"
              style={{ width: `${humanBarPct}%` }}
            >
              1.75m
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
