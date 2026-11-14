import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/requests', config);
        setRequests(res.data);
      } catch (err) { toast.error('Failed to load requests'); } 
      finally { setLoading(false); }
    };
    fetchRequests();
  }, []);

  if (loading) return <div className="p-8 text-gray-500">Loading requests...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">My Room Requests</h1>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
              <th className="p-4 font-medium">Hostel</th>
              <th className="p-4 font-medium">Room Number</th>
              <th className="p-4 font-medium">Date Applied</th>
              <th className="p-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr><td colSpan="4" className="p-8 text-center text-gray-500">You haven't applied to any hostels yet.</td></tr>
            ) : (
              requests.map(req => (
                <tr key={req._id} className="border-b border-gray-50">
                  <td className="p-4 font-semibold text-gray-800">{req.hostelId?.name || 'N/A'}</td>
                  <td className="p-4 text-gray-600">{req.roomId?.roomNumber || 'Not allocated'}</td>
                  <td className="p-4 text-gray-600">{new Date(req.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      req.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                      req.status === 'Rejected' ? 'bg-red-100 text-red-700' : 
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}