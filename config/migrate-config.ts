#!/usr/bin/env node

/**
 * MCP Configuration Migration Tool
 * Converts legacy MCP configurations to the new enhanced format
 */

import fs from 'fs/promises';
import path from 'path';
import { MCPConfiguration, MCPServer, Environment } from './mcp-config.types.js';

interface LegacyMCPConfig {
  mcpServers: Record<string, LegacyMCPServer>;
}

interface LegacyMCPServer {
  name: string;
  type: string;
  url: string;
  headers?: Record<string, string>;
  timeout?: number;
  description: string;
}

interface MigrationOptions {
  inputPath: string;
  outputDir: string;
  environment: Environment;
  extractSecrets: boolean;
  validateConnections: boolean;
}

class MCPConfigMigrator {
  private secrets: Map<string, string> = new Map();
  private warnings: string[] = [];

  async migrate(options: MigrationOptions): Promise<void> {
    console.log('🔄 Starting MCP configuration migration...');
    
    try {
      // Read legacy configuration
      const legacyConfig = await this.readLegacyConfig(options.inputPath);
      
      // Convert to new format
      const newConfig = await this.convertConfiguration(legacyConfig, options.environment);
      
      // Extract secrets if requested
      if (options.extractSecrets) {
        this.extractSecrets(newConfig);
      }
      
      // Write new configuration
      await this.writeNewConfiguration(newConfig, options.outputDir, options.environment);
      
      // Write environment file
      if (options.extractSecrets) {
        await this.writeEnvironmentFile(options.outputDir, options.environment);
      }
      
      // Write migration report
      await this.writeMigrationReport(options.outputDir);
      
      console.log('✅ Migration completed successfully!');
      console.log(`📁 New configuration written to: ${options.outputDir}`);
      
      if (this.warnings.length > 0) {
        console.log('\n⚠️  Migration warnings:');
        this.warnings.forEach(warning => console.log(`   - ${warning}`));
      }
      
    } catch (error) {
      console.error('❌ Migration failed:', error);
      process.exit(1);
    }
  }

