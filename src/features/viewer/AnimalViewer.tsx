import React, { useRef, useState, useEffect } from 'react';
import { AnimalScene } from './AnimalScene';
import { ViewerControls } from './ViewerControls';
import { ViewerFallback } from './ViewerFallback';
import { isWebGLAvailable } from './webgl-detect';
import { useViewerStore } from './useViewerStore';
import { SpeciesImage } from '../../types/species';

interface AnimalViewerProps {
  modelGlb?: string | null;
  images?: SpeciesImage[];
  speciesName?: string;
  isRepresentative?: boolean;
  representativeFor?: string | null;
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
  images,
  speciesName,
  isRepresentative,
  representativeFor,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<boolean>(false);
  const [retryKey, setRetryKey] = useState<number>(0);

  const { isFullscreen, setIsFullscreen, resetViewer } = useViewerStore();

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
  const resolvedModelUrl = modelGlb
    ? `${assetBase}${modelGlb.startsWith('/') ? '' : '/'}${modelGlb}`
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
      className={`relative w-full h-[420px] sm:h-[500px] lg:h-[560px] bg-stone-950 rounded-3xl overflow-hidden border border-stone-800 shadow-2xl transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen w-screen border-none' : ''
      }`}
    >
      {/* Disclaimer tag if representative group model */}
      {isRepresentative && (
        <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/30 text-amber-300 text-xs font-semibold">
          Mô hình đại diện cho nhóm {representativeFor || 'này'} (không phải chính xác loài này)
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

      {/* Interactive UI Controls Overlay */}
      <ViewerControls
        onScreenshot={handleScreenshot}
        onToggleFullscreen={handleToggleFullscreen}
      />
    </div>
  );
};
