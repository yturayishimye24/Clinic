import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Popover, Spinner } from "flowbite-react";
import socket, { connectSocket } from "../socket.js";
import {
  Users,
  Inbox,
  UserPlus,
  RefreshCw,
  Loader2,
  Trash2,
  Stethoscope,
  Search,
  Plus,
  X,
  ArrowUpRight,
  Check,
  Bell,
  BarChart3,
  Settings,
  LogOut
} from "lucide-react";

// --- CUSTOM STYLES ---
const FontStyles = () => (
    <style>
      {`
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
      
      body, .font-sans {
        font-family: 'Plus Jakarta Sans', sans-serif;
      }
      
      .cozy-shadow {
        box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.03);
      }
      
      .cozy-card-hover:hover {
        transform: translateY(-2px);
        box-shadow: 0px 10px 25px rgba(0, 0, 0, 0.06);
      }

      /* Custom Scrollbar for tables */
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: #e5e7eb;
        border-radius: 20px;
      }
    `}
    </style>
);

export default function AdminPage() {
  const navigate = useNavigate();

  // --- STATE ---
  const [patients, setPatients] = useState([]);
  const [requests, setRequests] = useState([]);
  const [reports, setReports] = useState([]);
  const [nurses, setNurses] = useState([]);
  const [username, setUsername] = useState("");
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [loadingReports, setLoadingReports] = useState(false);
  const [loadingNurses, setLoadingNurses] = useState(false);

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

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // --- DATA FETCHING ---
  const fetchPatients = async () => {
    setLoadingPatients(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${backendUrl}/api/patients/displayPatients`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const d = response.data;
      setPatients(Array.isArray(d) ? d : (d.users ?? []));
    } catch (err) {
      console.error(err);
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
      const response = await axios.get(`${backendUrl}/api/requests/showRequests`);
      const d = response.data;
      setRequests(Array.isArray(d) ? d : (Array.isArray(d.requests) ? d.requests : []));
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
      const response = await axios.get(`${backendUrl}/api/report/display_report`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const d = response.data;
      setReports(Array.isArray(d) ? d : (Array.isArray(d.reports) ? d.reports : []));
    } catch (err) {
      console.error(err);
      toast.error("Error loading reports");
    } finally {
      setLoadingReports(false);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${backendUrl}/api/infos/email`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsername(response.data.username);
      localStorage.setItem("image", response.data.image);
    } catch (error) {
      console.log(error);
    }
  };

  // --- EFFECTS ---
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "admin") {
      navigate("/");
      return;
    }

    connectSocket();
    fetchUserInfo();
    fetchPatients();
    fetchNurses();
    fetchRequests();
    fetchReports();

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

    return () => {
      socket.off("newNurse");
      socket.off("requestCreated");
      socket.off("requestDeleted");
      socket.off("patientCreated");
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
        setEmail(""); setPassword(""); setFormRole(""); setNurseUsername("");
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
      setNurses(prev => prev.filter(n => n._id !== id));
    } catch (err) {
      toast.error("Error deleting nurse");
    }
  };

  const handleApprove = async (requestId) => {
    try {
      setApproving(true);
      const token = localStorage.getItem("token");
      const response = await axios.patch(`${backendUrl}/api/requests/approve/${requestId}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        toast.success("Request approved!");
        fetchRequests();
      }
    } catch (error) {
      toast.error("Error approving request");
    } finally {
      setApproving(false);
    }
  };
  const handleLogout = () =>{
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/doctorLogin")
  }
  const handleDeleteRequest = async (requestId) => {
    if (!window.confirm("Delete this request?")) return;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
          `${backendUrl}/api/requests/removeRequests/${requestId}`,
          { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        toast.success("Request deleted");
        setRequests((prev) => prev.filter((r) => r._id !== requestId));
      }
    } catch (err) {
      toast.error("Error deleting request");
    }
  };

  // --- FILTERING ---
  const filteredPatients = patients.filter((patient) => {
    const term = searchTerm.toLowerCase();
    const fullName = `${patient.firstName} ${patient.lastName || ""}`.toLowerCase();
    return fullName.includes(term) || (patient.disease || "").toLowerCase().includes(term);
  });

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
            <span className="text-amber-600 font-bold text-xs uppercase tracking-wide">Pending</span>
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

  // Sidebar Component
  const SidebarItem = ({ icon: Icon, label, count, onClick }) => (
      <div onClick={onClick} className="sidebar-item flex flex-col items-center justify-center gap-1.5 p-3 cursor-pointer group w-full text-base-content/60 hover:text-primary transition-colors">
          <div className="icon-container w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 group-hover:bg-base-200">
              <Icon className="w-5 h-5" />
              {count > 0 && <span className="badge badge-sm badge-primary absolute">{count}</span>}
          </div>
          <span className="text-[10px] font-semibold tracking-wide">{label}</span>
      </div>
  );

  return (
      <div className="min-h-screen bg-base-200 font-sans flex">
        <FontStyles />
        
        {/* --- SIDEBAR (Full height from top) --- */}
        <aside className="fixed left-0 top-0 h-screen w-[100px] bg-base-100 border-r border-base-300 z-40 flex flex-col items-center py-6 gap-2 overflow-y-auto shadow-lg">
          <SidebarItem icon={Users} label="Dashboard" onClick={() => {}} />
          <SidebarItem icon={Users} label="Patients" onClick={() => {}} />
          <SidebarItem icon={UserPlus} label="Staff" onClick={() => {}} />
          <SidebarItem icon={Inbox} label="Requests" count={requests.length} onClick={() => {}} />
          <SidebarItem icon={BarChart3} label="Reports" count={reports.length} onClick={() => {}} />
          <div className="mt-auto">
            <SidebarItem icon={Settings} label="Settings" onClick={() => {}} />
          </div>
        </aside>

        {/* --- Main Container (Sidebar + Content) --- */}
        <div className="flex-1 flex flex-col ml-[100px]">
        {/* --- NAVBAR --- */}
        <nav className="sticky top-0 z-30 bg-base-100/80 backdrop-blur-md border-b border-base-300 h-[70px] shadow-sm">
          <div className="flex items-center justify-between h-full px-6">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-base-content tracking-tight">CLINIC</span>
              </div>
              <div className="hidden md:flex items-center text-sm text-base-content/60 font-medium">
                <span className="hover:text-primary cursor-pointer transition">Admin Portal</span>
                <span className="mx-2 text-base-content/30">/</span>
                <span className="text-base-content">Dashboard</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="btn btn-ghost btn-circle btn-sm"><Search className="w-5 h-5"/></button>
              <div className="relative">
                <button className="btn btn-ghost btn-circle btn-sm"><Bell className="w-5 h-5"/></button>
              </div>
              <div className="dropdown dropdown-end">
                <button className="flex items-center gap-3 btn btn-ghost">
                  <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=40&h=40&fit=crop&crop=face" alt="Profile" className="w-8 h-8 rounded-full object-cover border border-base-300" />
                </button>
                <ul className="dropdown-content z-50 menu p-2 bg-base-100 rounded-box shadow border border-base-300">
                    <li className="menu-title">
                      <span className="font-bold truncate">{username || "Admin"}</span>
                    </li>
                    <li><a onClick={handleLogout}><LogOut className="w-4 h-4"/> Sign Out</a></li>
                </ul>
              </div>
            </div>
          </div>
        </nav>

        {/* --- MAIN CONTENT --- */}
        <main className="flex-1 pt-4 px-6 lg:px-10 pb-10 overflow-y-auto">

          {/* HEADER SECTION */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Dashboard
              </h1>
              <p className="text-gray-500 mt-1 text-sm font-medium">
                Plan, prioritize, and accomplish your tasks with ease.
              </p>
            </div>
            
            {/* QUICK ACTIONS */}
            <div className="flex items-center gap-3">
                  <button
                      onClick={() => setShowForm(true)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:border-emerald-500 hover:text-emerald-600 transition-all font-semibold text-sm shadow-sm"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Add Staff</span>
                  </button>
                
                  <button 
                    onClick={fetchReports} 
                    className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all font-semibold text-sm shadow-sm"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Sync Data</span>
                  </button>
            </div>
          </div>        
            
          {/* STATS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              
            {/* CARD 1: DARK GREEN (PRIMARY) */}
            <div className="bg-emerald-900 rounded-3xl p-6 relative overflow-hidden group transition-all duration-300 hover:shadow-xl hover:shadow-emerald-900/20">
              <div className="absolute -right-6 -top-6 w-32 h-32 bg-emerald-800 rounded-full opacity-50 blur-2xl group-hover:scale-110 transition-transform"></div>
              <div className="relative z-10 flex justify-between items-start">
                <span className="text-emerald-100 font-medium text-sm">Total Patients</span>
                <div className="w-8 h-8 rounded-full bg-emerald-800/50 flex items-center justify-center border border-emerald-700/50 text-white cursor-pointer hover:bg-emerald-700 transition">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
              <div className="relative z-10 mt-4">
                <h2 className="text-5xl font-bold text-white tracking-tight">{patients.length}</h2>
              </div>
              <div className="relative z-10 mt-6 flex items-center gap-2">
              <span className="bg-emerald-800 text-emerald-100 text-xs px-2 py-1 rounded-lg border border-emerald-700">
                +5
              </span>
                <span className="text-emerald-200/80 text-xs">Increased from last month</span>
              </div>
            </div>

            {/* CARD 2: PENDING REQUESTS */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 cozy-shadow cozy-card-hover transition-all">
              <div className="flex justify-between items-start">
                <span className="text-gray-500 font-medium text-sm">Pending Requests</span>
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-gray-100 text-gray-400 hover:text-emerald-600 hover:border-emerald-200 transition cursor-pointer">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <h2 className="text-5xl font-bold text-gray-800 tracking-tight">
                  {requests.filter((r) => r.Status === "pending").length}
                </h2>
              </div>
              <div className="mt-6 flex items-center gap-2">
              <span className="bg-amber-50 text-amber-600 text-xs px-2 py-1 rounded-lg border border-amber-100">
                Needs Review
              </span>
                <span className="text-gray-400 text-xs">Active Tasks</span>
              </div>
            </div>

            {/* CARD 3: NURSES */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 cozy-shadow cozy-card-hover transition-all">
              <div className="flex justify-between items-start">
                <span className="text-gray-500 font-medium text-sm">Active Nurses</span>
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-gray-100 text-gray-400 hover:text-emerald-600 hover:border-emerald-200 transition cursor-pointer">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <h2 className="text-5xl font-bold text-gray-800 tracking-tight">{nurses.length}</h2>
              </div>
              <div className="mt-6 flex items-center gap-2">
               <span className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-lg border border-blue-100">
                Staff
              </span>
                <span className="text-gray-400 text-xs">Currently hired</span>
              </div>
            </div>

            {/* CARD 4: REPORTS */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 cozy-shadow cozy-card-hover transition-all">
              <div className="flex justify-between items-start">
                <span className="text-gray-500 font-medium text-sm">Total Reports</span>
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-gray-100 text-gray-400 hover:text-emerald-600 hover:border-emerald-200 transition cursor-pointer">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <h2 className="text-5xl font-bold text-gray-800 tracking-tight">{reports.length}</h2>
              </div>
              <div className="mt-6 flex items-center gap-2">
               <span className="bg-purple-50 text-purple-600 text-xs px-2 py-1 rounded-lg border border-purple-100">
                Generated
              </span>
                <span className="text-gray-400 text-xs">This month</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

            {/* LEFT COLUMN: REQUESTS & PATIENTS */}
            <div className="xl:col-span-2 space-y-8">

              {/* REQUESTS TABLE */}
              <div className="bg-white rounded-3xl border border-gray-100 cozy-shadow overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                  <h3 className="font-bold text-lg text-gray-800">Recent Requests</h3>
                  <div className="flex gap-2">
                      <button onClick={fetchRequests} className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-emerald-600 transition">
                        <RefreshCw className="w-4 h-4" />
                      </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                    <tr className="text-left border-b border-gray-50">
                      <th className="pl-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider w-16">Image</th>
                      <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Message</th>
                      <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="pr-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loadingRequests ? (
                        <tr><td colSpan="5" className="py-10 text-center text-gray-400"><Spinner /></td></tr>
                    ) : requests.length === 0 ? (
                        <tr><td colSpan="5" className="py-10 text-center text-gray-400">No requests found</td></tr>
                    ) : (
                        requests.map((req) => (
                            <tr key={req._id} className="group hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0">
                              <td className="pl-6 py-4">
                                <img
                                    src={req.senderImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"}
                                    alt="Avatar"
                                    className="w-10 h-10 rounded-full object-cover border border-gray-100"
                                />
                              </td>
                              <td className="px-4 py-4">
                                <p className="text-sm font-semibold text-gray-800">{req.reason || "General Request"}</p>
                                <p className="text-xs text-gray-400 mt-0.5">ID: #{req._id.slice(-4)}</p>
                              </td>
                              <td className="px-4 py-4">
                             <span className="text-sm text-gray-500 font-medium">
                               {new Date(req.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric'})}
                             </span>
                              </td>
                              <td className="px-4 py-4">
                                <StatusBadge status={req.Status} />
                              </td>
                              <td className="pr-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-3">
                                  {req.Status === 'pending' && (
                                        <button
                                            onClick={(e) => { e.preventDefault(); handleApprove(req._id); }}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-all shadow-sm shadow-emerald-200"
                                        >
                                            {approving ? <Loader2 className="w-3 h-3 animate-spin"/> : <Check className="w-3 h-3"/>}
                                            <span>Approve</span>
                                        </button>
                                  )}
                                    <button
                                        onClick={(e) => { e.preventDefault(); handleDeleteRequest(req._id); }}
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
                  <h3 className="font-bold text-lg text-gray-800">Current Patients</h3>
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
                      <th className="pl-6 py-4 text-xs font-semibold text-gray-500 uppercase">Patient Name</th>
                      <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase">Condition</th>
                      <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                      <th className="pr-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Managed By</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                    {loadingPatients ? (
                        <tr><td colSpan="4" className="py-10 text-center"><Spinner /></td></tr>
                    ) : filteredPatients.map((p) => (
                        <tr key={p._id} className="hover:bg-gray-50 transition cursor-pointer">
                          <td className="pl-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-gray-200 overflow-hidden">
                                <img src={p.Image ? `${backendUrl}${p.Image}` : `https://ui-avatars.com/api/?name=${p.firstName}&background=random`} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-gray-900">{p.firstName} {p.lastName}</p>
                                <p className="text-xs text-gray-400">{p.email || "No email"}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                             <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                               {p.disease || "Checkup"}
                             </span>
                          </td>
                          <td className="px-4 py-4">
                             <span className={`text-xs font-bold px-2 py-1 rounded-full border ${
                                 p.Status === 'hospitalized'
                                     ? 'bg-rose-50 text-rose-600 border-rose-100'
                                     : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                             }`}>
                               {p.Status || "Active"}
                             </span>
                          </td>
                          <td className="pr-6 py-4 text-right">
                             <span className="text-xs font-medium text-gray-400">
                               {typeof p.createdBy === 'object' ? p.createdBy.username : "Staff"}
                             </span>
                          </td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: NURSES & PROFILE */}
            <div className="space-y-8">
              <div className="bg-white rounded-3xl border border-gray-100 cozy-shadow p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-lg text-gray-800">Nursing Staff</h3>
                  <button onClick={fetchNurses} className="text-xs font-bold text-emerald-600 hover:underline">View All</button>
                </div>

                <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                  {loadingNurses ? <Spinner /> : nurses.map((nurse, i) => (
                      <div key={nurse._id || i} className="flex items-center gap-3 p-3 rounded-2xl border border-transparent hover:border-gray-100 hover:bg-gray-50 transition-all group">
                        <img
                            src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face"
                            alt="Nurse"
                            className="w-10 h-10 rounded-full object-cover shadow-sm"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-gray-800 truncate">{nurse.username}</h4>
                          <p className="text-xs text-gray-400 truncate">{nurse.email}</p>
                        </div>
                          <button
                              onClick={() => handleNurseDelete(nurse._id)}
                              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                      </div>
                  ))}
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
        </main>

        {/* MODAL: ADD NURSE */}
        {showForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm" onClick={() => setShowForm(false)}></div>
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animation-fade-in-up">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-800">Create Account</h3>
                  <button onClick={() => setShowForm(false)} className="p-2 rounded-full hover:bg-gray-100 text-gray-500"><X className="w-5 h-5"/></button>
                </div>
                <form onSubmit={handleAccount} className="p-6 space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Username</label>
                    <input type="text" required value={nurseUsername} onChange={e => setNurseUsername(e.target.value)} className="w-full rounded-xl border-gray-200 bg-gray-50 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Email</label>
                    <input type="email" required value={em} onChange={e => setEmail(e.target.value)} className="w-full rounded-xl border-gray-200 bg-gray-50 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">Role</label>
                      <select required value={formRole} onChange={e => setFormRole(e.target.value)} className="w-full rounded-xl border-gray-200 bg-gray-50 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition">
                        <option value="">Select...</option>
                        <option value="nurse">Nurse</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">Password</label>
                      <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded-xl border-gray-200 bg-gray-50 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition" />
                    </div>
                  </div>
                  <button type="submit" disabled={adding} className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-200 transition mt-4 flex items-center justify-center gap-2">
                    {adding ? <Loader2 className="animate-spin"/> : "Create Account"}
                  </button>
                </form>
              </div>
            </div>
        )}

        <ToastContainer position="bottom-right" />
        </div>
        </div>
      
  );
}