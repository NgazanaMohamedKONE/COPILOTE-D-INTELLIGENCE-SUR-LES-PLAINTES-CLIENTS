import React, { useState } from 'react';
import { DashboardMetrics, ComplaintRecord } from '../types';
import {
  TrendingUp,
  BarChart2,
  Calendar,
  Zap,
  Layers,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';

interface TrendsAnalyticsViewProps {
  metrics: DashboardMetrics;
  complaints: ComplaintRecord[];
}

export const TrendsAnalyticsView: React.FC<TrendsAnalyticsViewProps> = ({
  metrics,
  complaints,
}) => {
  const [period, setPeriod] = useState<'daily' | 'monthly'>('daily');

  // Heatmap breakdown by region
  const regionCounts: Record<string, number> = {};
  complaints.forEach((c) => {
    regionCounts[c.region] = (regionCounts[c.region] || 0) + 1;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            Tendances & Analytics Temporelles
            <span className="px-2.5 py-0.5 text-xs rounded-full font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              Séries Temporelles
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Analyse comparative des évolutions par jour et par mois, détection des hausses anormales et des thèmes émergents.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPeriod('daily')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              period === 'daily'
                ? 'bg-blue-900 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            Vue Journalière
          </button>
          <button
            onClick={() => setPeriod('monthly')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              period === 'monthly'
                ? 'bg-blue-900 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            Vue Mensuelle
          </button>
        </div>
      </div>

      {/* Main Temporal Line Chart */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              {period === 'daily' ? 'Évolution Journalière des Volumes' : 'Évolution Mensuelle & Résolutions'}
            </h3>
            <p className="text-xs text-slate-500">Comparaison des ouvertures vs résolutions</p>
          </div>
          <TrendingUp className="w-5 h-5 text-blue-600" />
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {period === 'daily' ? (
              <LineChart data={metrics.dailyTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '0.75rem',
                    color: '#FFF',
                    fontSize: '12px'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="volume" name="Volume Total" stroke="#1E3A8A" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="critical" name="Critiques" stroke="#EF4444" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            ) : (
              <BarChart data={metrics.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '0.75rem',
                    color: '#FFF',
                    fontSize: '12px'
                  }}
                />
                <Legend />
                <Bar dataKey="volume" name="Plaintes Reçues" fill="#1E3A8A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" name="Plaintes Résolues" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Region Distribution Grid */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
          Répartition Géographique par Régions / Agences
        </h3>
        <p className="text-xs text-slate-500 mb-4">Volume de réclamations recensées par territoire</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.entries(regionCounts).map(([region, count]) => (
            <div key={region} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-semibold text-slate-500 block">{region}</span>
              <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">{count} <span className="text-xs font-medium text-slate-400">plaintes</span></p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
