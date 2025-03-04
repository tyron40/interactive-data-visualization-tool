import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  BarChart2, 
  Database, 
  LayoutDashboard, 
  Menu, 
  X, 
  LogOut, 
  User, 
  Settings, 
  ChevronDown 
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    const guestMode = localStorage.getItem('guestMode') === 'true';
    setIsGuest(guestMode);
  }, []); // Empty dependency array to run only once

  const handleLogout = async () => {
    if (isGuest) {
      localStorage.removeItem('guestMode');
    } else {
      await logout();
    }
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const displayName = isGuest ? 'Guest User' : (user?.name || 'User');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <div className="flex items-center">
            <BarChart2 className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">DataViz</span>
          </div>
          <button 
            className="p-1 rounded-md text-gray-500 hover:text-gray-900 focus:outline-none lg:hidden"
            onClick={closeSidebar}
          >
            <X size={24} />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                isActive 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
            end
          >
            <LayoutDashboard className="mr-3 h-5 w-5" />
            Dashboard
          </NavLink>
          <NavLink 
            to="/datasets" 
            className={({ isActive }) => 
              `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                isActive 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <Database className="mr-3 h-5 w-5" />
            Datasets
          </NavLink>
          <NavLink 
            to="/visualizations" 
            className={({ isActive }) => 
              `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                isActive 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <BarChart2 className="mr-3 h-5 w-5" />
            Visualizations
          </NavLink>
          <NavLink 
            to="/dashboards" 
            className={({ isActive }) => 
              `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                isActive 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <LayoutDashboard className="mr-3 h-5 w-5" />
            Dashboards
          </NavLink>
        </nav>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white shadow-sm">
          <div className="flex items-center justify-between h-16 px-4">
            <button 
              className="p-1 rounded-md text-gray-500 hover:text-gray-900 focus:outline-none lg:hidden"
              onClick={toggleSidebar}
            >
              <Menu size={24} />
            </button>
            
            {/* User menu */}
            <div className="relative">
              <button 
                className="flex items-center space-x-2 focus:outline-none"
                onClick={toggleUserMenu}
              >
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  {isGuest ? <User size={16} /> : (user?.name?.charAt(0) || <User size={16} />)}
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {displayName}
                </span>
                <ChevronDown size={16} className="text-gray-500" />
              </button>
              
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  {!isGuest && (
                    <>
                      <button 
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => navigate('/profile')}
                      >
                        <User size={16} className="mr-2" />
                        Profile
                      </button>
                      <button 
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => navigate('/settings')}
                      >
                        <Settings size={16} className="mr-2" />
                        Settings
                      </button>
                    </>
                  )}
                  <button 
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} className="mr-2" />
                    {isGuest ? 'Exit Guest Mode' : 'Logout'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;