import { Server } from "@modelcontextprotocol/sdk/server";

const server = new Server({ name: "demo", version: "0.0.1" }, {});
console.log("hello from official MCP TypeScript SDK", server);
