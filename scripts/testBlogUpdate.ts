import fetch from 'node-fetch';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load environment variables
dotenv.config();

async function findServerPort(): Promise<number> {
  const ports = [3000, 3001, 3002];
  for (const port of ports) {
    try {
      const response = await fetch(`http://localhost:${port}/api/health`);
      if (response.ok) {
        return port;
      }
    } catch (error) {
      console.log(`Port ${port} not available`);
    }
  }
  throw new Error('Could not find running Next.js server on ports 3000-3002');
}

async function testBlogUpdate() {
  console.log('Starting blog update test...');
  
  // Verify environment variables
  const token = process.env.CRON_SECRET_TOKEN;
  if (!token) {
    throw new Error('CRON_SECRET_TOKEN not found in environment variables');
  }
  console.log('Using CRON_SECRET_TOKEN:', token);

  // Clear existing blog posts
  const blogPostsPath = path.join(process.cwd(), 'data', 'blog-posts.json');
  fs.writeFileSync(blogPostsPath, '[]');
  console.log('Cleared existing blog posts');

  try {
    // Find the active server port
    console.log('Looking for active server...');
    const port = await findServerPort();
    console.log(`Found server running on port ${port}`);

    // Make the blog update request
    console.log('Sending blog update request...');
    const response = await fetch(`http://localhost:${port}/api/blog/update?token=${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Blog update failed: ${error}`);
    }

    const result = await response.json();
    console.log('\nBlog update response:', JSON.stringify(result, null, 2));

    // Verify the blog posts were created
    const posts = JSON.parse(fs.readFileSync(blogPostsPath, 'utf8'));
    console.log(`\nVerification: ${posts.length} posts in blog-posts.json`);
    
    if (posts.length > 0) {
      console.log('\nLatest post:', {
        title: posts[0].title,
        date: posts[0].date,
        category: posts[0].category,
        imageUrl: posts[0].imageUrl
      });
    }

  } catch (error) {
    console.error('\nError:', error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}

testBlogUpdate().catch(console.error); 