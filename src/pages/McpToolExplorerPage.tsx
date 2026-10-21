import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Terminal,
  Play,
  RotateCw,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  Shield,
  Code2,
  Copy,
  Check,
  X,
  ExternalLink
} from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { JsonViewer } from '../components/JsonViewer.js';
import { api } from '../services/api.js';
import { MCPTool } from '../types/index.js';
import { useToast } from '../context/ToastContext.js';

export const McpToolExplorerPage: React.FC = () => {
  const { toast } = useToast();
  const [tools, setTools] = useState<MCPTool[]>([]);
  const [mcpStatus, setMcpStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTool, setSelectedTool] = useState<MCPTool | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Form input state for testing tool
  const [toolArgs, setToolArgs] = useState<Record<string, any>>({});
  const [runningTool, setRunningTool] = useState(false);
  const [toolResult, setToolResult] = useState<any>(null);

  useEffect(() => {
    loadMcpData();
  }, []);

  const loadMcpData = async () => {
    try {
      setLoading(true);
      const [toolsRes, statusRes] = await Promise.all([
        api.getMcpTools(),
        api.getMcpStatus()
      ]);
      setTools(toolsRes.tools);
      setMcpStatus(statusRes);
    } catch (err) {
      console.error("Failed to load MCP status:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenTestModal = (tool: MCPTool) => {
    setSelectedTool(tool);
    setToolResult(null);

    // Initialize sensible defaults for form fields
    const initialArgs: Record<string, any> = {};
    if (tool.inputSchema.properties) {
      Object.entries(tool.inputSchema.properties).forEach(([key, prop]) => {
        if (prop.default !== undefined) {
          initialArgs[key] = prop.default;
        } else if (prop.type === 'boolean') {
          initialArgs[key] = key === 'is_overdue' ? true : false;
        } else if (prop.type === 'number') {
          initialArgs[key] = 10;
        } else if (key === 'task_id') {
          initialArgs[key] = "TSK-8041";
        } else if (key === 'audit_standard') {
          initialArgs[key] = "SOC2_Type_II";
        } else if (prop.enum && prop.enum.length > 0) {
          initialArgs[key] = prop.enum[0];
        } else {
          initialArgs[key] = "";
        }
      });
    }
    setToolArgs(initialArgs);
    setDialogOpen(true);
  };

  const handleExecuteTool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTool) return;

    try {
      setRunningTool(true);
      const cleanedArgs: Record<string, any> = {};
      Object.entries(toolArgs).forEach(([k, v]) => {
        if (v !== "" && v !== undefined) {
          cleanedArgs[k] = v;
        }
      });

      const res = await api.callMcpTool(selectedTool.name, cleanedArgs);
      setToolResult(res);

      if (res.success) {
        toast({
          title: "Tool Invocation Succeeded",
          description: `Executed ${selectedTool.name} in ${res.durationMs}ms.`
        });
      } else {
        toast({
          title: "Tool Error",
          description: res.error || "Invocation returned error flag.",
          type: "error"
        });
      }
    } catch (err: any) {
      toast({
        title: "Call Failed",
        description: err?.message || "Execution exception.",
        type: "error"
      });
    } finally {
      setRunningTool(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
            <span>MCP Tool Explorer &amp; Developer Console</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Live Model Context Protocol (MCP 2024-11-05) runtime for Amazon Alexa+ and AgentFlow. Inspect schemas and execute tools directly.
          </p>
        </div>

        <button
          onClick={loadMcpData}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-[#141b29] hover:bg-slate-800 border border-slate-700/80 rounded-md transition-colors"
        >
          <RotateCw className="w-3.5 h-3.5 text-slate-400" />
          <span>Refresh Server</span>
        </button>
      </div>

      {/* Protocol Connection Panel */}
      <div className="rounded-xl border border-slate-800 bg-[#121824] p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className="text-sm font-semibold text-slate-200">
              Model Context Protocol (MCP) Server Status
            </h2>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-0.5 rounded">
            Connected &amp; Operational
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-[#0a0e17] border border-slate-800">
            <span className="text-[11px] text-slate-400">Endpoint URL</span>
            <div className="font-mono text-slate-200 truncate mt-1">
              http://localhost:3000/api/mcp
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#0a0e17] border border-slate-800">
            <span className="text-[11px] text-slate-400">Protocol Spec Version</span>
            <div className="font-mono text-indigo-400 font-semibold mt-1">
              {mcpStatus?.protocolVersion || "2024-11-05"}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#0a0e17] border border-slate-800">
            <span className="text-[11px] text-slate-400">Registered Tools</span>
            <div className="font-mono tabular-nums text-slate-200 font-bold mt-1">
              {tools.length} active tools
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#0a0e17] border border-slate-800">
            <span className="text-[11px] text-slate-400">Transport &amp; Stream</span>
            <div className="font-mono text-slate-200 mt-1">
              JSON-RPC 2.0 / SSE
            </div>
          </div>
        </div>
      </div>

      {/* Tools Registry Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-200">
              Discovered Tool Registry
            </h3>
            <p className="text-xs text-slate-400">
              Inspect input parameters and trigger live executions
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {tools.length} tools available
          </span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400">Discovering tools over MCP...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tools.map((tool) => (
              <div
                key={tool.name}
                className="rounded-xl border border-slate-800 bg-[#121824] p-5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-md group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-indigo-950/40 border border-indigo-800/40 flex items-center justify-center text-indigo-400 font-mono text-[10px]">
                        fx
                      </div>
                      <h4 className="font-mono text-xs font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
                        {tool.name}
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0a0e17] text-slate-400 border border-slate-800">
                      v{tool.version}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {tool.description}
                  </p>

                  {/* Telemetry row */}
                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-4 text-[11px] text-slate-400 font-mono">
                    <div>
                      <span>Invocations: </span>
                      <span className="text-slate-200 font-bold tabular-nums">{tool.invocationsCount}</span>
                    </div>
                    <div>
                      <span>Avg Latency: </span>
                      <span className="text-emerald-400 font-bold tabular-nums">{tool.avgLatencyMs}ms</span>
                    </div>
                    {tool.requiresApproval && (
                      <span className="text-amber-400 ml-auto font-sans font-medium text-[10px]">
                        Requires Approval
                      </span>
                    )}
                  </div>

                  {/* Parameter chips */}
                  <div className="mt-3">
                    <span className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider block mb-1">
                      Input Properties
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {tool.inputSchema.properties &&
                        Object.keys(tool.inputSchema.properties).map((prop) => {
                          const isRequired = tool.inputSchema.required?.includes(prop);
                          return (
                            <span
                              key={prop}
                              className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                                isRequired
                                  ? 'bg-indigo-950/40 border-indigo-700/60 text-indigo-300 font-semibold'
                                  : 'bg-[#090d14] border-slate-800 text-slate-400'
                              }`}
                            >
                              {prop}{isRequired ? '*' : ''}
                            </span>
                          );
                        })}
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono capitalize">
                    category: {tool.category}
                  </span>

                  <button
                    onClick={() => handleOpenTestModal(tool)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors shadow-sm"
                  >
                    <Play className="w-3 h-3" />
                    <span>Test Tool</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tool Testing Runner Dialog (Accessible Radix Dialog) */}
      {selectedTool && (
        <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 animate-in fade-in" />
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[88vh] bg-[#101622] border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
              {/* Header */}
              <div className="flex items-center justify-between p-4.5 border-b border-slate-800 bg-[#0c111a]">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded bg-indigo-600/20 text-indigo-400 font-mono text-xs flex items-center justify-center font-bold">
                    fx
                  </div>
                  <div>
                    <h3 className="text-sm font-bold font-mono text-slate-100">
                      {selectedTool.name}
                    </h3>
                    <p className="text-xs text-slate-400 truncate max-w-md">
                      {selectedTool.description}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setDialogOpen(false)}
                  className="p-1 rounded text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleExecuteTool} className="p-5 overflow-y-auto space-y-4 flex-1">
                <div className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
                  Configure Tool Parameters
                </div>

                <div className="space-y-3">
                  {selectedTool.inputSchema.properties &&
                    Object.entries(selectedTool.inputSchema.properties).map(([paramName, paramDef]) => {
                      const isRequired = selectedTool.inputSchema.required?.includes(paramName);
                      return (
                        <div key={paramName} className="space-y-1">
                          <label className="text-xs font-medium text-slate-300 flex items-center gap-1">
                            <span className="font-mono text-indigo-300">{paramName}</span>
                            {isRequired && <span className="text-rose-400">*</span>}
                            <span className="text-[10px] text-slate-400 font-mono">({paramDef.type})</span>
                          </label>

                          <div className="text-[11px] text-slate-400">
                            {paramDef.description}
                          </div>

                          {paramDef.enum ? (
                            <select
                              value={toolArgs[paramName] ?? ''}
                              onChange={(e) => setToolArgs({ ...toolArgs, [paramName]: e.target.value })}
                              className="w-full text-xs p-2 rounded bg-[#090d14] border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
                            >
                              {paramDef.enum.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          ) : paramDef.type === 'boolean' ? (
                            <select
                              value={String(toolArgs[paramName] ?? false)}
                              onChange={(e) => setToolArgs({ ...toolArgs, [paramName]: e.target.value === 'true' })}
                              className="w-full text-xs p-2 rounded bg-[#090d14] border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
                            >
                              <option value="true">true</option>
                              <option value="false">false</option>
                            </select>
                          ) : (
                            <input
                              type={paramDef.type === 'number' ? 'number' : 'text'}
                              value={toolArgs[paramName] ?? ''}
                              onChange={(e) =>
                                setToolArgs({
                                  ...toolArgs,
                                  [paramName]: paramDef.type === 'number' ? Number(e.target.value) : e.target.value
                                })
                              }
                              placeholder={isRequired ? 'Required' : 'Optional'}
                              className="w-full text-xs p-2 rounded bg-[#090d14] border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                            />
                          )}
                        </div>
                      );
                    })}
                </div>

                {/* Output Inspection Box */}
                {toolResult && (
                  <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Execution Response</span>
                      </span>
                      <span className="font-mono text-emerald-400 tabular-nums">
                        {toolResult.durationMs}ms
                      </span>
                    </div>

                    <JsonViewer
                      data={toolResult.output || toolResult}
                      maxHeight="max-h-60"
                      title={`${selectedTool.name} Output`}
                    />
                  </div>
                )}
              </form>

              {/* Footer */}
              <div className="p-4 bg-[#0c111a] border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400">
                  Target: /api/mcp/call
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDialogOpen(false)}
                    className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleExecuteTool}
                    disabled={runningTool}
                    className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors disabled:opacity-40"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{runningTool ? "Running Tool..." : "Execute Tool"}</span>
                  </button>
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </div>
  );
};
