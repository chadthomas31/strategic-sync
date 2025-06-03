import React from 'react';
import StrategicSyncSEO from '../components/StrategicSyncSEO';
import { NextPage } from 'next';

const SEODashboard: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <StrategicSyncSEO />
    </div>
  );
};

export default SEODashboard; 