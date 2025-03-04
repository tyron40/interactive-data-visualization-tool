import React, { useEffect, useState } from 'react';
import DatasetList from '../components/data/DatasetList';
import GuestDatasetList from '../components/data/GuestDatasetList';

const DatasetListPage: React.FC = () => {
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    const guestMode = localStorage.getItem('guestMode') === 'true';
    setIsGuest(guestMode);
  }, []);

  return isGuest ? <GuestDatasetList /> : <DatasetList />;
};

export default DatasetListPage;