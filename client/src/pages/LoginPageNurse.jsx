import React from "react";
import GoogleButton from "react-google-button";
import usFlag from "../../public/images/usFlag.png";
import RwandaFlag from "../../public/images/RwandaFlag.png";
import LoginImageSvg from "../../public/images/LoginImage.svg";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext.jsx";
import { House, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { delay } from "../../src/utils/Delay.jsx";
import AOS from "aos";
import "aos/dist/aos.css";
import { OrbitProgress } from "react-loading-indicators";
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import Navbar from "../components/landingPageNavbar.jsx"
import { Button } from "@heroui/react";

const LoginPageNurse = () => {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { login, googleSignIn } = useAuth();

  useEffect(() => {
    AOS.init();
  }, []);
  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log("Error during Google Sign-In:", error);
    }
  };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [progressing, setProgressing] = useState(false);
  const [isVisible, setIvisible] = useState(false);
  const [colorVisible, setColorVisible] = useState(true);

  useEffect(() => {
    AOS.refresh();
  }, [showPassword]);
  const handleLogin = async (e) => {
    e?.preventDefault();
    setProgressing(true);
    try {
      // Don't send existing token for login - it will cause auth issues
      const responsePromise = await axios.post(
        `${backendUrl}/api/accounts/login`,
        {
          email,
          password,
        },
      );
      const [response] = await Promise.all([responsePromise, delay(3000)]);

      // Check success flag from backend
      if (response.data.success) {
        const { token, user: userData, role } = response.data;

        // Verify the role is nurse before allowing login
        if (role !== "nurse") {
          toast.error(
            "This login is for nurses only. Please use the correct login page.",
          );
          setProgressing(false);
          return;
        }

        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("username", userData.username);
        login(userData);

        toast.success("Logged in successfully!");
        navigate("/home");
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (error) {
      console.log("Error logging in!", error);

      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to login. Please check your credentials.");
      }
    } finally {
      setProgressing(false);
    }
  };
  const handleNext = () => {
    if (email.trim() !== "") {
      setColorVisible(true);
      setShowPassword(true);
    } else {
      setError(true);
    }
  };

  return (
    <div className="flex min-h-screen w-full font-sans text-gray-700">
      {/* Left Sidebar */}
   

      <div className="relative flex flex-1 flex-col bg-white">
        {progressing && (
          <div className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-70 flex flex-col items-center justify-center z-50">
            <OrbitProgress
              color={[
                "green",
                "blue",
                "yellow",
                "orange",
                "red",
                "#7CBB00",
                "#4286F4",
                "#00A1F1",
              ]}
              size="large"
              text=""
              textColor=""
            />
            <p className="mt-4 text-gray-600 text-lg font-medium">
              <i>Logging you in...</i>
            </p>
          </div>
        )}
         <Navbar 
            scrollToTeam={() => navigate("/")} 
            scrollToFaqs={() => navigate("/")} 
            goToHome={() => navigate("/")} 
            scrollToWhyUs={() => navigate("/")} 
            scrollToContactUs={() => navigate("/")} 
          />
        <div className="absolute right-6 top-6 flex items-center gap-4 text-sm">
          <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700">
            <select>
              <option>Us English</option>
              <option>Kinyarwanda</option>
            </select>
          </button>
          <div className="h-6 w-px bg-gray-300"></div>
          <span className="text-gray-500">Not a nurse?</span>
          <Link to={"/doctorLogin"}>
            <Button varient="secondary">Doctor Login</Button>
          </Link>
        </div>

        {/* Main Form */}
        <div className="mx-auto mt-32 flex w-full max-w-[600px] flex-col items-center px-8">
          <h1 className="mb-2 text-4xl font-semibold text-[#4a5568]">
            Nurse Login
          </h1>
          <p className="mb-8 text-[#718096]">
            Don't have an account?{" "}
            <a href="#" className="text-green-500 hover:underline">
              Sign up here
            </a>
          </p>

          <p className="mb-4 text-sm text-gray-500">Log in with:</p>

          {/* SSO Buttons */}
          <div className="w-full gap-3 flex align-items-center justify-center">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                console.log("Google Sign-In successful!", credentialResponse);
                console.log(
                  "Decoded JWT:",
                  jwtDecode(credentialResponse.credential),
                );
                navigate("/home");
              }}
              onError={() => console.log("Error Signing in with google")}
              auto_select={true}
              useOneTap
            />
          </div>

          {/* Divider */}
          <div className="my-8 flex w-full items-center">
            <div className="h-px flex-1 bg-gray-200"></div>
            <span className="mx-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#f1f5f9] text-xs font-semibold text-gray-400">
              OR
            </span>
            <div className="h-px flex-1 bg-gray-200"></div>
          </div>

          {!showPassword && (
            <div className="w-full">
              <label className="mb-1 block text-sm font-medium text-gray-600">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="w-full rounded-md border border-[#E7F5EE] px-4 py-2 outline-none focus:border-green-400 focus:ring-1 focus:ring-blue-400"
              />
              <div className="mt-2 text-right">
                <a href="#" className="text-sm text-gray-500 hover:underline">
                  Forgot your login info?
                </a>
              </div>
            </div>
          )}
          {showPassword && (
            <div
              className="w-full"
              data-aos="fade-left"
              data-aos-duration="2000"
            >
              <label className="mb-1 block text-sm font-medium text-gray-600">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={isVisible ? "text" : "password"}
                  className="w-full rounded-md border border-[#E7F5EE] px-4 py-2 pr-10 outline-none focus:border-green-400 focus:ring-1 focus:ring-blue-400"
                />
                <button
                  type="button"
                  onClick={() => setIvisible(!isVisible)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="mt-2 text-right">
                <a href="#" className="text-sm text-gray-500 hover:underline">
                  Forgot your login info?
                </a>
              </div>
            </div>
          )}

          <div className="my-8 w-full border-t border-gray-100"></div>

          {/* Footer Actions */}
          <div className="flex w-full items-center justify-between">
            <div className="flex gap-2">
              <div className="flex gap-2">
                {/* Email step */}
                <div
                  onClick={() => setShowPassword(false)}
                  className={`h-3 w-3 rounded-full cursor-pointer ${
                    !showPassword ? "bg-[#87CEAB]" : "bg-gray-200"
                  }`}
                ></div>

                {/* Password step */}
                <div
                  onClick={() => email && setShowPassword(true)}
                  className={`h-3 w-3 rounded-full cursor-pointer ${
                    showPassword ? "bg-[#87CEAB]" : "bg-gray-200"
                  }`}
                ></div>
              </div>
            </div>
            <Button
              varient="secondary"
              onClick={showPassword ? handleLogin : handleNext}
            >
              {showPassword ? "Login" : "Next"}
            </Button>
          </div>
        </div>
      </div>

      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default LoginPageNurse;
