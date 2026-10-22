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
  resetViewer: () => void;
}

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
  resetViewer: () =>
    set({
      cameraPreset: 'isometric',
      autoRotate: false,
      animationSpeed: 1,
      isPlayingAnimation: true,
    }),
}));
