import React from 'react';
import { AlertCircle } from 'lucide-react';
import { SpeciesImage } from '../../types/species';

interface ViewerFallbackProps {
  reason: 'no-webgl' | 'load-error' | 'no-model';
  images?: SpeciesImage[];
  speciesName?: string;
  onRetry?: () => void;
}

export const ViewerFallback: React.FC<ViewerFallbackProps> = ({
  reason,
  images,
  speciesName,
  onRetry,
}) => {
  return (
    <div className="w-full h-full min-h-[420px] bg-stone-950 flex flex-col items-center justify-center p-6 text-center text-stone-200">
      {images && images.length > 0 ? (
        <div className="w-full max-w-lg mb-4">
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-stone-800 shadow-xl bg-stone-900">
            <img
              src={images[0].url}
              alt={speciesName || 'Animal'}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute bottom-0 inset-x-0 bg-stone-950/80 backdrop-blur-sm p-2 text-xs text-stone-300">
              {images[0].caption?.vi || images[0].caption?.en || speciesName}
            </div>
          </div>
        </div>
      ) : (
        <div className="w-20 h-20 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-center text-4xl mb-4">
          🦁
        </div>
      )}

      <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-1">
        <AlertCircle className="w-4 h-4" />
        {reason === 'no-webgl' && 'Trình duyệt không hỗ trợ WebGL'}
        {reason === 'load-error' && 'Không thể nạp mô hình 3D'}
        {reason === 'no-model' && 'Loài chưa có mô hình 3D (Chế độ xem 2D)'}
      </div>

      <p className="text-xs text-stone-400 max-w-sm mb-4 leading-relaxed">
        {reason === 'no-webgl' &&
          'Thiết bị hoặc trình duyệt của bạn đang tắt khả năng tăng tốc phần cứng WebGL. Bạn vẫn có thể xem toàn bộ thông tin sinh học và ảnh chụp của loài.'}
        {reason === 'load-error' &&
          'Đã có sự cố kết nối mạng khi tải tệp GLB. Vui lòng kiểm tra lại kết nối mạng hoặc thử lại.'}
        {reason === 'no-model' &&
          'Loài này thuộc phân loại Tầng C, hiển thị ảnh chụp thực tế và thông tin chi tiết.'}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-xs font-semibold text-white transition-all shadow"
        >
          Thử nạp lại 3D
        </button>
      )}
    </div>
  );
};
