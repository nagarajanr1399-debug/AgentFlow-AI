import React, { useState, useEffect } from 'react';
import {
  Settings,
  Shield,
  Cpu,
  Save,
  Check,
  RotateCw,
  Lock,
  Layers,
  Terminal,
  Info
} from 'lucide-react';
import { api } from '../services/api.js';
import { useToast } from '../context/ToastContext.js';

export const SettingsPage: React.FC = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<any>({
    autonomyMode: 'supervised',
    approvalThreshold: 'critical_only',
    defaultModel: 'Claude 3.5 Sonnet (Amazon Bedrock) + Gemini Hybrid',
    mcpServerUrl: 'http://localhost:3000/api/mcp',
    enableAuditHashing: true,
    streamExecutionUpdates: true,
    maxStepsPerWorkflow: 8,
    timeoutSeconds: 30
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const res = await api.getSettings();
      setSettings(res);
    } catch (err) {
      console.error("Failed to load settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const updated = await api.updateSettings(settings);
      setSettings(updated);
      toast({
        title: "Settings Saved",
        description: "Autonomous execution policies updated successfully."
      });
    } catch (err: any) {
      toast({
        title: "Save Failed",
        description: err?.message,
        type: "error"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="border-b border-slate-800/80 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
          <span>Settings &amp; Autonomous Execution Policy</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Configure security guardrails, human-in-the-loop approval thresholds, and Model Context Protocol runtime preferences.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Autonomy & Human-in-the-loop */}
        <div className="rounded-xl border border-slate-800 bg-[#121824] p-5 shadow-lg space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Shield className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-semibold text-slate-200">
              Autonomy &amp; Human-in-the-Loop Safeguards
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-200 block mb-1">
                Default Execution Policy
              </label>
              <p className="text-slate-400 text-[11px] mb-2">
                Controls whether the agent pauses for human authorization before executing consequential operations.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  {
                    id: 'supervised',
                    label: 'Supervised',
                    desc: 'Pauses on notifications, alerts, or high-impact actions for operator review.'
                  },
                  {
                    id: 'autonomous',
                    label: 'Autonomous',
                    desc: 'Executes end-to-end autonomously with full cryptographic audit logging.'
                  },
                  {
                    id: 'read_only',
                    label: 'Read Only',
                    desc: 'Performs backlog retrieval and analysis without mutation permissions.'
                  }
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setSettings({ ...settings, autonomyMode: mode.id })}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      settings.autonomyMode === mode.id
                        ? 'border-indigo-500 bg-indigo-950/30 text-slate-100 shadow-sm'
                        : 'border-slate-800 bg-[#0a0e17] text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-semibold text-slate-200">{mode.label}</div>
                    <div className="text-[11px] text-slate-400 mt-1 leading-normal">{mode.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-200 block mb-1">
                Approval Gate Threshold
              </label>
              <select
                value={settings.approvalThreshold}
                onChange={(e) => setSettings({ ...settings, approvalThreshold: e.target.value })}
                className="w-full text-xs p-2.5 rounded bg-[#090d14] border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="critical_only">P0 / Critical SLA &amp; Production Broadcasts Only</option>
                <option value="all_external">All External Communications &amp; Notifications</option>
                <option value="none">Never Pause (Fully Autonomous Pipeline)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Model & Reasoning Providers */}
        <div className="rounded-xl border border-slate-800 bg-[#121824] p-5 shadow-lg space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-semibold text-slate-200">
              Model &amp; Agent Reasoning Engine
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-200 block mb-1">
                Active Reasoning Provider
              </label>
              <select
                value={settings.defaultModel}
                onChange={(e) => setSettings({ ...settings, defaultModel: e.target.value })}
                className="w-full text-xs p-2.5 rounded bg-[#090d14] border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
              >
                <option value="Claude 3.5 Sonnet (Amazon Bedrock) + Gemini Hybrid">
                  Claude 3.5 Sonnet (Amazon Bedrock) + Gemini 2.5 Flash Hybrid
                </option>
                <option value="Amazon Titan Text Premier (Amazon Bedrock)">
                  Amazon Titan Text Premier (Amazon Bedrock)
                </option>
                <option value="Gemini 2.5 Flash Native (Google Cloud)">
                  Gemini 2.5 Flash Native (Google Cloud)
                </option>
                <option value="Deterministic Autonomous Heuristics Engine (Local)">
                  Deterministic Autonomous Heuristics Engine (Local Standalone)
                </option>
              </select>
              <p className="text-slate-400 text-[11px] mt-1.5">
                Multi-model architecture automatically routes task planning to the optimal model for low-latency tool dispatch.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-200 block mb-1">
                  Max Steps per Workflow
                </label>
                <input
                  type="number"
                  value={settings.maxStepsPerWorkflow}
                  onChange={(e) => setSettings({ ...settings, maxStepsPerWorkflow: Number(e.target.value) })}
                  className="w-full text-xs p-2.5 rounded bg-[#090d14] border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-200 block mb-1">
                  Timeout (Seconds)
                </label>
                <input
                  type="number"
                  value={settings.timeoutSeconds}
                  onChange={(e) => setSettings({ ...settings, timeoutSeconds: Number(e.target.value) })}
                  className="w-full text-xs p-2.5 rounded bg-[#090d14] border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Protocol & Ledger Verification */}
        <div className="rounded-xl border border-slate-800 bg-[#121824] p-5 shadow-lg space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Terminal className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-semibold text-slate-200">
              Model Context Protocol &amp; Verification Ledger
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-200 block mb-1">
                MCP Server Host Endpoint
              </label>
              <input
                type="text"
                value={settings.mcpServerUrl}
                onChange={(e) => setSettings({ ...settings, mcpServerUrl: e.target.value })}
                className="w-full text-xs p-2.5 rounded bg-[#090d14] border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Complies with MCP Protocol 2024-11-05 for Alexa+ and AgentFlow tool dispatch.
              </p>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-[#0a0e17] border border-slate-800">
              <div>
                <div className="font-semibold text-slate-200">Cryptographic Audit Hashing</div>
                <div className="text-[11px] text-slate-400">
                  Generate SHA-256 integrity tokens for every completed workflow step and execution summary.
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.enableAuditHashing}
                onChange={(e) => setSettings({ ...settings, enableAuditHashing: e.target.checked })}
                className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md shadow-sm transition-colors disabled:opacity-40"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving Policy..." : "Save Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
