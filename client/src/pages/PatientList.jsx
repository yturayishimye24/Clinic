import React, { useState, useEffect } from "react";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { UserPlus } from "lucide-react";
import { Search, Edit, ActivitySquare, Trash2 } from "lucide-react";
import {Envelope, Globe, Plus, TrashBin} from "@gravity-ui/icons";
import {Button} from "@heroui/react";
import {Avatar} from "@heroui/react";
import { useParams } from "react-router-dom";


const PatientList = () => {
  const {id} = useParams();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    fetchPatients();
  }, []);
 
  const handleDeletePatient = async (patientId) => {
    if(!window.confirm("Delete this patient?")) return;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${backendUrl}/api/patients/delete_patient/${patientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        
      });
      if(response.status === 200){
          toast.success("Patient deleted successfully");
          fetchPatients();
        } else {
          toast.error("Failed to delete patient");
        }
    } catch (error) {
      console.error("Error deleting patient:", error);
    }
  };
  const handleEdit = async() =>{
    setSaving(true);

    try{
      const token = localStorage.getItem("token");
      const response = await axios.put(`${backendUrl}/api/patients/${id}`,{
        firstName,
        lastName,
        gender,
        date,
        disease

      })
      if(!response.data){
        toast.error("Failed to update patient")
      }else{
        toast.success("Patient updated successfully")
        fetchPatients();
      }
    }catch(error){
      console.error("Error updating patient:", error);
    }finally{
      setSaving(false);
    }
  }
  const fetchPatients = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${backendUrl}/api/patients/displayPatients`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setPatients(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching patients:", err);
      setError("Failed to load patients");
    } finally {
      setLoading(false);
    }
  };
  const filteredPatients = patients.filter((patient) => {
    const userFullName =
      `${patient.firstName} ${patient.lastName}`.toLowerCase();
    return userFullName.includes(searchTerm.toLowerCase());
  });
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    return `${backendUrl}${imagePath}`;
  };

  if (loading) {
    return <div className="p-6 text-center">Loading patients...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  return (
    <>
    <div className="mt-10">
      <Button variant="secondary">
        <Plus />
        Add Member
      </Button>
      </div>
      <div className="xl:col-span-2 bg-white rounded-3xl border border-gray-100 cozy-shadow mt-5 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-lg text-gray-800">Assigned Patients</h3>
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
              {
              filteredPatients.length === 0 && !loading ? (
                <div className="flex items-center justify-center flex-col py-10 text-center ml-[200px]">
                  <img src="/public/images/bed-solid-full.svg" alt="No patients" className="w-24 h-24 mx-auto mb-4 text-gray-400" />
                  <p colSpan="4" className="p-6 text-gray-500">
                    No patients assigned yet. Click the button below to add a new patient.
                  </p>
                    <Button onClick={() => setShowForm(true)}>Add New Patient</Button>
                  
                </div>
              ) : loading ? (
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
                              new Date(patient.date).getFullYear()}{" "}
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
                        <Badge variant="destructive">Hostpitalized</Badge>
                      ) : (
                        <Badge variant="default">In care...</Badge>
                      )}
                    </td>
                    <td className="pr-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={ handleEdit}
                          className="btn btn-ghost btn-xs btn-circle"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleHospitalize(patient._id)}
                          className="btn btn-warning btn-xs btn-circle"
                        >
                          <ActivitySquare className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePatient(patient._id)}
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
    </>
  );
};

export default PatientList;
