import React, { useRef, useState, useEffect } from 'react';
import { AnimalScene } from './AnimalScene';
import { ViewerControls } from './ViewerControls';
import { ViewerFallback } from './ViewerFallback';
import { isWebGLAvailable } from './webgl-detect';
import { useViewerStore } from './useViewerStore';
import { SpeciesImage } from '../../types/species';

interface AnimalViewerProps {
  modelGlb?: string | null;
  anatomyGlb?: string | null;
  images?: SpeciesImage[];
  speciesName?: string;
  isRepresentative?: boolean;
  representativeFor?: string | null;
  className?: string;
  hideTitleBadge?: boolean;
}

interface ViewerErrorBoundaryProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
  onError?: () => void;
}

interface ViewerErrorBoundaryState {
  hasError: boolean;
}

class ViewerErrorBoundary extends React.Component<
  ViewerErrorBoundaryProps,
  ViewerErrorBoundaryState
> {
  constructor(props: ViewerErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ViewerErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('AnimalViewer 3D Error:', error);
    this.props.onError?.();
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export const AnimalViewer: React.FC<AnimalViewerProps> = ({
  modelGlb,
  anatomyGlb,
  images,
  speciesName,
  isRepresentative,
  representativeFor,
  className,
  hideTitleBadge,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<boolean>(false);
  const [retryKey, setRetryKey] = useState<number>(0);

  const { isFullscreen, setIsFullscreen, resetViewer, isAnatomyMode } = useViewerStore();

  useEffect(() => {
    setHasWebGL(isWebGLAvailable());
  }, []);

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [setIsFullscreen]);

  // Fullscreen toggle handler
  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch((err) => {
        console.warn('Fullscreen request failed:', err);
      });
    } else {
      document.exitFullscreen?.().catch((err) => {
        console.warn('Exit fullscreen failed:', err);
      });
    }
  };

  // Screenshot export handler
  const handleScreenshot = () => {
    if (!containerRef.current) return;
    const canvas = containerRef.current.querySelector('canvas');
    if (!canvas) return;

    try {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${speciesName || 'zoopedia-model'}-3d.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Screenshot export error:', err);
    }
  };

  // Double-click on canvas resets camera
  const handleDoubleClick = () => {
    resetViewer();
  };

  // Resolve model URL with optional CDN asset base
  const assetBase = import.meta.env.VITE_ASSET_BASE_URL || '';
  const currentGlb = isAnatomyMode && anatomyGlb ? anatomyGlb : modelGlb;
  const resolvedModelUrl = currentGlb
    ? `${assetBase}${currentGlb.startsWith('/') ? '' : '/'}${currentGlb}`
    : null;

  if (!hasWebGL) {
    return <ViewerFallback reason="no-webgl" images={images} speciesName={speciesName} />;
  }

  if (!resolvedModelUrl) {
    return <ViewerFallback reason="no-model" images={images} speciesName={speciesName} />;
  }

  if (loadError) {
    return (
      <ViewerFallback
        reason="load-error"
        images={images}
        speciesName={speciesName}
        onRetry={() => {
          setLoadError(false);
          setRetryKey((k) => k + 1);
        }}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      onDoubleClick={handleDoubleClick}
      className={`relative overflow-hidden transition-all group ${
        isFullscreen
          ? 'fixed inset-0 z-50 rounded-none h-screen w-screen border-none bg-specimen-dark'
          : className || 'w-full h-[440px] sm:h-[520px] lg:h-[580px] bg-specimen-dark rounded-3xl border border-white/10 shadow-specimen'
      }`}
    >
      {/* Bio-Macro Viewfinder Corner Reticles */}
      <div className="reticle-corner top-4 left-4 border-t-2 border-l-2 rounded-tl-lg" />
      <div className="reticle-corner top-4 right-4 border-t-2 border-r-2 rounded-tr-lg" />
      <div className="reticle-corner bottom-4 left-4 border-b-2 border-l-2 rounded-bl-lg" />
      <div className="reticle-corner bottom-4 right-4 border-b-2 border-r-2 rounded-br-lg" />

      {/* Specimen Identifier Badge */}
      {!hideTitleBadge && (
        <div className="absolute top-4 left-6 z-10 pointer-events-none flex flex-col gap-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-900/80 backdrop-blur-md border border-white/10 text-xs shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-serif italic text-emerald-300 font-semibold text-sm">
              {speciesName || 'Specimen'}
            </span>
            {isRepresentative && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                ĐẠI DIỆN {representativeFor ? representativeFor.toUpperCase() : 'NHÓM'}
              </span>
            )}
          </div>
        </div>
      )}

      {/* 3D Scene wrapped in ErrorBoundary */}
      <ViewerErrorBoundary
        key={retryKey}
        fallback={
          <ViewerFallback
            reason="load-error"
            images={images}
            speciesName={speciesName}
            onRetry={() => {
              setLoadError(false);
              setRetryKey((k) => k + 1);
            }}
          />
        }
        onError={() => setLoadError(true)}
      >
        <AnimalScene modelUrl={resolvedModelUrl} />
      </ViewerErrorBoundary>

      {/* Interactive HUD Controls Overlay */}
      <ViewerControls
        onScreenshot={handleScreenshot}
        onToggleFullscreen={handleToggleFullscreen}
      />
    </div>
  );
};
