import fetch from 'node-fetch';

const MCP_SERVER_URL = 'http://172.16.20.75:4001/mcp';

async function testLocalMCP(key, value) {
  try {
    // Add the value to local MCP
    const addResponse = await fetch(`${MCP_SERVER_URL}/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key, value }),
    });

    if (!addResponse.ok) {
      throw new Error(`Failed to add to MCP: ${addResponse.statusText}`);
    }

    // Query the value back
    const queryResponse = await fetch(`${MCP_SERVER_URL}/query?key=${encodeURIComponent(key)}`);
    
    if (!queryResponse.ok) {
      throw new Error(`Failed to query MCP: ${queryResponse.statusText}`);
    }

    const result = await queryResponse.json();
    return result;
  } catch (error) {
    console.error('Error:', error.message);
    return null;
  }
}

async function main() {
  const result = await testLocalMCP("test", "from REPL");
  console.log("Test result:", result);
}

main().catch(console.error); 