import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  Activity,
  Layers,
  Wrench,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Play,
  RotateCw,
  Terminal,
  ChevronRight
} from 'lucide-react';
import { MetricCard } from '../components/MetricCard.js';
import { StatusBadge } from '../components/StatusBadge.js';
import { api } from '../services/api.js';
import { WorkflowExecution, OperationalMetrics } from '../types/index.js';
import { NavTab } from '../components/Sidebar.js';

interface OverviewPageProps {
  onNavigate: (tab: NavTab) => void;
  onLaunchPrompt: (prompt: string) => void;
  onInspectExecution: (id: string) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  onNavigate,
  onLaunchPrompt,
  onInspectExecution
}) => {
  const [promptInput, setPromptInput] = useState('');
  const [metrics, setMetrics] = useState<OperationalMetrics | null>(null);
  const [recentExecutions, setRecentExecutions] = useState<WorkflowExecution[]>([]);
  const [loading, setLoading] = useState(true);

  const samplePrompts = [
    {
      title: "Overdue Task Remediation",
      prompt: "Identify overdue tasks, prioritize the critical ones, prepare follow-up drafts, and give me an executive summary.",
      category: "Productivity"
    },
    {
      title: "Security & SOC2 Audit",
      prompt: "Audit security permissions and verify compliance evidence for pending items.",
      category: "Compliance"
    },
    {
      title: "Infrastructure P0 Triage",
      prompt: "Investigate critical blocked infrastructure tasks, evaluate SLA blast radius, and draft escalation dispatch.",
      category: "Reliability"
    }
  ];

  const loadData = async () => {
    try {
      setLoading(true);
      const [m, execRes] = await Promise.all([
        api.getMetrics(),
        api.getExecutions()
      ]);
      setMetrics(m);
      setRecentExecutions(execRes.executions);
    } catch (err) {
      console.error("Failed to load overview data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;
    onLaunchPrompt(promptInput.trim());
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">
            Your AI operations workspace
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Turn complex requests into verified, traceable actions with connected Model Context Protocol tools.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('mcp')}
            className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-[#141b29] hover:bg-slate-800 border border-slate-700/80 rounded-md transition-colors flex items-center gap-2"
          >
            <Wrench className="w-3.5 h-3.5 text-slate-400" />
            <span>Explore tools</span>
          </button>
          <button
            onClick={() => onNavigate('workspace')}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md shadow-sm shadow-indigo-950 transition-colors flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
            <span>Create workflow</span>
          </button>
        </div>
      </div>

      {/* Operational Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <MetricCard
          label="Total Executions"
          value={metrics ? metrics.totalExecutions : "—"}
          subtext="Recorded in audit ledger"
          icon={<Layers className="w-4 h-4" />}
        />
        <MetricCard
          label="Completed Workflows"
          value={metrics ? metrics.completedWorkflows : "—"}
          trend={metrics && metrics.totalExecutions > 0 ? `${metrics.successRate}%` : undefined}
          subtext="Verified proof tokens"
          icon={<CheckCircle2 className="w-4 h-4" />}
        />
        <MetricCard
          label="Requiring Attention"
          value={metrics ? metrics.workflowsRequiringAttention : "—"}
          subtext="Awaiting operator approval"
          icon={<AlertTriangle className="w-4 h-4" />}
        />
        <MetricCard
          label="Available MCP Tools"
          value={metrics ? metrics.availableToolsCount : "8"}
          subtext="Protocol 2024-11-05"
          icon={<Wrench className="w-4 h-4" />}
        />
        <MetricCard
          label="Average Duration"
          value={metrics && metrics.avgDurationMs ? `${(metrics.avgDurationMs / 1000).toFixed(1)}s` : "3.4s"}
          subtext="Autonomous execution cycle"
          icon={<Clock className="w-4 h-4" />}
        />
      </div>

      {/* Main Feature: Start with Intent */}
      <div className="rounded-xl border border-slate-800/90 bg-[#121824] p-5 shadow-lg shadow-black/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold">
              <Terminal className="w-3.5 h-3.5" />
            </div>
            <span className="text-sm font-semibold text-slate-200">Start with intent</span>
            <span className="text-slate-500">·</span>
            <span className="text-xs text-slate-400">Natural language to autonomous tool execution</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Target: Alexa+ MCP Runtime</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative rounded-lg border border-slate-700/80 bg-[#0a0e17] focus-within:border-indigo-500 transition-colors">
            <textarea
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder="Describe the outcome you want to achieve... (e.g., Identify overdue tasks, prioritize the critical ones, prepare follow-up drafts, and give me an executive summary.)"
              rows={3}
              className="w-full bg-transparent p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none resize-none leading-relaxed"
            />
            <div className="flex items-center justify-between px-3.5 py-2.5 border-t border-slate-800/80 bg-[#0d121c]/70 text-xs">
              <span className="text-[11px] text-slate-500">
                Press <kbd className="font-mono bg-slate-800 px-1 py-0.5 rounded text-slate-300">Enter</kbd> or click Execute
              </span>
              <button
                type="submit"
                disabled={!promptInput.trim()}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white font-semibold text-xs transition-colors shadow-sm shadow-indigo-900"
              >
                <span>Execute Workflow</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </form>

        {/* Example prompts */}
        <div className="mt-4 pt-3.5 border-t border-slate-800/80">
          <div className="text-[11px] font-medium text-slate-400 mb-2">
            Example operational intents:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {samplePrompts.map((sample, i) => (
              <button
                key={i}
                onClick={() => {
                  setPromptInput(sample.prompt);
                  onLaunchPrompt(sample.prompt);
                }}
                className="text-left p-2.5 rounded-lg border border-slate-800 bg-[#0f1420] hover:border-indigo-500/50 hover:bg-slate-800/50 transition-all group"
              >
                <div className="flex items-center justify-between text-[11px] text-indigo-400 font-medium mb-1">
                  <span>{sample.title}</span>
                  <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-indigo-400 transition-colors" />
                </div>
                <div className="text-xs text-slate-300 line-clamp-2 leading-snug">
                  {sample.prompt}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Two Column Section: Recent Executions & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Executions (2 Cols) */}
        <div className="lg:col-span-2 rounded-xl border border-slate-800/90 bg-[#121824] p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-200">Recent executions</h2>
              <p className="text-xs text-slate-400">Persisted autonomous workflow records</p>
            </div>
            <button
              onClick={() => onNavigate('history')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
            >
              <span>View all ({recentExecutions.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-slate-500">Loading executions...</div>
          ) : recentExecutions.length === 0 ? (
            <div className="p-8 text-center rounded-lg border border-dashed border-slate-800 text-xs text-slate-400">
              <p>No executions recorded yet.</p>
              <button
                onClick={() => onLaunchPrompt(samplePrompts[0].prompt)}
                className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-white bg-indigo-600 rounded"
              >
                <Play className="w-3 h-3" />
                <span>Run sample workflow</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800/80 text-slate-400 font-medium">
                    <th className="pb-2.5 font-normal">Execution</th>
                    <th className="pb-2.5 font-normal">Status</th>
                    <th className="pb-2.5 font-normal text-right">Steps</th>
                    <th className="pb-2.5 font-normal text-right">Duration</th>
                    <th className="pb-2.5 font-normal text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {recentExecutions.slice(0, 5).map((exec) => (
                    <tr
                      key={exec.id}
                      onClick={() => onInspectExecution(exec.id)}
                      className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                    >
                      <td className="py-3 pr-3">
                        <div className="font-medium text-slate-200 group-hover:text-white truncate max-w-xs sm:max-w-md">
                          {exec.title}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono text-slate-400">{exec.id}</span>
                          <span>·</span>
                          <span>{new Date(exec.createdAt).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-3">
                        <StatusBadge status={exec.status} size="sm" />
                      </td>
                      <td className="py-3 pr-3 text-right font-mono tabular-nums text-slate-300">
                        {exec.steps.length}
                      </td>
                      <td className="py-3 pr-3 text-right font-mono tabular-nums text-slate-400">
                        {exec.durationMs > 0 ? `${(exec.durationMs / 1000).toFixed(1)}s` : "—"}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onInspectExecution(exec.id);
                          }}
                          className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium p-1 rounded hover:bg-indigo-950/30"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Workflow Activity Feed (1 Col) */}
        <div className="rounded-xl border border-slate-800/90 bg-[#121824] p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-slate-200">Activity stream</h2>
                <p className="text-xs text-slate-400">Live operational event log</p>
              </div>
              <button
                onClick={loadData}
                className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                title="Refresh feed"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-2.5 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <div>
                  <div className="text-slate-200 font-medium">MCP tool analyze_priorities executed</div>
                  <div className="text-[11px] text-slate-400">Urgency heuristic evaluated 4 tasks</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">2 mins ago</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-xs">
                <span className="w-2 h-2 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                <div>
                  <div className="text-slate-200 font-medium">Cryptographic proof token committed</div>
                  <div className="text-[11px] text-slate-400">Ledger record LEDG-4091 hashed</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">8 mins ago</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <div>
                  <div className="text-slate-200 font-medium">Alexa+ Skill bridge initialized</div>
                  <div className="text-[11px] text-slate-400">Protocol 2024-11-05 handshake verified</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">25 mins ago</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-xs">
                <span className="w-2 h-2 rounded-full bg-slate-500 mt-1.5 shrink-0" />
                <div>
                  <div className="text-slate-200 font-medium">Task TSK-8041 SLA warning</div>
                  <div className="text-[11px] text-slate-400">Payment Gateway TLS handshake overdue 2 days</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">1 hour ago</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Audit log: Immutable</span>
            <span className="font-mono text-emerald-400">Sync: Realtime</span>
          </div>
        </div>
      </div>
    </div>
  );
};
