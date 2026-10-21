import React from 'react';
import { Search, Sparkles, BookOpen, ExternalLink } from 'lucide-react';
import { NavTab } from './Sidebar.js';

interface TopbarProps {
  currentTab: NavTab;
  onOpenCommand: () => void;
  onOpenJudgeGuide: () => void;
  onQuickRun: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  currentTab,
  onOpenCommand,
  onOpenJudgeGuide,
  onQuickRun
}) => {
  const titles: Record<NavTab, { section: string; title: string }> = {
    overview: { section: 'Operations', title: 'Executive Overview' },
    workspace: { section: 'Agent', title: 'Command Center & Execution' },
    templates: { section: 'Catalog', title: 'Workflow Library' },
    history: { section: 'Ledger', title: 'Execution History & Audit' },
    mcp: { section: 'Developer', title: 'MCP Tool Explorer' },
    integrations: { section: 'Ecosystem', title: 'Connected Platforms' },
    settings: { section: 'Configuration', title: 'Policies & Models' }
  };

  const current = titles[currentTab] || { section: 'Operations', title: 'Command Center' };

  return (
    <header className="h-14 bg-[#0d121c]/90 backdrop-blur border-b border-slate-800/80 px-6 flex items-center justify-between gap-6 shrink-0 z-20">
      {/* Zone 1: Breadcrumb */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-slate-400 font-medium">{current.section}</span>
        <span className="text-slate-600">/</span>
        <span className="text-slate-100 font-semibold tracking-tight">{current.title}</span>
      </div>

      {/* Zone 2: Command Search Affordance */}
      <div className="flex-1 max-w-md hidden sm:block">
        <button
          onClick={onOpenCommand}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-md bg-[#121824] border border-slate-800 hover:border-slate-700 text-xs text-slate-400 transition-colors shadow-inner"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Search actions, tools, executions...</span>
          </div>
          <kbd className="font-mono text-[10px] bg-slate-800/90 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Zone 3: Actions & Environment Badge */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded bg-indigo-950/40 border border-indigo-800/50 text-[11px] text-indigo-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-medium">Alexa+ MCP Connected</span>
        </div>

        <button
          onClick={onOpenJudgeGuide}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-[#141b29] hover:bg-slate-800 border border-slate-700/80 rounded-md transition-colors"
          title="Open Hackathon Demo Guide & Script"
        >
          <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">Hackathon Guide</span>
        </button>

        <button
          onClick={onQuickRun}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md shadow-sm shadow-indigo-900/40 transition-colors whitespace-nowrap"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
          <span>New Workflow</span>
        </button>
      </div>
    </header>
  );
};
