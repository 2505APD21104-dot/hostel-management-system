import { useState, useEffect } from 'react';
import { User, Mail, Hash, Phone, MapPin, Camera, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MyProfile() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [profilePic, setProfilePic] = useState('');
  const [address, setAddress] = useState('');

  // Load saved photo and address from local storage when page loads
  useEffect(() => {
    const savedPic = localStorage.getItem('profilePic');
    const savedAddress = localStorage.getItem('userAddress');
    if (savedPic) setProfilePic(savedPic);
    if (savedAddress) setAddress(savedAddress);
  }, []);

  // Handle Photo Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
        localStorage.setItem('profilePic', reader.result); // Save to browser storage
        toast.success('Profile photo updated!');
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Address Update
  const handleAddressSave = () => {
    localStorage.setItem('userAddress', address);
    toast.success('Address updated successfully!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your personal information and profile picture.</p>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden max-w-4xl">
        
        {/* Header Banner */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

        <div className="px-8 pb-8">
          {/* Profile Picture & Name Section */}
          <div className="relative flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-12 mb-8">
            <div className="relative group">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center overflow-hidden shadow-md">
                {profilePic ? (
                  <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-gray-400" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 shadow-lg transition-colors">
                <Camera className="w-4 h-4" />
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
            
            <div className="text-center sm:text-left mb-2">
              <h2 className="text-2xl font-bold text-gray-800">{user?.name}</h2>
              <p className="text-gray-500 capitalize bg-gray-100 px-3 py-1 rounded-full text-xs font-medium inline-block mt-2">
                {user?.role} Account
              </p>
            </div>
          </div>

          {/* Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Email */}
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Mail className="w-5 h-5" /></div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Email Address</p>
                <p className="font-semibold text-gray-800 mt-1">{user?.email || 'N/A'}</p>
              </div>
            </div>
            
            {/* Student ID */}
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><Hash className="w-5 h-5" /></div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Student ID</p>
                <p className="font-semibold text-gray-800 mt-1">{user?.studentId || 'N/A'}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="p-2 bg-green-100 text-green-600 rounded-lg"><Phone className="w-5 h-5" /></div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Phone Number</p>
                <p className="font-semibold text-gray-800 mt-1">{user?.contact || 'N/A'}</p>
              </div>
            </div>

            {/* Address (Editable) */}
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 md:col-span-2">
              <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><MapPin className="w-5 h-5" /></div>
              <div className="w-full">
                <p className="text-xs text-gray-500 font-medium mb-2">Home Address</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="text" 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your full address..."
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                  <button 
                    onClick={handleAddressSave}
                    className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Save Address
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}