import { describe, it, expect, beforeEach } from 'vitest';
import { useViewerStore } from '../src/features/viewer/useViewerStore';

describe('AnimalViewer Store', () => {
  beforeEach(() => {
    useViewerStore.getState().resetViewer();
  });

  it('should initialize with default camera preset isometric and autoRotate off', () => {
    const state = useViewerStore.getState();
    expect(state.cameraPreset).toBe('isometric');
    expect(state.autoRotate).toBe(false);
  });

  it('should switch camera presets correctly', () => {
    const { setCameraPreset } = useViewerStore.getState();
    setCameraPreset('front');
    expect(useViewerStore.getState().cameraPreset).toBe('front');

    setCameraPreset('top');
    expect(useViewerStore.getState().cameraPreset).toBe('top');
  });

  it('should toggle auto-rotate', () => {
    const { toggleAutoRotate } = useViewerStore.getState();
    toggleAutoRotate();
    expect(useViewerStore.getState().autoRotate).toBe(true);
    toggleAutoRotate();
    expect(useViewerStore.getState().autoRotate).toBe(false);
  });

  it('should toggle graphics quality between high and low', () => {
    const { toggleQuality } = useViewerStore.getState();
    expect(useViewerStore.getState().quality).toBe('high');
    expect(useViewerStore.getState().shadows).toBe(true);

    toggleQuality();
    expect(useViewerStore.getState().quality).toBe('low');
    expect(useViewerStore.getState().shadows).toBe(false);
  });

  it('should manage animations and speed', () => {
    const { setAvailableAnimations, setAnimationSpeed } = useViewerStore.getState();
    setAvailableAnimations(['Walk', 'Run', 'Survey']);
    expect(useViewerStore.getState().availableAnimations).toEqual(['Walk', 'Run', 'Survey']);
    expect(useViewerStore.getState().currentAnimation).toBe('Walk');

    setAnimationSpeed(1.5);
    expect(useViewerStore.getState().animationSpeed).toBe(1.5);
  });
});
