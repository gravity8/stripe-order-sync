import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { FloatingCube } from './FloatingCube';

export function Scene3D() {
  return (
    <div className="w-full h-64 rounded-lg overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5">
      <Suspense fallback={
        <div className="w-full h-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      }>
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          
          <FloatingCube position={[-2, 0, 0]} color="#3b82f6" />
          <FloatingCube position={[0, 0, 0]} color="#8b5cf6" />
          <FloatingCube position={[2, 0, 0]} color="#06b6d4" />
          
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </Suspense>
    </div>
  );
}