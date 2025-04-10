import { useEffect, useRef } from "react";
import "./App.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroModel from "./HeroModel";
import { ErrorBoundary } from "react-error-boundary";
import ProductPhotographyWithErrorBoundary from "./ProductPhotography";
import PreHeroModel from "./PreHeroModel"; // 👈 Add this import

gsap.registerPlugin(ScrollTrigger);

function App() {
  const heroRef = useRef(null);
  const imageRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    if (textRef.current && heroRef.current) {
      // Text animation on scroll
      const textAnimation = gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: "power4.out",
        }
      );

      // Scroll-triggered text animation
      const scrollTriggerText = gsap.to(textRef.current, {
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
        opacity: 0,
        y: -50,
        ease: "power1.out",
      });

      // Cleanup GSAP and ScrollTrigger
      return () => {
        textAnimation.kill();
        scrollTriggerText.kill();
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill()); // Cleanup ScrollTriggers
      };
    }

    if (imageRef.current) {
      // Image animation on scroll
      const imageAnimation = gsap.fromTo(
        imageRef.current,
        { opacity: 0, y: 100, scale: 1.1 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.5,
          ease: "power4.out",
          scrollTrigger: {
            trigger: imageRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      // Cleanup GSAP and ScrollTrigger
      return () => {
        imageAnimation.kill();
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill()); // Cleanup ScrollTriggers
      };
    }
  }, []);

  return (
    <main className="overflow-x-hidden overflow-y-hidden text-white font-sans">


<section className="h-screen bg-black flex items-center justify-center relative">
    <div className="w-full h-full">
      <PreHeroModel />
    </div>
  </section>


      {/* Hero Section */}
      <section
        ref={heroRef}
        id="hero"
        className="h-screen bg-black flex items-center justify-center relative"
      >
        <div className="w-full h-full">
          <HeroModel />
        </div>
      </section>

      {/* Product Photography Section */}
      <section className="h-screen bg-black flex items-center justify-center relative">
        <div className="w-full h-full">
          <ProductPhotographyWithErrorBoundary />
        </div>
      </section>

      {/* Scroll Section 3 */}
      <section className="h-screen bg-blue-700 text-white flex items-center justify-center text-4xl">
        Scroll Section 3
      </section>
      <section className="h-screen bg-blue-700 text-white flex items-center justify-center text-4xl">
        Scroll Section 3
      </section>

      <section className="h-screen bg-blue-700 text-white flex items-center justify-center text-4xl">
        Scroll Section 3
      </section>
      <section className="h-screen bg-blue-700 text-white flex items-center justify-center text-4xl">
        Scroll Section 3
      </section>
      <section className="h-screen bg-blue-700 text-white flex items-center justify-center text-4xl">
        Scroll Section 3
      </section>
    </main>
  );
}

export default App;
