import React from 'react';
import {Button} from "@heroui/react"
import {Plus} from 'lucide-react'

function Medicines() {
  const medicineList = [
    { id: 1, name: 'Amoxicillin', dosage: '500mg', type: 'Capsule', status: 'In Stock', count: 12, expiry: '12/2025' },
    { id: 2, name: 'Lisinopril', dosage: '10mg', type: 'Tablet', status: 'Low Stock', count: 3, expiry: '08/2024' },
    { id: 3, name: 'Atorvastatin', dosage: '20mg', type: 'Tablet', status: 'In Stock', count: 30, expiry: '05/2026' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 font-sans">
    
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <h1 className="text-5xl leading-[1.1666666667] font-normal tracking-[-1px] text-slate-900">
            Medicine Cabinet
          </h1>
          <p className="text-slate-500 mt-2 text-lg">Manage and track your pharmaceutical inventory.</p>
        </div>
        <Button>
          <Plus/> Add New Medicine
        </Button>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          { label: 'Total Medicines', value: '24', color: 'text-blue-600' },
          { label: 'Expiring Soon', value: '3', color: 'text-amber-600' },
          { label: 'Refills Needed', value: '2', color: 'text-rose-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</p>
            <p className={`text-3xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Grid List */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {medicineList.map((med) => (
          <div key={med.id} className="bg-white group rounded-3xl border border-slate-100 p-6 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                <svg className="w-6 h-6 text-slate-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded-md ${
                med.status === 'Low Stock' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
              }`}>
                {med.status}
              </span>
            </div>

            <h3 className="text-xl font-bold text-slate-800">{med.name}</h3>
            <p className="text-slate-500 text-sm mb-4">{med.dosage} • {med.type}</p>
            
            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold">In Stock</p>
                <p className="text-lg font-semibold text-slate-700">{med.count} units</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Expiry</p>
                <p className="text-sm font-medium text-slate-700">{med.expiry}</p>
              </div>
            </div>
            
            <button className="w-full mt-6 py-2 rounded-xl bg-slate-50 text-slate-600 font-medium text-sm hover:bg-slate-100 transition-colors">
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Medicines;