import { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import path from 'path';
import Parser from 'rss-parser';
import OpenAI from 'openai';
import { format } from 'date-fns';

const parser = new Parser();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// RSS feeds for AI news
const RSS_FEEDS = [
  'https://blog.google/technology/ai/rss/',
  'https://blogs.microsoft.com/ai/feed/',
  'https://aws.amazon.com/blogs/machine-learning/feed/',
  'https://ai.googleblog.com/feeds/posts/default'
];

async function generateBlogPost(title: string, content: string) {
  try {
    const completion = await openai.chat.completions.create({
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
      max_tokens: 1000
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error generating blog post:', error);
    return null;
  }
}

async function fetchAndProcessFeeds() {
  const articles = [];

  for (const feed of RSS_FEEDS) {
    try {
      const feedContent = await parser.parseURL(feed);
      console.log(`Successfully fetched feed: ${feed}`);
      
      for (const item of feedContent.items.slice(0, 2)) {
        try {
          const content = await generateBlogPost(item.title || '', item.content || item.contentSnippet || '');
          
          if (content) {
            articles.push({
              id: Buffer.from(item.title || '').toString('base64'),
              title: item.title,
              excerpt: content.substring(0, 150) + '...',
              content: content,
              date: item.pubDate || new Date().toISOString(),
              category: 'AI News',
              imageUrl: item.enclosure?.url || '/images/blog/ai-default.jpg',
              tags: ['AI', 'Technology', 'Innovation'],
            });
            console.log(`Generated blog post: ${item.title}`);
          }
        } catch (error) {
          console.error(`Error processing item from feed ${feed}:`, error);
          continue; // Skip this item but continue with others
        }
      }
    } catch (error) {
      console.error(`Error processing feed ${feed}:`, error);
      continue; // Skip this feed but continue with others
    }
  }

  return articles;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Verify secret token
  const { authorization } = req.headers;
  if (authorization !== `Bearer ${process.env.CRON_SECRET_TOKEN}`) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Use relative path from project root
    const dataDirectory = path.join('data');
    const filePath = path.join(dataDirectory, 'blog-posts.json');

    // Create directory if it doesn't exist
    await fs.mkdir(dataDirectory, { recursive: true });

    // Fetch and process new articles
    const newArticles = await fetchAndProcessFeeds();

    // Read existing articles
    let existingArticles = [];
    try {
      const fileContents = await fs.readFile(filePath, 'utf8');
      existingArticles = JSON.parse(fileContents);
    } catch (error) {
      // If file doesn't exist or is invalid, start with empty array
      existingArticles = [];
    }

    // Combine articles and remove duplicates based on ID
    const allArticles = [...newArticles, ...existingArticles];
    const uniqueArticles = Array.from(
      new Map(allArticles.map(article => [article.id, article])).values()
    );

    // Sort by date (newest first)
    uniqueArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Keep only the latest 50 articles
    const trimmedArticles = uniqueArticles.slice(0, 50);

    // Save to file
    await fs.writeFile(filePath, JSON.stringify(trimmedArticles, null, 2));

    res.status(200).json({ 
      message: 'Blog posts updated successfully',
      newPosts: newArticles.length
    });
  } catch (error) {
    console.error('Error updating blog posts:', error);
    res.status(500).json({ message: 'Error updating blog posts' });
  }
} 