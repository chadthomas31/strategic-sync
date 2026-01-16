# Enhanced MCP Configuration System

A comprehensive, secure, and maintainable configuration management system for Model Context Protocol (MCP) servers.

## 🚀 Features

- **🔒 Security First**: Environment variable substitution, secret management, and encryption support
- **🌍 Environment-Aware**: Separate configurations for development, staging, and production
- **✅ Validation**: JSON Schema validation with TypeScript type safety
- **🔄 Error Handling**: Retry logic, circuit breakers, and fallback mechanisms
- **📊 Monitoring**: Health checks, connection pooling, and audit logging
- **🛠️ Migration Tools**: Automated migration from legacy configurations

## 📁 Project Structure

```
config/
├── README.md                     # This documentation
├── package.json                  # Dependencies and scripts
├── mcp-config.schema.json        # JSON Schema for validation
├── mcp-config.types.ts           # TypeScript interfaces
├── mcp-config-manager.ts         # Main configuration manager
├── migrate-config.ts             # Migration tool
├── examples/                     # Example configurations
│   ├── mcp.development.json      # Development environment
│   ├── mcp.production.json       # Production environment
│   └── mcp.staging.json          # Staging environment (optional)
└── docs/                         # Additional documentation
    ├── security-guide.md         # Security best practices
    ├── troubleshooting.md        # Common issues and solutions
    └── api-reference.md          # API documentation
```

## 🏁 Quick Start

### 1. Installation

```bash
cd config
npm install
```

### 2. Environment Setup

Create environment-specific configuration files:

```bash
# Copy example configurations
cp examples/mcp.development.json ./mcp.development.json
cp examples/mcp.production.json ./mcp.production.json
```

### 3. Set Environment Variables

Create `.env` files for each environment:

```bash
# .env.development
MCP_DEV_API_KEY=your-dev-api-key
MCP_DEV_URL=http://localhost:4001

# .env.production
MCP_PROD_API_TOKEN=your-prod-token
MCP_PROD_PRIMARY_URL=https://api.strategicsync.com
MCP_PROD_SECONDARY_URL=https://api-backup.strategicsync.com
```

### 4. Usage in Your Application

```typescript
import { mcpConfigManager } from './config/mcp-config-manager.js';

// Load configuration
const config = await mcpConfigManager.load({
  environment: process.env.NODE_ENV as Environment,
  validateConnections: true
});

// Get server configuration
const primaryServer = mcpConfigManager.getServer('primary-prod');

// Get connection status
const statuses = await mcpConfigManager.getConnectionStatuses();
console.log('Server statuses:', statuses);
```

## 📋 Configuration Schema

### Basic Structure

```json
{
  "version": "1.0.0",
  "environment": "production",
  "global": {
    "timeout": 30000,
    "retryConfig": { ... },
    "logging": { ... }
  },
  "mcpServers": {
    "server-key": {
      "name": "Server Name",
      "type": "https",
      "url": "${MCP_SERVER_URL}",
      "headers": {
        "Authorization": "Bearer ${API_TOKEN}"
      },
      "timeout": 30000,
      "description": "Server description",
      "enabled": true,
      "priority": 10,
      "retryConfig": { ... },
      "healthCheck": { ... },
      "fallback": { ... },
      "security": { ... }
    }
  }
}
```

### Server Configuration Options

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ | Human-readable server name |
| `type` | enum | ✅ | Connection type: `http`, `https`, `websocket`, `stdio` |
| `url` | string | ✅ | Server URL (supports environment variables) |
| `headers` | object | ❌ | HTTP headers to include |
| `timeout` | number | ❌ | Request timeout in milliseconds |
| `description` | string | ✅ | Server description |
| `enabled` | boolean | ❌ | Whether server is enabled (default: true) |
| `priority` | number | ❌ | Server priority 1-100 (default: 50) |
| `retryConfig` | object | ❌ | Retry configuration |
| `healthCheck` | object | ❌ | Health check settings |
| `fallback` | object | ❌ | Fallback configuration |
| `security` | object | ❌ | Security settings |

### Environment Variable Substitution

Use `${VARIABLE_NAME}` syntax in configuration values:

```json
{
  "url": "${MCP_SERVER_URL}",
  "headers": {
    "Authorization": "Bearer ${API_TOKEN}",
    "X-Environment": "${NODE_ENV}"
  }
}
```

## 🔧 Migration from Legacy Configuration

### Automatic Migration

Use the migration tool to convert existing configurations:

```bash
# Basic migration
node migrate-config.js --input ./old-mcp-config.json --output ./config

# Advanced migration with options
node migrate-config.js \
  --input ../../.codeium/windsurf/mcp_config.json \
  --output ./migrated-config \
  --environment production \
  --extract-secrets \
  --validate
```

### Manual Migration Steps

1. **Backup Original Configuration**
   ```bash
   cp mcp_config.json mcp_config.json.backup
   ```

