import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Award, CheckCircle2, Shield, Wrench, Sparkles, Terminal, X, ArrowRight, Play } from 'lucide-react';

interface HackathonJudgeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRunSampleWorkflow: () => void;
}

export const HackathonJudgeModal: React.FC<HackathonJudgeModalProps> = ({
  open,
  onOpenChange,
  onRunSampleWorkflow
}) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 animate-in fade-in" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl max-h-[90vh] bg-[#101622] border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-[#0c111a]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <span>AgentFlow AI — Amazon Developer Hackathon 2026</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Judges&apos; Evaluation Guide, 3-Minute Demo Script &amp; Technical Architecture
                </p>
              </div>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
            {/* Value Proposition */}
            <div className="p-4 rounded-lg bg-indigo-950/30 border border-indigo-800/40">
              <div className="font-semibold text-sm text-indigo-200 mb-1">
                The Product Vision: &ldquo;From intent to action. With proof.&rdquo;
              </div>
              <p className="text-xs text-indigo-300/80 leading-relaxed">
                AgentFlow AI replaces opaque black-box AI chat with a transparent autonomous workflow operations command center.
                Users express high-level operational intent, and our agent constructs a structured execution plan, executes real tools
                via the <strong>Model Context Protocol (MCP)</strong> and <strong>Amazon Alexa+ runtime</strong>, enforces human-in-the-loop safeguards,
                and generates cryptographic proof of every completed action.
              </p>
            </div>

            {/* Architecture Overview */}
            <div>
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                Technical Architecture
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-center text-slate-200">
                <div className="p-2.5 rounded border border-slate-800 bg-[#141b29]">
                  <div className="font-bold text-slate-100 mb-1">1. Intent Parser</div>
                  <div className="text-[11px] text-slate-400">Alexa+ Voice / Natural Language Prompt</div>
                </div>
                <div className="p-2.5 rounded border border-slate-800 bg-[#141b29]">
                  <div className="font-bold text-slate-100 mb-1">2. Agent Planner</div>
                  <div className="text-[11px] text-slate-400">Step DAG &amp; Urgency Heuristics Engine</div>
                </div>
                <div className="p-2.5 rounded border border-slate-800 bg-[#141b29]">
                  <div className="font-bold text-slate-100 mb-1">3. MCP Server</div>
                  <div className="text-[11px] text-slate-400">JSON-RPC 2.0 &amp; Streamable HTTP</div>
                </div>
                <div className="p-2.5 rounded border border-slate-800 bg-[#141b29]">
                  <div className="font-bold text-slate-100 mb-1">4. Proof Ledger</div>
                  <div className="text-[11px] text-slate-400">SHA-256 Audit Verification Tokens</div>
                </div>
              </div>
            </div>

            {/* 3-Minute Demo Walkthrough Script */}
            <div>
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5 text-indigo-400" />
                3-Minute Hackathon Demo Script for Judges
              </h3>
              <div className="space-y-3">
                <div className="p-3 rounded-lg border border-slate-800 bg-[#121824] flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-800 text-indigo-400 font-mono text-xs flex items-center justify-center font-bold shrink-0">
                    1
                  </div>
                  <div>
                    <div className="font-semibold text-slate-200">Minute 1: The Executive Problem &amp; Intent Expressed</div>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      On the <strong>Executive Overview</strong> page, observe the operational summary metrics and backlog.
                      Click the sample prompt: <em>&ldquo;Identify overdue tasks, prioritize the critical ones, prepare follow-up drafts, and give me an executive summary.&rdquo;</em>
                      Observe how the agent parses intent into an explicit, numbered execution plan (01–04) rather than a wall of chatbot text.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-slate-800 bg-[#121824] flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-800 text-indigo-400 font-mono text-xs flex items-center justify-center font-bold shrink-0">
                    2
                  </div>
                  <div>
                    <div className="font-semibold text-slate-200">Minute 2: Autonomous Tool Execution &amp; Traceable Evidence</div>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      In the <strong>Agent Workspace</strong>, click <strong>&ldquo;Execute Workflow&rdquo;</strong>.
                      Watch the real-time execution transitions as each tool (<code>list_tasks</code>, <code>analyze_priorities</code>, <code>create_follow_up_draft</code>, <code>save_workflow_result</code>)
                      is invoked against the local MCP server. Inspect inputs, duration, structured JSON outputs, and the synthesized executive summary and follow-up drafts.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-slate-800 bg-[#121824] flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-800 text-indigo-400 font-mono text-xs flex items-center justify-center font-bold shrink-0">
                    3
                  </div>
                  <div>
                    <div className="font-semibold text-slate-200">Minute 3: The Alexa+ MCP Tool Explorer &amp; Protocol Compliance</div>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Navigate to the <strong>MCP Tool Explorer</strong> page.
                      Review the live MCP server status (Protocol <code>2024-11-05</code>, Streamable HTTP, zero mock descriptions).
                      Click <strong>&ldquo;Test Tool&rdquo;</strong> on any tool (e.g. <code>analyze_priorities</code>) to execute it directly and inspect the live JSON response with duration metrics.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Judging Criteria Alignment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded border border-slate-800 bg-[#0e1420]">
                <div className="font-semibold text-slate-200 flex items-center gap-1.5 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Tech Implementation
                </div>
                <div className="text-[11px] text-slate-400 leading-normal">
                  Real running MCP server (`/api/mcp`) supporting JSON-RPC 2.0 `tools/list`, `tools/call`, and `initialize`, plus Alexa+ dispatcher and Bedrock model connectors.
                </div>
              </div>
              <div className="p-3 rounded border border-slate-800 bg-[#0e1420]">
                <div className="font-semibold text-slate-200 flex items-center gap-1.5 mb-1">
                  <Shield className="w-3.5 h-3.5 text-indigo-400" />
                  Safety &amp; Human-in-the-Loop
                </div>
                <div className="text-[11px] text-slate-400 leading-normal">
                  Supervised execution policy requires operator approval for consequential actions (notifications, destructive changes) before execution resumes.
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-[#0c111a] border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Amazon Developer Hackathon 2026 Submission
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenChange(false)}
                className="px-3 py-1.5 text-xs text-slate-300 hover:text-white rounded hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onOpenChange(false);
                  onRunSampleWorkflow();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors"
              >
                <span>Launch Primary Demo Workflow</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
