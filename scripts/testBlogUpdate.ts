import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function testBlogUpdate() {
  try {
    console.log('Starting blog update test...');
    
    const response = await fetch('http://localhost:3000/api/blog/update', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CRON_SECRET_TOKEN}`
      }
    });

    const data = await response.json();
    console.log('Blog update response:', data);
  } catch (error) {
    console.error('Error during blog update test:', error);
  }
}

// Run the test
testBlogUpdate(); 