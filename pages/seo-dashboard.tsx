import React from 'react';
import StrategicSyncSEO from '../components/StrategicSyncSEO';
import { NextPage } from 'next';
import SEO from '../components/SEO'
import { siteUrl } from '../seo.config'

const SEODashboard: NextPage = () => {
  return (
    <>
      <SEO
        title="SEO Dashboard | Strategic Sync"
        description="Analyze and optimize your pages with Strategic Sync's comprehensive SEO dashboard tool."
        path="/seo-dashboard"
      />
      <div className="min-h-screen bg-gray-50">
        <StrategicSyncSEO />
      </div>
    </>
  );
};

export default SEODashboard; 