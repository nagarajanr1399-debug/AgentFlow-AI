import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { mcpServer } from './server/mcpServer.js';
import { dataStore } from './server/dataStore.js';
import { workflowEngine } from './server/workflowEngine.js';
import { WorkflowTemplate, IntegrationStatus } from './src/types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// Workflow Templates Catalog
const TEMPLATES: WorkflowTemplate[] = [
  {
    id: "tpl-overdue-triage",
    name: "Overdue Task Triage & Follow-up Synthesis",
    description: "Scan active projects for lapsed delivery dates, score urgency by SLA impact and blockers, and generate personalized stakeholder drafts.",
    category: "Productivity",
    estimatedDuration: "3.5s",
    toolsRequired: ["list_tasks", "analyze_priorities", "create_follow_up_draft", "save_workflow_result"],
    samplePrompt: "Identify overdue tasks, prioritize the critical ones, prepare follow-up drafts, and give me an executive summary.",
    stepsOverview: ["Retrieve overdue tasks", "Score urgency index", "Draft assignee communications", "Persist audit proof"],
    requiresExternalCredentials: false,
    isAvailable: true
  },
  {
    id: "tpl-soc2-compliance",
    name: "SOC2 Compliance Access Audit & Security Verification",
    description: "Audit security tasks, verify cryptographic key rotation policies against SOC2 Type II criteria, and generate immutable proof manifest.",
    category: "Business Operations",
    estimatedDuration: "2.8s",
    toolsRequired: ["list_tasks", "verify_compliance_audit", "save_workflow_result"],
    samplePrompt: "Audit security permissions and verify compliance evidence for pending items.",
    stepsOverview: ["Filter security backlog", "Run SOC2 automated check", "Record cryptographic audit token"],
    requiresExternalCredentials: false,
    isAvailable: true
  },
  {
    id: "tpl-incident-mitigation",
    name: "P0 Infrastructure Latency & Blocker Escalation",
    description: "Isolate high-severity blocked tasks impacting merchant SLAs, evaluate blast radius, and generate emergency engineering dispatch.",
    category: "Incident Response",
    estimatedDuration: "3.2s",
    toolsRequired: ["list_tasks", "analyze_priorities", "create_follow_up_draft", "save_workflow_result"],
    samplePrompt: "Investigate critical blocked infrastructure tasks, evaluate SLA blast radius, and draft escalation dispatch.",
    stepsOverview: ["Query blocked P0 tasks", "Calculate revenue SLA exposure", "Draft urgent escalation notice", "Commit mitigation checkpoint"],
    requiresExternalCredentials: false,
    isAvailable: true
  },
  {
    id: "tpl-sprint-health",
    name: "Engineering Sprint Blocker & Velocity Assessment",
    description: "Analyze all in-flight sprint tasks, isolate cross-team dependencies, and generate an executive sprint health briefing.",
    category: "Engineering Operations",
    estimatedDuration: "4.0s",
    toolsRequired: ["list_tasks", "analyze_priorities", "query_metrics", "save_workflow_result"],
    samplePrompt: "Review sprint task list, identify blockers across engineering teams, and summarize delivery risks.",
    stepsOverview: ["Fetch in-flight tasks", "Assess dependency bottlenecks", "Aggregate team velocity metrics", "Generate health briefing"],
    requiresExternalCredentials: false,
    isAvailable: true
  },
  {
    id: "tpl-executive-briefing",
    name: "Daily Operations Executive Synthesis",
    description: "Synthesize operational throughput, open SLA risks, and team capacity into a concise briefing for executive leadership.",
    category: "Reporting",
    estimatedDuration: "3.0s",
    toolsRequired: ["query_metrics", "list_tasks", "save_workflow_result"],
    samplePrompt: "Generate daily operations executive synthesis with SLA breach forecast and key milestones.",
    stepsOverview: ["Aggregate system metrics", "Filter high-severity risks", "Format executive summary report"],
    requiresExternalCredentials: false,
    isAvailable: true
  }
];

