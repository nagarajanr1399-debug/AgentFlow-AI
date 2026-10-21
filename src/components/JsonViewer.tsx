import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { useToast } from '../context/ToastContext.js';

interface JsonViewerProps {
  data: any;
  maxHeight?: string;
  title?: string;
}

export const JsonViewer: React.FC<JsonViewerProps> = ({
  data,
  maxHeight = "max-h-72",
  title
}) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const formatted = typeof data === 'string' ? data : JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    toast({ title: "Copied to clipboard", description: "JSON payload copied to system clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-md border border-slate-800 bg-[#090d14] overflow-hidden text-xs">
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#0e1420] border-b border-slate-800 text-slate-400">
        <span className="font-mono text-[11px] text-slate-400">{title || "JSON Payload"}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition-colors p-1 rounded hover:bg-slate-800/60"
          title="Copy JSON"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      <pre className={`p-3 font-mono text-[11px] text-slate-300 overflow-auto ${maxHeight} leading-relaxed`}>
        <code>{formatted}</code>
      </pre>
    </div>
  );
};
