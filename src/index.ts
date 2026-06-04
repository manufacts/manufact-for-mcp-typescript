import express from "express";
import {
  registerAppResource,
  registerAppTool,
  RESOURCE_MIME_TYPE,
} from "@modelcontextprotocol/ext-apps/server";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";

const FIXTURE_NAME = "mcp-detect-mcp-typescript";
const FRAMEWORK_INSTRUCTIONS =
  "Smoke-test fixture for official MCP TypeScript SDK framework detection (MCP Apps).";
const VIEW_URI = `ui://${FIXTURE_NAME}/greet.html`;

// Self-contained MCP Apps view: connects to the host and renders the latest
// tool result. Loads the ext-apps app-bridge from esm.sh so the HTML works
// without a separate bundle step.
const VIEW_HTML = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Greet</title>
  <style>
    :root { color-scheme: light dark; }
    body { font:16px/1.4 system-ui, sans-serif; padding: 24px; margin: 0; }
    h1 { margin: 0 0 8px; }
    .meta { color: #666; font-size: 13px; margin-top: 12px; }
  </style>
</head>
<body>
  <h1 id="greeting">Greeting view loaded.</h1>
  <p id="hint" class="meta">Call the <code>greet_widget</code> tool to populate this view.</p>
  <script type="module">
    import { App } from "https://esm.sh/@modelcontextprotocol/ext-apps@1";
    const app = new App({ name: "${FIXTURE_NAME}-greet", version: "0.1.0" });
    app.ontoolresult = (result) => {
      const text = (result?.content ?? []).find((c) => c.type === "text")?.text;
      const struct = result?.structuredContent;
      const heading = document.getElementById("greeting");
      const hint = document.getElementById("hint");
      if (text) heading.textContent = text;
      if (struct && struct.name) hint.textContent = "props.name = " + struct.name;
    };
    app.connect();
  </script>
</body>
</html>`;

function getServer() {
  const server = new McpServer(
    { name: FIXTURE_NAME, version: "0.1.0" },
    { capabilities: { tools: {}, resources: {} } },
  );

  registerAppResource(
    server,
    "Greet view",
    VIEW_URI,
    { mimeType: RESOURCE_MIME_TYPE },
    async () => ({
      contents: [{ uri: VIEW_URI, mimeType: RESOURCE_MIME_TYPE, text: VIEW_HTML }],
    }),
  );

  registerAppTool(
    server,
    "echo",
    {
      title: "Echo",
      description: "Echo the input back as text.",
      inputSchema: { text: z.string().describe("Text to echo") },
      _meta: {},
    },
    async ({ text }) => ({ content: [{ type: "text", text }] }),
  );

  registerAppTool(
    server,
    "greet_widget",
    {
      title: "Greet (widget)",
      description: "Greet someone and render an MCP App view.",
      inputSchema: { name: z.string().describe("Name to greet") },
      _meta: { ui: { resourceUri: VIEW_URI } },
    },
    async ({ name }) => ({
      content: [{ type: "text", text: `Hello, ${name}!` }],
      structuredContent: { name },
    }),
  );

  return server;
}

const app = express();
app.use(express.json());

app.post("/mcp", async (req, res) => {
  try {
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });
    const server = getServer();
    res.on("close", () => {
      transport.close();
      server.close();
    });
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (err) {
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        id: null,
        error: { code: -32603, message: String(err) },
      });
    }
  }
});

app.get("/mcp", (_req, res) => {
  res.status(405).json({
    jsonrpc: "2.0",
    id: null,
    error: { code: -32000, message: "Method not allowed." },
  });
});

const port = Number(process.env.PORT ?? "3000");
app.listen(port, "0.0.0.0", () => {
  console.log(`[${FIXTURE_NAME}] ${FRAMEWORK_INSTRUCTIONS} listening on :${port}/mcp`);
});
