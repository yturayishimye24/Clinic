import React, { useState, useEffect } from 'react';
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";
import {Outlet,Link} from "react-router-dom"
import DropdownMenuDemo from "../components/button.jsx"
import { 
  ResponsiveContainer, BarChart, Bar,Cell, XAxis, YAxis, Tooltip, 
  PieChart, Pie, CartesianGrid 
} from 'recharts';
import { 
  LayoutDashboard, Box, List, ShoppingCart, BarChart2, 
  Users, CreditCard, FileText, Settings, Search, 
  ChevronLeft, ChevronRight, Menu,AlertCircle,Calendar, Bell, Globe, MoreHorizontal,
  Plus, Edit, Trash2, ActivitySquare, Loader2, Save, ClipboardList, Check, X, Clock
} from "lucide-react";

// --- THEME & MOCK DATA ---
const COLORS = {
  sales: "#d9f99d",     // Light Green
  categories: "#99f6e4", // Teal
  expired: "#fecaca",   // Soft Red
  users: "#ddd6fe",     // Lavender
  primary: "#064e3b",   // Dark Emerald (Sidebar)
  chart_purp: "#d8b4fe",
  chart_blue: "#93c5fd",
  chart_pink: "#fda4af",
};

const barData = [
  { name: 'Mon', sales: 40 },
  { name: 'Tue', sales: 30 },
  { name: 'Wed', sales: 85 },
  { name: 'Thu', sales: 45 },
  { name: 'Fri', sales: 60 },
];

const donutData = [
  { name: 'Purchases', value: 28, color: '#388E3C' },
  { name: 'Suppliers', value: 18, color: '#4CAF50' },
  { name: 'Sales', value: 12, color: '#1C1C1C' },
  { name: 'No Sales', value: 42, color: '#E8F5E9' },
];

