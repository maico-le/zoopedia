import React from 'react';
import { useTranslation } from 'react-i18next';
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
  Box,
  Compass,
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
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === 'en';

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

  const presets: { id: CameraPreset; label: string; sub: string }[] = isEn
    ? [
        { id: 'isometric', label: 'Isometric 3D', sub: 'ISO' },
        { id: 'front', label: 'Frontal', sub: 'FRONT' },
        { id: 'left', label: 'Left Lateral', sub: 'LEFT' },
        { id: 'right', label: 'Right Lateral', sub: 'RIGHT' },
        { id: 'back', label: 'Posterior', sub: 'BACK' },
        { id: 'top', label: 'Dorsal View', sub: 'DORSAL' },
      ]
    : [
        { id: 'isometric', label: '3D Toàn Cảnh', sub: 'ISO' },
        { id: 'front', label: 'Trực Diện', sub: 'FRONT' },
        { id: 'left', label: 'Cạnh Trái', sub: 'LEFT' },
        { id: 'right', label: 'Cạnh Phải', sub: 'RIGHT' },
        { id: 'back', label: 'Phía Sau', sub: 'BACK' },
        { id: 'top', label: 'Nhìn Trên', sub: 'DORSAL' },
      ];

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 sm:p-5 z-20">
      {/* Top HUD: Expedition Viewfinder Telemetry & Quick Action Bar */}
      <div className="flex items-start justify-between w-full pointer-events-auto">
        {/* Left: Expedition Viewfinder Lens Badge */}
        <div className="hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 bg-black/85 rounded-xl border border-natgeo-yellow/40 text-xs shadow-xl">
          <div className="w-2 h-2 rounded-full bg-natgeo-yellow animate-ping" />
          <span className="font-mono text-[11px] uppercase tracking-widest text-natgeo-yellow font-extrabold">
            {t('viewer.viewfinder')}
          </span>
          <span className="text-stone-600 text-[10px]">|</span>
          <span className="text-[11px] text-stone-300 font-mono">FIELD PBR • ACES</span>
        </div>

        {/* Right: Archival Tooling (Reset, Snapshot, Fullscreen) */}
        <div className="flex items-center gap-1.5 p-1.5 bg-black/80 rounded-2xl ml-auto border border-natgeo-yellow/30 shadow-2xl backdrop-blur-md">
          <button
            onClick={resetViewer}
            className="p-2 rounded-xl text-stone-300 hover:text-natgeo-yellow hover:bg-white/10 active:scale-95 transition-all"
            title={t('viewer.resetCamera')}
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={onScreenshot}
            className="p-2 rounded-xl text-stone-300 hover:text-natgeo-yellow hover:bg-natgeo-yellow/15 active:scale-95 transition-all"
            title={isEn ? "Capture Field Specimen Photo (PNG)" : "Chụp ảnh mẫu vật thực địa (PNG)"}
          >
            <Camera className="w-4 h-4" />
          </button>

          <div className="w-px h-4 bg-white/20 mx-0.5" />

          <button
            onClick={onToggleFullscreen}
            className="p-2 rounded-xl text-stone-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
            title={t('viewer.fullscreen')}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Bottom HUD: Camera Presets & Field Playback System */}
      <div className="flex flex-col gap-2.5 pointer-events-auto w-full">
        {/* Camera Angle Selector Strip */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto py-1">
          <div className="flex items-center gap-1.5 p-1.5 bg-black/80 rounded-2xl border border-natgeo-yellow/30 shadow-2xl backdrop-blur-md">
            <div className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-natgeo-yellow flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-natgeo-yellow" />
              <span className="hidden md:inline">{isEn ? 'Angles' : 'Góc nhìn'}</span>
            </div>

            {presets.map((p) => {
              const isActive = cameraPreset === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setCameraPreset(p.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-natgeo-yellow text-stone-950 shadow-glow scale-[1.02]'
                      : 'text-stone-300 hover:text-natgeo-yellow hover:bg-white/5'
                  }`}
                >
                  <span>{p.label}</span>
                  <span className={`text-[9px] uppercase font-mono px-1 py-0.2 rounded ${
                    isActive ? 'bg-stone-950/20 text-stone-900 font-extrabold' : 'text-stone-500'
                  }`}>
                    {p.sub}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Atmosphere & Quality Switch */}
          <div className="hidden sm:flex items-center gap-1 p-1.5 bg-black/80 rounded-2xl border border-natgeo-yellow/30 shadow-2xl backdrop-blur-md">
            <button
              onClick={() => setBackgroundMode(backgroundMode === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-xl text-stone-300 hover:text-natgeo-yellow hover:bg-white/10 transition-colors"
              title={isEn ? "Toggle Background (Dark / Light)" : "Chuyển đổi phông nền (Tối / Sáng)"}
            >
              {backgroundMode === 'dark' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5 text-natgeo-yellow" />}
            </button>

            <button
              onClick={toggleQuality}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                quality === 'high'
                  ? 'text-natgeo-yellow hover:bg-natgeo-yellow/10'
                  : 'text-amber-400 bg-amber-500/10'
              }`}
              title={t('viewer.quality')}
            >
              {quality === 'high' ? <Sparkles className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5" />}
              <span className="text-[10px] uppercase font-mono">{quality}</span>
            </button>
          </div>
        </div>

        {/* Lower Row: Motion & Rigging Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* If model has animations */}
          {availableAnimations.length > 0 ? (
            <div className="flex items-center gap-2 p-1.5 bg-black/85 rounded-2xl border border-natgeo-yellow/30 shadow-2xl backdrop-blur-md">
              <button
                onClick={togglePlayAnimation}
                className="p-2 rounded-xl bg-natgeo-yellow text-stone-950 hover:bg-amber-400 transition-colors flex items-center gap-1 text-xs font-mono font-bold shadow-glow"
              >
                {isPlayingAnimation ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{isPlayingAnimation ? (isEn ? 'Pause' : 'Tạm dừng') : (isEn ? 'Play' : 'Chuyển động')}</span>
              </button>

              <div className="h-4 w-px bg-white/20" />

              <div className="flex items-center gap-1 text-xs font-mono">
                {availableAnimations.map((anim) => (
                  <button
                    key={anim}
                    onClick={() => setCurrentAnimation(anim)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      currentAnimation === anim
                        ? 'bg-natgeo-yellow/20 text-natgeo-yellow border border-natgeo-yellow/40'
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    {anim}
                  </button>
                ))}
              </div>

              <div className="h-4 w-px bg-white/20" />

              <button
                onClick={() => {
                  const nextSpeed = animationSpeed === 1 ? 1.5 : animationSpeed === 1.5 ? 0.5 : 1;
                  setAnimationSpeed(nextSpeed);
                }}
                className="px-2 py-1 rounded-lg text-[10px] font-mono font-bold text-natgeo-yellow hover:bg-white/10 transition-colors border border-natgeo-yellow/30"
                title={t('viewer.speed')}
              >
                {animationSpeed}x
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-1.5 bg-black/85 rounded-2xl border border-natgeo-yellow/30 shadow-2xl backdrop-blur-md">
              <button
                onClick={toggleAutoRotate}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                  autoRotate
                    ? 'bg-natgeo-yellow text-stone-950 font-extrabold shadow-glow'
                    : 'text-stone-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <RotateCcw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
                <span>{autoRotate ? (isEn ? 'Rotating specimen' : 'Đang xoay mẫu vật') : (isEn ? 'Auto-Rotate' : 'Tự xoay')}</span>
              </button>

              <button
                onClick={toggleShowWireframe}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                  showAnatomyWireframe
                    ? 'bg-amber-400 text-stone-950 font-extrabold shadow-glow'
                    : 'text-stone-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Box className="w-3.5 h-3.5" />
                <span>{isEn ? 'Wireframe' : 'Lưới giải phẫu'}</span>
              </button>
            </div>
          )}

          {/* Touch gesture guidance note */}
          <div className="text-[10px] text-stone-400 font-mono tracking-wider uppercase px-2 py-1 bg-black/60 rounded-lg border border-white/10">
            {isEn ? 'Drag to rotate • Scroll to zoom' : 'Kéo để xoay • Cuộn để zoom'}
          </div>
        </div>
      </div>
    </div>
  );
};
