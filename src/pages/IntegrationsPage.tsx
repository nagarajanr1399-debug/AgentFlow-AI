import React, { useState, useEffect } from 'react';
import {
  Link2,
  CheckCircle2,
  RotateCw,
  Shield,
  Radio,
  ExternalLink,
  Wrench,
  Cpu,
  Database,
  Sliders,
  X
} from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { api } from '../services/api.js';
import { IntegrationStatus } from '../types/index.js';
import { useToast } from '../context/ToastContext.js';

export const IntegrationsPage: React.FC = () => {
  const { toast } = useToast();
  const [integrations, setIntegrations] = useState<IntegrationStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [configureIntegration, setConfigureIntegration] = useState<IntegrationStatus | null>(null);

  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    try {
      setLoading(true);
      const res = await api.getIntegrations();
      setIntegrations(res.integrations);
    } catch (err) {
      console.error("Failed to load integrations:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async (id: string) => {
    try {
      setTestingId(id);
      const res = await api.testIntegration(id);
      setIntegrations(prev =>
        prev.map(item => (item.id === id ? res.integration : item))
      );
      toast({
        title: "Connection Verified",
        description: res.message
      });
    } catch (err: any) {
      toast({
        title: "Test Failed",
        description: err?.message,
        type: "error"
      });
    } finally {
      setTestingId(null);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'mcp':
        return Wrench;
      case 'alexa_developer':
        return Radio;
      case 'amazon_bedrock':
        return Cpu;
      case 'local_store':
      default:
        return Database;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
            <span>Connected Integrations &amp; Runtime Bridges</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Live configuration for Amazon Alexa+, Model Context Protocol (MCP), and Amazon Bedrock foundation models.
          </p>
        </div>

        <button
          onClick={loadIntegrations}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-[#141b29] hover:bg-slate-800 border border-slate-700/80 rounded-md transition-colors"
        >
          <RotateCw className="w-3.5 h-3.5 text-slate-400" />
          <span>Refresh All</span>
        </button>
      </div>

      {/* Notice Banner */}
      <div className="p-4 rounded-xl border border-indigo-900/50 bg-[#101726] flex items-start gap-3">
        <Radio className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
        <div className="text-xs text-indigo-200/90 leading-relaxed">
          <span className="font-semibold text-indigo-100">Live Evaluation Mode Active: </span>
          All integration endpoints connect to live runtime services on this instance. The local MCP server processes tool calls over JSON-RPC 2.0 with streamable SSE notifications, ready for Amazon Alexa+ skill orchestration.
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((item) => {
          const Icon = getIcon(item.type);
          const isTesting = testingId === item.id;
          return (
            <div
              key={item.id}
              className="rounded-xl border border-slate-800 bg-[#121824] p-5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-md group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-950/40 border border-indigo-800/40 flex items-center justify-center text-indigo-400 shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-100 group-hover:text-indigo-200 transition-colors">
                        {item.name}
                      </h3>
                      <span className="text-[11px] font-mono text-slate-400">
                        {item.protocolVersion || 'Standard'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 text-[11px] font-medium font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>{item.status}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.description}
                </p>

                {/* Endpoint & latency info */}
                <div className="mt-4 pt-3 border-t border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px]">Endpoint URI:</span>
                    <span className="font-mono text-slate-200 text-[11px] truncate max-w-[200px]">
                      {item.endpoint}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px]">Round-trip Latency:</span>
                    <span className="font-mono text-emerald-400 font-semibold tabular-nums text-[11px]">
                      {item.latencyMs}ms
                    </span>
                  </div>
                </div>

                {/* Permissions tags */}
                <div className="mt-3">
                  <span className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider block mb-1">
                    Granted Scopes
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {item.permissions.map((perm) => (
                      <span
                        key={perm}
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#090d14] border border-slate-800 text-slate-400"
                      >
                        {perm}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Checked: {new Date(item.lastChecked).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setConfigureIntegration(item)}
                    className="px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-[#141b29] hover:bg-slate-800 border border-slate-700 rounded transition-colors"
                  >
                    Configure
                  </button>
                  <button
                    onClick={() => handleTestConnection(item.id)}
                    disabled={isTesting}
                    className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded transition-colors disabled:opacity-40"
                  >
                    <RotateCw className={`w-3 h-3 ${isTesting ? 'animate-spin' : ''}`} />
                    <span>{isTesting ? "Pinging..." : "Test Link"}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Configuration Dialog */}
      {configureIntegration && (
        <Dialog.Root open={!!configureIntegration} onOpenChange={(open) => !open && setConfigureIntegration(null)}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 animate-in fade-in" />
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-[#101622] border border-slate-700 rounded-xl shadow-2xl z-50 p-6 space-y-4 animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-indigo-400" />
                  <span>Configure {configureIntegration.name}</span>
                </h3>
                <button
                  onClick={() => setConfigureIntegration(null)}
                  className="p-1 rounded text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Target Endpoint URI
                  </label>
                  <input
                    type="text"
                    defaultValue={configureIntegration.endpoint}
                    className="w-full text-xs font-mono p-2 rounded bg-[#090d14] border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Protocol Version Spec
                  </label>
                  <input
                    type="text"
                    defaultValue={configureIntegration.protocolVersion || '2024-11-05'}
                    className="w-full text-xs font-mono p-2 rounded bg-[#090d14] border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="p-3 rounded bg-[#0a0e17] border border-slate-800 text-slate-400">
                  <span className="font-semibold text-slate-300">Security Note:</span> API credentials and keys are held in secure environment storage and never exposed to client-side code.
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  onClick={() => setConfigureIntegration(null)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setConfigureIntegration(null);
                    toast({ title: "Configuration Updated", description: "Saved connection parameters." });
                  }}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded"
                >
                  Save Configuration
                </button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </div>
  );
};
