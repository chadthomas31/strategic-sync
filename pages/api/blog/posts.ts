import { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Use relative path from project root
    const dataDirectory = path.join('data');
    const filePath = path.join(dataDirectory, 'blog-posts.json');

    // Create directory if it doesn't exist
    await fs.mkdir(dataDirectory, { recursive: true });

    let posts = [];
    try {
      const fileContents = await fs.readFile(filePath, 'utf8');
      posts = JSON.parse(fileContents);
    } catch (error) {
      // If file doesn't exist or is invalid, return empty array
      posts = [];
    }

    res.status(200).json(posts);
  } catch (error) {
    console.error('Error reading blog posts:', error);
    res.status(500).json({ message: 'Error fetching blog posts' });
  }
} 