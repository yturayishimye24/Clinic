import React from 'react';
import { ArrowRight, RefreshCw } from 'lucide-react'; // Example icons
import aos from "aos"
import "aos/dist/aos.css"
import { useEffect } from 'react';

const ServicesSection = ({ services, monGradient, servicesRef }) => {
    useEffect(() =>{
        aos.init();
    })
  return (
    <div
      ref={servicesRef}
      className="px-4 sm:px-6 bg-white overflow-hidden"
      style={{
        backgroundImage: `url(${monGradient})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Header Section */}
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight mb-6 flex flex-wrap items-center justify-center gap-4">
          Discover the latest 
          <span className="inline-flex items-center gap-2 px-6 py-2 bg-blue-50 text-blue-600 rounded-full border border-blue-100">
            <RefreshCw size={32} className="animate-spin-slow" />
            updates
          </span>
          from Clinic
        </h2>
      </div>

      {/* Cards Container */}
      <div className="max-w-7xl mx-auto">
        <div className="flex overflow-x-auto gap-8 pb-12 pt-4 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden" data-aos="fade-up" data-aos-anchor-placement="bottom-bottom">
          {services.map((service, index) => (
            <div
              key={index}
              className={`
                snap-center flex-shrink-0 
                /* High Height (min-h-[550px]) to match the long vertical look */
                w-[75vw] sm:w-[450px] min-h-[550px] 
                rounded-[2.5rem] p-10 
                flex flex-col justify-between 
                transition-all duration-500 hover:shadow-xl hover:-translate-y-2
                group relative overflow-hidden
              `}
              style={{
                /* Use pastel colors: Light blue, light yellow, light green */
                backgroundColor: service.bgColor || '#F1F5FE', 
              }}
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-8 block">
                  {service.category || 'Service'}
                </span>
                
                <h3 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                  {service.name}
                </h3>
                
                <p className="text-lg text-gray-600 leading-relaxed max-w-[280px]">
                  {service.description || `Simplify and manage ${service.name.toLowerCase()} efficiently in one location.`}
                </p>
              </div>

              {/* Bottom Icon/Action Area */}
              <div className="flex items-end justify-between">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <service.icon size={28} className="text-gray-800" />
                </div>
                
                <button className="flex items-center gap-2 text-gray-900 font-bold hover:gap-4 transition-all">
                  Learn more <ArrowRight size={20} />
                </button>
              </div>
              
              {/* Optional: Add a subtle decorative background image like the screenshot */}
              {service.backgroundImageServiceCards && (
                <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
                   <img src={service.backgroundImageServiceCards} alt="" className="w-40" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;