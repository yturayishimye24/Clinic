import React, { useRef, useState, useEffect } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import {Button} from "../components/ButtonLoginDoctorPage.jsx"
import Aos from "aos";
import { useAuth } from "../../context/authContext.jsx";

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
  
  Download,
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
import KID from "../../public/images/KID.png";
import AfNurse from "../../public/images/AfNurse.png";
import Loading from "../components/Loading.jsx";
import Navbar from "../components/landingPageNavbar.jsx";
import HeroSection from "../components/HeroSection.jsx";
import LoginSelectionModal from "../components/SelectionLoginModal.jsx";
import Words from "../components/words.jsx";
import { OrbitProgress } from "react-loading-indicators";

import {
  Footer,
  FooterBrand,
  FooterCopyright,
  FooterDivider,
  FooterLink,
  FooterLinkGroup,
} from "flowbite-react";
import AOS from "aos";
import "aos/dist/aos.css";

const LandingPage = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [toggleBg, setToggleBg] = useState(false);

  //Selecting to login as nurse or as doctor
  const [selectionOpen, setSelectionOpen] = useState(false);
  const [loadingSelection, setLoadingSelection] = useState(false);

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
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);
  (useEffect(() => {
    const sections = [
      { ref: HomeRef, name: "home" },
      { ref: servicesRef, name: "services" },
      { ref: teamRef, name: "team" },
      { ref: contactUsRef, name: "contact" },
    ];
  }),
    []);
  useEffect(() => {
    Aos.init({
      duration: 1000,
      once: true,
    });
  });
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

  {
    loadingSelection && (
      <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-white/80 backdrop-blur-md">
        <OrbitProgress
          variant="track-disc"
          speedPlus="1"
          dense
          color={[
            "#FBBC05",
            "#FFBB00",
            "#EA4335",
            "#F65314",
            "#34A853",
            "#7CBB00",
            "#4286F4",
            "#00A1F1",
          ]}
          easing="ease-in-out"
          size={60}
        />
        <p className="mt-4 text-orange-600 font-semibld animate-pulse">
          Loading login page...
        </p>
      </div>
    );
  }

  return (
    <div className="font-sans min-h-screen bg-white" ref={HomeRef}>
      <header className="absolute mb-20 top-0 left-0 w-full z-50 ">
        <Navbar
          onGetStarted={() => setSelectionOpen(true)}
          scrollToFaqs={scrollToFaqs}
          scrollToTeam={scrollToTeam}
          scrollToServices={scrollToServices}
          goToHome={goToHome}
          scrollToWhyUs={scrollToWhyUs}
          scrollToContactUs={scrollToContactUs}
        />
      </header>

      <main className="min-h-screen">
        <HeroSection onGetStarted={() => setSelectionOpen(true)} />
        <LoginSelectionModal
          isOpen={selectionOpen}
          isClosed={() => setSelectionOpen(false)}
        />
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
        <div ref={whyChooseUsRef} className="py-24 bg-white overflow-hidden">
          <h1 className="text-center font-google text-4xl md:text-6xl lg:text-[72px] font-medium tracking-[-0.03em] leading-[1.1] text-slate-900 mb-12 max-w-4xl mx-auto">
            Why choose a modern <br className="hidden md:block" /> Clinic
            Management System?
          </h1>{" "}
         
          <section className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 mb-40">
           
            <div className="w-full lg:w-[55%] animate-scroll-appear" data-aos="fade-right">
              <img
                src="/images/rightDoctor.jpg"
                alt="Digital Patient Intake"
                className="w-full h-[500px] md:h-[650px] object-cover rounded-r-[500px] shadow-2xl"
              />
            </div>

            
            <div className="w-full lg:w-[35%] px-6 lg:px-0">
              <h2 className="font-google text-4xl md:text-5xl text-gray-900 mb-6 tracking-tight font-medium">
                Patient-First Focus
              </h2>
              <p className="font-google text-lg md:text-xl text-gray-600 leading-relaxed mb-10">
                Streamline the journey from check-in to recovery. Our intuitive
                interface reduces waiting room friction and puts health history
                at your patients' fingertips.
              </p>

           
              <div className="flex flex-col gap-6">
                <a
                  href="#"
                  className="text-[#1a73e8] font-google font-medium text-lg hover:underline flex items-center gap-2"
                >
                  Digital Intake Forms <span>→</span>
                </a>
                <a
                  href="#"
                  className="text-[#1a73e8] font-google font-medium text-lg hover:underline flex items-center gap-2"
                >
                  Telehealth Integration <span>→</span>
                </a>
                <a
                  href="#"
                  className="text-[#1a73e8] font-google font-medium text-lg hover:underline flex items-center gap-2"
                >
                  Patient Portal <span>→</span>
                </a>
              </div>
            </div>
          </section>
          
          <section className="flex flex-col-reverse lg:flex-row items-center gap-16 lg:gap-24">
            
            <div className="w-full lg:w-[35%] lg:ml-auto px-6 lg:px-0 text-left lg:text-right">
              <h2 className="font-google text-4xl md:text-5xl text-gray-900 mb-6 tracking-tight font-medium">
                Clinical Intelligence
              </h2>
              <p className="font-google text-lg md:text-xl text-gray-600 leading-relaxed mb-10">
                Empower your practitioners with real-time data. From automated
                billing to AI-driven scheduling, we handle the complex
                operations so you can focus on care.
              </p>

             
              <div className="flex flex-col gap-6 items-start lg:items-end">
                <a
                  href="#"
                  className="text-[#1a73e8] font-google font-medium text-lg hover:underline flex items-center gap-2"
                >
                  Smart Scheduling <span>→</span>
                </a>
                <a
                  href="#"
                  className="text-[#1a73e8] font-google font-medium text-lg hover:underline flex items-center gap-2"
                >
                  Automated Billing <span>→</span>
                </a>
                <a
                  href="#"
                  className="text-[#1a73e8] font-google font-medium text-lg hover:underline flex items-center gap-2"
                >
                  E-Prescriptions <span>→</span>
                </a>
              </div>
            </div>

            
            <div className="w-full lg:w-[55%]" data-aos="fade-left">
              <img
                src="/images/leftDoctor.jpg"
                alt="Medical Data Analytics"
                className="w-full h-[500px] md:h-[650px] object-cover rounded-l-[500px] shadow-2xl"
              />
            </div>
          </section>
        </div>

      <div className="bg-white shadow-md rounded-full p-2 max-w-3xl mx-auto flex items-center justify-between text-gray-600 text-sm mt-10 mb-10 sticky top-3 z-40 border border-gray-100">
      
  {/* Removed mt-3 for perfect vertical alignment */}
  <ul className="flex items-center justify-center gap-2 pl-4 font-medium">
    <li
      onClick={scrollToServices}
      className="cursor-pointer text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-full transition-all duration-200"
    >
      What's included
    </li>
    
    <li
      onClick={scrollToFaqs}
      className="cursor-pointer text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-full transition-all duration-200"
    >
      How it works
    </li>
    
    <li
      onClick={scrollToWhyUs}
      className="cursor-pointer text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-full transition-all duration-200"
    >
      Why us
    </li>
  </ul>

  {/* Right-Aligned Get Started Action Button */}
  <button 
    onClick={() => setSelectionOpen(true)}
    className="bg-gray-100 hover:bg-gray-200 text-white font-medium px-6 py-2.5 rounded-full shadow-sm transition-colors"
  >
    Get started
  </button>
  
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
        @keyframes slide-in-left {
          from {
            transform: translateX(-200px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .scroll-left {
          animation: slide-in-left linear;
          animation-timeline: view();
          animation-range: entry 0% cover 40%;
        }
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
