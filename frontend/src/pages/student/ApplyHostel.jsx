import { useState, useEffect } from 'react';
import axios from 'axios';
import { Building2, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ApplyHostel() {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/hostels', config);
        setHostels(res.data);
      } catch (err) { 
        toast.error('Failed to load hostels'); 
      } finally {
        setLoading(false);
      }
    };
    fetchHostels();
  }, []);

  const applyForRoom = async (hostelId) => {
    try {
      await axios.post('http://localhost:5000/api/requests', { hostelId }, config);
      toast.success('Application submitted successfully!');
    } catch (err) { 
      toast.error(err.response?.data?.message || 'Error applying'); 
    }
  };

  if (loading) return <div className="p-8 text-gray-500">Loading hostels...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Apply for Hostel</h1>
        <p className="text-gray-500 text-sm mt-1">Select a hostel to submit a room allocation request.</p>
      </div>
      
      {hostels.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center text-gray-500">
          No hostels available right now. Please check back later.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hostels.map(hostel => (
            <div key={hostel._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition">
              <div>
                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl w-max mb-4">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">{hostel.name}</h3>
                <p className="text-gray-500 text-sm mt-1">{hostel.type} Hostel</p>
                <p className="text-gray-400 text-xs mt-2">Total Rooms: {hostel.totalRooms}</p>
              </div>
              <button onClick={() => applyForRoom(hostel._id)} className="mt-6 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl transition">
                <CheckCircle className="w-5 h-5" /> Apply Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}