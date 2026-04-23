import React, { useState, useEffect } from "react";
import axios from "axios";
import { Envelope, Globe, Plus, TrashBin } from "@gravity-ui/icons";
import { Button, Input, Label } from "@heroui/react";
import { OrbitProgress } from "react-loading-indicators";

const RequestDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requestType, setRequestType] = useState("");
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
        // Reset request form
        setItemName("");
        setQuantity("");
        setReason("");
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to submit request");
    }
  };

  if (loading)
    return (
      <>
        <OrbitProgress
          size={60}
          color={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]}
        />
        <div className="p-6 text-center text-gray-500">
          Loading Dashboard...
        </div>
      </>
    );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Side: Requests Grid */}
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-700 mb-6">Stats</h2>
          {requests.length === 0 ? (
            <div>
              <div className="col-span-full row-span-full pl-6 flex flex-col items-center justify-center py-16 px-10 text-center bg-white border border-gray-100 rounded-[2rem]">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <span className="text-gray-400 text-2xl">📭</span>
                </div>
                <h3 className="text-gray-700 font-semibold text-lg">
                  No Requests Yet
                </h3>
                <p className="text-gray-400 text-sm mt-1 max-w-xs">
                  You haven't created or received any requests. Start by
                  creating one.
                </p>
                <Button variant="secondary">
                  <Plus />
                  Add Request
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {requests.map((req) => (
                <div
                  key={req._id}
                  className="bg-white p-6 rounded-[2rem] shadow-sm flex items-center gap-4 border border-gray-100"
                >
                  <div
                    className={`p-4 rounded-2xl ${req.urgency === "high" ? "bg-red-50" : "bg-purple-50"}`}
                  >
                    {/* Placeholder Icon */}
                    <div
                      className={`w-5 h-10 rounded-full border-2 ${req.urgency === "high" ? "border-red-400" : "border-purple-400"}`}
                    ></div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm font-medium">
                      {req.requestType || "Request"}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-gray-800">
                        {req.quantity || 0}
                      </span>
                      <span
                        className={`text-xs font-bold ${req.status === "approved" ? "text-green-500" : "text-red-400"}`}
                      >
                        {req.status === "approved" ? "↑" : "↓"}{" "}
                        {req.urgency || "Normal"}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs mt-1 truncate w-32">
                      {req.itemName}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Quick Post Form */}
        <div className="w-full lg:w-[400px]">
          <h2 className="text-xl font-bold text-gray-700 mb-6">Quick Post</h2>
          <br></br>
          <br></br>
          {showRequestForm ? (
            <>
              <dialog
                className="modal modal-open bg-slate-900/40 backdrop-blur-sm"
                onClick={() => setShowRequestForm(false)}
              >
                <div
                  className="modal-box w-full max-w-lg"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h2 className="font-bold text-lg mb-6">New Request</h2>
                  <br></br>
                  <br></br>
                  <form onSubmit={handleRequestSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="label">
                          <span className="label-text font-semibold">Type</span>
                        </label>
                        <select
                          value={requestType}
                          onChange={(e) => setRequestType(e.target.value)}
                          className=" input bg-base-200 border-none focus:ring-2 focus:ring-primary/20 transition-all"
                        >
                          <option value="Medicine">Medicine Request</option>
                          <option value="Equipment">Equipment Request</option>
                          <option value="Supply">Supply Request</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1">
                        <Label htmlFor="input-type-email">Item name</Label>
                        <Input
                          required
                          value={itemName}
                          onChange={(e) => setItemName(e.target.value)}
                          id="input-type-email"
                          placeholder="e.g. Paracetamol"
                          type="text"
                          className="input bg-base-200 border-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="label">
                          <span className="label-text font-semibold">
                            Quantity
                          </span>
                        </label>
                        <input
                          type="number"
                          required
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                          placeholder="0"
                          className="input bg-base-200 border-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                      </div>
                      <div>
                        <label className="label">
                          <span className="label-text font-semibold">
                            Urgency
                          </span>
                        </label>
                        <select
                          value={urgency}
                          onChange={(e) => setUrgency(e.target.value)}
                          className="input bg-base-200 border-none focus:ring-2 focus:ring-primary/20 transition-all"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="label">
                        <span className="label-text font-semibold">Reason</span>
                      </label>
                      <br></br>
                      <br></br>
                      <textarea
                        required
                        rows={2}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Enter reason"
                        className="textarea bg-base-200 border-none focus:ring-2 focus:ring-primary/20 transition-all w-full"
                      ></textarea>
                    </div>
                    <div className="modal-action">
                      <Button
                        variant="danger"
                        type="button"
                        className="btn btn-ghost"
                        onClick={() => setShowRequestForm(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={loading}>
                        Submit Request
                      </Button>
                    </div>
                  </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                  <button onClick={() => setShowRequestForm(false)}>
                    close
                  </button>
                </form>
              </dialog>
            </>
          ) : (
            <>
              <Button
                fullWidth
                color="primary"
                onClick={() => setShowRequestForm(true)}
              >
                <Plus />
                Make a Request
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestDashboard;
