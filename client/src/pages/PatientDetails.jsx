import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

function PatientDetails() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { id } = useParams();

  const getPatientDetails = async (id) => {
    try {
      const response = await axios.get(`${backendUrl}/api/patients/${id}`);
      console.log("Patient details:", response.data);
      if (response.data.success) {
        toast.success("Patient details fetched successfully!");
      }
    } catch (error) {
      toast.error("Failed to fetch patient details.");
    }
  };
  return (
    <div>
      <h1 className="text-center text-5xl leading-[1.1666666667] font-normal tracking-[-0.5px]">
        Patient Details
      </h1>
    </div>
  );
}

export default PatientDetails;
