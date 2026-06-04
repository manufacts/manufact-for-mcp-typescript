[![Deploy to mcp-use](https://cdn.mcp-use.com/deploy.svg)](https://mcp-use.com/deploy/start?repository-url=https%3A%2F%2Fgithub.com%2Fmanufacts%2Fmcp-detect-mcp-typescript&branch=main&project-name=mcp-detect-mcp-typescript&port=3000&build-command=npm+run+build&start-command=npm+start&runtime=node&base-image=node%3A20)

<div align="center">

# MCP TypeScript SDK MCP Apps example

**Reference server for the [MCP TypeScript SDK deploy guide](https://mcp-use.com/blog/mcp-app-with-mcp-typescript-sdk)** — same `echo` + `greet_widget` example used in our [seven-framework comparison](https://mcp-use.com/blog/deploying-seven-mcp-frameworks).

Built with [`@modelcontextprotocol/sdk`](https://github.com/modelcontextprotocol/typescript-sdk) and [`@modelcontextprotocol/ext-apps`](https://github.com/modelcontextprotocol/ext-apps).

**Live demo:** [`keen-forge-rsxua.run.mcp-use.com/mcp`](https://keen-forge-rsxua.run.mcp-use.com/mcp)

</div>

---

## Deploy to Manufact Cloud

Click the badge above, or open the [one-click deploy flow](https://mcp-use.com/deploy/start?repository-url=https%3A%2F%2Fgithub.com%2Fmanufacts%2Fmcp-detect-mcp-typescript&branch=main&project-name=mcp-detect-mcp-typescript&port=3000&build-command=npm+run+build&start-command=npm+start&runtime=node&base-image=node%3A20). Sign in, connect GitHub, and Manufact clones this repo into your account and deploys it.

If you deploy manually from the dashboard instead:

| Setting | Value |
| --- | --- |
| **Port** | `3000` |
| **Build command** | `npm run build` |
| **Start command** | `npm start` |

Manufact detects `@modelcontextprotocol/sdk` and labels the repo **mcp-typescript**.

---

## What's in this repo

- An `echo` tool (text-only)
- A `greet_widget` tool with explicit `registerAppTool` + `registerAppResource` wiring
- Streamable HTTP at `/mcp` via Express + `StreamableHTTPServerTransport`
- Self-contained HTML view loaded from esm.sh (no separate frontend build)

---

## Getting started

```bash
npm install
npm run build
npm start
```

Open `http://localhost:3000/mcp`.

For local development with auto-reload, run `tsc --watch` in one terminal and `node dist/index.js` in another.

---

## Project layout

```
src/
  index.ts    # Express app, MCP server, tools, and greet view HTML
```

See the [deploy guide](https://mcp-use.com/blog/mcp-app-with-mcp-typescript-sdk) for the full reference server walkthrough.