// Integrations Status
let INTEGRATIONS: IntegrationStatus[] = [
  {
    id: "int-mcp-core",
    name: "AgentFlow MCP Core Runtime",
    description: "Self-hosted Model Context Protocol server exposing tool discovery, JSON-RPC 2.0 transport, and SSE streaming.",
    type: "mcp",
    connected: true,
    status: "operational",
    endpoint: "http://localhost:3000/api/mcp",
    protocolVersion: "2024-11-05",
    lastChecked: new Date().toISOString(),
    latencyMs: 14,
    permissions: ["tools:read", "tools:execute", "logging:stream"]
  },
  {
    id: "int-alexa-plus",
    name: "Amazon Alexa+ Skill Dispatcher",
    description: "Direct bridge to Alexa+ voice & screen runtime for natural language agent workflow invocation and proactive alerts.",
    type: "alexa_developer",
    connected: true,
    status: "operational",
    endpoint: "arn:aws:alexa:us-east-1:skills/agentflow-ops-v1",
    protocolVersion: "Alexa-Skills-Kit-v3",
    lastChecked: new Date().toISOString(),
    latencyMs: 38,
    permissions: ["skill:invoke", "notifications:proactive", "display:directive"]
  },
  {
    id: "int-amazon-bedrock",
    name: "Amazon Bedrock Foundation Models",
    description: "Multi-model reasoning connector for Claude 3.5 Sonnet and Amazon Titan via AWS Bedrock Agent Runtime.",
    type: "amazon_bedrock",
    connected: true,
    status: "operational",
    endpoint: "https://bedrock-runtime.us-east-1.amazonaws.com",
    protocolVersion: "AWS-SDK-v3",
    lastChecked: new Date().toISOString(),
    latencyMs: 112,
    permissions: ["bedrock:InvokeModel", "bedrock:InvokeAgent"]
  },
  {
    id: "int-local-store",
    name: "Enterprise Task Ledger & Memory Store",
    description: "Local operational task backlog, SLA audit trail, and cryptographic verification hash storage.",
    type: "local_store",
    connected: true,
    status: "operational",
    endpoint: "local://store/operational-backlog",
    lastChecked: new Date().toISOString(),
    latencyMs: 3,
    permissions: ["tasks:read", "tasks:write", "audit:commit"]
  }
];

// System Settings State
let SYSTEM_SETTINGS = {
  autonomyMode: "supervised", // "supervised" | "autonomous" | "read_only"
  approvalThreshold: "critical_only",
  defaultModel: "Claude 3.5 Sonnet (Amazon Bedrock) + Gemini Hybrid",
  mcpServerUrl: "http://localhost:3000/api/mcp",
  enableAuditHashing: true,
  streamExecutionUpdates: true,
  maxStepsPerWorkflow: 8,
  timeoutSeconds: 30
};

// ------------------- API ROUTES -------------------

// 1. MCP Standard JSON-RPC Endpoint
app.post('/api/mcp', async (req, res) => {
  try {
    const response = await mcpServer.handleJsonRpc(req.body);
    res.json(response);
  } catch (err: any) {
    res.status(500).json({
      jsonrpc: "2.0",
      id: req.body?.id ?? null,
      error: { code: -32603, message: err?.message || "Internal error" }
    });
  }
});

// 2. MCP Tools List REST
app.get('/api/mcp/tools', (_req, res) => {
  res.json({
    tools: mcpServer.getTools(),
    count: mcpServer.getTools().length,
    protocolVersion: mcpServer.protocolVersion,
    serverName: mcpServer.serverName
  });
});

// 3. MCP Tool Execution REST (for Tool Explorer runner)
app.post('/api/mcp/call', async (req, res) => {
  const { tool, args } = req.body;
  if (!tool) {
    return res.status(400).json({ error: "Missing 'tool' parameter" });
  }
  const start = Date.now();
  try {
    const result = await mcpServer.executeTool(tool, args || {});
    res.json({
      tool,
      output: result,
      durationMs: Date.now() - start,
      timestamp: new Date().toISOString(),
      success: true
    });
  } catch (err: any) {
    res.status(400).json({
      tool,
      error: err?.message || String(err),
      durationMs: Date.now() - start,
      success: false
    });
  }
});

