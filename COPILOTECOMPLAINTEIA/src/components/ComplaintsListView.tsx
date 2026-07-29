import React, { useState, useMemo } from 'react';
import { ComplaintRecord, UrgencyLevel, SentimentType, ComplaintStatus } from '../types';
import {
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  Download,
  PlusCircle
} from 'lucide-react';

interface ComplaintsListViewProps {
  complaints: ComplaintRecord[];
  onSelectComplaint: (id: string) => void;
  onOpenImport: () => void;
}

export const ComplaintsListView: React.FC<ComplaintsListViewProps> = ({
  complaints,
  onSelectComplaint,
  onOpenImport,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('ALL');
  const [selectedUrgency, setSelectedUrgency] = useState('ALL');
  const [selectedSentiment, setSelectedSentiment] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [onlyAnomalies, setOnlyAnomalies] = useState(false);

  // Extract unique products
  const products = useMemo(() => {
    const list = Array.from(new Set(complaints.map((c) => c.product)));
    return ['ALL', ...list];
  }, [complaints]);

  // Filter complaints
  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      const matchesSearch =
        c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.issue.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.narrative.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.agency.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesProduct = selectedProduct === 'ALL' || c.product === selectedProduct;
      const matchesUrgency = selectedUrgency === 'ALL' || c.urgency === selectedUrgency;
      const matchesSentiment = selectedSentiment === 'ALL' || c.sentiment === selectedSentiment;
      const matchesStatus = selectedStatus === 'ALL' || c.status === selectedStatus;
      const matchesAnomaly = !onlyAnomalies || c.isAnomaly;

      return matchesSearch && matchesProduct && matchesUrgency && matchesSentiment && matchesStatus && matchesAnomaly;
    });
  }, [complaints, searchTerm, selectedProduct, selectedUrgency, selectedSentiment, selectedStatus, onlyAnomalies]);

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            Gestion & Classification des Plaintes
            <span className="px-2.5 py-0.5 text-xs rounded-full font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              {filteredComplaints.length} enregistrements
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Explorez, filtrez et analysez l'intégralité des plaintes clients enrichies par les modèles NLP.
          </p>
        </div>

        <button
          onClick={onOpenImport}
          className="px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs flex items-center gap-2 transition shadow-md shadow-blue-900/20 shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-orange-400" /> Importer un Fichier CSV / Excel
        </button>
      </div>

      {/* Filter panel */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par ID, client, produit, mot-clé, agence..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Dropdown Filters Row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Produit</label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
            >
              {products.map((p) => (
                <option key={p} value={p}>{p === 'ALL' ? 'Tous les produits' : p}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Urgence</label>
            <select
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
            >
              <option value="ALL">Toutes les urgences</option>
              <option value="Critique">Critique</option>
              <option value="Haute">Haute</option>
              <option value="Moyenne">Moyenne</option>
              <option value="Faible">Faible</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Sentiment</label>
            <select
              value={selectedSentiment}
              onChange={(e) => setSelectedSentiment(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
            >
              <option value="ALL">Tous les sentiments</option>
              <option value="Très négatif">Très négatif</option>
              <option value="Négatif">Négatif</option>
              <option value="Neutre">Neutre</option>
              <option value="Positif">Positif</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase">Statut</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
            >
              <option value="ALL">Tous les statuts</option>
              <option value="Ouverte">Ouverte</option>
              <option value="En cours">En cours</option>
              <option value="En revue">En revue</option>
              <option value="Résolue">Résolue</option>
              <option value="Escaladée">Escaladée</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => setOnlyAnomalies(!onlyAnomalies)}
              className={`w-full py-1.5 px-3 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
                onlyAnomalies
                  ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" /> Anomalies Uniquement
            </button>
          </div>

        </div>
      </div>

      {/* Main Complaints Data Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3 px-4">ID Plainte</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Produit & Service</th>
                <th className="py-3 px-4">Problème Prédit</th>
                <th className="py-3 px-4">Urgence</th>
                <th className="py-3 px-4">Sentiment</th>
                <th className="py-3 px-4">Score Churn</th>
                <th className="py-3 px-4">Statut</th>
                <th className="py-3 px-4 text-right">Analyse Détaillée</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500">
                    Aucune plainte ne correspond aux filtres sélectionnés.
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                    
                    {/* ID & Anomaly badge */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                          {c.id}
                        </span>
                        {c.isAnomaly && (
                          <span className="p-1 rounded-full bg-amber-500/20 text-amber-500" title="Anomalie détectée">
                            <AlertTriangle className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">{c.dateReceived}</span>
                    </td>

                    {/* Client Name */}
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {c.clientName}
                      </p>
                      <p className="text-[10px] text-slate-400">{c.city} • {c.agency}</p>
                    </td>

                    {/* Product & Service */}
                    <td className="py-3 px-4">
                      <p className="font-medium text-slate-800 dark:text-slate-200">{c.product}</p>
                      <p className="text-[10px] text-slate-400">{c.service}</p>
                    </td>

                    {/* Predicted Issue Category */}
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{c.issue}</p>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                        Confiance NLP : {Math.round(c.categoryConfidence * 100)}%
                      </span>
                    </td>

                    {/* Urgency Badge */}
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                        c.urgency === 'Critique'
                          ? 'bg-red-500 text-white'
                          : c.urgency === 'Haute'
                          ? 'bg-orange-500 text-white'
                          : c.urgency === 'Moyenne'
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200'
                      }`}>
                        {c.urgency}
                      </span>
                    </td>

                    {/* Sentiment */}
                    <td className="py-3 px-4">
                      <span className={`text-[11px] font-semibold ${
                        c.sentiment === 'Très négatif'
                          ? 'text-red-600 dark:text-red-400'
                          : c.sentiment === 'Négatif'
                          ? 'text-orange-600 dark:text-orange-400'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}>
                        {c.sentiment}
                      </span>
                    </td>

                    {/* Churn Risk Meter */}
                    <td className="py-3 px-4 font-bold">
                      <div className="flex items-center gap-1.5">
                        <div className="w-12 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${c.churnRisk > 75 ? 'bg-red-500' : c.churnRisk > 45 ? 'bg-orange-500' : 'bg-emerald-500'}`}
                            style={{ width: `${c.churnRisk}%` }}
                          />
                        </div>
                        <span className="text-[11px] text-slate-800 dark:text-slate-200">{c.churnRisk}%</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {c.status}
                      </span>
                    </td>

                    {/* Action Button */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onSelectComplaint(c.id)}
                        className="px-3 py-1.5 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs transition inline-flex items-center gap-1 shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5" /> Analyser
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
