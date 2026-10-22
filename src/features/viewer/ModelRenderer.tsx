import React, { useRef, useEffect } from 'react';
import { useGLTF, useAnimations, Center } from '@react-three/drei';
import * as THREE from 'three';
import { useViewerStore } from './useViewerStore';

interface ModelRendererProps {
  url: string;
}

const EXPLODE_VECTORS: Record<string, [number, number, number]> = {
  skin_outer: [0, 0.5, 0],
  skin_head: [0.4, 0.35, 0],
  skin_body: [0, 0.45, 0],
  skin_snout: [0.55, 0.25, 0],
  skin_tail: [-0.45, 0.2, 0],
  skin_leg_0: [0.2, -0.2, 0.35],
  skin_leg_1: [-0.2, -0.2, 0.35],
  skin_leg_2: [0.2, -0.2, -0.35],
  skin_leg_3: [-0.2, -0.2, -0.35],
  muscle_body: [0, 0.15, 0.25],
  bone_skull: [0.35, 0.2, 0],
  bone_spine: [0, 0, 0],
  organ_heart: [0.22, 0.08, 0.2],
  organ_lungs: [-0.22, 0.08, -0.2],
};

function getNodeLayer(nodeName: string): string {
  if (nodeName.startsWith('skin')) return 'skin';
  if (nodeName.startsWith('muscle')) return 'muscle';
  if (nodeName.startsWith('bone')) return 'skeleton';
  if (nodeName.includes('heart')) return 'circulatory';
  if (nodeName.includes('lung')) return 'respiratory';
  return 'skin';
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
    isAnatomyMode,
    activeLayers,
    explodeAmount,
    selectedAnatomyPart,
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

  // Cache initial object positions for explode view
  useEffect(() => {
    scene.traverse((child) => {
      if (!child.userData.origPosition) {
        child.userData.origPosition = child.position.clone();
      }
    });
  }, [scene]);

  // Handle anatomy layer peeling, explode view, materials, and wireframe
  useEffect(() => {
    scene.traverse((child) => {
      // 1. Layer Peeling & Visibility
      const layer = getNodeLayer(child.name);
      const isVisible = isAnatomyMode ? (activeLayers[layer] ?? true) : true;

      // Check if any ancestor should hide this child
      let parentVisible = true;
      let p = child.parent;
      while (p && p !== scene) {
        const pLayer = getNodeLayer(p.name);
        if (isAnatomyMode && activeLayers[pLayer] === false) {
          parentVisible = false;
          break;
        }
        p = p.parent;
      }

      child.visible = isVisible && parentVisible;

      // 2. Explode View Vector Translation
      if (child.userData.origPosition) {
        const vec = EXPLODE_VECTORS[child.name];
        if (vec) {
          const offset = new THREE.Vector3(...vec).multiplyScalar(explodeAmount * 2.2);
          child.position.copy(child.userData.origPosition).add(offset);
        } else if (explodeAmount === 0) {
          child.position.copy(child.userData.origPosition);
        }
      }

      // 3. Highlight selected anatomy part & wireframe
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        const isSelected = selectedAnatomyPart && (child.name === selectedAnatomyPart || child.name.includes(selectedAnatomyPart));

        const updateMat = (m: THREE.Material) => {
          if ('wireframe' in m) {
            (m as THREE.MeshStandardMaterial).wireframe = showAnatomyWireframe;
          }
          if ('roughness' in m) {
            const std = m as THREE.MeshStandardMaterial;
            std.envMapIntensity = 1.1;

            if (isSelected) {
              std.emissive = new THREE.Color(0xf59e0b);
              std.emissiveIntensity = 0.6;
            } else {
              std.emissive = new THREE.Color(0x000000);
              std.emissiveIntensity = 0;
            }
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
  }, [scene, showAnatomyWireframe, isAnatomyMode, activeLayers, explodeAmount, selectedAnatomyPart]);

  return (
    <Center top>
      <primitive ref={groupRef} object={scene} />
    </Center>
  );
};
