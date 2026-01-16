import fetch from 'node-fetch';

// Global MCP server URL from environment variable
const MCP_SERVER_URL = process.env.MCP_SERVER_URL || 'http://172.16.23.99:4001';

// Wrap the code in an async function
async function main() {
  try {
    console.log(`Connecting to MCP server at: ${MCP_SERVER_URL}`);
    
    // Add data to global MCP with metadata
    const addResponse = await fetch(`${MCP_SERVER_URL}/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        key: "test",
        value: "from REPL",
        metadata: {
          source: "test-script",
          timestamp: Date.now()
        }
      })
    });

    if (!addResponse.ok) {
      throw new Error(`Failed to add to MCP: ${addResponse.statusText}`);
    }

    const addResult = await addResponse.json();
    console.log("✅ Memory added:", addResult);

    // Query data from global MCP
    const queryResponse = await fetch(`${MCP_SERVER_URL}/query?key=test`);
    
    if (!queryResponse.ok) {
      throw new Error(`Failed to query MCP: ${queryResponse.statusText}`);
    }

    const contexts = await queryResponse.json();
    console.log("✅ Contexts fetched:", contexts);

    // Get latest memory
    const latestResponse = await fetch(`${MCP_SERVER_URL}/latest?key=test`);
    
    if (!latestResponse.ok) {
      throw new Error(`Failed to get latest memory: ${latestResponse.statusText}`);
    }

    const latestContext = await latestResponse.json();
    console.log("✅ Latest context:", latestContext);

  } catch (error) {
    console.error("❌ Error:", error instanceof Error ? error.message : 'Unknown error');
  }
}

// Run the main function
main();
