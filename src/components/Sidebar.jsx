import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  Home as HomeIcon, 
  Globe, 
  Mail, 
  Users, 
  History, 
  User, 
  Settings, 
  LogOut, 
  Bot,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

const Sidebar = ({ isOpen, onClose }) => {
  const { logoutUser } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Home', path: '/home', icon: HomeIcon },
    { name: 'Translator', path: '/translator', icon: Globe },
    { name: 'Email Generator', path: '/email-generator', icon: Mail },
    { name: 'Entity Recognition', path: '/entity-recognition', icon: Users },
    { name: 'History', path: '/history', icon: History },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logoutUser();
    toast.success('Logged out successfully');
    navigate('/login');
    if (onClose) onClose();
  };

  return (
    <aside className={`fixed left-0 top-0 w-[240px] min-w-[240px] h-screen bg-white border-r border-gray-100 flex flex-col justify-between py-6 px-4 z-30 dark:bg-[#16171D] dark:border-gray-800 transition-all duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex flex-col gap-8">
        {/* Brand Logo */}
        <div className="flex items-center justify-between px-3">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-xl text-primary">
              <Bot size={24} />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-gray-900 dark:text-white">
              EasyWithAI
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white lg:hidden transition-all duration-200 cursor-pointer"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-col gap-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => `
                  flex items-center gap-3.5 px-4 py-3 rounded-xl text-[14px] font-medium transition-all duration-200 group
                  ${isActive 
                    ? 'bg-primary-light text-primary dark:bg-primary/20 dark:text-[#A793FF]' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-white'
                  }
                `}
              >
                <Icon size={18} className="transition-transform group-hover:scale-105" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-[14px] font-medium text-red-500 hover:bg-red-50/50 hover:text-red-600 dark:text-red-400 dark:hover:bg-red-950/20 dark:hover:text-red-300 transition-all duration-200 w-full text-left cursor-pointer"
      >
        <LogOut size={18} />
        <span>Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;
