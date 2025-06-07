import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import { siteUrl } from '../seo.config';

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
    let date = parseISO(dateStr);
    
    if (isNaN(date.getTime())) {
      date = new Date(dateStr);
    }
    
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }
    
    return format(date, 'MMM d, yyyy');
  } catch (error) {
    console.error('Error formatting date:', dateStr);
    return 'Date unavailable';
  }
}

// Generate a gradient based on the category
const getCategoryGradient = (category: string) => {
  const gradients = {
    'AI News': 'from-blue-500 to-purple-600',
    'Industry Updates': 'from-green-500 to-teal-600',
    'Tech Trends': 'from-purple-500 to-pink-600',
    'Use Cases': 'from-orange-500 to-red-600',
    'Tutorials': 'from-cyan-500 to-blue-600',
  };
  return gradients[category as keyof typeof gradients] || 'from-gray-500 to-gray-600';
};

// Generate an icon based on the category
const getCategoryIcon = (category: string) => {
  const icons = {
    'AI News': '🤖',
    'Industry Updates': '📈',
    'Tech Trends': '🔥',
    'Use Cases': '💡',
    'Tutorials': '📚',
  };
  return icons[category as keyof typeof icons] || '📄';
};

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
      
      const formattedPosts = data.map((post: BlogPost) => ({
        ...post,
        formattedDate: formatDate(post.date)
      }));
      
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

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime;
  };

  // Placeholder component for when no image is available
  const PlaceholderImage = ({ category, title }: { category: string; title: string }) => (
    <div className={`w-full h-full bg-gradient-to-br ${getCategoryGradient(category)} flex items-center justify-center text-white`}>
      <div className="text-center p-4">
        <div className="text-4xl mb-2">{getCategoryIcon(category)}</div>
        <div className="text-sm font-medium opacity-90">{category}</div>
      </div>
    </div>
  );

  if (!mounted) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Blog | Strategic Sync - AI Insights & Updates</title>
        <meta
          name="description"
          content="Stay informed with the latest in AI technology and industry trends"
        />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        {/* Navbar */}
        <div className="relative z-30">
          <Navbar />
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white pt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 bg-purple-600/30 rounded-full text-purple-200 text-sm font-medium mb-6">
                📚 Latest AI Insights
              </div>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-6">
                AI Knowledge Hub
              </h1>
              <p className="text-xl md:text-2xl max-w-3xl mx-auto text-slate-300 leading-relaxed">
                Stay ahead with expert insights, industry trends, and practical guidance on AI implementation
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 mt-12 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-400">{posts.length}+</div>
                  <div className="text-slate-400">Articles</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">50K+</div>
                  <div className="text-slate-400">Readers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">Weekly</div>
                  <div className="text-slate-400">Updates</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Featured Post */}
          {featuredPost && !loading && (
            <div className="mb-16 -mt-20 relative z-10">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                <Link href={`/blog/${featuredPost.id}`}>
                  <div className="group flex flex-col lg:flex-row cursor-pointer">
                    <div className="lg:w-1/2 h-64 lg:h-auto relative overflow-hidden">
                      {featuredPost.imageUrl ? (
                        <Image
                          src={featuredPost.imageUrl}
                          alt={featuredPost.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <PlaceholderImage category={featuredPost.category} title={featuredPost.title} />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute top-6 left-6">
                        <span className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                          ✨ Featured
                        </span>
                      </div>
                      <div className="absolute bottom-6 left-6 right-6">
                        <span className="bg-black/30 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                          {featuredPost.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-8 lg:w-1/2 flex flex-col justify-between">
                      <div>
                        <h2 className="text-3xl font-bold mb-4 text-gray-900 group-hover:text-purple-600 transition-colors leading-tight">
                          {featuredPost.title}
                        </h2>
                        <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                          {featuredPost.excerpt.replace(/[#*]/g, '').substring(0, 200)}...
                        </p>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            📅 {featuredPost.formattedDate}
                          </div>
                          <div className="flex items-center gap-2">
                            ⏱️ {getReadingTime(featuredPost.content)} min read
                          </div>
                          {featuredPost.author && (
                            <div className="flex items-center gap-2">
                              👤 {featuredPost.author}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            {featuredPost.tags.slice(0, 3).map(tag => (
                              <span
                                key={tag}
                                className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <span className="text-purple-600 font-semibold group-hover:translate-x-2 transition-transform flex items-center gap-2">
                            Read Article →
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          )}

          {/* Search and Filter */}
          <div className="mb-12 bg-white p-6 rounded-2xl shadow-lg">
            <div className="flex flex-col lg:flex-row gap-6 justify-between items-center">
              <div className="w-full lg:w-1/2">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                  <input
                    type="text"
                    placeholder="Search articles, topics, or keywords..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-12 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-lg"
                  />
                </div>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-6 py-3 rounded-xl transition-all font-medium ${
                    filter === 'all'
                      ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Posts
                </button>
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setFilter(category)}
                    className={`px-6 py-3 rounded-xl whitespace-nowrap transition-all font-medium ${
                      filter === category
                        ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg'
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
            <div className="flex justify-center items-center py-24">
              <div className="flex items-center gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
                <span className="text-gray-600 font-medium">Loading articles...</span>
              </div>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                🔍
              </div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">No articles found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilter('all');
                }}
                className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map(post => (
                <Link href={`/blog/${post.id}`} key={post.id}>
                  <article className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 h-full flex flex-col transform hover:-translate-y-2 cursor-pointer">
                    <div className="h-48 overflow-hidden rounded-t-2xl relative">
                      {post.imageUrl ? (
                        <Image
                          src={post.imageUrl}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <PlaceholderImage category={post.category} title={post.title} />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute top-4 left-4">
                        <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex-grow flex flex-col">
                      <h2 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-purple-600 transition-colors leading-tight">
                        {post.title}
                      </h2>
                      <p className="text-gray-600 mb-4 flex-grow leading-relaxed">
                        {post.excerpt.replace(/[#*]/g, '').substring(0, 150)}...
                      </p>
                      <div className="mt-auto space-y-4">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            📅 {post.formattedDate}
                          </div>
                          <div className="flex items-center gap-1">
                            ⏱️ {getReadingTime(post.content)}m
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex gap-2">
                            {post.tags.slice(0, 2).map(tag => (
                              <span
                                key={tag}
                                className="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg text-xs font-medium"
                              >
                                🏷️ {tag}
                              </span>
                            ))}
                          </div>
                          <div className="text-purple-600 font-medium group-hover:translate-x-1 transition-transform">
                            →
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
        
        {/* Newsletter Sign-up */}
        <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl">
                📧
              </div>
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Stay Updated
              </h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto text-slate-300 leading-relaxed">
                Subscribe to our newsletter to receive the latest AI insights, industry trends, and expert analysis directly to your inbox.
              </p>
              <form className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="px-6 py-4 rounded-xl text-gray-900 flex-grow border-0 focus:ring-2 focus:ring-purple-500 transition-all text-lg"
                  required
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 px-8 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg text-lg"
                >
                  Subscribe
                </button>
              </form>
              <p className="text-sm text-slate-400 mt-4">
                Join 10,000+ AI professionals. No spam, unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}