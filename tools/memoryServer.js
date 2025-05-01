// tools/memoryServer.js
const express = require('express');
const bodyParser = require('body-parser');
const { Low, JSONFile } = require('lowdb');

// Set up a tiny JSON-backed datastore
const db = new Low(new JSONFile('memory.json'));
db.data = db.data || { memories: [] };

const app = express();
app.use(bodyParser.json());

// Add a memory
app.post('/mcp/add', async (req, res) => {
  const { key, value } = req.body;
  db.data.memories.push({ key, value, timestamp: Date.now() });
  await db.write();
  res.json({ success: true });
});

// Query memories
app.get('/mcp/query', async (req, res) => {
  const { key } = req.query;
  const results = db.data.memories.filter(m => m.key === key);
  res.json(results);
});

const PORT = process.env.MCP_PORT || 4001;
app.listen(PORT, () => {
  console.log(`Memory MCP server running on port ${PORT}`);
});
