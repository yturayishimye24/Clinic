import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, TrashBin } from "@gravity-ui/icons"; // Using TrashBin from your package
import { Button, Input, Label } from "@heroui/react";
import { OrbitProgress } from "react-loading-indicators";

// 1. Explicit Tailwind border utility tokens to prevent purge compilation issues
const PALE_BORDERS = [
  'border-[#F4E0CB]', // Pale Beige/Orange
  'border-[#C0DCBD]', // Pale Green/Mint
  'border-[#D0E1FD]', // Pale Blue
  'border-[#EBD3F8]', // Pale Purple
];

const RequestList = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requestType, setRequestType] = useState("Medicine"); // Added default matching fallback
  const [quantity, setQuantity] = useState(1);
  const [itemName, setItemName] = useState("");
  const [reason, setReason] = useState("");
  const [urgency, setUrgency] = useState("low");
  const [showRequestForm, setShowRequestForm] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${backendUrl}/api/requests/showRequests`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setRequests(
        Array.isArray(response.data)
          ? response.data
          : response.data.requests || [],
      );
      setError(null);
    } catch (err) {
      setError("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const requestData = {
        requestType,
        itemName,
        quantity,
        urgency,
        reason,
      };
      const response = await axios.post(
        `${backendUrl}/api/requests/createRequests`,
        requestData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (response.data.success) {
        alert("Request submitted successfully");
        setShowRequestForm(false);
        fetchRequests();
        // Reset request form fields cleanly
        setItemName("");
        setQuantity(1);
        setReason("");
        setUrgency("low");
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to submit request");
    }
  };

  // Keep your existing custom deletion endpoint fallback configuration
  const handleDeleteRequest = async (id, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!window.confirm("Are you sure you want to delete this request?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${backendUrl}/api/requests/removeRequests/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchRequests();
    } catch (error) {
      console.error(error);
      alert("Failed to delete the request item");
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-gray-50">
        <OrbitProgress
          size={60}
          color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]}
        />
        <div className="text-center text-gray-500 font-medium">
          Loading Dashboard...
        </div>
      </div>
    );

  return (
    <div >
      {/* Top Header Section */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-[#202124] text-4xl leading-[1.2222222222] font-normal tracking-[-0.25px]">
          Requests
        </h1>
        
        {/* Dynamic Action Button toggles layout view state natively */}
        {!showRequestForm && (
          <Button
            color="primary"
            variant="solid"
            className="rounded-xl font-medium"
            onClick={() => setShowRequestForm(true)}
          >
            <Plus />
            Make a Request
          </Button>
        )}
      </div>

      {/* Main Container Layer split horizontally */}
      <div className="flex flex-col lg:flex-row gap-10 items-start">
        
        {/* Left Side Section: Full Width Stack List */}
        <div className="flex-1 w-full space-y-4">
          {requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-10 text-center bg-white border border-gray-100 rounded-[2rem] shadow-sm">
              <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4 text-2xl">
                📭
              </div>
              <h3 className="text-gray-700 font-semibold text-lg">
                No Requests Yet
              </h3>
              <p className="text-gray-400 text-sm mt-1 max-w-xs mb-6">
                You haven't created any request records. Get started right away by making a new entry.
              </p>
              <Button color="primary" variant="flat" onClick={() => setShowRequestForm(true)}>
                <Plus />
                Add Request
              </Button>
            </div>
          ) : (
            requests.map((req, idx) => {
              // Mathematical color loop distribution matching execution positions
              const cardBorderColor = PALE_BORDERS[idx % PALE_BORDERS.length];

              return (
                <div
                  key={req._id}
                  className={`w-full border-2 ${cardBorderColor} bg-white h-[127px] rounded-xl flex items-center justify-between px-6 transition-all duration-200 hover:shadow-sm group`}
                >
                  {/* Item Details Layout */}
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Character Token Badge container matching original layout design structure */}
                    <div className="flex items-center justify-center bg-gray-100 text-gray-700 text-xs w-9 h-9 rounded-full font-bold shrink-0">
                      {(req.itemName || "RQ").substring(0, 2).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <p className="text-base font-semibold text-gray-900 truncate">
                        {req.itemName}
                      </p>
                      <p className="text-xs font-medium text-gray-500 mt-1 truncate">
                        {req.requestType || "General Request"} &bull; Qty: {req.quantity || 0}
                      </p>
                    </div>
                  </div>

                  {/* Status Badges + Action Buttons Column */}
                  <div className="flex items-center gap-4 shrink-0">
                    <span
                      className={`text-xs font-bold px-3 py-1.5 rounded-full capitalize ${
                        req.urgency === "high" 
                          ? "bg-red-50 text-red-600" 
                          : req.urgency === "medium"
                          ? "bg-amber-50 text-amber-600"
                          : "bg-purple-50 text-purple-600"
                      }`}
                    >
                      {req.urgency || "low"}
                    </span>

                    <span
                      className={`text-xs font-semibold px-3 py-1.5 rounded-md uppercase tracking-wider ${
                        req.status === "approved" 
                          ? "bg-green-100 text-green-700" 
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {req.status || "pending"}
                    </span>

                    {/* Isolated Trash Controls avoiding link layer bleeding loops */}
                    <Button
                      isIconOnly
                      variant="light"
                      onClick={(e) => handleDeleteRequest(req._id, e)}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
                    >
                      <TrashBin className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Sheet Rendering Framework Block */}
        {showRequestForm && (
          <dialog className="modal modal-open bg-slate-900/40 backdrop-blur-sm flex items-center justify-center fixed inset-0 z-50">
            <div className="modal-box w-full max-w-lg bg-white p-6 rounded-[2rem] shadow-xl border border-gray-100">
              <h2 className="font-bold text-xl text-gray-800 mb-6">New Request</h2>
              
              <form onSubmit={handleRequestSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-gray-700">Type</label>
                    <select
                      value={requestType}
                      onChange={(e) => setRequestType(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                    >
                      <option value="Medicine">Medicine Request</option>
                      <option value="Equipment">Equipment Request</option>
                      <option value="Supply">Supply Request</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="item-name-input" className="text-sm font-semibold text-gray-700">Item name</Label>
                    <Input
                      required
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      id="item-name-input"
                      placeholder="e.g. Paracetamol"
                      type="text"
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-gray-700">Quantity</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      placeholder="1"
                      className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-gray-700">Urgency</label>
                    <select
                      value={urgency}
                      onChange={(e) => setUrgency(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700">Reason</label>
                  <textarea
                    required
                    rows={3}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Provide justification details..."
                    className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm resize-none"
                  ></textarea>
                </div>

                {/* Form Navigation Controls Actions */}
                <div className="flex justify-end items-center gap-3 mt-6 pt-4 border-t border-gray-100">
                  <Button
                    type="button"
                    variant="light"
                    color="danger"
                    className="rounded-xl font-medium"
                    onClick={() => setShowRequestForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    color="primary"
                    className="rounded-xl font-medium"
                  >
                    Submit Request
                  </Button>
                </div>
              </form>
            </div>
          </dialog>
        )}
      </div>
    </div>
  );
};

export default RequestList;