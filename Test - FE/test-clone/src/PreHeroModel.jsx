import React, { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { ErrorBoundary } from "react-error-boundary";

function PreHeroModelScene() {
  const modelRef = useRef();
  const { scene } = useGLTF("/oldcomputer.glb");

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0;
    }
  });

  return (
    <primitive
      ref={modelRef}
      object={scene}
      scale={0.7}
      position={[.2, -1, 3]}
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

function ZoomScrollHandler({ controlsRef }) {
  const { camera } = useThree();
  const SCROLL_TRIGGER_DISTANCE = 2;

  useFrame(() => {
    if (controlsRef.current) {
      const distance = camera.position.distanceTo(controlsRef.current.target);
      document.body.style.overflow = "y";  
    }
  });

  return null;
}

function PreHeroModel() {
  const controlsRef = useRef();
  const [showText, setShowText] = useState(false);


  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowText(true);
      } else {
        setShowText(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "695px", // allow scrolling
        backgroundColor: "black",
        overflow: "hidden",
        position: "relative",
        marginLeft: "-140px",
        marginTop: "-30px",
      }}
    >
      {/* 3D Model Canvas */}
      <div style={{ position: "sticky", top: 0, height: "100vh", zIndex: 0 }}>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Canvas
            shadows
            camera={{ position: [1, 3, 15], fov: 25 }}
            style={{ width: "100%", height: "100%", display: "block" }}
          >
            <ambientLight intensity={1.5} />
            <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
            <Suspense fallback={null}>
              <PreHeroModelScene />
              <OrbitControls
                ref={controlsRef}
                enableZoom={false}
                enableDamping
              />
              <ZoomScrollHandler controlsRef={controlsRef} />
            </Suspense>
          </Canvas>
        </ErrorBoundary>
      </div>

      {/* Scroll-triggered text overlay */}
      <div
    style={{
    position: "absolute",
    marginTop: "-350px", // Adjusted for model's vertical placement
    left: "50%",
    transform: "translate(-50%, -50%)",
    color: "white",
    fontSize: "5rem",
    fontWeight: "bold",
    opacity: showText ? 1 : 0,
    transition: "opacity 0.8s ease-in-out",
    zIndex: 1,
    pointerEvents: "none",
  }}
>
  KHAALAS MEDIA
</div>

    </div>
  );
}

export default PreHeroModel;