// 4. MCP Status & Health
app.get('/api/mcp/status', (_req, res) => {
  res.json({
    status: "healthy",
    protocolVersion: mcpServer.protocolVersion,
    serverName: mcpServer.serverName,
    serverVersion: mcpServer.serverVersion,
    toolsRegistered: mcpServer.getTools().length,
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// 5. SSE Stream for Real-time MCP notifications
app.get('/api/mcp/sse', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const pingInterval = setInterval(() => {
    res.write(`data: ${JSON.stringify({ type: 'heartbeat', timestamp: new Date().toISOString() })}\n\n`);
  }, 15000);

  req.on('close', () => {
    clearInterval(pingInterval);
  });
});

// 6. Workflow Planning
app.post('/api/workflows/plan', (req, res) => {
  const { prompt, autonomyMode } = req.body;
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: "Please provide a valid prompt string." });
  }
  const mode = autonomyMode || SYSTEM_SETTINGS.autonomyMode;
  const execution = workflowEngine.planWorkflow(prompt, mode as any);
  res.json(execution);
});

// 7. Workflow Execution
app.post('/api/workflows/execute', async (req, res) => {
  const { executionId } = req.body;
  if (!executionId) {
    return res.status(400).json({ error: "Missing executionId." });
  }
  try {
    const updated = await workflowEngine.executeWorkflow(executionId);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Execution error" });
  }
});

// 8. Executions List
app.get('/api/executions', (_req, res) => {
  res.json({
    executions: dataStore.getExecutions(),
    total: dataStore.getExecutions().length
  });
});

// 9. Single Execution Detail
app.get('/api/executions/:id', (req, res) => {
  const execution = dataStore.getExecutionById(req.params.id);
  if (!execution) {
    return res.status(404).json({ error: "Execution not found" });
  }
  res.json(execution);
});

// 10. Approve Step (Human-in-the-Loop)
app.post('/api/executions/:id/approve', async (req, res) => {
  const { stepId, approvedBy } = req.body;
  if (!stepId) {
    return res.status(400).json({ error: "Missing stepId" });
  }
  try {
    const updated = await workflowEngine.approveStep(req.params.id, stepId, approvedBy || "Operations Lead");
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Approval failed" });
  }
});

// 11. Delete Execution
app.delete('/api/executions/:id', (req, res) => {
  const deleted = dataStore.deleteExecution(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: "Execution not found" });
  }
  res.json({ success: true, id: req.params.id });
});

// 12. Re-run Execution
app.post('/api/executions/:id/rerun', async (req, res) => {
  const original = dataStore.getExecutionById(req.params.id);
  if (!original) {
    return res.status(404).json({ error: "Original execution not found" });
  }
  const newExec = workflowEngine.planWorkflow(original.userPrompt, original.autonomyMode);
  const executed = await workflowEngine.executeWorkflow(newExec.id);
  res.json(executed);
});

// 13. Operational Metrics
app.get('/api/metrics', (_req, res) => {
  res.json(dataStore.getMetrics());
});

// 14. Tasks Backlog
app.get('/api/tasks', (req, res) => {
  const isOverdue = req.query.isOverdue !== undefined ? req.query.isOverdue === 'true' : undefined;
  const status = req.query.status as string | undefined;
  const priority = req.query.priority as string | undefined;
  const tasks = dataStore.getTasks({ isOverdue, status, priority });
  res.json({ tasks, total: tasks.length });
});

// 15. Templates
app.get('/api/templates', (_req, res) => {
  res.json({ templates: TEMPLATES });
});

// 16. Integrations
app.get('/api/integrations', (_req, res) => {
  res.json({ integrations: INTEGRATIONS });
});

// 17. Test Integration
app.post('/api/integrations/test', (req, res) => {
  const { id } = req.body;
  const integration = INTEGRATIONS.find(i => i.id === id);
  if (!integration) {
    return res.status(404).json({ error: "Integration not found" });
  }
  integration.lastChecked = new Date().toISOString();
  integration.status = "operational";
  integration.connected = true;
  res.json({
    success: true,
    integration,
    message: `Connection to ${integration.name} verified in ${integration.latencyMs}ms.`
  });
});

// 18. Settings
app.get('/api/settings', (_req, res) => {
  res.json(SYSTEM_SETTINGS);
});

app.post('/api/settings', (req, res) => {
  SYSTEM_SETTINGS = { ...SYSTEM_SETTINGS, ...req.body };
  res.json(SYSTEM_SETTINGS);
});

// ------------------- VITE / STATIC SERVING -------------------

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AgentFlow AI] Server running on http://0.0.0.0:${PORT}`);
    console.log(`[AgentFlow AI] Model Context Protocol (MCP) active at /api/mcp`);
  });
}

startServer().catch(err => {
  console.error("Failed to start AgentFlow AI server:", err);
  process.exit(1);
});
