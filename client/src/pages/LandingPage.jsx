import React, { useRef, useState, useEffect } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

import Aos from "aos"
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
 useEffect(() =>{
   Aos.init({
     duration: 1000,
     once: true,
   })
 })
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

        <div ref={whyChooseUsRef} className="mb-30">
          <section className="relative left-0 mt-20 overflow-hidden">
            <h1 className="text-6xl text-center pb-5 font-poppins font-400 letter-spacing-[-.5px] line-height-[1.6]">
              Giving fast and reliable services
            </h1>

            <div className="flex items-center justify-start gap-10 w-[100%]">
              <img
                src={KID}
                alt="Kid Image before treatment"
                className="h-[100%] rounded-tr-[999px] ml-0 rounded-br-[999px] object-left object-fit w-[60%]"
                data-aos="fade-right"
              />
              <div>
                <h2 className="text-[2rem] leading-[1.25] font-normal tracking-[-0.25px] text-gray-900">
                  Our Services
                </h2>
                <p className="text-[1.125rem] leading-[1.55556] font-normal tracking-normal">
                  Here are the services we offer to our patients.
                  <br />
                  Giving drug information and support to our patients.
                  <br />
                  Ensuring accurate and up-to-date drug information for safe
                  medication use.
                  <br />
                  Providing personalized drug recommendations based on patient
                  needs and medical history.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Our Services Section */}
        <div>
          <h1 className="text-5xl text-center font-poppins font-400 letter-spacing-[-.5px] line-height-[1.6] mt-0 mb-10 text-gray-800">
            Comprehensive healthcare solutions
          </h1>
          <div className="flex items-center justify-center gap-10 ">
            <div className="ml-5">
              <h2 className="text-[2rem] leading-[1.25] font-normal tracking-[-0.25px] text-gray-900">
                Our Missions
              </h2>
              <p className="text-[1.125rem] leading-[1.55556] font-normal tracking-normal">
                We are committed to providing the highest quality healthcare
                services to our patients. 
              </p>
            </div>
            <img
              src={AfNurse}
              alt="Hero image"
              className="rounded-tr-none rounded-br-none rounded-tl-[999px] rounded-bl-[999px] h-[50%] w-[60%] object-left"
              data-aos="fade-left"
            />
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
