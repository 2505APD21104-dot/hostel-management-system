import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, Trash2, Edit, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManageHostels() {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    type: 'Boys',
    totalRooms: '',
    address: ''
  });

  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  // Fetch Hostels
  const fetchHostels = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/hostels', config);
      setHostels(res.data);
    } catch (error) {
      toast.error('Failed to load hostels');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHostels();
  }, []);

  // Add Hostel
  const handleAddHostel = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/hostels', formData, config);
      toast.success('Hostel added successfully');
      setIsModalOpen(false);
      setFormData({ name: '', type: 'Boys', totalRooms: '', address: '' });
      fetchHostels(); // Refresh list
    } catch (error) {
      toast.error('Failed to add hostel');
    }
  };

  // Delete Hostel
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this hostel?')) {
      try {
        await axios.delete(`http://localhost:5000/api/hostels/${id}`, config);
        toast.success('Hostel deleted');
        fetchHostels();
      } catch (error) {
        toast.error('Failed to delete hostel');
      }
    }
  };

  // Filter for search
  const filteredHostels = hostels.filter(h => 
    h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage Hostels</h1>
          <p className="text-gray-500 text-sm mt-1">Add, edit, and manage all hostel properties.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" /> Add New Hostel
        </button>
      </div>

      {/* Data Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Search Bar */}
        <div className="p-4 border-b border-gray-100 flex items-center bg-gray-50/50">
          <Search className="w-5 h-5 text-gray-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search hostels by name or type..." 
            className="bg-transparent border-none outline-none w-full text-sm text-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                <th className="p-4 font-medium">Hostel Name</th>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium">Total Rooms</th>
                <th className="p-4 font-medium">Address</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="p-8 text-center text-gray-500">Loading hostels...</td></tr>
              ) : filteredHostels.length === 0 ? (
                <tr><td colSpan="5" className="p-8 text-center text-gray-500">No hostels found. Add one to get started.</td></tr>
              ) : (
                filteredHostels.map((hostel) => (
                  <tr key={hostel._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <span className="font-semibold text-gray-800">{hostel.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${hostel.type === 'Boys' ? 'bg-indigo-100 text-indigo-700' : 'bg-pink-100 text-pink-700'}`}>
                        {hostel.type}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">{hostel.totalRooms}</td>
                    <td className="p-4 text-gray-600">{hostel.address || 'N/A'}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleDelete(hostel._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Hostel Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Add New Hostel</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            
            <form onSubmit={handleAddHostel} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hostel Name</label>
                <input type="text" required className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200" 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Boys Hostel A" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hostel Type</label>
                <select className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                  <option value="Boys">Boys</option>
                  <option value="Girls">Girls</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Rooms</label>
                <input type="number" required className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200" 
                  value={formData.totalRooms} onChange={e => setFormData({...formData, totalRooms: e.target.value})} placeholder="e.g. 50" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input type="text" className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200" 
                  value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Campus Location" />
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Hostel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}