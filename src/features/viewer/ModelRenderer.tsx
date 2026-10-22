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

  // Register available animations from model
  useEffect(() => {
    if (names && names.length > 0) {
      setAvailableAnimations(names);
    } else {
      setAvailableAnimations([]);
    }
  }, [names, setAvailableAnimations]);

  // Handle animation playback and speed
  useEffect(() => {
    if (!names || names.length === 0) return;

    const clipName = currentAnimation || names[0];
    const action = actions[clipName];

    if (action) {
      action.reset().fadeIn(0.25).play();
      action.setEffectiveTimeScale(animationSpeed);
      action.paused = !isPlayingAnimation;
    }

    return () => {
      action?.fadeOut(0.2);
    };
  }, [currentAnimation, isPlayingAnimation, animationSpeed, actions, names]);

  // Enhance materials for museum lighting & handle wireframe toggle
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        const updateMat = (m: THREE.Material) => {
          if ('wireframe' in m) {
            (m as THREE.MeshStandardMaterial).wireframe = showAnatomyWireframe;
          }
          if ('roughness' in m) {
            const std = m as THREE.MeshStandardMaterial;
            std.envMapIntensity = 1.1;
            std.needsUpdate = true;
          }
        };

        if (Array.isArray(mesh.material)) {
          mesh.material.forEach(updateMat);
        } else if (mesh.material) {
          updateMat(mesh.material);
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
