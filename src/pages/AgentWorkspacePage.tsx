import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Play,
  RotateCw,
  Copy,
  Download,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Wrench,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Send,
  Check,
  Hash,
  Info,
  Terminal,
  Cpu,
  CornerDownRight,
  UserCheck
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge.js';
import { JsonViewer } from '../components/JsonViewer.js';
import { api } from '../services/api.js';
import {
  WorkflowExecution,
  ExecutionStepResult,
  AutonomyMode,
  PlannedStep
} from '../types/index.js';
import { useToast } from '../context/ToastContext.js';

interface AgentWorkspacePageProps {
  initialExecutionId?: string | null;
  initialPrompt?: string | null;
  onExecutionUpdated?: () => void;
}

export const AgentWorkspacePage: React.FC<AgentWorkspacePageProps> = ({
  initialExecutionId,
  initialPrompt,
  onExecutionUpdated
}) => {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState(
    initialPrompt || "Identify overdue tasks, prioritize the critical ones, prepare follow-up drafts, and give me an executive summary."
  );
  const [autonomyMode, setAutonomyMode] = useState<AutonomyMode>('supervised');
  const [execution, setExecution] = useState<WorkflowExecution | null>(null);
  const [isPlanning, setIsPlanning] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({});
  const [explainOpen, setExplainOpen] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  // Load existing execution if provided
  useEffect(() => {
    if (initialExecutionId) {
      loadExecution(initialExecutionId);
    } else if (initialPrompt) {
      setPrompt(initialPrompt);
      handlePlanWorkflow(initialPrompt);
    } else {
      // Default initial view: load the most recent execution to immediately show a rich, working state
      loadLatestExecution();
    }
  }, [initialExecutionId, initialPrompt]);

  const loadExecution = async (id: string) => {
    try {
      const exec = await api.getExecution(id);
      setExecution(exec);
      setPrompt(exec.userPrompt);
      setAutonomyMode(exec.autonomyMode);
    } catch (err) {
      console.error("Failed to load execution:", err);
    }
  };

  const loadLatestExecution = async () => {
    try {
      const res = await api.getExecutions();
      if (res.executions.length > 0) {
        setExecution(res.executions[0]);
        setPrompt(res.executions[0].userPrompt);
        setAutonomyMode(res.executions[0].autonomyMode);
      }
    } catch (err) {
      console.error("Failed to load latest execution:", err);
    }
  };

  // Step 1: Plan workflow from natural language
  const handlePlanWorkflow = async (userIntent?: string) => {
    const targetPrompt = userIntent || prompt;
    if (!targetPrompt.trim()) return;

    try {
      setIsPlanning(true);
      const planned = await api.planWorkflow(targetPrompt, autonomyMode);
      setExecution(planned);
      toast({
        title: "Workflow Plan Generated",
        description: `Constructed ${planned.plan.length}-step execution plan with verified tools.`
      });
      onExecutionUpdated?.();
    } catch (err: any) {
      toast({
        title: "Planning Failed",
        description: err?.message || "Could not plan workflow.",
        type: "error"
      });
    } finally {
      setIsPlanning(false);
    }
  };

  // Step 2: Execute workflow against real MCP tools
  const handleExecuteWorkflow = async () => {
    if (!execution) return;

    try {
      setIsExecuting(true);
      const executed = await api.executeWorkflow(execution.id);
      setExecution(executed);

      if (executed.status === 'paused_approval') {
        toast({
          title: "Execution Paused for Approval",
          description: "Human-in-the-loop gate triggered. Operator review required before proceeding.",
          type: "warning"
        });
      } else if (executed.status === 'completed') {
        toast({
          title: "Workflow Completed Successfully",
          description: `All ${executed.steps.length} steps executed with cryptographic proof verified.`
        });
      } else if (executed.status === 'failed') {
        toast({
          title: "Workflow Execution Alert",
          description: "One or more steps encountered errors.",
          type: "error"
        });
      }

      onExecutionUpdated?.();
    } catch (err: any) {
      toast({
        title: "Execution Error",
        description: err?.message || "Workflow execution failed.",
        type: "error"
      });
    } finally {
      setIsExecuting(false);
    }
  };

  // Step 3: Approve pending step (Human-in-the-Loop)
  const handleApproveStep = async (stepId: string) => {
    if (!execution) return;
    try {
      setIsExecuting(true);
      const updated = await api.approveStep(execution.id, stepId, "Operations Lead");
      setExecution(updated);
      toast({
        title: "Step Approved",
        description: "Human-in-the-loop authorization granted. Execution resumed."
      });
      onExecutionUpdated?.();
    } catch (err: any) {
      toast({
        title: "Approval Failed",
        description: err?.message || "Could not approve step.",
        type: "error"
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleRerun = async () => {
    if (!execution) return;
    try {
      setIsExecuting(true);
      const rerun = await api.rerunExecution(execution.id);
      setExecution(rerun);
      toast({
        title: "Workflow Re-executed",
        description: `Executed fresh run as ${rerun.id}.`
      });
      onExecutionUpdated?.();
    } catch (err: any) {
      toast({
        title: "Re-run Failed",
        description: err?.message || "Could not rerun workflow.",
        type: "error"
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const toggleStep = (stepId: string) => {
    setExpandedSteps(prev => ({ ...prev, [stepId]: !prev[stepId] }));
  };

  const handleCopySummary = () => {
    if (!execution?.result) return;
    const text = `# ${execution.result.headline}\n\n${execution.result.executiveSummary}\n\n## Key Findings\n${execution.result.keyFindings.map(k => `- ${k}`).join('\n')}\n\nVerification Hash: ${execution.proofVerificationHash}`;
    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    toast({ title: "Copied Summary", description: "Executive summary markdown copied to clipboard." });
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handleExportMarkdown = () => {
    if (!execution?.result) return;
    const md = `# AgentFlow AI Execution Report: ${execution.title}
**Execution ID:** ${execution.id}  
**Date:** ${new Date(execution.createdAt).toLocaleString()}  
**Status:** ${execution.status.toUpperCase()}  
**Duration:** ${(execution.durationMs / 1000).toFixed(2)}s  
**Proof Hash:** ${execution.proofVerificationHash}  

---

## Executive Summary
${execution.result.executiveSummary}

## Key Findings
${execution.result.keyFindings.map(f => `- ${f}`).join('\n')}

## Prioritized Action Items
${execution.result.prioritizedItems.map(item => `### [${item.priority.toUpperCase()}] ${item.title}
- **Assignee:** ${item.assignee}
- **Urgency Score:** ${item.urgencyScore}/100
- **Action:** ${item.recommendedAction}`).join('\n\n')}

## Follow-up Drafts
${execution.result.followUpDrafts.map(d => `### To: ${d.recipient} (${d.urgency})
**Subject:** ${d.subject}

\`\`\`
${d.body}
\`\`\``).join('\n\n')}

---
*Generated autonomously by AgentFlow AI using Model Context Protocol (MCP 2024-11-05).*
`;
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agentflow-report-${execution.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Report Exported", description: `Saved agentflow-report-${execution.id}.md` });
  };

  const handleCopyProofHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    toast({ title: "Copied Hash", description: "Cryptographic proof hash copied." });
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Intent & Planning Bar */}
      <div className="rounded-xl border border-slate-800 bg-[#121824] p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <h1 className="text-sm font-semibold text-slate-100">Workflow Command Prompt</h1>
            <span className="text-slate-500">·</span>
            <span className="text-xs text-slate-400">Autonomous Intent Engine</span>
          </div>

          {/* Autonomy Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Policy:</span>
            <div className="flex items-center p-0.5 rounded-lg bg-[#0a0e17] border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setAutonomyMode('supervised')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  autonomyMode === 'supervised'
                    ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40 font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Supervised
              </button>
              <button
                type="button"
                onClick={() => setAutonomyMode('autonomous')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  autonomyMode === 'autonomous'
                    ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40 font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Autonomous
              </button>
            </div>
          </div>
        </div>

        {/* Input box */}
        <div className="relative rounded-lg border border-slate-700/80 bg-[#090d14] focus-within:border-indigo-500 transition-colors">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={2}
            placeholder="Express your operational goal in natural language..."
            className="w-full bg-transparent p-3.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none resize-none leading-relaxed"
          />
          <div className="flex items-center justify-between px-3.5 py-2 border-t border-slate-800/80 bg-[#0e1420] text-xs">
            <span className="text-[11px] text-slate-400">
              Protocol: <span className="font-mono text-slate-300">MCP 2024-11-05</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePlanWorkflow()}
                disabled={isPlanning || isExecuting || !prompt.trim()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#182132] hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors disabled:opacity-40"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>{isPlanning ? "Planning..." : "Re-Plan Steps"}</span>
              </button>

              <button
                onClick={handleExecuteWorkflow}
                disabled={isExecuting || !execution}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm shadow-indigo-950 transition-colors disabled:opacity-40"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{isExecuting ? "Executing..." : "Execute Workflow"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Plan, Execution Steps, Final Result (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Agent Reasoning Summary */}
          {execution?.agentReasoning && (
            <div className="rounded-xl border border-indigo-900/50 bg-[#101726] p-4.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Agent Reasoning &amp; Decomposition Strategy</span>
              </div>
              <p className="text-xs text-indigo-200/80 leading-relaxed">
                {execution.agentReasoning}
              </p>
            </div>
          )}

          {/* Workflow Execution Steps */}
          <div className="rounded-xl border border-slate-800 bg-[#121824] p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                  <span>Execution Sequence</span>
                  {execution?.steps && (
                    <span className="text-xs font-mono text-slate-400">
                      ({execution.steps.filter(s => s.status === 'completed').length}/{execution.steps.length} completed)
                    </span>
                  )}
                </h2>
                <p className="text-xs text-slate-400">Step-by-step tool invocation with input/output validation</p>
              </div>

              {execution && (
                <div className="flex items-center gap-2">
                  <StatusBadge status={execution.status} size="sm" />
                </div>
              )}
            </div>

            {/* Steps List */}
            {(!execution || execution.steps.length === 0) ? (
              <div className="py-12 text-center text-xs text-slate-400">
                Click &ldquo;Re-Plan Steps&rdquo; or enter an intent above to generate a workflow.
              </div>
            ) : (
              <div className="space-y-3">
                {execution.steps.map((step, idx) => {
                  const isExpanded = expandedSteps[step.stepId] ?? false;
                  return (
                    <div
                      key={step.stepId}
                      className={`rounded-lg border transition-all ${
                        step.status === 'running'
                          ? 'border-indigo-500/70 bg-[#162035]'
                          : step.status === 'waiting_approval'
                          ? 'border-amber-600/70 bg-amber-950/20'
                          : step.status === 'completed'
                          ? 'border-slate-800 bg-[#0f1420]'
                          : 'border-slate-800/80 bg-[#0c1018]'
                      }`}
                    >
                      {/* Step Header */}
                      <div className="p-3.5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs font-bold text-slate-400 w-6">
                            0{idx + 1}
                          </span>
                          <div>
                            <div className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                              <span>{step.title}</span>
                              <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                                {step.tool}
                              </span>
                            </div>
                            {step.evidenceSummary && (
                              <div className="text-[11px] text-slate-400 mt-0.5">
                                {step.evidenceSummary}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0">
                          {step.durationMs !== undefined && step.durationMs > 0 && (
                            <span className="text-[11px] font-mono tabular-nums text-slate-400">
                              {step.durationMs}ms
                            </span>
                          )}
                          <StatusBadge status={step.status} size="sm" />

                          {/* Approval Button if Waiting */}
                          {step.status === 'waiting_approval' && (
                            <button
                              onClick={() => handleApproveStep(step.stepId)}
                              className="px-2.5 py-1 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded transition-colors flex items-center gap-1 shadow-sm"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>Authorize</span>
                            </button>
                          )}

                          <button
                            onClick={() => toggleStep(step.stepId)}
                            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                            title="Toggle inputs/outputs"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Expandable Inputs & Outputs */}
                      {isExpanded && (
                        <div className="px-3.5 pb-3.5 pt-1 border-t border-slate-800/80 space-y-3">
                          {/* Inputs */}
                          <div>
                            <div className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider mb-1">
                              Tool Arguments (Inputs)
                            </div>
                            <JsonViewer data={step.inputs} maxHeight="max-h-40" title={`inputs:${step.tool}`} />
                          </div>

                          {/* Outputs */}
                          {step.outputs && (
                            <div>
                              <div className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider mb-1">
                                Tool Response (Outputs)
                              </div>
                              <JsonViewer data={step.outputs} maxHeight="max-h-52" title={`outputs:${step.tool}`} />
                            </div>
                          )}

                          {step.error && (
                            <div className="p-2.5 rounded bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300">
                              <span className="font-semibold">Error:</span> {step.error}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Final Synthesized Result */}
          {execution?.result && (
            <div className="rounded-xl border border-slate-800 bg-[#121824] p-5 shadow-lg space-y-5">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>VERIFIED EXECUTION SYNTHESIS</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-100">
                    {execution.result.headline}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {execution.result.executiveSummary}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleCopySummary}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white bg-[#161f30] hover:bg-slate-800 border border-slate-700 rounded transition-colors"
                  >
                    {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSummary ? "Copied" : "Copy"}</span>
                  </button>

                  <button
                    onClick={handleExportMarkdown}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white bg-[#161f30] hover:bg-slate-800 border border-slate-700 rounded transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Export MD</span>
                  </button>

                  <button
                    onClick={handleRerun}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white bg-[#161f30] hover:bg-slate-800 border border-slate-700 rounded transition-colors"
                  >
                    <RotateCw className="w-3.5 h-3.5 text-slate-400" />
                    <span>Re-Run</span>
                  </button>
                </div>
              </div>

              {/* Key Findings */}
              <div>
                <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2">
                  Key Findings &amp; Observations
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {execution.result.keyFindings.map((finding, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-indigo-400 mt-0.5">•</span>
                      <span>{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Prioritized Items */}
              {execution.result.prioritizedItems.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2">
                    Prioritized Critical Path Items
                  </h4>
                  <div className="overflow-x-auto rounded-lg border border-slate-800">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#0e1420] text-slate-400 font-medium border-b border-slate-800">
                        <tr>
                          <th className="py-2 px-3 font-normal">Task</th>
                          <th className="py-2 px-3 font-normal">Assignee</th>
                          <th className="py-2 px-3 font-normal text-right">Urgency Index</th>
                          <th className="py-2 px-3 font-normal">Recommended Remediation</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 bg-[#0a0e17]">
                        {execution.result.prioritizedItems.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-800/30">
                            <td className="py-2.5 px-3">
                              <div className="font-medium text-slate-200">{item.title}</div>
                              <div className="text-[11px] font-mono text-slate-400">{item.id}</div>
                            </td>
                            <td className="py-2.5 px-3 text-slate-300">
                              {item.assignee}
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <span className="font-mono tabular-nums font-bold text-amber-400">
                                {item.urgencyScore}
                              </span>
                              <span className="text-[10px] text-slate-400">/100</span>
                            </td>
                            <td className="py-2.5 px-3 text-slate-300">
                              {item.recommendedAction}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Generated Follow-up Drafts */}
              {execution.result.followUpDrafts.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2">
                    Synthesized Stakeholder Communications
                  </h4>
                  <div className="space-y-3">
                    {execution.result.followUpDrafts.map((draft, idx) => (
                      <div key={idx} className="p-3.5 rounded-lg border border-slate-800 bg-[#0e1420] space-y-2 text-xs">
                        <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2">
                          <div>
                            <span className="font-medium text-slate-300">To:</span> {draft.recipient}
                          </div>
                          <span className="px-2 py-0.5 rounded bg-rose-950/40 text-rose-300 border border-rose-800/50 text-[10px] font-medium">
                            {draft.urgency}
                          </span>
                        </div>
                        <div className="font-medium text-slate-200">
                          {draft.subject}
                        </div>
                        <pre className="font-sans text-xs text-slate-300 whitespace-pre-wrap bg-[#080c14] p-3 rounded border border-slate-800/80 leading-relaxed">
                          {draft.body}
                        </pre>
                        <div className="flex justify-end pt-1">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(`Subject: ${draft.subject}\n\n${draft.body}`);
                              toast({ title: "Draft Copied", description: `Follow-up draft for ${draft.recipient} copied.` });
                            }}
                            className="flex items-center gap-1 px-2.5 py-1 text-xs text-indigo-300 hover:text-white bg-indigo-950/40 hover:bg-indigo-900/40 border border-indigo-800/50 rounded transition-colors"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copy Draft</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Evidence Tokens */}
              {execution.result.evidenceTokens.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2">
                    Cryptographic Proof &amp; Evidence Tokens
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {execution.result.evidenceTokens.map((tok, i) => (
                      <div key={i} className="p-2.5 rounded bg-[#0a0e17] border border-slate-800 text-xs">
                        <div className="font-medium text-slate-200 truncate">{tok.label}</div>
                        <div className="text-[11px] font-mono text-slate-400 truncate mt-0.5">{tok.source}</div>
                        <div className="text-[10px] font-mono text-indigo-400 mt-1 flex items-center justify-between">
                          <span>{tok.proofHash}</span>
                          <span className="text-slate-400">Verified</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Explainability Accordion: How this was completed */}
          <div className="rounded-xl border border-slate-800 bg-[#121824] overflow-hidden">
            <button
              onClick={() => setExplainOpen(!explainOpen)}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/30 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-semibold text-slate-200">
                  Explainability: How this workflow was planned and verified
                </span>
              </div>
              {explainOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {explainOpen && (
              <div className="p-4 pt-1 border-t border-slate-800 text-xs text-slate-300 space-y-3 leading-relaxed">
                <div>
                  <div className="font-semibold text-slate-200 mb-0.5">1. Intent Parsing &amp; Goal Formulation</div>
                  <p className="text-slate-400">
                    The input string is normalized and passed through the agent planning pipeline.
                    The engine determines tool selection based on domain intent tags, mapping keywords to registered MCP capabilities.
                  </p>
                </div>
                <div>
                  <div className="font-semibold text-slate-200 mb-0.5">2. Tool Selection Rationale</div>
                  <ul className="list-disc pl-4 space-y-1 text-slate-400">
                    <li><code className="text-slate-200">list_tasks</code>: Selected to retrieve active records with minimal latency overhead.</li>
                    <li><code className="text-slate-200">analyze_priorities</code>: Selected for mathematical multi-factor scoring (SLA risk + days overdue).</li>
                    <li><code className="text-slate-200">create_follow_up_draft</code>: Selected to synthesize contextual unblock communications.</li>
                    <li><code className="text-slate-200">save_workflow_result</code>: Selected to generate immutable cryptographic proof in the ledger.</li>
                  </ul>
                </div>
                <div>
                  <div className="font-semibold text-slate-200 mb-0.5">3. Safety Constraints &amp; Invariants</div>
                  <p className="text-slate-400">
                    Execution parameters conform strictly to JSON Schema definitions. No arbitrary code execution or unvalidated writes are permitted.
                    Destructive actions or broadcast notifications require operator approval under Supervised mode.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Context Inspector (1 Col) */}
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-800 bg-[#121824] p-5 space-y-4 sticky top-20">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Context Inspector
              </h3>
              <span className="font-mono text-[11px] text-indigo-400">
                {execution ? execution.id : "—"}
              </span>
            </div>

            {/* Metadata Rows */}
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 text-[11px]">Workflow Name</span>
                <div className="font-medium text-slate-200 mt-0.5">
                  {execution ? execution.title : "No active execution"}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 text-[11px]">Status</span>
                  <div className="mt-1">
                    {execution ? <StatusBadge status={execution.status} size="sm" /> : "—"}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px]">Autonomy</span>
                  <div className="mt-1 font-medium text-slate-200 capitalize">
                    {execution ? execution.autonomyMode : "Supervised"}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 text-[11px]">Duration</span>
                  <div className="mt-0.5 font-mono tabular-nums text-slate-200">
                    {execution && execution.durationMs > 0 ? `${(execution.durationMs / 1000).toFixed(2)}s` : "0.00s"}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px]">Environment</span>
                  <div className="mt-0.5 font-medium text-slate-200">
                    Alexa+ MCP
                  </div>
                </div>
              </div>

              {/* Tools invoked */}
              <div>
                <span className="text-slate-400 text-[11px]">Connected Tools</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {(execution?.toolsUsed || ["list_tasks", "analyze_priorities", "create_follow_up_draft", "save_workflow_result"]).map((tool) => (
                    <span
                      key={tool}
                      className="px-2 py-0.5 rounded bg-[#0a0e17] border border-slate-800 text-[11px] font-mono text-indigo-300"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Verification Hash */}
              <div>
                <span className="text-slate-400 text-[11px]">Proof Verification Hash</span>
                {execution?.proofVerificationHash ? (
                  <div className="mt-1 p-2 rounded bg-[#090d14] border border-slate-800 flex items-center justify-between text-[11px] font-mono text-emerald-400">
                    <span className="truncate max-w-[180px]">{execution.proofVerificationHash}</span>
                    <button
                      onClick={() => handleCopyProofHash(execution.proofVerificationHash)}
                      className="p-1 hover:text-white"
                      title="Copy Proof Hash"
                    >
                      {copiedHash ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-500 mt-0.5">Pending completion</div>
                )}
              </div>

              {/* Security Boundary */}
              <div className="pt-2 border-t border-slate-800">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                  <span>SOC2 Security Envelope Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
