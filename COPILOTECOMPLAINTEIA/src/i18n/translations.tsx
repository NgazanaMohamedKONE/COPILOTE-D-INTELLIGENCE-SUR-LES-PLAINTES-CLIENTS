import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'fr' | 'en';

export const translations = {
  fr: {
    // Brand & Header
    brandTitle: 'Complaintscope',
    copilotBadge: 'Copilote IA',
    copilotFullBadge: 'Copilote d\'Intelligence Executive',
    searchPlaceholder: 'Rechercher par client, motif, ID ou produit... (Ctrl+K)',
    searchButton: 'Rechercher...',
    searchModalTitle: 'Recherche globale dans les dossiers CFPB',
    searchModalInput: 'Tapez un mot-clé (ex: carte, frais, prêt, nom du client)...',
    
    // Navigation
    navDashboard: 'Tableau de Bord',
    navComplaints: 'Gestion des Plaintes',
    navCopilot: 'Copilote IA RAG',
    navAnomalies: 'Anomalies & Fraudes',
    navTrends: 'Tendances & Risques',
    navRecommendations: 'Recommandations',
    navAlerts: 'Alertes Système',
    navReports: 'Rapports & Exports',
    navAudit: 'Audit & Conformité',
    navImport: 'Importation Données',
    
    // Navigation Groups
    groupOverview: 'Vue d\'ensemble',
    groupIntelligence: 'Intelligence & RAG',
    groupGovernance: 'Gouvernance & Risques',
    groupSystem: 'Système & Données',

    // Dashboard Executive
    dashboardTitle: 'Tableau de Bord Stratégique des Plaintes',
    dashboardSubtitle: 'Supervision en temps réel des irritants clients, analyse prédictive des risques d\'attrition (Churn) et détection automatisée d\'anomalies financières.',
    fluxTime: 'Flux CFPB Temps Réel',
    interrogateCopilot: 'Interroger Copilote',
    exportPdfCsv: 'Export PDF/CSV',
    time7d: '7J',
    time30d: '30J',
    time90d: '90J',

    // Live AI Flash Insight
    signalFort: 'Signal fort',
    appMobileIncrease: '+340% de plaintes sur l\'App Mobile (v4.2.1)',
    churnRiskVip: 'Risque Churn VIP',
    clientsNeedRecall: 'clients VIP nécessitent un rappel sous 24h',
    financialExposure: 'Exposition Financière',
    toArbitrate: 'à arbitrer',

    // KPIs
    kpiTotalComplaints: 'Total Plaintes',
    kpiCritical: 'Critiques',
    kpiResolved: 'Résolues',
    kpiInFollowup: 'En Cours',
    kpiChurnRisk: 'Risque Churn',
    kpiAvgDelay: 'Délai Moyen',
    kpiSatisfaction: 'Satisfaction',
    kpiAiPrecision: 'Précision IA',
    urgencyUnder24h: 'Urgence < 24h',
    rate85: 'Taux de 85%',
    activeFollowup: 'Suivi actif',
    scoresOver60: 'Scores > 60%',
    daysUnit: 'j',
    qualityIndex: 'Indice client',
    geminiModel: 'Modèle Gemini',

    // Charts & Tables
    chronologicalEvolution: 'Évolution Chronologique des Réclamations',
    dailyView: 'Vue Journalière',
    monthlyView: 'Vue Mensuelle',
    volumeSupervision: 'Supervision du volume global par rapport aux dossiers critiques',
    byDay: 'Par Jour',
    byMonth: 'Par Mois',
    productDistribution: 'Distribution par Produit',
    top10Issues: 'Top 10 des Motifs de Plaintes Récurrentes',
    nlpClassification: 'Classification automatique par traitement du langage naturel (NLP)',
    systemAlerts: 'Alertes Système',
    regionalZones: 'Zones Réseau à Fort Volume',
    priorityCases: 'Dossiers à Traiter Prioritairement',
    prioritySubtitle: 'Plaintes avec urgence élevée, risque de churn ou anomalies détectées',

    // Table Headers & Actions
    thComplaintId: 'ID Plainte',
    thClient: 'Client',
    thProductMotif: 'Produit / Motif',
    thUrgency: 'Urgence',
    thChurnRisk: 'Risque Churn',
    thFinancialImpact: 'Impact €',
    thStatus: 'Statut',
    thAction: 'Action',
    btnAnalyze: 'Analyser',
    filterAll: 'Tous',
    filterCritical: 'Critiques',
    filterVip: 'VIP',
    filterChurn: 'Churn > 60%',
    filterAnomalies: 'Anomalies',
    searchTablePlaceholder: 'Filtrer nom, ID, produit...',

    // Footer & Language Toggle
    langFrench: 'Français',
    langEnglish: 'English',
    ragEngineFooter: 'Moteur RAG & Gemini',
    userRole: 'Administrateur Risques',
    switchRole: 'Changer de profil',
    logout: 'Déconnexion',
  },
  en: {
    // Brand & Header
    brandTitle: 'Complaintscope',
    copilotBadge: 'AI Copilot',
    copilotFullBadge: 'Executive Intelligence Copilot',
    searchPlaceholder: 'Search by client, issue, ID or product... (Ctrl+K)',
    searchButton: 'Search...',
    searchModalTitle: 'Global Search in CFPB Cases',
    searchModalInput: 'Type a keyword (e.g. card, fees, loan, client name)...',

    // Navigation
    navDashboard: 'Dashboard',
    navComplaints: 'Complaints Management',
    navCopilot: 'AI Copilot RAG',
    navAnomalies: 'Anomalies & Fraud',
    navTrends: 'Trends & Risks',
    navRecommendations: 'Recommendations',
    navAlerts: 'System Alerts',
    navReports: 'Reports & Exports',
    navAudit: 'Audit & Compliance',
    navImport: 'Data Import',

    // Navigation Groups
    groupOverview: 'Overview',
    groupIntelligence: 'Intelligence & RAG',
    groupGovernance: 'Governance & Risk',
    groupSystem: 'System & Data',

    // Dashboard Executive
    dashboardTitle: 'Strategic Complaints Dashboard',
    dashboardSubtitle: 'Real-time monitoring of customer friction, predictive churn risk analysis, and automated financial anomaly detection.',
    fluxTime: 'CFPB Real-Time Feed',
    interrogateCopilot: 'Ask Copilot',
    exportPdfCsv: 'Export PDF/CSV',
    time7d: '7D',
    time30d: '30D',
    time90d: '90D',

    // Live AI Flash Insight
    signalFort: 'Major Signal',
    appMobileIncrease: '+340% complaints on Mobile App (v4.2.1)',
    churnRiskVip: 'VIP Churn Risk',
    clientsNeedRecall: 'VIP clients require call-back within 24h',
    financialExposure: 'Financial Exposure',
    toArbitrate: 'to arbitrate',

    // KPIs
    kpiTotalComplaints: 'Total Complaints',
    kpiCritical: 'Critical',
    kpiResolved: 'Resolved',
    kpiInFollowup: 'In Progress',
    kpiChurnRisk: 'Churn Risk',
    kpiAvgDelay: 'Avg Resolution',
    kpiSatisfaction: 'Satisfaction',
    kpiAiPrecision: 'AI Accuracy',
    urgencyUnder24h: 'Urgent < 24h',
    rate85: '85% Rate',
    activeFollowup: 'Active tracking',
    scoresOver60: 'Scores > 60%',
    daysUnit: 'd',
    qualityIndex: 'Client index',
    geminiModel: 'Gemini Model',

    // Charts & Tables
    chronologicalEvolution: 'Complaints Chronological Evolution',
    dailyView: 'Daily View',
    monthlyView: 'Monthly View',
    volumeSupervision: 'Global volume supervision vs critical complaints',
    byDay: 'Daily',
    byMonth: 'Monthly',
    productDistribution: 'Product Distribution',
    top10Issues: 'Top 10 Recurring Complaint Motifs',
    nlpClassification: 'Automated Natural Language Processing (NLP) classification',
    systemAlerts: 'System Alerts',
    regionalZones: 'High Volume Network Areas',
    priorityCases: 'High Priority Cases to Process',
    prioritySubtitle: 'Complaints with high urgency, churn risk or detected anomalies',

    // Table Headers & Actions
    thComplaintId: 'Complaint ID',
    thClient: 'Client',
    thProductMotif: 'Product / Issue',
    thUrgency: 'Urgency',
    thChurnRisk: 'Churn Risk',
    thFinancialImpact: 'Impact €',
    thStatus: 'Status',
    thAction: 'Action',
    btnAnalyze: 'Analyze',
    filterAll: 'All',
    filterCritical: 'Critical',
    filterVip: 'VIP',
    filterChurn: 'Churn > 60%',
    filterAnomalies: 'Anomalies',
    searchTablePlaceholder: 'Filter name, ID, product...',

    // Footer & Language Toggle
    langFrench: 'Français',
    langEnglish: 'English',
    ragEngineFooter: 'RAG & Gemini Engine',
    userRole: 'Risk Administrator',
    switchRole: 'Switch profile',
    logout: 'Logout',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations['fr']) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('complaintscope_lang');
    return (saved === 'en' || saved === 'fr') ? saved : 'fr';
  });

  useEffect(() => {
    localStorage.setItem('complaintscope_lang', language);
  }, [language]);

  const t = (key: keyof typeof translations['fr']): string => {
    return translations[language][key] || translations['fr'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
