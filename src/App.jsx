import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Plane } from '@react-three/drei';
import * as THREE from 'three';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

function Sandstorm() {
  const particlesRef = useRef();

  // Define the direction of the air as a vector
  const airDirection = useMemo(() => new THREE.Vector3(0.45, -0.1, 0.1).normalize(), []);

  const particles = useMemo(() => {
    const count = 5000;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100; // X
      positions[i * 3 + 1] = Math.random() * 10; // Y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100; // Z
    }

    return positions;
  }, []);

  useFrame(() => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        // Move particles according to the air direction
        positions[i] += airDirection.x * 0.1; // X-axis
        positions[i + 1] += airDirection.y * 0.1; // Y-axis
        positions[i + 2] += airDirection.z * 0.1; // Z-axis

        // Reset particles if they move out of bounds
        if (positions[i + 1] < 0) {
          positions[i + 1] = Math.random() * 10; // Reset Y position
          positions[i] = (Math.random() - 0.5) * 100; // Reset X position
          positions[i + 2] = (Math.random() - 0.5) * 100; // Reset Z position
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={particles}
          count={particles.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#EDC9AF"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

/* The Sun component */
function Sun() {
  return (
    <mesh position={[50, 50, 50]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial color="yellow" />
    </mesh>
  );
}


function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />

        {/* Desert ground */}
        <Plane args={[100, 100]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
          <meshStandardMaterial attach="material" color="#EDC9AF" />
        </Plane>

        {/* The Sun */}
        <Sun
          position={[5, 5, 5]}
        />
        {/* Sandstorm */}
        <Sandstorm />

        <Box position={[0, 0, 0]}>
          <meshStandardMaterial attach="material" color="hotpink" />
        </Box>
        <OrbitControls />
      </Canvas>
    </div>
  );
}

export default App;