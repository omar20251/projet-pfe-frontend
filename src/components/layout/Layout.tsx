import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex">
        {isAuthenticated && (
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        )}
        
        <main className={`flex-1 p-4 lg:p-8 ${isAuthenticated ? 'lg:ml-64' : ''} transition-all duration-200`}>
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;