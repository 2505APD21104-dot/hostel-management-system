import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Trash2, User, Mail, Hash, Phone, Building } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchStudents = async () => {
    try {
      // We will add this route to the backend in the next step
      const res = await axios.get('http://localhost:5000/api/users/students', config);
      setStudents(res.data);
    } catch (err) {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this student?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`, config);
      toast.success('Student removed successfully');
      fetchStudents();
    } catch (err) {
      toast.error('Failed to delete student');
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.studentId && s.studentId.toString().includes(searchTerm))
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage Students</h1>
          <p className="text-gray-500 text-sm mt-1">View and manage all registered students.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Search Bar */}
        <div className="p-4 border-b border-gray-100 flex items-center bg-gray-50/50">
          <Search className="w-5 h-5 text-gray-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search by name, email, or student ID..." 
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
                <th className="p-4 font-medium">Student Name</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Student ID</th>
                <th className="p-4 font-medium">Contact</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="p-8 text-center text-gray-500">Loading students...</td></tr>
              ) : filteredStudents.length === 0 ? (
                <tr><td colSpan="5" className="p-8 text-center text-gray-500">No students found.</td></tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-gray-800">{student.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">{student.email}</td>
                    <td className="p-4 text-gray-600">{student.studentId || 'N/A'}</td>
                    <td className="p-4 text-gray-600">{student.contact || 'N/A'}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleDelete(student._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
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
    </div>
  );
}
