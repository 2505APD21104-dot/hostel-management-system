import { useState, useEffect } from 'react';
import axios from 'axios';
import { Building2, ClipboardList, Wrench, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function StudentDashboard() {
  const [hostels, setHostels] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [myComplaints, setMyComplaints] = useState([]);
  const [complaintData, setComplaintData] = useState({ category: 'Plumbing', description: '' });

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchData = async () => {
    try {
      const [hostelsRes, requestsRes, complaintsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/hostels', config),
        axios.get('http://localhost:5000/api/requests', config),
        axios.get('http://localhost:5000/api/complaints', config)
      ]);
      setHostels(hostelsRes.data);
      setMyRequests(requestsRes.data);
      setMyComplaints(complaintsRes.data);
    } catch (err) { toast.error('Failed to load data'); }
  };

  useEffect(() => { fetchData(); }, []);

  const applyForRoom = async (hostelId) => {
    try {
      await axios.post('http://localhost:5000/api/requests', { hostelId }, config);
      toast.success('Application submitted!');
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  const submitComplaint = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/complaints', complaintData, config);
      toast.success('Complaint submitted!');
      setComplaintData({ category: 'Plumbing', description: '' });
      fetchData();
    } catch (err) { toast.error('Error submitting complaint'); }
  };

  const activeRequest = myRequests.find(r => r.status === 'Approved' || r.status === 'Pending');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Welcome back, {user.name}!</h1>
        <p className="text-gray-500 text-sm mt-1">Here is an overview of your accommodation status.</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Building2 className="w-6 h-6" /></div>
            <h3 className="font-bold text-gray-800 text-lg">My Accommodation</h3>
          </div>
          {activeRequest ? (
            <div>
              <p className="text-gray-600 mb-2">Hostel: <span className="font-semibold text-gray-900">{activeRequest.hostelId?.name}</span></p>
              <p className="text-gray-600">Status: <span className={`font-semibold ${activeRequest.status === 'Approved' ? 'text-green-600' : 'text-amber-600'}`}>{activeRequest.status}</span></p>
              {activeRequest.roomId && <p className="text-gray-600">Room: <span className="font-semibold text-gray-900">{activeRequest.roomId?.roomNumber}</span></p>}
            </div>
          ) : (
            <p className="text-gray-500">You do not have an active room request.</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-xl"><ClipboardList className="w-6 h-6" /></div>
            <h3 className="font-bold text-gray-800 text-lg">Available Hostels</h3>
          </div>
          <div className="space-y-3">
            {hostels.slice(0, 3).map(h => (
              <div key={h._id} className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-700">{h.name}</span>
                {!activeRequest && (
                  <button onClick={() => applyForRoom(h._id)} className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-100">Apply</button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Complaints Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2"><Wrench className="w-5 h-5 text-gray-500" /> Raise a Complaint</h3>
          <form onSubmit={submitComplaint} className="space-y-4">
            <select className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" onChange={e => setComplaintData({...complaintData, category: e.target.value})}>
              <option value="Plumbing">Plumbing</option>
              <option value="Electricity">Electricity</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Internet">Internet</option>
              <option value="Furniture">Furniture</option>
              <option value="Other">Other</option>
            </select>
            <textarea placeholder="Describe the issue..." required className="w-full border p-2.5 rounded-lg outline-none h-24" onChange={e => setComplaintData({...complaintData, description: e.target.value})} value={complaintData.description}></textarea>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg flex justify-center items-center gap-2 hover:bg-blue-700"><Send className="w-4 h-4" /> Submit</button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 text-lg mb-4">My Complaint History</h3>
          <div className="space-y-3">
            {myComplaints.length === 0 && <p className="text-gray-500 text-sm">No complaints submitted yet.</p>}
            {myComplaints.map(c => (
              <div key={c._id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium text-gray-800 text-sm">{c.category}</p>
                  <p className="text-xs text-gray-500 truncate max-w-[200px]">{c.description}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${c.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{c.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}