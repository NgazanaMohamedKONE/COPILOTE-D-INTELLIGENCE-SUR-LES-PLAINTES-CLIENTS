import React, { useState } from 'react';
import { DataQualityReport } from '../types';
import {
  UploadCloud,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Sparkles,
  RefreshCw,
  Database,
  ArrowRight
} from 'lucide-react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

interface DataImportViewProps {
  onImportCompleted: (count: number) => void;
}

export const DataImportView: React.FC<DataImportViewProps> = ({ onImportCompleted }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [report, setReport] = useState<DataQualityReport | null>(null);
  const [importedRowsCount, setImportedRowsCount] = useState<number | null>(null);

  const processFileContent = async (parsedData: any[]) => {
    setIsProcessing(true);
    try {
      const formattedRecords = parsedData.map((row: any) => ({
        clientName: row.Client || row['Nom Client'] || row.clientName || 'Client Importé',
        product: row.Product || row.Produit || row.product || 'Compte Courant',
        service: row.Service || row.service || 'Service Clientèle',
        issue: row.Issue || row.Problème || row.issue || 'Facturation',
        narrative: row.Narrative || row['Texte Plainte'] || row.narrative || row.Description || 'Plainte importée.',
        amount: Number(row.Amount || row.Montant || row.amount || 0),
        agency: row.Agency || row.Agence || row.agency || 'Agence Centrale',
        city: row.City || row.Ville || row.city || 'Paris',
        dateReceived: row.Date || row.dateReceived || new Date().toISOString().substring(0, 10)
      }));

      const res = await fetch('/api/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records: formattedRecords })
      });

      if (!res.ok) throw new Error('Import error');
      const result = await res.json();

      setReport(result.qualityReport);
      setImportedRowsCount(result.importedCount);
      onImportCompleted(result.importedCount);
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la lecture du fichier. Vérifiez le format CSV ou Excel.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'csv') {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          processFileContent(results.data);
        }
      });
    } else if (ext === 'xlsx' || ext === 'xls') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        processFileContent(json);
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert('Format de fichier non pris en charge. Veuillez charger un fichier .csv ou .xlsx.');
    }
  };

  const handleGenerateSynthetic = () => {
    const syntheticData = [
      { Client: 'Isabelle Moreau', Produit: 'Carte de Crédit Premier', Problème: 'Facturation', Narrative: 'Double prélèvement lors du règlement de mon hôtel le 20 juillet. Montant contesté : 480 €.', Montant: 480, Agence: 'Agence Lyon Presqu\'île' },
      { Client: 'Cabinet Bertrand', Produit: 'Prêt Immobilier Pro', Problème: 'Retard', Narrative: 'Délai d\'émission de l\'offre de prêt supérieur à 5 semaines. Vente immobilière compromise.', Montant: 210000, Agence: 'Agence Marseille Vieux-Port' },
      { Client: 'Julien Mercier', Produit: 'Application Mobile', Problème: 'Application', Narrative: 'Impossible d\'ajouter un bénéficiaire de virement sur la nouvelle version iOS. Code erreur ERR_SEC_403.', Montant: 0, Agence: 'Support Digital' }
    ];
    processFileContent(syntheticData);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            Importation & Contrôle Qualité des Données
            <span className="px-2.5 py-0.5 text-xs rounded-full font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              CSV & Excel (.xlsx)
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Téléchargez un fichier de réclamations. L'IA nettoie, vérifie le schéma, élimine les doublons et classe chaque plainte automatiquement.
          </p>
        </div>

        <button
          onClick={handleGenerateSynthetic}
          disabled={isProcessing}
          className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs flex items-center gap-2 transition shadow-md shadow-orange-600/20 shrink-0"
        >
          <Sparkles className="w-4 h-4" /> Générer un Fichier Test d'Exemple
        </button>
      </div>

      {/* Main Drag and Drop Box */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileUpload(e.dataTransfer.files[0]);
          }
        }}
        className={`p-10 rounded-2xl border-2 border-dashed transition flex flex-col items-center justify-center text-center ${
          isDragging
            ? 'border-orange-500 bg-orange-500/10'
            : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900'
        }`}
      >
        <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 border border-blue-200 dark:border-blue-800">
          {isProcessing ? (
            <RefreshCw className="w-8 h-8 animate-spin text-orange-500" />
          ) : (
            <UploadCloud className="w-8 h-8" />
          )}
        </div>

        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
          {isProcessing ? 'Analyse et Traitement IA en cours...' : 'Glissez-déposez votre fichier ici'}
        </h3>
        <p className="text-xs text-slate-500 max-w-md mb-4">
          Formats acceptés : CSV, XLSX, XLS. Les colonnes recommandées sont : Client, Produit, Problème, Narrative, Montant, Agence, Date.
        </p>

        <label className="px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs cursor-pointer transition shadow-sm">
          Sélectionner un Fichier
          <input
            type="file"
            accept=".csv, .xlsx, .xls"
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
            className="hidden"
          />
        </label>
      </div>

      {/* Quality Report Results */}
      {report && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Rapport de Qualité des Données Ingestées
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Score Qualité : {report.qualityScore}/100
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 font-bold block mb-1">Lignes Traitées</span>
              <p className="text-xl font-extrabold text-slate-900 dark:text-white">{report.totalRows}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 font-bold block mb-1">Lignes Valides</span>
              <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">{report.validRows}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 font-bold block mb-1">Doublons Ignorés</span>
              <p className="text-xl font-extrabold text-slate-900 dark:text-white">{report.duplicateCount}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 font-bold block mb-1">Champs Corrigés</span>
              <p className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">{report.missingFieldsCount}</p>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400">
            ✅ {importedRowsCount} nouvelles plaintes ont été ajoutées et classées dans la base de données.
          </p>
        </div>
      )}

    </div>
  );
};
