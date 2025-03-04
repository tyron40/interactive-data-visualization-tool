import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuthStore } from './store/authStore';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import Dashboard from './pages/Dashboard';
import GuestDashboard from './pages/GuestDashboard';
import DatasetList from './pages/DatasetList';
import DatasetDetail from './pages/DatasetDetail';
import VisualizationList from './pages/VisualizationList';
import VisualizationDetail from './pages/VisualizationDetail';
import VisualizationEditor from './pages/VisualizationEditor';
import DashboardList from './pages/DashboardList';
import DashboardDetail from './pages/DashboardDetail';
import DashboardEditor from './pages/DashboardEditor';
import DataImport from './pages/DataImport';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

// Auth guard component
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const [isGuest, setIsGuest] = useState(false);
  const [checked, setChecked] = useState(false);
  
  // Check if user is in guest mode
  useEffect(() => {
    const guestMode = localStorage.getItem('guestMode') === 'true';
    setIsGuest(guestMode);
    setChecked(true);
  }, []); // Empty dependency array to run only once
  
  if (isLoading || !checked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return isAuthenticated || isGuest ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  const { initAuth } = useAuthStore();
  const [isGuest, setIsGuest] = useState(false);
  
  useEffect(() => {
    initAuth();
    const guestMode = localStorage.getItem('guestMode') === 'true';
    setIsGuest(guestMode);
  }, []); // Empty dependency array to run only once

  return (
    <Router>
      <Routes>
        {/* Auth routes */}
        <Route path="/" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        
        {/* Main app routes */}
        <Route path="/" element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }>
          <Route index element={isGuest ? <GuestDashboard /> : <Dashboard />} />
          
          {/* Dataset routes */}
          <Route path="datasets" element={<DatasetList />} />
          <Route path="datasets/new" element={<DataImport />} />
          <Route path="datasets/:datasetId" element={<DatasetDetail />} />
          <Route path="datasets/:datasetId/edit" element={<DataImport />} />
          <Route path="datasets/:datasetId/visualize" element={<VisualizationEditor />} />
          
          {/* Visualization routes */}
          <Route path="visualizations" element={<VisualizationList />} />
          <Route path="visualizations/:visualizationId" element={<VisualizationDetail />} />
          <Route path="visualizations/:visualizationId/edit" element={<VisualizationEditor />} />
          
          {/* Dashboard routes */}
          <Route path="dashboards" element={<DashboardList />} />
          <Route path="dashboards/new" element={<DashboardEditor />} />
          <Route path="dashboards/:dashboardId" element={<DashboardDetail />} />
          <Route path="dashboards/:dashboardId/edit" element={<DashboardEditor />} />
        </Route>
        
        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;