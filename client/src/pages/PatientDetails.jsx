import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {OrbitProgress} from "react-loading-indicators"
function PatientDetails() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { id } = useParams();
  const [patients, setPatients] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getPatientDetails(id);
    }
  }, [id]);

  const getPatientDetails = async (patientId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${backendUrl}/api/patients/${patientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPatients(response.data);
      console.log("Patient details:", response.data);
      
    } catch (error) {
      console.error("Error fetching patient details:", error);
      toast.error("Failed to fetch patient details.");
    } finally {
      setLoading(false);
    }
  };
  return (
  <div className="max-w-4xl mx-auto p-8 bg-gray-50 min-h-screen">
    {loading ? (
      <div className="text-center py-10">
        <OrbitProgress color={["red","green","blue","orange"]} size={50}/>
        <p className="text-gray-600">Loading patient details...</p>
      </div>
    ) : patients ? (
      <>
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-center text-5xl leading-[1.1666666667] font-normal tracking-[-0.5px] text-slate-900">
            Patient Details
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="md:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
            <div className="w-32 h-32 bg-slate-200 rounded-full mb-4 flex items-center justify-center text-slate-400">
              <span className="text-4xl">{patients.firstName?.[0]}{patients.lastName?.[0]}</span>
            </div>
            <h2 className="text-xl font-semibold text-slate-800">{patients.firstName} {patients.lastName}</h2>
            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full mt-2 uppercase tracking-wide">
              {patients.isHospitalized ? "Hospitalized" : "In-Patient"}
            </span>
          </div>

          
          <div className="md:col-span-2 space-y-6">
           
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b pb-2">
                Personal Information
              </h3>
              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <div>
                  <p className="text-slate-500">Date of Birth</p>
                  <p className="font-medium text-slate-800">{new Date(patients.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-slate-500">Gender</p>
                  <p className="font-medium text-slate-800">{patients.gender}</p>
                </div>
              </div>
            </section>

            
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b pb-2">
                Clinical Status
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-slate-500 text-sm">Condition/Disease</p>
                  <p className="font-medium text-slate-800">{patients.disease}</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </>
    ) : (
      <div className="text-center py-10">
        <p className="text-gray-600">No patient data found</p>
      </div>
    )}
  </div>
);
}

export default PatientDetails;
