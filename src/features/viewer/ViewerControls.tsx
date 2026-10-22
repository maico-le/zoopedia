import React from 'react';
import {
  RotateCcw,
  Play,
  Pause,
  Camera,
  Maximize2,
  Minimize2,
  Sun,
  Moon,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useViewerStore, CameraPreset } from './useViewerStore';

interface ViewerControlsProps {
  onScreenshot: () => void;
  onToggleFullscreen: () => void;
}

export const ViewerControls: React.FC<ViewerControlsProps> = ({
  onScreenshot,
  onToggleFullscreen,
}) => {
  const {
    cameraPreset,
    setCameraPreset,
    autoRotate,
    toggleAutoRotate,
    availableAnimations,
    currentAnimation,
    setCurrentAnimation,
    isPlayingAnimation,
    togglePlayAnimation,
    animationSpeed,
    setAnimationSpeed,
    backgroundMode,
    setBackgroundMode,
    quality,
    toggleQuality,
    isFullscreen,
    resetViewer,
    showAnatomyWireframe,
    toggleShowWireframe,
  } = useViewerStore();

  const presets: { id: CameraPreset; label: string }[] = [
    { id: 'isometric', label: '3D' },
    { id: 'front', label: 'Trước' },
    { id: 'back', label: 'Sau' },
    { id: 'left', label: 'Trái' },
    { id: 'right', label: 'Phải' },
    { id: 'top', label: 'Trên' },
  ];

  return (
    <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 pointer-events-none flex flex-col justify-end gap-2.5 z-10">
      {/* Top Floating Controls Bar */}
      <div className="flex items-center justify-between pointer-events-auto">
        {/* Camera Preset Pills */}
        <div className="flex items-center gap-1 p-1 bg-stone-900/80 backdrop-blur-md border border-stone-700/60 rounded-xl overflow-x-auto max-w-[calc(100vw-120px)] sm:max-w-none shadow-lg">
          {presets.map((p) => (
            <button
              key={p.id}
              onClick={() => setCameraPreset(p.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                cameraPreset === p.id
                  ? 'bg-emerald-500 text-stone-950 shadow'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/80'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Utility Action Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-900/80 backdrop-blur-md border border-stone-700/60 rounded-xl shadow-lg">
          <button
            onClick={resetViewer}
            className="p-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"
            title="Đặt lại góc nhìn (Reset Camera)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={onScreenshot}
            className="p-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"
            title="Chụp ảnh mô hình (PNG)"
          >
            <Camera className="w-4 h-4" />
          </button>

          <button
            onClick={onToggleFullscreen}
            className="p-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"
            title="Toàn màn hình"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Secondary Bottom Bar: Animation + Quality + Environment */}
      <div className="flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
        {/* Animation playback controls (if model has animations) */}
        {availableAnimations.length > 0 ? (
          <div className="flex items-center gap-1.5 p-1 bg-stone-900/80 backdrop-blur-md border border-stone-700/60 rounded-xl shadow-lg">
            <button
              onClick={togglePlayAnimation}
              className="p-1.5 rounded-lg text-emerald-400 hover:bg-stone-800 transition-colors"
              title={isPlayingAnimation ? 'Tạm dừng' : 'Phát chuyển động'}
            >
              {isPlayingAnimation ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            <select
              value={currentAnimation || availableAnimations[0]}
              onChange={(e) => setCurrentAnimation(e.target.value)}
              className="bg-stone-800 text-stone-200 text-xs font-medium py-1 px-2 rounded-lg border-0 focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              {availableAnimations.map((anim) => (
                <option key={anim} value={anim}>
                  {anim}
                </option>
              ))}
            </select>

            {/* Playback speed toggle */}
            <button
              onClick={() => {
                const nextSpeed = animationSpeed === 1 ? 1.5 : animationSpeed === 1.5 ? 0.5 : 1;
                setAnimationSpeed(nextSpeed);
              }}
              className="px-2 py-1 text-[11px] font-bold text-stone-300 hover:text-white hover:bg-stone-800 rounded-lg transition-colors"
              title="Tốc độ diễn hoạt"
            >
              {animationSpeed}x
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 p-1 bg-stone-900/80 backdrop-blur-md border border-stone-700/60 rounded-xl shadow-lg">
            <button
              onClick={toggleAutoRotate}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                autoRotate
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <RotateCcw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
              <span>{autoRotate ? 'Đang xoay' : 'Tự xoay'}</span>
            </button>

            <button
              onClick={toggleShowWireframe}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                showAnatomyWireframe
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              Lưới (Wireframe)
            </button>
          </div>
        )}

        {/* Quality and visual toggles */}
        <div className="flex items-center gap-1 p-1 bg-stone-900/80 backdrop-blur-md border border-stone-700/60 rounded-xl shadow-lg text-xs">
          <button
            onClick={() =>
              setBackgroundMode(backgroundMode === 'dark' ? 'light' : 'dark')
            }
            className="p-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"
            title="Đổi nền sáng/tối"
          >
            {backgroundMode === 'dark' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={toggleQuality}
            className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition-all ${
              quality === 'high'
                ? 'text-emerald-400 hover:bg-stone-800'
                : 'text-amber-400 bg-amber-500/10 hover:bg-amber-500/20'
            }`}
            title="Chất lượng đồ họa (Bật/tắt bóng & độ phân giải cao)"
          >
            {quality === 'high' ? <Sparkles className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5" />}
            <span className="uppercase text-[11px]">{quality}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
