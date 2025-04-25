import { GetServerSideProps } from 'next';
import { promises as fs } from 'fs';
import path from 'path';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Head from 'next/head';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  date: string;
  category: string;
  imageUrl: string;
  tags: string[];
  author?: string;
  source?: string;
  formattedDate?: string;
}

interface Props {
  post: BlogPost & { formattedDate: string };
  relatedPosts: BlogPost[];
}

function formatDate(dateStr: string): string {
  try {
    // First try parsing as ISO
    let date = parseISO(dateStr);
    
    // If invalid date, try parsing as regular date string
    if (isNaN(date.getTime())) {
      date = new Date(dateStr);
    }
    
    return format(date, 'MMMM d, yyyy');
  } catch (error) {
    console.error('Error formatting date:', dateStr);
    return 'Date unavailable';
  }
}

export default function BlogPost({ post, relatedPosts }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  if (!mounted) {
    return null;
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Post not found</h1>
          <Link href="/blog" className="text-blue-600 hover:underline">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  // Convert markdown-style headings in the content to HTML
  const processContent = (content: string) => {
    // Simple markdown to HTML conversion for headings
    const processedContent = content
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mt-6 mb-3">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold mt-5 mb-2">$1</h3>')
      .replace(/\n\n/g, '</p><p class="mb-4">');
    
    return `<p class="mb-4">${processedContent}</p>`;
  };

  return (
    <>
      <Head>
        <title>{post.title} | Strategic Sync</title>
        <meta 
          name="description" 
          content={post.content.substring(0, 160).replace(/\n/g, ' ')} 
        />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section with Image */}
        <div className="w-full h-96 bg-gray-800 relative overflow-hidden">
          {post.imageUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-full object-cover opacity-70"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-900 to-indigo-800"></div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <div className="inline-block bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium mb-4">
                {post.category}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 shadow-text">{post.title}</h1>
              <div className="flex items-center justify-center text-white gap-2">
                {post.author && (
                  <span className="font-medium">By {post.author}</span>
                )}
                {post.author && post.formattedDate && (
                  <span className="mx-2">•</span>
                )}
                <time className="text-gray-200">{post.formattedDate}</time>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8 flex justify-between items-center">
            <Link href="/blog" className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Blog
            </Link>
            <div className="flex gap-2">
              {post.tags.map(tag => (
                <span
                  key={tag}
                  className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <article className="bg-white rounded-xl shadow-md p-8">
            <div 
              className="prose prose-lg max-w-none prose-headings:text-gray-800 prose-p:text-gray-700 prose-a:text-blue-600"
              dangerouslySetInnerHTML={{ __html: processContent(post.content) }}
            />
            
            {post.source && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-gray-500 text-sm">
                  Source: {post.source}
                </p>
              </div>
            )}
          </article>
          
          {relatedPosts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-8 text-gray-800">Related Posts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedPosts.map(relatedPost => (
                  <Link href={`/blog/${relatedPost.id}`} key={relatedPost.id}>
                    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col transform hover:-translate-y-1">
                      <div className="h-40 bg-gray-200 relative">
                        {relatedPost.imageUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={relatedPost.imageUrl}
                            alt={relatedPost.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="p-4 flex-grow flex flex-col">
                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                          {relatedPost.title}
                        </h3>
                        <span className="text-sm text-gray-500 mt-auto">
                          {relatedPost.formattedDate}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <Link href="/blog" className="text-blue-600 hover:text-blue-800 transition-colors">
                ← Back to all articles
              </Link>
              <button 
                onClick={() => window.scrollTo(0, 0)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Back to top
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        .shadow-text {
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .prose a {
          text-decoration: underline;
        }
        
        .prose p {
          margin-bottom: 1.5em;
        }
      `}</style>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const dataDirectory = path.join('data');
    const filePath = path.join(dataDirectory, 'blog-posts.json');

    const fileContents = await fs.readFile(filePath, 'utf8');
    const posts = JSON.parse(fileContents);

    const post = posts.find((p: BlogPost) => p.id === params?.id);

    if (!post) {
      return {
        notFound: true,
      };
    }

    // Format the date on the server side
    const formattedPost = {
      ...post,
      formattedDate: formatDate(post.date)
    };

    // Find related posts (same category or matching tags)
    const relatedPosts = posts
      .filter((p: BlogPost) => 
        p.id !== post.id && 
        (p.category === post.category || 
          p.tags.some((tag: string) => post.tags.includes(tag)))
      )
      .slice(0, 3)
      .map((p: BlogPost) => ({
        ...p,
        formattedDate: formatDate(p.date)
      }));

    return {
      props: {
        post: formattedPost,
        relatedPosts,
      },
    };
  } catch (error) {
    console.error('Error reading blog post:', error);
    return {
      notFound: true,
    };
  }
}; 