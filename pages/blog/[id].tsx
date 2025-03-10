import { GetServerSideProps } from 'next';
import { promises as fs } from 'fs';
import path from 'path';
import { format } from 'date-fns';
import Link from 'next/link';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  date: string;
  category: string;
  imageUrl: string;
  tags: string[];
}

interface Props {
  post: BlogPost;
}

export default function BlogPost({ post }: Props) {
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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/blog" className="text-blue-600 hover:underline mb-8 block">
          ← Back to Blog
        </Link>

        {post.imageUrl && (
          <div className="relative h-96 mb-8 rounded-lg overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                {post.category}
              </span>
              <time className="text-gray-500">
                {format(new Date(post.date), 'MMMM d, yyyy')}
              </time>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
            <div className="flex gap-2 mb-8">
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

          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </article>
    </div>
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

    return {
      props: {
        post,
      },
    };
  } catch (error) {
    console.error('Error reading blog post:', error);
    return {
      notFound: true,
    };
  }
}; 