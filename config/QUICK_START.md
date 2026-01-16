# 🚀 Quick Start: Integrating MCP Configuration with Your Projects

## One-Command Setup

To integrate this improved MCP configuration system with your existing projects like `~/projects/dr-woods-website`, simply run:

```bash
# Navigate to this directory
cd /home/chad/projects/strategic-sync/config

# Run the setup script for your project
./setup-project.sh ~/projects/dr-woods-website
```

## What This Does

The setup script will automatically:

1. ✅ Copy the entire MCP configuration system to your project
2. ✅ Install all required dependencies
3. ✅ Create environment variable templates (`.env.development`, `.env.production`)
4. ✅ Generate project-specific MCP configuration files
5. ✅ Create a TypeScript MCP client wrapper
6. ✅ Add MCP scripts to your `package.json`
7. ✅ Create example API routes (for Next.js projects)
8. ✅ Update `.gitignore` with MCP-related entries

## After Setup

### 1. Configure Your Environment Variables

Edit the generated `.env.development` file:
```bash
# .env.development
MCP_SERVER_URL=http://localhost:4001
MCP_API_KEY=your-actual-development-api-key
MCP_ENVIRONMENT=development

PROJECT_NAME=Dr Woods Website
PROJECT_URL=http://localhost:3000
```

Edit the generated `.env.production` file:
```bash
# .env.production
MCP_SERVER_URL=https://your-production-mcp-server.com
MCP_API_TOKEN=your-actual-production-bearer-token
MCP_ENVIRONMENT=production

PROJECT_NAME=Dr Woods Website
PROJECT_URL=https://drwoods.com
```

### 2. Install Dependencies

```bash
cd ~/projects/dr-woods-website
npm install
```

### 3. Test the Configuration

```bash
# Validate MCP configuration
npm run mcp:validate

# Start your development server
npm run dev

# Test MCP health (in another terminal)
curl http://localhost:3000/api/health
```

### 4. Use in Your Code

The setup creates a ready-to-use MCP client:

```typescript
// In your API routes or server-side code
import { drWoodsWebsiteMCP } from '../lib/mcp-client';

// Store data
await drWoodsWebsiteMCP.addMemory('patient-inquiry', {
  name: 'John Doe',
  email: 'john@example.com',
  message: 'I need an appointment'
});

// Retrieve data
const inquiries = await drWoodsWebsiteMCP.queryMemory('patient-inquiries');

// Check health
const health = await drWoodsWebsiteMCP.getHealth();
```

## Example Usage Scenarios

### For Dr. Woods Website

```typescript
// Store patient contact form submissions
await drWoodsWebsiteMCP.addMemory(`inquiry-${Date.now()}`, {
  name: formData.name,
  email: formData.email,
  phone: formData.phone,
  service: formData.service,
  message: formData.message,
  timestamp: Date.now()
}, {
  type: 'patient-inquiry',
  source: 'contact-form'
});

// Track appointment requests
await drWoodsWebsiteMCP.addMemory(`appointment-${Date.now()}`, {
  patientName: data.name,
  preferredDate: data.date,
  serviceType: data.service,
  urgency: data.urgency
}, {
  type: 'appointment-request',
  status: 'pending'
});

// Store service page analytics
await drWoodsWebsiteMCP.addMemory(`pageview-${Date.now()}`, {
  page: '/services/dental-implants',
  userAgent: req.headers['user-agent'],
  timestamp: Date.now(),
  sessionId: req.sessionId
}, {
  type: 'analytics',
  category: 'page-view'
});
```

## Available Commands

After setup, your project will have these new npm scripts:

```bash
# Validate MCP configuration
npm run mcp:validate

# Migrate from old configuration
npm run mcp:migrate

# Check MCP server health
npm run mcp:health
```

## Project Structure After Setup

```
your-project/
├── config/                          # MCP configuration system
│   ├── mcp-config-manager.ts        # Configuration manager
│   ├── mcp-config.types.ts          # TypeScript types
│   ├── mcp-config.schema.json       # JSON schema
│   ├── mcp.development.json         # Development config
│   └── package.json                 # Config dependencies
├── lib/
│   └── mcp-client.ts                # Your project's MCP client
├── pages/api/                       # API routes (Next.js)
│   ├── mcp-example.ts               # Example MCP usage
│   └── health.ts                    # Health check endpoint
├── .env.development                 # Development environment variables
├── .env.production                  # Production environment variables
└── package.json                     # Updated with MCP scripts
```

## Troubleshooting

### Common Issues

1. **Permission Denied**
   ```bash
   chmod +x /home/chad/projects/strategic-sync/config/setup-project.sh
   ```

2. **MCP Server Not Found**
   - Check your `.env` files have correct `MCP_SERVER_URL`
   - Ensure your MCP server is running
   - Test with: `curl $MCP_SERVER_URL/health`

3. **Environment Variables Not Loading**
   - Make sure you have `dotenv` installed: `npm install dotenv`
   - Load environment variables in your app:
     ```typescript
     import dotenv from 'dotenv';
     dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
     ```

### Getting Help

- Check the comprehensive documentation: [`INTEGRATION_GUIDE.md`](./INTEGRATION_GUIDE.md)
- Review the improvement summary: [`IMPROVEMENTS_SUMMARY.md`](./IMPROVEMENTS_SUMMARY.md)
- Read the full documentation: [`README.md`](./README.md)

## Next Steps

1. **Customize Configuration**: Modify `config/mcp.development.json` for your specific needs
2. **Add More Servers**: Configure additional MCP servers for different services
3. **Implement Monitoring**: Set up alerts for MCP server health
4. **Security Review**: Ensure all secrets are properly configured in environment variables

---

**That's it! Your project now has enterprise-grade MCP configuration management.** 🎉