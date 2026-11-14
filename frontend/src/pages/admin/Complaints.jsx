import { useState, useEffect } from 'react';
import axios from 'axios';
import { Wrench, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchComplaints = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/complaints', config);
      setComplaints(res.data);
    } catch (err) { toast.error('Failed to load complaints'); }
  };

  useEffect(() => { fetchComplaints(); }, []);

  const handleResolve = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/complaints/${id}`, {}, config);
      toast.success('Complaint marked as resolved!');
      fetchComplaints();
    } catch (err) { toast.error('Error resolving complaint'); }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Complaint Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {complaints.map(c => (
          <div key={c._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${c.status === 'Resolved' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                  <Wrench className="w-6 h-6" />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${c.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {c.status}
                </span>
              </div>
              <h3 className="font-bold text-gray-800 text-lg mb-1">{c.category} Issue</h3>
              <p className="text-gray-500 text-sm mb-4">{c.description}</p>
              <p className="text-xs text-gray-400">Reported by: {c.studentId?.name || 'Unknown Student'}</p>
            </div>
            
            {c.status === 'Pending' && (
              <button onClick={() => handleResolve(c._id)} className="mt-6 w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition">
                <CheckCircle className="w-5 h-5" /> Mark Resolved
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}