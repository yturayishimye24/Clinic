import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginSelectionModal from "../components/SelectionLoginModal.jsx";

const Navbar = ({ scrollToTeam, scrollToFaqs, goToHome, scrollToWhyUs, scrollToContactUs }) => {
  const navigate = useNavigate();
  const [selectionOpen, setSelectionOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileNavClick = (callback) => {
    setMobileMenuOpen(false);
    if (callback) callback();
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#e0e0e0] px-6 py-3.5 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo Brand Area */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer group" 
            onClick={() => { navigate("/"); setMobileMenuOpen(false); }}
          >
            <img src="/images/LOGO.png" alt="Logo" className="w-8 h-8 object-contain transition-transform duration-300 group-hover:scale-105" />
            <span className="text-xl text-[#1f1f1f] font-medium tracking-tight">Clinic Workspace</span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-7 text-[#5f6368] text-[15px] font-medium">
            <button className="hover:text-[#1f1f1f] cursor-pointer transition-colors" onClick={goToHome}>Home</button>
            <button className="hover:text-[#1f1f1f] cursor-pointer transition-colors" onClick={scrollToTeam}>Team</button>
            <button className="hover:text-[#1f1f1f] cursor-pointer transition-colors" onClick={scrollToFaqs}>FAQs</button>
            <button className="hover:text-[#1f1f1f] cursor-pointer transition-colors" onClick={scrollToWhyUs}>Why Choose Us</button>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <button 
              className="hidden sm:inline-flex text-[#0b57d0] font-medium text-[14px] cursor-pointer hover:bg-[#e8f0fe] px-4 py-2 rounded-full transition-all duration-200" 
              onClick={() => navigate("/doctorLogin")}
            >
              Doctor login
            </button>
        
            <button 
              className="hidden lg:inline-flex border border-[#747775] cursor-pointer hover:border-[#0b57d0] text-[#5f6368] hover:text-[#0b57d0] font-medium text-[14px] px-5 py-2 rounded-full hover:bg-[#e8f0fe] transition-all duration-200" 
              onClick={scrollToContactUs}
            >
              Contact us
            </button>

            <button 
              onClick={() => setSelectionOpen(true)}
              className="bg-[#fb923c] text-white font-medium text-[14px] px-5 py-2.5 rounded-full cursor-pointer hover:bg-[#fdba74] shadow-sm hover:shadow transition-all duration-200"
            >
              Get started
            </button>

            {/* Mobile Menu Hamburger Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex md:hidden flex-col gap-1.5 justify-center items-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors z-50 cursor-pointer"
              aria-label="Toggle Menu"
            >
              <span className={`w-5 h-0.5 bg-[#5f6368] transition-transform duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`w-5 h-0.5 bg-[#5f6368] transition-opacity duration-200 ${mobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`w-5 h-0.5 bg-[#5f6368] transition-transform duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>

        </div>

        {/* Sliding Mobile Navigation Menu Panel */}
        <div 
          className={`absolute inset-x-0 top-full bg-white border-b border-[#e0e0e0] shadow-lg transition-all duration-300 ease-in-out md:hidden overflow-hidden ${
            mobileMenuOpen ? "max-h-[340px] opacity-100 py-4" : "max-h-0 opacity-0 py-0 pointer-events-none"
          }`}
        >
          <div className="flex flex-col px-6 gap-4 text-[#5f6368] font-medium text-[16px]">
            <button className="text-left py-2 hover:text-black transition-colors" onClick={() => handleMobileNavClick(goToHome)}>Home</button>
            <button className="text-left py-2 hover:text-black transition-colors" onClick={() => handleMobileNavClick(scrollToTeam)}>Team</button>
            <button className="text-left py-2 hover:text-black transition-colors" onClick={() => handleMobileNavClick(scrollToFaqs)}>FAQs</button>
            <button className="text-left py-2 hover:text-black transition-colors" onClick={() => handleMobileNavClick(scrollToWhyUs)}>Why Choose Us</button>
            <button className="text-left py-2 hover:text-black transition-colors lg:hidden" onClick={() => handleMobileNavClick(scrollToContactUs)}>Contact us</button>
            <button className="text-left py-2 text-[#0b57d0] font-semibold sm:hidden" onClick={() => handleMobileNavClick(() => navigate("/doctorLogin"))}>Doctor login</button>
          </div>
        </div>
      </nav>

      <LoginSelectionModal isOpen={selectionOpen} isClosed={() => setSelectionOpen(false)} />
    </>
  );
};

export default Navbar;