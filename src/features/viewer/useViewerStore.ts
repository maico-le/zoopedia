import { create } from 'zustand';

export type CameraPreset = 'front' | 'back' | 'left' | 'right' | 'top' | 'bottom' | 'isometric';
export type EnvironmentPreset = 'studio' | 'night' | 'sunset' | 'forest';
export type BackgroundMode = 'dark' | 'light' | 'transparent';

export interface ViewerState {
  // Camera & Rotation
  cameraPreset: CameraPreset;
  autoRotate: boolean;
  autoRotateSpeed: number;
  
  // Animation
  currentAnimation: string | null;
  isPlayingAnimation: boolean;
  animationSpeed: number;
  availableAnimations: string[];

  // Visuals & Environment
  envPreset: EnvironmentPreset;
  backgroundMode: BackgroundMode;
  quality: 'high' | 'low';
  shadows: boolean;

  // UI state
  isFullscreen: boolean;
  showAnatomyWireframe: boolean;

  // Anatomy Controls
  isAnatomyMode: boolean;
  activeLayers: Record<string, boolean>;
  explodeAmount: number;
  selectedAnatomyPart: string | null;

  // Actions
  setCameraPreset: (preset: CameraPreset) => void;
  toggleAutoRotate: () => void;
  setAutoRotateSpeed: (speed: number) => void;
  setCurrentAnimation: (name: string | null) => void;
  togglePlayAnimation: () => void;
  setAnimationSpeed: (speed: number) => void;
  setAvailableAnimations: (anims: string[]) => void;
  setEnvPreset: (env: EnvironmentPreset) => void;
  setBackgroundMode: (bg: BackgroundMode) => void;
  toggleQuality: () => void;
  setIsFullscreen: (full: boolean) => void;
  toggleShowWireframe: () => void;
  setIsAnatomyMode: (enabled: boolean) => void;
  toggleLayer: (layerId: string) => void;
  setLayerActive: (layerId: string, active: boolean) => void;
  setExplodeAmount: (amount: number) => void;
  setSelectedAnatomyPart: (partId: string | null) => void;
  resetViewer: () => void;
}

const DEFAULT_LAYERS: Record<string, boolean> = {
  skin: true,
  muscle: true,
  skeleton: true,
  circulatory: true,
  respiratory: true,
  digestive: true,
  nervous: true,
};

export const useViewerStore = create<ViewerState>((set) => ({
  cameraPreset: 'isometric',
  autoRotate: false,
  autoRotateSpeed: 1.5,

  currentAnimation: null,
  isPlayingAnimation: true,
  animationSpeed: 1,
  availableAnimations: [],

  envPreset: 'studio',
  backgroundMode: 'dark',
  quality: 'high',
  shadows: true,

  isFullscreen: false,
  showAnatomyWireframe: false,

  isAnatomyMode: false,
  activeLayers: { ...DEFAULT_LAYERS },
  explodeAmount: 0,
  selectedAnatomyPart: null,

  setCameraPreset: (preset) => set({ cameraPreset: preset }),
  toggleAutoRotate: () => set((state) => ({ autoRotate: !state.autoRotate })),
  setAutoRotateSpeed: (speed) => set({ autoRotateSpeed: speed }),
  setCurrentAnimation: (name) => set({ currentAnimation: name }),
  togglePlayAnimation: () => set((state) => ({ isPlayingAnimation: !state.isPlayingAnimation })),
  setAnimationSpeed: (speed) => set({ animationSpeed: speed }),
  setAvailableAnimations: (anims) => set({ availableAnimations: anims, currentAnimation: anims[0] || null }),
  setEnvPreset: (env) => set({ envPreset: env }),
  setBackgroundMode: (bg) => set({ backgroundMode: bg }),
  toggleQuality: () =>
    set((state) => {
      const isHigh = state.quality === 'high';
      return {
        quality: isHigh ? 'low' : 'high',
        shadows: !isHigh,
      };
    }),
  setIsFullscreen: (isFullscreen) => set({ isFullscreen }),
  toggleShowWireframe: () => set((state) => ({ showAnatomyWireframe: !state.showAnatomyWireframe })),
  setIsAnatomyMode: (isAnatomyMode) =>
    set((state) => ({
      isAnatomyMode,
      activeLayers: isAnatomyMode ? { ...state.activeLayers, skin: false } : { ...DEFAULT_LAYERS },
    })),
  toggleLayer: (layerId) =>
    set((state) => ({
      activeLayers: {
        ...state.activeLayers,
        [layerId]: !state.activeLayers[layerId],
      },
    })),
  setLayerActive: (layerId, active) =>
    set((state) => ({
      activeLayers: {
        ...state.activeLayers,
        [layerId]: active,
      },
    })),
  setExplodeAmount: (amount) => set({ explodeAmount: Math.max(0, Math.min(1, amount)) }),
  setSelectedAnatomyPart: (partId) => set({ selectedAnatomyPart: partId }),
  resetViewer: () =>
    set({
      cameraPreset: 'isometric',
      autoRotate: false,
      animationSpeed: 1,
      isPlayingAnimation: true,
      isAnatomyMode: false,
      activeLayers: { ...DEFAULT_LAYERS },
      explodeAmount: 0,
      selectedAnatomyPart: null,
    }),
}));
