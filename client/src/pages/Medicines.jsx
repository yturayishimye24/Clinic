import React, { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import { Trash2 } from "lucide-react";
import { TrashBin } from "@gravity-ui/icons";
import { Plus } from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { OrbitProgress } from "react-loading-indicators";
import { Input } from "@heroui/react";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

function Medicines() {
  const [loading, setLoading] = useState(false);
  const [medicines, setMedicines] = useState([]);

  const [medicineName, setMedicineName] = useState("");
  const [category, setCategory] = useState("");
  const [dosage, setDosage] = useState("");
  const [medicineType, setMedicineType] = useState("");
    const [units, setUnits] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [instructions, setInstructions] = useState("");
  const [sideEffects, setSideEffects] = useState("");
  const [medicineFormOpen, setMedicineFormOpen] = useState(false);

  const fetchMedicines = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);

    try {
      const response = await axios.get(`${backendUrl}/api/medicines/display`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setMedicines(response.data.medicine || []);
      } else {
        setMedicines([]);
        toast.error("Unable to load medicines.");
      }
    } catch (error) {
      console.log("Error fetching medicines", error?.message || error);
      toast.error("Error fetching medicines");
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  };

  const groupedMedicines = medicines.reduce((groups, medicine) => {
    const date = new Date(medicine.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    if (!groups[date]) {
      groups[date] = [];
    }

    groups[date].push(medicine);

    return groups;
  }, {});

  const handleDeleteMedicine = async (id) => {
    if (!window.confirm("Are you sure you want to delete this medicine?")) {
      return;
    }
    const token = localStorage.getItem("token");
    try {
      const response = await axios.delete(
        `${backendUrl}/api/medicines/delete/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (response.data.success) {
        toast.success("Medicine deleted successfully!");
        setMedicines((prev) => prev.filter((med) => med._id !== id));
      }
    } catch (error) {
      console.log("Error deleting medicine", error?.message || error);
      toast.error("Error deleting medicine");
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const addMedicines = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    setLoading(true);

    try {
      const response = await axios.post(
        `${backendUrl}/api/medicines/create`,
        {
          medicineName,
          category,
          dosage,
          medicineType,
          units,
          expiryDate,
          instructions,
          sideEffects,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        toast.success("Added medicine successfully!");

        const newMedicine =
          response.data.medicine || response.data.CreatedMedicine;
        setMedicines((prev) => [...prev, newMedicine]);
        setMedicineFormOpen(false);

        setMedicineName("");
        setCategory("");
        setDosage("");
        setMedicineType("");
        setUnits("");
        setExpiryDate("");
        setInstructions("");
        setSideEffects("");
      } else {
        toast.error("Failed to add medicine");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error adding medicine");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 font-sans">
      <ToastContainer />

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <h1 className="text-5xl leading-[1.1666666667] font-normal tracking-[-1px] text-slate-900">
            Medicine Store
          </h1>
          <p className="text-slate-500 mt-2 text-lg">
            Manage and track your pharmaceutical inventory.
          </p>
        </div>
        <Button onClick={() => setMedicineFormOpen(true)} variant="secondary">
          <Plus /> Add New Medicine
        </Button>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="flex flex-col items-centercol-span-full rounded-3xl  p-8 text-center text-slate-500 shadow-sm">
            <OrbitProgress size={40} color="#94a3b8" />
            Loading medicines...
          </div>
        ) : medicines.length === 0 ? (
          <div className="flex flex-col items-center col-span-full rounded-3xl p-8 text-center text-slate-500 shadow-sm gap-4">
            <i class="fa-solid fa-file-circle-xmark fa-5x"></i>
            No medicines available.
          </div>
        ) : (
          Object.entries(groupedMedicines).map(([date, meds]) => (
            <div key={date} className="col-span-full">
              <h2 className="text-2xl font-bold text-slate-700 mb-6 mt-4">
                {date}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {meds.map((medicine) => {
                  const status = medicine.status || "In Stock";

                  const expiry = medicine.expiryDate
                    ? medicine.expiryDate.toString().slice(0, 10)
                    : "N/A";

                  return (
                    <div
                      key={medicine._id || medicine.id}
                      className="bg-white group rounded-3xl border border-slate-100 p-6 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 relative"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                          <svg
                            className="w-6 h-6 text-slate-400 group-hover:text-blue-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                            />
                          </svg>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-slate-800">
                        {medicine.medicineName || "Unnamed medicine"}
                      </h3>

                      <p className="text-slate-500 text-sm mb-4">
                        {medicine.dosage || "No dosage provided"} •{" "}
                        {medicine.category || ""}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                        <div>
                          <Button
                            variant="danger"
                            className="absolute right-2 top-2"
                            onClick={() => handleDeleteMedicine(medicine._id)}
                          >
                            <TrashBin />
                          </Button>

                          <p className="text-lg font-semibold text-slate-700">
                            {medicine.units ?? 0} units
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-[10px] text-slate-400 uppercase font-bold">
                            Expiry
                          </p>

                          <p className="text-sm font-medium text-slate-700">
                            {expiry}
                          </p>
                        </div>
                      </div>

                      <button className="w-full mt-6 py-2 rounded-xl bg-slate-50 text-slate-600 font-medium text-sm hover:bg-slate-100 transition-colors">
                        View Details
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
      {medicineFormOpen && (
        <dialog
          className="modal modal-open bg-slate-900/40 backdrop-blur-sm"
          onClick={() => setMedicineFormOpen(false)}
        >
          <div
            className="modal-box w-full max-w-2xl p-8 bg-white rounded-2xl shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Section */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                  Add New Medicine
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Fill in the medicine details below.
                </p>
              </div>
              <button
                onClick={() => setMedicineFormOpen(false)}
                className="btn btn-sm btn-circle btn-ghost text-gray-500 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={(e) => addMedicines(e)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                {/* 1. Medicine Name Input */}
                <div className="relative w-full">
                  <input
                    type="text"
                    id="medicineInput"
                    value={medicineName}
                    onChange={(e) => setMedicineName(e.target.value)}
                    placeholder=" "
                    className="peer w-full rounded border-[1.5px] border-gray-300 bg-transparent px-4 py-3.5 text-base text-gray-900 outline-none transition-all duration-200 focus:border-2 focus:border-blue-600"
                  />
                  <label
                    htmlFor="medicineInput"
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white px-1 text-base text-gray-500 transition-all duration-200 pointer-events-none peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-600 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs"
                  >
                    Medicine Name (e.g. Paracetamol)
                  </label>
                </div>

                {/* 2. Category Select (Native Styled Dropdown Wrapper) */}
                <div className="relative w-full">
                  <select
                    id="categorySelect"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="peer w-full appearance-none rounded border-[1.5px] border-gray-300 bg-transparent px-4 py-3.5 text-base text-gray-900 outline-none transition-all duration-200 focus:border-2 focus:border-blue-600"
                  >
                    <option value="" hidden></option>
                    <option value="pain">Pain</option>
                    <option value="antibiotics">Antibiotics</option>
                    <option value="relief">Relief</option>
                    <option value="vitamins">Vitamins</option>
                  </select>
                  <label
                    htmlFor="categorySelect"
                    className={`absolute left-3 bg-white px-1 transition-all duration-200 pointer-events-none text-gray-500
            peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-600
            ${category ? "top-0 text-xs" : "top-1/2 -translate-y-1/2 text-base"}`}
                  >
                    Category
                  </label>
                  {/* Custom Chevron Arrow Icon */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 peer-focus:text-blue-600 peer-focus:rotate-180 transition-transform duration-200">
                    ▲
                  </div>
                </div>

                {/* 3. Dosage Input */}
                <div className="relative w-full">
                  <input
                    type="text"
                    id="dosageInput"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    placeholder=" "
                    className="peer w-full rounded border-[1.5px] border-gray-300 bg-transparent px-4 py-3.5 text-base text-gray-900 outline-none transition-all duration-200 focus:border-2 focus:border-blue-600"
                  />
                  <label
                    htmlFor="dosageInput"
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white px-1 text-base text-gray-500 transition-all duration-200 pointer-events-none peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-600 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs"
                  >
                    Dosage (e.g. 500mg)
                  </label>
                </div>

                {/* 4. Medicine Type Select */}
                <div className="relative w-full">
                  <select
                    id="medicineTypeSelect"
                    value={medicineType}
                    onChange={(e) => setMedicineType(e.target.value)}
                    className="peer w-full appearance-none rounded border-[1.5px] border-gray-300 bg-transparent px-4 py-3.5 text-base text-gray-900 outline-none transition-all duration-200 focus:border-2 focus:border-blue-600"
                  >
                    <option value="" hidden></option>
                    <option value="tablet">Tablet</option>
                    <option value="capsule">Capsule</option>
                    <option value="syrup">Syrup</option>
                    <option value="suspensions">Suspension</option>
                  </select>
                  <label
                    htmlFor="medicineTypeSelect"
                    className={`absolute left-3 bg-white px-1 transition-all duration-200 pointer-events-none text-gray-500
            peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-600
            ${medicineType ? "top-0 text-xs" : "top-1/2 -translate-y-1/2 text-base"}`}
                  >
                    Medicine Type
                  </label>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 peer-focus:text-blue-600 peer-focus:rotate-180 transition-transform duration-200">
                    ▲
                  </div>
                </div>

                

                
                <div className="relative w-full">
                  <input
                    type="number"
                    id="unitsInput"
                    value={units}
                    onChange={(e) => setUnits(e.target.value)}
                    placeholder=" "
                    className="peer w-full rounded border-[1.5px] border-gray-300 bg-transparent px-4 py-3.5 text-base text-gray-900 outline-none transition-all duration-200 focus:border-2 focus:border-blue-600"
                  />
                  <label
                    htmlFor="unitsInput"
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white px-1 text-base text-gray-500 transition-all duration-200 pointer-events-none peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-600 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs"
                  >
                    Medicine Units (e.g. 10 per strip)
                  </label>
                </div>

                {/* 7. Expiry Date Picker */}
                <div className="relative w-full md:col-span-2">
                  <input
                    type="date"
                    id="expiryInput"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    placeholder=" "
                    className="peer w-full rounded border-[1.5px] border-gray-300 bg-transparent px-4 py-3.5 text-base text-gray-900 outline-none transition-all duration-200 focus:border-2 focus:border-blue-600"
                  />
                  <label
                    htmlFor="expiryInput"
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white px-1 text-base text-gray-500 transition-all duration-200 pointer-events-none peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-600 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs"
                  >
                    Expiry Date
                  </label>
                </div>
              </div>

              {/* 8. Instructions Textarea */}
              <div className="relative w-full mt-6">
                <textarea
                  id="instructionsInput"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder=" "
                  rows="3"
                  className="peer w-full rounded border-[1.5px] border-gray-300 bg-transparent px-4 py-3.5 text-base text-gray-900 outline-none transition-all duration-200 focus:border-2 focus:border-blue-600 resize-none"
                />
                <label
                  htmlFor="instructionsInput"
                  className="absolute left-3 top-6 -translate-y-1/2 bg-white px-1 text-base text-gray-500 transition-all duration-200 pointer-events-none peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-600 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs"
                >
                  Instructions (How to use the medicine)
                </label>
              </div>

              {/* 9. Side Effects Textarea */}
              <div className="relative w-full mt-6">
                <textarea
                  id="sideEffectsInput"
                  value={sideEffects}
                  onChange={(e) => setSideEffects(e.target.value)}
                  placeholder=" "
                  rows="3"
                  className="peer w-full rounded border-[1.5px] border-gray-300 bg-transparent px-4 py-3.5 text-base text-gray-900 outline-none transition-all duration-200 focus:border-2 focus:border-blue-600 resize-none"
                />
                <label
                  htmlFor="sideEffectsInput"
                  className="absolute left-3 top-6 -translate-y-1/2 bg-white px-1 text-base text-gray-500 transition-all duration-200 pointer-events-none peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-600 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs"
                >
                  Side Effects (Possible side effects)
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center mt-8">
                <button
                  type="button"
                  className="px-6 py-2 rounded-lg text-gray-600 hover:bg-gray-100 font-medium transition-colors duration-200"
                  onClick={() => setMedicineFormOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200 shadow-md"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Add Medicine"}
                </button>
              </div>
            </form>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setMedicineFormOpen(false)}>close</button>
          </form>
        </dialog>
      )}
    </div>
  );
}

export default Medicines;
