import React, { useState } from 'react';
import { ToastProvider } from './context/ToastContext.js';
import { Sidebar, NavTab } from './components/Sidebar.js';
import { Topbar } from './components/Topbar.js';
import { CommandPalette } from './components/CommandPalette.js';
import { HackathonJudgeModal } from './components/HackathonJudgeModal.js';
import { OverviewPage } from './pages/OverviewPage.js';
import { AgentWorkspacePage } from './pages/AgentWorkspacePage.js';
import { WorkflowLibraryPage } from './pages/WorkflowLibraryPage.js';
import { ExecutionHistoryPage } from './pages/ExecutionHistoryPage.js';
import { McpToolExplorerPage } from './pages/McpToolExplorerPage.js';
import { IntegrationsPage } from './pages/IntegrationsPage.js';
import { SettingsPage } from './pages/SettingsPage.js';
import { Menu, X } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('overview');
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [judgeGuideOpen, setJudgeGuideOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Cross-page parameters
  const [targetPrompt, setTargetPrompt] = useState<string | null>(null);
  const [targetExecutionId, setTargetExecutionId] = useState<string | null>(null);

  // Navigate to Agent Workspace with specific prompt
  const handleLaunchPrompt = (prompt: string) => {
    setTargetPrompt(prompt);
    setTargetExecutionId(null);
    setCurrentTab('workspace');
  };

  // Inspect existing execution
  const handleInspectExecution = (id: string) => {
    setTargetExecutionId(id);
    setTargetPrompt(null);
    setCurrentTab('workspace');
  };

  // Run template
  const handleRunTemplate = (prompt: string) => {
    setTargetPrompt(prompt);
    setTargetExecutionId(null);
    setCurrentTab('workspace');
  };

  // Quick Run action in Topbar
  const handleQuickRun = () => {
    setTargetPrompt("Identify overdue tasks, prioritize the critical ones, prepare follow-up drafts, and give me an executive summary.");
    setTargetExecutionId(null);
    setCurrentTab('workspace');
  };

  return (
    <ToastProvider>
      <div className="flex h-screen bg-[#0b0f17] text-slate-100 overflow-hidden font-sans antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block shrink-0">
          <Sidebar
            currentTab={currentTab}
            onSelectTab={setCurrentTab}
            onOpenJudgeGuide={() => setJudgeGuideOpen(true)}
            mcpConnected={true}
          />
        </div>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative z-10 w-64 h-full bg-[#0d121c] flex flex-col justify-between">
              <Sidebar
                currentTab={currentTab}
                onSelectTab={(tab) => {
                  setCurrentTab(tab);
                  setMobileMenuOpen(false);
                }}
                onOpenJudgeGuide={() => {
                  setJudgeGuideOpen(true);
                  setMobileMenuOpen(false);
                }}
                mcpConnected={true}
              />
            </div>
          </div>
        )}

        {/* Main Content Viewport */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Topbar with mobile toggle */}
          <div className="flex items-center">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-3 text-slate-400 hover:text-white"
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <Topbar
                currentTab={currentTab}
                onOpenCommand={() => setCommandPaletteOpen(true)}
                onOpenJudgeGuide={() => setJudgeGuideOpen(true)}
                onQuickRun={handleQuickRun}
              />
            </div>
          </div>

          {/* Page View Canvas */}
          <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-6">
            {currentTab === 'overview' && (
              <OverviewPage
                onNavigate={setCurrentTab}
                onLaunchPrompt={handleLaunchPrompt}
                onInspectExecution={handleInspectExecution}
              />
            )}

            {currentTab === 'workspace' && (
              <AgentWorkspacePage
                key={`${targetExecutionId || ''}-${targetPrompt || ''}`}
                initialExecutionId={targetExecutionId}
                initialPrompt={targetPrompt}
              />
            )}

            {currentTab === 'templates' && (
              <WorkflowLibraryPage onRunTemplate={handleRunTemplate} />
            )}

            {currentTab === 'history' && (
              <ExecutionHistoryPage onInspectExecution={handleInspectExecution} />
            )}

            {currentTab === 'mcp' && <McpToolExplorerPage />}

            {currentTab === 'integrations' && <IntegrationsPage />}

            {currentTab === 'settings' && <SettingsPage />}
          </main>
        </div>

        {/* Global Accessible Command Palette (Cmd + K) */}
        <CommandPalette
          open={commandPaletteOpen}
          onOpenChange={setCommandPaletteOpen}
          onNavigate={setCurrentTab}
          onTriggerPrompt={handleLaunchPrompt}
        />

        {/* Hackathon Judge Evaluation Guide Modal */}
        <HackathonJudgeModal
          open={judgeGuideOpen}
          onOpenChange={setJudgeGuideOpen}
          onRunSampleWorkflow={() => {
            handleLaunchPrompt("Identify overdue tasks, prioritize the critical ones, prepare follow-up drafts, and give me an executive summary.");
          }}
        />
      </div>
    </ToastProvider>
  );
}
