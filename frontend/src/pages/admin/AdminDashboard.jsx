import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Building2, BedDouble, Wrench, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import toast from 'react-hot-toast';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AdminDashboard() {
  const [stats, setStats] = useState({ students: 0, hostels: 0, rooms: 0, complaints: 0 });
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [hostelsRes, complaintsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/hostels', config),
          axios.get('http://localhost:5000/api/complaints', config)
        ]);
        // Placeholder data until Phase 2 creates a real stats API
        setStats({
          students: 150, 
          hostels: hostelsRes.data.length,
          rooms: 100, 
          complaints: complaintsRes.data.filter(c => c.status === 'Pending').length
        });
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Students', value: stats.students, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100', trend: '+12%', isUp: true },
    { title: 'Total Hostels', value: stats.hostels, icon: Building2, color: 'text-indigo-600', bg: 'bg-indigo-100', trend: '+2', isUp: true },
    { title: 'Total Rooms', value: stats.rooms, icon: BedDouble, color: 'text-emerald-600', bg: 'bg-emerald-100', trend: '100', isUp: true },
    { title: 'Pending Complaints', value: stats.complaints, icon: Wrench, color: 'text-amber-600', bg: 'bg-amber-100', trend: '-5%', isUp: false },
  ];

  const chartData = {
    labels: ['Hostel A', 'Hostel B', 'Hostel C'],
    datasets: [
      { label: 'Occupied', data: [65, 59, 80], backgroundColor: '#3b82f6', borderRadius: 6 },
      { label: 'Available', data: [35, 41, 20], backgroundColor: '#e2e8f0', borderRadius: 6 },
    ],
  };

  if (loading) return <div className="text-center mt-20 text-gray-500">Loading Dashboard...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back, here is what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{card.title}</p>
                <h3 className="text-3xl font-bold text-gray-800">{card.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${card.bg} ${card.color}`}>
                <card.icon className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className={`flex items-center font-medium ${card.isUp ? 'text-emerald-600' : 'text-red-600'}`}>
                {card.isUp ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                {card.trend}
              </span>
              <span className="text-gray-400 ml-2">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
          <h3 className="font-bold text-gray-800 text-lg mb-6">Room Occupancy Overview</h3>
          <div className="h-72"><Bar data={chartData} /></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 text-lg mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-start space-x-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
                <div>
                  <p className="text-sm text-gray-700 font-medium">New room request received</p>
                  <p className="text-xs text-gray-400">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}