import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation } from "react-router-dom";
import { ButtonGroupContext, Popover, Spinner } from "flowbite-react";
import socket, { connectSocket } from "../socket.js";
import Sidebar, { SidebarItem } from "../components/sidebar.jsx";
import { Avatar } from "@heroui/react";
import { Envelope, Globe, Plus, TrashBin } from "@gravity-ui/icons";
import Metric from "../components/DailyMetric.jsx";
import { Button } from "@heroui/react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
//firebase imports
// Add these at the top of your AdminPage file
import { auth } from "../../firebase.js";
import { signOut } from "firebase/auth";

import {
  Users,
  Home,
  UserPlus,
  FileQuestion,
  RefreshCw,
  Loader2,
  Trash2,
  ClipboardList,
  Search,
  X,
  ArrowUpRight,
  Check,
  Bell,
  BarChart3,
  Megaphone,
  Settings,
  ArrowRight,
  LogOut,
} from "lucide-react";

export default function AdminPage() {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  // --- STATE ---
  const [patients, setPatients] = useState([]);
  const [requests, setRequests] = useState([]);
  const [reports, setReports] = useState([]);
  const [nurses, setNurses] = useState([]);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [settingsEmail, setSettingsEmail] = useState("");
  const [settingsPassword, setSettingsPassword] = useState("");
  const [settingsImageFile, setSettingsImageFile] = useState(null);
  const [settingsImagePreview, setSettingsImagePreview] = useState("");
  const [settingsMessage, setSettingsMessage] = useState("");
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [loadingReports, setLoadingReports] = useState(false);
  const [loadingNurses, setLoadingNurses] = useState(false);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [patientFirstName, setPatientFirstName] = useState("");
  const [patientLastName, setPatientLastName] = useState("");
  const [patientGender, setPatientGender] = useState("");
  const [patientDate, setPatientDate] = useState("");
  const [patientDisease, setPatientDisease] = useState("");
  const [patientImageFile, setPatientImageFile] = useState(null);
  const [patientImagePreview, setPatientImagePreview] = useState("");
  const [editError, setEditError] = useState("");

  // Form States
  const [em, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nurseUsername, setNurseUsername] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formRole, setFormRole] = useState("");
  const [adding, setAdding] = useState(false);
  const [approving, setApproving] = useState(false);

  // UI States
  const [searchTerm, setSearchTerm] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const path = location.pathname.toLowerCase();
    if (path.includes("/requests")) {
      setActiveSection("requests");
    } else if (path.includes("/reports")) {
      setActiveSection("reports");
    } else if (path.includes("/settings")) {
      setActiveSection("settings");
    } else if (path.includes("/patients")) {
      setActiveSection("patients");
    } else {
      setActiveSection("dashboard");
    }
  }, [location.pathname]);

  // --- DATA FETCHING ---
  const fetchPatients = async () => {
    setLoadingPatients(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${backendUrl}/api/patients/displayPatients`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setPatients(response.data);
    } catch (err) {
      console.error(err.message);
      toast.error("Error loading patients");
    } finally {
      setLoadingPatients(false);
    }
  };

  const fetchNurses = async () => {
    setLoadingNurses(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${backendUrl}/api/accounts/nurses/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNurses(response.data.nurses || []);
    } catch (err) {
      console.error(err);
      toast.error("Error loading nurses");
    } finally {
      setLoadingNurses(false);
    }
  };

  const fetchRequests = async () => {
    setLoadingRequests(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${backendUrl}/api/requests/showRequests`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const d = response.data;
      setRequests(
        Array.isArray(d) ? d : Array.isArray(d.requests) ? d.requests : [],
      );
    } catch (err) {
      console.error(err);
      toast.error("Error loading requests");
    } finally {
      setLoadingRequests(false);
    }
  };

  const fetchReports = async () => {
    setLoadingReports(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${backendUrl}/api/report/display_report`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const d = response.data;
      setReports(
        Array.isArray(d) ? d : Array.isArray(d.reports) ? d.reports : [],
      );
    } catch (err) {
      console.error(err);
      toast.error("Error loading reports");
    } finally {
      setLoadingReports(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${backendUrl}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setNotifications(response.data.notifications || []);
      }
    } catch (err) {
      console.error("Error loading notifications", err?.message || err);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${backendUrl}/api/infos/email`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const role = localStorage.getItem("role") || "admin";
      setUsername(response.data.username);
      setUserId(response.data._id || "");
      const absoluteImageUrl = response.data.image
        ? `${backendUrl}${response.data.image}`
        : "";
      setSettingsEmail(response.data.email || "");
      setSettingsImagePreview(absoluteImageUrl);
      // store image and username scoped to role to avoid overwriting session data
      localStorage.setItem(`${role}Username`, response.data.username);
      localStorage.setItem(`${role}Email`, response.data.email || "");
      localStorage.setItem(`${role}Image`, absoluteImageUrl);
      localStorage.setItem("image", absoluteImageUrl);
    } catch (error) {
      console.log(error);
    }
  };

  // --- EFFECTS ---
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || (role !== "admin" && role !== "doctor")) {
      navigate("/");
      return;
    }

    connectSocket();
    fetchUserInfo();
    fetchPatients();
    fetchNurses();
    fetchRequests();
    fetchReports();
    fetchNotifications();

    // Socket Listeners
    socket.on("newNurse", (newNurse) => {
      toast.info("New nurse added");
      setNurses((prev) => [newNurse, ...prev]);
    });
    socket.on("requestCreated", (req) => {
      toast.info("New request received");
      setRequests((prev) => [req, ...prev]);
    });
    socket.on("requestDeleted", (id) => {
      setRequests((prev) => prev.filter((r) => r._id !== id));
    });
    socket.on("patientCreated", (newPatient) => {
      toast.info("New patient added");
      setPatients((prev) => [newPatient, ...prev]);
    });
    socket.on("newNotification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      toast.info(notification.message);
    });
    socket.on("deletedMedicine", (id) => {
      setMedicines((prev) => prev.filter((m) => m._id !== id));
    });
    socket.on("reportDeleted", (id) => {
      setReports((prev) => prev.filter((r) => r._id !== id));
    });

    return () => {
      socket.off("newNurse");
      socket.off("requestCreated");
      socket.off("requestDeleted");
      socket.off("patientCreated");
      socket.off("newNotification");
      socket.off("deletedMedicine");
      socket.off("reportDeleted");
    };
  }, [navigate]);

  // --- HANDLERS ---
  const handleAccount = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      const response = await axios.post(`${backendUrl}/api/accounts/signup`, {
        username: nurseUsername,
        email: em,
        password,
        role: formRole,
      });
      if (response.data.success) {
        toast.success("Account created successfully");
        fetchNurses();
        setShowForm(false);
        // Reset form
        setEmail("");
        setPassword("");
        setFormRole("");
        setNurseUsername("");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error creating account");
    } finally {
      setAdding(false);
    }
  };

  const handleNurseDelete = async (id) => {
    if (!window.confirm("Delete this nurse?")) return;
    try {
      await axios.delete(`${backendUrl}/api/accounts/nurses/${id}`);
      toast.success("Deleted successfully");
      setNurses((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      toast.error("Error deleting nurse");
    }
  };

  const handleApprove = async (requestId) => {
    try {
      setApproving(true);
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${backendUrl}/api/requests/approve/${requestId}`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (response.data.success) {
        toast.success("Request approved!");
        fetchRequests();
      }
    } catch (error) {
      console.error(
        "Error approving request:",
        error.response?.data || error.message,
      );
      toast.error(error.response?.data?.message || "Error approving request");
    } finally {
      setApproving(false);
    }
  };
  const handleLogout = async () => {
  try {
    // 1. Terminate the active Google / Firebase session
    await signOut(auth);
  } catch (err) {
    console.error("Firebase sign out failed", err.message);
  }

  // 2. Clear all local storage values (Your exact code)
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
  
  toast.success("Logged out successfully");
  navigate("/doctorLogin");
};

  const handleDeleteRequest = async (requestId) => {
    if (!window.confirm("Delete this request?")) return;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${backendUrl}/api/requests/removeRequests/${requestId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (response.data.success) {
        toast.success("Request deleted");
        setRequests((prev) => prev.filter((r) => r._id !== requestId));
      }
    } catch (err) {
      toast.error("Error deleting request");
    }
  };

  const handleSettingsSubmit = async (event) => {
    event.preventDefault();
    setSettingsSaving(true);
    setSettingsMessage("");
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", settingsEmail);
      if (settingsPassword.trim()) {
        formData.append("password", settingsPassword);
      }
      if (settingsImageFile) {
        formData.append("image", settingsImageFile);
      }

      const response = await axios.put(
        `${backendUrl}/api/accounts/nurses/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      if (response.data.success) {
        const updatedUser = response.data.nurse;
        setUsername(updatedUser.username);
        setSettingsEmail(updatedUser.email || "");
        const absoluteImageUrl = updatedUser.image
          ? `${backendUrl}${updatedUser.image}`
          : "";
        setSettingsImagePreview(absoluteImageUrl);
        setSettingsPassword("");
        setSettingsImageFile(null);
        setSettingsMessage("Profile updated successfully.");
        const role = localStorage.getItem("role") || "admin";
        localStorage.setItem(`${role}Username`, updatedUser.username);
        localStorage.setItem(`${role}Email`, updatedUser.email || "");
        localStorage.setItem(`${role}Image`, absoluteImageUrl);
        localStorage.setItem("image", absoluteImageUrl);
      } else {
        setSettingsMessage(
          response.data.message || "Unable to update profile.",
        );
      }
    } catch (error) {
      setSettingsMessage(
        error.response?.data?.message || "Error saving profile.",
      );
      console.error("Profile update failed:", error);
    } finally {
      setSettingsSaving(false);
    }
  };

  const handleOpenPatientEdit = (patient) => {
    setEditingPatient(patient);
    setPatientFirstName(patient.firstName || "");
    setPatientLastName(patient.lastName || "");
    setPatientGender(patient.gender || "");
    setPatientDate(patient.date ? patient.date.split("T")[0] : "");
    setPatientDisease(patient.disease || "");
    setPatientImageFile(null);
    setPatientImagePreview(getPatientImageUrl(patient.image));
    setEditError("");
    setShowPatientModal(true);
  };

  const handleSavePatient = async (event) => {
    event.preventDefault();
    if (!editingPatient) return;

    try {
      const token = localStorage.getItem("token");
      const payload = {
        firstName: patientFirstName,
        lastName: patientLastName,
        gender: patientGender,
        date: patientDate,
        disease: patientDisease,
      };

      const response = await axios.put(
        `${backendUrl}/api/patients/${editingPatient._id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setPatients((prev) =>
        prev.map((p) => (p._id === editingPatient._id ? response.data : p)),
      );
      setShowPatientModal(false);
      setEditingPatient(null);
      setEditError("");
    } catch (err) {
      console.error("Update failed", err);
      setEditError(err.response?.data?.message || "Unable to update patient.");
    }
  };

  // --- FILTERING ---
  const filteredPatients = patients.filter((patient) => {
    const term = searchTerm.toLowerCase();
    const fullName =
      `${patient.firstName} ${patient.lastName || ""}`.toLowerCase();
    return (
      fullName.includes(term) ||
      (patient.disease || "").toLowerCase().includes(term)
    );
  });

  const patientGenderChartData = [
    {
      name: "Male",
      value: patients.filter((patient) => patient.gender === "Male").length,
    },
    {
      name: "Female",
      value: patients.filter((patient) => patient.gender === "Female").length,
    },
  ];
  const patientGenderColors = ["#2563eb", "#ec4899"];

  const getPatientImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath;
    return `${backendUrl}${imagePath}`;
  };

  // --- SUB-COMPONENTS ---

  // Status Badge Component
  const StatusBadge = ({ status }) => {
    const s = status?.toLowerCase() || "pending";
    if (s === "approved") {
      return (
        <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-100 border border-emerald-200 gap-1.5">
          <Check className="w-3 h-3 text-emerald-600" />
          <span className="text-emerald-700 font-bold text-xs">Approved</span>
        </div>
      );
    }
    if (s === "pending") {
      return (
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-amber-50 border border-amber-200 gap-1.5 shadow-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
          <span className="text-amber-600 font-bold text-xs uppercase tracking-wide">
            Pending
          </span>
        </div>
      );
    }
    return (
      <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-red-100 border border-red-200 gap-1.5">
        <X className="w-3 h-3 text-red-600" />
        <span className="text-red-700 font-bold text-xs">Rejected</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-base-200 font-sans flex">
      <Sidebar expanded={expanded} setExpanded={setExpanded}>
        <SidebarItem
          icon={<Home />}
          onClick={() => {
            setActiveSection("dashboard");
            navigate("/home/admin");
          }}
          text="Dashboard"
          active={activeSection === "dashboard"}
        />
        <SidebarItem
          icon={<Users />}
          onClick={() => {
            setActiveSection("patients");
            navigate("/home/admin/patients");
          }}
          text="Patients"
          active={activeSection === "patients"}
        />
        <SidebarItem
          icon={<ClipboardList />}
          onClick={() => {
            setActiveSection("requests");
            navigate("/home/admin/requests");
          }}
          text="Requests"
          active={activeSection === "requests"}
        />
        <SidebarItem
          icon={<BarChart3 />}
          onClick={() => {
            setActiveSection("reports");
            navigate("/home/admin/reports");
          }}
          text="Reports"
          active={activeSection === "reports"}
        />
        <SidebarItem
          icon={<Settings />}
          onClick={() => {
            setActiveSection("settings");
            navigate("/home/admin/settings");
          }}
          text="Settings"
          active={activeSection === "settings"}
        />
      </Sidebar>

      {/* --- Main Container (Sidebar + Content) --- */}
      <div
        className={`flex-1 flex flex-col ${expanded ? "ml-[250px]" : "ml-[90px]"} transition-all`}
      >
        {/* --- MAIN CONTENT --- */}
        <main className="flex-1 pt-4 px-6 lg:px-10 pb-10 overflow-y-auto">
          {activeSection === "dashboard" && (
            <>
              {/* HEADER SECTION */}
              <div className="flex flex-col gap-4 mb-8">
                <div className="flex items-center justify-between w-full gap-4">
                  <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                    Dashboard
                  </h1>

                  {/* 1. Relative Wrapper with "group" tells CSS to watch for hovers here */}
                  <div className="relative group flex items-center gap-2 text-sm text-gray-600 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-xl cursor-pointer transition-colors duration-200">
                    <Megaphone className=" relative w-6 h-6 text-blue-500" />
                    <div className="absolute -top-2 right-0 w-5 h-5 rounded-full bg-emerald-700 flex items-center justify-center text-white text-xs font-bold">{notifications.length}</div>
                    <span className="font-medium">Notifications</span>
                  

                    
                    <div className="absolute top-full right-0 w-full h-2 hidden group-hover:block"></div>

                 
                    <div className="absolute right-0 top-[calc(100%+8px)] w-96 bg-white border border-gray-200 hidden group-hover:block z-50 shadow-xl transition-all duration-200 animate-fade-in origin-top-right">
                      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            Recent notifications
                          </p>
                        
                        
                        </div>
                        <span className="text-xs text-gray-500">
                          {notifications.length} total
                        </span>
                      </div>

                      <div className="max-h-[350px] overflow-y-auto relative">
                        <div className="absolute -top-2 right-3 w-3 h-3 bg-white hidden group-hover:block rotate-45"></div>
                        {notifications.length === 0 ? (
                          <div className="p-4 text-sm text-gray-500">
                            No notifications yet.
                          </div>
                        ) : (
                          notifications.slice(0, 8).map((item) => (
                            <div
                              key={item._id || item.id}
                              className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150"
                            >
                              <div className="flex items-center justify-between gap-3">
                                <p className="font-semibold text-gray-900 text-sm">
                                  {item.title}
                                </p>
                                <span className="text-[10px] text-gray-500 uppercase tracking-[0.12em] font-bold">
                                  {item.type}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                {item.message}
                              </p>
                              <p className="text-[10px] text-gray-400 mt-2">
                                {new Date(item.createdAt).toLocaleString()}
                              </p>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Footer */}
                      <div className="p-3 border-t border-gray-100 text-center bg-gray-50 rounded-b-2xl">
                        <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 transition-colors">
                          View all notifications
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <p className="text-gray-500 mt-1 text-sm font-medium">
                  Plan, prioritize, and accomplish your tasks with ease.
                </p>

                {/* QUICK ACTIONS */}
                <div className="flex items-center gap-3">
                  <Button variant="secondary" onClick={() => setShowForm(true)}>
                    <Plus />
                    Add Member
                  </Button>

                  <Button onClick={fetchReports} variant="secondary">
                    <RefreshCw className="w-4 h-4" />
                    <span>Sync Data</span>
                  </Button>
                </div>
              </div>

              {/* STATS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8 mt-8">
                {/* CARD 1: DARK GREEN (PRIMARY) */}
                <div className="bg-emerald-900 rounded-3xl p-6 relative overflow-hidden group transition-all duration-300 hover:shadow-xl hover:shadow-emerald-900/20">
                  <div className="absolute -right-6 -top-6 w-32 h-32 bg-emerald-800 rounded-full opacity-50 blur-2xl group-hover:scale-110 transition-transform"></div>
                  <div className="relative z-10 flex justify-between items-start">
                    <span className="text-emerald-100 font-medium text-sm">
                      Total Patients
                    </span>
                    <div className="w-8 h-8 rounded-full bg-emerald-800/50 flex items-center justify-center border border-emerald-700/50 text-white cursor-pointer hover:bg-emerald-700 transition">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="relative z-10 mt-4">
                    <h2 className="text-5xl font-bold text-white tracking-tight">
                      {patients.length}
                    </h2>
                  </div>
                  <div className="relative z-10 mt-6 flex items-center gap-2">
                    <span className="bg-emerald-800 text-emerald-100 text-xs px-2 py-1 rounded-lg border border-emerald-700">
                      {patients.length} Patients
                    </span>
                    <span className="text-emerald-200/80 text-xs">
                      Increased from last month
                    </span>
                  </div>
                </div>

                {/* CARD 2: PENDING REQUESTS */}
                <div className="bg-white rounded-3xl p-6 border border-gray-100 cozy-shadow cozy-card-hover transition-all">
                  <div className="flex justify-between items-start">
                    <span className="text-gray-500 font-medium text-sm">
                      Pending Requests
                    </span>
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-gray-100 text-gray-400 hover:text-emerald-600 hover:border-emerald-200 transition cursor-pointer">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <h2 className="text-5xl font-bold text-gray-800 tracking-tight">
                      {requests.filter((r) => r.status === "pending").length}
                    </h2>
                  </div>
                  <div className="mt-6 flex items-center gap-2">
                    <span className="bg-amber-50 text-amber-600 text-xs px-2 py-1 rounded-lg border border-amber-100">
                      {requests.filter((r) => r.status === "pending").length}{" "}
                      Pending
                    </span>
                    <span className="text-gray-400 text-xs">Active Tasks</span>
                  </div>
                </div>

                {/* CARD 3: NURSES */}
                <div className="bg-white rounded-3xl p-6 border border-gray-100 cozy-shadow cozy-card-hover transition-all">
                  <div className="flex justify-between items-start">
                    <span className="text-gray-500 font-medium text-sm">
                      Active Nurses
                    </span>
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-gray-100 text-gray-400 hover:text-emerald-600 hover:border-emerald-200 transition cursor-pointer">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <h2 className="text-5xl font-bold text-gray-800 tracking-tight">
                      {nurses.length}
                    </h2>
                  </div>
                  <div className="mt-6 flex items-center gap-2">
                    <span className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-lg border border-blue-100">
                      {nurses.length} Nurses
                    </span>
                    <span className="text-gray-400 text-xs">
                      Currently hired
                    </span>
                  </div>
                </div>

                {/* CARD 4: REPORTS */}
                <div className="bg-white rounded-3xl p-6 border border-gray-100 cozy-shadow cozy-card-hover transition-all">
                  <div className="flex justify-between items-start">
                    <span className="text-gray-500 font-medium text-sm">
                      Total Reports
                    </span>
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-gray-100 text-gray-400 hover:text-emerald-600 hover:border-emerald-200 transition cursor-pointer">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <h2 className="text-5xl font-bold text-gray-800 tracking-tight">
                      {reports.length}
                    </h2>
                  </div>
                  <div className="mt-6 flex items-center gap-2">
                    <span className="bg-purple-50 text-purple-600 text-xs px-2 py-1 rounded-lg border border-purple-100">
                      {reports.length} Generated
                    </span>
                    <span className="text-gray-400 text-xs">This month</span>
                  </div>
                </div>
              </div>
              <div className="w-full hover:bg-gray-50 rounded-3xl border border-gray-100 cozy-shadow p-6 mb-8 transition-all">
                <Metric />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* LEFT COLUMN: REQUESTS & PATIENTS */}

                <div className="xl:col-span-2 space-y-8">
                  {/* REQUESTS TABLE */}
                  <div className="bg-white rounded-3xl border border-gray-100 cozy-shadow overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                      <h3 className="font-bold text-lg text-gray-800">
                        Recent Requests
                      </h3>
                      <div className="flex gap-2">
                        <button
                          onClick={fetchRequests}
                          className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-emerald-600 transition"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left border-b border-gray-50">
                            <th className="pl-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider w-16">
                              Image
                            </th>
                            <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                              Message
                            </th>
                            <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="pr-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {loadingRequests ? (
                            <tr>
                              <td
                                colSpan="5"
                                className="py-10 text-center text-gray-400"
                              >
                                <Spinner />
                              </td>
                            </tr>
                          ) : requests.length === 0 ? (
                            <tr>
                              <td
                                colSpan="5"
                                className="py-10 text-center text-gray-400"
                              >
                                <div className="flex flex-col gap-3">
                                  <i class="fa-solid fa-file-circle-xmark fa-5x"></i>
                                  No new requests
                                </div>
                              </td>
                            </tr>
                          ) : (
                            requests.map((req) => (
                              <tr
                                key={req._id}
                                className="group hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0"
                              >
                                <td className="pl-6 py-4">
                                  <img
                                    src={
                                      req.senderImage ||
                                      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
                                    }
                                    alt="Avatar"
                                    className="w-10 h-10 rounded-full object-cover border border-gray-100"
                                  />
                                </td>
                                <td className="px-4 py-4">
                                  <p className="text-sm font-semibold text-gray-800">
                                    {req.reason || "General Request"}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-0.5">
                                    ID: #{req._id.slice(-4)}
                                  </p>
                                </td>
                                <td className="px-4 py-4">
                                  <span className="text-sm text-gray-500 font-medium">
                                    {new Date(req.createdAt).toLocaleDateString(
                                      undefined,
                                      { month: "short", day: "numeric" },
                                    )}
                                  </span>
                                </td>
                                <td className="px-4 py-4">
                                  <StatusBadge status={req.status} />
                                </td>
                                <td className="pr-6 py-4 text-right">
                                  <div className="flex items-center justify-end gap-3">
                                    {req.status === "pending" && (
                                      <button
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleApprove(req._id);
                                        }}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-all shadow-sm shadow-emerald-200"
                                      >
                                        {approving ? (
                                          <Loader2 className="w-3 h-3 animate-spin" />
                                        ) : (
                                          <Check className="w-3 h-3" />
                                        )}
                                        <span>Approve</span>
                                      </button>
                                    )}
                                    <button
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleDeleteRequest(req._id);
                                      }}
                                      className="p-1.5 rounded-lg text-gray-300 hover:bg-red-50 hover:text-red-500 transition"
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

                  {/* PATIENTS TABLE */}
                  <div className="bg-white rounded-3xl border border-gray-100 cozy-shadow overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex items-center justify-between flex-wrap gap-4">
                      <h3 className="font-bold text-lg text-gray-800">
                        Current Patients
                      </h3>
                      <div className="relative">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Search patients..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-9 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm w-48 focus:ring-2 focus:ring-emerald-500/20"
                        />
                      </div>
                    </div>

                    <div className="overflow-x-auto max-h-[500px] custom-scrollbar">
                      <table className="w-full text-left">
                        <thead className="bg-gray-50/50 sticky top-0 backdrop-blur-sm z-10">
                          <tr>
                            <th className="pl-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                              Patient Name
                            </th>
                            <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase">
                              Condition
                            </th>
                            <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase">
                              Status
                            </th>
                            <th className="pr-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">
                              Managed By
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {loadingPatients ? (
                            <tr>
                              <td colSpan="4" className="py-10 text-center">
                                <Spinner />
                              </td>
                            </tr>
                          ) : (
                            filteredPatients.map((p) => (
                              <tr
                                key={p._id}
                                className="hover:bg-gray-50 transition cursor-pointer"
                              >
                                <td className="pl-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gray-200 overflow-hidden">
                                      <Avatar>
                                        <Avatar.Image
                                          alt="Blue"
                                          src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"
                                        />
                                        <Avatar.Fallback>B</Avatar.Fallback>
                                      </Avatar>
                                    </div>
                                    <div>
                                      <p className="text-sm font-bold text-gray-900">
                                        {p.firstName} {p.lastName}
                                      </p>
                                      <p className="text-xs text-gray-400">
                                        {p.email || "No email"}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-4">
                                  <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                                    {p.disease || "Checkup"}
                                  </span>
                                </td>
                                <td className="px-4 py-4">
                                  <span
                                    className={`text-xs font-bold px-2 py-1 rounded-full border ${
                                      p.Status === "hospitalized"
                                        ? "bg-rose-50 text-rose-600 border-rose-100"
                                        : "bg-emerald-50 text-emerald-600 border-emerald-100"
                                    }`}
                                  >
                                    {p.Status || "Active"}
                                  </span>
                                </td>
                                <td className="pr-6 py-4 text-right">
                                  <div className="flex justify-end gap-2">
                                    <button
                                      onClick={() => handleOpenPatientEdit(p)}
                                      className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
                                    >
                                      Edit
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
                </div>

                {/* RIGHT COLUMN: NURSES & PROFILE */}
                <div className="space-y-8">
                  <div className="bg-white rounded-3xl border border-gray-100 cozy-shadow p-6 sticky top-24">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-bold text-lg text-gray-800">
                        Nursing Staff
                      </h3>
                      <button
                        onClick={fetchNurses}
                        className="text-xs font-bold text-emerald-600 hover:underline"
                      >
                        View All
                      </button>
                    </div>

                    <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                      {loadingNurses ? (
                        <Spinner />
                      ) : (
                        nurses.map((nurse, i) => (
                          <div
                            key={nurse._id || i}
                            className="flex items-center gap-3 p-3 rounded-2xl border border-transparent hover:border-gray-100 hover:bg-gray-50 transition-all group"
                          >
                            <img
                              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face"
                              alt="Nurse"
                              className="w-10 h-10 rounded-full object-cover shadow-sm"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-bold text-gray-800 truncate">
                                {nurse.username}
                              </h4>
                              <p className="text-xs text-gray-400 truncate">
                                {nurse.email}
                              </p>
                            </div>
                            <button
                              onClick={() => handleNurseDelete(nurse._id)}
                              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>

                    <button
                      onClick={() => setShowForm(true)}
                      className="w-full mt-6 py-3 rounded-xl border border-dashed border-gray-300 text-gray-500 font-medium hover:border-emerald-500 hover:text-emerald-600 transition flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Add New Staff
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeSection === "reports" && (
            <>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-8">
                Reports
              </h1>
              <div className="bg-white rounded-3xl border border-gray-100 cozy-shadow overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                  <h3 className="font-bold text-lg text-gray-800">
                    All Reports
                  </h3>
                  <button
                    onClick={fetchReports}
                    className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-emerald-600 transition"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
                <div className="overflow-x-auto max-h-[600px] custom-scrollbar">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50/50 sticky top-0">
                      <tr>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                          Title
                        </th>
                        <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase">
                          Body
                        </th>
                        <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {loadingReports ? (
                        <tr>
                          <td colSpan="3" className="py-10 text-center">
                            <Spinner />
                          </td>
                        </tr>
                      ) : reports.length === 0 ? (
                        <tr>
                          <td
                            colSpan="3"
                            className="py-10 text-center text-gray-400"
                          >
                            No reports found
                          </td>
                        </tr>
                      ) : (
                        reports.map((report) => (
                          <tr
                            key={report._id}
                            className="hover:bg-gray-50 transition"
                          >
                            <td className="px-6 py-4">
                              <p className="text-sm font-bold text-gray-900">
                                {report.title || "Untitled"}
                              </p>
                            </td>
                            <td className="px-4 py-4">
                              <p className="text-sm text-gray-600 truncate">
                                {report.body || "No description"}
                              </p>
                            </td>
                            <td className="px-4 py-4">
                              <span className="text-sm text-gray-500">
                                {new Date(
                                  report.createdAt,
                                ).toLocaleDateString()}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeSection === "patients" && (
            <>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-8">
                Patients
              </h1>
              <div className="bg-white rounded-3xl border border-gray-100 cozy-shadow overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex items-center justify-between flex-wrap gap-4">
                  <h3 className="font-bold text-lg text-gray-800">
                    All Patients
                  </h3>
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search patients..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm w-48 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>
                <div className="overflow-x-auto max-h-[600px] custom-scrollbar">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50/50 sticky top-0">
                      <tr>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                          Patient Name
                        </th>
                        <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase">
                          Condition
                        </th>
                        <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {loadingPatients ? (
                        <tr>
                          <td colSpan="3" className="py-10 text-center">
                            <Spinner />
                          </td>
                        </tr>
                      ) : (
                        filteredPatients.map((p) => (
                          <tr
                            key={p._id}
                            className="hover:bg-gray-50 transition"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gray-200 overflow-hidden">
                                  <Avatar>
                                    <Avatar.Image
                                      alt="Avatar"
                                      src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"
                                    />
                                    <Avatar.Fallback>P</Avatar.Fallback>
                                  </Avatar>
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-gray-900">
                                    {p.firstName} {p.lastName}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    {p.email || "No email"}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                                {p.disease || "Checkup"}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <span
                                className={`text-xs font-bold px-2 py-1 rounded-full border ${
                                  p.Status === "hospitalized"
                                    ? "bg-rose-50 text-rose-600 border-rose-100"
                                    : "bg-emerald-50 text-emerald-600 border-emerald-100"
                                }`}
                              >
                                {p.Status || "Active"}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
          {activeSection === "requests" && (
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-8">
                Requests
              </h1>
              <div className="bg-white rounded-3xl border border-gray-100 cozy-shadow overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                  <h3 className="font-bold text-lg text-gray-800">
                    All Requests
                  </h3>
                  <button
                    onClick={fetchRequests}
                    className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-emerald-600 transition"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
                <div className="overflow-x-auto max-h-[600px] custom-scrollbar">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50/50 sticky top-0">
                      <tr>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                          Message
                        </th>
                        <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase">
                          Sender
                        </th>
                        <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase">
                          Date
                        </th>
                        <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {loadingRequests ? (
                        <tr>
                          <td colSpan="4" className="py-10 text-center">
                            <Spinner />
                          </td>
                        </tr>
                      ) : requests.length === 0 ? (
                        <tr>
                          <td
                            colSpan="4"
                            className="py-10 text-center text-gray-400"
                          >
                            No requests found
                          </td>
                        </tr>
                      ) : (
                        requests.map((req) => (
                          <tr
                            key={req._id}
                            className="hover:bg-gray-50 transition"
                          >
                            <td className="px-6 py-4">
                              <p className="text-sm font-bold text-gray-900">
                                {req.reason || "General Request"}
                              </p>
                            </td>
                            <td className="px-4 py-4">
                              <p className="text-sm text-gray-600">
                                {req.createdBy.username || "Unknown Sender"}
                              </p>
                            </td>
                            <td className="px-4 py-4">
                              <span className="text-sm text-gray-500">
                                {new Date(req.createdAt).toLocaleDateString()}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <StatusBadge status={req.status} />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          
          {activeSection === "settings" && (
            <>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-8">
                Settings
              </h1>
              <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
                <div className="bg-white rounded-3xl border border-gray-100 cozy-shadow p-8">
                  <div className="flex flex-col items-center gap-4 text-center">
                    <div className="relative rounded-full overflow-hidden w-32 h-32 border-4 border-emerald-100 shadow-sm">
                      <img
                        src={
                          settingsImagePreview ||
                          "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=200&h=200&fit=crop&crop=faces"
                        }
                        alt="Profile"
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {username || "Admin"}
                      </h2>
                      <p className="text-sm text-gray-500">
                        Administrator profile
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 space-y-6">
                    <div className="rounded-3xl bg-slate-50 p-5 border border-slate-100">
                      <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-[0.2em] mb-3">
                        Profile image
                      </h3>
                      <p className="text-sm text-slate-500 mb-4">
                        Upload a new avatar for your admin account.
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0] ?? null;
                          setSettingsImageFile(file);
                          setSettingsImagePreview(
                            file
                              ? URL.createObjectURL(file)
                              : settingsImagePreview,
                          );
                        }}
                        className="w-full text-sm text-gray-600 file:mr-4 file:rounded-full file:border-0 file:bg-emerald-600 file:px-4 file:py-2 file:text-sm file:text-white"
                      />
                    </div>

                    <div className="rounded-3xl bg-slate-50 p-5 border border-slate-100">
                      <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-[0.2em] mb-3">
                        Account info
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">
                            Name
                          </label>
                          <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full rounded-3xl border border-gray-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            value={settingsEmail}
                            onChange={(e) => setSettingsEmail(e.target.value)}
                            className="w-full rounded-3xl border border-gray-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">
                            New password
                          </label>
                          <input
                            type="password"
                            placeholder="Leave blank to keep current"
                            value={settingsPassword}
                            onChange={(e) =>
                              setSettingsPassword(e.target.value)
                            }
                            className="w-full rounded-3xl border border-gray-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 cozy-shadow p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        Admin Settings
                      </h3>
                      <p className="text-sm text-gray-500">
                        Edit your profile information and avatar.
                      </p>
                    </div>
                    <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      Secure updates
                    </span>
                  </div>

                  <form onSubmit={handleSettingsSubmit} className="space-y-6">
                    <div className="rounded-3xl bg-slate-50 p-5 border border-slate-100">
                      <p className="text-sm font-medium text-slate-700 mb-2">
                        Profile preview
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-200">
                          <img
                            src={
                              settingsImagePreview ||
                              "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=200&h=200&fit=crop&crop=faces"
                            }
                            alt="Profile preview"
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {username || "Your profile"}
                          </p>
                          <p className="text-xs text-slate-500">
                            {settingsEmail || "No email set"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {settingsMessage && (
                      <div className="rounded-3xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        {settingsMessage}
                      </div>
                    )}

                    <Button type="submit" disabled={settingsSaving || !userId}>
                      {settingsSaving ? "Saving..." : "Save profile"}
                    </Button>
                  </form>
                </div>
              </div>
            </>
          )}
        </main>

        {/* MODAL: ADD NURSE */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm"
              onClick={() => setShowForm(false)}
            ></div>
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animation-fade-in-up">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">
                  Create Account
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAccount} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    value={nurseUsername}
                    onChange={(e) => setNurseUsername(e.target.value)}
                    className="w-full rounded-xl border-gray-200 bg-gray-50 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={em}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border-gray-200 bg-gray-50 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Role
                    </label>
                    <select
                      required
                      value={formRole}
                      onChange={(e) => setFormRole(e.target.value)}
                      className="w-full rounded-xl border-gray-200 bg-gray-50 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                    >
                      <option value="">Select...</option>
                      <option value="nurse">Nurse</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border-gray-200 bg-gray-50 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={adding}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-200 transition mt-4 flex items-center justify-center gap-2"
                >
                  {adding ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {showPatientModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setShowPatientModal(false)}
            />
            <div className="relative z-10 w-full max-w-xl rounded-3xl bg-white shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Edit Patient
                  </h2>
                  <p className="text-sm text-gray-500">
                    Update patient details and save changes.
                  </p>
                </div>
                <button
                  onClick={() => setShowPatientModal(false)}
                  className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form
                onSubmit={handleSavePatient}
                className="p-6 grid gap-5 md:grid-cols-2"
              >
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase text-slate-500">
                    First name
                  </label>
                  <input
                    value={patientFirstName}
                    onChange={(e) => setPatientFirstName(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase text-slate-500">
                    Last name
                  </label>
                  <input
                    value={patientLastName}
                    onChange={(e) => setPatientLastName(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase text-slate-500">
                    Gender
                  </label>
                  <select
                    value={patientGender}
                    onChange={(e) => setPatientGender(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3"
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase text-slate-500">
                    Date of birth
                  </label>
                  <input
                    type="date"
                    value={patientDate}
                    onChange={(e) => setPatientDate(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3"
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-semibold uppercase text-slate-500">
                    Condition / disease
                  </label>
                  <input
                    value={patientDisease}
                    onChange={(e) => setPatientDisease(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3"
                    required
                  />
                </div>
                {editError && (
                  <div className="md:col-span-2 rounded-2xl bg-rose-50 border border-rose-100 p-4 text-rose-700">
                    {editError}
                  </div>
                )}
                <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPatientModal(false)}
                    className="rounded-2xl border border-gray-200 px-6 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
                  >
                    Save Patient
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <ToastContainer position="bottom-right" />
      </div>
    </div>
  );
}
