import React, { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { ErrorBoundary } from "react-error-boundary";

function PreHeroModelScene({ setShowNext }) {
  const modelRef = useRef();
  const { scene } = useGLTF("/oldcomputer.glb");

  useFrame((state) => {
    const z = state.camera.position.z;
    console.log("Camera Z:", z); // Debug zoom level in browser

    // Trigger showNext when zoomed in close enough
    if (z < 8) {
      setShowNext(true);
    } else {
      setShowNext(false);
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

function ErrorFallback() {
  return (
    <div className="text-white text-center">
      <p>Model failed to load. Please refresh.</p>
      <button onClick={() => window.location.reload()}>Retry</button>
    </div>
  );
}

function PreHeroModel() {
  const [showNext, setShowNext] = useState(false);

  return (
    <div className="relative w-full">
      {/* 3D Canvas Section */}
      <div
        style={{
          width: "100vw",
          height: "100vh",
          backgroundColor: "black",
          overflow: "hidden",
          marginLeft: "-8vw",
        }}
      >
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Canvas
            shadows
            camera={{ position: [1, 3, 15], fov: 25 }}
            style={{ width: "100%", height: "100%", display: "block" }}
          >
            <ambientLight intensity={1.5} />
            <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
            <Suspense fallback={null}>
              <PreHeroModelScene setShowNext={setShowNext} />
              <OrbitControls enableZoom={true} />
            </Suspense>
          </Canvas>
        </ErrorBoundary>
      </div>

      {/* 🎯 Zoom-Triggered Overlay Section */}
      {showNext && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-90 flex justify-center items-center z-50 transition-opacity duration-700">
          <h1 className="text-white text-5xl font-bold animate-pulse">
            🚀 Next Scene Unlocked via Zoom!
          </h1>
        </div>
      )}
    </div>
  );
}

export default PreHeroModel;
