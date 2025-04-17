import { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import path from 'path';
import Parser from 'rss-parser';
import OpenAI from 'openai';
import { format } from 'date-fns';
import * as xml2js from 'xml2js';
import { fetchTweets } from '../../../utils/twitterFeed';
import crypto from 'crypto';
import { generateWithOpenAI } from '../../../utils/openAI';
import { generateWithGoogleAI } from '../../../utils/googleAI';
import { generateWithAnthropic } from '../../../utils/anthropicAI';
import { getCache, setCache } from '../../../utils/cache';

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

// Legacy cache functions - DEPRECATED
// These are kept for backward compatibility but should not be used in new code
// Use imported getCache and setCache from cache.ts instead
async function _getLegacyCache() {
  const cachePath = path.join(process.cwd(), 'data', 'content-cache.json');
  try {
    const cache = await fs.readFile(cachePath, 'utf8');
    return JSON.parse(cache);
  } catch (error) {
    return {};
  }
}

async function _setLegacyCache(key: string, value: string) {
  const cachePath = path.join(process.cwd(), 'data', 'content-cache.json');
  const cache = await _getLegacyCache();
  cache[key] = {
    content: value,
    timestamp: Date.now()
  };
  await fs.writeFile(cachePath, JSON.stringify(cache));
}

// Cost tracking
const costTracker = {
  dailySpent: 0,
  dailyLimit: 5, // $5 daily limit
  lastReset: new Date().toDateString(),
  
  async checkAndUpdateCost(cost: number): Promise<boolean> {
    // Reset daily spent if it's a new day
    const today = new Date().toDateString();
    if (today !== this.lastReset) {
      this.dailySpent = 0;
      this.lastReset = today;
    }
    
    // Check if adding this cost would exceed daily limit
    if (this.dailySpent + cost > this.dailyLimit) {
      return false;
    }
    
    this.dailySpent += cost;
    return true;
  }
};

// AI Provider interface
interface AIProvider {
  name: string;
  generateContent: (title: string, content: string) => Promise<string>;
  costPerToken: number;
}

// OpenAI Provider
const openAIProvider: AIProvider = {
  name: 'openai',
  costPerToken: 0.000002, // $0.002 per 1K tokens for GPT-3.5-turbo
  async generateContent(title: string, content: string) {
    if (!process.env.OPENAI_API_KEY) throw new Error('OpenAI API key not configured');
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a tech news editor. Summarize the provided content into a concise, well-structured article. Focus on key points and technical accuracy."
        },
        {
          role: "user",
          content: `Title: ${title}\n\nContent: ${content}\n\nCreate a concise summary focusing on the main points.`
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    return completion.choices[0]?.message?.content || '';
  }
};

// Google AI Provider (placeholder for now)
const googleAIProvider: AIProvider = {
  name: 'google',
  costPerToken: 0.000001, // Placeholder cost
  async generateContent(title: string, content: string) {
    // TODO: Implement Google AI integration
    throw new Error('Google AI not yet implemented');
  }
};

// Claude Provider (placeholder for now)
const claudeProvider: AIProvider = {
  name: 'claude',
  costPerToken: 0.000008, // Placeholder cost
  async generateContent(title: string, content: string) {
    // TODO: Implement Claude integration
    throw new Error('Claude not yet implemented');
  }
};

// Provider manager
const aiProviders = [openAIProvider, googleAIProvider, claudeProvider];

// Function to generate a cache key from content
function generateCacheKey(content: string): string {
  return crypto.createHash('md5').update(content).digest('hex');
}

// Function to check if cached content is still valid (less than 7 days old)
function isCacheValid(cachedData: any): boolean {
  if (!cachedData || !cachedData.timestamp) return false;
  const age = Date.now() - cachedData.timestamp;
  return age < 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
}

async function generateBlogPost(title: string, content: string): Promise<string> {
  // Check cache first
  const cacheKey = generateCacheKey(content);
  const cachedContent = await getCache(cacheKey);
  
  if (cachedContent && isCacheValid(cachedContent)) {
    console.log('Using cached content');
    return cachedContent.content;
  }

  // Try each AI provider in sequence
  const providers = [
    { name: 'OpenAI', generate: generateWithOpenAI },
    { name: 'Google AI', generate: generateWithGoogleAI },
    { name: 'Anthropic', generate: generateWithAnthropic }
  ];

  let lastError = null;
  for (const provider of providers) {
    try {
      console.log(`Attempting to generate content with ${provider.name}`);
      const generatedContent = await provider.generate(title, content);
      
      // Cache the successful result
      await setCache(cacheKey, {
        content: generatedContent,
        timestamp: Date.now(),
        provider: provider.name
      });

      return generatedContent;
    } catch (error) {
      console.error(`Error with ${provider.name}:`, error);
      lastError = error;
      continue; // Try next provider
    }
  }

  // If all providers fail, return a default message
  console.error('All providers failed:', lastError);
  return `# ${title}\n\n${content}\n\nThis content could not be processed by AI due to technical limitations.`;
}

// Rate limiting helper
const rateLimiter = {
  lastCall: 0,
  minInterval: 2000, // 2 seconds between API calls
  async wait() {
    const now = Date.now();
    const timeToWait = Math.max(0, this.lastCall + this.minInterval - now);
    if (timeToWait > 0) {
      await new Promise(resolve => setTimeout(resolve, timeToWait));
    }
    this.lastCall = Date.now();
  }
};

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
    const items = (result.rss?.channel?.[0]?.item || []).slice(0, 1); // Only process 1 post per feed

    const articles = [];
    for (const item of items) {
      try {
        const title = item.title[0];
        const content = item.description ? item.description[0] : '';
        
        // Always use default image for now
        const imageUrl = getDefaultImage(feed);

        // Wait for rate limiting
        await rateLimiter.wait();

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