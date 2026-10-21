import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Trash2,
  RotateCw,
  Eye,
  Clock,
  CheckCircle2,
  AlertTriangle,
  X,
  Copy,
  Check,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge.js';
import { JsonViewer } from '../components/JsonViewer.js';
import { api } from '../services/api.js';
import { WorkflowExecution } from '../types/index.js';
import { useToast } from '../context/ToastContext.js';

interface ExecutionHistoryPageProps {
  onInspectExecution: (id: string) => void;
}

export const ExecutionHistoryPage: React.FC<ExecutionHistoryPageProps> = ({ onInspectExecution }) => {
  const { toast } = useToast();
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedExec, setSelectedExec] = useState<WorkflowExecution | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    loadExecutions();
  }, []);

  const loadExecutions = async () => {
    try {
      setLoading(true);
      const res = await api.getExecutions();
      setExecutions(res.executions);
    } catch (err) {
      console.error("Failed to load executions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.deleteExecution(id);
      setExecutions(prev => prev.filter(x => x.id !== id));
      if (selectedExec?.id === id) {
        setDrawerOpen(false);
      }
      toast({ title: "Execution Deleted", description: `Record ${id} removed from ledger.` });
    } catch (err: any) {
      toast({ title: "Delete Failed", description: err?.message, type: "error" });
    }
  };

  const openDrawer = (exec: WorkflowExecution) => {
    setSelectedExec(exec);
    setDrawerOpen(true);
  };

  const filtered = executions.filter(exec => {
    const matchesSearch = exec.title.toLowerCase().includes(search.toLowerCase()) ||
                          exec.id.toLowerCase().includes(search.toLowerCase()) ||
                          exec.userPrompt.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || exec.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">
            Execution History &amp; Audit Ledger
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Cryptographically verified historical record of all autonomous workflow operations and tool invocations.
          </p>
        </div>

        <button
          onClick={loadExecutions}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-[#141b29] hover:bg-slate-800 border border-slate-700/80 rounded-md transition-colors"
        >
          <RotateCw className="w-3.5 h-3.5 text-slate-400" />
          <span>Refresh Ledger</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#121824] border border-slate-800 text-xs">
          {['all', 'completed', 'paused_approval', 'failed'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-md capitalize font-medium transition-colors ${
                statusFilter === st
                  ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {st === 'paused_approval' ? 'Needs Approval' : st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, title, or prompt..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#121824] border border-slate-800 rounded-md text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* History Table */}
      <div className="rounded-xl border border-slate-800 bg-[#121824] overflow-hidden shadow-lg">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400">Loading execution ledger...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            No execution records matched your query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0e1420] text-slate-400 font-medium border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 font-normal">Execution ID</th>
                  <th className="py-3 px-4 font-normal">Workflow Title</th>
                  <th className="py-3 px-4 font-normal">Status</th>
                  <th className="py-3 px-4 font-normal text-right">Steps</th>
                  <th className="py-3 px-4 font-normal text-right">Duration</th>
                  <th className="py-3 px-4 font-normal">Timestamp</th>
                  <th className="py-3 px-4 font-normal text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((exec) => (
                  <tr
                    key={exec.id}
                    onClick={() => openDrawer(exec)}
                    className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-4 font-mono text-slate-300 group-hover:text-indigo-300">
                      {exec.id}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs sm:max-w-sm">
                      <div className="font-medium text-slate-200 group-hover:text-white truncate">
                        {exec.title}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">
                        {exec.userPrompt}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={exec.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-300">
                      {exec.steps.length}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-400">
                      {exec.durationMs > 0 ? `${(exec.durationMs / 1000).toFixed(1)}s` : "—"}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                      {new Date(exec.createdAt).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onInspectExecution(exec.id)}
                          className="p-1 rounded text-indigo-400 hover:text-white hover:bg-indigo-950/40 transition-colors"
                          title="Open in Agent Workspace"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(exec.id, e)}
                          className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                          title="Delete from Ledger"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Slide-out Execution Detail Drawer */}
      {drawerOpen && selectedExec && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xl h-full bg-[#101622] border-l border-slate-800 p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div className="space-y-5">
              {/* Drawer Header */}
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 font-mono text-xs text-indigo-400">
                    <span>{selectedExec.id}</span>
                    <span className="text-slate-600">·</span>
                    <StatusBadge status={selectedExec.status} size="sm" />
                  </div>
                  <h3 className="text-base font-bold text-slate-100 mt-1">
                    {selectedExec.title}
                  </h3>
                  <div className="text-xs text-slate-400 mt-1">
                    Executed: {new Date(selectedExec.createdAt).toLocaleString()}
                  </div>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Prompt */}
              <div>
                <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
                  Original User Intent
                </span>
                <p className="text-xs text-slate-300 mt-1 p-3 rounded-lg bg-[#0a0e17] border border-slate-800 leading-relaxed">
                  {selectedExec.userPrompt}
                </p>
              </div>

              {/* Steps timeline */}
              <div>
                <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider mb-2 block">
                  Executed Steps Breakdown
                </span>
                <div className="space-y-2">
                  {selectedExec.steps.map((st, i) => (
                    <div key={st.stepId} className="p-3 rounded-lg border border-slate-800 bg-[#0a0e17] text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-slate-500">0{i + 1}</span>
                          <span className="font-medium text-slate-200">{st.title}</span>
                          <span className="font-mono text-[10px] text-indigo-400 bg-slate-800 px-1.5 rounded">
                            {st.tool}
                          </span>
                        </div>
                        <span className="font-mono text-[11px] text-slate-400">
                          {st.durationMs ? `${st.durationMs}ms` : '—'}
                        </span>
                      </div>
                      {st.evidenceSummary && (
                        <div className="text-[11px] text-slate-400 mt-1">
                          {st.evidenceSummary}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Verification Hash */}
              {selectedExec.proofVerificationHash && (
                <div>
                  <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
                    Cryptographic Proof Token
                  </span>
                  <div className="mt-1 p-2.5 rounded bg-[#090d14] border border-slate-800 text-[11px] font-mono text-emerald-400 flex items-center justify-between">
                    <span className="truncate">{selectedExec.proofVerificationHash}</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer Actions */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => setDrawerOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setDrawerOpen(false);
                  onInspectExecution(selectedExec.id);
                }}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors"
              >
                Open in Workspace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
