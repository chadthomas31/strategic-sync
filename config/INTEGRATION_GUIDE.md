# MCP Configuration Integration Guide

## 🎯 Integrating with Existing Projects

This guide shows how to integrate the improved MCP configuration system with your existing projects like `~/projects/dr-woods-website`.

## 📋 Prerequisites

1. Node.js and npm installed
2. Existing project with MCP usage
3. Access to your current MCP server

## 🚀 Step-by-Step Integration

### Step 1: Install the Configuration System

```bash
# Navigate to your project
cd ~/projects/dr-woods-website

# Create config directory
mkdir -p config

# Copy the MCP configuration system
cp -r /home/chad/projects/strategic-sync/config/* ./config/

# Install dependencies
cd config
npm install
cd ..
```

### Step 2: Set Up Environment Variables

Create environment files for your project:

```bash
# Create .env.development
cat > .env.development << 'EOF'
# MCP Server Configuration
MCP_SERVER_URL=http://localhost:4001
MCP_API_KEY=your-development-api-key
MCP_ENVIRONMENT=development

# Dr. Woods Website Specific
WEBSITE_NAME=Dr. Woods Website
WEBSITE_URL=http://localhost:3000
EOF

# Create .env.production
cat > .env.production << 'EOF'
# MCP Server Configuration
MCP_SERVER_URL=https://your-production-mcp-server.com
MCP_API_TOKEN=your-production-bearer-token
MCP_ENVIRONMENT=production

# Dr. Woods Website Specific
WEBSITE_NAME=Dr. Woods Website
WEBSITE_URL=https://drwoods.com
EOF
```

### Step 3: Create Project-Specific Configuration

Create `config/mcp.development.json` for your project:

```json
{
  "version": "1.0.0",
  "environment": "development",
  "global": {
    "timeout": 10000,
    "retryConfig": {
      "maxAttempts": 2,
      "initialDelay": 500,
      "backoffMultiplier": 1.5,
      "maxDelay": 5000,
      "jitter": true
    },
    "logging": {
      "level": "debug",
      "format": "text",
      "auditEnabled": false
    }
  },
  "mcpServers": {
    "dr-woods-mcp": {
      "name": "Dr. Woods Website MCP Server",
      "type": "http",
      "url": "${MCP_SERVER_URL}",
      "headers": {
        "X-API-Key": "${MCP_API_KEY}",
        "X-Project": "dr-woods-website",
        "X-Environment": "development"
      },
      "timeout": 5000,
      "description": "MCP server for Dr. Woods website development",
      "enabled": true,
      "priority": 10,
      "healthCheck": {
        "enabled": true,
        "interval": 60000,
        "timeout": 3000,
        "endpoint": "/health",
        "expectedStatus": 200
      },
      "fallback": {
        "enabled": false,
        "cacheEnabled": true,
        "cacheTtl": 60000
      }
    }
  }
}
```

### Step 4: Update Your Application Code

#### Option A: Replace Existing MCP Usage

If you have existing MCP code, replace it with the new configuration manager:

```typescript
// Before (old way)
const mcpConfig = {
  url: 'http://localhost:4001',
  headers: { 'X-API-Key': 'hardcoded-key' }
};

// After (new way)
import { mcpConfigManager } from './config/mcp-config-manager.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

// Load MCP configuration
const config = await mcpConfigManager.load({
  environment: process.env.NODE_ENV as Environment,
  validateConnections: true
});

// Get server configuration
const mcpServer = mcpConfigManager.getServer('dr-woods-mcp');
```

#### Option B: Create Integration Wrapper

Create `lib/mcp-client.ts` to wrap your existing MCP usage:

```typescript
import { mcpConfigManager } from '../config/mcp-config-manager.js';
import { MCPServer } from '../config/mcp-config.types.js';
import fetch from 'node-fetch';

export class DrWoodsMCPClient {
  private server: MCPServer;
  private initialized = false;

  async initialize() {
    if (this.initialized) return;

    const config = await mcpConfigManager.load({
      environment: process.env.NODE_ENV as any,
      validateConnections: true
    });

    this.server = mcpConfigManager.getServer('dr-woods-mcp');
    this.initialized = true;
  }

  async addMemory(key: string, value: any, metadata?: any) {
    await this.initialize();

    const response = await fetch(`${this.server.url}/mcp/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.server.headers
      },
      body: JSON.stringify({ key, value, metadata })
    });

    if (!response.ok) {
      throw new Error(`MCP request failed: ${response.statusText}`);
    }

    return response.json();
  }

  async queryMemory(key: string) {
    await this.initialize();

    const response = await fetch(`${this.server.url}/mcp/query?key=${encodeURIComponent(key)}`, {
      headers: this.server.headers
    });

    if (!response.ok) {
      throw new Error(`MCP query failed: ${response.statusText}`);
    }

    return response.json();
  }

  async getHealth() {
    await this.initialize();
    
    const statuses = await mcpConfigManager.getConnectionStatuses();
    return statuses['dr-woods-mcp'];
  }
}

