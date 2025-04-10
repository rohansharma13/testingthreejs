import React, { Suspense, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, useGLTF, Text } from "@react-three/drei";
import { ErrorBoundary } from 'react-error-boundary';
import * as THREE from "three";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// 3D Model
function ProductPhotography() {
  const { scene } = useGLTF("/photography.glb");

  scene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      child.renderOrder = 1;
    }
  });

  return <primitive object={scene} scale={0.4} position={[0.5, -1.8, 0]} />;
}

// Animated 3D Text
function PhotographyText({triggerRef }) {
  const groupRef = useRef();
  const letterRefs = useRef([]);
  const originalPositions = useRef([]);

  // useFrame(({ camera }) => {
  //   if (groupRef.current) {
  //     groupRef.current.quaternion.copy(camera.quaternion);
  //     const distance = 25;
  //     const direction = camera.getWorldDirection(new THREE.Vector3());
  //     groupRef.current.position.copy(
  //       camera.position.clone().add(direction.multiplyScalar(distance))
  //     );
  //   }
  // });


  useFrame(({ camera }) => {
    if (groupRef.current) {
      groupRef.current.quaternion.copy(camera.quaternion); // rotate to face camera
    }
  });
  


  const letters = "PHOTOGRAPHY".split("");

  useEffect(() => {
    letterRefs.current.forEach((ref, i) => {
      if (ref && !originalPositions.current[i]) {
        originalPositions.current[i] = ref.position.clone();
      }
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerRef?.current,
        start: "top center",
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

  const onHover = () => {
    letterRefs.current.forEach((ref) => {
      gsap.to(ref.position, {
        x: () => ref.position.x + THREE.MathUtils.randFloatSpread(2),
        y: () => ref.position.y + THREE.MathUtils.randFloatSpread(2),
        z: () => ref.position.z + THREE.MathUtils.randFloatSpread(2),
        duration: 0.5,
      });
    });
  };

  const onLeave = () => {
    letterRefs.current.forEach((ref, i) => {
      if (originalPositions.current[i]) {
        gsap.to(ref.position, {
          x: originalPositions.current[i].x,
          y: originalPositions.current[i].y,
          z: originalPositions.current[i].z,
          duration: 0.5,
        });
      }
    });
  };

  return (
    <group
  ref={groupRef}
  position={[0.7  , -1, 3]}
>


      {letters.map((char, i) => (
        <Text
          key={i}
          ref={(el) => (letterRefs.current[i] = el)}
          fontSize={0.2}
          position={[i * 0.15 - (letters.length * 0.35) / 2, 0, 0]}
          color="white"
          anchorX="center"
          anchorY="middle"
          renderOrder={999}
          depthTest={false}
          fontWeight="bold"
          depthWrite={false}
          material-transparent
          material-opacity={1}
        >
          {char}
        </Text>
      ))}
    </group>
  );
}

// Final Component
function ProductPhotographyWithErrorBoundary() {
  const containerRef = useRef();
  return (
    <div
    ref={containerRef}
    style={{
      width: "150vw",
      height: "250vh",
      marginLeft: "-18vw",
      marginTop: "-30vw",
      overflow: "hidden",
      }}
    >
      <ErrorBoundary
        fallback={
          <div>
            <p>There was an issue loading the model. Please try again later.</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        }
      >
        <Canvas
          shadows
          camera={{ position: [0, 0, 10], fov: 25 }}
          style={{ width: "100%", height: "100%", display: "block" }}
        >
          <ambientLight intensity={2} />
          <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />
          <Suspense fallback={null}>
            {/* <Environment preset="city" /> */}
            <ProductPhotography />
            <PhotographyText />
          </Suspense>
        </Canvas>
      </ErrorBoundary>
    </div>
  );
}

export default ProductPhotographyWithErrorBoundary;
