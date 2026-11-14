import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Auth & Landing Pages
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import Landing from './pages/Landing';
import Layout from './components/Layout';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageHostels from './pages/admin/ManageHostels';
import ManageRooms from './pages/admin/ManageRooms';
import RoomRequests from './pages/admin/RoomRequests';
import Complaints from './pages/admin/Complaints';
import ManageStudents from './pages/admin/ManageStudents';

// Student Pages
import StudentDashboard from './pages/StudentDashboard';
import ApplyHostel from './pages/student/ApplyHostel';
import MyRequests from './pages/student/MyRequests';
import MyComplaints from './pages/student/MyComplaints';
import MyProfile from './pages/student/MyProfile';

function App() {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        
        {/* Admin Protected Routes */}
        <Route path="/admin/*" element={
          user && user.role === 'admin' ? (
            <Layout>
              <Routes>
                <Route path="/" element={<AdminDashboard />} />
                <Route path="hostels" element={<ManageHostels />} />
                <Route path="rooms" element={<ManageRooms />} />
                <Route path="requests" element={<RoomRequests />} />
                <Route path="complaints" element={<Complaints />} />
                <Route path="students" element={<ManageStudents />} />
              </Routes>
            </Layout>
          ) : <Navigate to="/login" />
        } />

        {/* Student Protected Routes */}
        <Route path="/student/*" element={
          user && user.role === 'student' ? (
            <Layout>
              <Routes>
                <Route path="/" element={<StudentDashboard />} />
                <Route path="apply" element={<ApplyHostel />} />
                <Route path="requests" element={<MyRequests />} />
                <Route path="complaints" element={<MyComplaints />} />
                <Route path="profile" element={<MyProfile />} />
              </Routes>
            </Layout>
          ) : <Navigate to="/login" />
        } />
      </Routes>
    </Router>
  );
}

export default App;