import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { context7 } from './utils/context7.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Health check endpoint
app.get('/mcp/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: Date.now(),
    server: 'MCP Server',
    version: '1.0.0'
  });
});

// Add memory endpoint
app.post('/mcp/add', async (req, res) => {
  try {
    const { key, value, metadata } = req.body;
    
    if (!key || !value) {
      return res.status(400).json({ error: 'Key and value are required' });
    }

    // Add memory using context7
    const context = await context7.addContext(key, value, metadata);
    res.json({ success: true, context });
  } catch (error) {
    console.error('Error adding memory:', error);
    res.status(500).json({ error: 'Failed to add memory' });
  }
});

// Query memories endpoint
app.get('/mcp/query', async (req, res) => {
  try {
    const { key } = req.query;
    
    if (!key) {
      return res.status(400).json({ error: 'Key parameter is required' });
    }

    // Get contexts using context7
    const contexts = await context7.getContexts(key);
    res.json(contexts);
  } catch (error) {
    console.error('Error querying memories:', error);
    res.status(500).json({ error: 'Failed to query memories' });
  }
});

// Get latest memory endpoint
app.get('/mcp/latest', async (req, res) => {
  try {
    const { key } = req.query;
    
    if (!key) {
      return res.status(400).json({ error: 'Key parameter is required' });
    }

    // Get latest context using context7
    const context = await context7.getLatestContext(key);
    res.json(context);
  } catch (error) {
    console.error('Error getting latest memory:', error);
    res.status(500).json({ error: 'Failed to get latest memory' });
  }
});

// List all memories endpoint
app.get('/mcp/list', async (req, res) => {
  try {
    const contexts = await context7.getAllContexts();
    res.json(contexts);
  } catch (error) {
    console.error('Error listing memories:', error);
    res.status(500).json({ error: 'Failed to list memories' });
  }
});

// Clear all memories endpoint
app.delete('/mcp/clear', async (req, res) => {
  try {
    await context7.clearContexts();
    res.json({ success: true, message: 'All memories cleared' });
  } catch (error) {
    console.error('Error clearing memories:', error);
    res.status(500).json({ error: 'Failed to clear memories' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 4001;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`MCP Server running on http://${HOST}:${PORT}/mcp`);
  console.log(`Health check available at http://${HOST}:${PORT}/mcp/health`);
}); 