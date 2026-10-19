import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { BookModel } from './BookModel';
import { DeskSurface } from './DeskSurface';
import { DustParticles } from './DustParticles';
import type { LightingTheme } from '../../types/book';

interface BookSceneProps {
  currentPage: number;
  isBookOpen: boolean;
  isFlipping: boolean;
  flipProgress: number;
  flipDirection: 'forward' | 'backward';
  isBookmarked: boolean;
  lightingTheme: LightingTheme;
  isInspectMode: boolean;
  onPageClick?: (side: 'left' | 'right') => void;
  onDragFlip?: (deltaX: number) => void;
}

// Camera Director component that smoothly adjusts framing based on state
const CameraDirector: React.FC<{ isBookOpen: boolean; isInspectMode: boolean }> = ({
  isBookOpen,
  isInspectMode,
}) => {
  const { camera, size } = useThree();
  const isMobile = size.width < 768;

  useFrame((_, delta) => {
    if (isInspectMode) return; // OrbitControls manages camera during inspect mode

    let targetPos: THREE.Vector3;
    let targetLook: THREE.Vector3;

    if (!isBookOpen) {
      // Landing state: Cinematic perspective angle viewing closed book on desk
      if (isMobile) {
        targetPos = new THREE.Vector3(0.5, -2.6, 6.2);
        targetLook = new THREE.Vector3(0.4, 0, 0);
      } else {
        targetPos = new THREE.Vector3(0.6, -2.4, 5.8);
        targetLook = new THREE.Vector3(0.5, 0, 0);
      }
    } else {
      // Reading state: Framed comfortably above the two-page spread
      if (isMobile) {
        targetPos = new THREE.Vector3(0, -0.4, 6.8);
        targetLook = new THREE.Vector3(0, 0, 0);
      } else {
        targetPos = new THREE.Vector3(0, -0.2, 5.4);
        targetLook = new THREE.Vector3(0, 0, 0);
      }
    }

    camera.position.lerp(targetPos, Math.min(1, delta * 3.2));
    camera.lookAt(targetLook);
  });

  return null;
};

// Lighting setup according to active theme
const SceneLighting: React.FC<{ theme: LightingTheme }> = ({ theme }) => {
  if (theme === 'midnight') {
    return (
      <>
        <ambientLight intensity={0.4} color="#6488b0" />
        <directionalLight
          position={[4, 5, 6]}
          intensity={1.2}
          color="#9ec4ed"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0001}
        />
        <pointLight position={[-3, -2, 3]} intensity={0.5} color="#456b9c" />
        <directionalLight position={[0, -5, 2]} intensity={0.3} color="#274068" />
      </>
    );
  }

  if (theme === 'studio') {
    return (
      <>
        <ambientLight intensity={0.7} color="#ffffff" />
        <directionalLight
          position={[3, 5, 6]}
          intensity={1.4}
          color="#ffffff"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-4, 2, 4]} intensity={0.6} color="#e5ebf5" />
      </>
    );
  }

  // Default: Warm Cinematic Reading Lamp
  return (
    <>
      <ambientLight intensity={0.55} color="#eed9be" />
      {/* Main warm desk lamp light */}
      <directionalLight
        position={[3.5, 4.5, 5.8]}
        intensity={1.6}
        color="#fae3c3"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />
      {/* Subtle blue rim light reflecting the starry night cover motif */}
      <directionalLight position={[-4.5, -2, 3.5]} intensity={0.45} color="#4b75a6" />
      {/* Soft warm reading fill */}
      <pointLight position={[0, -2, 3.8]} intensity={0.4} color="#ffd494" />
    </>
  );
};

export const BookScene: React.FC<BookSceneProps> = ({
  currentPage,
  isBookOpen,
  isFlipping,
  flipProgress,
  flipDirection,
  isBookmarked,
  lightingTheme,
  isInspectMode,
  onPageClick,
  onDragFlip,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef<number | null>(null);

  // Mouse & Touch Drag interactions for physical page pulling
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handlePointerDown = (e: PointerEvent) => {
      if (isInspectMode) return;
      dragStartX.current = e.clientX;
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (dragStartX.current === null || isInspectMode) return;
      const deltaX = e.clientX - dragStartX.current;
      dragStartX.current = null;

      if (Math.abs(deltaX) > 40) {
        onDragFlip?.(deltaX);
      }
    };

    container.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      container.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isInspectMode, onDragFlip]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        cursor: isInspectMode ? 'grab' : isBookOpen ? 'pointer' : 'default',
        touchAction: 'none',
      }}
    >
      <Canvas
        shadows
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
        camera={{ position: [0.6, -2.4, 5.8], fov: 45 }}
      >
        <SceneLighting theme={lightingTheme} />

        <DeskSurface theme={lightingTheme} />

        <DustParticles count={75} />

        <BookModel
          currentPage={currentPage}
          isBookOpen={isBookOpen}
          isFlipping={isFlipping}
          flipProgress={flipProgress}
          flipDirection={flipDirection}
          isBookmarked={isBookmarked}
          onPageClick={onPageClick}
        />

        <CameraDirector isBookOpen={isBookOpen} isInspectMode={isInspectMode} />

        {isInspectMode && (
          <OrbitControls
            enablePan={false}
            minDistance={3.5}
            maxDistance={8.5}
            maxPolarAngle={Math.PI / 2 - 0.05}
          />
        )}
      </Canvas>
    </div>
  );
};
