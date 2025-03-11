// pages/blog.tsx
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  imageUrl: string;
  tags: string[];
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Insights & Updates</h1>
          <p className="text-xl text-gray-600">Stay informed with the latest in AI technology and industry trends</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex gap-4 overflow-x-auto pb-2 md:pb-0">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-full ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              All
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap ${
                  filter === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Blog Posts Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map(post => (
              <Link href={`/blog/${post.id}`} key={post.id}>
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="h-48 bg-gray-200 relative">
                    {post.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-2 text-gray-900 line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex justify-between items-center">
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
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
