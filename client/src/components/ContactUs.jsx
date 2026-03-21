import React from 'react';
import {forwardRef} from "react"
import Gmail from "../../public/images/Gmail.png";

const ContactUs =forwardRef((props, ref) =>{
  return (
    <div ref={ref} className="flex flex-col md:flex-row min-h-[600px] font-sans bg-[#effafb] text-black">
      {/* Left Panel */}
      <div className="flex-1 relative p-10 md:p-16 flex flex-col justify-start">
        {/* Background Map Placeholder - Replace URL with your actual map image */}
        <div 
          className="absolute inset-0 z-0 opacity-20 bg-cover bg-center pointer-events-none mix-blend-multiply"
          style={{ backgroundImage: `url('${Gmail}')` }}
        ></div>

        <h1 className="text-5xl md:text-7xl font-normal leading-tight z-10 mb-20">
          Let's Work<br />
          Together
        </h1>

        <div className="absolute top-[60%] left-[40%] bg-black text-white px-3 py-1 rounded-full text-sm flex items-center gap-2 z-10">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          we are here
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 p-10 md:p-20 flex flex-col justify-center z-10">
        <form onSubmit={(e) => e.preventDefault()} className="w-full max-w-md">
          
          <div className="mb-10">
            <input 
              type="text" 
              placeholder="Your Name" 
              className="w-full bg-transparent border-b border-gray-400 py-3 text-lg font-light outline-none focus:border-black placeholder-gray-600"
            />
          </div>

          <div className="mb-10">
            <input 
              type="email" 
              placeholder="Your e-Mail" 
              className="w-full bg-transparent border-b border-gray-400 py-3 text-lg font-light outline-none focus:border-black placeholder-gray-600"
            />
          </div>

          <div className="mb-10">
            <input 
              type="text" 
              placeholder="Your message to us" 
              className="w-full bg-transparent border-b border-gray-400 py-3 text-lg font-light outline-none focus:border-black placeholder-gray-600"
            />
          </div>

          <div className="flex items-center mb-10">
            <input 
              type="checkbox" 
              id="quick-reply" 
              className="w-5 h-5 accent-black mr-3 cursor-pointer" 
              defaultChecked
            />
            <label htmlFor="quick-reply" className="text-gray-700 cursor-pointer">I need a quick reply</label>
          </div>

          <button className="bg-black text-white py-4 px-8 rounded flex items-center justify-between w-full hover:scale-[1.02] transition-transform">
            <span className="text-lg text-white text-center font-light flex items-center justify-center">Request Account</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>

        </form>
      </div>
    </div>
  );
});

export default ContactUs;