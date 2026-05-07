import React, { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import { Plus } from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function Medicines() {
  const [loading, setLoading] = useState(false);
  const [medicines, setMedicines] = useState([]);

  const [medicineName, setMedicineName] = useState("");
  const [category, setCategory] = useState("");
  const [dosage, setDosage] = useState("");
  const [medicineType, setMedicineType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [medicineUnits, setMedicineUnits] = useState("");
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
          quantity,
          medicineUnits,
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

        setMedicines((prev) => [...prev, response.data.medicine]);
        setMedicineFormOpen(false);

        setMedicineName("");
        setCategory("");
        setDosage("");
        setMedicineType("");
        setQuantity("");
        setMedicineUnits("");
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
        <Button onClick={() => setMedicineFormOpen(true)}>
          <Plus /> Add New Medicine
        </Button>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full rounded-3xl bg-white border border-slate-100 p-8 text-center text-slate-500 shadow-sm">
            Loading medicines...
          </div>
        ) : medicines.length === 0 ? (
          <div className="col-span-full rounded-3xl bg-white border border-slate-100 p-8 text-center text-slate-500 shadow-sm">
            No medicines available.
          </div>
        ) : (
          medicines.map((medicine) => {
            const status = medicine.status || "In Stock";
            const expiry = medicine.expiryDate
              ? medicine.expiryDate.toString().slice(0, 10)
              : "N/A";

            return (
              <div
                key={medicine._id || medicine.id}
                className="bg-white group rounded-3xl border border-slate-100 p-6 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300"
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
                  <span
                    className={`text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded-md ${
                      status === "Low Stock"
                        ? "bg-rose-50 text-rose-600"
                        : "bg-emerald-50 text-emerald-600"
                    }`}
                  >
                    {status}
                  </span>
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
                    <p className="text-[10px] text-slate-400 uppercase font-bold">
                      In Stock
                    </p>
                    <p className="text-lg font-semibold text-slate-700">
                      {medicine.quantity ?? 0} units
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
          })
        )}
      </div>
      {medicineFormOpen && (
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">Add New Medicine</h2>

            <form onSubmit={(e) => addMedicines(e)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Medicine Name</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={medicineName}
                    onChange={(e) => setMedicineName(e.target.value)}
                    placeholder="e.g Paracetamol"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Category</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option disabled value="">
                      Select category
                    </option>
                    <option value="pain">Pain</option>
                    <option value="antibiotics">Antibiotics</option>
                    <option value="relief">Relief</option>
                    <option value="vitamins">Vitamins</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Dosage</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    placeholder="e.g 500mg"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Medicine Type</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={medicineType}
                    onChange={(e) => setMedicineType(e.target.value)}
                  >
                    <option disabled value="">
                      Select type
                    </option>
                    <option value="tablet">Tablet</option>
                    <option value="capsule">Capsule</option>
                    <option value="syrup">Syrup</option>
                    <option value="suspensions">Suspension</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Quantity</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="e.g 100"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Medicine Units</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered"
                    value={medicineUnits}
                    onChange={(e) => setMedicineUnits(e.target.value)}
                    placeholder="e.g 10 per strip"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Expiry Date</span>
                  </label>
                  <input
                    type="date"
                    className="input input-bordered"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">Instructions</span>
                </label>
                <textarea
                  className="textarea textarea-bordered"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="How to use the medicine"
                />
              </div>

              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">Side Effects</span>
                </label>
                <textarea
                  className="textarea textarea-bordered"
                  value={sideEffects}
                  onChange={(e) => setSideEffects(e.target.value)}
                  placeholder="Possible side effects"
                />
              </div>

              <div className="card-actions justify-between mt-6">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setMedicineFormOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Add Medicine"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Medicines;
