import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, CircleDot, ChevronRight, Sparkles, Compass } from 'lucide-react';
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
      <div className="p-6 rounded-3xl bg-white border border-slate-200 text-slate-500 text-sm font-mono shadow-sm">
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
    <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-emerald-200 shadow-md relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4 mb-8">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-700 font-bold mb-1 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-emerald-600" />
            {t('lifecycle.subtitle')}
          </div>
          <h3 className="font-display text-2xl font-extrabold text-slate-900 flex items-center gap-2 uppercase">
            <Clock className="w-5 h-5 text-emerald-600" />
            {t('lifecycle.title')}
          </h3>
          <p className="text-xs text-slate-600 mt-1 font-sans">
            {t('lifecycle.desc', { name: speciesName })}
          </p>
        </div>

        {lifeCycle.lifespanYears && (
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-2xl text-xs font-mono">
            <div>
              <span className="text-slate-500 block text-[10px] font-bold">{t('lifecycle.wild')}</span>
              <span className="font-bold text-emerald-700">
                {lifeCycle.lifespanYears.wild
                  ? `${lifeCycle.lifespanYears.wild[0]}–${lifeCycle.lifespanYears.wild[1]} ${t('lifecycle.years')}`
                  : 'N/A'}
              </span>
            </div>
            <div className="w-px h-6 bg-slate-200" />
            <div>
              <span className="text-slate-500 block text-[10px] font-bold">{t('lifecycle.captivity')}</span>
              <span className="font-bold text-teal-700">
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
                  ? 'bg-emerald-50 border-emerald-500 shadow-md'
                  : 'bg-white hover:border-emerald-300 border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-2">
                <span
                  className={`font-mono font-bold text-[10px] uppercase px-2 py-0.5 rounded ${
                    isSelected
                      ? 'bg-emerald-600 text-white font-extrabold'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {t('lifecycle.station')} {idx + 1}
                </span>
                <CircleDot
                  className={`w-3.5 h-3.5 ${
                    isSelected ? 'text-emerald-600' : 'text-slate-300'
                  }`}
                />
              </div>

              <div
                className={`font-serif text-sm font-bold truncate ${
                  isSelected ? 'text-emerald-800' : 'text-slate-800'
                }`}
              >
                {getStageName(stage)}
              </div>
              <div className="text-[11px] font-mono text-slate-500 truncate mt-1">
                {formatDays(stage.durationDays)}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Stage Detailed Presentation Card */}
      <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 relative overflow-hidden field-ruler-bottom">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 mb-4">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-mono font-extrabold text-sm shadow-sm">
              {selectedStageIdx + 1}
            </span>
            <div>
              <h4 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
                {getStageName(activeStage)}
                <span className="text-xs font-sans font-normal text-slate-500">
                  ({getStageSecondary(activeStage)})
                </span>
              </h4>
              <span className="text-xs font-mono text-emerald-700 font-semibold">
                {t('lifecycle.identifier')} {activeStage.key}
              </span>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-mono text-slate-600 shadow-sm font-medium">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t('lifecycle.duration')} {formatDays(activeStage.durationDays)}</span>
          </div>
        </div>

        <p className="text-sm text-slate-700 leading-relaxed font-sans">
          {getStageDesc(activeStage)}
        </p>

        {selectedStageIdx < stages.length - 1 && (
          <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-end text-xs font-mono font-bold text-emerald-700">
            <button
              onClick={() => setSelectedStageIdx(selectedStageIdx + 1)}
              className="hover:underline flex items-center gap-1.5 transition-colors"
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
