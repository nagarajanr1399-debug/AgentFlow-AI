import React from 'react';
import { StepStatus, WorkflowStatus, PriorityLevel } from '../types/index.js';

interface StatusBadgeProps {
  status: StepStatus | WorkflowStatus | PriorityLevel | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const s = String(status).toLowerCase();

  let colorClass = "text-slate-400 bg-slate-800/60 border-slate-700/60";
  let label = status;

  if (s === 'completed' || s === 'done' || s === 'operational') {
    colorClass = "text-emerald-300 bg-emerald-950/40 border-emerald-800/50";
    label = s === 'completed' ? 'Completed' : s === 'operational' ? 'Operational' : 'Done';
  } else if (s === 'running' || s === 'in_progress') {
    colorClass = "text-indigo-300 bg-indigo-950/50 border-indigo-700/50";
    label = s === 'running' ? 'Running' : 'In Progress';
  } else if (s === 'planned' || s === 'todo') {
    colorClass = "text-slate-300 bg-slate-800/80 border-slate-700/80";
    label = s === 'planned' ? 'Planned' : 'To Do';
  } else if (s === 'waiting_approval' || s === 'paused_approval') {
    colorClass = "text-amber-300 bg-amber-950/40 border-amber-700/60";
    label = "Needs Approval";
  } else if (s === 'failed' || s === 'blocked' || s === 'critical') {
    colorClass = "text-rose-300 bg-rose-950/40 border-rose-800/60";
    label = s === 'critical' ? 'Critical' : s === 'blocked' ? 'Blocked' : 'Failed';
  } else if (s === 'high') {
    colorClass = "text-amber-300 bg-amber-950/40 border-amber-800/50";
    label = "High";
  } else if (s === 'medium') {
    colorClass = "text-blue-300 bg-blue-950/30 border-blue-800/40";
    label = "Medium";
  } else if (s === 'low') {
    colorClass = "text-slate-400 bg-slate-800/40 border-slate-700/40";
    label = "Low";
  }

  const pxClass = size === 'sm' ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs";

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded border ${colorClass} ${pxClass}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      <span>{label}</span>
    </span>
  );
};
