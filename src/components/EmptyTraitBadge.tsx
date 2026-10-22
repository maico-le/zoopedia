import React from 'react';
import { HelpCircle, ExternalLink } from 'lucide-react';

interface EmptyTraitBadgeProps {
  label: string;
  sourceUrl?: string | null;
}

export const EmptyTraitBadge: React.FC<EmptyTraitBadgeProps> = ({
  label,
  sourceUrl,
}) => {
  return (
    <div className="p-5 rounded-2xl bio-glass border border-dashed border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-400">
      <div className="flex items-center gap-2">
        <HelpCircle className="w-4 h-4 text-amber-400/80 shrink-0" />
        <span>
          <strong className="text-stone-300 font-semibold">{label}:</strong> Chưa có dữ liệu kiểm chứng chính thức trong các cơ sở dữ liệu bảo tàng.
        </span>
      </div>

      {sourceUrl && (
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-mono underline hover:no-underline shrink-0"
        >
          <span>Đối chiếu GBIF / EOL</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      )}
    </div>
  );
};
