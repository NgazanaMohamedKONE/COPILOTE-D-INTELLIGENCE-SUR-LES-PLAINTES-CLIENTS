import React, { useState } from 'react';
import { SmartAlert } from '../types';
import { BellRing, ShieldAlert, Sparkles, CheckCircle2, ChevronRight, ArrowUpRight } from 'lucide-react';

interface AlertsViewProps {
  alerts: SmartAlert[];
  onSelectComplaint: (id: string) => void;
  onOpenCopilotWithContext: (query: string) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  alerts,
  onSelectComplaint,
  onOpenCopilotWithContext,
}) => {
  const [activeAlerts, setActiveAlerts] = useState<SmartAlert[]>(alerts);
  const [selectedExplanation, setSelectedExplanation] = useState<string | null>(null);

  const handleResolveAlert = (id: string) => {
    setActiveAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'Résolue' } : a)));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            Alertes Intelligentes & Risques Opérationnels
            <span className="px-2.5 py-0.5 text-xs rounded-full font-bold bg-orange-500 text-white">
              {activeAlerts.filter((a) => a.status === 'Active').length} Actives
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Moteur de règles & détection proactive sur les hausse de plaintes, les clients VIP critiques et les dysfonctionnements produits.
          </p>
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-4">
        {activeAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-5 rounded-2xl border transition shadow-sm ${
              alert.status === 'Résolue'
                ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
                : alert.level === 'Critique'
                ? 'bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                    alert.level === 'Critique'
                      ? 'bg-red-500 text-white'
                      : alert.level === 'Élevé'
                      ? 'bg-orange-500 text-white'
                      : 'bg-blue-500 text-white'
                  }`}>
                    Niveau {alert.level}
                  </span>
                  <span className="text-xs font-bold text-slate-500">{alert.date}</span>
                  <span className="text-xs text-slate-400">• {alert.product}</span>
                </div>

                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {alert.title}
                </h2>

                <p className="text-xs text-slate-700 dark:text-slate-300">
                  <strong className="text-slate-900 dark:text-white">Justification :</strong> {alert.justification}
                </p>

                {alert.aiExplanation && (
                  <div className="p-3.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 text-xs text-slate-800 dark:text-slate-200">
                    <p className="font-extrabold text-blue-900 dark:text-blue-300 mb-1 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-orange-500" /> Explication Copilote IA :
                    </p>
                    {alert.aiExplanation}
                  </div>
                )}

                {/* Related Source Complaints */}
                <div className="pt-2 flex items-center gap-2 text-xs">
                  <span className="font-bold text-slate-400">Dossiers de Plaintes Sources :</span>
                  {alert.relatedComplaintIds.map((cid) => (
                    <button
                      key={cid}
                      onClick={() => onSelectComplaint(cid)}
                      className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-mono font-bold hover:underline"
                    >
                      {cid}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Action buttons */}
              <div className="flex flex-col gap-2 shrink-0">
                <button
                  onClick={() =>
                    onOpenCopilotWithContext(
                      `Analyse l'alerte ${alert.title} concernant ${alert.product}. Pourquoi cette hausse a-t-elle lieu et quelles sont tes recommandations ?`
                    )
                  }
                  className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Explication Copilote
                </button>

                {alert.status !== 'Résolue' && (
                  <button
                    onClick={() => handleResolveAlert(alert.id)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Marquer Résolue
                  </button>
                )}
              </div>

            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
