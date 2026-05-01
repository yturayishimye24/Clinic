import * as React from "react";
import LoginPageDoctor from "./pages/LoginPageDoctor.jsx";
import LoginPageNurse from "./pages/LoginPageNurse.jsx";
import { ToastContainer } from "react-toastify";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import CreatePage from "./pages/CreatePage.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import { AuthContext } from "../context/authContext.jsx";
import StockManager from "./pages/StockManager.jsx";

import "./index.css";
import "flowbite";
// import PrivateRoutes from "./utils/PrivateRoutes.jsx";
// import RoleBasedRoutes from "./utils/RoleBasedRoutes.jsx";.jsx";
import PatientList from "./pages/PatientList.jsx";
import RequestList from "./pages/RequestList.jsx";
import ReportList from "./pages/ReportList.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import PatientDetails from "./pages/PatientDetails.jsx";
export const backendUrl = "http://localhost:4000";

const App = () => {
  return (
    <AuthContext>
      <BrowserRouter>
        <div data-theme="cupcake">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/nurseLogin" element={<LoginPageNurse />} />
            <Route path="/doctorLogin" element={<LoginPageDoctor />} />
            <Route path="/home" element={<CreatePage />}>
              <Route path="patients" element={<PatientList />}>
                 <Route path=":id" element={<PatientDetails />} />
              </Route>
              <Route path="requests" element={<RequestList />} />
              <Route path="reports" element={<ReportList />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            <Route path="/home/admin" element={<AdminPage />}>
              <Route path="patients" element={<PatientList />} />
              <Route path="requests" element={<RequestList />} />
              <Route path="reports" element={<ReportList />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            <Route path={"/stockmanager"} element={<StockManager />} />
          </Routes>
        </div>
        <ToastContainer containerStyle={{ zIndex: 99999 }} />
      </BrowserRouter>
    </AuthContext>
  );
};

export default App;