  private async readLegacyConfig(inputPath: string): Promise<LegacyMCPConfig> {
    try {
      const content = await fs.readFile(inputPath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      throw new Error(`Failed to read legacy configuration: ${error}`);
    }
  }

  private async convertConfiguration(
    legacyConfig: LegacyMCPConfig,
    environment: Environment
  ): Promise<MCPConfiguration> {
    const newConfig: MCPConfiguration = {
      version: '1.0.0',
      environment,
      global: {
        timeout: 30000,
        retryConfig: {
          maxAttempts: 3,
          initialDelay: 1000,
          backoffMultiplier: 2.0,
          maxDelay: 30000,
          jitter: true
        },
        logging: {
          level: environment === 'production' ? 'info' : 'debug',
          format: environment === 'production' ? 'json' : 'text',
          auditEnabled: environment === 'production'
        }
      },
      mcpServers: {}
    };

    // Convert each server
    for (const [key, legacyServer] of Object.entries(legacyConfig.mcpServers)) {
      newConfig.mcpServers[key] = this.convertServer(legacyServer, environment);
    }

    return newConfig;
  }

  private convertServer(legacyServer: LegacyMCPServer, environment: Environment): MCPServer {
    const newServer: MCPServer = {
      name: legacyServer.name,
      type: this.convertConnectionType(legacyServer.type),
      url: this.convertUrl(legacyServer.url),
      description: legacyServer.description,
      enabled: true,
      priority: 50,
      timeout: legacyServer.timeout || 30000
    };

    // Convert headers and extract secrets
    if (legacyServer.headers) {
      newServer.headers = {};
      for (const [headerName, headerValue] of Object.entries(legacyServer.headers)) {
        if (this.isSecret(headerName, headerValue)) {
          const envVarName = this.generateEnvVarName(headerName);
          newServer.headers[headerName] = `\${${envVarName}}`;
          this.secrets.set(envVarName, headerValue);
          this.warnings.push(`Extracted secret from header '${headerName}' to environment variable '${envVarName}'`);
        } else {
          newServer.headers[headerName] = headerValue;
        }
      }
    }

    // Add enhanced configurations based on environment
    if (environment === 'production') {
      newServer.retryConfig = {
        maxAttempts: 5,
        initialDelay: 2000,
        backoffMultiplier: 2.0,
        maxDelay: 30000,
        jitter: true
      };
      
      newServer.healthCheck = {
        enabled: true,
        interval: 30000,
        timeout: 5000,
        endpoint: '/health',
        expectedStatus: 200
      };
      
      newServer.security = {
        rateLimiting: {
          enabled: true,
          requestsPerMinute: 1000
        },
        encryption: {
          enabled: true,
          algorithm: 'AES-256-GCM'
        }
      };
    } else {
      newServer.healthCheck = {
        enabled: true,
        interval: 60000,
        timeout: 3000,
        endpoint: '/health',
        expectedStatus: 200
      };
    }

    newServer.fallback = {
      enabled: true,
      cacheEnabled: environment !== 'development',
      cacheTtl: environment === 'production' ? 300000 : 60000
    };

    return newServer;
  }

  private convertConnectionType(type: string): 'http' | 'https' | 'websocket' | 'stdio' {
    switch (type.toLowerCase()) {
      case 'http':
        return 'http';
      case 'https':
        return 'https';
      case 'websocket':
      case 'ws':
        return 'websocket';
      case 'stdio':
        return 'stdio';
      default:
        this.warnings.push(`Unknown connection type '${type}', defaulting to 'http'`);
        return 'http';
    }
  }

  private convertUrl(url: string): string {
    // Check if URL contains hardcoded IP that should be environment variable
    if (url.match(/\d+\.\d+\.\d+\.\d+/)) {
      const envVarName = 'MCP_SERVER_URL';
      this.secrets.set(envVarName, url);
      this.warnings.push(`Converted hardcoded URL to environment variable '${envVarName}'`);
      return `\${${envVarName}}`;
    }
    return url;
  }

  private isSecret(headerName: string, headerValue: string): boolean {
    const secretHeaders = ['x-api-key', 'authorization', 'x-auth-token', 'x-secret'];
    const secretPatterns = [
      /^[a-zA-Z0-9+/]{20,}={0,2}$/, // Base64-like
      /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{}|;':",./<>?]{16,}$/, // Complex password-like
      /^Bearer\s+/, // Bearer tokens
      /^Basic\s+/, // Basic auth
    ];

    // Check header name
    if (secretHeaders.includes(headerName.toLowerCase())) {
      return true;
    }

    // Check header value patterns
    return secretPatterns.some(pattern => pattern.test(headerValue));
  }

  private generateEnvVarName(headerName: string): string {
    return `MCP_${headerName.toUpperCase().replace(/-/g, '_')}`;
  }

  private extractSecrets(config: MCPConfiguration): void {
    // Additional secret extraction logic can be added here
    // For example, extracting URLs, database connections, etc.
  }

  private async writeNewConfiguration(
    config: MCPConfiguration,
    outputDir: string,
    environment: Environment
  ): Promise<void> {
    await fs.mkdir(outputDir, { recursive: true });
    
    const filename = `mcp.${environment}.json`;
    const filepath = path.join(outputDir, filename);
    
    await fs.writeFile(filepath, JSON.stringify(config, null, 2), 'utf-8');
    console.log(`📝 Configuration written to: ${filepath}`);
  }

  private async writeEnvironmentFile(outputDir: string, environment: Environment): Promise<void> {
    if (this.secrets.size === 0) {
      return;
    }

    const envContent = Array.from(this.secrets.entries())
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    const filename = `.env.${environment}`;
    const filepath = path.join(outputDir, filename);
    
    await fs.writeFile(filepath, envContent + '\n', 'utf-8');
    console.log(`🔐 Environment variables written to: ${filepath}`);
    console.log('⚠️  Remember to secure this file and add it to .gitignore!');
  }

  private async writeMigrationReport(outputDir: string): Promise<void> {
    const report = {
      migrationDate: new Date().toISOString(),
      secretsExtracted: this.secrets.size,
      warnings: this.warnings,
      nextSteps: [
        'Review the generated configuration files',
        'Set up environment variables in your deployment system',
        'Test the new configuration in a development environment',
        'Update your application to use the new MCPConfigManager',
        'Remove the old configuration file after successful migration'
      ]
    };

    const filepath = path.join(outputDir, 'migration-report.json');
    await fs.writeFile(filepath, JSON.stringify(report, null, 2), 'utf-8');
    console.log(`📊 Migration report written to: ${filepath}`);
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
MCP Configuration Migration Tool

Usage: node migrate-config.js [options]

Options:
  --input <path>        Path to legacy configuration file (required)
  --output <dir>        Output directory for new configuration (default: ./config)
  --environment <env>   Target environment: development|staging|production (default: production)
  --extract-secrets     Extract secrets to environment variables (default: true)
  --validate            Validate connections after migration (default: false)
  --help, -h           Show this help message

Examples:
  node migrate-config.js --input ./mcp_config.json --output ./config --environment production
  node migrate-config.js --input ./old-config.json --output ./new-config --extract-secrets
`);
    process.exit(0);
  }

  const options: MigrationOptions = {
    inputPath: '',
    outputDir: './config',
    environment: 'production',
    extractSecrets: true,
    validateConnections: false
  };

  // Parse command line arguments
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--input':
        options.inputPath = args[++i];
        break;
      case '--output':
        options.outputDir = args[++i];
        break;
      case '--environment':
        const env = args[++i] as Environment;
        if (!['development', 'staging', 'production'].includes(env)) {
          console.error('❌ Invalid environment. Must be: development, staging, or production');
          process.exit(1);
        }
        options.environment = env;
        break;
      case '--extract-secrets':
        options.extractSecrets = true;
        break;
      case '--no-extract-secrets':
        options.extractSecrets = false;
        break;
      case '--validate':
        options.validateConnections = true;
        break;
    }
  }

  if (!options.inputPath) {
    console.error('❌ Input path is required. Use --input <path>');
    process.exit(1);
  }

  const migrator = new MCPConfigMigrator();
  await migrator.migrate(options);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { MCPConfigMigrator };