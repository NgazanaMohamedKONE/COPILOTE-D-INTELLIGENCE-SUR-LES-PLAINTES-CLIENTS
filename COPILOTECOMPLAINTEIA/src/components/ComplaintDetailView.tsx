import React, { useState } from 'react';
import { ComplaintRecord } from '../types';
import {
  ArrowLeft,
  Sparkles,
  AlertTriangle,
  User,
  Building2,
  Calendar,
  Euro,
  MapPin,
  HelpCircle,
  TrendingDown,
  ShieldAlert,
  CheckCircle2,
  Share2,
  Copy,
  Check,
  Bot
} from 'lucide-react';

interface ComplaintDetailViewProps {
  complaint: ComplaintRecord;
  similarComplaints: ComplaintRecord[];
  onBack: () => void;
  onSelectComplaint: (id: string) => void;
  onOpenCopilotWithContext: (query: string) => void;
}

export const ComplaintDetailView: React.FC<ComplaintDetailViewProps> = ({
  complaint,
  similarComplaints,
  onBack,
  onSelectComplaint,
  onOpenCopilotWithContext,
}) => {
  const [copied, setCopied] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(complaint.status);

  const handleCopySummary = () => {
    navigator.clipboard.writeText(
      `Dossier ${complaint.id} - ${complaint.clientName}\nProduit : ${complaint.product}\nRésumé IA : ${complaint.aiSummary}\nCause : ${complaint.probableCause}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-200/80 transition flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Retour à la liste
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopySummary}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Résumé Copié' : 'Copier Résumé'}
          </button>

          <button
            onClick={() =>
              onOpenCopilotWithContext(
                `Analyse le dossier ${complaint.id} pour ${complaint.clientName} sur ${complaint.product}. Quelles actions prioritaires recommandes-tu ?`
              )
            }
            className="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs transition flex items-center gap-1.5 shadow-md shadow-orange-600/20"
          >
            <Bot className="w-4 h-4" /> Discuter avec le Copilote IA
          </button>
        </div>
      </div>

      {/* Main Dossier Header Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2.5 py-0.5 rounded-md border border-blue-200 dark:border-blue-800">
                {complaint.id}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                complaint.urgency === 'Critique'
                  ? 'bg-red-500 text-white'
                  : complaint.urgency === 'Haute'
                  ? 'bg-orange-500 text-white'
                  : 'bg-blue-500 text-white'
              }`}>
                Urgence {complaint.urgency}
              </span>
              {complaint.isAnomaly && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-600 border border-amber-500/30 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Anomalie Détectée
                </span>
              )}
            </div>

            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              {complaint.product} — {complaint.issue}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Reçu le {complaint.dateReceived} • Transmis à l'{complaint.agency} ({complaint.city}, {complaint.region})
            </p>
          </div>

          {/* Status selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Statut :</span>
            <select
              value={currentStatus}
              onChange={(e) => setCurrentStatus(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
            >
              <option value="Ouverte">Ouverte</option>
              <option value="En cours">En cours</option>
              <option value="En revue">En revue</option>
              <option value="Escaladée">Escaladée</option>
              <option value="Résolue">Résolue</option>
              <option value="Fermée">Fermée</option>
            </select>
          </div>
        </div>

        {/* Executive AI Summary Box */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-blue-900/10 via-indigo-900/10 to-slate-900/10 border border-blue-200 dark:border-blue-900/50">
          <div className="flex items-center gap-2 mb-1 text-xs font-extrabold text-blue-900 dark:text-blue-300">
            <Sparkles className="w-4 h-4 text-orange-500" /> Résumé Exécutif IA :
          </div>
          <p className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
            {complaint.aiSummary}
          </p>
        </div>

      </div>

      {/* Key Extracted Entities Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
            <User className="w-3 h-3 text-blue-500" /> Client
          </p>
          <p className="text-xs font-bold text-slate-900 dark:text-white mt-1">{complaint.clientName}</p>
          <p className="text-[10px] text-slate-500">{complaint.clientVip ? 'Client VIP Premier' : 'Client Standard'}</p>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
            <Building2 className="w-3 h-3 text-indigo-500" /> Service Responsable
          </p>
          <p className="text-xs font-bold text-slate-900 dark:text-white mt-1">{complaint.service}</p>
          <p className="text-[10px] text-slate-500">{complaint.subProduct}</p>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
            <Euro className="w-3 h-3 text-emerald-500" /> Montant Contesté
          </p>
          <p className="text-xs font-bold text-slate-900 dark:text-white mt-1">
            {complaint.amount > 0 ? `${complaint.amount.toLocaleString()} €` : 'N/A'}
          </p>
          <p className="text-[10px] text-slate-500">Impact Financier</p>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
            <TrendingDown className="w-3 h-3 text-red-500" /> Risque de Churn
          </p>
          <p className="text-xs font-bold text-red-600 dark:text-red-400 mt-1">{complaint.churnRisk}%</p>
          <p className="text-[10px] text-slate-500">Probabilité d'abandon</p>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-orange-500" /> Risque Escalade
          </p>
          <p className="text-xs font-bold text-orange-600 dark:text-orange-400 mt-1">{complaint.escalationProbability}%</p>
          <p className="text-[10px] text-slate-500">Poursuite / Litige</p>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
            <MapPin className="w-3 h-3 text-purple-500" /> Localisation
          </p>
          <p className="text-xs font-bold text-slate-900 dark:text-white mt-1">{complaint.city}</p>
          <p className="text-[10px] text-slate-500">{complaint.region}</p>
        </div>

      </div>

      {/* Main Side-by-Side Narrative & Root Cause Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Original vs Cleaned Narrative */}
        <div className="space-y-4">
          
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-2">
              Texte Original de la Plainte
            </h3>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-mono">
              "{complaint.narrative}"
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-orange-500" /> Texte Normalisé & Nettoyé (NLP)
            </h3>
            <div className="p-3.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
              {complaint.cleanedNarrative}
            </div>
          </div>

        </div>

        {/* Right Column: Cause Probable & Recommendation */}
        <div className="space-y-4">
          
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-3">
              Analyse des Causes Probables & Demande Client
            </h3>
            
            <div className="space-y-3 text-xs">
              <div>
                <span className="font-bold text-slate-500 block mb-1">Cause Racine Probable (Détectée) :</span>
                <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 font-medium text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                  {complaint.probableCause}
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-500 block mb-1">Demande Explicite du Client :</span>
                <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 font-medium text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                  {complaint.customerRequest}
                </p>
              </div>
            </div>
          </div>

          {/* Similar Complaints Search Matches */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-3">
              Plaintes Similaires Détectées (Recherche Vectorielle)
            </h3>

            {similarComplaints.length === 0 ? (
              <p className="text-xs text-slate-500">Aucune autre plainte similaire trouvée dans ce périmètre.</p>
            ) : (
              <div className="space-y-2">
                {similarComplaints.map((sim) => (
                  <div
                    key={sim.id}
                    onClick={() => onSelectComplaint(sim.id)}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:border-blue-500 cursor-pointer transition text-xs flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{sim.id}</span>
                        <span className="text-[10px] font-semibold text-slate-500">{sim.clientName}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-1 mt-0.5">{sim.aiSummary}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      89% similaire
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
