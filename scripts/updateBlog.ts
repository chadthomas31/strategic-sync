import cron from 'node-cron';
import fetch from 'node-fetch';

// Run every Monday at 00:00
cron.schedule('0 0 * * 1', async () => {
  try {
    const response = await fetch('http://localhost:3000/api/blog/update', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CRON_SECRET_TOKEN}`
      }
    });

    const data = await response.json();
    console.log('Blog update completed:', data);
  } catch (error) {
    console.error('Error updating blog:', error);
  }
}); 