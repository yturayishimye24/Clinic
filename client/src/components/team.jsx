import React, { useState } from "react";
// Images imports
import BrownCench from "../../public/images/BrownCench.jpeg";
import Cench from "../../public/images/Cench.jpeg";
import BlueCench from "../../public/images/BlueCench.png";
// Library imports
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";

// 1. Unified structure using 'quote' across all members
const TEAM_MEMBERS = [
  {
    id: 1,
    name: "John Doe",
    role: "Consultant, Clinic Operations",
    quote: "I am in charge of consultation at clinic. I take care of all patients who visit our practice. I decide whether they need further treatment. As a result, I play a crucial role in ensuring that each patient receives the best possible care.",
    image: BrownCench,
  },
  {
    id: 2,
    name: "Jane Smith",
    role: "Head Nurse",
    quote: "As the head nurse, I oversee the nursing staff and ensure that patient care is delivered efficiently and compassionately. I coordinate with doctors and other healthcare professionals to create a supportive environment for both patients and staff.",
    image: BlueCench,
  },
  {
    id: 3,
    name: "Marcus Vance",
    role: "Chief Nursing Officer",
    quote: "Our operational strategy focuses heavily on optimizing clinic communication channels. By coordinating seamlessly between care staff and management, we elevate patient outcomes significantly.",
    image: Cench,
  }
];

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 150 : -150,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: "easeInOut" },
  },
  exit: (direction) => ({
    x: direction < 0 ? 150 : -150,
    opacity: 0,
    transition: { duration: 0.3, ease: "easeInOut" },
  }),
};

function Team2() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // 2. FIXED: Moved inside the component function so it can read currentIndex state
  const currentMember = TEAM_MEMBERS[currentIndex];

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % TEAM_MEMBERS.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + TEAM_MEMBERS.length) % TEAM_MEMBERS.length,
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-12 md:py-20">
      <div className="relative w-full max-w-5xl mx-auto px-16 py-12 select-none">
        
        {/* Main Container Wrapper */}
        <div className="bg-[#f8f9fa] rounded-[32px] border border-gray-100 shadow-sm min-h-[480px] md:min-h-[380px] flex items-center overflow-hidden relative">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentMember.id} // Re-renders and fires slide animation when ID changes
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full p-8 md:p-16 flex flex-col md:flex-row items-center gap-8 md:gap-16"
            >
              {/* Left Column: Avatar Layout */}
              <div className="flex-shrink-0 w-[180px] h-[180px] md:w-[260px] md:h-[260px]">
                <div className="w-full h-full rounded-full overflow-hidden border border-gray-200/60 shadow-inner">
                  <img
                    src={currentMember.image}
                    alt={currentMember.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Right Column: Dynamic Typography Grid */}
              <div className="flex-1 text-center md:text-left flex flex-col justify-center">
                <span className="text-5xl md:text-6xl font-serif text-gray-300 block mb-2 leading-none md:-ml-2">
                  “
                </span>

                <p className="text-lg md:text-xl font-light text-gray-700 leading-relaxed -mt-4 mb-6">
                  {currentMember.quote}
                </p>

                <div className="border-t border-gray-200/60 pt-4 inline-block">
                  <p className="text-base font-semibold text-gray-900">
                    {currentMember.name}
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5 font-medium tracking-wide">
                    {currentMember.role}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Absolutely Positioned Navigation Buttons */}
        {/* Left Chevron Button */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white border border-gray-200 hover:border-gray-400 text-gray-600 p-3 rounded-full shadow-sm transition-all hover:shadow-md active:scale-95 z-20"
          aria-label="Previous Team Member"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Right Chevron Button */}
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white border border-gray-200 hover:border-gray-400 text-gray-600 p-3 rounded-full shadow-sm transition-all hover:shadow-md active:scale-95 z-20"
          aria-label="Next Team Member"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}

export default Team2;