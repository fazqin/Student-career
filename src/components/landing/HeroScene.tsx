import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Text } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function OrbitalSystem() {
  const group = useRef<THREE.Group>(null);

  const nodes = useMemo(
    () => [
      { label: "Wishlist", r: 2.25, a: 0.2, color: "#14B8A6" },
      { label: "Applied", r: 2.7, a: 1.4, color: "#0EA5E9" },
      { label: "Assessment", r: 3.0, a: 2.4, color: "#14B8A6" },
      { label: "Interview", r: 3.2, a: 3.3, color: "#EAB308" },
      { label: "Offer", r: 2.55, a: 4.1, color: "#14B8A6" },
    ],
    []
  );

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const px = state.pointer.x;
    const py = state.pointer.y;
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, px * 0.35, 0.06);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -py * 0.25, 0.06);
    g.rotation.z += delta * 0.08;
  });

  return (
    <group ref={group}>
      {/* Central core */}
      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.35}>
        <mesh>
          <sphereGeometry args={[0.72, 64, 64]} />
          <meshPhysicalMaterial
            color={new THREE.Color("#EAB308")}
            roughness={0.25}
            metalness={0.15}
            transmission={0.55}
            thickness={1}
            clearcoat={1}
            clearcoatRoughness={0.2}
            emissive={new THREE.Color("#14B8A6")}
            emissiveIntensity={0.12}
          />
        </mesh>
      </Float>

      <Text
        position={[0, -1.25, 0]}
        fontSize={0.22}
        color="#EAF0FF"
        anchorX="center"
        anchorY="middle"
        maxWidth={6}
      >
        CAREERTRACK
      </Text>

      {/* Rings */}
      {[2.25, 2.75, 3.2].map((r) => (
        <mesh key={r} rotation={[Math.PI / 2.6, 0, 0]}>
          <torusGeometry args={[r, 0.015, 16, 220]} />
          <meshStandardMaterial color={new THREE.Color("#14B8A6")} transparent opacity={0.22} />
        </mesh>
      ))}

      {/* Nodes */}
      {nodes.map((n) => {
        const x = Math.cos(n.a) * n.r;
        const z = Math.sin(n.a) * n.r;
        return (
          <group key={n.label} position={[x, 0.2, z]}>
            <Float speed={1.6} rotationIntensity={0.5} floatIntensity={0.6}>
              <mesh>
                <sphereGeometry args={[0.16, 32, 32]} />
                <meshPhysicalMaterial
                  color={new THREE.Color(n.color)}
                  roughness={0.28}
                  metalness={0.25}
                  transmission={0.35}
                  thickness={1}
                  clearcoat={1}
                  emissive={new THREE.Color(n.color)}
                  emissiveIntensity={0.1}
                />
              </mesh>
            </Float>
            <Text
              position={[0, -0.32, 0]}
              fontSize={0.14}
              color="#DDE6FF"
              anchorX="center"
              anchorY="middle"
            >
              {n.label}
            </Text>
          </group>
        );
      })}

      {/* Accent light shards */}
      <Float speed={0.7} rotationIntensity={0.9} floatIntensity={0.4}>
        <mesh position={[1.25, 0.6, -1.3]} rotation={[0.4, 0.8, 0.2]}>
          <boxGeometry args={[0.15, 1.4, 0.15]} />
          <meshStandardMaterial color={new THREE.Color("#EAB308")} transparent opacity={0.24} />
        </mesh>
      </Float>
    </group>
  );
}

export default function HeroScene3D() {
  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0, 0.8, 7.2], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 5, 3]} intensity={1.15} color={"#EAB308"} />
      <pointLight position={[-3, 2, -2]} intensity={0.85} color={"#14B8A6"} />
      <fog attach="fog" args={["#083335", 6, 14]} />
      <OrbitalSystem />
      <Environment preset="city" />
    </Canvas>
  );
}
