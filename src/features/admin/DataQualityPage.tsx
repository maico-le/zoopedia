import React from 'react';
import tigerData from '../../../data/species/panthera-tigris.json';
import { Species } from '../../types/species';
import { Activity, CheckCircle2 } from 'lucide-react';

export const DataQualityPage: React.FC = () => {
  const speciesList: Species[] = [(tigerData as unknown) as Species];

  const calculateCompleteness = (s: Species) => {
    let score = 0;
    if (s.names.scientific && s.names.vi.length > 0 && s.names.en.length > 0) score += 15;
    if (s.taxonomy.phylum && s.taxonomy.class && s.taxonomy.order && s.taxonomy.family) score += 10;
    if (s.morphology?.description?.vi || s.morphology?.lengthCm) score += 10;
    if (s.habitat?.biomes?.length || s.habitat?.description?.vi) score += 10;
    if (s.distribution?.countries?.length || s.distribution?.text?.vi) score += 5;
    if (s.diet?.type) score += 10;
    if (s.behavior?.activityPattern || s.behavior?.text?.vi) score += 10;
    if (s.lifeCycle?.stages?.length || s.lifeCycle?.lifespanYears) score += 10;
    if (s.reproduction?.mode || s.reproduction?.text?.vi) score += 10;
    if (s.conservation?.iucn) score += 5;
    if (s.media?.model3d?.glb || s.media?.images?.length) score += 5;
    return Math.min(100, score);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
            <Activity className="w-4 h-4" />
            Admin / Nội bộ
          </div>
          <h1 className="text-3xl font-black text-white">Chất lượng & Độ đầy đủ dữ liệu (Data Quality)</h1>
          <p className="text-sm text-stone-400">Theo dõi chỉ số Completeness (0-100%) và trạng thái kiểm chứng</p>
        </div>
      </div>

      <div className="overflow-x-auto bg-stone-900 border border-stone-800 rounded-2xl shadow-xl">
        <table className="w-full text-left text-sm text-stone-300">
          <thead className="bg-stone-800/80 text-xs uppercase text-stone-400 border-b border-stone-800">
            <tr>
              <th className="p-4">Slug ID</th>
              <th className="p-4">Tên tiếng Việt</th>
              <th className="p-4">Tên khoa học</th>
              <th className="p-4">Độ đầy đủ</th>
              <th className="p-4">Tầng 3D</th>
              <th className="p-4">Provenance</th>
              <th className="p-4">Cần duyệt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-800">
            {speciesList.map((s) => {
              const completeness = calculateCompleteness(s);
              const needsReviewCount = s.provenance.filter((p) => p.needsReview).length;
              return (
                <tr key={s.id} className="hover:bg-stone-800/40">
                  <td className="p-4 font-mono text-xs text-emerald-400">{s.id}</td>
                  <td className="p-4 font-semibold text-white">{s.names.vi[0]}</td>
                  <td className="p-4 italic text-stone-400">{s.names.scientific}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-stone-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-2 rounded-full transition-all"
                          style={{ width: `${completeness}%` }}
                        />
                      </div>
                      <span className="font-bold text-xs text-white">{completeness}%</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      Tier {s.media.model3d?.tier || 'C'}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-stone-400">{s.provenance.length} mục</td>
                  <td className="p-4">
                    {needsReviewCount === 0 ? (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Đã xác thực
                      </span>
                    ) : (
                      <span className="text-xs text-amber-400">{needsReviewCount} mục</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
