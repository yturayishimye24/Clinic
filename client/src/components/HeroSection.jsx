import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Asset Imports
import LandingVid from "../../public/images/LandingVid.mp4";
import HeroVideo from "../../public/images/HeroVideo.mp4";
import HelloVideo from "../../public/images/HelloVideo.mp4";

// Component Imports
import LoginSelectionModal from "../components/SelectionLoginModal.jsx";
import Button from "../components/HelloButton.jsx";

// Animation Imports
import AOS from "aos";
import "aos/dist/aos.css";

const HeroSection = () => {
  const navigate = useNavigate();
  const [selectionOpen, setSelectionOpen] = useState(false);

  useEffect(() => {
    AOS.init({
      once: true, // Animations happen only once while scrolling down
    });
  }, []);

  return (
    <>
      <div className="relative w-full min-h-screen bg-[#f8fafc] overflow-hidden flex flex-col justify-center animate-scroll-appear">
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, #e2e8f0 1px, transparent 1px),
              linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
            `,
            backgroundSize: "20px 30px",
            WebkitMaskImage:
              "radial-gradient(ellipse 100% 80% at 50% 0%, #000 70%, transparent 100%)",
            maskImage:
              "radial-gradient(ellipse 100% 80% at 50% 0%, #000 70%, transparent 100%)",
          }}
        />

        {/* CONTENT LAYER 
          - relative z-10: stays on top of the background
          - Removed 'absolute': allows the section to take up actual space in the document flow
        */}
        <section className="relative z-10 max-w-7xl mx-auto px-6 pt-40 pb-32 flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Content */}
          <div
            className="flex-1 text-center lg:text-left"
            data-aos="fade-right"
            data-aos-duration="1000"
          >
            <h1 className="text-5xl md:text-7xl font-poppins text-gray-900 font-bold leading-[1.1] mb-8">
              The better <br /> way to work
            </h1>
            <p className="text-xl font-poppins text-gray-600 max-w-xl mb-10 leading-relaxed mx-auto lg:mx-0">
              Clinic management system that streamlines patient care, enhances
              communication, and optimizes clinic operations for healthcare
              professionals.
            </p>

            <Button onClick={() => setSelectionOpen(true)}>Get started</Button>
          </div>

          {/* Right Content: Video + Floating UI Elements */}
          <div
            className="flex-1 relative w-full max-w-2xl flex justify-center lg:justify-end"
            data-aos="zoom-in-left"
            data-aos-duration="1500"
          >
            <div className="relative">
              {/* Main Video */}
              <video
                src={LandingVid}
                autoPlay
                loop
                muted
                preload="metadata"
                className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] object-cover rounded-full shadow-2xl border-8 border-white"
              />

              {/* Top Floating Video - Positioned relative to Main Video */}
              <video
                src={HeroVideo}
                autoPlay
                loop
                muted
                preload="metadata"
                className="absolute -top-12 -right-8 w-[140px] h-[140px] md:w-[200px] md:h-[200px] object-cover rounded-full border-4 border-white shadow-xl"
              />

              {/* Bottom Floating Video - Positioned relative to Main Video */}
              <video
                src={HelloVideo}
                autoPlay
                loop
                muted
                preload="metadata"
                className="absolute -bottom-10 -left-4 md:-left-10 w-[120px] h-[120px] md:w-[180px] md:h-[180px] object-cover rounded-full border-4 border-white shadow-xl"
              />
            </div>
          </div>
        </section>
      </div>

      <LoginSelectionModal
        isOpen={selectionOpen}
        isClosed={() => setSelectionOpen(false)}
      />
    </>
  );
};

export default HeroSection;
