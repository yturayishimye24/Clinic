import React from 'react';
import { Package, AlertCircle, ArrowUpRight, User, Filter, SortAsc, Download, Bell } from 'lucide-react';

const StockDashboard = () => {
  const stockItems = [
    { id: 1, name: "Amoxicillin 500mg", qty: 450, status: "In Stock", color: "text-emerald-400", bg: "bg-emerald-400/10", date: "Expiry: Oct 2026" },
    { id: 2, name: "Paracetamol 500mg", qty: 12, status: "Low Stock", color: "text-amber-400", bg: "bg-amber-400/10", date: "Expiry: May 2026" },
    { id: 3, name: "Insulin Glargine", qty: 0, status: "Out of Stock", color: "text-gray-400", bg: "bg-gray-400/10", date: "Reorder Pending" },
    { id: 4, name: "Ibuprofen 400mg", qty: 230, status: "In Stock", color: "text-emerald-400", bg: "bg-emerald-400/10", date: "Expiry: Dec 2026" },
  ];

  return (
    <div className="min-h-screen bg-[#121417] text-white p-8 font-sans">
      
      {/* SECTION 1: TOP DETAIL CARD */}
      <div className="bg-[#1c1f24] rounded-3xl p-8 mb-8 shadow-xl">
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-4">
            <div className="w-2 h-6 bg-emerald-400 rounded-full" />
            <h2 className="text-xl font-medium text-gray-200">Inventory Overview</h2>
          </div>
          <div className="flex gap-3">
            <div className="bg-[#121417] px-4 py-2 rounded-xl text-sm border border-gray-700 flex items-center gap-2 cursor-pointer">
              This Month <span className="text-[10px]">▼</span>
            </div>
            <button className="bg-emerald-400 text-[#121417] px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-emerald-300 transition-colors">
              <Download size={16} /> Download Report
            </button>
          </div>
        </div>

        <div className="flex items-center gap-6 mb-10">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-400 to-cyan-400 flex items-center justify-center text-3xl font-bold text-[#121417]">
            JD
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">John Doe</h1>
            <div className="flex gap-12 mt-2">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Role</p>
                <p className="text-sm font-medium">Head Pharmacist</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Department</p>
                <p className="text-sm font-medium">Main Wing - Stock A</p>
              </div>
            </div>
          </div>
        </div>

        {/* STATS ROW */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Total Items', val: '1,240', icon: <Package size={18}/> },
            { label: 'Low Stock', val: '14 Alerts', icon: <AlertCircle size={18}/> },
            { label: 'Units Issued', val: '842', icon: <ArrowUpRight size={18}/> },
            { label: 'Urgent Tasks', val: '4 Pending', icon: <Bell size={18}/> },
          ].map((stat, i) => (
            <div key={i} className="bg-[#252930] p-5 rounded-2xl flex items-center gap-4 border border-gray-800/50">
              <div className="p-3 bg-[#121417] rounded-xl text-gray-400">{stat.icon}</div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">{stat.label}</p>
                <p className="text-lg font-bold">{stat.val}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: MEDICINE GRID */}
      <div className="bg-[#1c1f24] rounded-3xl p-8 shadow-xl">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="w-2 h-6 bg-emerald-400 rounded-full" />
            <h2 className="text-xl font-medium text-gray-200">Medicine Stock</h2>
          </div>
          <div className="flex gap-2">
            <button className="p-2 bg-[#252930] rounded-lg text-gray-400 border border-gray-700"><SortAsc size={18}/></button>
            <button className="p-2 bg-[#252930] rounded-lg text-gray-400 border border-gray-700"><Filter size={18}/></button>
            <button className="ml-2 bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 px-4 py-2 rounded-xl text-xs font-bold">
              + Add Medicine
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {stockItems.map((item) => (
            <div key={item.id} className="bg-[#252930] p-6 rounded-2xl border border-gray-800 group hover:border-emerald-400/30 transition-all">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-xs text-gray-500 mb-1">{item.date}</p>
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                </div>
                <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase ${item.bg} ${item.color}`}>
                  {item.status}
                </span>
              </div>
              
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase">Quantity</p>
                  <p className="text-2xl font-bold">{item.qty}</p>
                </div>
                <button className="bg-[#121417] hover:bg-emerald-400 hover:text-[#121417] text-white text-[11px] font-bold px-4 py-2 rounded-lg transition-all">
                  Give to Nurse
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* PAGINATION (Matching image style) */}
        <div className="flex justify-center gap-2 mt-10">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs cursor-pointer ${n === 1 ? 'bg-[#373c44] text-white border border-gray-600' : 'text-gray-600 hover:text-gray-300'}`}>
              {n}
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
};

export default StockDashboard;