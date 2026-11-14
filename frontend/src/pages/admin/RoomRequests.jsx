import { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RoomRequests() {
  const [requests, setRequests] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  
  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchData = async () => {
    try {
      const reqRes = await axios.get('http://localhost:5000/api/requests', config);
      setRequests(reqRes.data);
      const roomsRes = await axios.get('http://localhost:5000/api/rooms/available', config);
      setAvailableRooms(roomsRes.data);
    } catch (err) { toast.error('Failed to load requests'); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleApprove = async (requestId, roomId) => {
    if (!roomId) return toast.error('Select a room first');
    try {
      await axios.put(`http://localhost:5000/api/requests/${requestId}/approve`, { roomId }, config);
      toast.success('Request Approved & Room Allocated!');
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/requests/${id}/reject`, {}, config);
      toast.success('Request Rejected');
      fetchData();
    } catch (err) { toast.error('Error rejecting request'); }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Room Requests & Allocation</h1>
      
      <div className="grid gap-4">
        {requests.filter(r => r.status === 'Pending').length === 0 && <div className="bg-white p-8 text-center text-gray-500 rounded-2xl shadow-sm border border-gray-100">No pending requests.</div>}
        
        {requests.filter(r => r.status === 'Pending').map(req => (
          <div key={req._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="font-bold text-gray-800 text-lg">{req.studentId?.name} ({req.studentId?.studentId})</h3>
              <p className="text-gray-500 text-sm">Applied for: <span className="font-medium text-blue-600">{req.hostelId?.name}</span></p>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <select id={`room-${req._id}`} className="border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-48">
                <option value="">Select Room...</option>
                {availableRooms.filter(r => r.hostelId?._id === req.hostelId?._id).map(room => (
                  <option key={room._id} value={room._id}>Room {room.roomNumber} ({room.type})</option>
                ))}
              </select>
              <button 
                onClick={() => handleApprove(req._id, document.getElementById(`room-${req._id}`).value)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 transition">
                <CheckCircle className="w-5 h-5" /> Approve
              </button>
              <button onClick={() => handleReject(req._id)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 transition">
                <XCircle className="w-5 h-5" /> Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}