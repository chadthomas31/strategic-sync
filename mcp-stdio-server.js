#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { context7 } from './utils/context7.js';

class StrategicSyncMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'strategic-sync-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  setupErrorHandling() {
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'add_memory',
            description: 'Add a new memory/context to the system',
            inputSchema: {
              type: 'object',
              properties: {
                key: {
                  type: 'string',
                  description: 'The key/identifier for the memory',
                },
                value: {
                  type: 'string',
                  description: 'The value/content to store',
                },
                metadata: {
                  type: 'object',
                  description: 'Optional metadata for the memory',
                },
              },
              required: ['key', 'value'],
            },
          },
          {
            name: 'get_memories',
            description: 'Retrieve memories by key',
            inputSchema: {
              type: 'object',
              properties: {
                key: {
                  type: 'string',
                  description: 'The key to search for',
                },
              },
              required: ['key'],
            },
          },
          {
            name: 'get_latest_memory',
            description: 'Get the most recent memory for a key',
            inputSchema: {
              type: 'object',
              properties: {
                key: {
                  type: 'string',
                  description: 'The key to search for',
                },
              },
              required: ['key'],
            },
          },
          {
            name: 'list_all_memories',
            description: 'List all stored memories',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'clear_memories',
            description: 'Clear all stored memories',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'add_memory': {
            const { key, value, metadata } = args;
            if (!key || !value) {
              throw new McpError(
                ErrorCode.InvalidParams,
                'Key and value are required'
              );
            }
            const context = await context7.addContext(key, value, metadata);
            return {
              content: [
                {
                  type: 'text',
                  text: `Memory added successfully: ${JSON.stringify(context, null, 2)}`,
                },
              ],
            };
          }

          case 'get_memories': {
            const { key } = args;
            if (!key) {
              throw new McpError(ErrorCode.InvalidParams, 'Key is required');
            }
            const contexts = await context7.getContexts(key);
            return {
              content: [
                {
                  type: 'text',
                  text: `Found ${contexts.length} memories for key "${key}":\n${JSON.stringify(contexts, null, 2)}`,
                },
              ],
            };
          }

          case 'get_latest_memory': {
            const { key } = args;
            if (!key) {
              throw new McpError(ErrorCode.InvalidParams, 'Key is required');
            }
            const context = await context7.getLatestContext(key);
            return {
              content: [
                {
                  type: 'text',
                  text: context
                    ? `Latest memory for "${key}":\n${JSON.stringify(context, null, 2)}`
                    : `No memory found for key "${key}"`,
                },
              ],
            };
          }

          case 'list_all_memories': {
            const contexts = await context7.getAllContexts();
            return {
              content: [
                {
                  type: 'text',
                  text: `All memories (${contexts.length} total):\n${JSON.stringify(contexts, null, 2)}`,
                },
              ],
            };
          }

          case 'clear_memories': {
            await context7.clearContexts();
            return {
              content: [
                {
                  type: 'text',
                  text: 'All memories cleared successfully',
                },
              ],
            };
          }

          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${name}`
            );
        }
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }
        throw new McpError(
          ErrorCode.InternalError,
          `Tool execution failed: ${error.message}`
        );
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Strategic Sync MCP Server running on stdio');
  }
}

const server = new StrategicSyncMCPServer();
server.run().catch(console.error);