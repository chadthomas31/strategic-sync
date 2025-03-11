import { TwitterApi } from 'twitter-api-v2';

// Initialize Twitter client
const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY || '',
  appSecret: process.env.TWITTER_API_SECRET || '',
  accessToken: process.env.TWITTER_ACCESS_TOKEN || '',
  accessSecret: process.env.TWITTER_ACCESS_SECRET || '',
});

export async function fetchTweets() {
  try {
    if (!process.env.TWITTER_USERNAME) {
      console.warn('Twitter username not configured');
      return [];
    }

    const username = process.env.TWITTER_USERNAME;
    const user = await twitterClient.v2.userByUsername(username);
    
    if (!user.data) {
      throw new Error('User not found');
    }

    const tweets = await twitterClient.v2.userTimeline(user.data.id, {
      exclude: ['replies', 'retweets'],
      max_results: 10,
      'tweet.fields': ['created_at', 'text', 'entities'],
    });

    const tweetArray = [];
    for await (const tweet of tweets) {
      tweetArray.push({
        id: Buffer.from(`twitter-${tweet.id}`).toString('base64'),
        title: tweet.text.split('\n')[0] || 'Tweet',
        excerpt: tweet.text,
        content: tweet.text,
        date: new Date(tweet.created_at || '').toISOString(),
        category: 'Twitter Updates',
        imageUrl: '/images/blog/twitter.png',
        tags: ['Twitter', 'Updates'],
        source: 'twitter.com'
      });
    }

    return tweetArray;
  } catch (error) {
    console.error('Error fetching tweets:', error);
    return [];
  }
} 