import React, { useRef, useState, useEffect } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import {
  Spinner,
  Button,
  Card,
  Checkbox,
  Label,
  TextInput,
} from "flowbite-react";
import {useAuth} from "../../context/authContext.jsx";

import {
  Activity,
  Phone,
  ArrowRight,
  Check,
  X,
  TrendingUp,
  Users,
  FileText,
  Trash2,
  BarChart3,
  Package,
} from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import techImage from "../../public/images/techImage.png";

import FAQ from "../components/Faqs.jsx";
import TEAM from "../components/teamSection.jsx";
import drake from "../../public/images/asyvlogo.png";
import ContactUs from "../components/ContactUs.jsx";
import monGradient from "../../public/images/MonGradient.jpg";
import monGreen from "../../public/images/MonGreen.jpg";
import monLightGreen from "../../public/images/MonLightGreen.jpg";
import monLightOrange from "../../public/images/MonLightOrange.jpg";
import monOrange from "../../public/images/MonOrange.jpg";
import monPink from "../../public/images/MonPink.jpg";
import monLightPurple from "../../public/images/MonLightPurple.jpg";
import LoginBg from "../../public/images/LoginBg.jpg";
import GoogleSimilar from "../../public/images/GoogleSimilar.jpg";
import LandingVid from "../../public/images/LandingVid.mp4";
import Loading from "../components/Loading.jsx";
import Navbar from '../components/landingPageNavbar.jsx'
import HeroSection from "../components/HeroSection.jsx";
import LoginSelectionModal  from "../components/SelectionLoginModal.jsx"


import {OrbitProgress} from "react-loading-indicators"

import {
  Footer,
  FooterBrand,
  FooterCopyright,
  FooterDivider,
  FooterLink,
  FooterLinkGroup,
} from "flowbite-react";
import AOS from "aos"
import "aos/dist/aos.css"

// import { useFirebase } from "../ContextFireBase/contextFire.jsx";

