import React from "react";
import { useNavigate } from "react-router-dom";
import LandingVid from "../../public/images/LandingVid.mp4";
import {useState} from "react"
import LoginSelectionModal from "../components/SelectionLoginModal.jsx";
import AOS from "aos";
import "aos/dist/aos.css";
import {useEffect} from "react"

const HeroSection = () => {
  const navigate = useNavigate();
  const [selectionOpen,setSelectionOpen] = useState(false);
   useEffect(()=>{
         AOS.init();
   },[])
  return (
    <>
    <section className="relative max-w-7xl mx-auto px-6 pt-40 pb-32 flex flex-col lg:flex-row items-center justify-between gap-12">
      {/* Left Content */}
      <div className="flex-1 text-center lg:text-left" data-aos="fade-right" data-aos-duration="1000">
        <h1 className="text-5xl md:text-7xl font-poppins text-gray-900 leading-[1.1] mb-8">
          The better <br /> way to work
        </h1>
        <p className="text-xl font-poppins text-gray-600 max-w-xl mb-10 leading-relaxed">
          Clinic management system that streamlines patient care, enhances communication, and optimizes clinic operations for healthcare professionals.
        </p>
        
        <button
    onClick={()=>setSelectionOpen(true)}
          className="bg-[#FDBA74] text-[#FFF4E1] text-lg font-medium px-10 py-4 rounded-md hover:bg-[#FB923C] hover:shadow-lg transition-all"
        >
          Get started
        </button>
      </div>

      {/* Right Content: Video + Floating UI Elements */}
      <div className="flex-1 relative w-full max-w-2xl" data-aos="zoom-in-left" data-aos-duration="1500">
        <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-gray-100">
           <video
            src={LandingVid}
            autoPlay
            loop
            muted
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
    </section>

    <LoginSelectionModal isOpen={selectionOpen} isClosed={()=>setSelectionOpen(false)} />
    </>
  );
};

export default HeroSection;