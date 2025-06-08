import React, { useState, useEffect } from 'react'

interface SEOAuditProps {
  url?: string
}

interface AuditResult {
  category: string
  status: 'pass' | 'warning' | 'fail'
  message: string
  score?: number
}

const SEOAudit: React.FC<SEOAuditProps> = ({ url = window?.location?.href }) => {
  const [auditResults, setAuditResults] = useState<AuditResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [overallScore, setOverallScore] = useState(0)

  const runAudit = async () => {
    setIsLoading(true)
    const results: AuditResult[] = []

    try {
      // Check meta title
      const title = document.querySelector('title')?.textContent
      if (title && title.length > 0 && title.length <= 60) {
        results.push({
          category: 'Title Tag',
          status: 'pass',
          message: `Title length: ${title.length} characters (optimal)`,
          score: 100
        })
      } else if (title && title.length > 60) {
        results.push({
          category: 'Title Tag',
          status: 'warning',
          message: `Title too long: ${title.length} characters (should be ≤60)`,
          score: 70
        })
      } else {
        results.push({
          category: 'Title Tag',
          status: 'fail',
          message: 'Missing or empty title tag',
          score: 0
        })
      }

      // Check meta description
      const description = document.querySelector('meta[name="description"]')?.getAttribute('content')
      if (description && description.length > 0 && description.length <= 160) {
        results.push({
          category: 'Meta Description',
          status: 'pass',
          message: `Description length: ${description.length} characters (optimal)`,
          score: 100
        })
      } else if (description && description.length > 160) {
        results.push({
          category: 'Meta Description',
          status: 'warning',
          message: `Description too long: ${description.length} characters (should be ≤160)`,
          score: 70
        })
      } else {
        results.push({
          category: 'Meta Description',
          status: 'fail',
          message: 'Missing or empty meta description',
          score: 0
        })
      }

      // Check canonical URL
      const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href')
      if (canonical) {
        results.push({
          category: 'Canonical URL',
          status: 'pass',
          message: 'Canonical URL is set',
          score: 100
        })
      } else {
        results.push({
          category: 'Canonical URL',
          status: 'warning',
          message: 'Canonical URL not found',
          score: 50
        })
      }

      // Check Open Graph tags
      const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content')
      const ogDescription = document.querySelector('meta[property="og:description"]')?.getAttribute('content')
      const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute('content')
      
      if (ogTitle && ogDescription && ogImage) {
        results.push({
          category: 'Open Graph',
          status: 'pass',
          message: 'All essential Open Graph tags present',
          score: 100
        })
      } else {
        results.push({
          category: 'Open Graph',
          status: 'warning',
          message: 'Missing some Open Graph tags',
          score: 60
        })
      }

      // Check Twitter Card tags
      const twitterCard = document.querySelector('meta[name="twitter:card"]')?.getAttribute('content')
      const twitterTitle = document.querySelector('meta[name="twitter:title"]')?.getAttribute('content')
      
      if (twitterCard && twitterTitle) {
        results.push({
          category: 'Twitter Cards',
          status: 'pass',
          message: 'Twitter Card tags present',
          score: 100
        })
      } else {
        results.push({
          category: 'Twitter Cards',
          status: 'warning',
          message: 'Missing Twitter Card tags',
          score: 50
        })
      }

      // Check structured data
      const structuredData = document.querySelector('script[type="application/ld+json"]')
      if (structuredData) {
        results.push({
          category: 'Structured Data',
          status: 'pass',
          message: 'JSON-LD structured data found',
          score: 100
        })
      } else {
        results.push({
          category: 'Structured Data',
          status: 'fail',
          message: 'No structured data found',
          score: 0
        })
      }

      // Check headings structure
      const h1Tags = document.querySelectorAll('h1')
      if (h1Tags.length === 1) {
        results.push({
          category: 'Heading Structure',
          status: 'pass',
          message: 'Single H1 tag found (optimal)',
          score: 100
        })
      } else if (h1Tags.length > 1) {
        results.push({
          category: 'Heading Structure',
          status: 'warning',
          message: `Multiple H1 tags found (${h1Tags.length})`,
          score: 70
        })
      } else {
        results.push({
          category: 'Heading Structure',
          status: 'fail',
          message: 'No H1 tag found',
          score: 0
        })
      }

      // Check images alt text
      const images = document.querySelectorAll('img')
      const imagesWithoutAlt = Array.from(images).filter(img => !img.getAttribute('alt'))
      
      if (imagesWithoutAlt.length === 0 && images.length > 0) {
        results.push({
          category: 'Image Alt Text',
          status: 'pass',
          message: 'All images have alt text',
          score: 100
        })
      } else if (imagesWithoutAlt.length > 0) {
        results.push({
          category: 'Image Alt Text',
          status: 'warning',
          message: `${imagesWithoutAlt.length} images missing alt text`,
          score: 60
        })
      }

      // Calculate overall score
      const totalScore = results.reduce((sum, result) => sum + (result.score || 0), 0)
      const avgScore = Math.round(totalScore / results.length)
      setOverallScore(avgScore)
      
      setAuditResults(results)
    } catch (error) {
      console.error('SEO audit error:', error)
    }
    
    setIsLoading(false)
  }

  useEffect(() => {
    // Run audit on component mount
    const timer = setTimeout(runAudit, 1000)
    return () => clearTimeout(timer)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'text-green-600 bg-green-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      case 'fail': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">SEO Audit</h2>
        <div className="flex items-center gap-4">
          <div className={`text-2xl font-bold ${getScoreColor(overallScore)}`}>
            Score: {overallScore}/100
          </div>
          <button
            onClick={runAudit}
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Running...' : 'Run Audit'}
          </button>
        </div>
      </div>

      {auditResults.length > 0 && (
        <div className="space-y-4">
          {auditResults.map((result, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">{result.category}</h3>
                <div className="flex items-center gap-2">
                  {result.score !== undefined && (
                    <span className={`font-medium ${getScoreColor(result.score)}`}>
                      {result.score}/100
                    </span>
                  )}
                  <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(result.status)}`}>
                    {result.status.toUpperCase()}
                  </span>
                </div>
              </div>
              <p className="text-gray-600 mt-2">{result.message}</p>
            </div>
          ))}
        </div>
      )}

      {auditResults.length === 0 && !isLoading && (
                 <div className="text-center text-gray-500 py-8">
           Click &quot;Run Audit&quot; to analyze this page&apos;s SEO
         </div>
      )}

      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-2">Analyzing page SEO...</p>
        </div>
      )}
    </div>
  )
}

export default SEOAudit 