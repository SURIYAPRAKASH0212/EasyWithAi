import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import * as authApi from '../api/authApi';
import LoadingSpinner from '../components/LoadingSpinner';
import { User, Mail, Phone, MapPin, Edit3, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  // Sync state with user context on mount or user change
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setLocation(user.location || '');
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!fullName || !email) {
      toast.error('Full Name and Email are required');
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.updateProfile({ fullName, email, phone, location });
      updateUserProfile(response.data.user);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || 'Failed to update profile';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'JD';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="flex flex-col gap-6 text-left max-w-2xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1">
          Profile
        </h1>
        <p className="text-[14px] text-gray-500 dark:text-gray-400">
          Manage your personal profile details
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-[#16171D] border border-gray-100 dark:border-gray-800/80 rounded-card p-8 shadow-subtle flex flex-col items-center gap-6 relative">
        {/* Edit Button */}
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="absolute top-6 right-6 flex items-center gap-1.5 px-3.5 py-2 bg-primary/10 hover:bg-primary/20 text-primary dark:text-[#A793FF] rounded-xl text-[13px] font-bold transition-all duration-200 cursor-pointer"
          >
            <Edit3 size={15} />
            <span>Edit Profile</span>
          </button>
        )}

        {/* Circular Avatar */}
        <div className="w-24 h-24 rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-[#A793FF] flex items-center justify-center font-extrabold text-2xl border-2 border-primary/20 select-none">
          {getInitials(user?.fullName)}
        </div>

        {/* User Brief */}
        <div className="text-center -mt-2">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {user?.fullName}
          </h2>
          <span className="text-[13px] text-gray-400 dark:text-gray-500 mt-1 block">
            {user?.email}
          </span>
        </div>

        {/* Form Details */}
        <form onSubmit={handleSave} className="w-full flex flex-col gap-5 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Full Name */}
            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-bold text-gray-400 dark:text-gray-500 tracking-wide uppercase">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 dark:text-gray-500">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={!isEditing || loading}
                  className="w-full pl-11 pr-4 py-2.5 bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 rounded-xl text-[14px] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-75 transition-all duration-200"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-bold text-gray-400 dark:text-gray-500 tracking-wide uppercase">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 dark:text-gray-500">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!isEditing || loading}
                  className="w-full pl-11 pr-4 py-2.5 bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 rounded-xl text-[14px] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-75 transition-all duration-200"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-bold text-gray-400 dark:text-gray-500 tracking-wide uppercase">Phone Number</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 dark:text-gray-500">
                  <Phone size={16} />
                </span>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={!isEditing || loading}
                  placeholder={isEditing ? 'Enter phone number' : 'Not provided'}
                  className="w-full pl-11 pr-4 py-2.5 bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 rounded-xl text-[14px] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-75 transition-all duration-200"
                />
              </div>
            </div>

            {/* Location */}
            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-bold text-gray-400 dark:text-gray-500 tracking-wide uppercase">Location</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 dark:text-gray-500">
                  <MapPin size={16} />
                </span>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  disabled={!isEditing || loading}
                  placeholder={isEditing ? 'Enter location' : 'Not provided'}
                  className="w-full pl-11 pr-4 py-2.5 bg-gray-50/50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 rounded-xl text-[14px] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-75 transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Edit State Action Buttons */}
          {isEditing && (
            <div className="flex items-center gap-3 justify-end mt-4">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setFullName(user.fullName || '');
                  setEmail(user.email || '');
                  setPhone(user.phone || '');
                  setLocation(user.location || '');
                }}
                disabled={loading}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl text-[13px] transition-all duration-200 cursor-pointer"
              >
                <X size={15} />
                <span>Cancel</span>
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl text-[13px] transition-all duration-200 shadow-md shadow-primary/20 cursor-pointer"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" color="white" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={15} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;
