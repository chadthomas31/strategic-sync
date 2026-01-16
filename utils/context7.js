import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create the context7 manager class
export class Context7 {
  constructor(dbPath) {
    const adapter = new JSONFile(dbPath);
    this.db = new Low(adapter, { contexts: [] });
    this.maxContexts = 7;
  }

  // Add a new context
  async addContext(key, value, metadata) {
    await this.db.read();
    
    const context = {
      id: Date.now().toString(),
      key,
      value,
      timestamp: Date.now(),
      metadata
    };

    // Add the new context
    this.db.data.contexts.push(context);

    // Ensure we only keep the last 7 contexts
    if (this.db.data.contexts.length > this.maxContexts) {
      this.db.data.contexts = this.db.data.contexts.slice(-this.maxContexts);
    }

    await this.db.write();
    return context;
  }

  // Get the last 7 contexts for a specific key
  async getContexts(key) {
    await this.db.read();
    return this.db.data.contexts
      .filter(context => context.key === key)
      .slice(-this.maxContexts);
  }

  // Get all contexts
  async getAllContexts() {
    await this.db.read();
    return this.db.data.contexts;
  }

  // Clear all contexts
  async clearContexts() {
    await this.db.read();
    this.db.data.contexts = [];
    await this.db.write();
  }

  // Get the most recent context for a key
  async getLatestContext(key) {
    const contexts = await this.getContexts(key);
    return contexts.length > 0 ? contexts[contexts.length - 1] : null;
  }
}

// Create a singleton instance
const dbPath = path.join(__dirname, '..', 'data', 'context7.json');
export const context7 = new Context7(dbPath);
