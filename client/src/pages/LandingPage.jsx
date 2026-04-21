import React, { useRef, useState, useEffect } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

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

// import { useFirebase } from "../ContextFireBase/contextFire.jsx";

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

        <div
          ref={whyChooseUsRef}
          className="py-5 sm:py-2 px-4 sm:px-6 bg-white overflow-hidden"
        >
          <section className="relative max-w-7xl mx-auto px-6 py-20 mt-30 overflow-hidden">
            <div className="flex flex-col md:flex-row items-center gap-12">
              {/* Left Content */}
              <div className="flex-1 z-10">
                <h2 className="text-5xl md:text-6xl text-slate-900 font-bold tracking-tight leading-tight">
                  <Words data-aos="fade-right" duration="2000" /> <br />
                </h2>
                <p
                  className="text-lg text-slate-600 max-w-md mb-8"
                  data-aos="fade-up"
                  duration="2500"
                >
                  From patient scheduling to digital prescriptions, find
                  everything you need to streamline your medical practice in one
                  dashboard.
                </p>
                <button className="px-8 py-3 bg-blue-50 text-blue-600 rounded-full font-semibold hover:bg-blue-100 transition-all flex items-center gap-2" onClick={()=>setSelectionOpen(true)}>
                  Explore features <span className="text-xl">↗</span>
                </button>
              </div>

              <div className="flex-1 relative">
                <div
                  className="relative z-10 rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
                  data-aos="fade-left"
                  duration="1000"
                >
                  <img
                    src="/images/dashboard.png"
                    alt="Clinic Dashboard"
                    className="w-full object-cover"
                  />
                </div>

                <div
                  className="absolute -left-8 top-1/4 w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center shadow-lg z-20  transition-all duration-1000"
                  data-aos="fade-down"
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-sm opacity-50" />
                </div>

                <div
                  className="absolute -right-4 -bottom-4 w-20 h-20 bg-green-200 rounded-full flex items-center justify-center shadow-lg z-20"
                  data-aos="fade-up"
                >
                  <div className="w-10 h-10 bg-[#4CAF50] rounded-full opacity-70" />
                </div>

                <div
                  className="absolute left-1/4 -bottom-10 w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center shadow-lg z-20"
                  data-aos="zoom-in-down"
                >
                  <div className="w-12 h-12 bg-orange-400 rounded-full opacity-60" />
                </div>

                <div
                  className="absolute -right-6 -top-10 w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center shadow-xl z-20 border border-gray-100"
                  data-aos="zoom-in-up"
                >
                  <div className="w-12 h-12 border-4 border-gray-800 rounded-md" />
                </div>
              </div>
            </div>
          </section>

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
                  <span>
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
                  <span>
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
                  <span>
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
          className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 bg-[#E8F5E9] text-center"
          data-aos="zoom-out-down"
        >
          <div className="max-w-6xl mx-auto bg-[#4CAF50] rounded-[2.5rem] p-10 sm:p-20 shadow-2xl relative overflow-hidden">
            {/* Subtle glow effect for depth */}
            <div className="absolute top-0 left-0 w-full h-full bg-white opacity-[0.03] pointer-events-none"></div>

            <div className="relative z-10 flex flex-col items-center">
              <h2
                className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white tracking-tight leading-tight"
                data-aos="zoom-out-up"
                duration="3000"
              >
                Your Clinic, <br className="hidden sm:block" /> Streamlined.
              </h2>

              <p
                className="text-[#E8F5E9] text-lg sm:text-xl md:text-2xl max-w-3xl mb-10 opacity-90 leading-relaxed font-light"
                data-aos="fade-right"
                duration="2000"
              >
                Manage patient records, appointments, and billing in one secure
                place. Focus on care while we handle the complexity.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  className="px-10 py-4 bg-white text-[#388E3C] text-lg font-bold rounded-sm shadow-lg hover:bg-[#E8F5E9] hover:scale-105 transition-all duration-300"
                  data-aos="fade-up-right"
                  onClick={()=>setSelectionOpen(true)}
                >
                  Get Started
                </button>

                <button
                  className="px-10 py-4 bg-transparent border-2 border-[#E8F5E9] text-[#E8F5E9] text-lg font-medium rounded-full hover:bg-white/10 transition-all duration-300"
                  data-aos="fade-up-left"
                  onClick={()=>setSelectionOpen(true)}
                >
                  Explore Features
                </button>
              </div>
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

      <ToastContainer position="bottom-right" />
      <ContactUs ref={contactUsRef}/>
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
