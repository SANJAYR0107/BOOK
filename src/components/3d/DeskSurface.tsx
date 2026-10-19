import React, { useMemo } from 'react';
import * as THREE from 'three';
import { textureCache } from '../../utils/textureLoader';

interface DeskSurfaceProps {
  theme?: 'warm' | 'midnight' | 'studio';
}

export const DeskSurface: React.FC<DeskSurfaceProps> = ({ theme = 'warm' }) => {
  const deskTexture = textureCache.getDeskTexture();

  const deskMaterial = useMemo(() => {
    let color = '#221812';
    let roughness = 0.6;

    if (theme === 'midnight') {
      color = '#0e1522';
      roughness = 0.5;
    } else if (theme === 'studio') {
      color = '#1a1f29';
      roughness = 0.4;
    }

    return new THREE.MeshStandardMaterial({
      map: deskTexture,
      color,
      roughness,
      metalness: 0.1,
    });
  }, [deskTexture, theme]);

  return (
    <group position={[0, 0, -0.06]}>
      {/* Desk Tabletop Mesh */}
      <mesh receiveShadow position={[0, 0, -0.02]}>
        <planeGeometry args={[30, 24]} />
        <primitive object={deskMaterial} attach="material" />
      </mesh>

      {/* Soft Contact Ambient Occlusion Shadow directly under the book */}
      <mesh position={[0, 0, -0.015]}>
        <planeGeometry args={[7.2, 5.2]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={0.55}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};
