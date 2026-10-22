import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, Environment, Html, Bounds } from '@react-three/drei';
import * as THREE from 'three';
import { ModelRenderer } from './ModelRenderer';
import { CameraController } from './CameraController';
import { useViewerStore } from './useViewerStore';

interface AnimalSceneProps {
  modelUrl: string;
}

const LoadingIndicator: React.FC = () => (
  <Html center>
    <div className="flex flex-col items-center justify-center p-5 bio-glass-panel rounded-2xl text-stone-200 min-w-[200px]">
      <div className="relative w-10 h-10 mb-3">
        <div className="absolute inset-0 border-2 border-emerald-500/20 rounded-full" />
        <div className="absolute inset-0 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
        <div className="absolute inset-2 bg-emerald-500/10 rounded-full animate-pulse flex items-center justify-center text-xs">
          🔬
        </div>
      </div>
      <span className="text-xs font-semibold tracking-wider uppercase text-emerald-400 font-mono">
        Nạp Mẫu Vật 3D...
      </span>
      <span className="text-[10px] text-stone-500 mt-1">Đang tối ưu dựng hình PBR</span>
    </div>
  </Html>
);

// Archival Museum Pedestal Ring
const MuseumStage: React.FC = () => {
  return (
    <group position={[0, -0.01, 0]}>
      {/* Outer subtle circular ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.4, 1.42, 64]} />
        <meshBasicMaterial color="#10b981" opacity={0.15} transparent side={THREE.DoubleSide} />
      </mesh>
      {/* Outer measurement ticks */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.0, 2.01, 64]} />
        <meshBasicMaterial color="#ffffff" opacity={0.06} transparent side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

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

  // Background gradient or studio color
  const bgStyles: Record<string, string> = {
    dark: '#08090a',
    light: '#f1f5f9',
    transparent: 'transparent',
  };

  return (
    <div
      className="w-full h-full relative select-none"
      style={{ backgroundColor: bgStyles[backgroundMode] || '#08090a' }}
    >
      <Canvas
        camera={{ position: [2.8, 1.8, 3.2], fov: 40 }}
        dpr={quality === 'high' ? Math.min(window.devicePixelRatio, 2) : 1}
        frameloop={isAnimating ? 'always' : 'demand'}
        gl={{
          antialias: quality === 'high',
          powerPreference: 'high-performance',
          preserveDrawingBuffer: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
      >
        {/* Museum 3-Point Lighting Architecture */}
        <ambientLight intensity={0.65} />

        {/* Key Light: warm directional sunbeam */}
        <directionalLight
          position={[6, 9, 5]}
          intensity={1.3}
          castShadow={shadows}
          shadow-mapSize={quality === 'high' ? 1024 : 512}
          shadow-camera-near={0.5}
          shadow-camera-far={25}
          shadow-camera-left={-4}
          shadow-camera-right={4}
          shadow-camera-top={4}
          shadow-camera-bottom={-4}
          shadow-bias={-0.0001}
          color="#fffbf0"
        />

        {/* Fill Light: cool sky bounce */}
        <directionalLight position={[-6, 4, -4]} intensity={0.45} color="#dbeafe" />

        {/* Rim Light / Backlight: highlights silhouette fur/outline */}
        <directionalLight position={[0, 5, -8]} intensity={0.8} color="#a7f3d0" />

        {/* Ground bounce */}
        <directionalLight position={[0, -5, 0]} intensity={0.15} color="#1c2024" />

        <Suspense fallback={<LoadingIndicator />}>
          <Bounds fit clip observe margin={1.2}>
            <ModelRenderer url={modelUrl} />
          </Bounds>

          <MuseumStage />

          {shadows && (
            <ContactShadows
              position={[0, -0.015, 0]}
              opacity={0.7}
              scale={8}
              blur={1.6}
              far={3.5}
              resolution={quality === 'high' ? 512 : 256}
              color="#000000"
            />
          )}

          <Environment preset={envPreset === 'studio' ? 'city' : 'park'} />
        </Suspense>

        <CameraController />
      </Canvas>
    </div>
  );
};
