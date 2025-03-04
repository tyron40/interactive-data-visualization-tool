import React, { useEffect, useState } from 'react';
import VisualizationList from '../components/visualizations/VisualizationList';
import GuestVisualizationList from '../components/visualizations/GuestVisualizationList';

const VisualizationListPage: React.FC = () => {
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    const guestMode = localStorage.getItem('guestMode') === 'true';
    setIsGuest(guestMode);
  }, []);

  return isGuest ? <GuestVisualizationList /> : <VisualizationList />;
};

export default VisualizationListPage;