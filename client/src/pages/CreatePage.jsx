import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  useNavigate,
  Link,
  Outlet,
  useLocation,
  useParams,
} from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Inbox } from "lucide-react";
import { UserOutlined } from "@ant-design/icons";
import { Space } from "antd";
import Sidebar from "../components/sidebar.jsx";
import { SidebarItem } from "../components/sidebar.jsx";
import { Skeleton } from "@/components/ui/skeleton";
import { delay } from "./../utils/Delay.jsx";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { OrbitProgress } from "react-loading-indicators";
import { Avatar } from "@heroui/react";
import { Form } from "@heroui/react";

import {
  FloppyDisk,
  FolderOpen,
  SquarePlus,
  TrashBin,
} from "@gravity-ui/icons";
import { Button, Dropdown, Label, Input, AlertDialog } from "@heroui/react";
import {
  ChevronDown,
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

export default function NursePage() {
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // --- STATES ---
  const [editingPatientId, setEditingPatientId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [active, setActive] = useState(false);
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
  const [requestType, setRequestType] = useState("Medicine");
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
  const handleEdit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${backendUrl}/api/patients/${id}`,
        {
          firstName,
          lastName,
          gender,
          date,
          maritalStatus,
          disease,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    } catch (error) {
      console.log("Error updating patient", error);
    } finally {
      setUpdating(false);
    }
  };
  // const handleEdit = (patient) => {
  //   setEditingPatientId(patient._id);
  //   setFirstName(patient.firstName || "");
  //   setLastName(patient.lastName || "");
  //   setGender(patient.gender || "");
  //   setDate(patient.date ? patient.date.split("T")[0] : "");
  //   setMaritalStatus(patient.maritalStatus || "");
  //   setDisease(patient.disease || "");
  //   setShowForm(true);
  // };

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
        requestType,
        itemName,
        quantity,
        urgency,

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
      console.error(
        "Error submitting request:",
        error.response?.data || error.message,
      );
      toast.error(error.response?.data?.message || "Failed to submit request");
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
      <Sidebar expanded={expanded} setExpanded={setExpanded}>
        <SidebarItem
          icon={<Home />}
          onClick={() => navigate("/home")}
          text="Dashboard"
          active={location.pathname === "/home"}
        />
        <SidebarItem
          icon={<Users />}
          onClick={() => navigate("/home/patients")}
          text="Patients"
          active={location.pathname === "/home/patients"}
        />
        <SidebarItem
          icon={<ClipboardList />}
          text="Requests"
          onClick={() => navigate("/home/requests")}
          active={location.pathname === "/home/requests"}
        />
        <SidebarItem
          icon={<BarChart3 />}
          text="Reports"
          onClick={() => navigate("/home/reports")}
          active={location.pathname === "/home/reports"}
        />
        <SidebarItem
          icon={<Settings />}
          text="Settings"
          onClick={() => navigate("/home/settings")}
          active={location.pathname === "/home/settings"}
        />
      </Sidebar>
      <div className="flex-1 p-4"></div>
      <div
        className={`flex flex-col transition-all duration-300 ${
          expanded ? "ml-64" : "ml-20"
        }`}
      >
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
                <Dropdown>
                  <Button aria-label="Menu" variant="secondary">
                    Quick Actions
                  </Button>
                  <Dropdown.Popover>
                    <Dropdown.Menu>
                      <Dropdown.Item id="new-file" textValue="New file">
                        <div className="flex h-8 items-start justify-center pt-px">
                          <SquarePlus className="size-4 shrink-0" />
                        </div>
                        <div className="flex flex-col">
                          <Label onClick={() => setShowForm(true)}>
                            Add patient
                          </Label>
                        </div>
                      </Dropdown.Item>
                      <Dropdown.Item
                        id="open-file"
                        textValue="Open file"
                        onClick={() => setShowRequestForm(true)}
                      >
                        <div className="flex h-8 items-start justify-center pt-px">
                          <FolderOpen className="size-4 shrink-0" />
                        </div>
                        <div className="flex flex-col">
                          <Label>Create request</Label>
                        </div>
                      </Dropdown.Item>
                      <Dropdown.Item
                        id="save-file"
                        textValue="Save file"
                        onClick={() => ShowReportForm(true)}
                      >
                        <div className="flex h-8 items-start justify-center pt-px">
                          <FloppyDisk className="size-4 shrink-0" />
                        </div>
                        <div className="flex flex-col">
                          <Label>Make report</Label>
                        </div>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown.Popover>
                </Dropdown>
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

                  <div className="w-full">
                    <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white">
                      <table className="min-w-[700px] w-full text-left">
                        {/* HEADER */}
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase whitespace-nowrap">
                              Patient
                            </th>
                            <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase whitespace-nowrap">
                              Condition
                            </th>
                            <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase whitespace-nowrap">
                              Status
                            </th>
                            <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase text-right whitespace-nowrap">
                              Actions
                            </th>
                          </tr>
                        </thead>

                        {/* BODY */}
                        <tbody className="divide-y divide-gray-100">
                          {filteredPatients.length === 0 ? (
                            <tr>
                              <td colSpan="4" className="p-10 text-center">
                                <div className="flex flex-col items-center gap-4">
                                  <i className="fa-solid fa-user-xmark text-5xl text-gray-300"></i>
                                  <p className="text-gray-500">
                                    No patients found
                                  </p>
                                  <Button
                                    fullWidth
                                    variant="tertiary"
                                    onClick={() => setShowForm(true)}
                                    
                                  >
                                    Add Patient
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            filteredPatients.map((patient) => (
                              <tr
                                key={patient._id}
                                className="hover:bg-gray-50 transition"
                              >
                                {/* PATIENT */}
                                <td className="px-4 py-4">
                                  <div className="flex items-center gap-3 min-w-[180px]">
                                    <Avatar size="md">
                                      <Avatar.Image
                                        alt="Medium Avatar"
                                        src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/purple.jpg"
                                      />
                                      <Avatar.Fallback>MD</Avatar.Fallback>
                                    </Avatar>
                                    <div>
                                      <p className="font-semibold text-sm whitespace-nowrap">
                                        {patient.firstName} {patient.lastName}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {patient.gender}
                                      </p>
                                    </div>
                                  </div>
                                </td>

                                <td className="px-4 py-4 text-sm text-gray-700 whitespace-nowrap">
                                  {patient.disease}
                                </td>

                                <td className="px-4 py-4 whitespace-nowrap">
                                  {patient.isHospitalized ? (
                                    <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-600">
                                      Hospitalized
                                    </span>
                                  ) : (
                                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-600">
                                      In care
                                    </span>
                                  )}
                                </td>

                                <td className="px-4 py-4 text-right whitespace-nowrap">
                                  <div className="flex justify-end gap-2">
                                    <button
                                      onClick={()=> setShowForm(true)}
                                      className="p-2 rounded-full hover:bg-gray-100"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>

                                    <button
                                      onClick={() =>
                                        handleHospitalize(patient._id)
                                      }
                                      className="p-2 rounded-full hover:bg-yellow-100"
                                    >
                                      <ActivitySquare className="w-4 h-4" />
                                    </button>

                                    <button
                                      onClick={() => handleDelete(patient._id)}
                                      className="p-2 rounded-full hover:bg-red-100"
                                    >
                                      <Trash2 className="w-4 h-4 text-red-500" />
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
                          <Avatar>
                            <Avatar.Image
                              alt="Blue"
                              src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg"
                            />
                            <Avatar.Fallback>B</Avatar.Fallback>
                          </Avatar>
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
                      <Button
                        aria-label="Menu"
                        variant="secondary"
                        onClick={() => navigate("/home/reports")}
                      >
                        Open report
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-10 bg-slate-50/50 rounded-[32px] border-2 border-dashed border-slate-200 max-w-sm transition-all hover:border-blue-200">
                      <div>
                        <i class="fa-solid fa-file fa-5x"></i>
                      </div>
                      <h3 className="text-slate-800 font-bold text-base">
                        No Report Added Yet
                      </h3>
                      <p className="text-slate-500 text-xs text-center mt-1 px-4 leading-relaxed">
                        There are currently no reports to display. New activity
                        will appear here once generated.
                      </p>
                      <button
                        onClick={() => ShowReportForm(true)}
                        className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white text-gray-800 text-sm font-medium border border-gray-200 hover:bg-gray-50 active:bg-gray-100 transition-all duration-200"
                      >
                        {reporting ? (
                          <OrbitProgress />
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            <span>Create Report</span>
                          </>
                        )}
                      </button>
                    </div>
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
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Initial Badge */}
                            <div className="badge badge-accent badge-sm w-6 h-6 rounded-full font-semibold">
                              {req.itemName.substring(0, 2).toUpperCase()}
                            </div>

                            <div className="min-w-0">
                              <p className="text-sm font-semibold truncate">
                                {req.itemName}
                              </p>

                              <p className="text-xs text-base-content/60 truncate">
                                {req.requestType} • Qty: {req.quantity}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <StatusBadge status={req.status} />

                            <AlertDialog>
                              <Button
                                isIconOnly
                                onClick={(e) => handleDeleteRequest(req._id, e)}
                                className="btn btn-ghost btn-xs btn-circle opacity-0 group-hover:opacity-100 transition"
                              >
                                <Trash2 className="w-4 h-4 text-error" />
                              </Button>
                              <AlertDialog.Backdrop>
                                <AlertDialog.Container>
                                  <AlertDialog.Dialog className="sm:max-w-[400px]">
                                    <AlertDialog.CloseTrigger />
                                    <AlertDialog.Header>
                                      <AlertDialog.Icon status="danger" />
                                      <AlertDialog.Heading>
                                        Delete project permanently?
                                      </AlertDialog.Heading>
                                    </AlertDialog.Header>
                                    <AlertDialog.Body>
                                      <p>
                                        This will permanently delete{" "}
                                        <strong>My Awesome Project</strong> and
                                        all of its data. This action cannot be
                                        undone.
                                      </p>
                                    </AlertDialog.Body>
                                    <AlertDialog.Footer>
                                      <Button slot="close" variant="tertiary">
                                        Cancel
                                      </Button>
                                      <Button slot="close" variant="danger">
                                        Delete Project
                                      </Button>
                                    </AlertDialog.Footer>
                                  </AlertDialog.Dialog>
                                </AlertDialog.Container>
                              </AlertDialog.Backdrop>
                            </AlertDialog>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Footer */}
                  <div className="p-3 border-t border-base-300">
                    <button
                      onClick={() => setShowRequestForm(true)}
                      className="w-full mt-6 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white text-gray-800 text-sm font-medium border border-gray-200 hover:bg-gray-50 active:bg-gray-100 transition-all duration-200"
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
          className="modal modal-open bg-slate-900/40 backdrop-blur-sm"
          onClick={() => ShowReportForm(false)}
        >
          <div
            className="modal-box w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-bold text-lg mb-6">Generate Report</h2>
            <br></br>
            <br></br>
            <form onSubmit={Report} className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Title</span>
                </label>
                <br></br>
                <br></br>
                <input
                  type="text"
                  required
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  placeholder="Enter report title"
                  className="input bg-base-200 border-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Observations</span>
                </label>
                <br></br>
                <br></br>
                <textarea
                  required
                  rows={4}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Enter observations"
                  className="textarea textarea-bordered w-full bg-base-200 border-none focus:ring-2 focus:ring-primary/20 transition-all"
                ></textarea>
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Conclusion</span>
                </label>
                <br></br>
                <br></br>
                <textarea
                  required
                  rows={2}
                  value={conclusion}
                  onChange={(e) => setConclusion(e.target.value)}
                  placeholder="Enter conclusion"
                  className="textarea textarea-bordered w-full bg-base-200 border-none focus:ring-2 focus:ring-primary/20 transition-all"
                ></textarea>
              </div>
              <div className="modal-action">
                <Button
                  variant="danger"
                  type="button"
                  onClick={() => ShowReportForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {reporting ? (
                    <Loader2 className="animate-spin w-4 h-4" />
                  ) : (
                    "Submit Report"
                  )}
                </Button>
              </div>
            </form>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => ShowReportForm(false)}>close</button>
          </form>
        </dialog>
      )}

      {showForm && (
        <dialog
          className="modal modal-open bg-slate-900/40 backdrop-blur-sm"
          onClick={() => setShowForm(false)}
        >
          <div
            className="modal-box w-full max-w-2xl p-8 bg-base-100 rounded-2xl shadow-2xl border border-base-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-base-content">
                  {editingPatientId ? "Edit Patient" : "Add Patient"}
                </h2>
                <p className="text-sm text-base-content/60 mt-1">
                  Fill in the details below to{" "}
                  {editingPatientId ? "update" : "create"} the record.
                </p>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="btn btn-sm btn-circle btn-ghost"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5"
            >
              {/* First Name */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text text-xs font-bold uppercase tracking-wider opacity-70">
                    First Name
                  </span>
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. John"
                  className="input bg-base-200 border-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              {/* Last Name */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text text-xs font-bold uppercase tracking-wider opacity-70">
                    Last Name
                  </span>
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Doe"
                  className="input bg-base-200 border-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              {/* Date of Birth */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text text-xs font-bold uppercase tracking-wider opacity-70">
                    Date of Birth
                  </span>
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="input bg-base-200 border-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              {/* Gender Selection */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text text-xs font-bold uppercase tracking-wider opacity-70">
                    Gender
                  </span>
                </label>
                <select
                  required
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="select bg-base-200 border-none focus:ring-2 focus:ring-primary/20 transition-all font-normal"
                >
                  <option value="" disabled>
                    Select Gender
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              {/* Condition / Disease */}
              <div className="form-control w-full md:col-span-2">
                <label className="label">
                  <span className="label-text text-xs font-bold uppercase tracking-wider opacity-70">
                    Condition / Disease
                  </span>
                </label>
                <br />
                <br />
                <input
                  type="text"
                  required
                  value={disease}
                  onChange={(e) => setDisease(e.target.value)}
                  placeholder="e.g. Hypertension"
                  className="input bg-base-200 border-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              {/* Action Buttons */}
              <div className="md:col-span-2 flex justify-end gap-3 mt-6 pt-6 border-t border-base-200">
                <button
                  type="button"
                  className="btn btn-ghost hover:bg-base-200 px-6"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <Loader2 className="animate-spin w-4 h-4" />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Save className="w-4 h-4" />
                      <span>
                        {editingPatientId ? "Update Record" : "Save Record"}
                      </span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </dialog>
      )}

      {showRequestForm && (
        <dialog
          className="modal modal-open bg-slate-900/40 backdrop-blur-sm"
          onClick={() => setShowRequestForm(false)}
        >
          <div
            className="modal-box w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-bold text-lg mb-6">New Request</h2>
            <br></br>
            <br></br>
            <form onSubmit={handleRequestSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">Type</span>
                  </label>
                  <select
                    value={requestType}
                    onChange={(e) => setRequestType(e.target.value)}
                    className=" input bg-base-200 border-none focus:ring-2 focus:ring-primary/20 transition-all"
                  >
                    <option value="Medicine">Medicine Request</option>
                    <option value="Equipment">Equipment Request</option>
                    <option value="Supply">Supply Request</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <Label htmlFor="input-type-email">Item name</Label>
                  <Input
                    required
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    id="input-type-email"
                    placeholder="e.g. Paracetamol"
                    type="text"
                    className="input bg-base-200 border-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
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
                    className="input bg-base-200 border-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">Urgency</span>
                  </label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value)}
                    className="input bg-base-200 border-none focus:ring-2 focus:ring-primary/20 transition-all"
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
                <br></br>
                <br></br>
                <textarea
                  required
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter reason"
                  className="textarea bg-base-200 border-none focus:ring-2 focus:ring-primary/20 transition-all w-full"
                ></textarea>
              </div>
              <div className="modal-action">
                <Button
                  variant="danger"
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowRequestForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  Submit Request
                </Button>
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
