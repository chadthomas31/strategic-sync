import { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import path from 'path';
import Parser from 'rss-parser';

const RSS_FEED_URLS = [
  // --- Reliable/Working Feeds ---
  'https://venturebeat.com/category/ai/feed/', // VentureBeat AI
  'https://www.technologyreview.com/feed/', // MIT Technology Review
  'https://www.marktechpost.com/feed/', // MarkTechPost
  'https://emerj.com/feed/', // Emerj AI Research
  'https://www.analyticsinsight.net/feed/', // Analytics Insight
  // Uncomment/test these if they become available or you want to try again:
  // 'https://ai.googleblog.com/feeds/posts/default', // Google AI Blog (404 as of July 2025)
  // 'https://openai.com/blog/rss.xml', // OpenAI Blog (often works, but may rate-limit or block bots)
  // 'https://www.deepmind.com/blog/feed/basic', // Google DeepMind Blog (404 as of July 2025)
  // 'http://news.mit.edu/rss/topic/artificial-intelligence2', // MIT News - AI (may work, but slow)
  // 'https://bair.berkeley.edu/blog/feed.xml', // BAIR Lab Blog (may work, but slow)
  // 'https://www.anthropic.com/news/rss', // Anthropic News (404 as of July 2025)
  // 'https://huggingface.co/blog/feed.xml', // Hugging Face Blog (may work, but slow)
  // 'https://txt.cohere.com/rss/', // Cohere Blog (404 as of July 2025)
  // 'https://aimagazine.com/rss', // AI Magazine (403 as of July 2025)
  // 'https://aibusiness.com/rss', // AI Business (403 as of July 2025)
  // 'https://www.wired.com/feed/category/artificial-intelligence/latest/rss', // WIRED (AI) (404 as of July 2025)
  // 'https://www.zdnet.com/topic/artificial-intelligence/rss.xml', // ZDNet AI (may work, but unreliable)
  // 'https://spectrum.ieee.org/rss/ai-fulltext.xml', // IEEE Spectrum AI (404 as of July 2025)
];
const TWITTER_USERNAME = 'OpenAI'; // Example public account, change as needed
const CACHE_FILE = path.join('data', 'blog-cache.json');
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 1 week in ms

async function fetchRSSPosts() {
  const parser = new Parser();
  let allPosts: any[] = [];
  for (const url of RSS_FEED_URLS) {
    try {
      const feed = await parser.parseURL(url);
      const posts = (feed.items || []).slice(0, 5).map(item => ({
        id: item.guid || item.link,
        title: item.title,
        excerpt: item.contentSnippet || '',
        content: item.content || '',
        date: item.isoDate || item.pubDate,
        category: 'AI News',
        imageUrl: item.enclosure?.url || '',
        tags: item.categories || [],
        author: item.creator || item.author || '',
        source: feed.title || 'rss',
        link: item.link
      }));
      allPosts = allPosts.concat(posts);
    } catch (err) {
      console.error(`RSS fetch error for ${url}:`, err);
    }
  }
  return allPosts;
}

async function fetchTwitterPosts() {
  const bearer = process.env.TWITTER_BEARER_TOKEN;
  if (!bearer) return [];
  const url = `https://api.twitter.com/2/tweets/search/recent?query=from:${TWITTER_USERNAME}&tweet.fields=created_at,author_id&max_results=5`;
  const resp = await fetch(url, {
    headers: { Authorization: `Bearer ${bearer}` }
  });
  if (!resp.ok) return [];
  const data = await resp.json();
  if (!data.data) return [];
  return data.data.map((tweet: any) => ({
    id: tweet.id,
    title: tweet.text.slice(0, 60) + (tweet.text.length > 60 ? '...' : ''),
    excerpt: tweet.text,
    content: tweet.text,
    date: tweet.created_at,
    category: 'Tech Trends',
    imageUrl: '',
    tags: ['twitter'],
    author: TWITTER_USERNAME,
    source: 'twitter',
    link: `https://twitter.com/${TWITTER_USERNAME}/status/${tweet.id}`
  }));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Ensure data directory exists
    const dataDirectory = path.join('data');
    await fs.mkdir(dataDirectory, { recursive: true });

    // Try to read cache
    let cache = { timestamp: 0, posts: [] };
    try {
      const cacheContent = await fs.readFile(CACHE_FILE, 'utf8');
      cache = JSON.parse(cacheContent);
    } catch {}

    const now = Date.now();
    if (cache.posts.length > 0 && now - cache.timestamp < CACHE_DURATION) {
      return res.status(200).json(cache.posts);
    }

    // Fetch new posts
    let rssPosts: any[] = [];
    let twitterPosts: any[] = [];
    try {
      rssPosts = await fetchRSSPosts();
    } catch (err) {
      console.error('RSS fetch error:', err);
      rssPosts = [];
    }
    try {
      twitterPosts = await fetchTwitterPosts();
      if (!twitterPosts.length) {
        console.error('No Twitter posts returned. This may be due to API limits, permissions, or endpoint restrictions. Check your Bearer Token, account status, and consider applying for Elevated or Academic access if needed.');
      }
    } catch (err) {
      console.error('Twitter fetch error:', err);
      twitterPosts = [];
    }
    const posts = [...rssPosts, ...twitterPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Cache new results
    await fs.writeFile(CACHE_FILE, JSON.stringify({ timestamp: now, posts }), 'utf8');
    return res.status(200).json(posts);
  } catch (error) {
    console.error('Error aggregating blog posts:', error);
    res.status(500).json({ message: 'Error fetching blog posts' });
  }
}