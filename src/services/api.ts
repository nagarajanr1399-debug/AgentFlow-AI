import {
  WorkflowExecution,
  OperationalMetrics,
  MCPTool,
  WorkflowTemplate,
  IntegrationStatus,
  TaskItem,
  AutonomyMode
} from '../types/index.js';

export const api = {
  // MCP
  async getMcpTools(): Promise<{ tools: MCPTool[]; protocolVersion: string; serverName: string }> {
    const res = await fetch('/api/mcp/tools');
    if (!res.ok) throw new Error('Failed to fetch MCP tools');
    return res.json();
  },

  async callMcpTool(tool: string, args: Record<string, any>): Promise<{ tool: string; output: any; durationMs: number; success: boolean; error?: string }> {
    const res = await fetch('/api/mcp/call', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tool, args })
    });
    return res.json();
  },

  async getMcpStatus(): Promise<{ status: string; protocolVersion: string; serverName: string; serverVersion: string; toolsRegistered: number; uptimeSeconds: number }> {
    const res = await fetch('/api/mcp/status');
    if (!res.ok) throw new Error('Failed to fetch MCP status');
    return res.json();
  },

  // Workflows
  async planWorkflow(prompt: string, autonomyMode: AutonomyMode = 'supervised'): Promise<WorkflowExecution> {
    const res = await fetch('/api/workflows/plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, autonomyMode })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to plan workflow');
    }
    return res.json();
  },

  async executeWorkflow(executionId: string): Promise<WorkflowExecution> {
    const res = await fetch('/api/workflows/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ executionId })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to execute workflow');
    }
    return res.json();
  },

  // Executions
  async getExecutions(): Promise<{ executions: WorkflowExecution[]; total: number }> {
    const res = await fetch('/api/executions');
    if (!res.ok) throw new Error('Failed to fetch executions');
    return res.json();
  },

  async getExecution(id: string): Promise<WorkflowExecution> {
    const res = await fetch(`/api/executions/${id}`);
    if (!res.ok) throw new Error('Failed to fetch execution detail');
    return res.json();
  },

  async approveStep(executionId: string, stepId: string, approvedBy: string = 'Operations Lead'): Promise<WorkflowExecution> {
    const res = await fetch(`/api/executions/${executionId}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stepId, approvedBy })
    });
    if (!res.ok) throw new Error('Failed to approve step');
    return res.json();
  },

  async rerunExecution(executionId: string): Promise<WorkflowExecution> {
    const res = await fetch(`/api/executions/${executionId}/rerun`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to rerun execution');
    return res.json();
  },

  async deleteExecution(id: string): Promise<void> {
    const res = await fetch(`/api/executions/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete execution');
  },

  // Operational metrics
  async getMetrics(): Promise<OperationalMetrics> {
    const res = await fetch('/api/metrics');
    if (!res.ok) throw new Error('Failed to fetch metrics');
    return res.json();
  },

  // Tasks
  async getTasks(params?: { isOverdue?: boolean; status?: string; priority?: string }): Promise<{ tasks: TaskItem[]; total: number }> {
    const query = new URLSearchParams();
    if (params?.isOverdue !== undefined) query.set('isOverdue', String(params.isOverdue));
    if (params?.status) query.set('status', params.status);
    if (params?.priority) query.set('priority', params.priority);
    const res = await fetch(`/api/tasks?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch tasks');
    return res.json();
  },

  // Templates
  async getTemplates(): Promise<{ templates: WorkflowTemplate[] }> {
    const res = await fetch('/api/templates');
    if (!res.ok) throw new Error('Failed to fetch templates');
    return res.json();
  },

  // Integrations
  async getIntegrations(): Promise<{ integrations: IntegrationStatus[] }> {
    const res = await fetch('/api/integrations');
    if (!res.ok) throw new Error('Failed to fetch integrations');
    return res.json();
  },

  async testIntegration(id: string): Promise<{ success: boolean; integration: IntegrationStatus; message: string }> {
    const res = await fetch('/api/integrations/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    if (!res.ok) throw new Error('Integration test failed');
    return res.json();
  },

  // Settings
  async getSettings(): Promise<any> {
    const res = await fetch('/api/settings');
    if (!res.ok) throw new Error('Failed to fetch settings');
    return res.json();
  },

  async updateSettings(settings: any): Promise<any> {
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    if (!res.ok) throw new Error('Failed to save settings');
    return res.json();
  }
};
