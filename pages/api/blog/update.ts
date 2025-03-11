import { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import path from 'path';
import Parser from 'rss-parser';
import OpenAI from 'openai';
import { format } from 'date-fns';
import * as xml2js from 'xml2js';
import { fetchTweets } from '../../../utils/twitterFeed';

const parser = new Parser();
const xmlParser = new xml2js.Parser();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// RSS feeds for AI news
const RSS_FEEDS = [
  'https://blog.google/technology/ai/rss/',
  'https://blogs.microsoft.com/ai/feed/',
  'https://aws.amazon.com/blogs/machine-learning/feed/',
  'https://www.forwardfuture.ai/rss.xml'  // Forward Future AI feed
];

const defaultImages = {
  'blog.google': '/images/blog/google-ai.png',
  'blogs.microsoft.com': '/images/blog/microsoft-ai.png',
  'aws.amazon.com': '/images/blog/aws-ai.png',
  'forwardfuture.ai': '/images/blog/forward-future.png',
  'twitter.com': '/images/blog/twitter.png',
  'default': '/images/blog/ai-default.png'
};

// Add authentication for Forward Future AI
const forwardFutureAuth = {
  username: 'chad.mccluskey@gmail.com',
  password: 'Puzzling*Sprig7*Manager'
};

function getDefaultImage(feedUrl: string): string {
  try {
    const hostname = new URL(feedUrl).hostname;
    return defaultImages[hostname] || defaultImages['default'];
  } catch (e) {
    return defaultImages['default'];
  }
}

function sanitizeImageUrl(url: string, feedUrl: string): string {
  // If URL is already a local path, return it
  if (url.startsWith('/')) return url;

  try {
    // Check if URL is valid
    new URL(url);
    
    // Handle Google's webp images
    if (url.includes('storage.googleapis.com') && url.endsWith('.webp')) {
      return getDefaultImage(feedUrl);
    }

    // Handle other special cases
    if (url.includes('blogs.microsoft.com/uploads')) {
      return defaultImages['blogs.microsoft.com'];
    }

    return url;
  } catch (e) {
    // If URL is invalid, return default image
    return getDefaultImage(feedUrl);
  }
}

async function generateBlogPost(title: string, content: string) {
  if (!process.env.OPENAI_API_KEY) {
    console.log('No OpenAI API key found, using default content generation');
    return `# ${title}\n\n${content}\n\nThis is a default blog post generated without OpenAI API. The original content has been preserved and formatted for readability.`;
  }

  try {
    // Validate API key format
    if (!process.env.OPENAI_API_KEY.startsWith('sk-')) {
      console.error('Invalid OpenAI API key format');
      throw new Error('Invalid API key format');
    }

    // Use Promise.race for timeout
    const completionPromise = openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an AI technology expert writing a blog post. Convert the provided content into an engaging, well-structured article with proper formatting and technical accuracy."
        },
        {
          role: "user",
          content: `Please write a blog post about: ${title}\n\nBased on this content:\n${content}`
        }
      ],
      max_tokens: 1000,
      temperature: 0.7
    });

    const completion = await Promise.race([
      completionPromise,
      new Promise((_, reject) => setTimeout(() => reject(new Error('OpenAI API timeout')), 120000))
    ]) as Awaited<typeof completionPromise>;

    if (!completion.choices[0]?.message?.content) {
      throw new Error('No content generated');
    }

    return completion.choices[0].message.content;
  } catch (error: any) {
    console.error('Error generating blog post:', error);
    if (error.code === 'invalid_api_key') {
      return `# ${title}\n\n${content}\n\nThis is a default blog post. The original content has been preserved due to an API key error.`;
    }
    // Fallback to default content if OpenAI fails
    return `# ${title}\n\n${content}\n\nThis is a default blog post. The original content has been preserved due to an error in the AI processing.`;
  }
}

async function processFeed(feed: string) {
  try {
    console.log(`Processing feed: ${feed}`);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    // Add authentication headers for Forward Future AI
    const headers: Record<string, string> = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    };

    if (feed.includes('forwardfuture.ai')) {
      const authString = Buffer.from(`${forwardFutureAuth.username}:${forwardFutureAuth.password}`).toString('base64');
      headers['Authorization'] = `Basic ${authString}`;
    }

    const response = await fetch(feed, {
      signal: controller.signal,
      headers
    });

    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Status code ${response.status}`);
    }

    const xml = await response.text();
    const result = await xmlParser.parseStringPromise(xml);
    const items = (result.rss?.channel?.[0]?.item || []).slice(0, 2); // Only process 2 posts per feed

    const articles = [];
    for (const item of items) {
      try {
        const title = item.title[0];
        const content = item.description ? item.description[0] : '';
        
        // Always use default image for now
        const imageUrl = getDefaultImage(feed);

        // Generate blog post with increased timeout (120 seconds)
        const generatedPost = await Promise.race([
          generateBlogPost(title, content),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Blog post generation timeout')), 120000))
        ]);

        if (!generatedPost) {
          console.log(`Skipping post "${title}" due to null generated content`);
          continue;
        }

        const id = Buffer.from(title).toString('base64');
        const date = item.pubDate ? item.pubDate[0] : new Date().toUTCString();
        
        const article = {
          id,
          title,
          excerpt: (generatedPost as string).substring(0, 200) + '...',
          content: generatedPost,
          date,
          category: 'AI News',
          imageUrl,
          tags: ['AI', 'Technology', 'Innovation'],
          source: new URL(feed).hostname
        };

        articles.push(article);
        console.log(`Generated blog post: ${title}`);
        
        // Add a longer delay between posts to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 5000));
      } catch (error) {
        console.error(`Error processing item from feed ${feed}:`, error);
        continue;
      }
    }
    return articles;
  } catch (error) {
    console.error(`Error processing feed ${feed}:`, error);
    return [];
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Check token from query parameter
  const { token } = req.query;
  if (!token || token !== process.env.CRON_SECRET_TOKEN) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Process RSS feeds
    const articles = [];
    for (const feed of RSS_FEEDS) {
      const feedArticles = await processFeed(feed);
      articles.push(...feedArticles);
      // Add delay between feeds
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Fetch tweets
    const tweets = await fetchTweets();
    articles.push(...tweets);

    // Read existing articles
    const blogPostsPath = path.join(process.cwd(), 'data', 'blog-posts.json');
    let existingArticles = [];
    try {
      const fileContents = await fs.readFile(blogPostsPath, 'utf8');
      existingArticles = JSON.parse(fileContents);
    } catch (error) {
      console.warn('No existing articles found or invalid JSON');
    }

    // Combine new and existing articles, remove duplicates
    const allArticles = [...articles, ...existingArticles];
    const uniqueArticles = allArticles.filter((article, index, self) =>
      index === self.findIndex((a) => a.id === article.id)
    );

    // Sort by date descending
    uniqueArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Save to file
    await fs.writeFile(blogPostsPath, JSON.stringify(uniqueArticles, null, 2));

    return res.status(200).json({
      message: 'Blog posts updated successfully',
      newPosts: articles.length,
      totalPosts: uniqueArticles.length
    });
  } catch (error) {
    console.error('Error updating blog posts:', error);
    return res.status(500).json({ message: 'Error updating blog posts', error: error instanceof Error ? error.message : 'Unknown error' });
  }
} 