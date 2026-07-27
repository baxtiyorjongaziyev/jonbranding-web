import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import * as fs from "fs";
import * as path from "path";

// Create server instance
const server = new Server(
  {
    name: "jonbranding-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_master_context",
        description: "Retrieves the JonBranding Master Context file which contains all business information, goals, and values.",
        inputSchema: {
          type: "object",
          properties: {},
          required: [],
        },
      },
      {
        name: "get_agent_roles",
        description: "Retrieves the definitions for different AI agent roles (Sales, PM, Content, etc.).",
        inputSchema: {
          type: "object",
          properties: {},
          required: [],
        },
      },
      {
        name: "create_lead",
        description: "Creates a new lead in CRM (Currently stubbed to log in a local file).",
        inputSchema: {
          type: "object",
          properties: {
            name: { type: "string" },
            phone: { type: "string" },
            source: { type: "string" }
          },
          required: ["name", "phone"],
        },
      },
      {
        name: "create_task",
        description: "Creates a new task in PM system (Currently stubbed to log in a local file).",
        inputSchema: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            assignee: { type: "string" }
          },
          required: ["title"],
        },
      },
      {
        name: "search_obsidian",
        description: "Searches for notes in the Obsidian vault by keyword.",
        inputSchema: {
          type: "object",
          properties: {
            keyword: { type: "string" }
          },
          required: ["keyword"],
        }
      },
      {
        name: "read_note",
        description: "Reads the content of a specific note from the Obsidian vault.",
        inputSchema: {
          type: "object",
          properties: {
            filename: { type: "string", description: "Name of the file including .md extension" }
          },
          required: ["filename"],
        }
      },
      {
        name: "create_note",
        description: "Creates a new note in the Obsidian vault.",
        inputSchema: {
          type: "object",
          properties: {
            filename: { type: "string", description: "Name of the file including .md extension" },
            content: { type: "string" }
          },
          required: ["filename", "content"],
        }
      },
      {
        name: "append_to_note",
        description: "Appends text to an existing note in the Obsidian vault.",
        inputSchema: {
          type: "object",
          properties: {
            filename: { type: "string", description: "Name of the file including .md extension" },
            content: { type: "string" }
          },
          required: ["filename", "content"],
        }
      }
    ],
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const rootDir = path.resolve(__dirname, "../../");
  const memoryPackDir = path.join(rootDir, "jonbranding_ai_memory_pack/jonbranding_ai_memory_pack");

  switch (request.params.name) {
    case "get_master_context": {
      const filePath = path.join(memoryPackDir, "01_JonBranding_Master_Context.md");
      try {
        const content = fs.readFileSync(filePath, "utf-8");
        return {
          content: [{ type: "text", text: content }],
        };
      } catch (error: any) {
        return {
          content: [{ type: "text", text: `Error reading Master Context: ${error.message}` }],
          isError: true,
        };
      }
    }

    case "get_agent_roles": {
      const filePath = path.join(memoryPackDir, "07_AI_Agent_Roles.md");
      try {
        const content = fs.readFileSync(filePath, "utf-8");
        return {
          content: [{ type: "text", text: content }],
        };
      } catch (error: any) {
        return {
          content: [{ type: "text", text: `Error reading Agent Roles: ${error.message}` }],
          isError: true,
        };
      }
    }

    case "create_lead": {
      const args = request.params.arguments as any;
      const logFile = path.join(rootDir, "crm-leads.log");
      const logEntry = `[${new Date().toISOString()}] NEW LEAD: ${args.name} | ${args.phone} | Source: ${args.source || 'N/A'}\n`;
      fs.appendFileSync(logFile, logEntry);
      return {
        content: [{ type: "text", text: `Successfully created lead for ${args.name}. Logged to crm-leads.log (Stub)` }],
      };
    }

    case "create_task": {
      const args = request.params.arguments as any;
      const logFile = path.join(rootDir, "pm-tasks.log");
      const logEntry = `[${new Date().toISOString()}] NEW TASK: ${args.title} | Assignee: ${args.assignee || 'Unassigned'} | Desc: ${args.description || ''}\n`;
      fs.appendFileSync(logFile, logEntry);
      return {
        content: [{ type: "text", text: `Successfully created task: ${args.title}. Logged to pm-tasks.log (Stub)` }],
      };
    }

    case "search_obsidian": {
      const args = request.params.arguments as any;
      const vaultPath = path.join(rootDir, "obsidian-vault");
      if (!fs.existsSync(vaultPath)) fs.mkdirSync(vaultPath);
      const files = fs.readdirSync(vaultPath).filter(f => f.endsWith('.md'));
      let results = "";
      for (const file of files) {
        const content = fs.readFileSync(path.join(vaultPath, file), "utf-8");
        if (content.toLowerCase().includes(args.keyword.toLowerCase())) {
          results += `- ${file}\n`;
        }
      }
      return {
        content: [{ type: "text", text: results ? `Found in notes:\n${results}` : "No notes found matching the keyword." }]
      };
    }

    case "read_note": {
      const args = request.params.arguments as any;
      const filePath = path.join(rootDir, "obsidian-vault", args.filename);
      if (!fs.existsSync(filePath)) {
        return { content: [{ type: "text", text: "Note not found." }], isError: true };
      }
      const content = fs.readFileSync(filePath, "utf-8");
      return { content: [{ type: "text", text: content }] };
    }

    case "create_note": {
      const args = request.params.arguments as any;
      const filePath = path.join(rootDir, "obsidian-vault", args.filename);
      fs.writeFileSync(filePath, args.content);
      return { content: [{ type: "text", text: `Note ${args.filename} created successfully.` }] };
    }

    case "append_to_note": {
      const args = request.params.arguments as any;
      const filePath = path.join(rootDir, "obsidian-vault", args.filename);
      if (!fs.existsSync(filePath)) {
        return { content: [{ type: "text", text: "Note not found." }], isError: true };
      }
      fs.appendFileSync(filePath, "\n" + args.content);
      return { content: [{ type: "text", text: `Appended to ${args.filename} successfully.` }] };
    }

    default:
      throw new Error(`Unknown tool: ${request.params.name}`);
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("JonBranding MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