2. **Extract Hardcoded Secrets**
   - Move API keys to environment variables
   - Replace hardcoded URLs with environment variables
   - Update headers to use variable substitution

3. **Update Schema**
   - Add required fields (`version`, `environment`)
   - Restructure server configurations
   - Add enhanced features (retry, health checks, etc.)

4. **Test New Configuration**
   ```bash
   node -e "
   import('./mcp-config-manager.js').then(async ({ mcpConfigManager }) => {
     const config = await mcpConfigManager.load({ validateConnections: true });
     console.log('✅ Configuration valid');
   });
   "
   ```

### Migration Example

**Before (Legacy):**
```json
{
  "mcpServers": {
    "professional-mcp": {
      "name": "Professional MCP Server",
      "type": "http",
      "url": "http://172.16.23.98:4001",
      "headers": {
        "X-API-Key": "qZ!$9nVt3A^7bP0kLm#zX4@cWsE6UfG2r"
      },
      "timeout": 30000,
      "description": "Production MCP server with secure authentication"
    }
  }
}
```

**After (Enhanced):**
```json
{
  "version": "1.0.0",
  "environment": "production",
  "mcpServers": {
    "professional-mcp": {
      "name": "Professional MCP Server",
      "type": "https",
      "url": "${MCP_PROD_URL}",
      "headers": {
        "Authorization": "Bearer ${MCP_API_TOKEN}",
        "X-Environment": "production"
      },
      "timeout": 30000,
      "description": "Production MCP server with secure authentication",
      "enabled": true,
      "priority": 10,
      "retryConfig": {
        "maxAttempts": 3,
        "initialDelay": 1000,
        "backoffMultiplier": 2.0,
        "maxDelay": 30000,
        "jitter": true
      },
      "healthCheck": {
        "enabled": true,
        "interval": 30000,
        "timeout": 5000,
        "endpoint": "/health"
      },
      "fallback": {
        "enabled": true,
        "serverKey": "backup-server",
        "cacheEnabled": true,
        "cacheTtl": 300000
      },
      "security": {
        "rateLimiting": {
          "enabled": true,
          "requestsPerMinute": 1000
        },
        "encryption": {
          "enabled": true,
          "algorithm": "AES-256-GCM"
        }
      }
    }
  }
}
```

## 🔒 Security Best Practices

### 1. Secret Management
- ✅ Use environment variables for all secrets
- ✅ Never commit secrets to version control
- ✅ Use different secrets for each environment
- ✅ Rotate secrets regularly

### 2. Network Security
- ✅ Use HTTPS in production
- ✅ Implement proper CORS policies
- ✅ Enable rate limiting
- ✅ Use IP whitelisting where appropriate

### 3. Configuration Security
- ✅ Validate all configuration inputs
- ✅ Use least privilege principles
- ✅ Enable audit logging
- ✅ Monitor configuration changes

## 📊 Monitoring and Observability

### Health Checks
```typescript
// Get connection statuses
const statuses = await mcpConfigManager.getConnectionStatuses();

// Check specific server
const serverStatus = statuses['primary-server'];
if (serverStatus.status !== 'connected') {
  console.warn(`Server ${serverStatus.serverKey} is ${serverStatus.status}`);
}
```

### Logging Configuration
```json
{
  "global": {
    "logging": {
      "level": "info",
      "format": "json",
      "auditEnabled": true
    }
  }
}
```

## 🛠️ Development Tools

### Validation Script
```bash
npm run validate
```

### Configuration Testing
```bash
npm test
```

### Build TypeScript
```bash
npm run build
```

## 🐛 Troubleshooting

### Common Issues

1. **Environment Variable Not Found**
   ```
   Error: Environment variable 'MCP_API_TOKEN' is not defined
   ```
   **Solution**: Ensure all required environment variables are set

2. **Schema Validation Failed**
   ```
   Error: Configuration validation failed
   ```
   **Solution**: Check configuration against schema, fix validation errors

3. **Connection Timeout**
   ```
   Error: Connection timeout after 30000ms
   ```
   **Solution**: Check server availability, adjust timeout settings

### Debug Mode
```bash
NODE_ENV=development DEBUG=mcp:* node your-app.js
```

## 📚 API Reference

### MCPConfigManager

#### Methods

- `load(options?: ConfigLoadOptions): Promise<MCPConfiguration>`
- `getConfig(): MCPConfiguration`
- `getServer(serverKey: string): MCPServer`
- `getEnabledServers(): Array<{key: string, server: MCPServer}>`
- `getConnectionStatuses(): Promise<Record<string, ConnectionStatus>>`
- `reload(options?: ConfigLoadOptions): Promise<MCPConfiguration>`

#### Types

See [`mcp-config.types.ts`](./mcp-config.types.ts) for complete type definitions.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

For issues and questions:
- Create an issue in the repository
- Check the troubleshooting guide
- Review the API documentation

---

**Made with ❤️ by Strategic Sync**