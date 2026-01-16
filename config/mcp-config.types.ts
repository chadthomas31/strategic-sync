/**
 * TypeScript interfaces for MCP Configuration
 * Provides type safety and IntelliSense support
 */

export interface MCPConfiguration {
  version: string;
  environment: Environment;
  global?: GlobalConfig;
  mcpServers: Record<string, MCPServer>;
}

export type Environment = 'development' | 'staging' | 'production';

export interface GlobalConfig {
  timeout?: number;
  retryConfig?: RetryConfig;
  logging?: LoggingConfig;
}

export interface MCPServer {
  name: string;
  type: ConnectionType;
  url: string;
  headers?: Record<string, string>;
  timeout?: number;
  description: string;
  enabled?: boolean;
  priority?: number;
  retryConfig?: RetryConfig;
  healthCheck?: HealthCheckConfig;
  fallback?: FallbackConfig;
  security?: SecurityConfig;
}

export type ConnectionType = 'http' | 'https' | 'websocket' | 'stdio';

export interface RetryConfig {
  maxAttempts?: number;
  initialDelay?: number;
  backoffMultiplier?: number;
  maxDelay?: number;
  jitter?: boolean;
}

export interface HealthCheckConfig {
  enabled?: boolean;
  interval?: number;
  timeout?: number;
  endpoint?: string;
  expectedStatus?: number;
}

export interface FallbackConfig {
  enabled?: boolean;
  serverKey?: string;
  cacheEnabled?: boolean;
  cacheTtl?: number;
}

export interface SecurityConfig {
  allowedOrigins?: string[];
  rateLimiting?: RateLimitingConfig;
  encryption?: EncryptionConfig;
}

export interface RateLimitingConfig {
  enabled?: boolean;
  requestsPerMinute?: number;
}

export interface EncryptionConfig {
  enabled?: boolean;
  algorithm?: 'AES-256-GCM' | 'AES-128-GCM';
}

export interface LoggingConfig {
  level?: 'error' | 'warn' | 'info' | 'debug';
  format?: 'json' | 'text';
  auditEnabled?: boolean;
}

// Runtime validation interfaces
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  path: string;
  message: string;
  code: string;
  severity: 'error';
}

export interface ValidationWarning {
  path: string;
  message: string;
  code: string;
  severity: 'warning';
}

// Connection status interfaces
export interface ConnectionStatus {
  serverKey: string;
  status: 'connected' | 'disconnected' | 'error' | 'unknown';
  lastChecked: Date;
  responseTime?: number;
  error?: string;
}

export interface MCPConnectionPool {
  primary: MCPConnection;
  fallback?: MCPConnection;
  cache?: ResponseCache;
}

export interface MCPConnection {
  server: MCPServer;
  status: ConnectionStatus;
  client: any; // MCP client instance
}

export interface ResponseCache {
  get(key: string): Promise<any>;
  set(key: string, value: any, ttl?: number): Promise<void>;
  clear(): Promise<void>;
}

// Configuration loading options
export interface ConfigLoadOptions {
  environment?: Environment;
  configPath?: string;
  validateConnections?: boolean;
  enableCache?: boolean;
  secretsProvider?: SecretsProvider;
}

export interface SecretsProvider {
  getSecret(key: string): Promise<string>;
  setSecret(key: string, value: string): Promise<void>;
}

// Error types
export class MCPConfigError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'MCPConfigError';
  }
}

export class MCPValidationError extends MCPConfigError {
  constructor(
    message: string,
    public validationErrors: ValidationError[]
  ) {
    super(message, 'VALIDATION_ERROR', validationErrors);
    this.name = 'MCPValidationError';
  }
}

export class MCPConnectionError extends MCPConfigError {
  constructor(
    message: string,
    public serverKey: string,
    public originalError?: Error
  ) {
    super(message, 'CONNECTION_ERROR', { serverKey, originalError });
    this.name = 'MCPConnectionError';
  }
}

// Type guards
export function isMCPServer(obj: any): obj is MCPServer {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.name === 'string' &&
    typeof obj.type === 'string' &&
    typeof obj.url === 'string' &&
    typeof obj.description === 'string'
  );
}

export function isValidEnvironment(env: string): env is Environment {
  return ['development', 'staging', 'production'].includes(env);
}

export function isValidConnectionType(type: string): type is ConnectionType {
  return ['http', 'https', 'websocket', 'stdio'].includes(type);
}

// Default configurations
export const DEFAULT_GLOBAL_CONFIG: Required<GlobalConfig> = {
  timeout: 30000,
  retryConfig: {
    maxAttempts: 3,
    initialDelay: 1000,
    backoffMultiplier: 2.0,
    maxDelay: 30000,
    jitter: true
  },
  logging: {
    level: 'info',
    format: 'json',
    auditEnabled: true
  }
};

export const DEFAULT_RETRY_CONFIG: Required<RetryConfig> = {
  maxAttempts: 3,
  initialDelay: 1000,
  backoffMultiplier: 2.0,
  maxDelay: 30000,
  jitter: true
};

export const DEFAULT_HEALTH_CHECK_CONFIG: Required<HealthCheckConfig> = {
  enabled: true,
  interval: 30000,
  timeout: 5000,
  endpoint: '/health',
  expectedStatus: 200
};

export const DEFAULT_FALLBACK_CONFIG: Required<FallbackConfig> = {
  enabled: true,
  serverKey: '',
  cacheEnabled: false,
  cacheTtl: 300000
};