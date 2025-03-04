import React, { useEffect, useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { BarChart2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const AuthLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const [isGuest, setIsGuest] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const guestMode = localStorage.getItem('guestMode') === 'true';
    setIsGuest(guestMode);
    
    // Only set redirect flag if authenticated or in guest mode
    if (!isLoading && (isAuthenticated || guestMode)) {
      setShouldRedirect(true);
    }
  }, [isLoading, isAuthenticated]); // Add dependencies to prevent infinite loop
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Use the flag for redirection instead of directly returning Navigate
  if (shouldRedirect) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <BarChart2 className="h-12 w-12 text-blue-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Interactive Data Visualization
        </h2>
      </div>
      
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;