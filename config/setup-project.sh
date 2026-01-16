#!/bin/bash

# MCP Configuration Setup Script
# Usage: ./setup-project.sh /path/to/your/project

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if project path is provided
if [ $# -eq 0 ]; then
    print_error "Please provide the path to your project"
    echo "Usage: $0 /path/to/your/project"
    echo "Example: $0 ~/projects/dr-woods-website"
    exit 1
fi

PROJECT_PATH="$1"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Validate project path
if [ ! -d "$PROJECT_PATH" ]; then
    print_error "Project directory does not exist: $PROJECT_PATH"
    exit 1
fi

print_status "Setting up MCP configuration for project: $PROJECT_PATH"

# Navigate to project directory
cd "$PROJECT_PATH"

# Create config directory
print_status "Creating config directory..."
mkdir -p config

# Copy configuration files
print_status "Copying MCP configuration system..."
cp -r "$SCRIPT_DIR"/* ./config/

# Make scripts executable
chmod +x ./config/setup-project.sh
chmod +x ./config/migrate-config.ts

# Install dependencies
print_status "Installing configuration dependencies..."
cd config
npm install --silent
cd ..

# Create environment files if they don't exist
if [ ! -f ".env.development" ]; then
    print_status "Creating .env.development template..."
    cat > .env.development << 'EOF'
# MCP Server Configuration
MCP_SERVER_URL=http://localhost:4001
MCP_API_KEY=your-development-api-key
MCP_ENVIRONMENT=development

# Project Specific Variables
PROJECT_NAME=Your Project Name
PROJECT_URL=http://localhost:3000
EOF
    print_success "Created .env.development template"
else
    print_warning ".env.development already exists, skipping..."
fi

if [ ! -f ".env.production" ]; then
    print_status "Creating .env.production template..."
    cat > .env.production << 'EOF'
# MCP Server Configuration
MCP_SERVER_URL=https://your-production-mcp-server.com
MCP_API_TOKEN=your-production-bearer-token
MCP_ENVIRONMENT=production

# Project Specific Variables
PROJECT_NAME=Your Project Name
PROJECT_URL=https://your-domain.com
EOF
    print_success "Created .env.production template"
else
    print_warning ".env.production already exists, skipping..."
fi

# Create project-specific MCP configuration
PROJECT_NAME=$(basename "$PROJECT_PATH")
print_status "Creating project-specific MCP configuration for: $PROJECT_NAME"

cat > config/mcp.development.json << EOF
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
    "${PROJECT_NAME}-mcp": {
      "name": "${PROJECT_NAME} MCP Server",
      "type": "http",
      "url": "\${MCP_SERVER_URL}",
      "headers": {
        "X-API-Key": "\${MCP_API_KEY}",
        "X-Project": "${PROJECT_NAME}",
        "X-Environment": "development"
      },
      "timeout": 5000,
      "description": "MCP server for ${PROJECT_NAME} development",
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
EOF

# Create lib directory and MCP client
print_status "Creating MCP client wrapper..."
mkdir -p lib

cat > lib/mcp-client.ts << EOF
import { mcpConfigManager } from '../config/mcp-config-manager.js';
import { MCPServer } from '../config/mcp-config.types.js';
import fetch from 'node-fetch';

export class ${PROJECT_NAME^}MCPClient {
  private server: MCPServer;
  private initialized = false;

  async initialize() {
    if (this.initialized) return;

    const config = await mcpConfigManager.load({
      environment: process.env.NODE_ENV as any,
      validateConnections: true
    });

    this.server = mcpConfigManager.getServer('${PROJECT_NAME}-mcp');
    this.initialized = true;
  }

  async addMemory(key: string, value: any, metadata?: any) {
    await this.initialize();

    const response = await fetch(\`\${this.server.url}/mcp/add\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.server.headers
      },
      body: JSON.stringify({ key, value, metadata })
    });

    if (!response.ok) {
      throw new Error(\`MCP request failed: \${response.statusText}\`);
    }

    return response.json();
  }

  async queryMemory(key: string) {
    await this.initialize();

    const response = await fetch(\`\${this.server.url}/mcp/query?key=\${encodeURIComponent(key)}\`, {
      headers: this.server.headers
    });

    if (!response.ok) {
      throw new Error(\`MCP query failed: \${response.statusText}\`);
    }

    return response.json();
  }

  async getHealth() {
    await this.initialize();
    
    const statuses = await mcpConfigManager.getConnectionStatuses();
    return statuses['${PROJECT_NAME}-mcp'];
  }
}

// Export singleton instance
export const ${PROJECT_NAME}MCP = new ${PROJECT_NAME^}MCPClient();
EOF

# Update package.json if it exists
if [ -f "package.json" ]; then
    print_status "Updating package.json with MCP scripts..."
    
    # Create a backup
    cp package.json package.json.backup
    
    # Add MCP scripts using node
    node -e "
    const fs = require('fs');
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    if (!pkg.scripts) pkg.scripts = {};
    
    pkg.scripts['mcp:validate'] = 'node config/validate-config.js';
    pkg.scripts['mcp:migrate'] = 'node config/migrate-config.js';
    pkg.scripts['mcp:health'] = 'curl http://localhost:3000/api/health';
    
    if (!pkg.dependencies) pkg.dependencies = {};
    pkg.dependencies['dotenv'] = '^16.0.0';
    pkg.dependencies['node-fetch'] = '^3.0.0';
    
    fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
    "
    
    print_success "Updated package.json with MCP scripts and dependencies"
else
    print_warning "No package.json found, skipping package.json updates"
fi

# Create example API route if this looks like a Next.js project
if [ -d "pages" ] || [ -d "app" ]; then
    print_status "Detected Next.js project, creating example API route..."
    
    mkdir -p pages/api
    
    cat > pages/api/mcp-example.ts << EOF
import { ${PROJECT_NAME}MCP } from '../../lib/mcp-client';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Check MCP health
    const health = await ${PROJECT_NAME}MCP.getHealth();
    if (health.status !== 'connected') {
      return res.status(503).json({ error: 'MCP server unavailable' });
    }

    // Handle different HTTP methods
    if (req.method === 'POST') {
      const result = await ${PROJECT_NAME}MCP.addMemory(
        'example-key',
        req.body,
        { timestamp: Date.now(), source: 'api' }
      );
      res.json(result);
    } else if (req.method === 'GET') {
      const data = await ${PROJECT_NAME}MCP.queryMemory('example-key');
      res.json(data);
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(\`Method \${req.method} Not Allowed\`);
    }
  } catch (error) {
    console.error('MCP Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
EOF

    cat > pages/api/health.ts << EOF
import { ${PROJECT_NAME}MCP } from '../../lib/mcp-client';
import { mcpConfigManager } from '../../config/mcp-config-manager';

export default async function handler(req, res) {
  try {
    const mcpHealth = await ${PROJECT_NAME}MCP.getHealth();
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
EOF

    print_success "Created example API routes in pages/api/"
fi

# Create .gitignore entries
if [ -f ".gitignore" ]; then
    if ! grep -q "# MCP Configuration" .gitignore; then
        print_status "Adding MCP entries to .gitignore..."
        cat >> .gitignore << 'EOF'

# MCP Configuration
.env.development
.env.production
.env.staging
config/node_modules/
config/dist/
*.log
EOF
        print_success "Updated .gitignore"
    fi
else
    print_status "Creating .gitignore with MCP entries..."
    cat > .gitignore << 'EOF'
# MCP Configuration
.env.development
.env.production
.env.staging
config/node_modules/
config/dist/
*.log

# Dependencies
node_modules/

# Build outputs
.next/
dist/
build/
EOF
    print_success "Created .gitignore"
fi

# Final instructions
print_success "🎉 MCP Configuration setup complete!"
echo ""
print_status "Next steps:"
echo "1. Edit .env.development and .env.production with your actual MCP server details"
echo "2. Install project dependencies: npm install"
echo "3. Test the configuration: npm run mcp:validate"
echo "4. Start your development server and test: npm run dev"
echo "5. Check MCP health: curl http://localhost:3000/api/health"
echo ""
print_status "Files created:"
echo "  - config/ (MCP configuration system)"
echo "  - lib/mcp-client.ts (MCP client wrapper)"
echo "  - .env.development (environment variables template)"
echo "  - .env.production (environment variables template)"
if [ -d "pages" ] || [ -d "app" ]; then
    echo "  - pages/api/mcp-example.ts (example API route)"
    echo "  - pages/api/health.ts (health check endpoint)"
fi
echo ""
print_status "For detailed usage instructions, see: config/INTEGRATION_GUIDE.md"
print_success "Setup completed successfully! 🚀"
EOF