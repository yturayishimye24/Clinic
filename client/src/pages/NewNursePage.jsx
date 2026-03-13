import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  LayoutDashboard, Users, GitPullRequest, Settings, BarChart3, 
  LogOut, Bell, Search, Menu, MoreVertical, Download, Filter, 
  Calendar, Package, UserPlus, Activity, TrendingUp, Pill, 
  CheckCircle2, AlertCircle, Clock, Trash2, Plus, Edit, ActivitySquare,
  Loader2, Save, Check, X, ArrowUpRight
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// --- Sub-Components ---
const StatCard = ({ title, value, subtext, icon: Icon, trend }) => (
  <div className="bg-white p-6 rounded-[24px] shadow-sm border border-orange-50 relative overflow-hidden group hover:shadow-md transition-all">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        <p className={`text-[11px] mt-2 flex items-center gap-1 ${trend.includes('↑') ? 'text-green-500' : 'text-red-500'}`}>
          <TrendingUp size={12} /> {trend} vs last month
        </p>
      </div>
      <div className="bg-orange-50 p-3 rounded-2xl text-[#FB923C]">
        <Icon size={24} />
      </div>
    </div>
  </div>
);

const DashboardHome = ({ patients, myRequests, reports }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50">
            <Filter size={16} /> Filters
          </button>
          <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50">
            <Calendar size={16} /> Last 30 days
          </button>
        </div>
        <button className="flex items-center gap-2 bg-[#1F2937] text-white px-5 py-2 rounded-xl text-sm font-medium shadow-lg hover:bg-slate-700 transition-all">
          <Download size={16} /> Export PDF
        </button>
      </div>

      {/* Statistics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#134e4a] rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-110 transition"></div>
          <div className="relative z-10 flex justify-between items-start">
            <span className="text-emerald-100/80 font-medium text-sm">Total Patients</span>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <h2 className="relative z-10 text-5xl font-bold text-white mt-4">{patients.length}</h2>
          <div className="relative z-10 mt-4 flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-100 text-xs px-2 py-1 rounded-lg border border-emerald-500/30">+2 New</span>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:-translate-y-0.5 transition duration-300">
          <div className="flex justify-between items-start">
            <span className="text-gray-500 font-medium text-sm">Hospitalized</span>
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-5xl font-bold text-gray-800 mt-4">{patients.filter((p) => p.isHospitalized).length}</h2>
          <div className="mt-4 flex items-center gap-2">
            <span className="bg-rose-50 text-rose-600 text-xs px-2 py-1 rounded-lg">Critical Care</span>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:-translate-y-0.5 transition duration-300">
          <div className="flex justify-between items-start">
            <span className="text-gray-500 font-medium text-sm">Pending Requests</span>
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-5xl font-bold text-gray-800 mt-4">{myRequests.filter((r) => r.Status === "pending").length}</h2>
          <div className="mt-4 flex items-center gap-2">
            <span className="bg-amber-50 text-amber-600 text-xs px-2 py-1 rounded-lg">Awaiting Approval</span>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:-translate-y-0.5 transition duration-300">
          <div className="flex justify-between items-start">
            <span className="text-gray-500 font-medium text-sm">Reports Generated</span>
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-5xl font-bold text-gray-800 mt-4">{reports.length}</h2>
          <div className="mt-4 flex items-center gap-2">
            <span className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-lg">This Month</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Patients Table */}
        <div className="xl:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-lg text-gray-800">Assigned Patients</h3>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search..." className="pl-9 pr-4 py-2 bg-gray-50 rounded-xl text-sm border-none focus:ring-2 focus:ring-emerald-500/20 w-48" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="pl-6 py-4 text-xs font-semibold text-gray-400 uppercase">Patient</th>
                  <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase">Condition</th>
                  <th className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase">Status</th>
                  <th className="pr-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {patients.slice(0, 8).map((patient) => (
                  <tr key={patient._id} className="hover:bg-gray-50 transition group">
                    <td className="pl-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={`${backendUrl}/uploads/${patient.image}`} alt="" className="w-10 h-10 rounded-xl object-cover bg-gray-300" />
                        <div>
                          <p className="font-bold text-sm text-gray-800">{patient.firstName} {patient.lastName}</p>
                          <p className="text-xs text-gray-500">{patient.gender}, {new Date().getFullYear() - new Date(patient.date).getFullYear()} yrs</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 font-medium">{patient.disease}</td>
                    <td className="px-4 py-4">
                      <span className={`badge ${patient.isHospitalized ? 'badge-error' : 'badge-success'}`}>
                        {patient.isHospitalized ? 'Hospitalized' : 'Active'}
                      </span>
                    </td>
                    <td className="pr-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="btn btn-ghost btn-xs btn-circle"><Edit className="w-4 h-4" /></button>
                        <button className="btn btn-warning btn-xs btn-circle"><ActivitySquare className="w-4 h-4" /></button>
                        <button className="btn btn-error btn-xs btn-circle"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Requests List */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-lg text-gray-800">My Requests</h3>
            <button className="btn btn-ghost btn-sm">Refresh</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {myRequests.length === 0 ? (
              <div className="text-center text-gray-500 py-10">No requests</div>
            ) : (
              myRequests.map((req) => (
                <div key={req._id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition mb-2 group">
                  <div className="flex items-center gap-3">
                    <div className="badge badge-primary">{req.itemName.substring(0, 2).toUpperCase()}</div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{req.itemName}</p>
                      <p className="text-xs text-gray-500">{req.requestType} • Qty: {req.quantity}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <StatusBadge status={req.Status} />
                    <button className="btn btn-ghost btn-xs btn-circle opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="p-4 border-t border-gray-50">
            <button className="btn btn-outline w-full btn-sm"><Plus className="w-4 h-4" /> New Request</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const s = status?.toLowerCase() || "";
  if (s === "approved" || s === "active") return <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center border border-emerald-200"><Check className="w-4 h-4 text-emerald-600" /></div>;
  if (s === "hospitalized" || s === "rejected") return <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center border border-rose-200"><X className="w-4 h-4 text-rose-600" /></div>;
  return <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center border border-amber-200"><Clock className="w-4 h-4 text-amber-600" /></div>;
};

// --- Main Page ---

export default function NewNursePage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // States from CreatePage
  const [editingPatientId, setEditingPatientId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [patients, setPatients] = useState([]);
  const [requests, setRequests] = useState([]);
  const [reports, setReports] = useState([]);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Patient Form States
  const [firstName, setFirstName] = useState("");
  const [gender, setGender] = useState("");
  const [lastName, setLastName] = useState("");
  const [date, setDate] = useState("");
  const [disease, setDisease] = useState("");
  const [formError, setFormError] = useState("");

  // Report States
  const [reportTitle, setReportTitle] = useState("");
  const [body, setBody] = useState("");
  const [conclusion, setConclusion] = useState("");
  const [reporting, setReporting] = useState(false);
  const [reportForm, setReportForm] = useState(false);

  // Request Form States
  const [requestType, setRequestType] = useState("Medicine Request");
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [urgency, setUrgency] = useState("medium");
  const [reason, setReason] = useState("");

  // Fetches
  const fetchPatients = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${backendUrl}/api/patients/displayPatients`, { headers: { Authorization: `Bearer ${token}` } });
      const d = response.data;
      setPatients(Array.isArray(d) ? d : (d.users ?? []));
    } catch (error) {
      toast.error("Failed to fetch patients.");
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${backendUrl}/api/requests/showRequests`, { headers: { Authorization: `Bearer ${token}` } });
      const d = response.data;
      setRequests(Array.isArray(d) ? d : Array.isArray(d.requests) ? d.requests : []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchEmail = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${backendUrl}/api/infos/email`, { headers: { Authorization: `Bearer ${token}` } });
      setEmail(response.data.email);
      setUsername(response.data.username);
    } catch (error) {
      console.error(error);
    }
  };

  const displayReports = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/report/display-report`);
      if (response.data.success) {
        setReports(response.data.report);
      }
    } catch (error) {
      console.log("Error displaying reports", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token) {
      window.location.href = "/";
      return;
    }
    if (role !== "nurse") {
      toast.error("Unauthorized access");
      window.location.href = "/";
    }
    fetchEmail();
    fetchPatients();
    fetchRequests();
    displayReports();
  }, []);

  // Handlers
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setTimeout(() => window.location.href = "/", 2000);
    setTimeout(() => toast.success("Logged out Successfully!"), 2000);
  };

  const Report = async (e) => {
    e.preventDefault();
    setReporting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${backendUrl}/api/report/create_report`, { title: reportTitle, body, conclusion }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Report generated!");
      setReportForm(false);
      setReportTitle("");
      setBody("");
      setConclusion("");
      displayReports();
    } catch (error) {
      toast.error("Failed to generate report.");
    } finally {
      setReporting(false);
    }
  };

  const handleHospitalize = async (patientId) => {
    if (!window.confirm("Hospitalize this patient?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.patch(`${backendUrl}/api/patients/${patientId}/hospitalize`, {}, { headers: { Authorization: `Bearer ${token}` } });
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
      await axios.delete(`${backendUrl}/api/patients/${patientId}`, { headers: { Authorization: `Bearer ${token}` } });
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
      await axios.delete(`${backendUrl}/api/requests/removeRequests/${requestId}`, { headers: { Authorization: `Bearer ${token}` } });
      setRequests((prev) => prev.filter((r) => r._id !== requestId));
      toast.success("Request deleted");
    } catch (error) {
      toast.error("Error deleting request");
    }
  };

  const handleEdit = (patient) => {
    setEditingPatientId(patient._id);
    setFirstName(patient.firstName || "");
    setLastName(patient.lastName || "");
    setGender(patient.gender || "");
    setDate(patient.date ? patient.date.split("T")[0] : "");
    setDisease(patient.disease || "");
    setShowForm(true);
  };

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setGender("");
    setDate("");
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
      const patientData = { firstName, lastName, date: new Date(date), disease, gender };
      if (editingPatientId) {
        const response = await axios.put(`${backendUrl}/api/patients/${editingPatientId}`, patientData, { headers: { Authorization: `Bearer ${token}` } });
        setPatients((prev) => prev.map((p) => (p._id === editingPatientId ? response.data : p)));
        toast.success("Patient updated");
      } else {
        const response = await axios.post(`${backendUrl}/api/patients/create`, patientData, { headers: { Authorization: `Bearer ${token}` } });
        setPatients((prev) => [...prev, response.data.patient]);
        toast.success("Patient added");
      }
      setShowForm(false);
      resetForm();
    } catch (error) {
      setFormError("Failed to save patient.");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const requestData = { Status: "pending", requestType, itemName, quantity, urgency, reason };
      const response = await axios.post(`${backendUrl}/api/requests/createRequests`, requestData, { headers: { Authorization: `Bearer ${token}` } });
      if (response.data.success) {
        toast.success("Request submitted");
        setShowRequestForm(false);
        fetchRequests();
        setItemName("");
        setQuantity("");
        setReason("");
      }
    } catch (error) {
      toast.error("Failed to submit request");
    }
  };

  const filteredPatients = patients.filter((patient) => {
    const userFullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
    return userFullName.includes(searchTerm.toLowerCase()) || patient.disease.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const changeTab = (id) => {
    setLoading(true);
    setActiveTab(id);
    setTimeout(() => setLoading(false), 600);
  };

  return (
    <div className="flex min-h-screen bg-[#FFF4E1]">
      <ToastContainer />
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-24'} bg-[#1F2937] transition-all duration-300 flex flex-col p-4`}>
        <div className="flex items-center justify-between mb-10 px-2 pt-4">
          {isSidebarOpen && <span className="text-[#FB923C] font-black text-xl tracking-tight">CLINIC+</span>}
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-gray-400 hover:text-white">
            <Menu size={24} />
          </button>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
            { id: 'patients', label: 'Patients', icon: Users },
            { id: 'requests', label: 'Requests', icon: GitPullRequest },
            { id: 'reports', label: 'Reports', icon: BarChart3 },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => changeTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${
                activeTab === item.id ? 'bg-[#FB923C] text-white shadow-lg' : 'text-gray-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={22} />
              {isSidebarOpen && <span className="font-semibold text-sm">{item.label}</span>}
            </button>
          ))}
        </nav>

        <button className="flex items-center gap-4 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-2xl transition-all" onClick={handleLogout}>
          <LogOut size={22} />
          {isSidebarOpen && <span className="font-semibold text-sm">Logout</span>}
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-24 px-8 flex items-center justify-between bg-[#FFF4E1]/80 backdrop-blur-sm">
          <h1 className="text-2xl font-bold text-slate-800">Hello, {username || 'Nurse'}!</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="text" placeholder="Search anything..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-white rounded-full py-3 pl-12 pr-6 w-80 shadow-sm border-none focus:ring-2 focus:ring-orange-200" />
            </div>
            <button className="p-3 bg-white rounded-full shadow-sm text-gray-500 hover:text-[#FB923C]"><Bell size={20} /></button>
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md cursor-pointer">
              <img src="https://ui-avatars.com/api/?name=Mike+Nurse&background=FB923C&color=fff" alt="Profile" />
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <main className="flex-1 overflow-y-auto px-8 pb-10">
          {loading ? (
            <div className="animate-pulse space-y-8">
               <div className="grid grid-cols-3 gap-6">
                 {[1,2,3].map(n => <div key={n} className="h-32 bg-white/50 rounded-[24px]"></div>)}
               </div>
               <div className="h-80 bg-white/50 rounded-[24px]"></div>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && <DashboardHome patients={patients} myRequests={requests} reports={reports} />}
              {activeTab === 'patients' && (
                <div className="bg-white rounded-[24px] shadow-sm border border-orange-50 overflow-hidden">
                   <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                     <h3 className="font-bold">Patient List</h3>
                     <button className="bg-orange-50 text-[#FB923C] p-2 rounded-lg" onClick={() => setShowForm(true)}><UserPlus size={20} /></button>
                   </div>
                   <table className="w-full">
                     <thead className="bg-gray-50 text-gray-400 text-xs uppercase">
                       <tr>
                         <th className="px-6 py-4 text-left font-semibold">Patient Name</th>
                         <th className="px-6 py-4 text-left font-semibold">Status</th>
                         <th className="px-6 py-4 text-left font-semibold">Date/Time</th>
                         <th className="px-6 py-4 text-left font-semibold">Room</th>
                         <th className="px-6 py-4"></th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-50">
                       {filteredPatients.map((patient, i) => (
                         <tr key={patient._id} className="hover:bg-orange-50/20 transition-colors">
                           <td className="px-6 py-4 text-sm font-bold text-slate-700">#1234567{i} - {patient.firstName}</td>
                           <td className="px-6 py-4">
                             <span className="flex items-center gap-1 text-green-500 text-xs font-bold">● Completed</span>
                           </td>
                           <td className="px-6 py-4 text-xs text-gray-500">{new Date(patient.createdAt).toLocaleString()}</td>
                           <td className="px-6 py-4 text-sm font-bold text-slate-700">Room 0{i}</td>
                           <td className="px-6 py-4 text-right">
                             <button onClick={() => handleEdit(patient)} className="text-gray-300 hover:text-blue-500 mr-2"><Edit size={16} /></button>
                             <button onClick={() => handleHospitalize(patient._id)} className="text-gray-300 hover:text-yellow-500 mr-2"><ActivitySquare size={16} /></button>
                             <button onClick={() => handleDelete(patient._id)} className="text-gray-300 hover:text-red-500"><Trash2 size={16} /></button>
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                </div>
              )}
              {activeTab === 'requests' && (
                <div className="bg-white rounded-[24px] shadow-sm border border-orange-50 overflow-hidden">
                   <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                     <h3 className="font-bold">Requests List</h3>
                     <button className="bg-orange-50 text-[#FB923C] p-2 rounded-lg" onClick={() => setShowRequestForm(true)}><UserPlus size={20} /></button>
                   </div>
                   <div className="p-4">
                     {requests.length === 0 ? (
                       <div className="text-center text-gray-500 py-10">No requests</div>
                     ) : (
                       requests.map((req) => (
                         <div key={req._id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition mb-2 group">
                           <div className="flex items-center gap-3">
                             <div className="badge badge-primary">{req.itemName.substring(0, 2).toUpperCase()}</div>
                             <div>
                               <p className="text-sm font-bold text-gray-800">{req.itemName}</p>
                               <p className="text-xs text-gray-500">{req.requestType} • Qty: {req.quantity}</p>
                             </div>
                           </div>
                           <div className="flex items-center gap-4">
                             <StatusBadge status={req.Status} />
                             <button onClick={(e) => handleDeleteRequest(req._id, e)} className="btn btn-ghost btn-xs btn-circle opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                           </div>
                         </div>
                       ))
                     )}
                   </div>
                </div>
              )}
              {activeTab === 'reports' && (
                <div className="bg-white rounded-[24px] shadow-sm border border-orange-50 overflow-hidden">
                   <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                     <h3 className="font-bold">Reports List</h3>
                     <button className="bg-orange-50 text-[#FB923C] p-2 rounded-lg" onClick={() => setReportForm(true)}><Plus size={20} /></button>
                   </div>
                   <table className="w-full">
                     <thead className="bg-gray-50 text-gray-400 text-xs uppercase">
                       <tr>
                         <th className="px-6 py-4 text-left font-semibold">Title</th>
                         <th className="px-6 py-4 text-left font-semibold">Body</th>
                         <th className="px-6 py-4 text-left font-semibold">Conclusion</th>
                         <th className="px-6 py-4 text-left font-semibold">Date</th>
                         <th className="px-6 py-4"></th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-50">
                       {reports.map((report, i) => (
                         <tr key={report._id} className="hover:bg-orange-50/20 transition-colors">
                           <td className="px-6 py-4 text-sm font-bold text-slate-700">{report.title}</td>
                           <td className="px-6 py-4 text-sm text-gray-500">{report.body.substring(0, 50)}...</td>
                           <td className="px-6 py-4 text-sm text-gray-500">{report.conclusion.substring(0, 50)}...</td>
                           <td className="px-6 py-4 text-xs text-gray-500">{new Date(report.createdAt).toLocaleDateString()}</td>
                           <td className="px-6 py-4 text-right"><MoreVertical size={16} className="text-gray-300 cursor-pointer inline" /></td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                </div>
              )}
              {activeTab === 'settings' && (
                <div className="bg-white rounded-[24px] shadow-sm border border-orange-50 p-6">
                  <h3 className="font-bold">Settings</h3>
                  <p className="text-gray-500 mt-2">Settings functionality not implemented yet.</p>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Modals */}
      {showForm && (
        <dialog className="modal modal-open" onClick={() => setShowForm(false)}>
          <div className="modal-box w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-bold text-lg mb-6">{editingPatientId ? "Edit Patient" : "Add Patient"}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label"><span className="label-text font-semibold">First Name</span></label>
                <input type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Enter first name" className="input input-bordered w-full" />
              </div>
              <div>
                <label className="label"><span className="label-text font-semibold">Last Name</span></label>
                <input type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Enter last name" className="input input-bordered w-full" />
              </div>
              <div>
                <label className="label"><span className="label-text font-semibold">Date of Birth</span></label>
                <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="input input-bordered w-full" />
              </div>
              <div>
                <label className="label"><span className="label-text font-semibold">Gender</span></label>
                <select required value={gender} onChange={(e) => setGender(e.target.value)} className="select select-bordered w-full">
                  <option value="">Select...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="label"><span className="label-text font-semibold">Condition / Disease</span></label>
                <input type="text" required value={disease} onChange={(e) => setDisease(e.target.value)} placeholder="Enter condition" className="input input-bordered w-full" />
              </div>
              <div className="md:col-span-2 modal-action">
                <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" disabled={loading} className="btn btn-primary">
                  {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <><Save className="w-4 h-4" /> Save Record</>}
                </button>
              </div>
            </form>
          </div>
          <form method="dialog" className="modal-backdrop"><button onClick={() => setShowForm(false)}>close</button></form>
        </dialog>
      )}

      {showRequestForm && (
        <dialog className="modal modal-open" onClick={() => setShowRequestForm(false)}>
          <div className="modal-box w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-bold text-lg mb-6">New Request</h2>
            <form onSubmit={handleRequestSubmit} className="space-y-4">
              <div>
                <label className="label"><span className="label-text font-semibold">Type</span></label>
                <select value={requestType} onChange={(e) => setRequestType(e.target.value)} className="select select-bordered w-full">
                  <option>Medicine Request</option>
                  <option>Equipment Request</option>
                  <option>Supply Request</option>
                </select>
              </div>
              <div>
                <label className="label"><span className="label-text font-semibold">Item Name</span></label>
                <input type="text" required value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder="Enter item name" className="input input-bordered w-full" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label"><span className="label-text font-semibold">Quantity</span></label>
                  <input type="number" required value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="0" className="input input-bordered w-full" />
                </div>
                <div>
                  <label className="label"><span className="label-text font-semibold">Urgency</span></label>
                  <select value={urgency} onChange={(e) => setUrgency(e.target.value)} className="select select-bordered w-full">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="label"><span className="label-text font-semibold">Reason</span></label>
                <textarea required rows={2} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Enter reason" className="textarea textarea-bordered w-full"></textarea>
              </div>
              <div className="modal-action">
                <button type="button" className="btn btn-ghost" onClick={() => setShowRequestForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Request</button>
              </div>
            </form>
          </div>
          <form method="dialog" className="modal-backdrop"><button onClick={() => setShowRequestForm(false)}>close</button></form>
        </dialog>
      )}

      {reportForm && (
        <dialog className="modal modal-open" onClick={() => setReportForm(false)}>
          <div className="modal-box w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-bold text-lg mb-6">Generate Report</h2>
            <form onSubmit={Report} className="space-y-4">
              <div>
                <label className="label"><span className="label-text font-semibold">Title</span></label>
                <input type="text" required value={reportTitle} onChange={(e) => setReportTitle(e.target.value)} placeholder="Enter report title" className="input input-bordered w-full" />
              </div>
              <div>
                <label className="label"><span className="label-text font-semibold">Observations</span></label>
                <textarea required rows={4} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Enter observations" className="textarea textarea-bordered w-full"></textarea>
              </div>
              <div>
                <label className="label"><span className="label-text font-semibold">Conclusion</span></label>
                <textarea required rows={2} value={conclusion} onChange={(e) => setConclusion(e.target.value)} placeholder="Enter conclusion" className="textarea textarea-bordered w-full"></textarea>
              </div>
              <div className="modal-action">
                <button type="button" className="btn btn-ghost" onClick={() => setReportForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  {reporting ? <Loader2 className="animate-spin w-4 h-4" /> : "Submit Report"}
                </button>
              </div>
            </form>
          </div>
          <form method="dialog" className="modal-backdrop"><button onClick={() => setReportForm(false)}>close</button></form>
        </dialog>
      )}
    </div>
  );
}