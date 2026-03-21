import React from "react";
import { useNavigate } from "react-router-dom";
import LoginSelectionModal from "../components/SelectionLoginModal.jsx";
import {useState} from "react"
// import {scrollToTeam,scrollToServices,scrollToFaqs,scrollToWhyChooseUs} from "../pages/LandingPage.jsx"

const Navbar = () => {
  const navigate = useNavigate();
  const [selectionOpen,setSelectionOpen] = useState(false);

  return (
    <>
    <nav className="flex items-center justify-between px-6 py-4 bg-white sticky top-0 z-50 shadow-md">
      
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
        <img 
          src="/images/GoogleSimilar.jpg" // Replace with your logo path
          alt="Google Workspace" 
          className="h-7 w-auto"
        />
        <span className="text-xl text-gray-600 font-normal">Workspace</span>
      </div>

      <div className="hidden md:flex items-center gap-8 text-gray-600 text-[15px] font-medium">
        <a  className="hover:text-black cursor-pointer">Home</a>
        <a className="hover:text-black cursor-pointer" >Team</a>
        <a  className="hover:text-black cursor-pointer" >Services</a>
        <a className="hover:text-black cursor-pointer" >FAqs</a>
        <a  className="hover:text-black cursor-pointer" >Why Choose Us</a>
      </div>

     
      <div className="flex items-center gap-4">
        <button className="hidden sm:block text-[#FB923C] font-medium cursor-pointer hover:text-[#FFF4E1] hover:bg-[#FDBA74] px-4 py-2 rounded transition-all" onClick={()=> navigate("/doctorLogin")}>
          Doctor login
        </button>
    
        <button className="hidden lg:block border border-[#FFF4E1] cursor-pointer hover:border-[#FDBA74] text-[#fb923c] font-medium px-5 py-2 rounded-md hover:bg-[#FFF4E1]">
          Contact us
        </button>
        <button 
          onClick={()=>setSelectionOpen(true)}
          className="bg-[#fb923c] text-[#FFF4E1] font-medium px-6 py-2.5 rounded-md cursor-pointer hover:bg-[#fdba74] transition-colors"
        >
          Get started
        </button>
      </div>
    </nav>
    <LoginSelectionModal isOpen={selectionOpen} isClosed={()=> setSelectionOpen(false)}/>
    </>
  );
};

export default Navbar;