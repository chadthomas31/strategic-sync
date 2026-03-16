import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  FiTrendingUp, FiSearch, FiGlobe, FiBarChart2,
  FiCheck, FiAlertTriangle, FiX, FiArrowUp, FiArrowDown,
  FiEye, FiMousePointer, FiUsers, FiClock, FiArrowRight
} from 'react-icons/fi';
import Link from 'next/link';
import { NextPage } from 'next';
import SEO from '../components/SEO';
import SEOAudit from '../components/SEOAudit';

// Animated section wrapper
const AnimatedSection: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className = '', delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, delay, ease: [0.4, 0, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Mock data for the demo dashboard
const overviewMetrics = [
  { label: 'Organic Traffic', value: '24,831', change: '+12.4%', positive: true, icon: <FiUsers className="w-5 h-5" /> },
  { label: 'Impressions', value: '182,450', change: '+8.7%', positive: true, icon: <FiEye className="w-5 h-5" /> },
  { label: 'Avg. CTR', value: '3.42%', change: '+0.5%', positive: true, icon: <FiMousePointer className="w-5 h-5" /> },
  { label: 'Avg. Position', value: '14.2', change: '-2.1', positive: true, icon: <FiTrendingUp className="w-5 h-5" /> },
];

const topKeywords = [
  { keyword: 'ai consulting services', position: 3, change: +2, volume: 2400, impressions: 12500, ctr: '4.8%' },
  { keyword: 'business ai integration', position: 5, change: +1, volume: 1800, impressions: 9200, ctr: '3.6%' },
  { keyword: 'ai strategy consulting', position: 7, change: +4, volume: 1200, impressions: 7800, ctr: '2.9%' },
  { keyword: 'custom ai development', position: 8, change: -1, volume: 980, impressions: 6400, ctr: '2.4%' },
  { keyword: 'ai readiness assessment', position: 12, change: +3, volume: 720, impressions: 4100, ctr: '1.8%' },
  { keyword: 'process automation ai', position: 15, change: +6, volume: 640, impressions: 3200, ctr: '1.5%' },
];

const pagePerformance = [
  { page: '/services', score: 94, traffic: 8240, bounceRate: '28%', status: 'pass' as const },
  { page: '/', score: 91, traffic: 6120, bounceRate: '32%', status: 'pass' as const },
  { page: '/blog', score: 87, traffic: 4800, bounceRate: '41%', status: 'pass' as const },
  { page: '/contact', score: 82, traffic: 2100, bounceRate: '35%', status: 'warning' as const },
  { page: '/booking', score: 78, traffic: 1840, bounceRate: '22%', status: 'warning' as const },
  { page: '/seo-dashboard', score: 65, traffic: 920, bounceRate: '55%', status: 'fail' as const },
];

const trafficData = [
  { month: 'Sep', organic: 14200, direct: 4800, referral: 2100 },
  { month: 'Oct', organic: 16800, direct: 5200, referral: 2400 },
  { month: 'Nov', organic: 18500, direct: 5500, referral: 2800 },
  { month: 'Dec', organic: 17200, direct: 6100, referral: 3200 },
  { month: 'Jan', organic: 21400, direct: 6400, referral: 3100 },
  { month: 'Feb', organic: 24831, direct: 7200, referral: 3600 },
];

const getMaxTraffic = () => {
  return Math.max(...trafficData.map(d => d.organic + d.direct + d.referral));
};

const StatusBadge: React.FC<{ status: 'pass' | 'warning' | 'fail' }> = ({ status }) => {
  const config = {
    pass: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20', icon: <FiCheck className="w-3 h-3" />, label: 'Good' },
    warning: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20', icon: <FiAlertTriangle className="w-3 h-3" />, label: 'Needs Work' },
    fail: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', icon: <FiX className="w-3 h-3" />, label: 'Poor' },
  };
  const c = config[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text} border ${c.border}`}>
      {c.icon} {c.label}
    </span>
  );
};

const SEODashboard: NextPage = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'audit'>('overview');
  const maxTraffic = getMaxTraffic();

  return (
    <>
      <SEO
        title="SEO Dashboard - Strategic Sync"
        description="Analyze and optimize your pages with Strategic Sync's comprehensive SEO dashboard tool. Get real-time SEO insights and recommendations."
        path="/seo-dashboard"
        keywords={['SEO dashboard', 'SEO audit', 'website optimization', 'SEO analysis', 'page performance']}
      />

      <div className="bg-[#0a0a0a] min-h-screen">
        {/* Hero Section */}
        <section className="relative pt-32 pb-12 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00f0ff]/8 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#ffd700]/8 rounded-full blur-[100px]" />
          </div>

          <div className="container relative z-10">
            <AnimatedSection className="text-center max-w-4xl mx-auto">
              <span className="text-[#00f0ff] text-sm font-medium uppercase tracking-widest mb-4 block">
                Analytics
              </span>
              <h1 className="heading-display mb-6">
                SEO <span className="text-gradient-cyan">Dashboard</span>
              </h1>
              <p className="text-xl text-[#a0a0a0] max-w-2xl mx-auto">
                Monitor your search performance, track keyword rankings, and get actionable
                insights to improve your organic visibility.
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Tab Switcher */}
        <section className="section section-mesh pt-0">
          <div className="container relative z-10">
            <div className="flex justify-center mb-10">
              <div className="inline-flex rounded-xl bg-[#111] border border-[rgba(255,255,255,0.06)] p-1">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'overview'
                      ? 'bg-gradient-to-r from-[#00f0ff] to-[#00b8d4] text-[#0a0a0a]'
                      : 'text-[#666] hover:text-white'
                  }`}
                >
                  Performance Overview
                </button>
                <button
                  onClick={() => setActiveTab('audit')}
                  className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'audit'
                      ? 'bg-gradient-to-r from-[#00f0ff] to-[#00b8d4] text-[#0a0a0a]'
                      : 'text-[#666] hover:text-white'
                  }`}
                >
                  Live SEO Audit
                </button>
              </div>
            </div>

            {activeTab === 'overview' ? (
              <div className="space-y-8">
                {/* Overview Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {overviewMetrics.map((metric, index) => (
                    <motion.div
                      key={metric.label}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-2xl border border-[rgba(255,255,255,0.06)] p-6 group hover:border-[rgba(0,240,255,0.2)] transition-all"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-[rgba(0,240,255,0.1)] flex items-center justify-center text-[#00f0ff]">
                          {metric.icon}
                        </div>
                        <span className={`text-sm font-medium flex items-center gap-1 ${metric.positive ? 'text-green-400' : 'text-red-400'}`}>
                          {metric.positive ? <FiArrowUp className="w-3 h-3" /> : <FiArrowDown className="w-3 h-3" />}
                          {metric.change}
                        </span>
                      </div>
                      <div className="text-2xl font-bold mb-1">{metric.value}</div>
                      <div className="text-[#666] text-sm">{metric.label}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Traffic Chart (bar visualization) */}
                <AnimatedSection>
                  <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-2xl border border-[rgba(255,255,255,0.06)] p-8">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">Traffic Overview</h3>
                        <p className="text-[#666] text-sm">Last 6 months - All sources</p>
                      </div>
                      <div className="flex items-center gap-6 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-[#00f0ff]" />
                          <span className="text-[#999]">Organic</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-[#ffd700]" />
                          <span className="text-[#999]">Direct</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-[#666]" />
                          <span className="text-[#999]">Referral</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-end justify-between gap-4 h-64">
                      {trafficData.map((data, index) => {
                        const total = data.organic + data.direct + data.referral;
                        const heightPercent = (total / maxTraffic) * 100;
                        const organicPercent = (data.organic / total) * heightPercent;
                        const directPercent = (data.direct / total) * heightPercent;
                        const referralPercent = (data.referral / total) * heightPercent;
                        return (
                          <motion.div
                            key={data.month}
                            initial={{ height: 0 }}
                            whileInView={{ height: `${heightPercent}%` }}
                            transition={{ delay: index * 0.1, duration: 0.6, ease: 'easeOut' }}
                            viewport={{ once: true }}
                            className="flex-1 flex flex-col items-center group/bar"
                          >
                            <div className="w-full flex flex-col rounded-t-lg overflow-hidden" style={{ height: '100%' }}>
                              <div className="bg-[#00f0ff]/80 hover:bg-[#00f0ff] transition-colors" style={{ flex: organicPercent }} />
                              <div className="bg-[#ffd700]/80 hover:bg-[#ffd700] transition-colors" style={{ flex: directPercent }} />
                              <div className="bg-[#666]/80 hover:bg-[#666] transition-colors" style={{ flex: referralPercent }} />
                            </div>
                            <div className="text-[#666] text-xs mt-3">{data.month}</div>
                            {/* Tooltip */}
                            <div className="absolute -top-12 hidden group-hover/bar:block bg-[#222] border border-[rgba(255,255,255,0.1)] rounded-lg px-3 py-2 text-xs whitespace-nowrap z-10">
                              <span className="text-white font-medium">{total.toLocaleString()}</span>
                              <span className="text-[#666] ml-1">total visits</span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </AnimatedSection>

                {/* Top Keywords Table */}
                <AnimatedSection delay={0.1}>
                  <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-2xl border border-[rgba(255,255,255,0.06)] p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">Top Keywords</h3>
                        <p className="text-[#666] text-sm">Ranking positions and search performance</p>
                      </div>
                      <FiSearch className="w-5 h-5 text-[#666]" />
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-[#666] text-xs uppercase tracking-wider border-b border-[rgba(255,255,255,0.06)]">
                            <th className="pb-4 pr-4">Keyword</th>
                            <th className="pb-4 pr-4">Position</th>
                            <th className="pb-4 pr-4">Change</th>
                            <th className="pb-4 pr-4">Volume</th>
                            <th className="pb-4 pr-4">Impressions</th>
                            <th className="pb-4">CTR</th>
                          </tr>
                        </thead>
                        <tbody>
                          {topKeywords.map((kw, index) => (
                            <motion.tr
                              key={kw.keyword}
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              viewport={{ once: true }}
                              className="border-b border-[rgba(255,255,255,0.03)] hover:bg-[rgba(0,240,255,0.02)] transition-colors"
                            >
                              <td className="py-4 pr-4 font-medium text-sm">{kw.keyword}</td>
                              <td className="py-4 pr-4">
                                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold ${
                                  kw.position <= 5 ? 'bg-green-500/10 text-green-400' :
                                  kw.position <= 10 ? 'bg-yellow-500/10 text-yellow-400' :
                                  'bg-[rgba(255,255,255,0.05)] text-[#999]'
                                }`}>
                                  {kw.position}
                                </span>
                              </td>
                              <td className="py-4 pr-4">
                                <span className={`flex items-center gap-1 text-sm ${kw.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                  {kw.change > 0 ? <FiArrowUp className="w-3 h-3" /> : <FiArrowDown className="w-3 h-3" />}
                                  {Math.abs(kw.change)}
                                </span>
                              </td>
                              <td className="py-4 pr-4 text-[#999] text-sm">{kw.volume.toLocaleString()}</td>
                              <td className="py-4 pr-4 text-[#999] text-sm">{kw.impressions.toLocaleString()}</td>
                              <td className="py-4 text-[#00f0ff] text-sm font-medium">{kw.ctr}</td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </AnimatedSection>

                {/* Page Performance */}
                <AnimatedSection delay={0.2}>
                  <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-2xl border border-[rgba(255,255,255,0.06)] p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">Page Performance</h3>
                        <p className="text-[#666] text-sm">SEO score, traffic, and bounce rate by page</p>
                      </div>
                      <FiBarChart2 className="w-5 h-5 text-[#666]" />
                    </div>
                    <div className="space-y-4">
                      {pagePerformance.map((page, index) => (
                        <motion.div
                          key={page.page}
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ delay: index * 0.05 }}
                          viewport={{ once: true }}
                          className="flex items-center gap-6 p-4 rounded-xl hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                        >
                          <div className="flex-shrink-0 w-40">
                            <span className="font-mono text-sm text-[#00f0ff]">{page.page}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <div className="flex-1 h-2 bg-[rgba(255,255,255,0.05)] rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  whileInView={{ width: `${page.score}%` }}
                                  transition={{ duration: 0.8, delay: index * 0.1 }}
                                  viewport={{ once: true }}
                                  className={`h-full rounded-full ${
                                    page.score >= 90 ? 'bg-green-400' :
                                    page.score >= 75 ? 'bg-yellow-400' :
                                    'bg-red-400'
                                  }`}
                                />
                              </div>
                              <span className="text-sm font-medium w-10 text-right">{page.score}</span>
                            </div>
                          </div>
                          <div className="flex-shrink-0 w-24 text-right text-sm text-[#999]">
                            {page.traffic.toLocaleString()} visits
                          </div>
                          <div className="flex-shrink-0 w-20 text-right text-sm text-[#999]">
                            {page.bounceRate}
                          </div>
                          <div className="flex-shrink-0">
                            <StatusBadge status={page.status} />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </AnimatedSection>

                {/* SEO Best Practices */}
                <AnimatedSection delay={0.3}>
                  <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-2xl border border-[rgba(255,255,255,0.06)] p-8">
                    <h3 className="text-lg font-semibold mb-6">SEO Best Practices</h3>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-[#00f0ff] font-medium mb-4 flex items-center gap-2">
                          <FiGlobe className="w-4 h-4" /> Technical SEO
                        </h4>
                        <ul className="space-y-3">
                          {[
                            'Optimize page loading speed',
                            'Ensure mobile responsiveness',
                            'Use HTTPS protocol',
                            'Create XML sitemap',
                            'Implement structured data',
                          ].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm text-[#999]">
                              <FiCheck className="text-[#00f0ff] flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-[#ffd700] font-medium mb-4 flex items-center gap-2">
                          <FiSearch className="w-4 h-4" /> Content SEO
                        </h4>
                        <ul className="space-y-3">
                          {[
                            'Write compelling meta descriptions',
                            'Use relevant keywords naturally',
                            'Create quality, original content',
                            'Optimize images with alt text',
                            'Use proper heading structure',
                          ].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm text-[#999]">
                              <FiCheck className="text-[#ffd700] flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              </div>
            ) : (
              /* Live SEO Audit Tab */
              <AnimatedSection>
                <div className="max-w-4xl mx-auto [&_*]:!border-[rgba(255,255,255,0.08)] [&_.bg-white]:!bg-gradient-to-br [&_.bg-white]:!from-[#1a1a1a] [&_.bg-white]:!to-[#0d0d0d] [&_.text-gray-800]:!text-white [&_.text-gray-600]:!text-[#999] [&_.text-gray-700]:!text-[#a0a0a0] [&_.text-gray-500]:!text-[#666] [&_.border-gray-200]:!border-[rgba(255,255,255,0.06)] [&_.bg-blue-600]:!bg-[#00f0ff] [&_.bg-blue-600]:!text-[#0a0a0a] [&_.hover\\:bg-blue-700]:hover:!bg-[#00b8d4] [&_.bg-green-100]:!bg-green-500/10 [&_.text-green-600]:!text-green-400 [&_.bg-yellow-100]:!bg-yellow-500/10 [&_.text-yellow-600]:!text-yellow-400 [&_.bg-red-100]:!bg-red-500/10 [&_.text-red-600]:!text-red-400 [&_.bg-gray-100]:!bg-[rgba(255,255,255,0.05)] [&_.shadow-lg]:!shadow-none">
                  <SEOAudit />
                </div>
              </AnimatedSection>
            )}

            {/* CTA */}
            <AnimatedSection className="mt-16">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-[#00f0ff]/10 via-transparent to-[#ffd700]/10 blur-3xl rounded-3xl" />
                <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#111] rounded-3xl border border-[rgba(255,255,255,0.08)] p-12 text-center">
                  <h2 className="heading-xl mb-4">
                    Want Better <span className="text-gradient-cyan">SEO Results</span>?
                  </h2>
                  <p className="text-[#a0a0a0] max-w-xl mx-auto mb-8">
                    Let our team audit your entire digital presence and build a strategy
                    to dominate your niche in search results.
                  </p>
                  <Link href="/contact" className="btn-primary inline-flex">
                    Get a Professional SEO Audit
                    <FiArrowRight className="ml-2" />
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="container">
            <div className="pt-8 border-t border-[rgba(255,255,255,0.05)] flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-[#666] text-sm">
                &copy; {new Date().getFullYear()} Strategic Sync. All rights reserved.
              </p>
              <div className="flex gap-6">
                <Link href="/" className="text-[#666] hover:text-[#00f0ff] transition-colors text-sm">
                  Home
                </Link>
                <Link href="/services" className="text-[#666] hover:text-[#00f0ff] transition-colors text-sm">
                  Services
                </Link>
                <Link href="/contact" className="text-[#666] hover:text-[#00f0ff] transition-colors text-sm">
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default SEODashboard;
