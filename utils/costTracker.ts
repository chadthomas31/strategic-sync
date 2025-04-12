interface DailyCost {
  date: string;
  totalTokens: number;
  totalCost: number;
}

interface CostLog {
  [provider: string]: {
    [date: string]: DailyCost;
  };
}

export class CostTracker {
  private costLog: CostLog = {};
  private readonly provider: string;
  private readonly costPer1kTokens: number;
  private readonly dailyLimit: number;

  constructor(provider: string, costPer1kTokens: number, dailyLimit: number = 5) {
    this.provider = provider;
    this.costPer1kTokens = costPer1kTokens;
    this.dailyLimit = dailyLimit;
    this.loadCostLog();
  }

  private loadCostLog() {
    try {
      const fs = require('fs');
      const path = require('path');
      const logPath = path.join(process.cwd(), 'data', 'cost-log.json');
      
      if (fs.existsSync(logPath)) {
        this.costLog = JSON.parse(fs.readFileSync(logPath, 'utf8'));
      }
    } catch (error) {
      console.error('Error loading cost log:', error);
      this.costLog = {};
    }
  }

  private saveCostLog() {
    try {
      const fs = require('fs');
      const path = require('path');
      const logPath = path.join(process.cwd(), 'data', 'cost-log.json');
      
      // Ensure the data directory exists
      const dataDir = path.join(process.cwd(), 'data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      fs.writeFileSync(logPath, JSON.stringify(this.costLog, null, 2));
    } catch (error) {
      console.error('Error saving cost log:', error);
    }
  }

  private getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  private getDailyCost(date: string): DailyCost {
    if (!this.costLog[this.provider]) {
      this.costLog[this.provider] = {};
    }

    if (!this.costLog[this.provider][date]) {
      this.costLog[this.provider][date] = {
        date,
        totalTokens: 0,
        totalCost: 0
      };
    }

    return this.costLog[this.provider][date];
  }

  async trackCost(tokens: number): Promise<void> {
    const date = this.getCurrentDate();
    const dailyCost = this.getDailyCost(date);
    const cost = (tokens / 1000) * this.costPer1kTokens;

    // Check if this would exceed the daily limit
    if (dailyCost.totalCost + cost > this.dailyLimit) {
      throw new Error(`Daily cost limit of $${this.dailyLimit} would be exceeded for ${this.provider}`);
    }

    dailyCost.totalTokens += tokens;
    dailyCost.totalCost += cost;

    this.saveCostLog();
  }

  getDailyStats(date?: string): DailyCost | null {
    const targetDate = date || this.getCurrentDate();
    return this.costLog[this.provider]?.[targetDate] || null;
  }
} 