import * as http from "node:http";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";

const sdkServer = new Server(
  { name: "mcp-detect-mcp-typescript", version: "0.1.0" },
  { capabilities: {} },
);

const port = Number(process.env.PORT ?? "3000");

http
  .createServer(async (req, res) => {
    const chunks: Buffer[] = [];
    for await (const c of req) chunks.push(c as Buffer);
    const bodyText = Buffer.concat(chunks).toString("utf8");
    if (req.url === "/mcp" && req.method === "POST") {
      let id: unknown = null;
      try {
        const parsed = JSON.parse(bodyText) as { id?: unknown };
        id = parsed?.id ?? null;
      } catch {
        // ignore parse errors
      }
      res.setHeader("content-type", "application/json");
      res.end(
        JSON.stringify({
          jsonrpc: "2.0",
          id,
          result: {
            protocolVersion: "2024-11-05",
            capabilities: {},
            serverInfo: { name: "mcp-detect-mcp-typescript", version: "0.1.0" },
          },
        }),
      );
      return;
    }
    res.statusCode = 404;
    res.end();
  })
  .listen(port, "0.0.0.0", () => {
    console.log(
      `[mcp-detect-mcp-typescript] sdk=${sdkServer.constructor.name} listening on :${port}/mcp`,
    );
  });
