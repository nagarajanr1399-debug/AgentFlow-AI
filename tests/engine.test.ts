import { mcpServer } from '../server/mcpServer.js';
import { workflowEngine } from '../server/workflowEngine.js';
import { dataStore } from '../server/dataStore.js';

let passed = 0;
let failed = 0;

function assert(condition: boolean, msg: string) {
  if (condition) {
    console.log(`  ✓ ${msg}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${msg}`);
    failed++;
  }
}

async function runTests() {
  console.log("=== AgentFlow AI Test Suite (Amazon Developer Hackathon 2026) ===");

  // Test 1: MCP Server Initialization & Spec Compliance
  console.log("\n[Test Suite 1: MCP Protocol Spec Compliance]");
  const initRes = await mcpServer.handleJsonRpc({
    jsonrpc: "2.0",
    id: 1,
    method: "initialize",
    params: {}
  });
  assert(initRes.result?.protocolVersion === "2024-11-05", "MCP Server reports Protocol Version 2024-11-05");
  assert(initRes.result?.serverInfo?.name === "agentflow-mcp-server", "MCP Server reports correct server identity");
  assert(initRes.result?.capabilities?.tools !== undefined, "MCP Server advertises tool capabilities");

  // Test 2: MCP Tool Discovery
  console.log("\n[Test Suite 2: Tool Registry Discovery]");
  const tools = mcpServer.getTools();
  assert(tools.length >= 8, `Discovered ${tools.length} active MCP tools (expected >= 8)`);
  const toolNames = tools.map(t => t.name);
  assert(toolNames.includes("list_tasks"), "Tool 'list_tasks' registered");
  assert(toolNames.includes("analyze_priorities"), "Tool 'analyze_priorities' registered");
  assert(toolNames.includes("create_follow_up_draft"), "Tool 'create_follow_up_draft' registered");
  assert(toolNames.includes("save_workflow_result"), "Tool 'save_workflow_result' registered");
  assert(toolNames.includes("verify_compliance_audit"), "Tool 'verify_compliance_audit' registered");

  // Test 3: Direct MCP Tool Invocations
  console.log("\n[Test Suite 3: Direct MCP Tool Invocations]");
  const listTasksRes = await mcpServer.executeTool("list_tasks", { is_overdue: true });
  assert(Array.isArray(listTasksRes.tasks), "list_tasks returns tasks array");
  assert(listTasksRes.overdueCount > 0, `list_tasks found ${listTasksRes.overdueCount} overdue items`);

  const priorityRes = await mcpServer.executeTool("analyze_priorities", {});
  assert(priorityRes.ranking?.length > 0, "analyze_priorities returned ranked task array");
  assert(priorityRes.highestScore > 0, `analyze_priorities scored top task at ${priorityRes.highestScore}/100`);

  const draftRes = await mcpServer.executeTool("create_follow_up_draft", {
    task_id: "TSK-8041",
    tone: "urgent_executive"
  });
  assert(draftRes.draft?.subject.includes("TSK-8041"), "create_follow_up_draft generated targeted subject");
  assert(draftRes.draft?.body.length > 50, "create_follow_up_draft synthesized detailed communication");

  const saveRes = await mcpServer.executeTool("save_workflow_result", {
    execution_id: "test-exec-1",
    summary_text: "Automated test execution"
  });
  assert(saveRes.proofHash.startsWith("sha256-"), "save_workflow_result produced valid sha256 proof hash");
  assert(saveRes.storedStatus === "verified_immutable", "save_workflow_result committed immutable record");

  // Test 4: Parameter Validation & Error Handling
  console.log("\n[Test Suite 4: Schema Validation]");
  let errorCaught = false;
  try {
    // get_task_details requires 'task_id'
    await mcpServer.executeTool("get_task_details", {});
  } catch (err) {
    errorCaught = true;
  }
  assert(errorCaught, "Missing required parameter rejected with validation exception");

  // Test 5: End-to-End Autonomous Workflow Planning & Execution
  console.log("\n[Test Suite 5: Autonomous Workflow Engine & Proof Synthesis]");
  const planned = workflowEngine.planWorkflow(
    "Identify overdue tasks, prioritize the critical ones, prepare follow-up drafts, and give me an executive summary.",
    "autonomous"
  );
  assert(planned.plan.length === 4, `Workflow planned with 4 verified steps (actual: ${planned.plan.length})`);
  assert(planned.steps[0].tool === "list_tasks", "Step 1 maps to list_tasks");
  assert(planned.steps[1].tool === "analyze_priorities", "Step 2 maps to analyze_priorities");

  const executed = await workflowEngine.executeWorkflow(planned.id);
  assert(executed.status === "completed", `Workflow executed to completion (status: ${executed.status})`);
  assert(executed.steps.every(s => s.status === "completed"), "All execution steps marked completed");
  assert(executed.proofVerificationHash.startsWith("sha256-"), "Cryptographic proof hash generated for execution");
  assert(executed.result?.prioritizedItems.length! > 0, "Execution produced prioritized items in synthesis");
  assert(executed.result?.followUpDrafts.length! > 0, "Execution produced stakeholder follow-up drafts");

  // Test 6: Human-in-the-Loop Approval Safeguard
  console.log("\n[Test Suite 6: Human-in-the-Loop Safeguard]");
  const supervised = workflowEngine.planWorkflow(
    "Trigger emergency notification broadcast to critical ops channel",
    "supervised"
  );
  // Manually add approval requirement to step 1 for test
  supervised.steps[0].requiresApproval = true;
  dataStore.saveExecution(supervised);

  const paused = await workflowEngine.executeWorkflow(supervised.id);
  assert(paused.status === "paused_approval", "Supervised execution halted at approval gate");

  const resumed = await workflowEngine.approveStep(supervised.id, supervised.steps[0].stepId, "Security Officer");
  assert(resumed.status === "completed", "Approval granted and execution completed cleanly");

  console.log(`\n========================================`);
  console.log(`Test Results: ${passed} passed, ${failed} failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
