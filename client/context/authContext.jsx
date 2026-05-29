import React from "react";
import { createContext, useState, useContext,useEffect } from "react";
import axios from "axios"

const userContext = createContext(null);

export const AuthContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading,setLoading] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

   const googleSignIn = async () => {
    // TODO: Implement Google login with new approach
    console.log("Google sign-in not implemented yet");
  };

  const logOut = async () => {
    try{
      // Removed Firebase signOut
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("username");
      localStorage.removeItem("email");
      localStorage.removeItem("adminUsername");
      localStorage.removeItem("adminEmail");
      localStorage.removeItem("doctorUsername");
      localStorage.removeItem("doctorEmail");
      localStorage.removeItem("nurseUsername");
      localStorage.removeItem("nurseEmail");
    }catch(error){
      console.log("Error during logout:", error);
    }

  }
  // Removed Firebase onAuthStateChanged useEffect

   useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axios.get(`${backendUrl}/api/verify`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.data.success) {
            setUser(response.data.user);
          } else {
            setUser(null);
          }
        } catch (error) {
          setUser(null);
        }
      }
      setLoading(false);
    };
    verifyUser();
  }, []);

  const login = (userData) => {
    setUser(userData);
    setLoading(false);
  };

  
  return (
    <userContext.Provider value={{ user, login, logOut,loading,googleSignIn}}>
      {children}
    </userContext.Provider>
  );
};

export const useAuth = () => useContext(userContext);
