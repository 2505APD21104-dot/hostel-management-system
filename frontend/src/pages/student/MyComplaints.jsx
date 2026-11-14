import { useState, useEffect } from 'react';
import axios from 'axios';
import { Wrench } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/complaints', config);
        setComplaints(res.data);
      } catch (err) { toast.error('Failed to load complaints'); }
      finally { setLoading(false); }
    };
    fetchComplaints();
  }, []);

  if (loading) return <div className="p-8 text-gray-500">Loading complaints...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">My Complaints</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {complaints.length === 0 && <div className="col-span-full bg-white p-8 text-center text-gray-500 rounded-2xl shadow-sm border border-gray-100">No complaints submitted yet.</div>}
        
        {complaints.map(c => (
          <div key={c._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${c.status === 'Resolved' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                <Wrench className="w-6 h-6" />
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${c.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {c.status}
              </span>
            </div>
            <h3 className="font-bold text-gray-800 text-lg mb-1">{c.category} Issue</h3>
            <p className="text-gray-500 text-sm">{c.description}</p>
            <p className="text-xs text-gray-400 mt-4">Reported on: {new Date(c.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}