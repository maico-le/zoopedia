import React from 'react';
import { useTranslation } from 'react-i18next';
import { User, Ruler } from 'lucide-react';

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
      <div className="p-5 rounded-2xl bio-glass border border-white/10 text-xs text-stone-400">
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
    <div className="p-6 rounded-3xl bio-glass-panel border border-white/10 shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold mb-1">
            {t('morphometrics.subtitle')}
          </div>
          <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
            <Ruler className="w-5 h-5 text-emerald-400" />
            {t('morphometrics.title')}
          </h3>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-white/5 border border-white/10 text-stone-300">
          {ratio >= 1
            ? t('morphometrics.largerThanHuman', { val: ratio.toFixed(1) })
            : t('morphometrics.percentOfHuman', { val: (ratio * 100).toFixed(0) })}
        </span>
      </div>

      {/* Silhouette & Scale Comparison Stage */}
      <div className="space-y-6">
        {/* Animal Bar */}
        <div>
          <div className="flex justify-between items-center text-xs mb-2">
            <span className="font-serif font-bold text-emerald-300 flex items-center gap-2">
              🐾 {speciesName}
            </span>
            <span className="font-mono text-stone-300">
              {minLen} – {maxLen} cm {maxWeight ? `• ${minWeight} – ${maxWeight} kg` : ''}
            </span>
          </div>
          <div className="h-8 bg-stone-900/80 rounded-xl overflow-hidden border border-white/10 p-1 flex items-center">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-lg shadow-sm transition-all duration-700 flex items-center justify-end pr-2 text-[10px] font-mono font-bold text-stone-950"
              style={{ width: `${animalBarPct}%` }}
            >
              {avgLen >= 100 ? `${(avgLen / 100).toFixed(1)}m` : `${avgLen.toFixed(0)}cm`}
            </div>
          </div>
        </div>

        {/* Human Reference Bar */}
        <div>
          <div className="flex justify-between items-center text-xs mb-2">
            <span className="text-stone-400 flex items-center gap-1.5 font-medium">
              <User className="w-4 h-4 text-stone-400" />
              {t('morphometrics.humanRef')}
            </span>
            <span className="font-mono text-stone-400">
              {humanHeightCm} cm • ~{humanWeightKg} kg
            </span>
          </div>
          <div className="h-8 bg-stone-900/80 rounded-xl overflow-hidden border border-white/10 p-1 flex items-center">
            <div
              className="h-full bg-stone-700/80 rounded-lg transition-all duration-700 flex items-center justify-end pr-2 text-[10px] font-mono font-bold text-stone-200"
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
