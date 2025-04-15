import { useEffect, useRef } from "react";
import "./App.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroModel from "./HeroModel";
import { ErrorBoundary } from "react-error-boundary";
import ProductPhotographyWithErrorBoundary from "./ProductPhotography";
import PreHeroModel from "./PreHeroModel"; // 👈 Add this import
import Lenis from "@studio-freight/lenis";

gsap.registerPlugin(ScrollTrigger);

function App() {
  const heroRef = useRef(null);
  const imageRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      smooth: true,
      smoothTouch: true,
    });

    function raf(time) {
      lenis.raf(time);
      ScrollTrigger.update();
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  useEffect(() => {
    const sections = gsap.utils.toArray("section");

    sections.forEach((section, index) => {
      if (index !== sections.length - 1) {
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom top",
          pin: true,
          scrub: true,
          pinSpacing: false, // This ensures overlapping effect
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <main className=" text-white font-sans">
      <section className="pre-hero h-screen  bg-black flex items-center justify-center relative">
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
      <section className="h-screen bg-black flex items-center justify-center relative">
        Scroll Section 
      </section>
      <section className="h-screen bg-black flex items-center justify-center relative">
        Scroll Section
      </section>

      <section className="h-screen bg-black flex items-center justify-center relative">
        Scroll Section 
      </section>
      <section className="h-screen bg-black flex items-center justify-center relative">
        Scroll Section 
      </section>
      <section className="h-screen bg-blue-700 text-white flex items-center justify-center text-4xl">
        Scroll Section 
      </section>
    </main>
  );
}

export default App;
