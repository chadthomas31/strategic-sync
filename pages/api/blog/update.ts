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
import { getCache, setCache, CacheEntry } from '../../../utils/cache';

const parser = new Parser();
const xmlParser = new xml2js.Parser();

// Initialize OpenAI client only if API key is available
let openai: OpenAI | null = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
}

// RSS feeds for AI news - expanded for more diversity
const RSS_FEEDS = [
  'https://blog.google/technology/ai/rss/',
  'https://blogs.microsoft.com/ai/feed/',
  'https://aws.amazon.com/blogs/machine-learning/feed/',
  'https://www.forwardfuture.ai/rss.xml',
  'https://openai.com/blog/rss.xml',
  'https://ai.meta.com/blog/rss/',
  'https://machinelearningmastery.com/feed/',
  'https://jack-clark.net/feed/', // Import AI newsletter
  'https://www.technologyreview.com/topic/artificial-intelligence/feed/'
];

// Enhanced default images with high-quality images
const defaultImages = {
  'blog.google': '/images/blog/google-ai.png',
  'blogs.microsoft.com': '/images/blog/microsoft-ai.png',
  'aws.amazon.com': '/images/blog/aws-ai.png',
  'forwardfuture.ai': '/images/blog/forward-future.png',
  'twitter.com': '/images/blog/twitter.png',
  'openai.com': '/images/blog/openai.png',
  'ai.meta.com': '/images/blog/meta-ai.png',
  'machinelearningmastery.com': '/images/blog/ml-mastery.png',
  'jack-clark.net': '/images/blog/import-ai.png',
  'technologyreview.com': '/images/blog/mit-tech-review.png',
  'default': '/images/blog/ai-default.png'
};

// Expanded categories for better classification
const CATEGORIES = {
  'blog.google': 'Tech Trends',
  'blogs.microsoft.com': 'Industry Updates',
  'aws.amazon.com': 'Tech Trends',
  'forwardfuture.ai': 'AI News',
  'twitter.com': 'AI News',
  'openai.com': 'AI News',
  'ai.meta.com': 'Industry Updates',
  'machinelearningmastery.com': 'Tutorials',
  'jack-clark.net': 'AI News',
  'technologyreview.com': 'Tech Trends',
  'default': 'AI News'
};

// Add authentication for Forward Future AI
const forwardFutureAuth = {
  username: 'chad.mccluskey@gmail.com',
  password: 'Puzzling*Sprig7*Manager'
};

function getDefaultImage(feedUrl: string): string {
  try {
    const hostname = new URL(feedUrl).hostname;
    return (defaultImages as any)[hostname] || defaultImages['default'];
  } catch (e) {
    return defaultImages['default'];
  }
}

function getCategory(feedUrl: string): string {
  try {
    const hostname = new URL(feedUrl).hostname;
    return (CATEGORIES as any)[hostname] || CATEGORIES['default'];
  } catch (e) {
    return CATEGORIES['default'];
  }
}

