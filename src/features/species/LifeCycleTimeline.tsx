import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, CircleDot, ChevronRight, Sparkles } from 'lucide-react';
import { SpeciesLifeCycle } from '../../types/species';

interface LifeCycleTimelineProps {
  lifeCycle: SpeciesLifeCycle | null | undefined;
  speciesName: string;
}

export const LifeCycleTimeline: React.FC<LifeCycleTimelineProps> = ({
  lifeCycle,
  speciesName,
}) => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const [selectedStageIdx, setSelectedStageIdx] = useState<number>(0);

  if (!lifeCycle || !lifeCycle.stages || lifeCycle.stages.length === 0) {
    return (
      <div className="p-6 rounded-3xl bio-glass-panel border border-white/10 text-stone-400 text-sm">
        {t('lifecycle.noData')}
      </div>
    );
  }

  const stages = lifeCycle.stages;
  const activeStage = stages[selectedStageIdx] || stages[0];

  const formatDays = (days?: number[] | null) => {
    if (!days || days.length < 2) return t('lifecycle.variable');
    const min = days[0];
    const max = days[1];
    if (max <= 60) return `${min} – ${max} ${t('lifecycle.days')}`;
    if (max <= 730) return `${(min / 30).toFixed(0)} – ${(max / 30).toFixed(0)} ${t('lifecycle.months')}`;
    return `${(min / 365).toFixed(1)} – ${(max / 365).toFixed(1)} ${t('lifecycle.years')}`;
  };

  const getStageName = (stg: typeof activeStage) => (isEn ? (stg.name.en || stg.name.vi) : (stg.name.vi || stg.name.en));
  const getStageSecondary = (stg: typeof activeStage) => (isEn ? stg.name.vi : stg.name.en);
  const getStageDesc = (stg: typeof activeStage) => (isEn ? (stg.description?.en || stg.description?.vi || 'Ontogenetic description pending.') : (stg.description?.vi || stg.description?.en || 'Mô tả sinh lý học đang cập nhật.'));

  return (
    <div className="p-6 sm:p-8 rounded-3xl bio-glass-panel border border-white/10 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4 mb-8">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold mb-1">
            {t('lifecycle.subtitle')}
          </div>
          <h3 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-400" />
            {t('lifecycle.title')}
          </h3>
          <p className="text-xs text-stone-400 mt-1">
            {t('lifecycle.desc', { name: speciesName })}
          </p>
        </div>

        {lifeCycle.lifespanYears && (
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl text-xs font-mono">
            <div>
              <span className="text-stone-400 block text-[10px]">{t('lifecycle.wild')}</span>
              <span className="font-bold text-emerald-300">
                {lifeCycle.lifespanYears.wild
                  ? `${lifeCycle.lifespanYears.wild[0]}–${lifeCycle.lifespanYears.wild[1]} ${t('lifecycle.years')}`
                  : 'N/A'}
              </span>
            </div>
            <div className="w-px h-6 bg-white/10" />
            <div>
              <span className="text-stone-400 block text-[10px]">{t('lifecycle.captivity')}</span>
              <span className="font-bold text-amber-300">
                {lifeCycle.lifespanYears.captivity
                  ? `${lifeCycle.lifespanYears.captivity[0]}–${lifeCycle.lifespanYears.captivity[1]} ${t('lifecycle.years')}`
                  : 'N/A'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Horizontal Stage Stepper */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {stages.map((stage, idx) => {
          const isSelected = selectedStageIdx === idx;
          return (
            <button
              key={stage.key}
              onClick={() => setSelectedStageIdx(idx)}
              className={`p-4 rounded-2xl text-left transition-all border ${
                isSelected
                  ? 'bg-emerald-500/15 border-emerald-500/50 shadow-glow'
                  : 'bio-glass hover:border-white/20 hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-2">
                <span
                  className={`font-mono font-bold text-[10px] uppercase px-2 py-0.5 rounded ${
                    isSelected
                      ? 'bg-emerald-400 text-stone-950'
                      : 'bg-white/5 text-stone-400'
                  }`}
                >
                  {t('lifecycle.station')} {idx + 1}
                </span>
                <CircleDot
                  className={`w-3.5 h-3.5 ${
                    isSelected ? 'text-emerald-400' : 'text-stone-600'
                  }`}
                />
              </div>

              <div
                className={`font-serif text-sm font-bold truncate ${
                  isSelected ? 'text-white' : 'text-stone-300'
                }`}
              >
                {getStageName(stage)}
              </div>
              <div className="text-[11px] font-mono text-stone-400 truncate mt-1">
                {formatDays(stage.durationDays)}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Stage Detailed Presentation Card */}
      <div className="p-6 rounded-2xl bg-stone-900/80 border border-emerald-500/30 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-bold text-sm">
              {selectedStageIdx + 1}
            </span>
            <div>
              <h4 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                {getStageName(activeStage)}
                <span className="text-xs font-sans font-normal text-stone-400">
                  ({getStageSecondary(activeStage)})
                </span>
              </h4>
              <span className="text-xs font-mono text-emerald-400">
                {t('lifecycle.identifier')} {activeStage.key}
              </span>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-stone-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{t('lifecycle.duration')} {formatDays(activeStage.durationDays)}</span>
          </div>
        </div>

        <p className="text-sm text-stone-300 leading-relaxed">
          {getStageDesc(activeStage)}
        </p>

        {selectedStageIdx < stages.length - 1 && (
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-end text-xs text-stone-400">
            <button
              onClick={() => setSelectedStageIdx(selectedStageIdx + 1)}
              className="hover:text-emerald-300 flex items-center gap-1 transition-colors"
            >
              <span>{t('lifecycle.nextStage')} {getStageName(stages[selectedStageIdx + 1])}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
