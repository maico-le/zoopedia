import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useViewerStore, CameraPreset } from './useViewerStore';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

const PRESET_COORDINATES: Record<CameraPreset, [number, number, number]> = {
  isometric: [2.8, 1.8, 3.2],
  front: [0, 1.2, 4.0],
  back: [0, 1.2, -4.0],
  left: [-4.0, 1.2, 0],
  right: [4.0, 1.2, 0],
  top: [0, 4.2, 0.001],
  bottom: [0, -3.8, 0.001],
};

export const CameraController: React.FC = () => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();
  const { cameraPreset, autoRotate, autoRotateSpeed } = useViewerStore();

  const targetPosition = useRef(new THREE.Vector3(...PRESET_COORDINATES.isometric));
  const isTransitioning = useRef(false);

  useEffect(() => {
    const coords = PRESET_COORDINATES[cameraPreset] || PRESET_COORDINATES.isometric;
    targetPosition.current.set(...coords);
    isTransitioning.current = true;
  }, [cameraPreset]);

  // Smooth lerp transition towards target preset
  useFrame((_, delta) => {
    if (isTransitioning.current) {
      camera.position.lerp(targetPosition.current, Math.min(1, delta * 4));
      controlsRef.current?.target.lerp(new THREE.Vector3(0, 0.8, 0), Math.min(1, delta * 4));

      if (camera.position.distanceTo(targetPosition.current) < 0.05) {
        camera.position.copy(targetPosition.current);
        isTransitioning.current = false;
      }
      controlsRef.current?.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.08}
      minDistance={1.2}
      maxDistance={9.0}
      target={[0, 0.8, 0]}
      autoRotate={autoRotate}
      autoRotateSpeed={autoRotateSpeed}
      makeDefault
    />
  );
};
