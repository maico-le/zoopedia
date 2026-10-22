import React, { useRef, useEffect } from 'react';
import { useGLTF, useAnimations, Center } from '@react-three/drei';
import * as THREE from 'three';
import { useViewerStore } from './useViewerStore';

interface ModelRendererProps {
  url: string;
}

export const ModelRenderer: React.FC<ModelRendererProps> = ({ url }) => {
  const groupRef = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(url);
  const { actions, names } = useAnimations(animations, groupRef);

  const {
    currentAnimation,
    isPlayingAnimation,
    animationSpeed,
    setAvailableAnimations,
    showAnatomyWireframe,
  } = useViewerStore();

  // Register available animations
  useEffect(() => {
    if (names.length > 0) {
      setAvailableAnimations(names);
    }
  }, [names, setAvailableAnimations]);

  // Handle animation playback and speed
  useEffect(() => {
    if (names.length === 0) return;

    const clipName = currentAnimation || names[0];
    const action = actions[clipName];

    if (action) {
      action.reset().fadeIn(0.2).play();
      action.setEffectiveTimeScale(animationSpeed);
      if (!isPlayingAnimation) {
        action.paused = true;
      } else {
        action.paused = false;
      }
    }

    return () => {
      action?.fadeOut(0.2);
    };
  }, [currentAnimation, isPlayingAnimation, animationSpeed, actions, names]);

  // Handle wireframe & visual materials
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => {
            if ('wireframe' in m) {
              (m as THREE.MeshStandardMaterial).wireframe = showAnatomyWireframe;
            }
          });
        } else if (mesh.material && 'wireframe' in mesh.material) {
          (mesh.material as THREE.MeshStandardMaterial).wireframe = showAnatomyWireframe;
        }
      }
    });
  }, [scene, showAnatomyWireframe]);

  return (
    <Center top>
      <primitive ref={groupRef} object={scene} />
    </Center>
  );
};
