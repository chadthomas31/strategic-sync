import OpenAI from 'openai';
import { CostTracker } from './costTracker';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Cost per 1K tokens (as of March 2024)
const COST_PER_1K_TOKENS = 0.002; // GPT-3.5-turbo rate
const costTracker = new CostTracker('openai', COST_PER_1K_TOKENS);

// Rate limiting configuration
const rateLimiter = {
  lastCallTime: 0,
  minInterval: 2000, // 2 seconds between calls
  async wait() {
    const now = Date.now();
    const timeSinceLastCall = now - this.lastCallTime;
    if (timeSinceLastCall < this.minInterval) {
      await new Promise(resolve => setTimeout(resolve, this.minInterval - timeSinceLastCall));
    }
    this.lastCallTime = Date.now();
  }
};

export async function generateWithOpenAI(title: string, content: string): Promise<string> {
  try {
    await rateLimiter.wait();

    const prompt = `Please generate a concise blog post summary based on the following title and content. 
    Focus on the key points and maintain a professional tone.
    
    Title: ${title}
    Content: ${content}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
      temperature: 0.7
    });

    const generatedText = completion.choices[0]?.message?.content || '';

    // Get actual token usage from the API response
    const totalTokens = completion.usage?.total_tokens || 0;
    await costTracker.trackCost(totalTokens);

    return generatedText;
  } catch (error) {
    console.error('Error generating content with OpenAI:', error);
    throw new Error('Failed to generate content with OpenAI');
  }
} 