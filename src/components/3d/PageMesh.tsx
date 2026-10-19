import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface PageMeshProps {
  frontTexture: THREE.Texture;
  backTexture: THREE.Texture;
  progress: number; // 0.0 (resting on right) to 1.0 (resting on left)
  direction: 'forward' | 'backward'; // forward: right-to-left, backward: left-to-right
  width?: number;
  height?: number;
}

export const PageMesh: React.FC<PageMeshProps> = ({
  frontTexture,
  backTexture,
  progress,
  direction: _direction,
  width = 3.0,
  height = 4.25,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const shadowMeshRef = useRef<THREE.Mesh>(null);

  // Subdivided plane geometry for smooth paper curling
  const geometry = useMemo(() => {
    // 36 segments width, 18 segments height
    const geo = new THREE.PlaneGeometry(width, height, 36, 18);
    // Translate so pivot is at spine (x = 0)
    geo.translate(width / 2, 0, 0);
    return geo;
  }, [width, height]);

  // Original vertex positions buffer
  const initialPositions = useMemo(() => {
    return geometry.attributes.position.clone();
  }, [geometry]);

  // Dynamic deformation loop
  useFrame(() => {
    if (!meshRef.current) return;
    const pos = geometry.attributes.position;
    const orig = initialPositions;

    // t is the turning progress from 0 (resting on right) to 1 (resting on left)
    const t = Math.max(0, Math.min(1, progress));
    const angle = t * Math.PI;

    // Arch height peak around mid-flip (t ~ 0.5)
    const sinT = Math.sin(t * Math.PI);
    const archMax = 0.65 * sinT;

    // As page turns, the outer edge curls slightly inward (cylindrical roll)
    const curlIntensity = 0.28 * sinT;

    for (let i = 0; i < pos.count; i++) {
      const origX = orig.getX(i);
      const origY = orig.getY(i);

      // u is normalized distance from spine (0 at spine, 1 at edge)
      const u = origX / width;

      // Cylindrical curl curvature
      const curlOffset = Math.sin(u * Math.PI) * curlIntensity;
      const cornerDroop = (1 - (origY / (height / 2)) * (origY / (height / 2))) * 0.05 * sinT;

      // Radius from spine
      const currentR = origX - curlOffset * 0.3;

      // Rotate around spine (x = 0)
      const rotatedX = currentR * Math.cos(angle);
      const rotatedZ = -currentR * Math.sin(angle);

      // Arch elevation above the book surface
      const elevation = Math.sin(u * Math.PI * 0.9) * archMax + cornerDroop;

      pos.setXYZ(
        i,
        rotatedX,
        origY,
        rotatedZ - elevation
      );
    }

    pos.needsUpdate = true;
    geometry.computeVertexNormals();

    // Position drop shadow beneath the turning page
    if (shadowMeshRef.current) {
      const shadowX = (1 - t * 2) * (width * 0.45);
      const shadowOpacity = Math.max(0, Math.sin(t * Math.PI) * 0.35);
      shadowMeshRef.current.position.set(shadowX, 0, 0.01);
      (shadowMeshRef.current.material as THREE.MeshBasicMaterial).opacity = shadowOpacity;
    }
  });

  // Dual-sided shader material or custom material
  // Front face gets frontTexture; back face gets backTexture flipped horizontally
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uFrontTexture: { value: frontTexture },
        uBackTexture: { value: backTexture },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uFrontTexture;
        uniform sampler2D uBackTexture;
        varying vec2 vUv;
        varying vec3 vNormal;

        void main() {
          vec4 color;
          // Subtly darken page crease and lighting
          float light = clamp(dot(vNormal, normalize(vec3(0.3, 0.8, 0.9))), 0.65, 1.0);

          if (gl_FrontFacing) {
            color = texture2D(uFrontTexture, vUv);
          } else {
            // Flip UV horizontally for back page
            color = texture2D(uBackTexture, vec2(1.0 - vUv.x, vUv.y));
          }

          // Warm subtle ambient tint
          gl_FragColor = vec4(color.rgb * light, color.a);
        }
      `,
      side: THREE.DoubleSide,
      transparent: true,
    });
  }, [frontTexture, backTexture]);

  // Update uniforms when textures change
  React.useEffect(() => {
    if (shaderMaterial) {
      shaderMaterial.uniforms.uFrontTexture.value = frontTexture;
      shaderMaterial.uniforms.uBackTexture.value = backTexture;
    }
  }, [frontTexture, backTexture, shaderMaterial]);

  return (
    <group position={[0, 0, 0.06]}>
      {/* Dynamic Turning Page Mesh */}
      <mesh ref={meshRef} geometry={geometry} material={shaderMaterial} castShadow receiveShadow />

      {/* Dynamic Drop Shadow beneath page */}
      <mesh ref={shadowMeshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0.01]}>
        <planeGeometry args={[width * 1.1, height * 0.95]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.2} depthWrite={false} />
      </mesh>
    </group>
  );
};
