import React, { useState, useEffect } from "react";
import axios from "axios";

export default function PrescribeMedicineModal({ patient, isOpen, onClose, onPrescriptionSuccess }) {
  const [medicinesList, setMedicinesList] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState("");
  const [quantity, setQuantity] = useState("");
  const [morningDose, setMorningDose] = useState("");
  const [afternoonDose, setAfternoonDose] = useState("");
  const [eveningDose, setEveningDose] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all medicines from your backend when modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchMedicines = async () => {
        try {
          const token = localStorage.getItem("token"); // or how you manage tokens
          const response = await axios.get("http://localhost:4000/api/medicines/display", {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.data.success) {
            setMedicinesList(response.data.medicine);
          }
        } catch (err) {
          console.error("Error fetching medicines:", err);
          setError("Failed to load medicines list.");
        }
      };
      fetchMedicines();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMedicine || !quantity) {
      setError("Please select a medicine and state the overall quantity.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:4000/api/patients/dispense-medicine",
        {
          patientId: patient._id,
          medicineId: selectedMedicine,
          quantityGiven: quantity,
          morningDose,
          afternoonDose,
          eveningDose,
          notes
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        onPrescriptionSuccess(response.data.patient);
        onClose();
        // Reset local form variables
        setSelectedMedicine("");
        setQuantity("");
        setMorningDose("");
        setAfternoonDose("");
        setEveningDose("");
        setNotes("");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred while prescribing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-xl p-8 bg-white rounded-2xl shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto transform scale-100 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Prescribe Medicine
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Assigning medication to <span className="font-semibold text-gray-700">{patient?.firstName} {patient?.lastName}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-gray-100 transition-colors">
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 text-sm text-red-700 bg-red-50 rounded-lg border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Custom Floating Label Dropdown (References Screenshot 2026-05-31 110715.png) */}
          <div className="relative w-full">
            <select
              id="medicineSelect"
              value={selectedMedicine}
              onChange={(e) => setSelectedMedicine(e.target.value)}
              className="peer w-full appearance-none rounded border-[1.5px] border-gray-300 bg-transparent px-4 py-3.5 text-base text-gray-900 outline-none transition-all duration-200 focus:border-2 focus:border-blue-600"
            >
              <option value="" hidden></option>
              {medicinesList.map((med) => (
                <option key={med._id} value={med._id}>
                  {med.medicineName} ({med.dosage}) - Stock: {med.quantity}
                </option>
              ))}
            </select>
            <label
              htmlFor="medicineSelect"
              className={`absolute left-3 bg-white px-1 transition-all duration-200 pointer-events-none text-gray-500
                peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-600
                ${selectedMedicine ? 'top-0 text-xs' : 'top-1/2 -translate-y-1/2 text-base'}`}
            >
              Select Medicine From Database
            </label>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 peer-focus:text-blue-600 peer-focus:rotate-180 transition-transform duration-200">
              ▲
            </div>
          </div>

          {/* Quantity Floating Input (References Screenshot 2026-05-31 110330.png) */}
          <div className="relative w-full">
            <input
              type="number"
              id="quantityInput"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder=" "
              className="peer w-full rounded border-[1.5px] border-gray-300 bg-transparent px-4 py-3.5 text-base text-gray-900 outline-none transition-all duration-200 focus:border-2 focus:border-blue-600"
            />
            <label
              htmlFor="quantityInput"
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white px-1 text-base text-gray-500 transition-all duration-200 pointer-events-none peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-600 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs"
            >
              Total Quantity To Dispense (e.g. 15)
            </label>
          </div>

          {/* Dosing Section Title */}
          <div className="pt-2">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Dosing Schedule</h3>
            <div className="grid grid-cols-3 gap-4">
              {/* Morning */}
              <div className="relative w-full">
                <input
                  type="text"
                  id="morningDose"
                  value={morningDose}
                  onChange={(e) => setMorningDose(e.target.value)}
                  placeholder=" "
                  className="peer w-full rounded border-[1.5px] border-gray-300 bg-transparent px-4 py-3 text-base text-gray-900 outline-none transition-all duration-200 focus:border-2 focus:border-blue-600"
                />
                <label htmlFor="morningDose" className="absolute left-3 top-1/2 -translate-y-1/2 bg-white px-1 text-sm text-gray-500 transition-all duration-200 pointer-events-none peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-600 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs">
                  🌅 Morning
                </label>
              </div>

              {/* Afternoon */}
              <div className="relative w-full">
                <input
                  type="text"
                  id="afternoonDose"
                  value={afternoonDose}
                  onChange={(e) => setAfternoonDose(e.target.value)}
                  placeholder=" "
                  className="peer w-full rounded border-[1.5px] border-gray-300 bg-transparent px-4 py-3 text-base text-gray-900 outline-none transition-all duration-200 focus:border-2 focus:border-blue-600"
                />
                <label htmlFor="afternoonDose" className="absolute left-3 top-1/2 -translate-y-1/2 bg-white px-1 text-sm text-gray-500 transition-all duration-200 pointer-events-none peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-600 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs">
                  ☀️ Lunch/Noon
                </label>
              </div>

              {/* Evening */}
              <div className="relative w-full">
                <input
                  type="text"
                  id="eveningDose"
                  value={eveningDose}
                  onChange={(e) => setEveningDose(e.target.value)}
                  placeholder=" "
                  className="peer w-full rounded border-[1.5px] border-gray-300 bg-transparent px-4 py-3 text-base text-gray-900 outline-none transition-all duration-200 focus:border-2 focus:border-blue-600"
                />
                <label htmlFor="eveningDose" className="absolute left-3 top-1/2 -translate-y-1/2 bg-white px-1 text-sm text-gray-500 transition-all duration-200 pointer-events-none peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-600 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs">
                  🌙 Evening
                </label>
              </div>
            </div>
          </div>

          {/* Notes Floating Textarea */}
          <div className="relative w-full">
            <textarea
              id="notesInput"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder=" "
              rows="2"
              className="peer w-full rounded border-[1.5px] border-gray-300 bg-transparent px-4 py-3.5 text-base text-gray-900 outline-none transition-all duration-200 focus:border-2 focus:border-blue-600 resize-none"
            />
            <label
              htmlFor="notesInput"
              className="absolute left-3 top-6 -translate-y-1/2 bg-white px-1 text-base text-gray-500 transition-all duration-200 pointer-events-none peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-600 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs"
            >
              Special Instructions (e.g., Take after meals)
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <button
              type="button"
              className="px-6 py-2 rounded-lg text-gray-600 hover:bg-gray-100 font-medium transition-colors duration-200"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200 shadow-md"
              disabled={loading}
            >
              {loading ? "Prescribing..." : "Prescribe Medicine"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}