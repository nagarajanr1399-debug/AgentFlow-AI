import { TaskItem, WorkflowExecution, OperationalMetrics } from '../src/types/index.js';

// Pre-seeded realistic enterprise operational task backlog
export const INITIAL_TASKS: TaskItem[] = [
  {
    id: "TSK-8041",
    title: "Remediate Payment Gateway TLS Handshake Latency Spike",
    description: "Production payment processing endpoint /v2/charge experiencing 850ms latency degradation in us-east-1 region. Breaches Tier-1 merchant SLA.",
    assignee: {
      name: "Marcus Vance",
      email: "m.vance@agentflow.internal",
      role: "Principal Infrastructure Engineer"
    },
    status: "blocked",
    priority: "critical",
    dueDate: "2026-10-18T17:00:00Z",
    isOverdue: true,
    daysOverdue: 2,
    project: "Core Checkout Reliability",
    tags: ["infrastructure", "p0", "payments", "sla-breach"],
    blockerReason: "Waiting on AWS Network Load Balancer target group certificate renegotiation approval.",
    slaBreachRisk: "critical"
  },
  {
    id: "TSK-8034",
    title: "SOC2 Type II Audit Compliance Evidence Export for Q3",
    description: "Export encrypted database access logs, key rotation manifests, and role-based access reviews for annual compliance auditors.",
    assignee: {
      name: "Elena Rostova",
      email: "e.rostova@agentflow.internal",
      role: "Security & Governance Lead"
    },
    status: "in_progress",
    priority: "high",
    dueDate: "2026-10-19T12:00:00Z",
    isOverdue: true,
    daysOverdue: 1,
    project: "Compliance & Security",
    tags: ["compliance", "security", "soc2", "audit"],
    blockerReason: "KMS rotation ledger export requires dual-custody authorization signature.",
    slaBreachRisk: "high"
  },
  {
    id: "TSK-8022",
    title: "PostgreSQL Connection Pool Exhaustion in Staging Cluster",
    description: "Async worker consumer scaling up past maximum database connection pool ceiling during peak load testing batches.",
    assignee: {
      name: "Devon Zhang",
      email: "d.zhang@agentflow.internal",
      role: "Senior Backend Developer"
    },
    status: "todo",
    priority: "high",
    dueDate: "2026-10-17T18:00:00Z",
    isOverdue: true,
    daysOverdue: 3,
    project: "Database Scalability",
    tags: ["database", "postgres", "performance"],
    blockerReason: "Needs PgBouncer configuration update deployed through staging pipeline.",
    slaBreachRisk: "high"
  },
  {
    id: "TSK-8015",
    title: "Alexa+ MCP Skill Runtime Protocol Schema Validation",
    description: "Implement strict JSON-RPC 2.0 transport compliance check for streaming tool execution notifications over SSE.",
    assignee: {
      name: "Aisha Patel",
      email: "a.patel@agentflow.internal",
      role: "AI Agent Platform Engineer"
    },
    status: "in_progress",
    priority: "critical",
    dueDate: "2026-10-21T18:00:00Z",
    isOverdue: false,
    daysOverdue: 0,
    project: "Alexa+ Integration",
    tags: ["alexa-plus", "mcp", "protocols", "sdk"],
    slaBreachRisk: "moderate"
  },
  {
    id: "TSK-7998",
    title: "Deprecate Legacy v1 Auth Bearer Token Endpoint",
    description: "Audit third-party integrations still invoking the unversioned /oauth/token endpoint and notify partner engineering leads.",
    assignee: {
      name: "Sarah Lin",
      email: "s.lin@agentflow.internal",
      role: "API Ecosystem Manager"
    },
    status: "review",
    priority: "medium",
    dueDate: "2026-10-16T15:00:00Z",
    isOverdue: true,
    daysOverdue: 4,
    project: "Identity & Access",
    tags: ["api-deprecation", "auth", "security"],
    slaBreachRisk: "moderate"
  },
  {
    id: "TSK-7980",
    title: "Customer Support Escalation Tier Reassignment Automation",
    description: "Auto-escalate tickets unanswered after 45 minutes directly to on-call secondary rotation via webhook.",
    assignee: {
      name: "Carlos Mendez",
      email: "c.mendez@agentflow.internal",
      role: "Operations Specialist"
    },
    status: "done",
    priority: "medium",
    dueDate: "2026-10-15T12:00:00Z",
    isOverdue: false,
    daysOverdue: 0,
    project: "Customer Ops",
    tags: ["support", "automation", "sla"],
    slaBreachRisk: "nominal"
  }
];

