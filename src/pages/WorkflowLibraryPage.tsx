import React, { useState, useEffect } from 'react';
import { Search, Play, Clock, Wrench, Shield, CheckCircle2, ArrowRight } from 'lucide-react';
import { api } from '../services/api.js';
import { WorkflowTemplate } from '../types/index.js';

interface WorkflowLibraryPageProps {
  onRunTemplate: (prompt: string) => void;
}

export const WorkflowLibraryPage: React.FC<WorkflowLibraryPageProps> = ({ onRunTemplate }) => {
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const res = await api.getTemplates();
      setTemplates(res.templates);
    } catch (err) {
      console.error("Failed to load templates:", err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'Productivity', 'Engineering Operations', 'Business Operations', 'Incident Response', 'Reporting'];

  const filtered = templates.filter(tpl => {
    const matchesSearch = tpl.name.toLowerCase().includes(search.toLowerCase()) ||
                          tpl.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'All' || tpl.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">
            Workflow Library
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Curated, autonomous operational workflow templates pre-configured for Alexa+ &amp; MCP tool chains.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-lg bg-[#121824] border border-slate-800">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#121824] border border-slate-800 rounded-md text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Templates Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400">Loading templates...</div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center rounded-xl border border-dashed border-slate-800 text-xs text-slate-400">
          No templates match your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((tpl) => (
            <div
              key={tpl.id}
              className="rounded-xl border border-slate-800 bg-[#121824] p-5 flex flex-col justify-between hover:border-slate-700 transition-all hover:shadow-lg hover:shadow-black/20 group"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-[11px] font-mono text-indigo-400 font-medium">
                    {tpl.category}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>~{tpl.estimatedDuration}</span>
                  </div>
                </div>

                <h3 className="text-sm font-semibold text-slate-100 group-hover:text-indigo-200 transition-colors">
                  {tpl.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  {tpl.description}
                </p>

                {/* Workflow steps overview */}
                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Sequence of Actions
                  </div>
                  <div className="space-y-1">
                    {tpl.stepsOverview.map((st, i) => (
                      <div key={i} className="text-xs text-slate-300 flex items-center gap-1.5">
                        <span className="font-mono text-[10px] text-slate-500">0{i + 1}</span>
                        <span className="truncate">{st}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tools required */}
                <div className="mt-3 pt-2 flex flex-wrap gap-1">
                  {tpl.toolsRequired.map((tool) => (
                    <span
                      key={tool}
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#090d14] border border-slate-800 text-slate-400"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Ready to Run</span>
                </span>

                <button
                  onClick={() => onRunTemplate(tpl.samplePrompt)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors shadow-sm shadow-indigo-950"
                >
                  <span>Run Workflow</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
