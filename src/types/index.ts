export type StepStatus = 'planned' | 'running' | 'completed' | 'failed' | 'skipped' | 'waiting_approval';
export type WorkflowStatus = 'idle' | 'planning' | 'running' | 'completed' | 'failed' | 'paused_approval' | 'cancelled';
export type PriorityLevel = 'critical' | 'high' | 'medium' | 'low';
export type AutonomyMode = 'supervised' | 'autonomous' | 'read_only';

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  assignee: {
    name: string;
    email: string;
    avatar?: string;
    role: string;
  };
  status: 'todo' | 'in_progress' | 'blocked' | 'review' | 'done';
  priority: PriorityLevel;
  dueDate: string;
  isOverdue: boolean;
  daysOverdue: number;
  project: string;
  tags: string[];
  blockerReason?: string;
  slaBreachRisk: 'critical' | 'high' | 'moderate' | 'nominal';
}

export interface MCPToolParameter {
  type: string;
  description: string;
  enum?: string[];
  default?: any;
}

export interface MCPTool {
  name: string;
  description: string;
  category: 'retrieval' | 'analysis' | 'generation' | 'persistence' | 'dispatch' | 'governance';
  inputSchema: {
    type: 'object';
    properties: Record<string, MCPToolParameter>;
    required?: string[];
  };
  outputSchema?: Record<string, any>;
  requiresApproval?: boolean;
  version: string;
  invocationsCount: number;
  avgLatencyMs: number;
}

export interface PlannedStep {
  id: string;
  stepNumber: number;
  title: string;
  tool: string;
  rationale: string;
  expectedOutput: string;
  inputParameters: Record<string, any>;
  requiresApproval?: boolean;
}

export interface ExecutionStepResult {
  stepId: string;
  stepNumber: number;
  title: string;
  tool: string;
  status: StepStatus;
  startedAt?: string;
  completedAt?: string;
  durationMs?: number;
  inputs: Record<string, any>;
  outputs?: any;
  error?: string;
  evidenceSummary?: string;
  requiresApproval?: boolean;
  approvedBy?: string;
  approvalStatus?: 'approved' | 'rejected' | 'pending';
}

export interface ExecutionSummaryResult {
  headline: string;
  executiveSummary: string;
  keyFindings: string[];
  prioritizedItems: Array<{
    id: string;
    title: string;
    priority: PriorityLevel;
    urgencyScore: number;
    recommendedAction: string;
    assignee: string;
  }>;
  suggestedNextActions: string[];
  followUpDrafts: Array<{
    recipient: string;
    subject: string;
    body: string;
    urgency: string;
  }>;
  evidenceTokens: Array<{
    label: string;
    source: string;
    timestamp: string;
    proofHash: string;
  }>;
}

export interface WorkflowExecution {
  id: string;
  title: string;
  userPrompt: string;
  category: string;
  status: WorkflowStatus;
  createdAt: string;
  completedAt?: string;
  durationMs: number;
  steps: ExecutionStepResult[];
  plan: PlannedStep[];
  agentReasoning: string;
  result?: ExecutionSummaryResult;
  toolsUsed: string[];
  proofVerificationHash: string;
  autonomyMode: AutonomyMode;
  environment: 'alexa_mcp' | 'bedrock_agent' | 'hybrid';
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: 'Productivity' | 'Engineering Operations' | 'Business Operations' | 'Incident Response' | 'Reporting';
  estimatedDuration: string;
  toolsRequired: string[];
  samplePrompt: string;
  stepsOverview: string[];
  requiresExternalCredentials: boolean;
  isAvailable: boolean;
}

export interface IntegrationStatus {
  id: string;
  name: string;
  description: string;
  type: 'mcp' | 'amazon_bedrock' | 'alexa_developer' | 'local_store';
  connected: boolean;
  status: 'operational' | 'degraded' | 'not_configured' | 'offline';
  endpoint: string;
  protocolVersion?: string;
  lastChecked: string;
  latencyMs: number;
  permissions: string[];
}

export interface OperationalMetrics {
  totalExecutions: number;
  completedWorkflows: number;
  workflowsRequiringAttention: number;
  availableToolsCount: number;
  successRate: number;
  avgDurationMs: number;
  overdueTasksDetected: number;
  activeIntegrationsCount: number;
}