// Initial persisted execution records demonstrating verified execution history
export const INITIAL_EXECUTIONS: WorkflowExecution[] = [
  {
    id: "exec-9941a8",
    title: "Prioritize Overdue Tasks & Draft Stakeholder Follow-ups",
    userPrompt: "Identify overdue tasks, prioritize the critical ones, prepare follow-up drafts, and give me an executive summary.",
    category: "Productivity & Operations",
    status: "completed",
    createdAt: "2026-10-20T17:15:20Z",
    completedAt: "2026-10-20T17:15:24Z",
    durationMs: 3820,
    autonomyMode: "supervised",
    environment: "alexa_mcp",
    proofVerificationHash: "sha256-4f7b2c9e1180d463ae521799dc3091afc9201",
    toolsUsed: [
      "list_tasks",
      "analyze_priorities",
      "create_follow_up_draft",
      "save_workflow_result"
    ],
    agentReasoning: "Decomposed prompt into 4 sequential operations: query backlog filter for overdue=true; run multi-attribute urgency scoring algorithm considering days overdue and SLA tier; generate tailored follow-up drafts for Marcus Vance and Elena Rostova; persist verified execution proof.",
    plan: [
      {
        id: "step-1",
        stepNumber: 1,
        title: "Retrieve overdue operational tasks",
        tool: "list_tasks",
        rationale: "Fetch current task records where is_overdue equals true and status is not done.",
        expectedOutput: "Filtered list of overdue tasks with blocker data and assignee metadata.",
        inputParameters: { is_overdue: true, status_not: "done" }
      },
      {
        id: "step-2",
        stepNumber: 2,
        title: "Calculate composite urgency scores",
        tool: "analyze_priorities",
        rationale: "Execute algorithmic priority evaluation weighting days overdue, SLA breach risk, and blockers.",
        expectedOutput: "Ranked list sorted by calculated urgency index (0-100).",
        inputParameters: { task_ids: ["TSK-8041", "TSK-8034", "TSK-8022", "TSK-7998"] }
      },
      {
        id: "step-3",
        stepNumber: 3,
        title: "Generate targeted follow-up drafts",
        tool: "create_follow_up_draft",
        rationale: "Draft actionable stakeholder communication for critical assignees to unblock deliverables.",
        expectedOutput: "Ready-to-send email and messaging drafts with specific action requirements.",
        inputParameters: { primary_task_id: "TSK-8041", secondary_task_id: "TSK-8034" }
      },
      {
        id: "step-4",
        stepNumber: 4,
        title: "Persist execution proof & audit manifest",
        tool: "save_workflow_result",
        rationale: "Commit verified outcome hash and evidence tokens to the execution ledger.",
        expectedOutput: "Cryptographic confirmation hash and immutable audit log entry.",
        inputParameters: { execution_category: "task_remediation" }
      }
    ],
    steps: [
      {
        stepId: "step-1",
        stepNumber: 1,
        title: "Retrieve overdue operational tasks",
        tool: "list_tasks",
        status: "completed",
        startedAt: "2026-10-20T17:15:20.120Z",
        completedAt: "2026-10-20T17:15:21.050Z",
        durationMs: 930,
        inputs: { is_overdue: true, status_not: "done" },
        outputs: {
          matchedCount: 4,
          tasks: ["TSK-8041", "TSK-8034", "TSK-8022", "TSK-7998"]
        },
        evidenceSummary: "Retrieved 4 overdue tasks across Core Checkout, Compliance, Database, and Identity."
      },
      {
        stepId: "step-2",
        stepNumber: 2,
        title: "Calculate composite urgency scores",
        tool: "analyze_priorities",
        status: "completed",
        startedAt: "2026-10-20T17:15:21.100Z",
        completedAt: "2026-10-20T17:15:22.210Z",
        durationMs: 1110,
        inputs: { task_ids: ["TSK-8041", "TSK-8034", "TSK-8022", "TSK-7998"] },
        outputs: {
          highestUrgency: "TSK-8041",
          scores: [
            { id: "TSK-8041", score: 94, reason: "Tier-1 merchant checkout SLA at active breach." },
            { id: "TSK-8034", score: 86, reason: "SOC2 audit window closing in 48 hours." },
            { id: "TSK-8022", score: 79, reason: "Staging database pool limits blocking QA testing." },
            { id: "TSK-7998", score: 58, reason: "Legacy API deprecation communication pending." }
          ]
        },
        evidenceSummary: "TSK-8041 scored 94/100 due to production revenue impact and 2 days delay."
      },
      {
        stepId: "step-3",
        stepNumber: 3,
        title: "Generate targeted follow-up drafts",
        tool: "create_follow_up_draft",
        status: "completed",
        startedAt: "2026-10-20T17:15:22.250Z",
        completedAt: "2026-10-20T17:15:23.400Z",
        durationMs: 1150,
        inputs: { primary_task_id: "TSK-8041", secondary_task_id: "TSK-8034" },
        outputs: { draftsGenerated: 2 },
        evidenceSummary: "Drafted high-urgency notifications for Marcus Vance and Elena Rostova."
      },
      {
        stepId: "step-4",
        stepNumber: 4,
        title: "Persist execution proof & audit manifest",
        tool: "save_workflow_result",
        status: "completed",
        startedAt: "2026-10-20T17:15:23.450Z",
        completedAt: "2026-10-20T17:15:24.080Z",
        durationMs: 630,
        inputs: { execution_category: "task_remediation" },
        outputs: {
          ledgerId: "LEDG-4091",
          hash: "sha256-4f7b2c9e1180d463ae521799dc3091afc9201"
        },
        evidenceSummary: "Saved results to execution registry with cryptographic audit hash."
      }
    ],
    result: {
      headline: "4 Overdue Tasks Analyzed: 2 Critical Path Breaches Detected",
      executiveSummary: "AgentFlow AI queried the enterprise task registry and identified 4 overdue tasks. A composite urgency analysis determined that TSK-8041 (Payment Gateway TLS Latency Spike) presents an immediate production revenue risk due to a 2-day SLA breach, while TSK-8034 threatens impending Q3 SOC2 audit compliance. Executive communications have been generated and staged for delivery.",
      keyFindings: [
        "Payment Gateway latency is degrading checkout conversion in us-east-1 (TSK-8041, overdue 2 days).",
        "SOC2 Type II Q3 audit evidence window closes in under 48 hours with pending KMS rotation logs (TSK-8034).",
        "Staging connection pool exhaustion (TSK-8022) is gating current integration test suites.",
        "Total backlog delay across overdue items averages 2.5 days."
      ],
      prioritizedItems: [
        {
          id: "TSK-8041",
          title: "Remediate Payment Gateway TLS Handshake Latency Spike",
          priority: "critical",
          urgencyScore: 94,
          recommendedAction: "Authorize AWS NLB target certificate renegotiation immediately to unblock Marcus Vance.",
          assignee: "Marcus Vance"
        },
        {
          id: "TSK-8034",
          title: "SOC2 Type II Audit Compliance Evidence Export for Q3",
          priority: "high",
          urgencyScore: 86,
          recommendedAction: "Provide dual-custody authorization signature for KMS rotation export ledger.",
          assignee: "Elena Rostova"
        },
        {
          id: "TSK-8022",
          title: "PostgreSQL Connection Pool Exhaustion in Staging Cluster",
          priority: "high",
          urgencyScore: 79,
          recommendedAction: "Promote PgBouncer configuration update to staging cluster.",
          assignee: "Devon Zhang"
        }
      ],
      suggestedNextActions: [
        "Dispatch generated follow-up notice to Marcus Vance regarding NLB certificate clearance.",
        "Request Security Council dual-custody signature for Elena Rostova's KMS audit export.",
        "Schedule PgBouncer config deployment in staging database window."
      ],
      followUpDrafts: [
        {
          recipient: "Marcus Vance <m.vance@agentflow.internal>",
          subject: "URGENT: Blocked Status on TSK-8041 (Payment Gateway TLS Latency)",
          body: "Hi Marcus,\n\nOur autonomous operations audit flagged TSK-8041 as critically overdue (+2 days) with high revenue SLA breach risk.\n\nBlocker identified: Waiting on AWS NLB target group certificate renegotiation approval.\n\nAction requested: We have flagged this to Infrastructure SecOps for expedited clearance. Please confirm if temporary traffic failover to us-west-2 is viable in the interim.\n\nReference: TSK-8041 | SLA Impact: Tier-1 Merchant",
          urgency: "Immediate Action Required"
        },
        {
          recipient: "Elena Rostova <e.rostova@agentflow.internal>",
          subject: "ACTION REQUIRED: SOC2 Q3 Audit Evidence Signature Needed (TSK-8034)",
          body: "Hi Elena,\n\nAgentFlow AI detected that TSK-8034 is 1 day overdue ahead of the Q3 SOC2 audit evidence deadline.\n\nBlocker: Dual-custody authorization required for KMS rotation ledger export.\n\nAction requested: Please initiate the secondary sign-off workflow via the Security Governance portal so the automated export can complete.\n\nReference: TSK-8034 | Audit Window: Q3",
          urgency: "High Priority"
        }
      ],
      evidenceTokens: [
        {
          label: "Task Backlog Snapshot",
          source: "mcp://tools/list_tasks",
          timestamp: "2026-10-20T17:15:20Z",
          proofHash: "sha256-a1109b4"
        },
        {
          label: "Urgency Score Matrix",
          source: "mcp://tools/analyze_priorities",
          timestamp: "2026-10-20T17:15:21Z",
          proofHash: "sha256-c4081ef"
        },
        {
          label: "Audit Ledger Token",
          source: "mcp://tools/save_workflow_result",
          timestamp: "2026-10-20T17:15:24Z",
          proofHash: "sha256-4f7b2c9"
        }
      ]
    }
  },
  {
    id: "exec-8720b2",
    title: "SOC2 Compliance Access Audit & Security Verification",
    userPrompt: "Audit security permissions and verify compliance evidence for pending items.",
    category: "Compliance & Security",
    status: "completed",
    createdAt: "2026-10-19T14:02:11Z",
    completedAt: "2026-10-19T14:02:14Z",
    durationMs: 3120,
    autonomyMode: "autonomous",
    environment: "alexa_mcp",
    proofVerificationHash: "sha256-91e84a20b77c38520d911a84f33190ab7641",
    toolsUsed: ["list_tasks", "verify_compliance_audit", "save_workflow_result"],
    agentReasoning: "Retrieved compliance-tagged items, executed cryptographic verification audit on authorization chains, and recorded verified compliance proof in the ledger.",
    plan: [
      {
        id: "step-1",
        stepNumber: 1,
        title: "Filter compliance & audit tasks",
        tool: "list_tasks",
        rationale: "Retrieve open compliance tasks requiring evidence verification.",
        expectedOutput: "List of active security tasks.",
        inputParameters: { tags: ["compliance", "security"] }
      },
      {
        id: "step-2",
        stepNumber: 2,
        title: "Run security compliance audit tool",
        tool: "verify_compliance_audit",
        rationale: "Verify permission boundaries and access logs against SOC2 criteria.",
        expectedOutput: "Compliance check report with audit status.",
        inputParameters: { audit_standard: "SOC2_Type_II" }
      },
      {
        id: "step-3",
        stepNumber: 3,
        title: "Record audit proof token",
        tool: "save_workflow_result",
        rationale: "Commit audit results to compliance store.",
        expectedOutput: "Cryptographic hash and timestamp.",
        inputParameters: { execution_category: "compliance_audit" }
      }
    ],
    steps: [
      {
        stepId: "step-1",
        stepNumber: 1,
        title: "Filter compliance & audit tasks",
        tool: "list_tasks",
        status: "completed",
        startedAt: "2026-10-19T14:02:11.100Z",
        completedAt: "2026-10-19T14:02:12.000Z",
        durationMs: 900,
        inputs: { tags: ["compliance", "security"] },
        outputs: { matchedCount: 2, tasks: ["TSK-8034", "TSK-7998"] },
        evidenceSummary: "Located 2 security-relevant backlog tasks."
      },
      {
        stepId: "step-2",
        stepNumber: 2,
        title: "Run security compliance audit tool",
        tool: "verify_compliance_audit",
        status: "completed",
        startedAt: "2026-10-19T14:02:12.050Z",
        completedAt: "2026-10-19T14:02:13.400Z",
        durationMs: 1350,
        inputs: { audit_standard: "SOC2_Type_II" },
        outputs: { complianceScore: 98, status: "passing_with_staged_export" },
        evidenceSummary: "KMS rotation ledger export pending dual-custody signature."
      },
      {
        stepId: "step-3",
        stepNumber: 3,
        title: "Record audit proof token",
        tool: "save_workflow_result",
        status: "completed",
        startedAt: "2026-10-19T14:02:13.450Z",
        completedAt: "2026-10-19T14:02:14.220Z",
        durationMs: 770,
        inputs: { execution_category: "compliance_audit" },
        outputs: { ledgerId: "LEDG-4088", hash: "sha256-91e84a20b77c38520d911a84f33190ab7641" },
        evidenceSummary: "Audit checkpoint hash committed."
      }
    ],
    result: {
      headline: "SOC2 Type II Audit Verified: 1 Action Pending Sign-off",
      executiveSummary: "Automated verification completed for 2 security compliance targets. Access control registries and key rotation policies pass baseline standards. Final ledger export for TSK-8034 awaits dual-custody signature.",
      keyFindings: [
        "Database access control policies meet strict least-privilege standards.",
        "KMS automated key rotation active; export manifest generated.",
        "Legacy token endpoints scheduled for decommissioning."
      ],
      prioritizedItems: [
        {
          id: "TSK-8034",
          title: "SOC2 Type II Audit Compliance Evidence Export for Q3",
          priority: "high",
          urgencyScore: 86,
          recommendedAction: "Complete dual-custody KMS signing.",
          assignee: "Elena Rostova"
        }
      ],
      suggestedNextActions: ["Notify SecOps regarding final sign-off."],
      followUpDrafts: [],
      evidenceTokens: [
        {
          label: "SOC2 Policy Validation",
          source: "mcp://tools/verify_compliance_audit",
          timestamp: "2026-10-19T14:02:13Z",
          proofHash: "sha256-91e84a"
        }
      ]
    }
  }
];

