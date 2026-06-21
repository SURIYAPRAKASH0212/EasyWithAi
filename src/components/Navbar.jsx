import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { Sun, Moon, Menu } from 'lucide-react';

const Navbar = ({ onToggleSidebar }) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Helper to extract initials
  const getInitials = (name) => {
    if (!name) return 'JD';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const name = user?.fullName || 'John Doe';
  const email = user?.email || 'john@example.com';
  const initials = getInitials(name);

  return (
    <header className="h-[72px] min-h-[72px] bg-white border-b border-gray-100 flex items-center justify-between lg:justify-end px-4 sm:px-8 gap-6 z-10 dark:bg-[#16171D] dark:border-gray-800 transition-colors duration-300">
      {/* Mobile Toggle Button */}
      <button
        onClick={onToggleSidebar}
        className="p-2 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white transition-all duration-200 lg:hidden cursor-pointer"
        aria-label="Toggle sidebar"
      >
        <Menu size={20} />
      </button>

      {/* Right End: Theme Toggle & User Info */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white transition-all duration-200 cursor-pointer"
          aria-label="Toggle dark mode"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        {/* User Block */}
        <div className="flex items-center gap-3">
          {/* Avatar Circle */}
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm select-none border border-primary/20 dark:bg-primary/20 dark:text-[#A793FF] dark:border-[#A793FF]/20">
            {initials}
          </div>

          {/* User Info */}
          <div className="flex flex-col text-left">
            <span className="font-semibold text-[14px] leading-tight text-gray-900 dark:text-white">
              {name}
            </span>
            <span className="text-[12px] text-gray-400 dark:text-gray-500 leading-tight">
              {email}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
