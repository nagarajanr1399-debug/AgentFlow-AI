import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  trend?: string;
  icon?: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subtext,
  trend,
  icon
}) => {
  return (
    <div className="bg-[#121824] border border-slate-800/80 rounded-lg p-4 flex flex-col justify-between transition-colors hover:border-slate-700/80">
      <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
        <span>{label}</span>
        {icon && <span className="text-slate-500">{icon}</span>}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-slate-100 font-mono tabular-nums">
          {value}
        </span>
        {trend && (
          <span className="text-xs font-medium text-emerald-400 font-mono">
            {trend}
          </span>
        )}
      </div>
      {subtext && (
        <div className="text-xs text-slate-400 mt-1">
          {subtext}
        </div>
      )}
    </div>
  );
};
