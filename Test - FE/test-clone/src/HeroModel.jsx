import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, Text } from "@react-three/drei";
import { useRef, useState, Suspense } from "react";
import { Vector3 } from "three";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import { useEffect } from "react";
import { ErrorBoundary as ErrorBoundaryComponent } from "react-error-boundary";

function LaptopModel() {
  const { scene } = useGLTF("/laptop.glb");
  scene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      child.renderOrder = 1;
    }
  });
  return <primitive object={scene} scale={1.7} position={[-0.5, -0.1, 0]} />;
}

export function StaticText(triggerRef) {
  const groupRef = useRef();
  const letterRefs = useRef([]);
  const originalPositions = useRef([]);

  useFrame(({ camera }) => {
    if (groupRef.current) {
      groupRef.current.quaternion.copy(camera.quaternion);
      const distance = 8;
      const direction = camera.getWorldDirection(new Vector3());
      groupRef.current.position.copy(
        camera.position.clone().add(direction.multiplyScalar(distance))
      );
    }
  });

  const letters = "WEB DEVELOPMENT".split("");

  useEffect(() => {
    letterRefs.current.forEach((ref, i) => {
      if (ref && !originalPositions.current[i]) {
        originalPositions.current[i] = ref.position.clone();
      }
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerRef?.current,

        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    letterRefs.current.forEach((ref, i) => {
      const original = originalPositions.current[i];
      if (!ref || !original) return;

      const randomOffset = {
        x: original.x + (Math.random() - 0.5) * 6,
        y: original.y + (Math.random() - 0.5) * 6,
        z: original.z + (Math.random() - 0.5) * 6,
      };

      tl.to(
        ref.position,
        {
          x: randomOffset.x,
          y: randomOffset.y,
          z: randomOffset.z,
          duration: 3,
          ease: "slow(0.7, 0.7, false)",
        },
        0
      );

      tl.to(
        ref.material,
        {
          opacity: 0,
          duration: 1,
          ease: "power2.out",
        },
        0
      );
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <group ref={groupRef}>
      {letters.map((char, i) => (
        <Text
          key={i}
          ref={(el) => (letterRefs.current[i] = el)}
          fontSize={0.5}
          position={[i * 0.35 - (letters.length * 0.35) / 2, 0, 0]}
          color="white"
          anchorX="center"
          anchorY="middle"
          renderOrder={999}
          depthTest={false}
          depthWrite={false}
          material-transparent
          material-opacity={1}
          fontWeight="bold"
          stroke="black"
          strokeThickness={3}
        >
          {char}
        </Text>
      ))}
    </group>
  );
}

function ErrorBoundary({ children, fallback }) {
  return (
    <ErrorBoundaryComponent fallback={fallback}>
      {children}
    </ErrorBoundaryComponent>
  );
}

export default function HeroModel() {
  const containerRef = useRef();
  return (
    <div
      ref={containerRef}
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        marginLeft: "-8vw",
        marginTop: "-2vw",
        overflow: "hidden",
        marginBottom: "-60vw",
      }}
    >
      <ErrorBoundary>
        <Canvas
          shadows
          camera={{ position: [0, 0, 10], fov: 25 }}
          style={{
            width: "100%",
            height: "100%",
            display: "block",
            marginTop: "32px",
          }}
        >
          <ambientLight intensity={1.2} />
          <directionalLight position={[5, 5, 5]} intensity={2} />
          <Suspense fallback={null}>
            <Environment preset="city" />
            <LaptopModel />
            <StaticText />
          </Suspense>

          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
        </Canvas>
      </ErrorBoundary>
    </div>
  );
}
