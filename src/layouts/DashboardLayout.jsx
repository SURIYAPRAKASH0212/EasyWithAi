import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 dark:bg-[#0F1015] dark:text-gray-100 transition-colors duration-300 relative overflow-hidden">
      {/* Background Characters Watermark Overlay */}
      <div className="fixed inset-0 bg-characters opacity-35 dark:opacity-20 mix-blend-multiply dark:invert dark:mix-blend-screen pointer-events-none z-0" />
      
      {/* Left Sidebar */}
      <Sidebar />

      {/* Right Content Area */}
      <div className="flex-1 flex flex-col min-w-0 z-10 ml-[240px]">
        {/* Top Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
