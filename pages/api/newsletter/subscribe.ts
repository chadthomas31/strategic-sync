import { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import path from 'path';

interface Subscriber {
  email: string;
  subscribedAt: string;
  status: 'active' | 'unsubscribed';
}

const SUBSCRIBERS_FILE = path.join('data', 'newsletter-subscribers.json');

// Load subscribers from file
async function loadSubscribers(): Promise<Subscriber[]> {
  try {
    const data = await fs.readFile(SUBSCRIBERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Save subscribers to file
async function saveSubscribers(subscribers: Subscriber[]): Promise<void> {
  // Ensure data directory exists
  const dataDir = path.dirname(SUBSCRIBERS_FILE);
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    // Validate email
    if (!email || !email.includes('@')) {
      return res.status(400).json({ message: 'Valid email is required' });
    }

    // Load existing subscribers
    const subscribers = await loadSubscribers();

    // Check if already subscribed
    const existingSubscriber = subscribers.find(sub => sub.email.toLowerCase() === email.toLowerCase());
    if (existingSubscriber) {
      if (existingSubscriber.status === 'active') {
        return res.status(400).json({ message: 'You are already subscribed to our newsletter!' });
      } else {
        // Reactivate subscription
        existingSubscriber.status = 'active';
        existingSubscriber.subscribedAt = new Date().toISOString();
        await saveSubscribers(subscribers);
        return res.status(200).json({ message: 'Welcome back! Your subscription has been reactivated.' });
      }
    }

    // Add new subscriber
    const newSubscriber: Subscriber = {
      email: email.toLowerCase(),
      subscribedAt: new Date().toISOString(),
      status: 'active',
    };

    subscribers.push(newSubscriber);
    await saveSubscribers(subscribers);

    console.log(`New subscriber added: ${email}`);

    return res.status(200).json({ 
      message: 'Successfully subscribed! You\'ll receive our weekly newsletter starting next Monday.',
      subscriberCount: subscribers.length 
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return res.status(500).json({ message: 'Failed to subscribe. Please try again.' });
  }
} 