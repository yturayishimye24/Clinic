import React from "react";
import { useNavigate } from "react-router-dom";
import LoginSelectionModal from "../components/SelectionLoginModal.jsx";
import {useState} from "react"
// import {scrollToTeam,scrollToServices,scrollToFaqs,scrollToWhyChooseUs} from "../pages/LandingPage.jsx"

const Navbar = ({scrollToTeam,scrollToServices,scrollToFaqs,goToHome,scrollToWhyUs,scrollToContactUs}) => {
  const navigate = useNavigate();
  const [selectionOpen,setSelectionOpen] = useState(false);

  return (
    <>
    <nav className="flex items-center justify-between px-6 py-4 bg-white sticky top-0 z-50 shadow-md">
      
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
        <svg
            className={`overflow-hidden transition-all`}
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.0964 20.3536L17.6262 22.4473L17.046 27.6527L8.94876 36.8282C4.2486 33.8023 0.898178 28.8615 0 23.108L13.0964 20.3536Z"
              fill="#15E3FF"
            ></path>
            <path
              d="M25.183 25.94L31.2414 36.3789C27.992 38.6605 24.0331 40 19.7612 40C18.3744 40 17.0206 39.8587 15.7133 39.59L17.046 27.6527L20.4765 23.7656L25.183 25.94Z"
              fill="#348DFC"
            ></path>
            <path
              d="M39.1022 14.881C39.5332 16.5143 39.763 18.2294 39.763 19.9982C39.763 24.1145 38.5192 27.9403 36.3874 31.1207L25.184 25.9405L22.5551 21.4123L25.8574 17.6692L39.1022 14.881Z"
              fill="#FD4873"
            ></path>
            <path
              d="M17.046 27.6524L17.0458 27.6527L17.1686 26.552L17.046 27.6524Z"
              fill="#FFC700"
            ></path>
            <path
              d="M20.132 0C26.1505 0.109415 31.5194 2.877 35.1148 7.17842L25.8561 17.6694L20.9792 18.6959L18.519 14.4574L20.132 0Z"
              fill="#FFC700"
            ></path>
            <path
              d="M18.519 14.4574L17.9745 19.3269L13.0991 20.353L0.514709 14.5347C2.09964 8.94044 6.05794 4.3436 11.2327 1.9007L18.519 14.4574Z"
              fill="#00E7B9"
            ></path>
          </svg>
        <span className="text-xl text-gray-600 font-normal">Workspace</span>
      </div>

      <div className="hidden md:flex items-center gap-8 text-gray-600 text-[15px] font-medium">
        <a  className="hover:text-black cursor-pointer" onClick={goToHome}>Home</a>
        <a className="hover:text-black cursor-pointer" onClick={scrollToTeam}>Team</a>
        <a  className="hover:text-black cursor-pointer" onClick={scrollToServices}>Services</a>
        <a className="hover:text-black cursor-pointer" onClick={scrollToFaqs}>FAqs</a>
        <a  className="hover:text-black cursor-pointer" onClick={scrollToWhyUs} >Why Choose Us</a>
      </div>

     
      <div className="flex items-center gap-4">
        <button className="hidden sm:block text-[#FB923C] font-medium cursor-pointer hover:text-[#FFF4E1] hover:bg-[#FDBA74] px-4 py-2 rounded transition-all" onClick={()=> navigate("/doctorLogin")}>
          Doctor login
        </button>
    
        <button className="hidden lg:block border border-[#FFF4E1] cursor-pointer hover:border-[#FDBA74] text-[#fb923c] font-medium px-5 py-2 rounded-md hover:bg-[#FFF4E1]" onClick={scrollToContactUs}>
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