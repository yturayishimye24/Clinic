import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { 
  ResponsiveContainer, BarChart, Bar,Cell, XAxis, YAxis, Tooltip, 
  PieChart, Pie, CartesianGrid 
} from 'recharts';
import { 
  LayoutDashboard, Box, List, ShoppingCart, BarChart2, 
  Users, CreditCard, FileText, Settings, Search, 
  ChevronLeft, ChevronRight, Menu,AlertCircle,Calendar, Bell, Globe, MoreHorizontal
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

// --- SUB-COMPONENTS ---

const StatCard = ({ title, value, change, icon: Icon, color, bg }) => (
  <div className={`p-6 rounded-[2.5rem] flex flex-col justify-between h-48 relative overflow-hidden shadow-sm`} style={{ backgroundColor: bg }}>
    <div className="flex justify-between items-start z-10">
      <div className="p-2 bg-black/5 rounded-lg">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <button className="text-slate-500 hover:text-black">
        <MoreHorizontal className="w-5 h-5" />
      </button>
    </div>
    <div className="z-10">
      <p className="text-slate-500 text-xs font-medium mb-1">{title}</p>
      <div className="flex items-end gap-2">
        <h3 className="text-3xl font-black text-slate-800">{value}</h3>
      </div>
      <p className="text-[10px] font-bold text-slate-600 mt-1">
        <span className="text-green-600">+{change}%</span> This Month
      </p>
    </div>
    {/* Decorative sparkline-like background shape */}
    <div className="absolute right-0 bottom-0 w-24 h-24 opacity-10">
        <BarChart width={100} height={80} data={barData}>
            <Bar dataKey="sales" fill="#2DD4BF" radius={[4, 4, 0, 0]} />
        </BarChart>
    </div>
  </div>
);

const SidebarItem = ({ icon: Icon, label, active = false, collapsed }) => (
  <div className={`
    flex items-center gap-4 px-4 py-3 rounded-2xl cursor-pointer transition-all mb-2
    ${active ? 'bg-[#0a2e28] text-white' : 'text-slate-400 hover:bg-[#646b6a] hover:text-slate-200'}
  `}>
    <Icon className="w-7 h- 7shrink-0" />
    {!collapsed && <span className="text-sm font-semibold whitespace-nowrap">{label}</span>}
  </div>
);

// --- MAIN COMPONENT ---

export default function NewNursePage() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-[#f0f9f6] font-sans">
      {/* 1. COLLAPSIBLE SIDEBAR */}
      <motion.aside 
        initial={false}
        animate={{ width: isCollapsed ? 80 : 260 }}
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
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active collapsed={isCollapsed} />
          <SidebarItem icon={Box} label="Patients" collapsed={isCollapsed} />
          <SidebarItem icon={List} label="Requests" collapsed={isCollapsed} />


          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-8 mb-4">Comms</p>
          <SidebarItem icon={FileText} label="Reports" collapsed={isCollapsed} />
          <SidebarItem icon={Settings} label="Settings" collapsed={isCollapsed} />
        </div>

        {/* Adjuster Icon Button */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 bg-white shadow-md border border-slate-100 rounded-full p-1 text-slate-600 hover:text-primary transition-colors"
        >
          {isCollapsed ? <ChevronRight size={16}/> : <ChevronLeft size={16}/>}
        </button>
      </motion.aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto p-10">
        {/* Header */}
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
              <img src="https://ui-avatars.com/api/?name=Code+Astro&background=051f1b&color=fff" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="profile"/>
            </div>
          </div>
        </header>

        <h2 className="text-3xl font-black text-slate-800 mb-8">Welcome Code Astro!</h2>

        {/* 3. SALES CARDS GRID */}
        <div className="mb-10">
            <div className="flex justify-between items-center mb-6">
                <h4 className="font-bold text-slate-700">Pharmacy Sales Results</h4>
                <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl text-xs font-bold text-slate-600 shadow-sm border border-slate-50">
                    <Calendar className="w-4 h-4" /> This Month <ChevronRight className="w-4 h-4 rotate-90" />
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Todays Sales" value="$ 95.00" change="2.5" icon={ShoppingCart} bg="#388E3C" />
                <StatCard title="Available Categories" value="1,457" change="2.5" icon={Box} bg="#4CAF50" />
                <StatCard title="Expired Medicines" value="0.00%" change="2.5" icon={AlertCircle} bg="#1C1C1C" />
                <StatCard title="System Users" value="255K" change="2.5" icon={Users} bg="#E8F5E9" />
            </div>
        </div>

        {/* 4. CHARTS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Donut Chart */}
            <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-50">
                <div className="flex justify-between mb-8">
                    <h4 className="font-bold text-slate-700">Graph Report</h4>
                    <MoreHorizontal className="text-slate-400 cursor-pointer" />
                </div>
                <div className="h-64 relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={donutData}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={90}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {donutData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Total</p>
                        <p className="text-2xl font-black text-slate-800">755K</p>
                    </div>
                </div>
                {/* Legend */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                    {donutData.map((item) => (
                        <div key={item.name} className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-[10px] font-bold text-slate-500 uppercase">{item.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bar Chart */}
            <div className="lg:col-span-3 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-50">
                <div className="flex justify-between mb-8">
                    <h4 className="font-bold text-slate-700">Total Sales Overview</h4>
                    <div className="bg-[#051f1b] text-white text-[10px] px-3 py-1 rounded-lg font-bold">
                        Apr, 2026: $298.00K
                    </div>
                </div>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData} margin={{ top: 20 }}>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#cbd5e1' }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#cbd5e1' }} />
                            <Tooltip cursor={{ fill: '#f8fafc' }} />
                            <Bar dataKey="sales" fill="#d9f99d" radius={[10, 10, 10, 10]} barSize={40}>
                                {barData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index === 2 ? '#d9f99d' : '#f1f5f9'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}