// Export singleton instance
export const drWoodsMCP = new DrWoodsMCPClient();
```

### Step 5: Update Package.json

Add the configuration system to your project's `package.json`:

```json
{
  "name": "dr-woods-website",
  "scripts": {
    "dev": "NODE_ENV=development next dev",
    "build": "NODE_ENV=production next build",
    "start": "NODE_ENV=production next start",
    "mcp:validate": "node config/validate-config.js",
    "mcp:migrate": "node config/migrate-config.js"
  },
  "dependencies": {
    "dotenv": "^16.0.0",
    "node-fetch": "^3.0.0"
  }
}
```

### Step 6: Use in Your Application

#### In Next.js API Routes (`pages/api/example.ts`):

```typescript
import { drWoodsMCP } from '../../lib/mcp-client';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Check MCP health
    const health = await drWoodsMCP.getHealth();
    if (health.status !== 'connected') {
      return res.status(503).json({ error: 'MCP server unavailable' });
    }

    // Use MCP functionality
    if (req.method === 'POST') {
      const result = await drWoodsMCP.addMemory(
        'patient-inquiry',
        req.body,
        { timestamp: Date.now(), source: 'website' }
      );
      res.json(result);
    } else if (req.method === 'GET') {
      const data = await drWoodsMCP.queryMemory('patient-inquiries');
      res.json(data);
    }
  } catch (error) {
    console.error('MCP Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
```

#### In React Components:

```typescript
import { useState, useEffect } from 'react';

export function MCPStatus() {
  const [status, setStatus] = useState<string>('checking...');

  useEffect(() => {
    fetch('/api/mcp/health')
      .then(res => res.json())
      .then(data => setStatus(data.status))
      .catch(() => setStatus('error'));
  }, []);

  return (
    <div className={`status ${status === 'connected' ? 'online' : 'offline'}`}>
      MCP Server: {status}
    </div>
  );
}
```

### Step 7: Environment-Specific Deployment

#### Development:
```bash
NODE_ENV=development npm run dev
```

#### Production:
```bash
NODE_ENV=production npm run build
NODE_ENV=production npm start
```

## 🔧 Advanced Integration Examples

### Custom MCP Operations for Dr. Woods Website

```typescript
// lib/dr-woods-mcp-operations.ts
import { drWoodsMCP } from './mcp-client';

export class DrWoodsOperations {
  // Store patient inquiry
  async storePatientInquiry(inquiry: {
    name: string;
    email: string;
    phone?: string;
    message: string;
    service: string;
  }) {
    return drWoodsMCP.addMemory(
      `inquiry-${Date.now()}`,
      inquiry,
      {
        type: 'patient-inquiry',
        timestamp: Date.now(),
        source: 'website-form'
      }
    );
  }

  // Get appointment requests
  async getAppointmentRequests() {
    return drWoodsMCP.queryMemory('appointment-requests');
  }

  // Store service information
  async updateServiceInfo(service: string, info: any) {
    return drWoodsMCP.addMemory(
      `service-${service}`,
      info,
      {
        type: 'service-info',
        lastUpdated: Date.now()
      }
    );
  }

  // Analytics tracking
  async trackPageView(page: string, userAgent?: string) {
    return drWoodsMCP.addMemory(
      `pageview-${Date.now()}`,
      { page, userAgent, timestamp: Date.now() },
      { type: 'analytics' }
    );
  }
}

export const drWoodsOps = new DrWoodsOperations();
```

### Health Check Middleware

```typescript
// middleware/mcp-health.ts
import { NextRequest, NextResponse } from 'next/server';
import { drWoodsMCP } from '../lib/mcp-client';

export async function mcpHealthMiddleware(request: NextRequest) {
  // Skip health check for static files
  if (request.nextUrl.pathname.startsWith('/_next/')) {
    return NextResponse.next();
  }

  try {
    const health = await drWoodsMCP.getHealth();
    
    if (health.status !== 'connected') {
      console.warn('MCP server not available:', health);
      // Continue without MCP functionality
    }
  } catch (error) {
    console.error('MCP health check failed:', error);
  }

  return NextResponse.next();
}
```

## 📊 Monitoring and Debugging

### Add Logging to Your Application

```typescript
// lib/logger.ts
import { mcpConfigManager } from '../config/mcp-config-manager.js';

export class Logger {
  static async logMCPOperation(operation: string, data: any) {
    const config = mcpConfigManager.getConfig();
    
    if (config.global?.logging?.auditEnabled) {
      console.log(`[MCP] ${operation}:`, {
        timestamp: new Date().toISOString(),
        operation,
        data,
        environment: config.environment
      });
    }
  }
}
```

### Health Check Endpoint

```typescript
// pages/api/health.ts
import { drWoodsMCP } from '../../lib/mcp-client';
import { mcpConfigManager } from '../../config/mcp-config-manager';

export default async function handler(req, res) {
  try {
    const mcpHealth = await drWoodsMCP.getHealth();
    const config = mcpConfigManager.getConfig();
    
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: config.environment,
      mcp: {
        status: mcpHealth.status,
        responseTime: mcpHealth.responseTime,
        lastChecked: mcpHealth.lastChecked
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message
    });
  }
}
```

## 🚀 Deployment Checklist

- [ ] Copy configuration system to your project
- [ ] Install dependencies (`npm install` in config directory)
- [ ] Create environment-specific `.env` files
- [ ] Update your application code to use new MCP client
- [ ] Test in development environment
- [ ] Validate configuration with `npm run mcp:validate`
- [ ] Deploy to staging/production
- [ ] Monitor health endpoints
- [ ] Set up alerts for MCP server issues

## 🔗 Quick Commands

```bash
# Validate your configuration
npm run mcp:validate

# Check MCP server health
curl http://localhost:3000/api/health

# View MCP logs
NODE_ENV=development DEBUG=mcp:* npm run dev
```

This integration approach allows you to gradually adopt the improved MCP configuration system while maintaining compatibility with your existing Dr. Woods website project.