import React from "react";
import { createContext, useState, useContext,useEffect } from "react";
import axios from "axios"
import {GoogleAuthProvider, signInWithPopup, signInWithRedirect, onAuthStateChanged, signOut} from "firebase/auth";
import { auth} from "../../client/src/firebase.js";

const userContext = createContext(null);

export const AuthContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading,setLoading] = useState(false);
  const [authLoading,setAuthLoading] = useState(true);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

   const googleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      // convert Firebase user to your app user
      const userData = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName,
        email: firebaseUser.email,
        role: "doctor", // optional
      };
      login(userData);
    } catch(error){
      console.log("Error during Google Sign-In:", error);
    }
  };

  const logOut = async () => {
    try{
      await signOut(auth);
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("role");
    }catch(error){
      console.log("Error during logout:", error);
    }

  }
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) =>{
      if(currentUser && !user){
        const userData ={
          id: currentUser.uid,
          name: currentUser.displayName,
          email: currentUser.email,
          role: "doctor"
        }
        setUser(userData);
      }
      setAuthLoading(false);
    })
    return () => unsubscribe();
  },[])

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
    <userContext.Provider value={{ user, login, logOut,authLoading,loading,googleSignIn}}>
      {children}
    </userContext.Provider>
  );
};

export const useAuth = () => useContext(userContext);
