import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RequestList = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${backendUrl}/api/requests/showRequests`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRequests(Array.isArray(response.data) ? response.data : response.data.requests || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching requests:', err);
      setError('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading requests...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-6">Request List</h1>
      
      {requests.length === 0 ? (
        <p className="text-gray-500">No requests found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Item Name</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Quantity</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Urgency</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Requested By</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{request.requestType || 'N/A'}</td>
                  <td className="border border-gray-300 px-4 py-2">{request.itemName || 'N/A'}</td>
                  <td className="border border-gray-300 px-4 py-2">{request.quantity || 'N/A'}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getUrgencyColor(request.urgency)}`}>
                      {request.urgency || 'Normal'}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      request.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800'
                        : request.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {request.status || 'Pending'}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {request.createdBy?.username || 'Unknown'}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {request.createdAt ? new Date(request.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RequestList;
