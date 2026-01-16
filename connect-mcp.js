const fetch = require('node-fetch');

// MCP server configuration
const MCP_SERVER_URL = 'http://172.16.23.99:4001';

async function testMCPConnection() {
  try {
    console.log(`🔗 Testing connection to MCP server at: ${MCP_SERVER_URL}`);
    
    // Test health endpoint first
    console.log('📡 Testing health endpoint...');
    const healthResponse = await fetch(`${MCP_SERVER_URL}/health`);
    
    if (!healthResponse.ok) {
      throw new Error(`Health check failed: ${healthResponse.status} ${healthResponse.statusText}`);
    }
    
    const healthData = await healthResponse.json();
    console.log('✅ Health check passed:', healthData);
    
    // Test adding data
    console.log('📝 Testing add endpoint...');
    const addResponse = await fetch(`${MCP_SERVER_URL}/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        key: "connection_test",
        value: "Successfully connected to MCP server",
        metadata: {
          source: "connection_test_script",
          timestamp: Date.now(),
          server: "172.16.23.99:4001"
        }
      })
    });

    if (!addResponse.ok) {
      throw new Error(`Failed to add data: ${addResponse.status} ${addResponse.statusText}`);
    }

    const addResult = await addResponse.json();
    console.log('✅ Data added successfully:', addResult);

    // Test querying data
    console.log('🔍 Testing query endpoint...');
    const queryResponse = await fetch(`${MCP_SERVER_URL}/query?key=connection_test`);
    
    if (!queryResponse.ok) {
      throw new Error(`Failed to query data: ${queryResponse.status} ${queryResponse.statusText}`);
    }

    const queryResult = await queryResponse.json();
    console.log('✅ Query successful:', queryResult);

    // Test getting latest data
    console.log('📊 Testing latest endpoint...');
    const latestResponse = await fetch(`${MCP_SERVER_URL}/latest?key=connection_test`);
    
    if (!latestResponse.ok) {
      throw new Error(`Failed to get latest data: ${latestResponse.status} ${latestResponse.statusText}`);
    }

    const latestResult = await latestResponse.json();
    console.log('✅ Latest data retrieved:', latestResult);

    console.log('\n🎉 MCP server connection test completed successfully!');
    console.log(`✅ Server at ${MCP_SERVER_URL} is responding correctly`);
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    
    if (error.code === 'ENOTFOUND') {
      console.error('💡 Tip: Check if the server IP address is correct and accessible');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('💡 Tip: Check if the MCP server is running on the specified port');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('💡 Tip: Check network connectivity and firewall settings');
    }
  }
}

// Run the connection test
testMCPConnection(); 