import React from 'react';
import { useTranslation } from 'react-i18next';
import { Utensils, Sparkles } from 'lucide-react';
import { SpeciesDiet } from '../../types/species';

interface DietCardProps {
  diet: SpeciesDiet | null | undefined;
  speciesName: string;
}

export const DietCard: React.FC<DietCardProps> = ({ diet, speciesName }) => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';

  if (!diet) {
    return (
      <div className="p-6 rounded-3xl bg-white border border-slate-200 text-slate-500 text-sm font-mono shadow-sm">
        {t('diet.noData')}
      </div>
    );
  }

  const getDietBadge = (type: string | null | undefined) => {
    switch (type) {
      case 'carnivore':
        return { label: t('diet.carnivore'), stamp: 'field-stamp-danger' };
      case 'herbivore':
        return { label: t('diet.herbivore'), stamp: 'field-stamp-verified' };
      case 'omnivore':
        return { label: t('diet.omnivore'), stamp: 'field-stamp-warning' };
      case 'insectivore':
        return { label: t('diet.insectivore'), stamp: 'field-stamp-verified' };
      case 'filter_feeder':
        return { label: t('diet.filter_feeder'), stamp: 'field-stamp-warning' };
      case 'detritivore':
        return { label: t('diet.detritivore'), stamp: 'field-stamp-warning' };
      default:
        return { label: t('diet.specialized'), stamp: 'field-stamp-verified' };
    }
  };

  const badge = getDietBadge(diet.type);

  const feedingBehavior = isEn
    ? (diet.feedingBehavior?.en || diet.feedingBehavior?.vi || `Foraging and predatory strategy of ${speciesName}.`)
    : (diet.feedingBehavior?.vi || diet.feedingBehavior?.en || `Tập tính tìm kiếm và hấp thu chất dinh dưỡng của ${speciesName}.`);

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-emerald-200 shadow-md space-y-6 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-700 font-bold mb-1">
            {t('diet.subtitle')}
          </div>
          <h3 className="font-display text-2xl font-extrabold text-slate-900 flex items-center gap-2 uppercase">
            <Utensils className="w-5 h-5 text-emerald-600" />
            {t('diet.title')}
          </h3>
        </div>

        <span className={`field-stamp ${badge.stamp}`}>
          {badge.label}
        </span>
      </div>

      {/* Foraging Description */}
      <div>
        <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-700 mb-2 font-bold flex items-center gap-2">
          <span>//</span>
          <span>{t('diet.foragingBehavior')}</span>
        </h4>
        <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-5 rounded-2xl border border-slate-200 font-sans">
          {feedingBehavior}
        </p>
      </div>

      {/* Primary Diet / Prey Tags */}
      {diet.preyOrFood && diet.preyOrFood.length > 0 && (
        <div>
          <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-700 mb-3 font-bold flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t('diet.foodSources')}</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {diet.preyOrFood.map((food, i) => (
              <span
                key={i}
                className="btn-field-tag !text-xs !py-1.5 !px-3"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                {food}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
