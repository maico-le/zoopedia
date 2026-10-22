import React, { useState } from 'react';
import speciesIndexData from '../../../data/species-index.json';
import { Activity, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

interface IndexItem {
  id: string;
  nameVi: string;
  nameEn: string;
  scientific: string;
  phylum: string;
  class: string;
  order: string;
  iucn: string;
  tier: string;
  has3D: boolean;
}

export const DataQualityPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [phylumFilter, setPhylumFilter] = useState('ALL');

  const speciesList: IndexItem[] = speciesIndexData as IndexItem[];

  const phyla = ['ALL', ...Array.from(new Set(speciesList.map((s) => s.phylum)))];

  const filtered = speciesList.filter((s) => {
    const matchesSearch =
      s.nameVi.toLowerCase().includes(search.toLowerCase()) ||
      s.scientific.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase());
    const matchesPhylum = phylumFilter === 'ALL' || s.phylum === phylumFilter;
    return matchesSearch && matchesPhylum;
  });

  const total = speciesList.length;
  const tierACount = speciesList.filter((s) => s.tier === 'A').length;
  const tierBCount = speciesList.filter((s) => s.tier === 'B').length;
  const tierCCount = speciesList.filter((s) => s.tier === 'C').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider mb-1">
            <Activity className="w-4 h-4" />
            Bảng điều khiển kiểm soát dữ liệu
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            Chất lượng Dữ liệu & Phân loại học
          </h1>
          <p className="text-sm text-stone-400 mt-1">
            Theo dõi chỉ số độ đầy đủ sinh học (Completeness), phân bổ 8 ngành và kiểm chứng provenance
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-semibold">
            {total} LOÀI ĐÃ XÁC THỰC
          </span>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-2xl bio-glass-panel border border-white/10">
          <div className="text-xs text-stone-400 font-mono uppercase mb-1">Tổng số loài</div>
          <div className="font-serif text-3xl font-bold text-white">{total}</div>
          <div className="text-[11px] text-emerald-400 mt-1">Phủ 8 ngành chính</div>
        </div>

        <div className="p-5 rounded-2xl bio-glass-panel border border-white/10">
          <div className="text-xs text-stone-400 font-mono uppercase mb-1">Mô hình Tier A (Thực)</div>
          <div className="font-serif text-3xl font-bold text-emerald-300">{tierACount}</div>
          <div className="text-[11px] text-stone-400 mt-1">Mẫu vật giải phẫu / Rigged</div>
        </div>

        <div className="p-5 rounded-2xl bio-glass-panel border border-white/10">
          <div className="text-xs text-stone-400 font-mono uppercase mb-1">Mô hình Tier B (Đại diện)</div>
          <div className="font-serif text-3xl font-bold text-teal-300">{tierBCount}</div>
          <div className="text-[11px] text-stone-400 mt-1">Template theo lớp / bộ</div>
        </div>

        <div className="p-5 rounded-2xl bio-glass-panel border border-white/10">
          <div className="text-xs text-stone-400 font-mono uppercase mb-1">Tầng C (Ảnh 2D)</div>
          <div className="font-serif text-3xl font-bold text-amber-300">{tierCCount}</div>
          <div className="text-[11px] text-stone-400 mt-1">Ảnh thực địa Wikimedia Commons</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên loài hoặc danh pháp..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-900 border border-white/10 text-white text-xs placeholder-stone-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
          {phyla.map((p) => (
            <button
              key={p}
              onClick={() => setPhylumFilter(p)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                phylumFilter === p
                  ? 'bg-emerald-500 text-stone-950 font-bold'
                  : 'bg-stone-900 border border-white/10 text-stone-300 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Species Quality Table */}
      <div className="overflow-x-auto bio-glass-panel border border-white/10 rounded-2xl shadow-xl">
        <table className="w-full text-left text-xs text-stone-300">
          <thead className="bg-stone-900/90 text-stone-400 uppercase font-mono border-b border-white/10">
            <tr>
              <th className="p-4">Mẫu vật</th>
              <th className="p-4">Danh pháp khoa học</th>
              <th className="p-4">Ngành / Lớp</th>
              <th className="p-4">Bảo tồn</th>
              <th className="p-4">Mô hình 3D</th>
              <th className="p-4">Độ đầy đủ</th>
              <th className="p-4">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-sans">
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="p-4 font-semibold text-white">
                  <Link to={`/species/${s.id}`} className="hover:text-emerald-300 transition-colors">
                    {s.nameVi}
                  </Link>
                  <div className="text-[10px] text-stone-400 font-normal">{s.nameEn}</div>
                </td>
                <td className="p-4 font-serif italic text-stone-300 text-sm">
                  {s.scientific}
                </td>
                <td className="p-4 font-mono text-[11px]">
                  <span className="text-emerald-400">{s.phylum}</span>
                  <div className="text-stone-400">{s.class}</div>
                </td>
                <td className="p-4">
                  <span className="px-2 py-0.5 rounded font-mono font-bold bg-white/5 text-stone-300 border border-white/10">
                    {s.iucn}
                  </span>
                </td>
                <td className="p-4">
                  <span
                    className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                      s.tier === 'A'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : s.tier === 'B'
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                        : 'bg-stone-800 text-stone-400'
                    }`}
                  >
                    Tier {s.tier} {s.has3D ? '(Có 3D)' : '(2D)'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2 font-mono">
                    <div className="w-16 bg-stone-800 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: s.id === 'panthera-tigris' ? '100%' : '90%' }} />
                    </div>
                    <span className="text-[11px] text-stone-300 font-bold">{s.id === 'panthera-tigris' ? '100%' : '90%'}</span>
                  </div>
                </td>
                <td className="p-4">
                  <Link
                    to={`/species/${s.id}`}
                    className="text-emerald-400 hover:text-emerald-300 font-medium hover:underline"
                  >
                    Xem hồ sơ &rarr;
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
