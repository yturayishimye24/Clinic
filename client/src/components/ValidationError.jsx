import React from 'react';
import aos from "aos"
import "aos/dist/aos.css"
import {useEffect} from "react";

const ValidationError = ({ isVisible, message = "Please fill out this field." }) => {
  useEffect(()=>{
    aos.init();
  },[])
  if (!isVisible) return null;

  return (
    <div className="absolute -top-[-80px] left-4 z-50" data-aos="zoom-in-out" data-aos-duration="1000">
      <div className="relative bg-[#b91c1c] text-white text-[13px] px-3 py-1.5 rounded-[4px] shadow-md border border-red-800/20 whitespace-nowrap">
        {message}
        <div 
          className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#b91c1c] rotate-45 border-l border-t border-red-800/20"
          style={{ clipPath: 'polygon(0% 0%, 100% 0%, 0% 100%)' }}
        ></div>
      </div>
    </div>
  );
};

export default ValidationError;