function generateTags(title: string, category: string): string[] {
  // Base tags that should be included in all posts
  const baseTags = ['AI', 'Technology'];
  
  // Add category-specific tags
  if (category === 'AI News') {
    return [...baseTags, 'Innovation', 'Research'];
  } else if (category === 'Industry Updates') {
    return [...baseTags, 'Business', 'Innovation'];
  } else if (category === 'Tech Trends') {
    return [...baseTags, 'Trends', 'Future'];
  } else if (category === 'Tutorials') {
    return [...baseTags, 'Learning', 'Guide'];
  } else if (category === 'Use Cases') {
    return [...baseTags, 'Applications', 'Solutions'];
  }
  
  // Add title-specific tags
  const titleLower = title.toLowerCase();
  if (titleLower.includes('openai') || titleLower.includes('gpt')) {
    baseTags.push('OpenAI');
  } else if (titleLower.includes('google') || titleLower.includes('gemini')) {
    baseTags.push('Google');
  } else if (titleLower.includes('microsoft') || titleLower.includes('azure')) {
    baseTags.push('Microsoft');
  } else if (titleLower.includes('meta') || titleLower.includes('llama')) {
    baseTags.push('Meta');
  } else if (titleLower.includes('healthcare') || titleLower.includes('medical')) {
    baseTags.push('Healthcare');
  } else if (titleLower.includes('finance') || titleLower.includes('banking')) {
    baseTags.push('Finance');
  }
  
  return baseTags;
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
    if (!openai) throw new Error('OpenAI API key not configured');
    
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

// Function to check if cached content is still valid
function isCacheValid(cachedData: any): boolean {
  const cacheAge = Date.now() - cachedData.timestamp;
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours
  return cacheAge < maxAge;
}

async function generateBlogPost(title: string, content: string): Promise<string> {
  // Generate cache key
  const cacheKey = generateCacheKey(title + content);
  
  // Try to get cached content
  try {
    const cachedData = await getCache(cacheKey);
    if (cachedData && isCacheValid(cachedData)) {
      console.log(`Using cached content for: ${title}`);
      return cachedData.content;
    }
  } catch (error) {
    console.log('Cache miss or error, generating new content');
  }

  // Try AI providers in order
  for (const provider of aiProviders) {
    try {
      console.log(`Trying ${provider.name} for: ${title}`);
      const generatedContent = await provider.generateContent(title, content);
      
      if (generatedContent && generatedContent.trim().length > 0) {
        // Cache the generated content
        try {
          await setCache(cacheKey, {
            content: generatedContent,
            timestamp: Date.now(),
            provider: provider.name
          });
        } catch (error) {
          console.warn('Failed to cache content:', error);
        }
        
        return generatedContent;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.log(`${provider.name} failed for ${title}:`, errorMessage);
      continue;
    }
  }

  // Fallback: return original content if all AI providers fail
  console.log(`All AI providers failed for ${title}, using original content`);
  return content;
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
    
    // Process 3 posts per feed
    const items = (result.rss?.channel?.[0]?.item || []).slice(0, 3);

    const articles = [];
    for (const item of items) {
      try {
        const title = item.title[0];
        const content = item.description ? item.description[0] : '';
        
        // Always use default image for now
        const imageUrl = getDefaultImage(feed);
        
        // Get category for this feed
        const category = getCategory(feed);
        
        // Generate tags based on title and category
        const tags = generateTags(title, category);

        // Try to generate enhanced content, fallback to original if AI fails
        let generatedContent;
        try {
          await rateLimiter.wait();
          generatedContent = await generateBlogPost(title, content);
        } catch (error) {
          console.log(`AI generation failed for ${title}, using original content`);
          generatedContent = content;
        }

        if (!generatedContent) {
          console.log(`Skipping post "${title}" due to null generated content`);
          continue;
        }

        const id = Buffer.from(title).toString('base64');
        const date = item.pubDate ? item.pubDate[0] : new Date().toUTCString();
        
        const article = {
          id,
          title,
          excerpt: (generatedContent as string).substring(0, 200) + '...',
          content: generatedContent,
          date,
          category,
          imageUrl,
          tags,
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
  // Support both POST (from cron) and GET (for manual triggering)
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Check token from query parameter
  const { token } = req.query;
  const isManualRun = req.method === 'GET' && process.env.NODE_ENV === 'development';
  
  if (!isManualRun && (!token || token !== process.env.CRON_SECRET_TOKEN)) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    console.log(`Starting blog update process at ${new Date().toISOString()}`);
    
    // Process RSS feeds
    const articles = [];
    for (const feed of RSS_FEEDS) {
      const feedArticles = await processFeed(feed);
      articles.push(...feedArticles);
      // Add delay between feeds
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Fetch tweets (only if Twitter credentials are available)
    let tweets = [];
    if (process.env.TWITTER_API_KEY) {
      try {
        tweets = await fetchTweets();
        articles.push(...tweets);
      } catch (error) {
        console.error('Error fetching tweets:', error);
      }
    }

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

    // Limit to a reasonable number (e.g., 100 most recent posts)
    const limitedArticles = uniqueArticles.slice(0, 100);

    // Save to file
    await fs.writeFile(blogPostsPath, JSON.stringify(limitedArticles, null, 2));

    console.log(`Blog update completed successfully. Total articles: ${limitedArticles.length}`);
    console.log(`New articles added: ${articles.length}`);

    return res.status(200).json({
      success: true,
      message: 'Blog updated successfully',
      totalArticles: limitedArticles.length,
      newArticles: articles.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error updating blog:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return res.status(500).json({
      success: false,
      message: 'Error updating blog',
      error: errorMessage
    });
  }
} 
