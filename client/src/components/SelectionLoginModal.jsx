import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import {useEffect} from "react";


const LoginSelectionModal = ({ isOpen, isClosed, onSelect }) => {
  useEffect(()=>{
    AOS.init();
  },[])
  const navigate = useNavigate();


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-in fade-in zoom-in duration-300" data-aos="zoom-in-up" data-aos-duration="500">
        
        {/* Modal Header */}
        <div className="p-8 pb-0 flex justify-between items-start">
          <div data-aos="fade-down" data-aos-duration="1000">
            <h2 className="text-2xl font-bold text-gray-900">Get Started</h2>
            <p className="text-gray-500 mt-1">Please select your role to continue</p>
          </div>
          <button 
            onClick={isClosed}
            className="text-red-300 flex items-center justify-center h-10 w-10 cursor-pointer bg-red-100 hover:bg-[#EA4335] hover:text-gray-600 transition-colors text-2xl font-light rounded-full"
          >
            &times;
          </button>
        </div>

        {/* Modal Body / Buttons */}
        <div className="p-8 space-y-4">
          
          {/* Nurse Login Button (The Orange Gradient Style) */}
          <button
            onClick={() => navigate("/nurseLogin")}
            className="group relative w-full flex items-center justify-between px-8 py-4 
                       bg-gradient-to-r from-[#FFB700] to-[#FF8A00] 
                       hover:from-[#FFC122] hover:to-[#FF9D22]
                       text-white font-bold text-lg rounded-full shadow-lg shadow-orange-200 
                       transition-all duration-300 active:scale-95"
            data-aos="fade-right" data-aos-duration="500"
          >
            <span className="tracking-wide uppercase">Login as Nurse</span>
            <div className="bg-white/20 rounded-full p-1 group-hover:translate-x-1 transition-transform">
              <ChevronRight size={24} />
            </div>
          </button>

         
          <button
            onClick={() => navigate("/doctorLogin")}
            className="group relative w-full flex items-center justify-between px-8 py-4 
                       bg-white border-2 border-[#FF8A00] 
                       text-[#FF8A00] font-bold text-lg rounded-full 
                       hover:bg-orange-50 transition-all duration-300 active:scale-95"
            data-aos="fade-left" data-aos-duration="700"
          >
            <span className="tracking-wide uppercase">Login as Doctor</span>
            <div className="bg-[#FF8A00] text-white rounded-full p-1 group-hover:translate-x-1 transition-transform">
              <ChevronRight size={24} />
            </div>
          </button>

        </div>

        <div className="bg-gray-50 p-4 text-center">
          <p className="text-sm text-gray-400">
            Need help? Contact your administrator
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginSelectionModal;