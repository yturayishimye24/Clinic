
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDjIfMis2bBo0dgWtZbDmC9TInrKhkSGuc",
  authDomain: "clinic-management-system-99576.firebaseapp.com",
  projectId: "clinic-management-system-99576",
  storageBucket: "clinic-management-system-99576.firebasestorage.app",
  messagingSenderId: "773368778250",
  appId: "1:773368778250:web:65b1ead795dbc7706a59f3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Auth and the Google Provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
