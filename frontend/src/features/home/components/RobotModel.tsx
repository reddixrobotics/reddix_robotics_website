import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useReducedMotion } from 'framer-motion';

export default function RobotModel(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>(null);
  
  // Lazy-load the GLTF model (draco compression or optimized load depending on how it's served)
  const { scene, animations } = useGLTF('/animated_humanoid_robot/scene.gltf');
  const { actions } = useAnimations(animations, group);
  const shouldReduceMotion = useReducedMotion();

  // Compute bounding box, center, and scale for automatic fitting
  const { fitScale, fitPosition } = React.useMemo(() => {
    // 1. Compute the bounding box
    const box = new THREE.Box3().setFromObject(scene);
    
    // 2. Get size and center
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    // 3. Calculate scale factor so the largest dimension maps to a target size
    const maxDim = Math.max(size.x, size.y, size.z);
    const targetSize = 5;
    const scale = maxDim > 0 ? targetSize / maxDim : 1;

    // 4. Re-center
    return {
      fitScale: scale,
      fitPosition: [-center.x, -center.y, -center.z] as [number, number, number]
    };
  }, [scene]);

  // Optimize materials
  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Optimize shadows and render order
        child.castShadow = true;
        child.receiveShadow = true;
        // If material exists, we can tweak it for performance/look
        if (child.material) {
          child.material.envMapIntensity = 0.8;
          child.material.needsUpdate = true;
        }
      }
    });
  }, [scene]);

  // Play animation (prioritize run/walk/idle)
  useEffect(() => {
    if (shouldReduceMotion) {
      // Stop all actions if reduced motion is preferred
      if (actions) {
        Object.values(actions).forEach(action => action?.stop());
      }
      return;
    }

    if (actions && Object.keys(actions).length > 0) {
      let targetActionName = Object.keys(actions).find((name) => {
        const lower = name.toLowerCase();
        return lower.includes('idle'); // Prefer idle as it's less distracting
      });

      if (!targetActionName) {
        targetActionName = Object.keys(actions).find((name) => name.toLowerCase().includes('walk'));
      }

      const actionName = targetActionName || Object.keys(actions)[0];
      const action = actions[actionName];
      
      if (action) {
        // Play very slowly for subtle effect
        action.setEffectiveTimeScale(0.5);
        action.reset().fadeIn(0.5).play();
        return () => {
          action.fadeOut(0.5);
        };
      }
    }
  }, [actions, shouldReduceMotion]);

  // Interactive mouse follow & subtle rotation
  useFrame((state, delta) => {
    if (shouldReduceMotion || !group.current) return;

    // Subtle continuous rotation if no animation is playing, else just the mouse tracking
    group.current.rotation.y += delta * 0.05;

    // Subtle mouse follow (additive) - clamping the influence
    const targetX = (state.pointer.x * Math.PI) / 12;
    const targetY = (state.pointer.y * Math.PI) / 12;

    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetX, 2, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, -targetY, 2, delta);
  });

  return (
    <Float 
      speed={shouldReduceMotion ? 0 : 1.5} 
      rotationIntensity={shouldReduceMotion ? 0 : 0.1} 
      floatIntensity={shouldReduceMotion ? 0 : 0.15}
    >
      <group ref={group} {...props} dispose={null} scale={fitScale}>
        <group position={fitPosition}>
          <primitive object={scene} />
        </group>
      </group>
    </Float>
  );
}

// Preload the model so it's ready quickly
useGLTF.preload('/animated_humanoid_robot/scene.gltf');
