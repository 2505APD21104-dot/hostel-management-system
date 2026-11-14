import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, BedDouble, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManageRooms() {
  const [rooms, setRooms] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [filterHostel, setFilterHostel] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ hostelId: '', roomNumber: '', type: 'Single', capacity: 1 });

  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchData = async () => {
    try {
      const [roomsRes, hostelsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/rooms/all', config), // We will add this route to backend
        axios.get('http://localhost:5000/api/hostels', config)
      ]);
      setRooms(roomsRes.data);
      setHostels(hostelsRes.data);
    } catch (err) { toast.error('Failed to load data'); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/rooms', formData, config);
      toast.success('Room added successfully');
      setIsModalOpen(false);
      fetchData();
    } catch (err) { toast.error('Error adding room'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this room?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/rooms/${id}`, config);
      toast.success('Room deleted');
      fetchData();
    } catch (err) { toast.error('Error deleting room'); }
  };

  const filteredRooms = filterHostel === 'All' ? rooms : rooms.filter(r => r.hostelId?._id === filterHostel);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage Rooms</h1>
          <p className="text-gray-500 text-sm">Add, filter, and manage hostel rooms.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition">
          <Plus className="w-5 h-5" /> Add Room
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-4 bg-gray-50/50">
          <Filter className="w-5 h-5 text-gray-400" />
          <select className="bg-white border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => setFilterHostel(e.target.value)}>
            <option value="All">All Hostels</option>
            {hostels.map(h => <option key={h._id} value={h._id}>{h.name}</option>)}
          </select>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
              <th className="p-4 font-medium">Room Number</th>
              <th className="p-4 font-medium">Hostel</th>
              <th className="p-4 font-medium">Type</th>
              <th className="p-4 font-medium">Capacity</th>
              <th className="p-4 font-medium">Occupied</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRooms.map(room => (
              <tr key={room._id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="p-4 font-semibold text-gray-800">{room.roomNumber}</td>
                <td className="p-4 text-gray-600">{room.hostelId?.name || 'Unknown'}</td>
                <td className="p-4"><span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">{room.type}</span></td>
                <td className="p-4 text-gray-600">{room.capacity}</td>
                <td className="p-4 text-gray-600">{room.occupiedCount}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${room.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {room.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => handleDelete(room._id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Add New Room</h2>
            <form onSubmit={handleAddRoom} className="space-y-4">
              <select required className="w-full border p-2.5 rounded-lg outline-none" onChange={e => setFormData({...formData, hostelId: e.target.value})}>
                <option value="">Select Hostel</option>
                {hostels.map(h => <option key={h._id} value={h._id}>{h.name}</option>)}
              </select>
              <input type="text" placeholder="Room Number (e.g. 101)" required className="w-full border p-2.5 rounded-lg outline-none" onChange={e => setFormData({...formData, roomNumber: e.target.value})} />
              <select className="w-full border p-2.5 rounded-lg outline-none" onChange={e => setFormData({...formData, type: e.target.value, capacity: e.target.value === 'Single' ? 1 : e.target.value === 'Double' ? 2 : 3})}>
                <option value="Single">Single (Cap 1)</option>
                <option value="Double">Double (Cap 2)</option>
                <option value="Triple">Triple (Cap 3)</option>
              </select>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 border py-2 rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}