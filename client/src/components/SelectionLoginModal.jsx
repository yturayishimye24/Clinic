import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, User, Stethoscope, X } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import NurseLogin from "../../public/images/NurseLogin.png"
import DoctorLogin from "../../public/images/DoctorLogin.png"

const LoginSelectionModal = ({ isOpen, isClosed }) => {
  useEffect(() => {
    AOS.init();
  }, []);

  const navigate = useNavigate();

  if (!isOpen) return null;

  const roles = [
    {
      title: "Login as Nurse",
      description: "Access patient care and ward management",
      path: "/nurseLogin",
      icon: <img src={NurseLogin}/>,
      aos: "fade-up",
    },
    {
      title: "Login as Doctor",
      description: "Manage diagnoses, prescriptions, and rounds",
      path: "/doctorLogin",
      icon: <img src={DoctorLogin}/>,
      aos: "fade-up",
    },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4">
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all border border-slate-100"
        data-aos="zoom-in" 
        data-aos-duration="400"
      >
        {/* Modal Header */}
        <div className="p-6 flex justify-between items-center border-b border-slate-50">
          <div>
            <h2 className="text-xl font-semibold text-slate-800 tracking-tight">System Login</h2>
            <p className="text-sm text-slate-500 mt-0.5">Select your department to continue</p>
           
          </div>
          <button 
            onClick={isClosed}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 flex flex-col gap-4 items-center">
          {roles.map((role, index) => (
            <button
              key={index}
              onClick={() => navigate(role.path)}
              data-aos={role.aos}
              data-aos-delay={index * 100}
              className="group w-full flex items-center p-4 text-left border border-slate-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50/30 transition-all duration-200 active:scale-[0.98]"
            >
              <div className="h-12 w-12 flex items-center justify-center bg-slate-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
                {role.icon}
              </div>
              
              <div className="ml-4 flex-1">
                <h3 className="font-medium text-slate-900 leading-tight group-hover:text-indigo-700  transition-colors">
                  {role.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">{role.description}</p>
              </div>

              <ChevronRight 
                size={18} 
                className="text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" 
              />
            </button>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50/80 p-4 border-t border-slate-100">
          <p className="text-xs text-center text-slate-400">
            Internal Security System • <span className="cursor-pointer hover:underline">Help Desk</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginSelectionModal;