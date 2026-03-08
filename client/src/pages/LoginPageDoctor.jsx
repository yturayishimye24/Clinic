import React, { useEffect, useState, useRef } from "react";
import GoogleButton from "react-google-button";
import { Link, useNavigate } from "react-router-dom";
import { House } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../../context/authContext.jsx";
import axios from "axios";
import { OrbitProgress } from "react-loading-indicators";
import { delay } from "../utils/Delay.jsx";
import ValidationError from "../components/ValidationError.jsx";

const LoginPageDoctor = () => {

  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { googleSignIn, login } = useAuth();

  // form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [progressing, setProgressing] = useState(false);
  const [error, setError] = useState(false);
  const [focused, setFocused] = useState(false);

  // refs
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  // initialize AOS
  useEffect(() => {
    AOS.init({ duration: 500 });
  }, []);

  // autofocus password
  useEffect(() => {
    if (showPassword && passwordRef.current) {
      passwordRef.current.focus();
    }
  }, [showPassword]);

  // next step
  const handleNext = () => {
    if (email.trim() === "") {
      setError(true);
      return;
    }

    setError(false);
    setShowPassword(true);
  };

  // login
  const handleSubmit = async (e) => {
    e?.preventDefault();

    setProgressing(true);

    try {

      const responsePromise = axios.post(
        `${backendUrl}/api/accounts/login`,
        { email, password }
      );

      const [response] = await Promise.all([
        responsePromise,
        delay(2000)
      ]);

      const { token, role, user: userData } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      login(userData);

      toast.success("Login successful!");

      navigate("/home/admin");

    } catch (err) {
      toast.error("Login failed");
      console.log(err);
    } finally {
      setProgressing(false);
    }
  };

  // google login
  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
      navigate("/home/admin");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex min-h-screen w-full font-sans text-gray-700">

      
      <div className="hidden w-[400px] flex-col bg-[#FFF4E1] px-10 py-8 lg:flex">

        <div className="mb-12 text-3xl font-black text-[#FB923C]">
          Clinic<span className="text-xl font-normal">Auth</span>
        </div>

        <img src="/images/LoginImage.png" width="9000" height="9000"/>

      </div>

      <div className="relative flex flex-1 flex-col bg-white">

        {progressing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 z-50">

            <OrbitProgress
              variant="track-disc"
              size="large"
              color={["#FB923C","#F97316","#EA580C","#C2410C"]}
            />

            <p className="mt-4 text-gray-600 italic">
              Logging you in...
            </p>

          </div>
        )}

     
        <span
          onClick={() => navigate("/")}
          className="absolute mt-6 ml-10 flex items-center gap-3 cursor-pointer text-[#FB923C]"
        >
          <House size={28} />
          Back home
        </span>

        
        <div className="mx-auto mt-32 w-full max-w-[600px] px-8 flex flex-col items-center">

          <h1 className="text-4xl font-semibold mb-2">
            Doctor Login
          </h1>

          <p className="mb-8 text-gray-500">
            Don't have an account?{" "}
            <span className="text-[#FB923C] cursor-pointer">
              Sign up here
            </span>
          </p>

       
          <GoogleButton onClick={handleGoogleSignIn} style={{backgroundColor:"#10B981"}}/>

          <div className="my-8 flex w-full items-center">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="mx-4 text-xs text-gray-400">OR</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* FORM */}
          <div className="w-full relative">

            {/* validation error */}
            {error && !focused && (
              <ValidationError
                isVisible={true}
                message="Please fill the email field!"
              />
            )}

            {/* EMAIL */}
            {!showPassword && (
              <>
                <label className="text-sm text-gray-600">
                  Email *
                </label>

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
                  className={`w-full mt-1 rounded-md border px-4 py-2 outline-none
                  ${
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

                <label className="text-sm text-gray-600">
                  Password *
                </label>

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

        
          <div className="flex gap-3 mt-8">

      
            <div
              onClick={() => setShowPassword(false)}
              className={`h-3 w-3 rounded-full cursor-pointer
              ${!showPassword ? "bg-[#10B981]" : "bg-gray-300"}`}
            />

            <div
              onClick={() => {
                if (email.trim() === "") {
                  setError(true);
                  return;
                }

                setShowPassword(true);
              }}
              className={`h-3 w-3 rounded-full cursor-pointer
              ${showPassword ? "bg-[#10B981]" : "bg-gray-300"}`}
            />

          </div>

          {/* BUTTON */}
          <button
            onClick={showPassword ? handleSubmit : handleNext}
            className="mt-6 rounded-md bg-[#FB923C] px-6 py-2 text-white font-semibold hover:bg-[#F97316]"
          >
            {showPassword ? "Login" : "Next"}
          </button>

        </div>

      </div>

      <ToastContainer position="bottom-right" />

    </div>
  );
};

export default LoginPageDoctor;