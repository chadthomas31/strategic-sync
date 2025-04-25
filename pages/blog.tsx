// pages/blog.tsx
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import Head from 'next/head';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  imageUrl: string;
  tags: string[];
  author?: string;
  formattedDate?: string;
}

function formatDate(dateStr: string): string {
  try {
    // Try parsing ISO format first
    let date = parseISO(dateStr);
    
    // If invalid date, try parsing other formats
    if (isNaN(date.getTime())) {
      date = new Date(dateStr);
    }
    
    // If still invalid, throw error
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }
    
    return format(date, 'MMM d, yyyy');
  } catch (error) {
    console.error('Error formatting date:', dateStr);
    return 'Date unavailable';
  }
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [mounted, setMounted] = useState(false);
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    setMounted(true);
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/blog/posts');
      const data = await response.json();
      
      // Pre-format dates to ensure consistency
      const formattedPosts = data.map((post: BlogPost) => ({
        ...post,
        formattedDate: formatDate(post.date)
      }));
      
      // Set the most recent post as featured
      if (formattedPosts.length > 0) {
        setFeaturedPost(formattedPosts[0]);
      }
      
      setPosts(formattedPosts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
    }
  };

  const categories = ['AI News', 'Industry Updates', 'Tech Trends', 'Use Cases', 'Tutorials'];

  const filteredPosts = posts.filter(post => {
    const matchesCategory = filter === 'all' || post.category === filter;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Don't render anything until client-side hydration is complete
  if (!mounted) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Blog | Strategic Sync - AI Insights & Updates</title>
        <meta name="description" content="Stay informed with the latest in AI technology and industry trends" />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4">AI Insights & Updates</h1>
              <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
                Stay informed with the latest in AI technology and industry trends
              </p>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Featured Post */}
          {featuredPost && !loading && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold mb-8 text-gray-800">Featured Post</h2>
              <Link href={`/blog/${featuredPost.id}`} key={featuredPost.id}>
                <div className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row">
                  <div className="md:w-1/2 h-64 md:h-auto relative overflow-hidden">
                    {featuredPost.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={featuredPost.imageUrl}
                        alt={featuredPost.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                        {featuredPost.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-8 md:w-1/2 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-blue-600 transition-colors">
                        {featuredPost.title}
                      </h3>
                      <p className="text-gray-600 mb-6 line-clamp-3">{featuredPost.excerpt}</p>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-sm text-gray-500">
                        {featuredPost.author && (
                          <span className="font-medium text-gray-700 mr-2">
                            {featuredPost.author} • 
                          </span>
                        )}
                        {featuredPost.formattedDate}
                      </span>
                      <span className="text-blue-600 font-medium group-hover:translate-x-1 transition-transform">Read more →</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Search and Filter */}
          <div className="mb-12 p-4 bg-white rounded-xl shadow-md">
            <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
              <div className="w-full md:w-1/3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 pl-10 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-2/3 justify-end">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    filter === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Posts
                </button>
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setFilter(category)}
                    className={`px-4 py-2 rounded-md whitespace-nowrap transition-colors ${
                      filter === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Blog Posts Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-2xl font-semibold text-gray-700">No posts found</h3>
              <p className="mt-4 text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map(post => (
                <Link href={`/blog/${post.id}`} key={post.id}>
                  <div className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col transform hover:-translate-y-1">
                    <div className="h-48 overflow-hidden rounded-t-xl relative">
                      {post.imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                      <div className="absolute top-4 left-4">
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex-grow flex flex-col">
                      <h2 className="text-xl font-bold mb-3 text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">{post.excerpt}</p>
                      <div className="mt-auto">
                        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                          <span className="text-sm text-gray-500">
                            {post.formattedDate}
                          </span>
                          <div className="flex gap-2">
                            {post.tags.slice(0, 2).map(tag => (
                              <span
                                key={tag}
                                className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          
          {/* Pagination placeholder for future expansion */}
          {filteredPosts.length > 0 && (
            <div className="mt-12 flex justify-center">
              <nav className="relative z-0 inline-flex shadow-sm -space-x-px rounded-md" aria-label="Pagination">
                <a
                  href="#"
                  className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  Previous
                </a>
                <a
                  href="#"
                  aria-current="page"
                  className="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                >
                  1
                </a>
                <a
                  href="#"
                  className="relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  Next
                </a>
              </nav>
            </div>
          )}
        </div>
        
        {/* Newsletter Sign-up */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto">
                Subscribe to our newsletter to receive the latest AI insights directly to your inbox.
              </p>
              <form className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="px-4 py-3 rounded-lg text-gray-900 flex-grow"
                  required
                />
                <button
                  type="submit"
                  className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
