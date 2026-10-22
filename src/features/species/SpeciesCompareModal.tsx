import React, { useState } from 'react';
import { X, ArrowRightLeft } from 'lucide-react';
import { Species } from '../../types/species';
import speciesIndexData from '../../../data/species-index.json';
import { loadSpeciesBySlug } from '../../lib/data-loader';

interface SpeciesCompareModalProps {
  currentSpecies: Species;
  onClose: () => void;
}

export const SpeciesCompareModal: React.FC<SpeciesCompareModalProps> = ({
  currentSpecies,
  onClose,
}) => {
  const speciesList = speciesIndexData as Array<{ id: string; nameVi: string; scientific: string }>;
  const [selectedTargetSlug, setSelectedTargetSlug] = useState<string>('canis-lupus');
  const [targetSpecies, setTargetSpecies] = useState<Species | null>(null);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    setLoading(true);
    loadSpeciesBySlug(selectedTargetSlug).then((data) => {
      setTargetSpecies(data);
      setLoading(false);
    });
  }, [selectedTargetSlug]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bio-glass-panel rounded-3xl border border-white/15 p-6 sm:p-8 shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-white">So sánh Mẫu vật Sinh học</h2>
              <p className="text-xs text-stone-400 font-mono">Đối chiếu thuộc tính, phân loại học và bảo tồn</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Species Selection Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          {/* Specimen 1 (Current) */}
          <div className="p-4 rounded-2xl bio-glass border border-emerald-500/30">
            <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold mb-1">
              Mẫu vật 1 (Hiện tại)
            </div>
            <div className="font-serif text-xl font-bold text-white">{currentSpecies.names.vi[0]}</div>
            <div className="text-xs font-serif italic text-stone-300">{currentSpecies.names.scientific}</div>
          </div>

          {/* Specimen 2 (Picker) */}
          <div className="p-4 rounded-2xl bio-glass border border-white/15">
            <div className="text-[10px] font-mono uppercase tracking-wider text-teal-400 font-bold mb-1">
              Mẫu vật 2 (Chọn để đối chiếu)
            </div>
            <select
              value={selectedTargetSlug}
              onChange={(e) => setSelectedTargetSlug(e.target.value)}
              className="w-full mt-1 bg-stone-900 border border-white/15 rounded-xl px-3 py-2 text-xs font-sans text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              {speciesList
                .filter((s) => s.id !== currentSpecies.id)
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nameVi} ({s.scientific})
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Comparison Attribute Table */}
        {loading || !targetSpecies ? (
          <div className="py-16 text-center text-stone-400 text-xs font-mono">Đang nạp dữ liệu so sánh...</div>
        ) : (
          <div className="overflow-x-auto border border-white/10 rounded-2xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-900 text-stone-400 uppercase font-mono border-b border-white/10">
                <tr>
                  <th className="p-3.5 w-1/3">Thuộc tính</th>
                  <th className="p-3.5 w-1/3 text-emerald-300 font-serif font-bold text-sm">
                    {currentSpecies.names.vi[0]}
                  </th>
                  <th className="p-3.5 w-1/3 text-teal-300 font-serif font-bold text-sm">
                    {targetSpecies.names.vi[0]}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-sans">
                {/* Taxonomy */}
                <tr>
                  <td className="p-3.5 font-mono text-stone-400 font-semibold">Ngành (Phylum)</td>
                  <td className="p-3.5 text-stone-200">{currentSpecies.taxonomy.phylum}</td>
                  <td className="p-3.5 text-stone-200">{targetSpecies.taxonomy.phylum}</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-mono text-stone-400 font-semibold">Lớp (Class)</td>
                  <td className="p-3.5 text-stone-200">{currentSpecies.taxonomy.class}</td>
                  <td className="p-3.5 text-stone-200">{targetSpecies.taxonomy.class}</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-mono text-stone-400 font-semibold">Bộ (Order)</td>
                  <td className="p-3.5 text-stone-200">{currentSpecies.taxonomy.order}</td>
                  <td className="p-3.5 text-stone-200">{targetSpecies.taxonomy.order}</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-mono text-stone-400 font-semibold">Họ (Family)</td>
                  <td className="p-3.5 text-stone-200">{currentSpecies.taxonomy.family}</td>
                  <td className="p-3.5 text-stone-200">{targetSpecies.taxonomy.family}</td>
                </tr>
                {/* Conservation IUCN */}
                <tr>
                  <td className="p-3.5 font-mono text-stone-400 font-semibold">Tình trạng IUCN</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded font-mono font-bold bg-white/5 text-stone-200 border border-white/10">
                      {currentSpecies.conservation?.iucn || 'NE'}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded font-mono font-bold bg-white/5 text-stone-200 border border-white/10">
                      {targetSpecies.conservation?.iucn || 'NE'}
                    </span>
                  </td>
                </tr>
                {/* Diet */}
                <tr>
                  <td className="p-3.5 font-mono text-stone-400 font-semibold">Chế độ dinh dưỡng</td>
                  <td className="p-3.5 capitalize text-emerald-400 font-medium">
                    {currentSpecies.diet?.type || 'Chưa rõ'}
                  </td>
                  <td className="p-3.5 capitalize text-teal-400 font-medium">
                    {targetSpecies.diet?.type || 'Chưa rõ'}
                  </td>
                </tr>
                {/* Activity pattern */}
                <tr>
                  <td className="p-3.5 font-mono text-stone-400 font-semibold">Tập tính hoạt động</td>
                  <td className="p-3.5 capitalize text-stone-300">
                    {currentSpecies.behavior?.activityPattern || 'Chưa rõ'}
                  </td>
                  <td className="p-3.5 capitalize text-stone-300">
                    {targetSpecies.behavior?.activityPattern || 'Chưa rõ'}
                  </td>
                </tr>
                {/* Reproduction */}
                <tr>
                  <td className="p-3.5 font-mono text-stone-400 font-semibold">Hình thức sinh sản</td>
                  <td className="p-3.5 capitalize text-stone-300">
                    {currentSpecies.reproduction?.mode || 'Chưa rõ'}
                  </td>
                  <td className="p-3.5 capitalize text-stone-300">
                    {targetSpecies.reproduction?.mode || 'Chưa rõ'}
                  </td>
                </tr>
                {/* 3D Model Tier */}
                <tr>
                  <td className="p-3.5 font-mono text-stone-400 font-semibold">Cấp độ mô hình 3D</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Tier {currentSpecies.media.model3d?.tier || 'C'}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                      Tier {targetSpecies.media.model3d?.tier || 'C'}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
