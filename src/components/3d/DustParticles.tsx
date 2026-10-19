import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export const DustParticles: React.FC<{ count?: number }> = ({ count = 90 }) => {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 8;     // x
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6;     // y
      pos[i * 3 + 2] = Math.random() * 3 + 0.2;        // z

      spd[i * 3 + 0] = (Math.random() - 0.5) * 0.003;
      spd[i * 3 + 1] = (Math.random() - 0.5) * 0.003;
      spd[i * 3 + 2] = Math.random() * 0.004 + 0.001;
    }

    return [pos, spd];
  }, [count]);

  useFrame(() => {
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    const pos = geo.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] += speeds[i * 3 + 0];
      pos[i * 3 + 1] += speeds[i * 3 + 1];
      pos[i * 3 + 2] += speeds[i * 3 + 2];

      // Wrap around bounds
      if (pos[i * 3 + 2] > 3.5) pos[i * 3 + 2] = 0.2;
      if (pos[i * 3 + 0] > 4) pos[i * 3 + 0] = -4;
      if (pos[i * 3 + 0] < -4) pos[i * 3 + 0] = 4;
    }

    geo.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#f3d8a5"
        transparent
        opacity={0.45}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};
