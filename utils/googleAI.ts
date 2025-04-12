import { GoogleGenerativeAI } from '@google/generative-ai';
import { CostTracker } from './costTracker';

// Initialize Google AI
const googleAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');
const model = googleAI.getGenerativeModel({ model: 'gemini-pro' });

// Cost per 1K tokens (as of March 2024)
const COST_PER_1K_TOKENS = 0.0005;
const costTracker = new CostTracker('google-ai', COST_PER_1K_TOKENS);

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

export async function generateWithGoogleAI(title: string, content: string): Promise<string> {
  try {
    await rateLimiter.wait();

    const prompt = `Please generate a concise blog post summary based on the following title and content. 
    Focus on the key points and maintain a professional tone.
    
    Title: ${title}
    Content: ${content}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedText = response.text();

    // Estimate token count (rough estimate: 4 chars = 1 token)
    const estimatedTokens = Math.ceil((prompt.length + generatedText.length) / 4);
    await costTracker.trackCost(estimatedTokens);

    return generatedText;
  } catch (error) {
    console.error('Error generating content with Google AI:', error);
    throw new Error('Failed to generate content with Google AI');
  }
} 