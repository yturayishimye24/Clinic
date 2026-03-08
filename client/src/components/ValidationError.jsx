import React from 'react';

const ValidationError = ({ isVisible, message = "Please fill out this field." }) => {
  if (!isVisible) return null;

  return (
    <div className="absolute -top-10 left-4 z-50 animate-in fade-in zoom-in duration-200">
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