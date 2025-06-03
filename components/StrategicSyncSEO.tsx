import React, { useState } from 'react';
import { Search, CheckCircle, AlertCircle, Copy, ExternalLink, TrendingUp } from 'lucide-react';

interface MetaTag {
  name: string;
  content: string;
  type: 'title' | 'meta' | 'og' | 'twitter' | 'structured';
  priority: 'high' | 'medium' | 'low';
}

interface SEOIssue {
  type: 'error' | 'warning' | 'info';
  title: string;
  description: string;
  fix: string;
}

const StrategicSyncSEO: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'meta-tags' | 'issues' | 'recommendations'>('overview');
  const [copiedTag, setCopiedTag] = useState<string>('');

  const currentMetaTags: MetaTag[] = [
    {
      name: 'Title',
      content: 'Strategic Sync - AI Solutions for Business',
      type: 'title',
      priority: 'high'
    },
    {
      name: 'Meta Description',
      content: 'We combine cutting-edge AI technology with deep business expertise to deliver solutions that drive real results.',
      type: 'meta',
      priority: 'high'
    }
  ];

  const optimizedMetaTags: MetaTag[] = [
    {
      name: 'Title',
      content: 'Strategic Sync - AI Implementation & Consulting Services | Transform Your Business',
      type: 'title',
      priority: 'high'
    },
    {
      name: 'Meta Description',
      content: 'Expert AI consulting and implementation services. Strategic Sync helps businesses integrate cutting-edge AI technology to drive measurable results and operational transformation. Free consultation available.',
      type: 'meta',
      priority: 'high'
    },
    {
      name: 'og:title',
      content: 'Strategic Sync - AI Implementation & Consulting Services',
      type: 'og',
      priority: 'medium'
    },
    {
      name: 'og:description',
      content: 'Transform your business with expert AI consulting and implementation services. Drive measurable results with Strategic Sync\'s proven AI solutions.',
      type: 'og',
      priority: 'medium'
    },
    {
      name: 'twitter:title',
      content: 'Strategic Sync - AI Implementation & Consulting Services',
      type: 'twitter',
      priority: 'medium'
    }
  ];

  const seoIssues: SEOIssue[] = [
    {
      type: 'error',
      title: 'Missing Meta Description Length Optimization',
      description: 'Current meta description is too short and doesn\'t include compelling CTAs',
      fix: 'Expand to 150-155 characters with clear value proposition and call-to-action'
    },
    {
      type: 'warning',
      title: 'Generic Title Tag',
      description: 'Title lacks specific keywords and competitive differentiation',
      fix: 'Include "Implementation & Consulting" and location/specialization keywords'
    },
    {
      type: 'error',
      title: 'Missing Open Graph Tags',
      description: 'No social media optimization tags found',
      fix: 'Add og:title, og:description, og:image, and og:type tags'
    },
    {
      type: 'warning',
      title: 'No Structured Data',
      description: 'Missing JSON-LD markup for enhanced SERP appearance',
      fix: 'Implement Organization and Service schema markup'
    }
  ];

  const htmlCode = `<!-- Enhanced Meta Tags for Strategic Sync -->
<head>
  <title>Strategic Sync - AI Implementation & Consulting Services | Transform Your Business</title>
  <meta name="description" content="Expert AI consulting and implementation services. Strategic Sync helps businesses integrate cutting-edge AI technology to drive measurable results and operational transformation. Free consultation available.">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://strategicsync.com/">
  <meta property="og:title" content="Strategic Sync - AI Implementation & Consulting Services">
  <meta property="og:description" content="Transform your business with expert AI consulting and implementation services. Drive measurable results with Strategic Sync's proven AI solutions.">
  <meta property="og:image" content="https://strategicsync.com/images/ai-consulting-hero.jpg">
  
  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:title" content="Strategic Sync - AI Implementation & Consulting Services">
  <meta property="twitter:description" content="Transform your business with expert AI consulting and implementation services.">
  
  <!-- Technical SEO -->
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://strategicsync.com/">
  
  <!-- Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Strategic Sync",
    "url": "https://strategicsync.com",
    "description": "AI consulting and implementation services for business transformation",
    "service": {
      "@type": "Service",
      "name": "AI Consulting Services",
      "description": "Expert AI implementation and strategy consulting for businesses"
    }
  }
  </script>
</head>`;

  const copyToClipboard = (text: string, tagName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTag(tagName);
    setTimeout(() => setCopiedTag(''), 2000);
  };

  const getIssueIcon = (type: SEOIssue['type']) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority: MetaTag['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Search className="w-8 h-8 text-blue-600" />
                Strategic Sync SEO Optimization
              </h1>
              <p className="text-gray-600 mt-2">Comprehensive SEO analysis and recommendations for strategicsync.com</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">68/100</div>
              <div className="text-sm text-gray-500">SEO Score</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: TrendingUp },
                { id: 'meta-tags', label: 'Meta Tags', icon: Search },
                { id: 'issues', label: 'Issues', icon: AlertCircle },
                { id: 'recommendations', label: 'Code', icon: Copy }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm ${
                    activeTab === id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Status</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Title Tag:</span>
                    <span className="text-yellow-600 font-medium">Needs Improvement</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Meta Description:</span>
                    <span className="text-red-600 font-medium">Poor</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Open Graph:</span>
                    <span className="text-red-600 font-medium">Missing</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Structured Data:</span>
                    <span className="text-red-600 font-medium">Missing</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Title Length:</span>
                    <span className="text-green-600 font-medium">42 chars ✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Description Length:</span>
                    <span className="text-red-600 font-medium">89 chars ✗</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Keyword Density:</span>
                    <span className="text-yellow-600 font-medium">Low</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mobile Friendly:</span>
                    <span className="text-green-600 font-medium">Yes ✓</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Actions</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Add Open Graph tags</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Optimize meta description</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Enhance title keywords</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Add structured data</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'meta-tags' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-red-600">Current Meta Tags</h3>
                <div className="space-y-4">
                  {currentMetaTags.map((tag, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-gray-900">{tag.name}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(tag.priority)}`}>
                          {tag.priority}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{tag.content}</p>
                      <div className="text-xs text-gray-400 mt-2">
                        Length: {tag.content.length} characters
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-green-600">Optimized Meta Tags</h3>
                <div className="space-y-4">
                  {optimizedMetaTags.map((tag, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-gray-900">{tag.name}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(tag.priority)}`}>
                          {tag.priority}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{tag.content}</p>
                      <div className="flex justify-between items-center mt-2">
                        <div className="text-xs text-gray-400">
                          Length: {tag.content.length} characters
                        </div>
                        <button
                          onClick={() => copyToClipboard(tag.content, tag.name)}
                          className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          {copiedTag === tag.name ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'issues' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">SEO Issues & Fixes</h3>
              <div className="space-y-4">
                {seoIssues.map((issue, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      {getIssueIcon(issue.type)}
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{issue.title}</h4>
                        <p className="text-gray-600 text-sm mt-1">{issue.description}</p>
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                          <p className="text-blue-800 text-sm font-medium">Recommended Fix:</p>
                          <p className="text-blue-700 text-sm mt-1">{issue.fix}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Complete HTML Implementation</h3>
                <button
                  onClick={() => copyToClipboard(htmlCode, 'full-code')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Copy className="w-4 h-4" />
                  {copiedTag === 'full-code' ? 'Copied!' : 'Copy All Code'}
                </button>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-green-400 text-sm">
                  <code>{htmlCode}</code>
                </pre>
              </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Implementation Steps:</h4>
                <ol className="list-decimal list-inside space-y-1 text-blue-800 text-sm">
                  <li>Copy the code above and paste it into your website's &lt;head&gt; section</li>
                  <li>Replace placeholder image URLs with actual high-quality images</li>
                  <li>Update contact information and social media URLs</li>
                  <li>Test the implementation using Google's Rich Results Test</li>
                  <li>Submit your updated sitemap to Google Search Console</li>
                  <li>Monitor performance in Google Analytics and Search Console</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Additional Recommendations */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional SEO Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Content Strategy</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Create AI implementation case studies with measurable results</li>
                <li>• Develop industry-specific AI solution pages (healthcare, finance, etc.)</li>
                <li>• Add client testimonials with specific outcomes</li>
                <li>• Create a blog covering AI trends and implementation guides</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Technical SEO</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Implement page speed optimization (target &lt;3 seconds)</li>
                <li>• Add SSL certificate if not already present</li>
                <li>• Create XML sitemap and submit to search engines</li>
                <li>• Set up Google Analytics and Search Console</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategicSyncSEO; 