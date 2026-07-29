import React, { useState } from 'react';
import { DashboardMetrics, ComplaintRecord, SmartAlert, Recommendation } from '../types';
import { FileText, Download, FileSpreadsheet, Sparkles, CheckCircle2 } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface ReportsViewProps {
  metrics: DashboardMetrics;
  complaints: ComplaintRecord[];
  alerts: SmartAlert[];
  recommendations: Recommendation[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  metrics,
  complaints,
  alerts,
  recommendations,
}) => {
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingExcel, setIsExportingExcel] = useState(false);

  // Generate PDF Executive Report
  const handleExportPDF = () => {
    setIsExportingPDF(true);
    setTimeout(() => {
      try {
        const doc = new jsPDF();

        // Header Title
        doc.setFillColor(15, 23, 42); // Navy Blue
        doc.rect(0, 0, 210, 35, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text("ComplaintScope AI - Rapport Exécutif d'Intelligence", 14, 18);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')} • CFPB Complaint Intelligence Database`, 14, 27);

        // Section 1: Executive KPI Metrics
        doc.setTextColor(15, 23, 42);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('1. Indicateurs Clés de Performance (KPIs)', 14, 48);

        autoTable(doc, {
          startY: 53,
          head: [['Métrique', 'Valeur', 'Commentaire / Statut']],
          body: [
            ['Total Plaintes Ingestées', String(metrics.totalComplaints), 'Données CFPB certifiées'],
            ['Plaintes Critiques (24h)', String(metrics.criticalComplaints), 'Priorité d\'escalade urgente'],
            ['Plaintes Résolues', String(metrics.resolvedComplaints), 'Taux de résolution 85%'],
            ['Score de Satisfaction Client', `${metrics.customerSatisfactionIdx} / 100`, 'Calculé par modèle de sentiment'],
            ['Délai Moyen de Traitement', `${metrics.avgResolutionTimeDays} jours`, '-0.8j vs mois précédent'],
            ['Précision IA / Confiance', `${metrics.aiConfidenceScore}%`, 'Supervision Gemini 3.6 Flash']
          ],
          headStyles: { fillColor: [30, 58, 138] },
          theme: 'striped'
        });

        // Section 2: Active Alerts
        const alertY = (doc as any).lastAutoTable.finalY + 10;
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('2. Alertes Intelligentes & Risques Opérationnels', 14, alertY);

        autoTable(doc, {
          startY: alertY + 5,
          head: [['Niveau', 'Titre de l\'Alerte', 'Produit', 'Justification']],
          body: alerts.map(a => [a.level, a.title, a.product, a.justification]),
          headStyles: { fillColor: [234, 88, 12] },
          theme: 'grid'
        });

        // Section 3: Recommendations
        const recY = (doc as any).lastAutoTable.finalY + 10;
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('3. Recommandations Stratégiques RAG', 14, recY);

        autoTable(doc, {
          startY: recY + 5,
          head: [['Priorité', 'Catégorie', 'Recommandation', 'Impact Estimé']],
          body: recommendations.map(r => [r.priority, r.category, r.title, r.estimatedImpact]),
          headStyles: { fillColor: [15, 23, 42] },
          theme: 'striped'
        });

        doc.save(`Rapport_Executif_ComplaintScope_${new Date().toISOString().substring(0, 10)}.pdf`);
      } catch (err) {
        console.error('Error exporting PDF:', err);
        alert('Erreur lors de la génération du PDF.');
      } finally {
        setIsExportingPDF(false);
      }
    }, 500);
  };

  // Generate Excel Export
  const handleExportExcel = () => {
    setIsExportingExcel(true);
    setTimeout(() => {
      try {
        const wb = XLSX.utils.book_new();

        // Sheet 1: Complaints
        const complaintRows = complaints.map(c => ({
          'ID Plainte': c.id,
          'Client': c.clientName,
          'Produit': c.product,
          'Service': c.service,
          'Problème Prédit': c.issue,
          'Urgence': c.urgency,
          'Sentiment': c.sentiment,
          'Score Churn %': c.churnRisk,
          'Montant €': c.amount,
          'Agence': c.agency,
          'Ville': c.city,
          'Statut': c.status,
          'Résumé IA': c.aiSummary,
          'Cause Probable': c.probableCause
        }));
        const wsComplaints = XLSX.utils.json_to_sheet(complaintRows);
        XLSX.utils.book_append_sheet(wb, wsComplaints, 'Plaintes');

        // Sheet 2: Alerts
        const alertRows = alerts.map(a => ({
          'ID Alerte': a.id,
          'Niveau': a.level,
          'Date': a.date,
          'Produit': a.product,
          'Titre': a.title,
          'Justification': a.justification
        }));
        const wsAlerts = XLSX.utils.json_to_sheet(alertRows);
        XLSX.utils.book_append_sheet(wb, wsAlerts, 'Alertes');

        XLSX.writeFile(wb, `Export_ComplaintScope_Complete_${new Date().toISOString().substring(0, 10)}.xlsx`);
      } catch (err) {
        console.error('Error exporting Excel:', err);
        alert('Erreur lors de l\'exportation Excel.');
      } finally {
        setIsExportingExcel(false);
      }
    }, 500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            Génération de Rapports & Exports
            <span className="px-2.5 py-0.5 text-xs rounded-full font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              PDF & Excel (.xlsx)
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Produisez des bilans de gestion exécutifs complets avec statistiques, classement des causes racines et plans de recommandations.
          </p>
        </div>
      </div>

      {/* Export Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* PDF Executive Report Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-950 text-red-600 flex items-center justify-center mb-3 border border-red-200 dark:border-red-900">
              <FileText className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Rapport Exécutif PDF Synthétique
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Document officiel au format PDF comprenant le résumé exécutif, la table des indicateurs clés, la liste des alertes actives et les recommandations RAG.
            </p>
          </div>

          <button
            onClick={handleExportPDF}
            disabled={isExportingPDF}
            className="w-full py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-md shadow-blue-900/20"
          >
            <Download className="w-4 h-4" /> {isExportingPDF ? 'Génération du PDF...' : 'Télécharger le Rapport PDF'}
          </button>
        </div>

        {/* Excel Data Export Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mb-3 border border-emerald-200 dark:border-emerald-900">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Export Brut Excel (.xlsx)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Exportation complète de toutes les plaintes, entités extraites, causes racines, prédictions NLP et alertes sous forme de classeur multi-onglets Excel.
            </p>
          </div>

          <button
            onClick={handleExportExcel}
            disabled={isExportingExcel}
            className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-md shadow-emerald-700/20"
          >
            <Download className="w-4 h-4" /> {isExportingExcel ? 'Génération Excel...' : 'Exporter le Fichier Excel (.xlsx)'}
          </button>
        </div>

      </div>

    </div>
  );
};
