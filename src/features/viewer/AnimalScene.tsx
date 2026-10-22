import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, Environment, Html } from '@react-three/drei';
import { ModelRenderer } from './ModelRenderer';
import { CameraController } from './CameraController';
import { useViewerStore } from './useViewerStore';

interface AnimalSceneProps {
  modelUrl: string;
}

const LoadingIndicator: React.FC = () => (
  <Html center>
    <div className="flex flex-col items-center justify-center p-4 bg-stone-900/90 backdrop-blur-md border border-stone-700 rounded-2xl shadow-2xl text-stone-200">
      <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3" />
      <span className="text-xs font-semibold tracking-wide">Đang tải mô hình 3D...</span>
    </div>
  </Html>
);

export const AnimalScene: React.FC<AnimalSceneProps> = ({ modelUrl }) => {
  const {
    autoRotate,
    availableAnimations,
    isPlayingAnimation,
    quality,
    shadows,
    backgroundMode,
    envPreset,
  } = useViewerStore();

  const isAnimating = autoRotate || (availableAnimations.length > 0 && isPlayingAnimation);

  const bgClasses: Record<string, string> = {
    dark: '#0c0a09',
    light: '#f5f5f4',
    transparent: 'transparent',
  };

  return (
    <div
      className="w-full h-full relative"
      style={{ backgroundColor: bgClasses[backgroundMode] || '#0c0a09' }}
    >
      <Canvas
        camera={{ position: [2.8, 1.8, 3.2], fov: 42 }}
        dpr={quality === 'high' ? Math.min(window.devicePixelRatio, 2) : 1}
        frameloop={isAnimating ? 'always' : 'demand'}
        gl={{
          antialias: quality === 'high',
          powerPreference: 'high-performance',
          preserveDrawingBuffer: true, // required for screenshot export
        }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.2}
          castShadow={shadows}
          shadow-mapSize={quality === 'high' ? 1024 : 512}
        />
        <directionalLight position={[-5, 4, -5]} intensity={0.5} />
        <directionalLight position={[0, -5, 0]} intensity={0.2} />

        <Suspense fallback={<LoadingIndicator />}>
          <ModelRenderer url={modelUrl} />
          {shadows && (
            <ContactShadows
              position={[0, -0.01, 0]}
              opacity={0.65}
              scale={10}
              blur={1.5}
              far={4}
              resolution={quality === 'high' ? 512 : 256}
            />
          )}
          <Environment preset={envPreset === 'studio' ? 'city' : 'park'} />
        </Suspense>

        <CameraController />
      </Canvas>
    </div>
  );
};
