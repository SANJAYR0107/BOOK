import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { BookCover } from './BookCover';
import { PaperBlock } from './PaperBlock';
import { PageMesh } from './PageMesh';
import { BookmarkRibbon } from './BookmarkRibbon';
import { textureCache } from '../../utils/textureLoader';
import { TOTAL_PAGES } from '../../data/bookData';

interface BookModelProps {
  currentPage: number;
  isBookOpen: boolean;
  isFlipping: boolean;
  flipProgress: number; // 0 to 1
  flipDirection: 'forward' | 'backward';
  isBookmarked: boolean;
  onPageClick?: (side: 'left' | 'right') => void;
}

export const BookModel: React.FC<BookModelProps> = ({
  currentPage,
  isBookOpen,
  isFlipping,
  flipProgress,
  flipDirection,
  isBookmarked,
  onPageClick,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const openProgressRef = useRef(isBookOpen ? 1 : 0);

  // Spreads:
  // Closed: cover on right (page 1)
  // Open: even page on left (2, 4, 6... 30), odd page on right (3, 5, 7...)
  let leftPage: number | null = null;
  let rightPage: number | null = null;

  if (isBookOpen) {
    if (currentPage <= 1) {
      leftPage = 2;
      rightPage = 3;
    } else {
      leftPage = currentPage % 2 === 0 ? currentPage : currentPage - 1;
      rightPage = leftPage + 1 <= TOTAL_PAGES ? leftPage + 1 : null;
    }
  } else {
    leftPage = null;
    rightPage = 1;
  }

  // Turning page textures
  let turningFrontTex: THREE.Texture | null = null;
  let turningBackTex: THREE.Texture | null = null;

  if (isFlipping) {
    if (flipDirection === 'forward') {
      const turningPageNum = rightPage || currentPage;
      const nextVersoNum = Math.min(TOTAL_PAGES, turningPageNum + 1);
      turningFrontTex = textureCache.getTexture(turningPageNum);
      turningBackTex = textureCache.getTexture(nextVersoNum);
    } else {
      const turningPageNum = leftPage || currentPage;
      const prevRectoNum = Math.max(1, turningPageNum - 1);
      turningFrontTex = textureCache.getTexture(turningPageNum);
      turningBackTex = textureCache.getTexture(prevRectoNum);
    }
  }

  useFrame((_, delta) => {
    const target = isBookOpen ? 1 : 0;
    openProgressRef.current = THREE.MathUtils.damp(openProgressRef.current, target, 5, delta);

    if (groupRef.current) {
      // Landing: resting at a subtle desk angle
      // Reading: centered and oriented directly towards the reader
      const landingRotX = -0.06;
      const landingRotY = 0.08;
      const landingRotZ = 0.02;

      groupRef.current.rotation.x = THREE.MathUtils.lerp(landingRotX, 0, openProgressRef.current);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(landingRotY, 0, openProgressRef.current);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(landingRotZ, 0, openProgressRef.current);

      // Book position shift: closed book centered on desk, open book centered at origin
      const targetPosX = THREE.MathUtils.lerp(0.5, 0, openProgressRef.current);
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetPosX, 0.1);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Front & Back Cover and Spine */}
      <BookCover
        isOpen={isBookOpen}
        openProgress={openProgressRef.current}
      />

      {/* Stacked Paper Block */}
      <PaperBlock
        leftPage={leftPage}
        rightPage={rightPage}
        currentPage={currentPage <= 1 ? 2 : currentPage}
        openProgress={openProgressRef.current}
        onPageClick={onPageClick}
      />

      {/* Dynamic Curving Page Flip Mesh */}
      {isFlipping && turningFrontTex && turningBackTex && (
        <PageMesh
          frontTexture={turningFrontTex}
          backTexture={turningBackTex}
          progress={flipProgress}
          direction={flipDirection}
        />
      )}

      {/* Silk Bookmark Ribbon */}
      <BookmarkRibbon
        visible={isBookmarked && isBookOpen}
      />
    </group>
  );
};
