import React from 'react';
import {
  LayoutDashboard,
  Cpu,
  Layers,
  History,
  Wrench,
  Link2,
  Settings,
  HelpCircle,
  Activity,
  Terminal,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';

export type NavTab = 'overview' | 'workspace' | 'templates' | 'history' | 'mcp' | 'integrations' | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenJudgeGuide: () => void;
  mcpConnected: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onOpenJudgeGuide,
  mcpConnected
}) => {
  const navItems = [
    { id: 'overview' as NavTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'workspace' as NavTab, label: 'Agent Workspace', icon: Cpu },
    { id: 'templates' as NavTab, label: 'Workflow Library', icon: Layers },
    { id: 'history' as NavTab, label: 'Execution History', icon: History },
    { id: 'mcp' as NavTab, label: 'MCP Tool Explorer', icon: Wrench },
    { id: 'integrations' as NavTab, label: 'Integrations', icon: Link2 },
    { id: 'settings' as NavTab, label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 h-screen bg-[#0d121c] border-r border-slate-800/80 flex flex-col justify-between shrink-0 select-none">
      {/* Top Header / Branding */}
      <div>
        <div className="p-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold shadow-sm shadow-indigo-950">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-sm tracking-tight text-slate-100 flex items-center gap-1.5">
                <span>AgentFlow AI</span>
                <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  2026
                </span>
              </div>
              <div className="text-[11px] text-slate-400 truncate">
                Autonomous Command Center
              </div>
            </div>
          </div>

          {/* Workspace Switcher */}
          <div className="mt-3.5 p-2 rounded-md bg-[#121824] border border-slate-800/90 flex items-center justify-between text-xs text-slate-300 cursor-pointer hover:border-slate-700 transition-colors">
            <div className="flex items-center gap-2 truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <div className="truncate">
                <span className="font-medium text-slate-200">Global Operations</span>
                <span className="text-[10px] text-slate-400 ml-1.5 font-mono">us-east-1</span>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-2 space-y-0.5">
          <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Workspace
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-all text-left ${
                  active
                    ? 'bg-indigo-600/15 text-indigo-200 border border-indigo-500/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
                {item.id === 'workspace' && (
                  <span className="ml-auto text-[10px] font-mono px-1 rounded bg-indigo-500/20 text-indigo-300">
                    Live
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Status & Demo Helper */}
      <div className="p-3 border-t border-slate-800/80 space-y-2 bg-[#0a0e17]/80">
        {/* Hackathon Judge Guide CTA */}
        <button
          onClick={onOpenJudgeGuide}
          className="w-full flex items-center justify-between p-2 rounded-md bg-indigo-950/40 border border-indigo-800/50 hover:bg-indigo-900/40 text-indigo-200 text-xs transition-colors"
        >
          <div className="flex items-center gap-2">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="font-medium">Judge Demo Script</span>
          </div>
          <span className="text-[10px] font-mono bg-indigo-500/30 px-1 py-0.5 rounded text-indigo-300">
            3 min
          </span>
        </button>

        {/* Runtime Status */}
        <div className="p-2 rounded-md bg-[#121824] border border-slate-800/80 text-[11px] text-slate-400">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <span className={`w-2 h-2 rounded-full ${mcpConnected ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              <span>MCP 2024-11-05</span>
            </span>
            <span className="font-mono text-[10px] text-slate-400">Alexa+ Ready</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
            <span>Protocol: Streamable HTTP</span>
            <span className="font-mono text-emerald-400">Healthy</span>
          </div>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-2.5 pt-1 px-1">
          <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-semibold text-slate-300">
            AV
          </div>
          <div className="truncate flex-1">
            <div className="text-xs font-medium text-slate-200 truncate">Agent Lead</div>
            <div className="text-[10px] text-slate-400 truncate">alexa-plus-sandbox</div>
          </div>
          <span title="Security Boundary Verified">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          </span>
        </div>
      </div>
    </aside>
  );
};
