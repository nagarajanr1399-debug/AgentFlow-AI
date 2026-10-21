# AgentFlow AI — The Autonomous Workflow Command Center
> **"From intent to action. With proof."**  
> *Submission for the Amazon Developer Hackathon 2026*  
> **Categories:** Autonomous AI Agents, Amazon Alexa+ & Model Context Protocol (MCP), Enterprise Operations

---

## 1. Executive Summary

Enterprise operations teams lose hours navigating fragmented task trackers, log dashboards, and incident queues. Traditional conversational chatbots stop at text suggestions—leaving engineers to manually copy-paste, look up dependencies, and take action with zero audit proof.

**AgentFlow AI** transforms natural language intent into verified, autonomous multi-step operations using connected **Model Context Protocol (MCP 2024-11-05)** tools, **Amazon Alexa+** runtime dispatch, and **Amazon Bedrock** reasoning models.

Instead of talking with a bot, users command an autonomous workflow operations engine:
1. **Intelligent Decomposition:** Translates natural language requests into structured, numbered execution DAGs.
2. **Real MCP Tool Invocation:** Interacts with real operational backlogs via standard JSON-RPC 2.0 and Streamable HTTP transports.
3. **Traceable Proof:** Every action generates verifiable cryptographic tokens (`sha256-...`) committed to an immutable ledger.
4. **Human-in-the-Loop Safeguards:** Supervised execution policy halts at designated security/approval gates before external communications or disruptive mutations proceed.

---

## 2. Technical Architecture & Amazon Developer Tech

```
+-----------------------------------------------------------------------------------------+
|                                    AGENTFLOW AI SHELL                                    |
+-----------------------------------------------------------------------------------------+
|                                                                                         |
|   +--------------------------+                     +--------------------------------+   |
|   | Amazon Alexa+ Voice / UI |                     | Natural Language Prompt Input  |   |
|   +------------+-------------+                     +---------------+----------------+   |
|                |                                                   |                    |
|                +-------------------------+-------------------------+                    |
|                                          |                                              |
|                                          v                                              |
|                      +---------------------------------------+                          |
|                      |         Autonomous Agent Planner      |                          |
|                      |  - Intent Parsing & Sub-goal DAG      |                          |
|                      |  - Multi-factor Urgency Heuristics    |                          |
|                      |  - Safety Invariant Bounds Validation |                          |
|                      +-------------------+-------------------+                          |
|                                          |                                              |
|                                          v                                              |
|                      +---------------------------------------+                          |
|                      |   Model Context Protocol (MCP) Server |                          |
|                      |      Spec Version: 2024-11-05         |                          |
|                      |      Transport: JSON-RPC 2.0 / SSE    |                          |
|                      +-------------------+-------------------+                          |
|                                          |                                              |
|               +--------------------------+--------------------------+                   |
|               |                          |                          |                   |
|               v                          v                          v                   |
|       +---------------+          +---------------+          +---------------+           |
|       |  list_tasks   |          |  analyze_     |          | create_follow |           |
|       |               |          |  priorities   |          | _up_draft     |           |
|       +-------+-------+          +-------+-------+          +-------+-------+           |
|               |                          |                          |                   |
|               +--------------------------+--------------------------+                   |
|                                          |                                              |
|                                          v                                              |
|                      +---------------------------------------+                          |
|                      |         Verification & Proof          |                          |
|                      |  - Cryptographic SHA-256 Hashing      |                          |
|                      |  - Immutable Operational Ledger       |                          |
|                      |  - Human-in-the-Loop Authorization    |                          |
|                      +---------------------------------------+                          |
|                                                                                         |
+-----------------------------------------------------------------------------------------+
```

### Amazon Developer Technology Alignment
- **Amazon Alexa+ & MCP Protocol (`2024-11-05`):** Full compliance with the official Model Context Protocol specifications. The server exposes `/api/mcp` handling `initialize`, `tools/list`, and `tools/call`, plus a live Server-Sent Events (SSE) notification stream.
- **Amazon Bedrock Foundation Models:** Multi-model routing architecture compatible with Claude 3.5 Sonnet, Amazon Titan, and Gemini 2.5 Flash for high-precision autonomous planning.
- **Enterprise Safety & Governance:** SOC2-compliant access boundary verification and explicit human approval gates for critical actions.

---

## 3. Registered Model Context Protocol (MCP) Tools

All 8 tools are actively implemented, schema-validated, and executable in real-time via the built-in MCP Tool Explorer:

| Tool Name | Category | Description |
|:---|:---|:---|
| `list_tasks` | Retrieval | Query operational backlog by overdue state, priority tier, project, and tags. |
| `get_task_details` | Retrieval | Fetch detailed task telemetry, assignee contacts, blocker reasons, and SLA metrics. |
| `analyze_priorities` | Analysis | Multi-factor urgency matrix evaluating SLA breach risk, days overdue, and blockers (0–100). |
| `create_follow_up_draft`| Generation | Synthesizes personalized, actionable communication drafts for assignees and leads. |
| `save_workflow_result` | Persistence | Commits execution outcome and proof hashes (`sha256`) into the immutable ledger. |
| `query_metrics` | Retrieval | Calculates system-wide operational throughput, velocity, and SLA breach risk. |
| `trigger_notification` | Dispatch | Dispatches urgent notifications to Alexa+ voice speaker, Slack, or webhook queues. |
| `verify_compliance_audit`| Governance | Verifies security invariants and access boundaries against SOC2 Type II standards. |

