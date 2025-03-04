import React, { useEffect, useState } from 'react';
import DashboardList from '../components/dashboards/DashboardList';
import GuestDashboardList from '../components/dashboards/GuestDashboardList';

const DashboardListPage: React.FC = () => {
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    const guestMode = localStorage.getItem('guestMode') === 'true';
    setIsGuest(guestMode);
  }, []);

  return isGuest ? <GuestDashboardList /> : <DashboardList />;
};

export default DashboardListPage;