import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RequestDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '' });
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${backendUrl}/api/requests/showRequests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(Array.isArray(response.data) ? response.data : response.data.requests || []);
      setError(null);
    } catch (err) {
      setError('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${backendUrl}/api/requests/create`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormData({ title: '', content: '' });
      fetchRequests();
    } catch (err) {
      alert("Failed to post request");
    }
  };

  if (loading) return <div className="p-6 text-center text-gray-500">Loading Dashboard...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Requests Grid */}
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-700 mb-6">Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {requests.map((req) => (
              <div key={req._id} className="bg-white p-6 rounded-[2rem] shadow-sm flex items-center gap-4 border border-gray-100">
                <div className={`p-4 rounded-2xl ${req.urgency === 'high' ? 'bg-red-50' : 'bg-purple-50'}`}>
                   {/* Placeholder Icon */}
                  <div className={`w-5 h-10 rounded-full border-2 ${req.urgency === 'high' ? 'border-red-400' : 'border-purple-400'}`}></div>
                </div>
                <div>
                  <p className="text-gray-400 text-sm font-medium">{req.requestType || 'Request'}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-800">{req.quantity || 0}</span>
                    <span className={`text-xs font-bold ${req.status === 'approved' ? 'text-green-500' : 'text-red-400'}`}>
                      {req.status === 'approved' ? '↑' : '↓'} {req.urgency || 'Normal'}
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs mt-1 truncate w-32">{req.itemName}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Quick Post Form */}
        <div className="w-full lg:w-[400px]">
          <h2 className="text-xl font-bold text-gray-700 mb-6">Quick Post</h2>
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <form onSubmit={handlePost} className="space-y-6">
              <div>
                <label className="block text-gray-500 text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  className="w-full p-3 rounded-full border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-100"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-gray-500 text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  className="w-full p-3 rounded-full border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-100"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-gray-500 text-sm font-medium mb-2">Content</label>
                <textarea
                  rows="5"
                  placeholder="Empty"
                  className="w-full p-4 rounded-[2rem] border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-100 resize-none"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                />
              </div>
              <button
                type="submit"
                className="bg-purple-50 text-purple-600 px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-purple-100 transition-colors"
                onClick={()=>Report}
              >
                Create report
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RequestDashboard;