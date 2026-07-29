import React from 'react';
import { ComplaintRecord } from '../types';
import { AlertTriangle, ShieldAlert, ArrowUpRight, Zap, Eye, CheckCircle2 } from 'lucide-react';

interface AnomalyDetectionViewProps {
  complaints: ComplaintRecord[];
  onSelectComplaint: (id: string) => void;
}

export const AnomalyDetectionView: React.FC<AnomalyDetectionViewProps> = ({
  complaints,
  onSelectComplaint,
}) => {
  const anomalies = complaints.filter((c) => c.isAnomaly);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            Détection d'Anomalies & Pics Statistiques
            <span className="px-2.5 py-0.5 text-xs rounded-full font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              Isolation Forest & Z-Score
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Identification automatique des comportements atypiques, des montants aberrants et des ruptures de tendance.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-bold text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          {anomalies.length} Anomalies Actives
        </div>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Bruit / Observations Atypiques</span>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">{anomalies.length}</p>
          <span className="text-[10px] text-slate-400">Score de déviation Isolation Forest &gt; 0.80</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Pics de Volume (Z-Score)</span>
          <p className="text-2xl font-black text-orange-600 dark:text-orange-400 mt-1">Z = +4.12</p>
          <span className="text-[10px] text-slate-400">Détecté sur l'App Mobile v4.2.1</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Impact Financier Cumulé Anomalies</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {anomalies.reduce((acc, c) => acc + c.amount, 0).toLocaleString()} €
          </p>
          <span className="text-[10px] text-slate-400">Montant total des préjudices potentiels</span>
        </div>
      </div>

      {/* Anomalous Complaints List */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-base">
          Liste des Plaintes Flagguées comme Anomalies
        </h3>

        <div className="space-y-3">
          {anomalies.map((c) => (
            <div
              key={c.id}
              onClick={() => onSelectComplaint(c.id)}
              className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 hover:border-amber-500 transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">{c.id}</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{c.clientName}</span>
                  <span className="text-xs text-slate-400">• {c.product}</span>
                </div>
                <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                  ⚠️ Motif d'anomalie : {c.anomalyReason || 'Incohérence majeure de montant ou risque d\'escalade.'}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1">
                  {c.aiSummary}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-full text-xs font-black bg-amber-500 text-slate-950">
                    Score Anomalie : {Math.round(c.anomalyScore * 100)}%
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">{c.amount > 0 ? `${c.amount.toLocaleString()} €` : 'Risque IT/Process'}</p>
                </div>
                <Eye className="w-4 h-4 text-slate-400 hover:text-orange-500" />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