export default function NewNursePage() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // --- STATES ---
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [editingPatientId, setEditingPatientId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Patient Form States
  const [firstName, setFirstName] = useState("");
  const [gender, setGender] = useState("");
  const [lastName, setLastName] = useState("");
  const [date, setDate] = useState("");
  const [disease, setDisease] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [formError, setFormError] = useState("");

  // Request Form States
  const [requestType, setRequestType] = useState("Medicine Request");
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [urgency, setUrgency] = useState("medium");
  const [reason, setReason] = useState("");
  const [patientCount, setPatientCount] = useState(0);

  // UI & Data States
  const [myRequests, setMyRequests] = useState([]);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const fetchPatients = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No authentication token found");
        return;
      }
      const response = await axios.get(
        `${backendUrl}/api/patients/displayPatients`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const d = response.data;
      setPatients(Array.isArray(d) ? d : (d.users ?? []));
    } catch (error) {
      console.error("Error fetching patients:", error);
      toast.error("Failed to fetch patients. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
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
      console.error("Error fetching requests:", error);
    }
  };

  const fetchEmail = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = await axios.get(`${backendUrl}/api/infos/email`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmail(response.data.email || "");
      setUsername(response.data.username || "");
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      // navigate("/");
      return;
    }
    if (role !== "nurse") {
      toast.error("Unauthorized access");
      // navigate("/");
    }

    fetchEmail();
    fetchPatients();
    fetchRequests();
  }, []);

  // --- ACTIONS ---
  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      setTimeout(() => {
        // navigate("/");
      }, 2000);
      setTimeout(() => toast.success("Logged out Successfully!"), 2000);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleHospitalize = async (patientId) => {
    if (!window.confirm("Hospitalize this patient?")) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No authentication token found");
        return;
      }
      await axios.patch(
        `${backendUrl}/api/patients/${patientId}/hospitalize`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Status updated");
      fetchPatients();
    } catch (error) {
      console.error("Error updating patient status:", error);
      toast.error("Error updating status");
    }
  };

  const handleDelete = async (patientId) => {
    if (!window.confirm("Delete this patient?")) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No authentication token found");
        return;
      }
      await axios.delete(`${backendUrl}/api/patients/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatients((prev) => prev.filter((p) => p._id !== patientId));
      toast.success("Patient deleted");
    } catch (error) {
      console.error("Error deleting patient:", error);
      toast.error("Error deleting patient");
    }
  };

  const handleDeleteRequest = async (requestId, e) => {
    e.preventDefault();
    if (!window.confirm("Delete this request?")) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No authentication token found");
        return;
      }
      await axios.delete(
        `${backendUrl}/api/requests/removeRequests/${requestId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setMyRequests((prev) => prev.filter((r) => r._id !== requestId));
      toast.success("Request deleted");
    } catch (error) {
      console.error("Error deleting request:", error);
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
    setEditingPatientId(null);
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setFormError("No authentication token found");
        return;
      }

      // Validate required fields
      if (!firstName || !lastName || !date || !gender || !disease) {
        setFormError("Please fill in all required fields");
        return;
      }

      const patientData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        date: new Date(date),
        disease: disease.trim(),
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
      console.error("Error saving patient:", error);
      setFormError(error.response?.data?.message || "Failed to save patient.");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No authentication token found");
        return;
      }

      // Validate required fields
      if (!itemName || !quantity || !reason) {
        toast.error("Please fill in all required fields");
        return;
      }

      const requestData = {
        Status: "pending",
        requestType,
        itemName: itemName.trim(),
        quantity: parseInt(quantity),
        urgency,
        patientCount,
        reason: reason.trim(),
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
      console.error("Error submitting request:", error);
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

  // --- SUB COMPONENTS ---

  const SidebarItem = ({ icon: Icon, label, active = false, collapsed, as: Component = 'div', to, ...props }) => {
    const content = (
      <>
        <Icon className="w-7 h-7 shrink-0" />
        {!collapsed && <span className="text-sm font-semibold whitespace-nowrap">{label}</span>}
      </>
    );

    const baseClass = `
      flex items-center gap-4 px-4 py-3 rounded-2xl cursor-pointer transition-all mb-2
      ${active ? 'bg-[#0a2e28] text-white' : 'text-slate-400 hover:bg-[#c1c5c4] hover:text-slate-200'}
    `;

    if (Component === 'div' || !to) {
      return (
        <div className={baseClass} {...props}>
          {content}
        </div>
      );
    }

    return (
      <Component to={to} className={baseClass} {...props}>
        {content}
      </Component>
    );
  };

  const StatCard = ({ title, value, change, icon: Icon, bg }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-50">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-slate-800">{value}</p>
          <p className="text-xs text-emerald-600 font-medium mt-1">+{change}% from last month</p>
        </div>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: bg }}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

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
    
    <div className="flex h-screen bg-[#f0f9f6] font-sans">
      {/* 1. COLLAPSIBLE SIDEBAR */}
      <motion.aside 
        initial={false}
        animate={{ width: isCollapsed ? 100 : 260 }}
        className="bg-[#E8F5E9] h-full p-6 flex flex-col relative"
      >
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#051f1b]">
            <div className="w-5 h-5 border-4 border-[#051f1b] rounded-full border-t-transparent animate-spin-slow" />
          </div>
          {!isCollapsed && <h1 className="text-black font-bold text-xl tracking-tight">Clinic</h1>}
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Main Menu</p>
          <SidebarItem as={Link} icon={LayoutDashboard} label="Dashboard" active collapsed={isCollapsed} />
          <SidebarItem as={Link} to={"patients"} icon={Box} label="Patients" collapsed={isCollapsed} />
          <SidebarItem as ={Link} to={"requests"} icon={List} label="Requests" collapsed={isCollapsed} />


          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-8 mb-4">Comms</p>
          <SidebarItem icon={FileText} as={Link} to={"reports"} label="Reports" collapsed={isCollapsed} />
          <SidebarItem icon={Settings} as={Link} to={"settings"} label="Settings" collapsed={isCollapsed} />
        </div>

        
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 bg-white shadow-md border border-slate-100 rounded-full p-1 text-slate-600 hover:text-primary transition-colors"
        >
          {isCollapsed ? <ChevronRight size={16}/> : <ChevronLeft size={16}/>}
        </button>
      </motion.aside>

     
      <main className="flex-1 overflow-y-auto p-10">
        
        <header className="flex justify-between items-center mb-10">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              className="w-full bg-white/60 border-none rounded-full py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-emerald-100 shadow-sm"
              placeholder="Search..."
            />
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-full shadow-sm border border-slate-50">
               <Bell className="w-4 h-4 text-slate-500" />
               <div className="h-4 w-[1px] bg-slate-200 mx-1" />
               <Globe className="w-4 h-4 text-slate-500" />
               <span className="text-xs font-bold text-slate-600">EN</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-800 leading-none">Code Astro</p>
                <p className="text-[10px] text-slate-400 font-medium">Administrator</p>
              </div>
              <DropdownMenuDemo/>
            </div>
          </div>
        </header>

        <h2 className="text-3xl font-black text-slate-800 mb-8">Welcome {username || "Nurse"}</h2>

        {/* Patient Stats Cards */}
        <div className="mb-10">
            <div className="flex justify-between items-center mb-6">
                <h4 className="font-bold text-slate-700">Patient Overview</h4>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowRequestForm(true)}
                    className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl text-xs font-bold text-slate-600 shadow-sm border border-slate-50"
                  >
                    <ClipboardList className="w-4 h-4" /> Request Item
                  </button>
                  <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 bg-emerald-600 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm"
                  >
                    <Plus className="w-4 h-4" /> Add Patient
                  </button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                < rd title="Total Patients" value={patients.length} change="2.5" icon={Users} bg="#388E3C" />
                <StatCard title="Hospitalized" value={patients.filter((p) => p.isHospitalized).length} change="2.5" icon={AlertCircle} bg="#4CAF50" />
                <StatCard title="Pending Requests" value={myRequests.filter((r) => r.Status === "pending").length} change="2.5" icon={ClipboardList} bg="#1C1C1C" />
                <StatCard title="Active Patients" value={patients.filter((p) => !p.isHospitalized).length} change="2.5" icon={ActivitySquare} bg="#E8F5E9" />
            </div>
        </div>

        {/* Patient Table and Requests */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* PATIENTS TABLE */}
            <div className="xl:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-50">
                <div className="flex justify-between items-center mb-8">
                    <h4 className="font-bold text-slate-700">Assigned Patients</h4>
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
                      <tbody className="divide-y divide-gray-200">
                        {loading ? (
                          <tr>
                            <td colSpan="4" className="p-6">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className="flex items-center gap-4 mb-4 p-4 rounded-lg bg-gray-100"
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
                              className="hover:bg-gray-50 transition group"
                            >
                              <td className="pl-6 py-4">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={patient.image ? `${backendUrl}/uploads/${patient.image}` : "/images/user.png"}
                                    alt=""
                                    className="w-10 h-10 rounded-xl object-cover bg-gray-300"
                                    onError={(e) => {
                                      e.target.src = "/images/user.png";
                                    }}
                                  />
                                  <div>
                                    <p className="font-bold text-sm text-gray-800">
                                      {patient.firstName} {patient.lastName}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {patient.gender},{" "}
                                      {(() => {
                                        try {
                                          const birthDate = new Date(patient.date);
                                          if (isNaN(birthDate.getTime())) return "Age unknown";
                                          return new Date().getFullYear() - birthDate.getFullYear();
                                        } catch {
                                          return "Age unknown";
                                        }
                                      })()}{" "}
                                      yrs
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-4 text-sm text-gray-700 font-medium">
                                {patient.disease}
                              </td>
                              <td className="px-4 py-4">
                                <span
                                  className={`badge ${patient.isHospitalized ? "badge-error" : "badge-success"}`}
                                >
                                  {patient.isHospitalized
                                    ? "Hospitalized"
                                    : "Active"}
                                </span>
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

            {/* REQUESTS LIST */}
            <div className="card bg-white shadow-md flex flex-col h-150 rounded-[2.5rem] border border-slate-50">
              <div className="card-body p-4 pb-0 border-b border-gray-200 flex justify-between items-center flex-row">
                <h3 className="card-title text-lg text-gray-800">My Requests</h3>
                <button
                  onClick={fetchRequests}
                  className="btn btn-ghost btn-sm"
                >
                  Refresh
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-2">
                {myRequests.length === 0 ? (
                  <div className="text-center text-gray-500 py-10">
                    No requests
                  </div>
                ) : (
                  myRequests.map((req) => (
                    <div
                      key={req._id}
                      className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition border border-transparent hover:border-gray-200 mb-1 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="badge badge-primary">
                          {req.itemName.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-800">
                            {req.itemName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {req.requestType} • Qty: {req.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <StatusBadge status={req.Status} />
                        <button
                          onClick={(e) => handleDeleteRequest(req._id, e)}
                          className="btn btn-ghost btn-xs btn-circle opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="p-4 border-t border-gray-200">
                <button
                  onClick={() => setShowRequestForm(true)}
                  className="btn btn-outline w-full btn-sm"
                >
                  <Plus className="w-4 h-4" /> New Request
                </button>
              </div>
            </div>
        </div>
        <Outlet/>
      </main>

      {/* Patient Form Modal */}
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
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                >
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

      {/* Request Form Modal */}
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