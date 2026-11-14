import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Building2, BedDouble, ClipboardList, 
  Wrench, LogOut, Menu, Bell, Search, User 
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.clear();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const adminLinks = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Manage Hostels', path: '/admin/hostels', icon: Building2 },
    { name: 'Manage Rooms', path: '/admin/rooms', icon: BedDouble },
    { name: 'Room Requests', path: '/admin/requests', icon: ClipboardList },
    { name: 'Complaints', path: '/admin/complaints', icon: Wrench },
    { name: 'Students', path: '/admin/students', icon: Users },
  ];

  const studentLinks = [
    { name: 'Dashboard', path: '/student', icon: LayoutDashboard },
    { name: 'Apply for Hostel', path: '/student/apply', icon: Building2 },
    { name: 'My Requests', path: '/student/requests', icon: ClipboardList },
    { name: 'My Complaints', path: '/student/complaints', icon: Wrench },
    { name: 'My Profile', path: '/student/profile', icon: User },
  ];

  const links = user?.role === 'admin' ? adminLinks : studentLinks;

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* SIDEBAR */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-[#0f172a] text-slate-300 transition-all duration-300 flex flex-col shadow-xl z-20`}>
        <div className="h-16 flex items-center justify-center border-b border-slate-700/50">
          <Building2 className="text-blue-500 w-8 h-8" />
          {isSidebarOpen && <span className="ml-3 font-bold text-white text-lg tracking-wider">HostelHub</span>}
        </div>
        
        <nav className="flex-1 py-6 space-y-2 px-3 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link 
                key={link.name} 
                to={link.path}
                className={`flex items-center px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'}`}
              >
                <Icon className={`w-5 h-5 ${isSidebarOpen ? 'mr-3' : 'mx-auto'}`} />
                {isSidebarOpen && <span className="font-medium">{link.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-700/50">
          <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 text-red-400 hover:bg-slate-800 rounded-xl transition-all">
            <LogOut className={`w-5 h-5 ${isSidebarOpen ? 'mr-3' : 'mx-auto'}`} />
            {isSidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TOP NAVBAR */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-10">
          <div className="flex items-center">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-500 hover:text-gray-700 mr-4">
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative hidden md:block">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 bg-gray-100 rounded-full border-transparent focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 transition-all w-64 text-sm outline-none" />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center space-x-3 border-l pl-4 border-gray-200">
              <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-gray-700">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}