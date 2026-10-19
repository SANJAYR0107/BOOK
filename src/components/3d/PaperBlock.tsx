import React, { useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';
import { textureCache } from '../../utils/textureLoader';
import { TOTAL_PAGES } from '../../data/bookData';

interface PaperBlockProps {
  leftPage: number | null; // null if on front cover
  rightPage: number | null; // null if past end
  currentPage: number;
  openProgress: number; // 0 to 1
  width?: number;
  height?: number;
  totalThickness?: number;
  onPageClick?: (side: 'left' | 'right') => void;
}

export const PaperBlock: React.FC<PaperBlockProps> = ({
  leftPage,
  rightPage,
  currentPage,
  openProgress,
  width = 3.0,
  height = 4.25,
  totalThickness = 0.22,
  onPageClick,
}) => {
  // Re-render when textures finish loading
  const [, setTextureVersion] = useState(0);
  useEffect(() => {
    const unsubscribe = textureCache.subscribe(() => setTextureVersion((v) => v + 1));
    return () => {
      unsubscribe();
    };
  }, []);

  const paperEdgeTex = textureCache.getPaperEdgeTexture();

  // Textures for current visible spread
  const leftTexture = leftPage ? textureCache.getTexture(leftPage) : null;
  const rightTexture = rightPage ? textureCache.getTexture(rightPage) : null;

  // Paper edge material
  const edgeMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: paperEdgeTex,
      roughness: 0.85,
      metalness: 0.05,
      color: '#faf4e8',
    });
  }, [paperEdgeTex]);

  // Dark navy interior endpaper
  const endpaperMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#0e1828',
      roughness: 0.7,
    });
  }, []);

  // Calculate dynamic thickness based on reading progress
  // At page 2: left is minimal (~0.02), right is thick (~0.20)
  // At page 30: left is thick (~0.20), right is minimal (~0.02)
  const leftRatio = Math.max(0.08, Math.min(0.92, (currentPage - 1) / (TOTAL_PAGES - 1)));
  const leftThickness = Math.max(0.02, totalThickness * leftRatio);
  const rightThickness = Math.max(0.02, totalThickness * (1 - leftRatio));

  // Materials for Left Page Box:
  // [right(spine), left(outer), top, bottom, front(+Z face up), back]
  const leftMaterials = useMemo(() => {
    const faceMat = leftTexture
      ? new THREE.MeshStandardMaterial({
          map: leftTexture,
          roughness: 0.6,
          metalness: 0.02,
        })
      : endpaperMaterial;

    return [
      edgeMaterial,
      edgeMaterial,
      edgeMaterial,
      edgeMaterial,
      faceMat,
      endpaperMaterial,
    ];
  }, [leftTexture, edgeMaterial, endpaperMaterial]);

  // Materials for Right Page Box:
  const rightMaterials = useMemo(() => {
    const faceMat = rightTexture
      ? new THREE.MeshStandardMaterial({
          map: rightTexture,
          roughness: 0.6,
          metalness: 0.02,
        })
      : endpaperMaterial;

    return [
      edgeMaterial,
      edgeMaterial,
      edgeMaterial,
      edgeMaterial,
      faceMat,
      endpaperMaterial,
    ];
  }, [rightTexture, edgeMaterial, endpaperMaterial]);

  // When closed, only the closed right paper stack is shown under the front cover
  if (openProgress < 0.05) {
    return (
      <group position={[width / 2, 0, totalThickness * 0.5]}>
        <mesh material={rightMaterials} castShadow receiveShadow>
          <boxGeometry args={[width, height, totalThickness]} />
        </mesh>
      </group>
    );
  }

  return (
    <group position={[0, 0, 0]}>
      {/* Left Page Stack (Already Read Pages) */}
      {leftPage && (
        <group position={[-width / 2, 0, leftThickness * 0.5]}>
          <mesh
            material={leftMaterials}
            castShadow
            receiveShadow
            onClick={(e) => {
              e.stopPropagation();
              onPageClick?.('left');
            }}
          >
            <boxGeometry args={[width, height, leftThickness]} />
          </mesh>
        </group>
      )}

      {/* Right Page Stack (Remaining Pages) */}
      {rightPage && (
        <group position={[width / 2, 0, rightThickness * 0.5]}>
          <mesh
            material={rightMaterials}
            castShadow
            receiveShadow
            onClick={(e) => {
              e.stopPropagation();
              onPageClick?.('right');
            }}
          >
            <boxGeometry args={[width, height, rightThickness]} />
          </mesh>
        </group>
      )}

      {/* Center Crease Shadow (Ambient Occlusion along spine gutter) */}
      <mesh position={[0, 0, Math.max(leftThickness, rightThickness) + 0.003]}>
        <planeGeometry args={[0.26, height]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={0.42}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};
