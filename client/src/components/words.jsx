import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AOS from "aos"
import "aos/dist/aos.css"
const RotatingText = ({ words, highlightColor, bgColor, iconColor }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    AOS.init();
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2500); // Changes word every 2.5 seconds
    return () => clearInterval(timer);
  }, [words.length]);

  return (
    <div className="flex flex-col items-center justify-center font-sans font-bold text-4xl md:text-6xl text-gray-900 leading-tight tracking-tight">
      <div className="flex items-center gap-3">
        <span>Make it</span>
        
        {/* Animated Capsule */}
        <span 
          className={`relative inline-flex items-center px-6 py-2 rounded-full transition-colors duration-500`}
          style={{ backgroundColor: bgColor }}
        >
          {/* Paint Roller Icon */}
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke={iconColor} 
            strokeWidth="3" 
            className="mr-3"
          >
            <path d="M21 8V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3m16 0H5m16 0v3a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8m12 7v4a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-4" />
          </svg>

          <div className="relative h-[1.2em] w-[120px] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.span
                key={words[index]}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="absolute inset-0 flex items-center justify-start"
                style={{ color: highlightColor }}
              >
                {words[index]}
              </motion.span>
            </AnimatePresence>
          </div>
        </span>
        
        <span>and</span>
      </div>
      <div>take it with you</div>
    </div>
  );
};

export default function Words() {
  const words = ["yours", "faster", "yours", "works"];

  return (
    <div className="flex flex-col gap-20 items-center justify-center bg-white" data-aos="fade-right" duration="2000">
      
      <section className="text-center">
      
        <RotatingText 
          words={words} 
          highlightColor="#4CAF50" 
          bgColor="#e8f5e9" 
          iconColor="#4CAF50" 
        />
      </section>
      
    </div>
  );
}