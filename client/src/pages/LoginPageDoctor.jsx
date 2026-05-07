import React, { useEffect, useState, useRef } from "react";
import GoogleButton from "react-google-button";
import { Button } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { House } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../../context/authContext.jsx";
import axios from "axios";
import { OrbitProgress } from "react-loading-indicators";
import { delay } from "../utils/Delay.jsx";
import ValidationError from "../components/ValidationError.jsx";
import Navbar from "../components/landingPageNavbar.jsx"
const LoginPageDoctor = () => {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { googleSignIn, login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [progressing, setProgressing] = useState(false);
  const [error, setError] = useState(false);
  const [focused, setFocused] = useState(false);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  useEffect(() => {
    AOS.init({ duration: 500 });
  }, []);

  useEffect(() => {
    if (showPassword && passwordRef.current) {
      passwordRef.current.focus();
    }
  }, [showPassword]);

  const handleNext = () => {
    if (email.trim() === "") {
      setError(true);
      return;
    }
    setError(false);
    setShowPassword(true);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setProgressing(true);

    try {
      const responsePromise = axios.post(`${backendUrl}/api/accounts/login`, {
        email,
        password,
      });

      const [response] = await Promise.all([responsePromise, delay(2000)]);

      if (!response.data.success) {
        toast.error(response.data.message || "Login failed");
        setProgressing(false);
        return;
      }

      const { token, role, user: userData } = response.data;

      if (role !== "admin" && role !== "doctor") {
        toast.error("This login is for doctors/admins only.");
        setProgressing(false);
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      login(userData);
      toast.success("Login successful!");
      navigate("/home/admin");
    } catch (err) {
      toast.error("Login failed");
    } finally {
      setProgressing(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
      navigate("/home/admin");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f9fafb] relative flex font-sans text-gray-700 overflow-hidden">
      
      {/* YOUR EXACT BACKGROUND IMPLEMENTATION */}
     
  
      {/* Progressing Overlay */}
      {progressing && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 z-50">
          <OrbitProgress
            variant="track-disc"
            size="large"
            color={["#FB923C", "#F97316", "#EA580C", "#C2410C"]}
          />
          <p className="mt-4 text-gray-600 italic">Logging you in...</p>
        </div>
      )}
      
      {/* Main Content (Changed bg-white to bg-transparent to see the background) */}
      <div className="relative z-10 flex w-full bg-transparent">
        <div className="relative flex flex-1 flex-col">
          
          <Navbar 
            scrollToTeam={() => navigate("/")} 
            scrollToFaqs={() => navigate("/")} 
            goToHome={() => navigate("/")} 
            scrollToWhyUs={() => navigate("/")} 
            scrollToContactUs={() => navigate("/")} 
          />

          <div className="mx-auto mt-32 w-full max-w-[600px] px-8 flex flex-col items-center">
            <h1 className="text-4xl font-semibold mb-2">Doctor Login</h1>

            <p className="mb-8 text-gray-500">
              Don't have an account?{" "}
              <span className="text-[#FB923C] cursor-pointer">Sign up here</span>
            </p>

            <GoogleButton
              onClick={handleGoogleSignIn}
              style={{ backgroundColor: "#10B985" }}
            />

            <div className="my-8 flex w-full items-center">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="mx-4 text-xs text-gray-400">OR</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            <div className="w-full relative">
              {error && !focused && (
                <ValidationError
                  isVisible={true}
                  message="Please fill the email field!"
                />
              )}

              {!showPassword && (
                <>
                  <label className="text-sm text-gray-600">Email *</label>
                  <input
                    ref={emailRef}
                    value={email}
                    type="email"
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError(false);
                    }}
                    className={`w-full mt-1 rounded-md border px-4 py-2 outline-none ${
                      error && !focused
                        ? "border-red-500"
                        : focused
                        ? "border-[#10B981] ring-2 ring-[#10B981]"
                        : "border-gray-200"
                    }`}
                  />
                </>
              )}

              {showPassword && (
                <div data-aos="fade-left">
                  <label className="text-sm text-gray-600">Password *</label>
                  <input
                    ref={passwordRef}
                    value={password}
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mt-1 rounded-md border border-gray-200 px-4 py-2 outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981]"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-8 mb-5">
              <div
                onClick={() => setShowPassword(false)}
                className={`h-3 w-3 rounded-full cursor-pointer ${
                  !showPassword ? "bg-[#10B981]" : "bg-gray-300"
                }`}
              />
              <div
                onClick={handleNext}
                className={`h-3 w-3 rounded-full cursor-pointer ${
                  showPassword ? "bg-[#10B981]" : "bg-gray-300"
                }`}
              />
            </div>

            <Button onClick={showPassword ? handleSubmit : handleNext} className="w-full">
              {showPassword ? "Login" : "Next"}
            </Button>
          </div>
        </div>
      </div>

      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default LoginPageDoctor;