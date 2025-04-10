import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { ErrorBoundary } from "react-error-boundary";






// Load the model

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

function PreHeroModelScene() {
  const modelRef = useRef();
  const { scene } = useGLTF("/oldcomputer.glb");

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.003; // slow rotation
    }
  });

  return (
    <primitive
      ref={modelRef}
      object={scene}
      scale={0.7}
      position={[0, -1, 2]}
    />
  );
}


// Error fallback UI
function ErrorFallback() {
  return (
    <div className="text-white text-center">
      <p>Model failed to load. Please refresh.</p>
      <button onClick={() => window.location.reload()}>Retry</button>
    </div>
  );
}

// Main component
function PreHeroModel() {
  return (
    <div
      style={{
        width: "100vw",
        height: "90vh", // Increased height
        backgroundColor: "black",
        overflow: "hidden",
        marginLeft:"-8vw",
    
    
    
    }}
    >
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Canvas
          shadows
          camera={{ position: [1, 3, 15], fov: 25 }} // further back for more visible height
          style={{ width: "100%", height: "100%", display: "block" }}
        >
          <ambientLight intensity={1.5} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
          <Suspense fallback={null}>
            <PreHeroModelScene />
            <OrbitControls enableZoom={true} />
          </Suspense>
        </Canvas>
      </ErrorBoundary>
    </div>
  );
}

export default PreHeroModel;
