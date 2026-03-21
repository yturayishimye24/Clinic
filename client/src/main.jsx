import * as React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { AuthContext } from "../context/authContext.jsx";
import { ThemeProvider } from "./context/themeContext.jsx";
import "./index.css";
import 'antd/dist/reset.css';
import "flowbite";


createRoot(document.getElementById("root")).render(
  <React.StrictMode>
      <ThemeProvider>
        <AuthContext>
          <App />
        </AuthContext>
      </ThemeProvider>
  </React.StrictMode>,
);
