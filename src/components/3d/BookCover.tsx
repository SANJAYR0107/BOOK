import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { textureCache } from '../../utils/textureLoader';

interface BookCoverProps {
  isOpen: boolean;
  openProgress: number; // 0 (closed) to 1 (fully open)
  width?: number;
  height?: number;
  thickness?: number;
}

export const BookCover: React.FC<BookCoverProps> = ({
  openProgress,
  width = 3.0,
  height = 4.25,
  thickness = 0.22,
}) => {
  const frontCoverGroup = useRef<THREE.Group>(null);
  const spineMeshRef = useRef<THREE.Mesh>(null);

  // Re-render when cover and spine textures load
  const [, setTextureVersion] = useState(0);
  useEffect(() => {
    const unsubscribe = textureCache.subscribe(() => setTextureVersion((v) => v + 1));
    return () => {
      unsubscribe();
    };
  }, []);

  const coverTexture = textureCache.getTexture(1);
  const spineTexture = textureCache.getSpineTexture();

  // Dark navy back cover material
  const darkNavyMaterial = React.useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#08111f',
      roughness: 0.65,
      metalness: 0.15,
    });
  }, []);

  const spineMaterial = React.useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: spineTexture,
      roughness: 0.6,
      metalness: 0.2,
    });
  }, [spineTexture]);

  // Front cover dual materials: outer face has cover art, inner face has navy endpaper
  const frontCoverMaterials = React.useMemo(() => {
    const coverMat = new THREE.MeshStandardMaterial({
      map: coverTexture,
      roughness: 0.45,
      metalness: 0.1,
    });
    const insideMat = new THREE.MeshStandardMaterial({
      color: '#0b1626',
      roughness: 0.7,
      metalness: 0.05,
    });
    return [
      darkNavyMaterial,
      darkNavyMaterial,
      darkNavyMaterial,
      darkNavyMaterial,
      coverMat,
      insideMat,
    ];
  }, [coverTexture, darkNavyMaterial]);

  useFrame(() => {
    if (frontCoverGroup.current) {
      // Rotate around spine hinge at x = 0
      // 0 rad = closed on right; -PI rad = swung completely open to left
      const targetAngle = -openProgress * Math.PI;
      frontCoverGroup.current.rotation.y = THREE.MathUtils.lerp(
        frontCoverGroup.current.rotation.y,
        targetAngle,
        0.18
      );

      // Height transition:
      // When closed (openProgress = 0): front cover sits on top of page stack at z = thickness
      // When open (openProgress = 1): front cover rests flat on the desk under the left page stack at z = 0.005
      // During opening: lifts slightly in arc
      const lift = Math.sin(openProgress * Math.PI) * 0.18;
      const baseZ = THREE.MathUtils.lerp(thickness, 0.005, openProgress);
      frontCoverGroup.current.position.z = baseZ + lift;
    }

    if (spineMeshRef.current) {
      // Spine rounds outward when opened
      const spineBend = Math.sin(openProgress * Math.PI) * 0.03;
      spineMeshRef.current.position.z = (thickness * 0.5) - spineBend;
    }
  });

  return (
    <group>
      {/* Back Cover (fixed on table when opened) */}
      <mesh
        position={[-width / 2, 0, -0.01]}
        rotation={[0, 0, 0]}
        castShadow
        receiveShadow
        material={darkNavyMaterial}
      >
        <boxGeometry args={[width, height, 0.02]} />
      </mesh>

      {/* When closed, the back cover is on the right underneath the pages */}
      {openProgress < 0.1 && (
        <mesh
          position={[width / 2, 0, -0.01]}
          castShadow
          receiveShadow
          material={darkNavyMaterial}
        >
          <boxGeometry args={[width, height, 0.02]} />
        </mesh>
      )}

      {/* Spine Connecting Covers with Gold Lettering */}
      <mesh
        ref={spineMeshRef}
        position={[0, 0, thickness * 0.5]}
        rotation={[0, 0, 0]}
        material={spineMaterial}
        castShadow
      >
        <boxGeometry args={[thickness * 0.7, height, thickness]} />
      </mesh>

      {/* Front Cover Assembly (Hinged at x = 0) */}
      <group ref={frontCoverGroup} position={[0, 0, thickness]}>
        <mesh
          position={[width / 2, 0, 0.009]}
          material={frontCoverMaterials}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[width, height, 0.018]} />
        </mesh>
      </group>
    </group>
  );
};
