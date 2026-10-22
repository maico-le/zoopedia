import React from 'react';
import { Utensils, Sparkles } from 'lucide-react';
import { SpeciesDiet } from '../../types/species';

interface DietCardProps {
  diet: SpeciesDiet | null | undefined;
  speciesName: string;
}

export const DietCard: React.FC<DietCardProps> = ({ diet, speciesName }) => {
  if (!diet) {
    return (
      <div className="p-6 rounded-3xl bio-glass-panel border border-white/10 text-stone-400 text-sm">
        Chưa có dữ liệu dinh dưỡng kiểm chứng cho loài này.
      </div>
    );
  }

  const getDietBadge = (type: string | null | undefined) => {
    switch (type) {
      case 'carnivore':
        return { label: 'Động vật ăn thịt (Carnivore)', bg: 'bg-rose-500/15 text-rose-300 border-rose-500/30' };
      case 'herbivore':
        return { label: 'Động vật ăn thực vật (Herbivore)', bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' };
      case 'omnivore':
        return { label: 'Động vật ăn tạp (Omnivore)', bg: 'bg-amber-500/15 text-amber-300 border-amber-500/30' };
      case 'insectivore':
        return { label: 'Động vật ăn côn trùng (Insectivore)', bg: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30' };
      case 'filter_feeder':
        return { label: 'Lọc dinh dưỡng thủy sinh (Filter Feeder)', bg: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' };
      case 'detritivore':
        return { label: 'Ăn mùn bã hữu cơ (Detritivore)', bg: 'bg-stone-500/15 text-stone-300 border-stone-500/30' };
      default:
        return { label: 'Dinh dưỡng chuyên biệt', bg: 'bg-white/10 text-stone-300 border-white/10' };
    }
  };

  const badge = getDietBadge(diet.type);

  return (
    <div className="p-6 sm:p-8 rounded-3xl bio-glass-panel border border-white/10 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold mb-1">
            Sinh thái học dinh dưỡng (Trophic Ecology)
          </div>
          <h3 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
            <Utensils className="w-5 h-5 text-emerald-400" />
            Chiến thuật Dinh dưỡng & Thức ăn
          </h3>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${badge.bg}`}>
          {badge.label}
        </span>
      </div>

      {/* Foraging Description */}
      <div>
        <h4 className="text-xs font-mono uppercase tracking-wider text-stone-400 mb-2 font-semibold">
          Hành vi săn kiếm mồi
        </h4>
        <p className="text-sm text-stone-200 leading-relaxed bg-stone-900/50 p-4 rounded-2xl border border-white/5">
          {diet.feedingBehavior?.vi || diet.feedingBehavior?.en || `Tập tính tìm kiếm và hấp thu chất dinh dưỡng của ${speciesName}.`}
        </p>
      </div>

      {/* Primary Diet / Prey Tags */}
      {diet.preyOrFood && diet.preyOrFood.length > 0 && (
        <div>
          <h4 className="text-xs font-mono uppercase tracking-wider text-stone-400 mb-2 font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Nguồn thức ăn / Con mồi ghi nhận:
          </h4>
          <div className="flex flex-wrap gap-2">
            {diet.preyOrFood.map((food, i) => (
              <span
                key={i}
                className="px-3.5 py-1.5 rounded-xl bio-glass border border-white/10 text-xs font-medium text-stone-200 hover:border-emerald-500/40 hover:text-emerald-300 transition-all flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {food}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
