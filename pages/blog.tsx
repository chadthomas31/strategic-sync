import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import { motion, useInView } from 'framer-motion';
import { FiSearch, FiClock, FiUser, FiCalendar, FiArrowRight, FiExternalLink, FiTag, FiBookOpen, FiTrendingUp, FiEdit3, FiCpu } from 'react-icons/fi';
import SEO from '../components/SEO';

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
  link?: string;
  source?: string;
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

// Generate a gradient based on the category
const getCategoryGradient = (category: string) => {
  const gradients: Record<string, string> = {
    'AI News': 'from-[#00f0ff] to-[#00b8d4]',
    'Industry Updates': 'from-[#ffd700] to-[#ff6b35]',
    'Tech Trends': 'from-[#00f0ff] to-[#ffd700]',
    'Use Cases': 'from-[#ffd700] to-[#ff6b35]',
    'Tutorials': 'from-[#00f0ff] to-[#00b8d4]',
  };
  return gradients[category] || 'from-[#00f0ff] to-[#00b8d4]';
};

// Placeholder component for when no image is available
const PlaceholderImage = ({ category }: { category: string }) => (
  <div className={`w-full h-full bg-gradient-to-br ${getCategoryGradient(category)} flex items-center justify-center`}>
    <div className="text-center p-4">
      <FiBookOpen className="w-10 h-10 text-[#0a0a0a] mx-auto mb-2" />
      <div className="text-sm font-medium text-[#0a0a0a] opacity-80">{category}</div>
    </div>
  </div>
);

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [mounted, setMounted] = useState(false);
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [newsletterMessage, setNewsletterMessage] = useState('');

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

  // Newsletter subscription handler
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      setNewsletterStatus('error');
      setNewsletterMessage('Please enter a valid email address');
      return;
    }

    setNewsletterStatus('loading');
    setNewsletterMessage('');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newsletterEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setNewsletterStatus('success');
        setNewsletterMessage(data.message);
        setNewsletterEmail('');
      } else {
        setNewsletterStatus('error');
        setNewsletterMessage(data.message || 'Failed to subscribe');
      }
    } catch (error) {
      console.error('Newsletter error:', error);
      setNewsletterStatus('error');
      setNewsletterMessage('Failed to subscribe. Please try again.');
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      <SEO
        title="Blog | Strategic Sync - AI Insights & Updates"
        description="Stay informed with the latest in AI technology and industry trends"
        path="/blog"
      />

      <div className="bg-[#0a0a0a] min-h-screen">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00f0ff]/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#ffd700]/10 rounded-full blur-[100px]" />
          </div>

          <div className="container relative z-10">
            <AnimatedSection className="text-center max-w-4xl mx-auto">
              <span className="text-[#00f0ff] text-sm font-medium uppercase tracking-widest mb-4 block">
                AI Insights
              </span>
              <h1 className="heading-display mb-6">
                AI Knowledge <span className="text-gradient-cyan">Hub</span>
              </h1>
              <p className="text-xl text-[#a0a0a0] max-w-2xl mx-auto mb-10">
                Stay ahead with expert insights, industry trends, and practical guidance
                on AI implementation.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 max-w-xl mx-auto">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gradient-cyan">{posts.length}+</div>
                  <div className="text-[#666] text-sm">Articles</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gradient-gold">50K+</div>
                  <div className="text-[#666] text-sm">Readers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#00f0ff]">Weekly</div>
                  <div className="text-[#666] text-sm">Updates</div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        <section className="section section-mesh pt-0">
          <div className="container relative z-10">
            {/* Featured Post */}
            {featuredPost && !loading && (
              <AnimatedSection className="mb-16">
                <Link href={`/blog/${encodeURIComponent(featuredPost.id)}`}>
                  <div className="group relative rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.06)] bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] hover:border-[rgba(0,240,255,0.2)] transition-all">
                    <div className="flex flex-col lg:flex-row">
                      <div className="lg:w-1/2 h-64 lg:h-auto relative overflow-hidden">
                        {featuredPost.imageUrl ? (
                          <Image
                            src={featuredPost.imageUrl}
                            alt={featuredPost.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <PlaceholderImage category={featuredPost.category} />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/60 to-transparent" />
                        <div className="absolute top-6 left-6">
                          <span className="bg-gradient-to-r from-[#00f0ff] to-[#00b8d4] text-[#0a0a0a] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                            Featured
                          </span>
                        </div>
                        <div className="absolute bottom-6 left-6">
                          <span className="bg-[rgba(0,0,0,0.5)] backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                            {featuredPost.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-8 lg:p-10 lg:w-1/2 flex flex-col justify-between">
                        <div>
                          <h2 className="text-2xl lg:text-3xl font-bold mb-4 group-hover:text-[#00f0ff] transition-colors leading-tight">
                            {featuredPost.title}
                          </h2>
                          <p className="text-[#a0a0a0] mb-6 leading-relaxed">
                            {featuredPost.excerpt
                              ? featuredPost.excerpt.replace(/[#*]/g, '').substring(0, 200) + '...'
                              : featuredPost.content
                                ? featuredPost.content.replace(/[#*]/g, '').substring(0, 200) + '...'
                                : 'No summary available.'}
                          </p>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center gap-6 text-sm text-[#666]">
                            <div className="flex items-center gap-2">
                              <FiCalendar className="w-4 h-4" />
                              {featuredPost.formattedDate}
                            </div>
                            <div className="flex items-center gap-2">
                              <FiClock className="w-4 h-4" />
                              {getReadingTime(featuredPost.content)} min read
                            </div>
                            {featuredPost.author && (
                              <div className="flex items-center gap-2">
                                <FiUser className="w-4 h-4" />
                                {featuredPost.author}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                              {featuredPost.tags.slice(0, 3).map(tag => (
                                <span
                                  key={tag}
                                  className="bg-[rgba(0,240,255,0.08)] text-[#00f0ff] px-3 py-1 rounded-full text-xs font-medium border border-[rgba(0,240,255,0.1)]"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <span className="text-[#00f0ff] font-medium group-hover:translate-x-2 transition-transform flex items-center gap-2 text-sm">
                              Read Article <FiArrowRight />
                            </span>
                          </div>
                          {featuredPost.link && (
                            <div className="mt-4 pt-3 border-t border-[rgba(255,255,255,0.06)]">
                              <a
                                href={featuredPost.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00f0ff] to-[#00b8d4] text-[#0a0a0a] px-6 py-2.5 rounded-xl font-medium hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all text-sm"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <FiExternalLink className="w-4 h-4" />
                                Read Original Article
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            )}

            {/* Search and Filter */}
            <AnimatedSection delay={0.1} className="mb-12">
              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-2xl border border-[rgba(255,255,255,0.06)] p-6">
                <div className="flex flex-col gap-6">
                  {/* Search Box */}
                  <div className="w-full max-w-md mx-auto">
                    <div className="relative">
                      <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666] w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search articles..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-12 py-3 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-xl text-white placeholder-[#666] focus:border-[rgba(0,240,255,0.3)] focus:outline-none focus:ring-1 focus:ring-[rgba(0,240,255,0.2)] transition-all"
                      />
                    </div>
                  </div>

                  {/* Category Tabs */}
                  <div className="flex flex-wrap gap-3 justify-center">
                    <button
                      onClick={() => setFilter('all')}
                      className={`px-5 py-2 rounded-xl transition-all font-medium text-sm ${
                        filter === 'all'
                          ? 'bg-gradient-to-r from-[#00f0ff] to-[#00b8d4] text-[#0a0a0a] shadow-[0_0_20px_rgba(0,240,255,0.2)]'
                          : 'bg-[rgba(255,255,255,0.04)] text-[#666] hover:text-white hover:bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.06)]'
                      }`}
                    >
                      All Posts
                    </button>
                    {categories.map(category => (
                      <button
                        key={category}
                        onClick={() => setFilter(category)}
                        className={`px-5 py-2 rounded-xl whitespace-nowrap transition-all font-medium text-sm ${
                          filter === category
                            ? 'bg-gradient-to-r from-[#00f0ff] to-[#00b8d4] text-[#0a0a0a] shadow-[0_0_20px_rgba(0,240,255,0.2)]'
                            : 'bg-[rgba(255,255,255,0.04)] text-[#666] hover:text-white hover:bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.06)]'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Blog Posts Grid */}
            {loading ? (
              <div className="flex justify-center items-center py-24">
                <div className="flex items-center gap-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00f0ff]"></div>
                  <span className="text-[#666] font-medium">Loading articles...</span>
                </div>
              </div>
            ) : filteredPosts.length === 0 ? (
              /* Premium Empty State */
              <AnimatedSection>
                <div className="text-center py-24">
                  <div className="relative inline-block mb-8">
                    <div className="absolute inset-0 bg-[#00f0ff]/10 rounded-full blur-2xl" />
                    <div className="relative w-24 h-24 bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-[rgba(255,255,255,0.08)] rounded-full flex items-center justify-center">
                      <FiEdit3 className="w-10 h-10 text-[#00f0ff]" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">
                    {searchTerm || filter !== 'all' ? 'No articles found' : 'Fresh Content Coming Soon'}
                  </h3>
                  <p className="text-[#666] mb-8 max-w-md mx-auto leading-relaxed">
                    {searchTerm || filter !== 'all'
                      ? 'Try adjusting your search or filter criteria to find what you are looking for.'
                      : 'Our team is crafting expert insights on AI strategy, implementation, and industry trends. Subscribe below to be the first to know.'}
                  </p>
                  {(searchTerm || filter !== 'all') && (
                    <motion.button
                      onClick={() => {
                        setSearchTerm('');
                        setFilter('all');
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      className="btn-primary inline-flex"
                    >
                      Reset Filters
                      <FiArrowRight className="ml-2" />
                    </motion.button>
                  )}
                  {!searchTerm && filter === 'all' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-3xl mx-auto">
                      {[
                        { icon: <FiTrendingUp className="w-6 h-6" />, title: 'Industry Trends', desc: 'Analysis of emerging AI patterns shaping business' },
                        { icon: <FiBookOpen className="w-6 h-6" />, title: 'How-To Guides', desc: 'Step-by-step AI implementation playbooks' },
                        { icon: <FiCpu className="w-6 h-6" />, title: 'Case Studies', desc: 'Real results from our client engagements' },
                      ].map((item, i) => (
                        <motion.div
                          key={item.title}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 + i * 0.1 }}
                          className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-[rgba(255,255,255,0.06)] rounded-2xl p-6 text-center"
                        >
                          <div className="w-12 h-12 rounded-xl bg-[rgba(0,240,255,0.1)] flex items-center justify-center mx-auto mb-3 text-[#00f0ff]">
                            {item.icon}
                          </div>
                          <h4 className="font-medium mb-1 text-sm">{item.title}</h4>
                          <p className="text-[#666] text-xs leading-relaxed">{item.desc}</p>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </AnimatedSection>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post, index) => {
                  const CardWrapper = post.link ? 'a' : Link;
                  const cardProps = post.link
                    ? { href: post.link, target: '_blank', rel: 'noopener noreferrer' }
                    : { href: `/blog/${encodeURIComponent(post.id)}` };

                  return (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: (index % 3) * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <CardWrapper {...cardProps as any} className="block group">
                        <article className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-2xl border border-[rgba(255,255,255,0.06)] hover:border-[rgba(0,240,255,0.2)] transition-all duration-500 h-full flex flex-col overflow-hidden">
                          <div className="h-48 overflow-hidden relative">
                            {post.imageUrl ? (
                              <Image
                                src={post.imageUrl}
                                alt={post.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                            ) : (
                              <PlaceholderImage category={post.category} />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute top-4 left-4">
                              <span className="bg-[rgba(0,0,0,0.5)] backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
                                {post.category}
                              </span>
                            </div>
                            {post.link && (
                              <div className="absolute top-4 right-4">
                                <span className="bg-[rgba(0,240,255,0.2)] backdrop-blur-sm text-[#00f0ff] px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                  <FiExternalLink className="w-3 h-3" /> External
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="p-6 flex-grow flex flex-col">
                            <h2 className="text-lg font-bold mb-3 group-hover:text-[#00f0ff] transition-colors leading-tight">
                              {post.title}
                            </h2>
                            <p className="text-[#a0a0a0] text-sm mb-4 flex-grow leading-relaxed">
                              {post.excerpt
                                ? post.excerpt.replace(/[#*]/g, '').substring(0, 150) + '...'
                                : post.content
                                  ? post.content.replace(/[#*]/g, '').substring(0, 150) + '...'
                                  : 'No summary available.'}
                            </p>
                            <div className="mt-auto space-y-4">
                              <div className="flex items-center gap-4 text-xs text-[#666]">
                                <div className="flex items-center gap-1">
                                  <FiCalendar className="w-3 h-3" />
                                  {post.formattedDate}
                                </div>
                                <div className="flex items-center gap-1">
                                  <FiClock className="w-3 h-3" />
                                  {getReadingTime(post.content)}m read
                                </div>
                              </div>
                              <div className="flex items-center justify-between pt-4 border-t border-[rgba(255,255,255,0.06)]">
                                <div className="flex gap-2">
                                  {post.tags.slice(0, 2).map(tag => (
                                    <span
                                      key={tag}
                                      className="bg-[rgba(255,255,255,0.04)] text-[#666] px-2 py-1 rounded-lg text-xs border border-[rgba(255,255,255,0.06)]"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                                <div className="text-[#00f0ff] group-hover:translate-x-1 transition-transform">
                                  {post.link ? <FiExternalLink className="w-4 h-4" /> : <FiArrowRight className="w-4 h-4" />}
                                </div>
                              </div>
                            </div>
                          </div>
                        </article>
                      </CardWrapper>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Newsletter Sign-up */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00f0ff]/5 rounded-full blur-[120px]" />
          </div>

          <div className="container relative z-10">
            <AnimatedSection className="max-w-2xl mx-auto text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[#00f0ff] to-[#00b8d4] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FiBookOpen className="w-7 h-7 text-[#0a0a0a]" />
              </div>
              <h2 className="heading-xl mb-4">
                Stay <span className="text-gradient-cyan">Updated</span>
              </h2>
              <p className="text-lg text-[#a0a0a0] mb-8 max-w-lg mx-auto leading-relaxed">
                Subscribe to receive the latest AI insights, industry trends, and expert
                analysis directly to your inbox.
              </p>

              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
                <input
                  type="email"
                  placeholder="Your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-grow px-6 py-4 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-xl text-white placeholder-[#666] focus:border-[rgba(0,240,255,0.3)] focus:outline-none focus:ring-1 focus:ring-[rgba(0,240,255,0.2)] transition-all"
                  required
                  disabled={newsletterStatus === 'loading'}
                />
                <motion.button
                  type="submit"
                  disabled={newsletterStatus === 'loading'}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {newsletterStatus === 'loading' ? 'Subscribing...' : 'Subscribe'}
                </motion.button>
              </form>

              {newsletterMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-4 p-3 rounded-lg text-sm ${
                    newsletterStatus === 'success'
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}
                >
                  {newsletterMessage}
                </motion.div>
              )}

              <p className="text-xs text-[#666] mt-4">
                Join 10,000+ AI professionals. No spam, unsubscribe anytime.
              </p>
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
}