---

## 4. Application Pages & Capabilities

1. **Executive Overview:**
   - Real-time operational metrics (Total Executions, Completed Workflows, Attention Needed, Active Tools, SLA Health).
   - "Start with Intent" prompt composer with sample operational goals.
   - Recent executions table with status badges and duration metrics.
   - Chronological live operational event activity stream.

2. **Agent Workspace (Core Judging Screen):**
   - Natural language intent composer and autonomy policy selector (`Supervised` / `Autonomous`).
   - Agent reasoning summary detailing sub-goal decomposition.
   - Numbered, structured execution steps (`01 — Retrieve`, `02 — Rank`, `03 — Draft`, `04 — Save`).
   - Real-time step progress, expandable input/output JSON inspectors.
   - Final Synthesized Result: Executive headline, Key Findings, Prioritized Items matrix, Follow-up Drafts with one-click copy, and Cryptographic Evidence Tokens.
   - "How this was completed" explainability drawer.

3. **Workflow Library:**
   - Searchable, categorized repository of operational templates (Productivity, Engineering Ops, Business Ops, Incident Response, Reporting).
   - 1-click "Run Workflow" loading directly into the Agent Workspace.

4. **Execution History & Audit Ledger:**
   - Comprehensive searchable historical registry with category and status filters.
   - Slide-out detail drawer for inspecting full execution traces and verification tokens.

5. **MCP Tool Explorer (Alexa+ Developer Console):**
   - Real-time MCP Server health panel (Server URL, Protocol `2024-11-05`, Uptime, Latency).
   - Interactive Tool Testing Runner: dynamically reads JSON schemas, validates input, invokes the tool live against the backend, and displays formatted JSON responses with round-trip latency.

6. **Connected Integrations:**
   - Real connectivity monitor for Alexa+ Skill Dispatcher, MCP Core Runtime, Amazon Bedrock, and Enterprise Task Ledger.
   - Live "Test Link" action measuring real round-trip ping latency.

7. **Settings & Autonomy Policies:**
   - Human-in-the-loop approval thresholds (`Critical Only`, `All External`, `Autonomous`).
   - Model selection (Bedrock Claude 3.5 Sonnet, Amazon Titan, Gemini Hybrid).
   - Cryptographic audit hashing controls.

---

## 5. Three-Minute Hackathon Demo Script for Judges

### Minute 1: The Executive Problem & Intent Expressed
1. Open the **Executive Overview** page. Note the clean operational metrics and backlog.
2. Click the sample prompt:  
   *`"Identify overdue tasks, prioritize the critical ones, prepare follow-up drafts, and give me an executive summary."`*
3. Observe how the Agent Planner immediately translates this request into a structured 4-step sequence (01–04) rather than unstructured chatbot prose.

### Minute 2: Autonomous Tool Orchestration & Human-in-the-Loop
1. In the **Agent Workspace**, click **"Execute Workflow"**.
2. Observe real-time step execution: `list_tasks` retrieves overdue items, `analyze_priorities` runs the urgency heuristic scoring `TSK-8041` at 94/100, `create_follow_up_draft` generates executive communications, and `save_workflow_result` commits the proof token.
3. Review the **Executive Synthesis** card: examine the prioritized items table, click **"Copy Draft"** on the generated email to Marcus Vance, and copy the **SHA-256 Proof Verification Hash**.

### Minute 3: Alexa+ MCP Tool Explorer & Direct Verification
1. Navigate to the **MCP Tool Explorer** tab.
2. Inspect the live Model Context Protocol server status: protocol version `2024-11-05` and 8 registered tools.
3. Click **"Test Tool"** on `analyze_priorities`. Click **"Execute Tool"** to invoke the backend tool live and inspect the raw JSON response and duration.
4. Open the **Execution History** tab to view the persisted ledger record.

---

## 6. Local Setup and Running Tests

### Prerequisites
- Node.js 20+
- npm

### Installation & Launch
```bash
# Install dependencies
npm install

# Run the automated test suite (28 integration tests)
npm test

# Launch full-stack development server (Express backend + Vite frontend)
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## 7. Quality & Engineering Standards
- **Strict TypeScript:** 100% typed with zero compilation warnings.
- **Design Constitution Adherence:** Disciplined palette (60-30-10), tabular figures (`tabular-nums`), zero-pill metadata, no fake scoreboards or decorative status dots.
- **Radix UI Primitives:** Accessible Dialog, Tabs, ScrollArea, Popover, and Tooltip components with full keyboard accessibility (`Cmd+K`).
- **Comprehensive Testing:** 28 passing integration tests verifying protocol compliance, schema validation, tool invocation, and human-in-the-loop safeguards.
