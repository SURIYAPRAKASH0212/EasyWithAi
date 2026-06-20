import React, { useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import * as authApi from '../api/authApi';
import LoadingSpinner from '../components/LoadingSpinner';
import { Sun, Bell, Globe, Lock, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const [lang, setLang] = useState('English');
  const [notifications, setNotifications] = useState(true);

  // Change Password Form State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passLoading, setPassLoading] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error('All password fields are required');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setPassLoading(true);
    try {
      await authApi.changePassword({ oldPassword, newPassword });
      toast.success('Password updated successfully');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || 'Failed to update password';
      toast.error(errMsg);
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left max-w-3xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1">
          Settings
        </h1>
        <p className="text-[14px] text-gray-500 dark:text-gray-400">
          Customize dashboard behavior and manage account security
        </p>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Side: General Preferences */}
        <div className="flex flex-col gap-6">
          {/* Theme Card */}
          <div className="bg-white dark:bg-[#16171D] border border-gray-100 dark:border-gray-800/80 rounded-card p-6 shadow-subtle flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-50 dark:border-gray-800/20">
              <Sun size={18} className="text-primary dark:text-[#A793FF]" />
              <h3 className="font-bold text-[15px] text-gray-900 dark:text-white">Theme Mode</h3>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex flex-col text-left">
                <span className="text-[14px] font-bold text-gray-800 dark:text-gray-300">Dark Mode</span>
                <span className="text-[12px] text-gray-400 dark:text-gray-500 mt-0.5">Toggle between light and dark display</span>
              </div>
              
              {/* Modern Switch */}
              <button
                onClick={toggleTheme}
                className={`w-12 h-6.5 rounded-full p-1 transition-colors duration-200 focus:outline-none cursor-pointer flex items-center
                  ${theme === 'dark' ? 'bg-[#6C4CF1]' : 'bg-gray-200'}
                `}
              >
                <div
                  className={`bg-white w-4.5 h-4.5 rounded-full shadow-md transform transition-transform duration-200
                    ${theme === 'dark' ? 'translate-x-5.5' : 'translate-x-0'}
                  `}
                />
              </button>
            </div>
          </div>

          {/* Language Preference Card */}
          <div className="bg-white dark:bg-[#16171D] border border-gray-100 dark:border-gray-800/80 rounded-card p-6 shadow-subtle flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-50 dark:border-gray-800/20">
              <Globe size={18} className="text-primary dark:text-[#A793FF]" />
              <h3 className="font-bold text-[15px] text-gray-900 dark:text-white">Language</h3>
            </div>

            <div className="flex flex-col text-left gap-3">
              <div className="flex flex-col">
                <span className="text-[14px] font-bold text-gray-800 dark:text-gray-300">Preferred Language</span>
                <span className="text-[12px] text-gray-400 dark:text-gray-500 mt-0.5 font-medium">Select your dashboard translation language</span>
              </div>
              
              <select
                value={lang}
                onChange={(e) => {
                  setLang(e.target.value);
                  toast.success(`Language set to ${e.target.value}`);
                }}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 rounded-xl text-[14px] text-gray-900 dark:text-white focus:outline-none cursor-pointer"
              >
                {['English', 'Tamil', 'Spanish', 'German', 'French', 'Hindi'].map(l => (
                  <option key={l} value={l} className="dark:bg-[#16171D]">{l}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Notifications Card */}
          <div className="bg-white dark:bg-[#16171D] border border-gray-100 dark:border-gray-800/80 rounded-card p-6 shadow-subtle flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-50 dark:border-gray-800/20">
              <Bell size={18} className="text-primary dark:text-[#A793FF]" />
              <h3 className="font-bold text-[15px] text-gray-900 dark:text-white">Notifications</h3>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-col text-left">
                <span className="text-[14px] font-bold text-gray-800 dark:text-gray-300">Email Notifications</span>
                <span className="text-[12px] text-gray-400 dark:text-gray-500 mt-0.5">Receive logs and statistics reports</span>
              </div>

              {/* Switch */}
              <button
                onClick={() => {
                  setNotifications(!notifications);
                  toast.success(`Notifications ${!notifications ? 'enabled' : 'disabled'}`);
                }}
                className={`w-12 h-6.5 rounded-full p-1 transition-colors duration-200 focus:outline-none cursor-pointer flex items-center
                  ${notifications ? 'bg-[#6C4CF1]' : 'bg-gray-250'}
                `}
              >
                <div
                  className={`bg-white w-4.5 h-4.5 rounded-full shadow-md transform transition-transform duration-200
                    ${notifications ? 'translate-x-5.5' : 'translate-x-0'}
                  `}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Account Security (Change Password) */}
        <div className="bg-white dark:bg-[#16171D] border border-gray-100 dark:border-gray-800/80 rounded-card p-6 shadow-subtle flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-50 dark:border-gray-800/20">
            <Lock size={18} className="text-primary dark:text-[#A793FF]" />
            <h3 className="font-bold text-[15px] text-gray-900 dark:text-white">Account Security</h3>
          </div>

          <form onSubmit={handlePasswordChange} className="flex flex-col gap-4.5">
            <h4 className="text-[13px] font-bold text-gray-450 dark:text-gray-500 tracking-wider uppercase mt-1">Change Password</h4>
            
            {/* Current Password */}
            <div className="flex flex-col text-left gap-2">
              <label className="text-[11px] font-bold text-gray-450 dark:text-gray-550 uppercase">Current Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <KeyRound size={15} />
                </span>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 rounded-xl text-[14px] text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* New Password */}
            <div className="flex flex-col text-left gap-2">
              <label className="text-[11px] font-bold text-gray-450 dark:text-gray-550 uppercase">New Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <KeyRound size={15} />
                </span>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 rounded-xl text-[14px] text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="flex flex-col text-left gap-2">
              <label className="text-[11px] font-bold text-gray-450 dark:text-gray-550 uppercase">Confirm New Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <KeyRound size={15} />
                </span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 rounded-xl text-[14px] text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={passLoading}
              className="w-full py-2.5 bg-[#6C4CF1] hover:bg-[#5534DB] text-white font-bold rounded-xl text-[13px] shadow-md shadow-primary/20 transition-all duration-200 flex items-center justify-center gap-1.5 mt-2 cursor-pointer"
            >
              {passLoading ? (
                <>
                  <LoadingSpinner size="sm" color="white" />
                  <span>Updating...</span>
                </>
              ) : (
                <span>Update Password</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
