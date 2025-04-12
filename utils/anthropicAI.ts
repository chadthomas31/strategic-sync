import Anthropic from '@anthropic-ai/sdk';
import { CostTracker } from './costTracker';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || ''
});

// Cost per 1K tokens (as of March 2024)
const COST_PER_1K_TOKENS = 0.0003; // Claude-instant rate
const costTracker = new CostTracker('anthropic-ai', COST_PER_1K_TOKENS);

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

export async function generateWithAnthropic(title: string, content: string): Promise<string> {
  try {
    await rateLimiter.wait();

    const prompt = `Please generate a concise blog post summary based on the following title and content. 
    Focus on the key points and maintain a professional tone.
    
    Title: ${title}
    Content: ${content}`;

    const message = await anthropic.messages.create({
      model: 'claude-instant-1.2',
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }]
    });

    const generatedText = message.content[0].text;

    // Estimate token count (rough estimate: 4 chars = 1 token)
    const estimatedTokens = Math.ceil((prompt.length + generatedText.length) / 4);
    await costTracker.trackCost(estimatedTokens);

    return generatedText;
  } catch (error) {
    console.error('Error generating content with Anthropic:', error);
    throw new Error('Failed to generate content with Anthropic');
  }
} 