/**
 * MCP Configuration Manager
 * Handles loading, validation, and management of MCP server configurations
 */

import fs from 'fs/promises';
import path from 'path';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import {
  MCPConfiguration,
  MCPServer,
  Environment,
  ConfigLoadOptions,
  ValidationResult,
  ValidationError,
  ValidationWarning,
  ConnectionStatus,
  MCPConnectionPool,
  MCPConfigError,
  MCPValidationError,
  MCPConnectionError,
  DEFAULT_GLOBAL_CONFIG,
  isValidEnvironment,
  isMCPServer
} from './mcp-config.types.js';

export class MCPConfigManager {
  private static instance: MCPConfigManager;
  private config: MCPConfiguration | null = null;
  private connectionPools: Map<string, MCPConnectionPool> = new Map();
  private ajv: Ajv;
  private schema: any;

  private constructor() {
    this.ajv = new Ajv({ allErrors: true, verbose: true });
    addFormats(this.ajv);
  }

  public static getInstance(): MCPConfigManager {
    if (!MCPConfigManager.instance) {
      MCPConfigManager.instance = new MCPConfigManager();
    }
    return MCPConfigManager.instance;
  }

  /**
   * Load MCP configuration from file or environment
   */
  public async load(options: ConfigLoadOptions = {}): Promise<MCPConfiguration> {
    try {
      // Load schema
      await this.loadSchema();

      // Determine environment
      const environment = this.determineEnvironment(options.environment);

      // Load configuration
      const rawConfig = await this.loadConfigurationFile(options.configPath, environment);

      // Process environment variables
      const processedConfig = this.processEnvironmentVariables(rawConfig);

      // Validate configuration
      const validationResult = await this.validateConfiguration(processedConfig);
      if (!validationResult.isValid) {
        throw new MCPValidationError(
          'Configuration validation failed',
          validationResult.errors
        );
      }

      // Log warnings
      if (validationResult.warnings.length > 0) {
        console.warn('Configuration warnings:', validationResult.warnings);
      }

      // Apply defaults
      const configWithDefaults = this.applyDefaults(processedConfig);

      // Test connections if requested
      if (options.validateConnections) {
        await this.validateConnections(configWithDefaults);
      }

      this.config = configWithDefaults;
      return this.config;

    } catch (error) {
      if (error instanceof MCPConfigError) {
        throw error;
      }
      throw new MCPConfigError(
        `Failed to load MCP configuration: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'LOAD_ERROR',
        error
      );
    }
  }

  /**
   * Get current configuration
   */
  public getConfig(): MCPConfiguration {
    if (!this.config) {
      throw new MCPConfigError('Configuration not loaded', 'CONFIG_NOT_LOADED');
    }
    return this.config;
  }

  /**
   * Get server configuration by key
   */
  public getServer(serverKey: string): MCPServer {
    const config = this.getConfig();
    const server = config.mcpServers[serverKey];
    if (!server) {
      throw new MCPConfigError(`Server '${serverKey}' not found`, 'SERVER_NOT_FOUND');
    }
    return server;
  }

  /**
   * Get all enabled servers sorted by priority
   */
  public getEnabledServers(): Array<{ key: string; server: MCPServer }> {
    const config = this.getConfig();
    return Object.entries(config.mcpServers)
      .filter(([_, server]) => server.enabled !== false)
      .map(([key, server]) => ({ key, server }))
      .sort((a, b) => (a.server.priority || 50) - (b.server.priority || 50));
  }

  /**
   * Get connection status for all servers
   */
  public async getConnectionStatuses(): Promise<Record<string, ConnectionStatus>> {
    const servers = this.getEnabledServers();
    const statuses: Record<string, ConnectionStatus> = {};

    await Promise.all(
      servers.map(async ({ key, server }) => {
        try {
          statuses[key] = await this.checkServerHealth(key, server);
        } catch (error) {
          statuses[key] = {
            serverKey: key,
            status: 'error',
            lastChecked: new Date(),
            error: error instanceof Error ? error.message : 'Unknown error'
          };
        }
      })
    );

    return statuses;
  }

  /**
   * Reload configuration
   */
  public async reload(options: ConfigLoadOptions = {}): Promise<MCPConfiguration> {
    this.config = null;
    this.connectionPools.clear();
    return this.load(options);
  }

  /**
   * Validate configuration against schema
   */
  private async validateConfiguration(config: any): Promise<ValidationResult> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // JSON Schema validation
    const valid = this.ajv.validate(this.schema, config);
    if (!valid && this.ajv.errors) {
      for (const error of this.ajv.errors) {
        errors.push({
          path: error.instancePath || 'root',
          message: error.message || 'Validation error',
          code: error.keyword || 'unknown',
          severity: 'error'
        });
      }
    }

    // Custom business logic validation
    await this.validateBusinessRules(config, errors, warnings);

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Custom business rules validation
   */
  private async validateBusinessRules(
    config: any,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): Promise<void> {
    // Validate server configurations
    if (config.mcpServers) {
      for (const [key, server] of Object.entries(config.mcpServers)) {
        if (!isMCPServer(server)) {
          errors.push({
            path: `mcpServers.${key}`,
            message: 'Invalid server configuration',
            code: 'INVALID_SERVER',
            severity: 'error'
          });
          continue;
        }

        // Validate URLs
        try {
          new URL(server.url);
        } catch {
          errors.push({
            path: `mcpServers.${key}.url`,
            message: 'Invalid URL format',
            code: 'INVALID_URL',
            severity: 'error'
          });
        }

        // Check for security issues
        if (server.url.startsWith('http://') && config.environment === 'production') {
          warnings.push({
            path: `mcpServers.${key}.url`,
            message: 'Using HTTP in production environment is not recommended',
            code: 'INSECURE_PROTOCOL',
            severity: 'warning'
          });
        }

        // Validate fallback references
        if (server.fallback?.serverKey) {
          if (!config.mcpServers[server.fallback.serverKey]) {
            errors.push({
              path: `mcpServers.${key}.fallback.serverKey`,
              message: `Fallback server '${server.fallback.serverKey}' not found`,
              code: 'INVALID_FALLBACK',
              severity: 'error'
            });
          }
        }
      }
    }

    // Environment-specific validations
    if (config.environment === 'production') {
      // Check for development-only configurations
      for (const [key, server] of Object.entries(config.mcpServers || {})) {
        if (isMCPServer(server) && server.url.includes('localhost')) {
          warnings.push({
            path: `mcpServers.${key}.url`,
            message: 'Using localhost URL in production environment',
            code: 'LOCALHOST_IN_PROD',
            severity: 'warning'
          });
        }
      }
    }
  }

  /**
   * Load and compile JSON schema
   */
  private async loadSchema(): Promise<void> {
    try {
      const schemaPath = path.join(__dirname, 'mcp-config.schema.json');
      const schemaContent = await fs.readFile(schemaPath, 'utf-8');
      this.schema = JSON.parse(schemaContent);
      this.ajv.compile(this.schema);
    } catch (error) {
      throw new MCPConfigError(
        'Failed to load configuration schema',
        'SCHEMA_LOAD_ERROR',
        error
      );
    }
  }

  /**
   * Determine environment from various sources
   */
  private determineEnvironment(envOverride?: Environment): Environment {
    // Priority: override > MCP_ENV > NODE_ENV > default
    const env = envOverride || 
                process.env.MCP_ENV || 
                process.env.NODE_ENV || 
                'development';

    if (!isValidEnvironment(env)) {
      console.warn(`Invalid environment '${env}', defaulting to 'development'`);
      return 'development';
    }

    return env;
  }

  /**
   * Load configuration file with environment-specific overrides
   */
  private async loadConfigurationFile(
    configPath?: string,
    environment?: Environment
  ): Promise<any> {
    const basePath = configPath || path.join(process.cwd(), 'config');
    
    // Try environment-specific file first
    const envConfigPath = path.join(basePath, `mcp.${environment}.json`);
    const baseConfigPath = path.join(basePath, 'mcp.json');

    let config: any = {};

    // Load base configuration
    try {
      const baseContent = await fs.readFile(baseConfigPath, 'utf-8');
      config = JSON.parse(baseContent);
    } catch (error) {
      // Base config is optional if environment-specific exists
    }

    // Load environment-specific overrides
    try {
      const envContent = await fs.readFile(envConfigPath, 'utf-8');
      const envConfig = JSON.parse(envContent);
      config = this.mergeConfigurations(config, envConfig);
    } catch (error) {
      // Environment config is optional
    }

    // Ensure environment is set
    config.environment = environment || config.environment || 'development';

    return config;
  }

  /**
   * Process environment variable substitutions
   */
  private processEnvironmentVariables(config: any): any {
    const processed = JSON.parse(JSON.stringify(config));
    
    const processValue = (value: any): any => {
      if (typeof value === 'string') {
        // Replace ${VAR_NAME} with environment variable
        return value.replace(/\$\{([^}]+)\}/g, (match, varName) => {
          const envValue = process.env[varName];
          if (envValue === undefined) {
            throw new MCPConfigError(
              `Environment variable '${varName}' is not defined`,
              'MISSING_ENV_VAR'
            );
          }
          return envValue;
        });
      } else if (Array.isArray(value)) {
        return value.map(processValue);
      } else if (typeof value === 'object' && value !== null) {
        const result: any = {};
        for (const [key, val] of Object.entries(value)) {
          result[key] = processValue(val);
        }
        return result;
      }
      return value;
    };

    return processValue(processed);
  }

  /**
   * Apply default configurations
   */
  private applyDefaults(config: MCPConfiguration): MCPConfiguration {
    const result = { ...config };

    // Apply global defaults
    result.global = { ...DEFAULT_GLOBAL_CONFIG, ...result.global };

    // Apply server defaults
    for (const [key, server] of Object.entries(result.mcpServers)) {
      result.mcpServers[key] = {
        enabled: true,
        priority: 50,
        timeout: result.global.timeout,
        ...server
      };
    }

    return result;
  }

  /**
   * Validate connections to all enabled servers
   */
  private async validateConnections(config: MCPConfiguration): Promise<void> {
    const servers = Object.entries(config.mcpServers)
      .filter(([_, server]) => server.enabled !== false);

    const results = await Promise.allSettled(
      servers.map(([key, server]) => this.testConnection(key, server))
    );

    const failures = results
      .map((result, index) => ({ result, key: servers[index][0] }))
      .filter(({ result }) => result.status === 'rejected');

    if (failures.length > 0) {
      const errorMessages = failures.map(({ key, result }) => 
        `${key}: ${result.status === 'rejected' ? result.reason : 'Unknown error'}`
      );
      
      throw new MCPConnectionError(
        `Connection validation failed for servers: ${errorMessages.join(', ')}`,
        'multiple'
      );
    }
  }

  /**
   * Test connection to a specific server
   */
  private async testConnection(serverKey: string, server: MCPServer): Promise<void> {
    // Implementation would depend on the specific MCP client library
    // This is a placeholder for the actual connection test
    console.log(`Testing connection to ${serverKey}: ${server.url}`);
    
    // Simulate connection test
    if (server.url.includes('invalid')) {
      throw new Error('Invalid server URL');
    }
  }

  /**
   * Check server health
   */
  private async checkServerHealth(serverKey: string, server: MCPServer): Promise<ConnectionStatus> {
    const startTime = Date.now();
    
    try {
      // Implementation would depend on the specific MCP client library
      // This is a placeholder for the actual health check
      
      return {
        serverKey,
        status: 'connected',
        lastChecked: new Date(),
        responseTime: Date.now() - startTime
      };
    } catch (error) {
      return {
        serverKey,
        status: 'error',
        lastChecked: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Merge two configuration objects
   */
  private mergeConfigurations(base: any, override: any): any {
    const result = { ...base };
    
    for (const [key, value] of Object.entries(override)) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        result[key] = this.mergeConfigurations(result[key] || {}, value);
      } else {
        result[key] = value;
      }
    }
    
    return result;
  }
}

// Export singleton instance
export const mcpConfigManager = MCPConfigManager.getInstance();