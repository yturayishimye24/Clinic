import * as React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { AuthContext } from "../context/authContext.jsx";
import "./index.css";
import "antd/dist/reset.css";
import "flowbite";

import { GoogleOAuthProvider } from "@react-oauth/google";


createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthContext>
      <GoogleOAuthProvider clientId={import.meta.env.CLIENT_ID}>
        <App />
      </GoogleOAuthProvider>
    </AuthContext>
  </React.StrictMode>,
);
