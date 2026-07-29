import React, { useState } from 'react';
import { Recommendation } from '../types';
import { Lightbulb, CheckCircle2, ShieldCheck, ArrowRight, Target, Sparkles } from 'lucide-react';

interface RecommendationsViewProps {
  recommendations: Recommendation[];
}

export const RecommendationsView: React.FC<RecommendationsViewProps> = ({
  recommendations,
}) => {
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  const toggleStep = (stepKey: string) => {
    setCompletedSteps((prev) => ({ ...prev, [stepKey]: !prev[stepKey] }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            Recommandations Stratégiques IA
            <span className="px-2.5 py-0.5 text-xs rounded-full font-bold bg-orange-500 text-white">
              Plan d'Action Correctif
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Propositions automatisées pour réduire le volume de plaintes, former le personnel, corriger les applications et renforcer le SAV.
          </p>
        </div>
      </div>

      {/* Recommendations Cards */}
      <div className="space-y-4">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                  rec.priority === 'Haute'
                    ? 'bg-red-500 text-white'
                    : 'bg-orange-500 text-white'
                }`}>
                  Priorité {rec.priority}
                </span>
                <span className="text-xs font-bold text-slate-500">{rec.category}</span>
                <span className="text-xs text-slate-400">• {rec.targetDepartment}</span>
              </div>

              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                Impact Estimé : {rec.estimatedImpact}
              </span>
            </div>

            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white mb-1">
                {rec.title}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {rec.description}
              </p>
            </div>

            {/* Checklist of Action Steps */}
            <div className="space-y-2 pt-2">
              <p className="text-xs font-extrabold uppercase text-slate-400">Étapes d'Exécution Recommandées :</p>
              <div className="space-y-1.5">
                {rec.actionSteps.map((step, idx) => {
                  const stepKey = `${rec.id}-${idx}`;
                  const isChecked = !!completedSteps[stepKey];
                  return (
                    <button
                      key={idx}
                      onClick={() => toggleStep(stepKey)}
                      className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-medium text-left transition ${
                        isChecked
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 line-through'
                          : 'bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <CheckCircle2 className={`w-4 h-4 shrink-0 ${isChecked ? 'text-emerald-500' : 'text-slate-400'}`} />
                      <span>{step}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
