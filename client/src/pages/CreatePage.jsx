import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Link, Outlet, useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { FileInput, Label } from "flowbite-react";
import { Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Space } from "antd";
import Sidebar from "../components/sidebar.jsx";
import { SidebarItem } from "../components/sidebar.jsx";
import { Skeleton } from "@/components/ui/skeleton";
import { delay } from "./../utils/Delay.jsx";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import {
  UserPlus,
  Bell,
  Calendar,
  Users,
  ClipboardList,
  Loader2,
  Home,
  Trash2,
  Search,
  Plus,
  LogOut,
  Settings,
  User,
  FileText,
  Edit,
  ActivitySquare,
  AlertCircle,
  BarChart3,
  MessageSquare,
  Save,
  Check,
  Clock,
  X,
  Play,
  Grid,
  Moon,
  ArrowUpRight,
  ArrowRight,
} from "lucide-react";

// --- CUSTOM STYLES & FONTS ---

export default function NursePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // --- STATES ---
  const [editingPatientId, setEditingPatientId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded,setExpanded] = useState(true)
  // Patient Form States
  const [firstName, setFirstName] = useState("");
  const [gender, setGender] = useState("");
  const [lastName, setLastName] = useState("");
  const [date, setDate] = useState("");
  const [patientImage, setPatientImage] = useState(null);
  const [disease, setDisease] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [formError, setFormError] = useState("");

  // Report States
  const [reportTitle, setReportTitle] = useState("");
  const [body, setBody] = useState("");
  const [conclusion, setConclusion] = useState("");
  const [reporting, setReporting] = useState(false);
  const [reports, setReports] = useState([]);
  const [reportForm, ShowReportForm] = useState(false);

  // Request Form States
  const [requestType, setRequestType] = useState("Medicine Request");
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [urgency, setUrgency] = useState("medium");
  const [reason, setReason] = useState("");
  const [patientCount, setPatientCount] = useState(0);

  // UI & Data States
  const [myRequests, setMyRequests] = useState([]);
  const [loggedInEmail, setLoggedInEmail] = useState("clinicnurse@gmail.com");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Determine current page
  const isOnPatients = location.pathname === "/home/patients";
  const isOnRequests = location.pathname === "/home/requests";
  const isOnReports = location.pathname === "/home/reports";
  const isOnSettings = location.pathname === "/home/settings";
  const isOnDashboard =
    location.pathname === "/home" || location.pathname === "/home/";

  //Lasts reports

  const fetchPatients = async () => {
    try {
      setLoading(true);
      await delay(2000);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${backendUrl}/api/patients/displayPatients`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const d = response.data;
      setPatients(d);
    } catch (error) {
      console.log("Error fetching patients", error.message);
      toast.error("Failed to fetch patients.", error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${backendUrl}/api/requests/showRequests`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const d = response.data;
      setMyRequests(
        Array.isArray(d) ? d : Array.isArray(d.requests) ? d.requests : [],
      );
    } catch (error) {
      console.error(error);
    }
  };

  const fetchEmail = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${backendUrl}/api/infos/email`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmail(response.data.email);
      setUsername(response.data.username);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      navigate("/");
      return;
    }
    if (role !== "nurse") {
      toast.error("Unauthorized access");
      navigate("/");
    }

    fetchEmail();
    fetchPatients();
    fetchRequests();
  }, [navigate]);

  // --- ACTIONS ---
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setTimeout(() => navigate("/"), 2000);
    setTimeout(() => toast.success("Logged out Successfully!"), 2000);
  };

  const Report = async (e) => {
    e.preventDefault();
    setReporting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${backendUrl}/api/report/create_report`,
        { title: reportTitle, body, conclusion },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      displayReports();

      toast.success("Report generated!");
      ShowReportForm(false);
      setReportTitle("");
      setConclusion("");
      setBody("");
    } catch (error) {
      toast.error("Failed to generate report.");
    } finally {
      setReporting(false);
    }
  };
  const handleGetEmail = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${backendUrl}/api/infos/email`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data.email);
      if (response.data.success) {
        setLoggedInEmail(response.data.email);
      } else {
        toast.error("Error getting email", error.message);
      }
    } catch (error) {
      console.log("Error fetching email for the user!", error.message);
    }
  };
  useEffect(() => {
    handleGetEmail();
  }, []);

  const displayReports = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${backendUrl}/api/report/display_report`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      console.log("Reports displayed successfully", response);
      setReports(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.log("Error displaying reports", error);
    }
  };
  useEffect(() => {
    displayReports();
  }, []);
  const handleHospitalize = async (patientId) => {
    if (!window.confirm("Hospitalize this patient?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${backendUrl}/api/patients/${patientId}/hospitalize`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Status updated");
      fetchPatients();
    } catch (error) {
      toast.error("Error updating status");
    }
  };

  const handleDelete = async (patientId) => {
    if (!window.confirm("Delete this patient?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${backendUrl}/api/patients/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatients((prev) => prev.filter((p) => p._id !== patientId));
      toast.success("Patient deleted");
    } catch (error) {
      toast.error("Error deleting patient");
    }
  };

  const handleDeleteRequest = async (requestId, e) => {
    e.preventDefault();
    if (!window.confirm("Delete this request?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${backendUrl}/api/requests/removeRequests/${requestId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setMyRequests((prev) => prev.filter((r) => r._id !== requestId));
      toast.success("Request deleted");
    } catch (error) {
      toast.error("Error deleting request");
    }
  };

  // --- FORM HANDLERS ---
  const handleEdit = (patient) => {
    setEditingPatientId(patient._id);
    setFirstName(patient.firstName || "");
    setLastName(patient.lastName || "");
    setGender(patient.gender || "");
    setDate(patient.date ? patient.date.split("T")[0] : "");
    setMaritalStatus(patient.maritalStatus || "");
    setDisease(patient.disease || "");
    setShowForm(true);
  };

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setGender("");
    setDate("");
    setMaritalStatus("");
    setDisease("");
    setPatientImage(null);
    setEditingPatientId(null);
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const patientData = {
        firstName,
        lastName,
        date,
        disease,
        gender,
      };

      if (editingPatientId) {
        const response = await axios.put(
          `${backendUrl}/api/patients/${editingPatientId}`,
          patientData,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setPatients((prev) =>
          prev.map((p) => (p._id === editingPatientId ? response.data : p)),
        );
        toast.success("Patient updated");
      } else {
        const response = await axios.post(
          `${backendUrl}/api/patients/create`,
          patientData,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setPatients((prev) => [...prev, response.data.patient]);
        toast.success("Patient added");
      }
      setShowForm(false);
      resetForm();
    } catch (error) {
      console.log("ERROR:", error.response?.data || error.message);
      setFormError(error.response?.data?.message || "Failed to save patient.");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const requestData = {
        Status: "pending",
        requestType,
        itemName,
        quantity,
        urgency,
        patientCount,
        reason,
      };
      const response = await axios.post(
        `${backendUrl}/api/requests/createRequests`,
        requestData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (response.data.success) {
        toast.success("Request submitted");
        setShowRequestForm(false);
        fetchRequests();
        // Reset request form
        setItemName("");
        setQuantity("");
        setReason("");
      }
    } catch (error) {
      toast.error("Failed to submit request");
    }
  };

  const filteredPatients = patients.filter((patient) => {
    const userFullName =
      `${patient.firstName} ${patient.lastName}`.toLowerCase();
    return (
      userFullName.includes(searchTerm.toLowerCase()) ||
      patient.disease.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  //latest reports
  const latestReport =
    reports && reports.length > 0
      ? [...reports].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        )[0]
      : null;

  const StatusBadge = ({ status }) => {
    const s = status?.toLowerCase() || "";
    if (s === "approved" || s === "active")
      return (
        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center border border-emerald-200">
          <Check className="w-4 h-4 text-emerald-600" />
        </div>
      );
    if (s === "hospitalized" || s === "rejected")
      return (
        <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center border border-rose-200">
          <X className="w-4 h-4 text-rose-600" />
        </div>
      );
    return (
      <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center border border-amber-200">
        <Clock className="w-4 h-4 text-amber-600" />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-base-200 font-sans">
      <Sidebar>
        <SidebarItem icon={<Home />} onClick={()=>navigate("/home")} text="Dashboard" active />
        <SidebarItem icon={<Users />} onClick={()=>navigate("/home/patients")}text="Patients" />
        <SidebarItem icon={<ClipboardList />} text="Requests" />
        <SidebarItem icon={<BarChart3 />} text="Reports" />
        <SidebarItem icon={<Settings />} text="Settings" />
      </Sidebar>

      <div
        className={`flex flex-col transition-all duration-300 ${
          expanded ? "ml-64" : "ml-20"
        }`}
      >
        {/* --- NAVBAR --- */}
        <div className="navbar bg-base-200/50 rounded-box p-3 flex justify-around">
          {/* --- LEFT: Search Bar --- */}
          <div className="flex-1">
            <label className="input">
              <svg
                className="h-[1em] opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </g>
              </svg>
              <input type="search" required placeholder="Search" />
            </label>
          </div>

          {/* --- RIGHT: Actions & Profile --- */}
          <div className="flex-none flex items-center gap-3">
            {/* Mail Button */}
            {loading ? (
              <Skeleton className="size-10 shrink-0 rounded-full" />
            ) : (
              <button className="btn btn-circle bg-base-100 border-none shadow-sm hover:bg-base-200 h-11 w-11 min-h-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 text-base-content/70"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                  />
                </svg>
              </button>
            )}

            {/* Notification Button */}
            {loading ? (
              <Skeleton className="size-10 shrink-0 rounded-full" />
            ) : (
              <button className="btn btn-circle bg-base-100 border-none shadow-sm hover:bg-base-200 h-11 w-11 min-h-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 text-base-content/70"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                  />
                </svg>
              </button>
            )}

            {/* Profile Dropdown */}
            <div className="dropdown dropdown-end ml-1">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost hover:bg-base-200/50 h-auto min-h-0 py-1 px-2 rounded-full flex items-center gap-3 border-none shadow-none"
              >
                {loading ? (
                  <Skeleton className="size-10 shrink-0 rounded-full" />
                ) : (
                  <div className="avatar">
                    <div className="w-10 rounded-full bg-rose-200">
                      <img alt="User avatar" src="/public/images/user.png" />
                    </div>
                  </div>
                )}

                {/* User Info (Hidden on very small screens) */}
                {loading ? (
                  <div className="flex w-fit items-center gap-4">
                    <div className="grid gap-2">
                      <Skeleton className="h-4 w-[150px]" />
                      <Skeleton className="h-4 w-[100px]" />
                    </div>
                  </div>
                ) : (
                  <div className="hidden sm:flex flex-col items-start text-left pr-2">
                    <span className="text-sm font-bold text-base-content leading-tight">
                      {localStorage.getItem("username")}
                    </span>
                    <span className="text-xs text-base-content/60 font-normal mt-0.5">
                      {localStorage.getItem("email")}
                      {loggedInEmail}
                    </span>
                  </div>
                )}
              </div>

              {/* Dropdown Menu */}
              <ul
                tabIndex="-1"
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow-lg border border-base-200"
              >
                <li>
                  <a className="justify-between">Profile</a>
                </li>
                <li>
                  <a>Settings</a>
                </li>
                <li className="text-error" onClick={() => handleLogout()}>
                  <a>Logout</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* --- MAIN CONTENT --- */}
        <main className="flex-1 pt-4 px-6 lg:px-10 pb-10 overflow-y-auto">
          {isOnDashboard ? (
            <>
              {/* Header & Actions */}
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-base-content tracking-tight">
                    Overview
                  </h1>

                  {loading ? (
                    <Skeleton className="h-4 w-full" />
                  ) : (
                    <p className="text-base-content/60 mt-1 font-medium">
                      Welcome back, {username || "Nurse"} 👋
                    </p>
                  )}
                </div>
                <div className="flex gap-3">
                  {loading ? (
                    <Skeleton className="w-32 h-8 rounded-md" />
                  ) : (
                    <button
                      onClick={() => setShowRequestForm(true)}
                      className="btn btn-sm gap-2"
                    >
                      <ClipboardList className="w-4 h-4" /> Request Item
                    </button>
                  )}
                  {loading ? (
                    <Skeleton className="w-32 h-8 rounded-md" />
                  ) : (
                    <button
                      onClick={() => setShowForm(true)}
                      className="btn btn-sm gap-2"
                    >
                      <UserPlus className="w-4 h-4" /> Add Patient
                    </button>
                  )}
                  {loading ? (
                    <Skeleton className="w-32 h-8 rounded-md" />
                  ) : (
                    <button
                      onClick={() => ShowReportForm(true)}
                      className="btn  btn-sm "
                    >
                      Make report
                      <BarChart3 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* --- CARDS (Based on Dashboard.png) --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {/* Card 1: Green Primary */}
                {loading ? (
                  <Card className="w-full max-w-xs">
                    <CardHeader>
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="aspect-video w-full" />
                    </CardContent>
                  </Card>
                ) : (
                  <div className="bg-[#134e4a] rounded-3xl p-6 relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-110 transition"></div>
                    <div className="relative z-10 flex justify-between items-start">
                      <span className="text-emerald-100/80 font-medium text-sm">
                        Total Patients
                      </span>
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                    <h2 className="relative z-10 text-5xl font-bold text-white mt-4">
                      {patients.length}
                    </h2>
                    <div className="relative z-10 mt-4 flex items-center gap-2">
                      <span className="bg-emerald-500/20 text-emerald-100 text-xs px-2 py-1 rounded-lg border border-emerald-500/30">
                        +2 New
                      </span>
                    </div>
                  </div>
                )}

                {/* Card 2: Hospitalized */}
                {loading ? (
                  <Card className="w-full max-w-xs">
                    <CardHeader>
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="aspect-video w-full" />
                    </CardContent>
                  </Card>
                ) : (
                  <div className="bg-white rounded-3xl p-6 border border-gray-100 cozy-shadow hover:-translate-y-0.5 transition duration-300">
                    <div className="flex justify-between items-start">
                      <span className="text-gray-500 font-medium text-sm">
                        Hospitalized
                      </span>
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-emerald-600">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                    <h2 className="text-5xl font-bold text-gray-800 mt-4">
                      {patients.filter((p) => p.isHospitalized).length}
                    </h2>
                    <div className="mt-4 flex items-center gap-2">
                      <span className="bg-rose-50 text-rose-600 text-xs px-2 py-1 rounded-lg">
                        Critical Care
                      </span>
                    </div>
                  </div>
                )}

                {/* Card 3: Requests */}
                {loading ? (
                  <Card className="w-full max-w-xs">
                    <CardHeader>
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="aspect-video w-full" />
                    </CardContent>
                  </Card>
                ) : (
                  <div className="bg-white rounded-3xl p-6 border border-gray-100 cozy-shadow hover:-translate-y-0.5 transition duration-300">
                    <div className="flex justify-between items-start">
                      <span className="text-gray-500 font-medium text-sm">
                        Pending Requests
                      </span>
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                    <h2 className="text-5xl font-bold text-gray-800 mt-4">
                      {myRequests.filter((r) => r.Status === "pending").length}
                    </h2>
                    <div className="mt-4 flex items-center gap-2">
                      <span className="bg-amber-50 text-amber-600 text-xs px-2 py-1 rounded-lg">
                        Awaiting Approval
                      </span>
                    </div>
                  </div>
                )}

                {/* Card 4: Reports */}
                {loading ? (
                  <Card className="w-full max-w-xs">
                    <CardHeader>
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="aspect-video w-full" />
                    </CardContent>
                  </Card>
                ) : (
                  <div className="bg-white rounded-3xl p-6 border border-gray-100 cozy-shadow hover:-translate-y-0.5 transition duration-300">
                    <div className="flex justify-between items-start">
                      <span className="text-gray-500 font-medium text-sm">
                        Reports Generated
                      </span>
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                    <h2 className="text-5xl font-bold text-gray-800 mt-4">
                      {reports.length}
                    </h2>
                    <div className="mt-4 flex items-center gap-2">
                      <span className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-lg">
                        This Month
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* --- PATIENTS TABLE --- */}
                <div className="xl:col-span-2 bg-white rounded-3xl border border-gray-100 cozy-shadow overflow-hidden">
                  <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-gray-800">
                      Assigned Patients
                    </h3>
                    <div className="relative">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-2 bg-gray-50 rounded-xl text-sm border-none focus:ring-2 focus:ring-emerald-500/20 w-48"
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50/50">
                        <tr>
                          <th className="pl-6 py-4 text-xs font-semibold text-gray-400 uppercase">
                            Patient
                          </th>
                          <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase">
                            Condition
                          </th>
                          <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase">
                            Status
                          </th>
                          <th className="pr-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-base-300">
                        {loading ? (
                          <tr>
                            <td colSpan="4" className="p-6">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className="flex items-center gap-4 mb-4 p-4 rounded-lg bg-base-100"
                                >
                                  <div className="skeleton h-10 w-10 rounded-full shrink-0"></div>
                                  <div className="flex-1">
                                    <div className="skeleton h-4 w-32 mb-2"></div>
                                    <div className="skeleton h-3 w-24"></div>
                                  </div>
                                  <div className="skeleton h-8 w-16"></div>
                                </div>
                              ))}
                            </td>
                          </tr>
                        ) : (
                          filteredPatients.slice(0, 8).map((patient) => (
                            <tr
                              key={patient._id}
                              className="hover:bg-base-200 transition group"
                            >
                              <td className="pl-6 py-4">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={"/public/images/examination.png"}
                                    alt=""
                                    className="w-10 h-10 rounded-xl object-cover bg-base-300"
                                  />
                                  <div>
                                    <p className="font-bold text-sm text-base-content">
                                      {patient.firstName} {patient.lastName}
                                    </p>
                                    <p className="text-xs text-base-content/60">
                                      {patient.gender},{" "}
                                      {new Date().getFullYear() -
                                        new Date(
                                          patient.date,
                                        ).getFullYear()}{" "}
                                      yrs
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-4 text-sm text-base-content/80 font-medium">
                                {patient.disease}
                              </td>
                              <td className="px-4 py-4">
                                {patient.isHospitalized ? (
                                  <Badge variant="destructive">
                                    Hospitalized
                                  </Badge>
                                ) : (
                                  <Badge variant="default">In care...</Badge>
                                )}
                              </td>
                              <td className="pr-6 py-4 text-right">
                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => handleEdit(patient)}
                                    className="btn btn-ghost btn-xs btn-circle"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleHospitalize(patient._id)
                                    }
                                    className="btn btn-warning btn-xs btn-circle"
                                  >
                                    <ActivitySquare className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(patient._id)}
                                    className="btn btn-error btn-xs btn-circle"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end px-2">
                    <h2 className="text-xl font-bold text-slate-800">
                      Recent Activity
                    </h2>
                    <button
                      onClick={() => navigate("/reports")}
                      className="text-sm font-semibold text-blue-600 flex items-center gap-1 hover:underline"
                    >
                      View All <ArrowRight size={14} />
                    </button>
                  </div>

                  {/* Aesthetic Card Inspired by Image */}
                  {latestReport ? (
                    <div className="relative group bg-[#F8F9FD] rounded-[32px] p-6 shadow-xl shadow-blue-900/5 border border-white max-w-sm">
                      {/* User Profile Section */}
                      <div className="flex items-center gap-4 mb-6">
                        <div className="relative">
                          <Space wrap size={16}>
                            <Avatar size={64} icon={<UserOutlined />} />
                          </Space>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 leading-tight">
                            {latestReport.createdBy?.username || "Researcher"}
                          </h3>
                          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                            {new Date(
                              latestReport.createdAt,
                            ).toLocaleDateString(undefined, {
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-2">
                          <span className="bg-indigo-100 text-indigo-600 text-[10px] font-black px-2 py-1 rounded-md uppercase">
                            Title
                          </span>
                          <span className="text-sm font-bold text-slate-700 truncate">
                            {latestReport.title}
                          </span>
                        </div>

                        <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 italic">
                          "{latestReport.body}"
                        </p>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => navigate("/home/reports")}
                        className="w-full btn btn-sm  text-slate-700 font-bold text-sm transition-all flex items-center justify-center gap-2"
                      >
                        <FileText size={16} className="text-blue-500" />
                        Open Full Report
                      </button>
                    </div>
                  ) : (
                    <p>No reports</p>
                  )}
                </div>

                {/* --- REQUESTS LIST (Based on Requests.png style) --- */}
                <div className="card bg-base-100 shadow-md flex flex-col h-fit">
                  {/* Header */}
                  <div className="flex justify-between items-center px-4 pt-4 pb-2 border-b border-base-300">
                    <h3 className="text-lg font-semibold">My Requests</h3>

                    <button
                      onClick={fetchRequests}
                      className="btn btn-ghost btn-xs normal-case"
                    >
                      Refresh
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
                    {myRequests.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-10 text-gray-500 text-center">
                        {loading ? (
                          <Skeleton className="h-12 w-12 rounded-full" />
                        ) : (
                          <Inbox
                            size={55}
                            strokeWidth={1.5}
                            className="mb-3 opacity-50"
                          />
                        )}

                        <h2 className="text-base font-semibold">
                          No Requests Yet
                        </h2>

                        <p className="text-xs text-gray-400 mt-1 max-w-[200px]">
                          Requests you create will appear here.
                        </p>
                      </div>
                    ) : (
                      myRequests.slice(0, 4).map((req) => (
                        <div
                          key={req._id}
                          className="flex items-center justify-between p-3 rounded-xl transition 
          hover:bg-base-200 border border-transparent hover:border-base-300 group"
                        >
                          {/* Left */}
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Initial Badge */}
                            <div className="badge badge-accent badge-sm w-6 h-6 rounded-full font-semibold">
                              {req.itemName.substring(0, 2).toUpperCase()}
                            </div>

                            {/* Info */}
                            <div className="min-w-0">
                              <p className="text-sm font-semibold truncate">
                                {req.itemName}
                              </p>

                              <p className="text-xs text-base-content/60 truncate">
                                {req.requestType} • Qty: {req.quantity}
                              </p>
                            </div>
                          </div>

                          {/* Right */}
                          <div className="flex items-center gap-3">
                            {/* Status */}
                            <StatusBadge status={req.status} />

                            {/* Delete */}
                            <button
                              onClick={(e) => handleDeleteRequest(req._id, e)}
                              className="btn btn-ghost btn-xs btn-circle opacity-0 group-hover:opacity-100 transition"
                            >
                              <Trash2 className="w-4 h-4 text-error" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Footer */}
                  <div className="p-3 border-t border-base-300">
                    <button
                      onClick={() => setShowRequestForm(true)}
                      className="btn w-full btn-sm gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      New Request
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <Outlet
              context={{
                username,
                email,
                myRequests,
                patients,
                reports,
                showForm,
                setShowForm,
                showRequestForm,
                setShowRequestForm,
                filteredPatients,
                loading,
                searchTerm,
                setSearchTerm,
                handleEdit,
                handleDelete,
                handleHospitalize,
                handleDeleteRequest,
                handleRequestSubmit,
                StatusBadge,
                firstName,
                setFirstName,
                lastName,
                setLastName,
                gender,
                setGender,
                date,
                setDate,
                disease,
                setDisease,
                maritalStatus,
                setMaritalStatus,
                formError,
                editingPatientId,
                resetForm,
                handleSubmit,
                backendUrl,
                itemName,
                setItemName,
                quantity,
                setQuantity,
                urgency,
                setUrgency,
                reason,
                setReason,
                requestType,
                setRequestType,
              }}
            />
          )}
        </main>
      </div>

      {reportForm && (
        <dialog
          className="modal modal-open"
          onClick={() => ShowReportForm(false)}
        >
          <div
            className="modal-box w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-bold text-lg mb-6">Generate Report</h2>
            <form onSubmit={Report} className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Title</span>
                </label>
                <input
                  type="text"
                  required
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  placeholder="Enter report title"
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Observations</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Enter observations"
                  className="textarea textarea-bordered w-full"
                ></textarea>
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Conclusion</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={conclusion}
                  onChange={(e) => setConclusion(e.target.value)}
                  placeholder="Enter conclusion"
                  className="textarea textarea-bordered w-full"
                ></textarea>
              </div>
              <div className="modal-action">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => ShowReportForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {reporting ? (
                    <Loader2 className="animate-spin w-4 h-4" />
                  ) : (
                    "Submit Report"
                  )}
                </button>
              </div>
            </form>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => ShowReportForm(false)}>close</button>
          </form>
        </dialog>
      )}

      {showForm && (
        <dialog className="modal modal-open" onClick={() => setShowForm(false)}>
          <div
            className="modal-box w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-bold text-lg mb-6">
              {editingPatientId ? "Edit Patient" : "Add Patient"}
            </h2>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div>
                <label className="label">
                  <span className="label-text font-semibold">First Name</span>
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter first name"
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Last Name</span>
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter last name"
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">
                    Date of Birth
                  </span>
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Gender</span>
                </label>
                <select
                  required
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="select select-bordered w-full"
                >
                  <option value="">Select...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="label">
                  <span className="label-text font-semibold">
                    Condition / Disease
                  </span>
                </label>
                <input
                  type="text"
                  required
                  value={disease}
                  onChange={(e) => setDisease(e.target.value)}
                  placeholder="Enter condition"
                  className="input input-bordered w-full"
                />
              </div>
              <div className="md:col-span-2 modal-action">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="btn btn-sm">
                  {loading ? (
                    <Loader2 className="animate-spin w-4 h-4" />
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> Save Record
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setShowForm(false)}>close</button>
          </form>
        </dialog>
      )}

      {showRequestForm && (
        <dialog
          className="modal modal-open"
          onClick={() => setShowRequestForm(false)}
        >
          <div
            className="modal-box w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-bold text-lg mb-6">New Request</h2>
            <form onSubmit={handleRequestSubmit} className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Type</span>
                </label>
                <select
                  value={requestType}
                  onChange={(e) => setRequestType(e.target.value)}
                  className="select select-bordered w-full"
                >
                  <option>Medicine Request</option>
                  <option>Equipment Request</option>
                  <option>Supply Request</option>
                </select>
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Item Name</span>
                </label>
                <input
                  type="text"
                  required
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="Enter item name"
                  className="input input-bordered w-full"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">Quantity</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="0"
                    className="input input-bordered w-full"
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">Urgency</span>
                  </label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value)}
                    className="select select-bordered w-full"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Reason</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter reason"
                  className="textarea textarea-bordered w-full"
                ></textarea>
              </div>
              <div className="modal-action">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowRequestForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit Request
                </button>
              </div>
            </form>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setShowRequestForm(false)}>close</button>
          </form>
        </dialog>
      )}

      <ToastContainer
        position="bottom-right"
        toastClassName="!bg-white !text-gray-800 !rounded-xl !shadow-lg"
      />
    </div>
  );
}
