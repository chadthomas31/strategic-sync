import React from 'react';
import SEOAudit from '../components/SEOAudit';
import { NextPage } from 'next';
import SEO from '../components/SEO'

const SEODashboard: NextPage = () => {
  return (
    <>
      <SEO
        title="SEO Dashboard – Strategic Sync"
        description="Analyze and optimize your pages with Strategic Sync's comprehensive SEO dashboard tool. Get real-time SEO insights and recommendations."
        path="/seo-dashboard"
        keywords={['SEO dashboard', 'SEO audit', 'website optimization', 'SEO analysis', 'page performance']}
      />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              SEO Dashboard
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Analyze your page&apos;s SEO performance and get actionable insights to improve your search rankings.
            </p>
          </div>
          
          <SEOAudit />
          
          <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">SEO Best Practices</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Technical SEO</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Optimize page loading speed</li>
                  <li>• Ensure mobile responsiveness</li>
                  <li>• Use HTTPS protocol</li>
                  <li>• Create XML sitemap</li>
                  <li>• Implement structured data</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Content SEO</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Write compelling meta descriptions</li>
                  <li>• Use relevant keywords naturally</li>
                  <li>• Create quality, original content</li>
                  <li>• Optimize images with alt text</li>
                  <li>• Use proper heading structure</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SEODashboard; 