class OperationalDataStore {
  private tasks: TaskItem[] = [...INITIAL_TASKS];
  private executions: WorkflowExecution[] = [...INITIAL_EXECUTIONS];

  // Tasks methods
  getTasks(filter?: { isOverdue?: boolean; status?: string; priority?: string; tags?: string[] }): TaskItem[] {
    let result = [...this.tasks];
    if (filter) {
      if (filter.isOverdue !== undefined) {
        result = result.filter(t => t.isOverdue === filter.isOverdue);
      }
      if (filter.status) {
        result = result.filter(t => t.status === filter.status);
      }
      if (filter.priority) {
        result = result.filter(t => t.priority === filter.priority);
      }
      if (filter.tags && filter.tags.length > 0) {
        result = result.filter(t => filter.tags!.some(tag => t.tags.includes(tag)));
      }
    }
    return result;
  }

  getTaskById(id: string): TaskItem | undefined {
    return this.tasks.find(t => t.id === id);
  }

  updateTaskStatus(id: string, status: TaskItem['status']): boolean {
    const task = this.tasks.find(t => t.id === id);
    if (!task) return false;
    task.status = status;
    return true;
  }

  // Executions methods
  getExecutions(): WorkflowExecution[] {
    return [...this.executions].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getExecutionById(id: string): WorkflowExecution | undefined {
    return this.executions.find(e => e.id === id);
  }

  saveExecution(exec: WorkflowExecution): void {
    const existingIndex = this.executions.findIndex(e => e.id === exec.id);
    if (existingIndex >= 0) {
      this.executions[existingIndex] = exec;
    } else {
      this.executions.unshift(exec);
    }
  }

  deleteExecution(id: string): boolean {
    const initialLen = this.executions.length;
    this.executions = this.executions.filter(e => e.id !== id);
    return this.executions.length < initialLen;
  }

  // System operational metrics
  getMetrics(): OperationalMetrics {
    const totalExecutions = this.executions.length;
    const completedWorkflows = this.executions.filter(e => e.status === 'completed').length;
    const workflowsRequiringAttention = this.executions.filter(e => e.status === 'paused_approval' || e.status === 'failed').length;
    const overdueTasks = this.tasks.filter(t => t.isOverdue).length;
    const durations = this.executions.filter(e => e.durationMs > 0).map(e => e.durationMs);
    const avgDurationMs = durations.length ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : 0;
    const successRate = totalExecutions > 0 ? Math.round((completedWorkflows / totalExecutions) * 100) : 100;

    return {
      totalExecutions,
      completedWorkflows,
      workflowsRequiringAttention,
      availableToolsCount: 8,
      successRate,
      avgDurationMs,
      overdueTasksDetected: overdueTasks,
      activeIntegrationsCount: 4
    };
  }
}

export const dataStore = new OperationalDataStore();
