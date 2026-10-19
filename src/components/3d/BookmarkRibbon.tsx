import React from 'react';
import * as THREE from 'three';

interface BookmarkRibbonProps {
  visible: boolean;
  height?: number;
  thickness?: number;
}

export const BookmarkRibbon: React.FC<BookmarkRibbonProps> = ({
  visible,
  height = 4.25,
  thickness = 0.22,
}) => {
  if (!visible) return null;

  // Luxurious golden satin material
  const ribbonMaterial = new THREE.MeshStandardMaterial({
    color: '#e5b869',
    roughness: 0.35,
    metalness: 0.4,
    side: THREE.DoubleSide,
  });

  return (
    <group position={[0.08, 0, thickness + 0.02]}>
      {/* Ribbon laying along the pages */}
      <mesh material={ribbonMaterial} position={[0, -0.4, 0.005]} rotation={[0, 0, -0.04]} castShadow>
        <planeGeometry args={[0.16, height * 0.9]} />
      </mesh>

      {/* Ribbon hanging out of the bottom of the book with a notch */}
      <mesh material={ribbonMaterial} position={[0.04, -height / 2 - 0.32, -0.04]} rotation={[0.2, 0, -0.1]} castShadow>
        <planeGeometry args={[0.16, 0.7]} />
      </mesh>

      {/* Small golden top loop near the head of spine */}
      <mesh material={ribbonMaterial} position={[0, height / 2 + 0.06, 0.02]} rotation={[-0.4, 0, 0]} castShadow>
        <planeGeometry args={[0.16, 0.2]} />
      </mesh>
    </group>
  );
};
