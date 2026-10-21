import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Search, Sparkles, Cpu, Wrench, History, Layers, ArrowRight, X } from 'lucide-react';
import { NavTab } from './Sidebar.js';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (tab: NavTab) => void;
  onTriggerPrompt: (prompt: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  open,
  onOpenChange,
  onNavigate,
  onTriggerPrompt
}) => {
  const [query, setQuery] = useState('');

  // Handle Cmd+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  const actions = [
    {
      category: 'Suggested Workflows',
      items: [
        {
          id: 'act-1',
          title: 'Prioritize overdue tasks and prepare follow-up drafts',
          subtext: 'Scan backlog, calculate urgency scores, draft stakeholder emails',
          icon: Sparkles,
          run: () => {
            onNavigate('workspace');
            onTriggerPrompt('Identify overdue tasks, prioritize the critical ones, prepare follow-up drafts, and give me an executive summary.');
            onOpenChange(false);
          }
        },
        {
          id: 'act-2',
          title: 'Audit SOC2 Type II compliance & access boundaries',
          subtext: 'Verify cryptographic key rotation logs and security invariants',
          icon: Sparkles,
          run: () => {
            onNavigate('workspace');
            onTriggerPrompt('Audit security permissions and verify compliance evidence for pending items.');
            onOpenChange(false);
          }
        },
        {
          id: 'act-3',
          title: 'Investigate critical blocked infrastructure tasks',
          subtext: 'Assess payment gateway latency spike and SLA exposure',
          icon: Sparkles,
          run: () => {
            onNavigate('workspace');
            onTriggerPrompt('Investigate critical blocked infrastructure tasks, evaluate SLA blast radius, and draft escalation dispatch.');
            onOpenChange(false);
          }
        }
      ]
    },
    {
      category: 'Navigation & Tools',
      items: [
        {
          id: 'nav-workspace',
          title: 'Agent Command Center',
          subtext: 'Open live execution planner & autonomous inspector',
          icon: Cpu,
          run: () => {
            onNavigate('workspace');
            onOpenChange(false);
          }
        },
        {
          id: 'nav-mcp',
          title: 'MCP Tool Explorer & Test Runner',
          subtext: 'Inspect Model Context Protocol schemas and test tools live',
          icon: Wrench,
          run: () => {
            onNavigate('mcp');
            onOpenChange(false);
          }
        },
        {
          id: 'nav-templates',
          title: 'Workflow Templates Library',
          subtext: 'Browse reusable operational automation recipes',
          icon: Layers,
          run: () => {
            onNavigate('templates');
            onOpenChange(false);
          }
        },
        {
          id: 'nav-history',
          title: 'Execution History & Audit Records',
          subtext: 'View verified execution proofs and timing details',
          icon: History,
          run: () => {
            onNavigate('history');
            onOpenChange(false);
          }
        }
      ]
    }
  ];

  const filtered = actions.map(group => ({
    ...group,
    items: group.items.filter(i =>
      i.title.toLowerCase().includes(query.toLowerCase()) ||
      i.subtext.toLowerCase().includes(query.toLowerCase())
    )
  })).filter(group => group.items.length > 0);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 animate-in fade-in" />
        <Dialog.Content className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl bg-[#111724] border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-in zoom-in-95 duration-150">
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800 bg-[#0e1420]">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type an intent, workflow name, or navigation target..."
              className="w-full bg-transparent border-0 text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
              autoFocus
            />
            <button
              onClick={() => onOpenChange(false)}
              className="text-slate-400 hover:text-slate-200 p-1 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-800/60">
            {filtered.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No matching actions found. Try typing &ldquo;overdue&rdquo;, &ldquo;mcp&rdquo;, or &ldquo;history&rdquo;.
              </div>
            ) : (
              filtered.map((group) => (
                <div key={group.category} className="py-2 first:pt-0 last:pb-0">
                  <div className="px-2.5 py-1 text-[11px] font-semibold text-slate-400 tracking-wider">
                    {group.category}
                  </div>
                  <div className="space-y-1 mt-1">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={item.run}
                          className="w-full flex items-center justify-between p-2.5 rounded-lg text-left hover:bg-slate-800/60 group transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 group-hover:text-indigo-300 group-hover:border-indigo-500/40 transition-colors shrink-0">
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <div className="text-xs font-medium text-slate-200 group-hover:text-white">
                                {item.title}
                              </div>
                              <div className="text-[11px] text-slate-400">
                                {item.subtext}
                              </div>
                            </div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="px-4 py-2 bg-[#0d121c] border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Press <kbd className="font-mono bg-slate-800 px-1 py-0.5 rounded text-slate-300">ESC</kbd> to exit</span>
            <span className="font-mono text-indigo-400">AgentFlow AI Command Dispatch</span>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
