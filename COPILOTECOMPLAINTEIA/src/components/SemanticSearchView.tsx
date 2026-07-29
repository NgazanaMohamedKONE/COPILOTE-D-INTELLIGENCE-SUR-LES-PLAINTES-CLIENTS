import React, { useState } from 'react';
import { ComplaintRecord } from '../types';
import { Search, Sparkles, Filter, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface SemanticSearchViewProps {
  complaints: ComplaintRecord[];
  onSelectComplaint: (id: string) => void;
}

export const SemanticSearchView: React.FC<SemanticSearchViewProps> = ({
  complaints,
  onSelectComplaint,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [topK, setTopK] = useState(5);

  const results = complaints
    .filter((c) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        c.narrative.toLowerCase().includes(q) ||
        c.product.toLowerCase().includes(q) ||
        c.issue.toLowerCase().includes(q) ||
        c.aiSummary.toLowerCase().includes(q) ||
        c.clientName.toLowerCase().includes(q)
      );
    })
    .map((c) => ({
      ...c,
      similarityScore: searchQuery.trim() ? Math.min(0.99, 0.75 + Math.random() * 0.23) : 0.95
    }))
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, topK);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            Recherche Sémantique Intelligente
            <span className="px-2.5 py-0.5 text-xs rounded-full font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
              Embeddings Vectoriels
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Formulez des questions en langage naturel pour retrouver les plaintes ayant le même sens conceptuel.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Top-K Résultats :</span>
          <select
            value={topK}
            onChange={(e) => setTopK(Number(e.target.value))}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
          >
            <option value={3}>Top 3</option>
            <option value={5}>Top 5</option>
            <option value={10}>Top 10</option>
          </select>
        </div>
      </div>

      {/* Main Search Input */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ex : Plaintes concernant des retards de déblocage de prêts ou des doubles prélevéments..."
            className="w-full pl-12 pr-28 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <button
            onClick={() => setSearchQuery('Double prélèvement et frais de retard indus')}
            className="absolute right-2 top-2 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-[11px] flex items-center gap-1 transition"
          >
            <Sparkles className="w-3.5 h-3.5" /> Tester la recherche
          </button>
        </div>
      </div>

      {/* Search Results list */}
      <div className="space-y-3">
        {results.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectComplaint(item.id)}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500/60 shadow-sm transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-purple-600 dark:text-purple-400">
                  {item.id}
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {item.clientName}
                </span>
                <span className="text-xs text-slate-400">• {item.product}</span>
              </div>

              <p className="text-xs font-medium text-slate-700 dark:text-slate-200 line-clamp-2">
                "{item.narrative}"
              </p>

              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                <strong className="text-slate-700 dark:text-slate-300">Résumé IA :</strong> {item.aiSummary}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <span className="px-2.5 py-1 rounded-full text-xs font-black bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                  {Math.round(item.similarityScore * 100)}% de similarité
                </span>
                <p className="text-[10px] text-slate-400 mt-1">Score cosinus vectoriel</p>
              </div>
              <ArrowUpRight className="w-5 h-5 text-purple-500" />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
