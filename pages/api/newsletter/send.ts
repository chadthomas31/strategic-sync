import { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

interface Subscriber {
  email: string;
  subscribedAt: string;
  status: 'active' | 'unsubscribed';
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  link?: string;
}

const SUBSCRIBERS_FILE = path.join('data', 'newsletter-subscribers.json');
const BLOG_POSTS_FILE = path.join('data', 'blog-posts.json');

// Email transporter setup
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Load subscribers
async function loadSubscribers(): Promise<Subscriber[]> {
  try {
    const data = await fs.readFile(SUBSCRIBERS_FILE, 'utf8');
    const subscribers = JSON.parse(data);
    return subscribers.filter((sub: Subscriber) => sub.status === 'active');
  } catch (error) {
    return [];
  }
}

// Load recent blog posts
async function loadRecentPosts(): Promise<BlogPost[]> {
  try {
    const data = await fs.readFile(BLOG_POSTS_FILE, 'utf8');
    const posts = JSON.parse(data);
    // Get posts from the last week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return posts
      .filter((post: BlogPost) => new Date(post.date) > oneWeekAgo)
      .slice(0, 6); // Top 6 posts
  } catch (error) {
    return [];
  }
}

// Generate newsletter HTML
function generateNewsletterHTML(posts: BlogPost[]): string {
  const postsHTML = posts.map(post => `
    <div style="margin-bottom: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px;">
      <div style="display: flex; align-items: center; margin-bottom: 10px;">
        <span style="background: #667eea; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">
          ${post.category}
        </span>
        <span style="margin-left: auto; color: #666; font-size: 12px;">
          ${new Date(post.date).toLocaleDateString()}
        </span>
      </div>
      <h3 style="margin: 0 0 10px 0; color: #333; font-size: 18px;">
        ${post.title}
      </h3>
      <p style="margin: 0; color: #666; line-height: 1.5;">
        ${post.excerpt.substring(0, 150)}...
      </p>
      <a href="https://strategicsync.com/blog/${encodeURIComponent(post.id)}" 
         style="display: inline-block; margin-top: 10px; color: #667eea; text-decoration: none; font-weight: bold;">
        Read More →
      </a>
    </div>
  `).join('');

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 28px;">Strategic Sync Weekly</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Your AI consulting insights for ${new Date().toLocaleDateString()}</p>
      </div>
      
      <div style="padding: 40px; background: white;">
        <h2 style="color: #333; margin-bottom: 20px;">This Week's Top AI Insights 🚀</h2>
        
        <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
          Here are the most important AI developments and insights from the past week, 
          curated specifically for business leaders and AI professionals.
        </p>
        
        ${postsHTML}
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 30px;">
          <h3 style="color: #333; margin-top: 0;">💡 Strategic Insight</h3>
          <p style="color: #666; margin-bottom: 0;">
            The AI landscape is evolving rapidly. Companies that stay informed and adapt quickly 
            will have a significant competitive advantage. Keep exploring, keep learning!
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 40px;">
          <a href="https://strategicsync.com/blog" 
             style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
            Explore More Articles
          </a>
        </div>
      </div>
      
      <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px;">
        <p style="margin: 0;">
          Strategic Sync | AI Consulting Excellence<br>
          <a href="mailto:info@strategicsync.com" style="color: #667eea;">info@strategicsync.com</a>
        </p>
        <p style="margin: 10px 0 0 0;">
          <a href="https://strategicsync.com/newsletter/unsubscribe" style="color: #667eea;">Unsubscribe</a>
        </p>
      </div>
    </div>
  `;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check for authorization token
  const { token } = req.query;
  if (token !== process.env.NEWSLETTER_SECRET_TOKEN) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Load subscribers and posts
    const subscribers = await loadSubscribers();
    const posts = await loadRecentPosts();

    if (subscribers.length === 0) {
      return res.status(200).json({ message: 'No active subscribers found' });
    }

    if (posts.length === 0) {
      return res.status(200).json({ message: 'No recent posts found' });
    }

    // Generate newsletter content
    const newsletterHTML = generateNewsletterHTML(posts);

    // Send to all subscribers
    const emailPromises = subscribers.map(subscriber => {
      const mailOptions = {
        from: process.env.SMTP_FROM_EMAIL,
        to: subscriber.email,
        subject: `Strategic Sync Weekly - ${new Date().toLocaleDateString()}`,
        html: newsletterHTML,
      };
      return transporter.sendMail(mailOptions);
    });

    await Promise.all(emailPromises);

    return res.status(200).json({ 
      message: `Newsletter sent successfully to ${subscribers.length} subscribers`,
      subscriberCount: subscribers.length,
      postsIncluded: posts.length
    });

  } catch (error) {
    console.error('Newsletter sending error:', error);
    return res.status(500).json({ message: 'Failed to send newsletter' });
  }
} 