const LandingPage = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [toggleBg, setToggleBg] = useState(false);
  
  //Selecting to login as nurse or as doctor
  const [selectionOpen,setSelectionOpen] = useState(false);
  const [loadingSelection,setLoadingSelection] = useState(false);

  const teamRef = useRef(null);
  const faqRef = useRef(null);
  const HomeRef = useRef(null);
  const servicesRef = useRef(null);
  const whyChooseUsRef = useRef(null);
  const contactUsRef = useRef(null);

  const handleToggleBg = () => {
    setToggleBg(!toggleBg);
  };
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const goToHome = () =>
    HomeRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToFaqs = () =>
    faqRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToTeam = () =>
    teamRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToServices = () =>
    servicesRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToWhyUs = () => {
    whyChooseUsRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToContactUs = () => {
    contactUsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  
  useEffect(() => {
    const sections = [
      { ref: HomeRef, name: "home" },
      { ref: servicesRef, name: "services" },
      { ref: teamRef, name: "team" },
      { ref: contactUsRef, name: "contact" },
    ];
  }),[]
  
  const openLoginModal = () => setShowLoginModal(true);
  const closeLoginModal = () => {
    setShowLoginModal(false);
    setEmail("");
    setPassword("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTimeout(() => {
      setLoading(true);
    }, 2000);

    try {
      if (!email.trim() || !password.trim()) {
        toast.error("Please fill all fields.");
        setLoading(false);
        return;
      }
      const response = await axios.post(`${backendUrl}/api/accounts/login`, {
        email,
        password,
      });

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("name", response.data.username);
        localStorage.setItem("email", response.data.email);
        localStorage.setItem("role", response.data.role);
        const userData = {
          username: response.data.username,
          token: response.data.token,
          role: response.data.role,
        };

        login(userData);

        if (response.data.role === "nurse") {
          setTimeout(() => navigate("/home"), 1000);
          toast.success("Logged in as nurse successfully!");
        } else {
          setTimeout(() => navigate("/home/admin"), 1000);
          toast.success("Logged as Admin successfully!");
        }
      } else {
        toast.error("Incorrect password or email!");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && showLoginModal) {
        closeLoginModal();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [showLoginModal]);

  const services = [
    {
      name: "Recording patients",
      icon: Users,
      backgroundImageServiceCards: `url(${monGreen})`,
    },
    {
      name: "Requesting medicines from Lab",
      icon: Package,
      backgroundImageServiceCards: `url(${monLightGreen})`,
    },
    {
      name: "Updating patient's infos",
      icon: FileText,
      backgroundImageServiceCards: `url(${monLightOrange})`,
    },
    {
      name: "Deleting patient records",
      icon: Trash2,
      backgroundImageServiceCards: `url(${monLightPurple})`,
    },
    {
      name: "Reporting",
      icon: BarChart3,
      backgroundImageServiceCards: `url(${monOrange})`,
    },
    {
      name: "Statistics",
      icon: TrendingUp,
      backgroundImageServiceCards: `url(${monPink})`,
    },
  ];
  
  
  {loadingSelection &&(
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-white/80 backdrop-blur-md">
      <OrbitProgress variant="track-disc" speedPlus="1" dense color={["#FBBC05","#FFBB00","#EA4335","#F65314","#34A853","#7CBB00","#4286F4","#00A1F1"]} easing="ease-in-out" size={60} />
      <p className="mt-4 text-orange-600 font-semibld animate-pulse">
        Loading login page...
      </p>
    </div>
  )}
 
  return (
    <div className="font-sans min-h-screen bg-white">
      <header className="absolute mb-20 top-0 left-0 w-full z-50 ">
       <Navbar onGetStarted={()=>setSelectionOpen(true)}/>
      </header>

      <main className="min-h-screen">

        <HeroSection onGetStarted={()=>setSelectionOpen(true)}/>
        <LoginSelectionModal isOpen={selectionOpen} isClosed={()=>setSelectionOpen(false)}/>
        <div
          className="bg-fixed bg-cover bg-center w-full h-64 sm:h-80 md:h-96 lg:h-[500px] relative shadow-inner flex items-center justify-center"
          style={{ backgroundImage: `url(${techImage})` }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="text-center text-white px-4 relative z-10">
            <h2 className="text-6xl sm:text-3xl md:text-5xl font-poppins mb-2 sm:mb-4">
              Modern Healthcare Technology
            </h2>
            <p className="text-3xl sm:text-lg md:text-xl opacity-90">
              Built for efficiency, designed for care
            </p>
          </div>
        </div>

        <div
          ref={whyChooseUsRef}
          className="py-16 sm:py-24 px-4 sm:px-6 bg-white overflow-hidden"
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div>
              <h2 className="text-6xl text-black font-poppins tracking-tight mb-4 ml-[450px]">
                Why Choose Us
              </h2>
            </div>
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="flex overflow-x-auto gap-6 pb-12 pt-4 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {/* Card 1 - Added 3d Transform / Scale Scroll Animation */}
              <div className="animate-on-scroll opacity-0 [transform:translate3d(-200px,0,0)_scale(0.6)] transition-all duration-[600ms] delay-[300ms] [&.is-visible]:opacity-100 [&.is-visible]:[transform:translate3d(0,0,0)_scale(1)] bg-white rounded-[2rem] p-8 border border-gray-200/60 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 flex flex-col justify-between min-h-[320px] w-[85vw] sm:w-[400px] flex-shrink-0 snap-center group">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-blue-50/50 flex items-center justify-center mb-8 group-hover:bg-blue-50 transition-colors">
                    <Activity className="text-blue-600" size={26} />
                  </div>
                  <h3 className="text-2xl font-medium text-gray-900 mb-3">
                    Expert Team
                  </h3>
                  <p className="text-base text-gray-600 leading-relaxed">
                    Our experienced professionals ensure top-quality care and
                    seamless operational efficiency for every single patient.
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-8 text-blue-600 font-medium cursor-pointer w-max group/btn">
                  <span onClick={() => setShowLoginModal(true)}>
                    <button className="relative flex items-center px-6 py-3 overflow-hidden font-medium transition-all bg-indigo-500 rounded-md group">
                      <span className="absolute top-0 right-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out bg-indigo-700 rounded group-hover:-mr-4 group-hover:-mt-4">
                        <span className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-white"></span>
                      </span>
                      <span className="absolute bottom-0 rotate-180 left-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out bg-indigo-700 rounded group-hover:-ml-4 group-hover:-mb-4">
                        <span className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-white"></span>
                      </span>
                      <span className="absolute bottom-0 left-0 w-full h-full transition-all duration-500 ease-in-out delay-200 -translate-x-full bg-indigo-600 rounded-md group-hover:translate-x-0"></span>
                      <span className="relative w-full text-left text-white transition-colors duration-200 ease-in-out group-hover:text-white">
                        Learn more
                      </span>
                    </button>
                  </span>
                  <ArrowRight
                    size={18}
                    className="transform group-hover/btn:translate-x-1 transition-transform"
                  />
                </div>
              </div>

              {/* Card 2 - Added 3d Transform / Scale Scroll Animation */}
              <div className="animate-on-scroll opacity-0 [transform:translate3d(-200px,0,0)_scale(0.6)] transition-all duration-[600ms] delay-[300ms] [&.is-visible]:opacity-100 [&.is-visible]:[transform:translate3d(0,0,0)_scale(1)] bg-white rounded-[2rem] p-8 border border-gray-200/60 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 flex flex-col justify-between min-h-[320px] w-[85vw] sm:w-[400px] flex-shrink-0 snap-center group">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50/50 flex items-center justify-center mb-8 group-hover:bg-emerald-50 transition-colors">
                    <Check className="text-emerald-600" size={26} />
                  </div>
                  <h3 className="text-2xl font-medium text-gray-900 mb-3">
                    Reliable Services
                  </h3>
                  <p className="text-base text-gray-600 leading-relaxed">
                    Dependable healthcare software solutions you can trust every
                    day, backed by enterprise-grade stability.
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-8 text-emerald-600 font-medium cursor-pointer w-max group/btn">
                  <span onClick={() => setShowLoginModal(true)}>
                    <button className="relative flex items-center px-6 py-3 overflow-hidden font-medium transition-all bg-indigo-500 rounded-md group">
                      <span className="absolute top-0 right-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out bg-indigo-700 rounded group-hover:-mr-4 group-hover:-mt-4">
                        <span className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-white"></span>
                      </span>
                      <span className="absolute bottom-0 rotate-180 left-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out bg-indigo-700 rounded group-hover:-ml-4 group-hover:-mb-4">
                        <span className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-white"></span>
                      </span>
                      <span className="absolute bottom-0 left-0 w-full h-full transition-all duration-500 ease-in-out delay-200 -translate-x-full bg-indigo-600 rounded-md group-hover:translate-x-0"></span>
                      <span className="relative w-full text-left text-white transition-colors duration-200 ease-in-out group-hover:text-white">
                        Learn more
                      </span>
                    </button>
                  </span>
                  <ArrowRight
                    size={18}
                    className="transform group-hover/btn:translate-x-1 transition-transform"
                  />
                </div>
              </div>

              {/* Card 3 - Added 3d Transform / Scale Scroll Animation */}
              <div className="animate-on-scroll opacity-0 [transform:translate3d(-200px,0,0)_scale(0.6)] transition-all duration-[600ms] delay-[300ms] [&.is-visible]:opacity-100 [&.is-visible]:[transform:translate3d(0,0,0)_scale(1)] bg-white rounded-[2rem] p-8 border border-gray-200/60 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 flex flex-col justify-between min-h-[320px] w-[85vw] sm:w-[400px] flex-shrink-0 snap-center group">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-purple-50/50 flex items-center justify-center mb-8 group-hover:bg-purple-50 transition-colors">
                    <Phone className="text-purple-600" size={26} />
                  </div>
                  <h3 className="text-2xl font-medium text-gray-900 mb-3">
                    24/7 Support
                  </h3>
                  <p className="text-base text-gray-600 leading-relaxed">
                    Round-the-clock technical assistance and medical triage
                    support for all your operational needs.
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-8 text-purple-600 font-medium cursor-pointer w-max group/btn">
                  <span onClick={() => setShowLoginModal(true)}>
                    <button className="relative flex items-center px-6 py-3 overflow-hidden font-medium transition-all bg-indigo-500 rounded-md group">
                      <span className="absolute top-0 right-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out bg-indigo-700 rounded group-hover:-mr-4 group-hover:-mt-4">
                        <span className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-white"></span>
                      </span>
                      <span className="absolute bottom-0 rotate-180 left-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out bg-indigo-700 rounded group-hover:-ml-4 group-hover:-mb-4">
                        <span className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-white"></span>
                      </span>
                      <span className="absolute bottom-0 left-0 w-full h-full transition-all duration-500 ease-in-out delay-200 -translate-x-full bg-indigo-600 rounded-md group-hover:translate-x-0"></span>
                      <span className="relative w-full text-left text-white transition-colors duration-200 ease-in-out group-hover:text-white">
                        Learn more
                      </span>
                    </button>
                  </span>
                  <ArrowRight
                    size={18}
                    className="transform group-hover/btn:translate-x-1 transition-transform"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Our Services Section */}
     
        <div
          ref={servicesRef}
          className="py-16 sm:py-24 px-4 sm:px-6 bg-gray-50/50 overflow-hidden"
          style={{
            backgroundImage: `url(${monGradient})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl sm:text-5xl font-medium text-gray-900 tracking-tight mb-4">
                Explore our services
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Everything you need to manage your clinic efficiently in one
                centralized, secure location.
              </p>
            </div>
            <button className="hidden sm:block border-2 border-gray-200 text-gray-900 px-6 py-3 rounded-full font-medium hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300">
              Explore all services
            </button>
          </div>

          <div className="w-full">
            <div className="flex overflow-x-auto gap-6 pb-12 pt-4 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {services.map((service, index) => (
                <div
                  key={index}
                  // Added 3d Transform / Scale Scroll Animation
                  className="animate-on-scroll opacity-0 [transform:translate3d(-200px,0,0)_scale(0.6)] transition-all duration-[600ms] delay-[300ms] [&.is-visible]:opacity-100 [&.is-visible]:[transform:translate3d(0,0,0)_scale(1)] bg-white rounded-[2rem] p-8 border border-gray-200/60 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 flex flex-col justify-between min-h-[320px] w-[85vw] sm:w-[400px] flex-shrink-0 snap-center group"
                  style={{
                    backgroundImage: service.backgroundImageServiceCards,
                  }}
                >
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                      <service.icon className="text-gray-900" size={26} />
                    </div>
                    <h3 className="text-2xl font-medium text-gray-900 mb-3">
                      {service.name}
                    </h3>
                    <p className="text-base text-gray-600 leading-relaxed">
                      Simplify and manage {service.name.toLowerCase()}{" "}
                      efficiently in one location. Built for speed and accuracy.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-8 text-gray-900 font-medium cursor-pointer w-max group/btn">
                    <span onClick={() => setShowLoginModal(true)}>
                      Learn more
                    </span>
                    <ArrowRight
                      size={18}
                      className="transform group-hover/btn:translate-x-1 transition-transform"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-7xl mx-auto mt-2 sm:hidden">
            <button className="w-full border-2 border-gray-200 text-gray-900 px-6 py-3 rounded-full font-medium hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-300">
              Explore all services
            </button>
          </div>
        </div>

        <div className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-white text-center">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-blue-500/10"></div>
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-white">
                Ready to Transform Your Healthcare Management?
              </h2>
              <p className="text-gray-300 text-sm sm:text-base md:text-lg mb-6 sm:mb-8">
                Join hundreds of healthcare professionals who trust our platform
              </p>
              <button
                onClick={openLoginModal}
                className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-white text-black text-base sm:text-lg font-semibold rounded-xl shadow-lg flex items-center gap-3 mx-auto hover:bg-gray-100 transition-all overflow-hidden"
              >
                <span className="relative z-10">Start Your Journey</span>
                <ArrowRight
                  size={20}
                  className="relative z-10 transform rotate-[-45deg] group-hover:translate-x-1 group-hover:translate-y-[-3px] transition-transform duration-300"
                />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-full py-4 px-6 max-w-2xl mx-auto flex justify-center items-center gap-8 text-gray-600 text-sm mt-10 mb-10 sticky top-3 z-40 border border-gray-200">
          <ul className="flex items-center justify-center gap-8">
            <li
              onClick={scrollToServices}
              className="cursor-pointer hover:text-black transition-colors font-medium"
            >
              What's included
            </li>
            <li
              onClick={scrollToFaqs}
              className="cursor-pointer hover:text-black transition-colors font-medium"
            >
              How it works
            </li>
            <li
              onClick={scrollToWhyUs}
              className="cursor-pointer hover:text-black transition-colors font-medium"
            >
              Why us
            </li>
          </ul>
        </div>

        <div ref={teamRef} className="py-5 px-4 bg-white">
          <TEAM />
        </div>

        <div ref={faqRef} className="py-16 px-4 bg-gray-50">
          <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
            Frequently Asked Questions
          </h1>
          <FAQ />
        </div>
      </main>
      {loading && <Loading />}
      {showLoginModal && (
        <div className="fixed inset-0 z-[9999] flex justify-center items-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={closeLoginModal}
          ></div>

          <div
            className="relative flex flex-col z-[10000] rounded-md shadow-[0_24px_38px_3px_rgba(0,0,0,0.14),0_9px_46px_8px_rgba(0,0,0,0.12),0_11px_15px_-7px_rgba(0,0,0,0.2)] max-w-[450px] w-full mx-4 animate-modalSlideIn overflow-hidden p-10"
            style={{
              backgroundImage: `url(${LoginBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <button
              onClick={closeLoginModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 hover:bg-red-100 p-2 rounded-md transition-colors"
            >
              <X size={24} strokeWidth={1.5} />
            </button>

            <div className="text-center mb-10 mt-2">
              <div className="w-12 h-12 bg-[#f0f4f9] rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="text-[#33cc82]" size={24} />
              </div>
              <h2 className="text-[32px] font-normal text-gray-900 mb-2">
                Sign in
              </h2>
              <p className="text-[16px] text-gray-600 font-poppins">
                to continue to Clinic Workspace
              </p>
            </div>

            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              <div className="relative mt-2">
                <input
                  type="email"
                  id="email1"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block px-4 pb-3.5 pt-4 w-full text-[16px] text-gray-900 bg-transparent rounded-md border border-gray-400 appearance-none focus:outline-none focus:ring-0 focus:border-2 focus:border-[#1bc247] peer"
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="email1"
                  className="absolute text-[16px] text-gray-500 bg-white px-1 duration-200 transform -translate-y-5 scale-75 top-2 z-10 origin-[0] left-3 peer-focus:text-[#1bc247] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-5 cursor-text"
                >
                  Email Address
                </label>
              </div>

              <div className="relative mt-2">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password1"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block px-4 pb-3.5 pt-4 w-full text-[16px] text-gray-900 bg-transparent rounded-md border border-gray-400 appearance-none focus:outline-none focus:ring-0 focus:border-2 focus:border-[#1bc24s7] peer pr-12"
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="password1"
                  className="absolute text-[16px] text-gray-500 bg-white px-1 duration-200 transform -translate-y-5 scale-75 top-2 z-10 origin-[0] left-3 peer-focus:text-[#33cc82] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:border-[#33cc82] peer-focus:-translate-y-5 cursor-text"
                >
                  Password
                </label>

                <button
                  type="button"
                  className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-500 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors"
                  onClick={handleShowPassword}
                >
                  {showPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
                </button>
              </div>

              <div className="flex items-center justify-between mt-2 px-1">
                <div className="flex items-center gap-3">
                  <input
                    id="remember"
                    type="checkbox"
                    className="w-4 h-4 text-[#33cc82] bg-white border-gray-400 rounded focus:ring-[#33cc82] focus:ring-2 cursor-pointer transition-all"
                  />
                  <label
                    htmlFor="remember"
                    className="text-[14px] text-gray-700 cursor-pointer font-medium"
                  >
                    Remember me
                  </label>
                </div>
              </div>

              <div className="flex justify-between items-center mt-8">
                <button
                  type="button"
                  className="text-[#33cc82] text-[14px] font-medium hover:bg-green-50 px-4 py-2 rounded-full transition-colors"
                >
                  Forgot password?
                </button>
                <button
                  type="submit"
                  className="bg-[#33cc82] hover:bg-[#33cc82] text-white font-medium text-[14px] px-6 py-2.5 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors tracking-wide"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <ClipLoader color="white" size={16} />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    "Next"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer position="bottom-right" />
      <ContactUs ref={contactUsRef} />
      <Footer container className="mt-20 bg-white text-white">
        <div className="w-full text-center">
          <div className="w-full justify-between sm:flex sm:items-center sm:justify-between">
            <FooterBrand
              href="https://localhost:5173/"
              src={drake}
              alt="Peace of Mind Logo"
              name="Asyv Clinic"
            />
            <FooterLinkGroup>
              <FooterLink href="#" className="text-gray-300 hover:text-white">
                Team
              </FooterLink>
              <FooterLink href="#" className="text-gray-300 hover:text-white">
                Services
              </FooterLink>
              <FooterLink href="#" className="text-gray-300 hover:text-white">
                FAQs
              </FooterLink>
              <FooterLink href="#" className="text-gray-300 hover:text-white">
                Contact
              </FooterLink>
            </FooterLinkGroup>
          </div>
          <FooterDivider />
          <FooterCopyright
            href="#"
            by="ASYVClinic™"
            year={2025}
            className="text-gray-400"
          />
        </div>
      </Footer>

      <style jsx>{`
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .animate-modalSlideIn {
          animation: modalSlideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
