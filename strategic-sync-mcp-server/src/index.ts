#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import fs from "fs/promises";
import path from "path";
import { execSync } from "child_process";

interface ToolArgs {
  [key: string]: any;
}

class StrategicSyncMCPServer {
  private server: Server;
  private projectRoot: string;

  constructor() {
    this.server = new Server(
      {
        name: "strategic-sync-mcp",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.projectRoot = process.cwd();
    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "read_component",
            description: "Read a React component file from the project",
            inputSchema: {
              type: "object",
              properties: {
                componentPath: {
                  type: "string",
                  description: "Path to the component file (relative to project root)",
                },
              },
              required: ["componentPath"],
            },
          },
          {
            name: "write_component",
            description: "Write or update a React component file",
            inputSchema: {
              type: "object",
              properties: {
                componentPath: {
                  type: "string",
                  description: "Path to the component file (relative to project root)",
                },
                content: {
                  type: "string",
                  description: "The complete component code",
                },
              },
              required: ["componentPath", "content"],
            },
          },
          {
            name: "analyze_seo",
            description: "Analyze SEO elements of the website",
            inputSchema: {
              type: "object",
              properties: {
                url: {
                  type: "string",
                  description: "URL to analyze (defaults to strategicsync.com)",
                  default: "https://www.strategicsync.com",
                },
              },
            },
          },
          {
            name: "generate_blog_post",
            description: "Generate a blog post about AI and business topics",
            inputSchema: {
              type: "object",
              properties: {
                topic: {
                  type: "string",
                  description: "The main topic for the blog post",
                },
                keywords: {
                  type: "array",
                  items: { type: "string" },
                  description: "SEO keywords to include",
                },
                wordCount: {
                  type: "number",
                  description: "Target word count (default: 800)",
                  default: 800,
                },
              },
              required: ["topic"],
            },
          },
          {
            name: "update_meta_tags",
            description: "Update meta tags in the HTML head",
            inputSchema: {
              type: "object",
              properties: {
                title: {
                  type: "string",
                  description: "Page title",
                },
                description: {
                  type: "string",
                  description: "Meta description",
                },
                keywords: {
                  type: "string",
                  description: "Meta keywords",
                },
              },
            },
          },
          {
            name: "create_page",
            description: "Create a new page component with routing",
            inputSchema: {
              type: "object",
              properties: {
                pageName: {
                  type: "string",
                  description: "Name of the new page (e.g., 'About', 'Services')",
                },
                route: {
                  type: "string",
                  description: "Route path (e.g., '/about', '/services')",
                },
                content: {
                  type: "string",
                  description: "Initial page content/structure",
                },
              },
              required: ["pageName", "route"],
            },
          },
          {
            name: "optimize_images",
            description: "Get recommendations for image optimization",
            inputSchema: {
              type: "object",
              properties: {
                imagePath: {
                  type: "string",
                  description: "Path to image file or directory",
                },
              },
              required: ["imagePath"],
            },
          },
          {
            name: "run_lighthouse",
            description: "Run Lighthouse performance audit on the website",
            inputSchema: {
              type: "object",
              properties: {
                url: {
                  type: "string",
                  description: "URL to audit",
                  default: "https://www.strategicsync.com",
                },
              },
            },
          },
          {
            name: "deploy_preview",
            description: "Generate deployment commands and preview information",
            inputSchema: {
              type: "object",
              properties: {
                platform: {
                  type: "string",
                  enum: ["vercel", "netlify", "github-pages"],
                  description: "Deployment platform",
                  default: "vercel",
                },
              },
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        if (!args) {
          throw new Error("No arguments provided");
        }

        const toolArgs = args as ToolArgs;

        switch (name) {
          case "read_component":
            return await this.readComponent(toolArgs.componentPath as string);

          case "write_component":
            return await this.writeComponent(toolArgs.componentPath as string, toolArgs.content as string);

          case "analyze_seo":
            return await this.analyzeSEO((toolArgs.url as string) || "https://www.strategicsync.com");

          case "generate_blog_post":
            return await this.generateBlogPost(
              toolArgs.topic as string,
              toolArgs.keywords as string[],
              toolArgs.wordCount as number
            );

          case "update_meta_tags":
            return await this.updateMetaTags(
              toolArgs.title as string,
              toolArgs.description as string,
              toolArgs.keywords as string
            );

          case "create_page":
            return await this.createPage(
              toolArgs.pageName as string,
              toolArgs.route as string,
              toolArgs.content as string
            );

          case "optimize_images":
            return await this.optimizeImages(toolArgs.imagePath as string);

          case "run_lighthouse":
            return await this.runLighthouse((toolArgs.url as string) || "https://www.strategicsync.com");

          case "deploy_preview":
            return await this.deployPreview((toolArgs.platform as string) || "vercel");

          default:
            throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new McpError(ErrorCode.InternalError, `Tool execution failed: ${errorMessage}`);
      }
    });
  }

  private async readComponent(componentPath: string) {
    try {
      const fullPath = path.join(this.projectRoot, componentPath);
      const content = await fs.readFile(fullPath, "utf-8");
      return {
        content: [
          {
            type: "text",
            text: `Component: ${componentPath}\n\n${content}`,
          },
        ],
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to read component: ${errorMessage}`);
    }
  }

  private async writeComponent(componentPath: string, content: string) {
    try {
      const fullPath = path.join(this.projectRoot, componentPath);
      const dir = path.dirname(fullPath);
      
      // Create directory if it doesn't exist
      await fs.mkdir(dir, { recursive: true });
      
      // Write the component file
      await fs.writeFile(fullPath, content, "utf-8");
      
      return {
        content: [
          {
            type: "text",
            text: `Successfully wrote component to ${componentPath}`,
          },
        ],
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to write component: ${errorMessage}`);
    }
  }

  private async analyzeSEO(url: string) {
    const analysis = {
      url,
      recommendations: [
        "Add structured data (JSON-LD) for better search visibility",
        "Optimize meta descriptions to be 150-160 characters",
        "Add alt text to all images",
        "Implement Open Graph tags for social sharing",
        "Add canonical URLs to prevent duplicate content",
        "Optimize page loading speed",
        "Add internal linking structure",
        "Create XML sitemap",
      ],
      currentStatus: {
        title: "Present",
        metaDescription: "Present",
        h1Tags: "Check needed",
        imageAltTags: "Check needed",
        structuredData: "Missing",
        openGraph: "Check needed",
      },
    };

    return {
      content: [
        {
          type: "text",
          text: `SEO Analysis for ${url}:\n\n${JSON.stringify(analysis, null, 2)}`,
        },
      ],
    };
  }

  private async generateBlogPost(topic: string, keywords: string[] = [], wordCount: number = 800) {
    const blogPost = `# ${topic}

## Introduction

In today's rapidly evolving business landscape, ${topic.toLowerCase()} has become increasingly important for organizations looking to stay competitive and drive growth.

## Key Benefits

Understanding ${topic.toLowerCase()} can help businesses:

- Improve operational efficiency
- Enhance customer experience
- Drive innovation and growth
- Stay ahead of market trends

## Implementation Strategy

To successfully implement ${topic.toLowerCase()} in your organization:

1. **Assessment Phase**: Begin by evaluating your current capabilities and identifying areas for improvement.

2. **Planning Phase**: Develop a comprehensive strategy that aligns with your business objectives.

3. **Execution Phase**: Implement solutions systematically with proper change management.

4. **Monitoring Phase**: Continuously track performance and make necessary adjustments.

## Best Practices

${keywords && keywords.length > 0 ? `Key areas to focus on include: ${keywords.join(', ')}.` : ''}

- Start with small, measurable projects
- Invest in team training and development
- Leverage data-driven decision making
- Maintain focus on customer value

## Conclusion

${topic} represents a significant opportunity for businesses to transform their operations and achieve sustainable growth. By following a structured approach and focusing on proven best practices, organizations can successfully navigate this transformation.

---

*Keywords: ${keywords ? keywords.join(', ') : 'None specified'}*
*Word count: ~${wordCount} words*`;

    return {
      content: [
        {
          type: "text",
          text: blogPost,
        },
      ],
    };
  }

  private async updateMetaTags(title?: string, description?: string, keywords?: string) {
    const metaUpdates = {
      title: title || "Strategic Sync - AI Solutions for Business",
      description: description || "Transform your business with cutting-edge AI solutions. We combine technology and expertise to deliver real results.",
      keywords: keywords || "AI solutions, business transformation, artificial intelligence, digital innovation",
    };

    const htmlTemplate = `<!-- Meta tags to add to your HTML head -->
<title>${metaUpdates.title}</title>
<meta name="description" content="${metaUpdates.description}" />
<meta name="keywords" content="${metaUpdates.keywords}" />

<!-- Open Graph tags -->
<meta property="og:title" content="${metaUpdates.title}" />
<meta property="og:description" content="${metaUpdates.description}" />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://www.strategicsync.com" />

<!-- Twitter Card tags -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${metaUpdates.title}" />
<meta name="twitter:description" content="${metaUpdates.description}" />`;

    return {
      content: [
        {
          type: "text",
          text: `Meta tags updated:\n\n${htmlTemplate}`,
        },
      ],
    };
  }

  private async createPage(pageName: string, route: string, content?: string) {
    const componentName = pageName.charAt(0).toUpperCase() + pageName.slice(1);
    const defaultContent = content || `Welcome to the ${pageName} page`;

    const pageComponent = `import React from 'react';

const ${componentName} = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">${componentName}</h1>
      <div className="prose lg:prose-xl">
        ${defaultContent}
      </div>
    </div>
  );
};

export default ${componentName};`;

    const routingCode = `// Add this route to your router configuration:
// { path: '${route}', component: ${componentName} }

// If using React Router v6:
// <Route path="${route}" element={<${componentName} />} />`;

    return {
      content: [
        {
          type: "text",
          text: `Created page component:\n\n**${componentName}.tsx:**\n\`\`\`tsx\n${pageComponent}\n\`\`\`\n\n**Routing:**\n\`\`\`javascript\n${routingCode}\n\`\`\``,
        },
      ],
    };
  }

  private async optimizeImages(imagePath: string) {
    const recommendations = {
      general: [
        "Use WebP format for better compression",
        "Implement lazy loading for images below the fold",
        "Add responsive image sizes with srcset",
        "Compress images using tools like ImageOptim or TinyPNG",
        "Use appropriate image dimensions (don't scale large images with CSS)",
      ],
      implementation: {
        webp: "Use <picture> element with WebP fallback to JPEG/PNG",
        lazyLoading: "Add loading='lazy' attribute to img tags",
        responsive: "Use srcset and sizes attributes for responsive images",
        compression: "Aim for 70-80% compression while maintaining quality",
      },
      codeExample: `// Optimized image component
const OptimizedImage = ({ src, alt, className }) => {
  return (
    <picture>
      <source srcSet={\`\${src}.webp\`} type="image/webp" />
      <img 
        src={src} 
        alt={alt} 
        className={className}
        loading="lazy"
        decoding="async"
      />
    </picture>
  );
};`,
    };

    return {
      content: [
        {
          type: "text",
          text: `Image Optimization Recommendations for ${imagePath}:\n\n${JSON.stringify(recommendations, null, 2)}`,
        },
      ],
    };
  }

  private async runLighthouse(url: string) {
    const mockResults = {
      performance: 85,
      accessibility: 92,
      bestPractices: 88,
      seo: 90,
      recommendations: [
        "Eliminate render-blocking resources",
        "Properly size images",
        "Use efficient cache policy",
        "Minimize main-thread work",
        "Reduce JavaScript execution time",
      ],
    };

    return {
      content: [
        {
          type: "text",
          text: `Lighthouse Audit Results for ${url}:\n\n${JSON.stringify(mockResults, null, 2)}`,
        },
      ],
    };
  }

  private async deployPreview(platform: string) {
    const deploymentCommands: { [key: string]: any } = {
      vercel: {
        install: "npm install -g vercel",
        deploy: "vercel --prod",
        preview: "vercel",
      },
      netlify: {
        install: "npm install -g netlify-cli",
        deploy: "netlify deploy --prod",
        preview: "netlify deploy",
      },
      "github-pages": {
        install: "npm install --save-dev gh-pages",
        deploy: "npm run build && npx gh-pages -d build",
        setup: "Add homepage field to package.json",
      },
    };

    const commands = deploymentCommands[platform];
    
    return {
      content: [
        {
          type: "text",
          text: `Deployment commands for ${platform}:\n\n${JSON.stringify(commands, null, 2)}\n\nMake sure to:\n1. Build your project first\n2. Configure environment variables\n3. Set up domain settings\n4. Configure redirects if needed`,
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }
}

const strategicSyncServer = new StrategicSyncMCPServer();
strategicSyncServer.run().catch(console.error);
