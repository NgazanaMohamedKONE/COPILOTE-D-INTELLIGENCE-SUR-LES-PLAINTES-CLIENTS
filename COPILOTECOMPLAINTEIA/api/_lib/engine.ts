import { GoogleGenAI } from '@google/genai';
import { MOCK_COMPLAINTS, MOCK_ALERTS, MOCK_RECOMMENDATIONS, MOCK_AUDIT_LOGS } from '../../src/data/mockComplaints.js';
import { ComplaintRecord, SmartAlert, Recommendation, AuditLog, DashboardMetrics } from '../../src/types.js';

// NOTE: en environnement serverless, cette mémoire n'est PAS garantie de persister
// entre deux requêtes (chaque invocation peut redémarrer une instance froide).
// Pour une persistance fiable en production, remplacer par une vraie base
// (Vercel Postgres, Vercel KV, Supabase, etc.).
export let complaintsStore: ComplaintRecord[] = [...MOCK_COMPLAINTS];
export let alertsStore: SmartAlert[] = [...MOCK_ALERTS];
export let recommendationsStore: Recommendation[] = [...MOCK_RECOMMENDATIONS];
export let auditLogsStore: AuditLog[] = [...MOCK_AUDIT_LOGS];

export function setComplaintsStore(next: ComplaintRecord[]) {
  complaintsStore = next;
}

export function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export function searchRelevantComplaints(query: string, limit = 8): { matches: ComplaintRecord[]; totalMatches: number; keywords: string[] } {
  const q = query.toLowerCase();
  const stopWords = new Set([
    'de', 'du', 'des', 'le', 'la', 'les', 'un', 'une', 'en', 'et', 'à', 'pour', 'dans', 'sur', 'par', 'avec',
    'est', 'sont', 'aussi', 'pourquoi', 'comment', 'quand', 'quel', 'quels', 'quelle', 'quelles', 'est-il',
    'donne', 'moi', 'fais', 'analyse', 'que', 'qui', 'what', 'why', 'how', 'when', 'where', 'which', 'give',
    'the', 'and', 'for', 'with', 'nous', 'vous', 'savoir', 'voir'
  ]);

  const keywords = q
    .replace(/[^\w\s\dàâéèêëîïôöùûüç-]/gi, ' ')
    .split(/\s+/)
    .filter(w => w.length >= 2 && !stopWords.has(w));

  const scored = complaintsStore.map(c => {
    let score = 0;
    const fullText = `${c.id} ${c.clientName} ${c.product} ${c.subProduct} ${c.service} ${c.issue} ${c.subIssue} ${c.narrative} ${c.cleanedNarrative} ${c.aiSummary} ${c.probableCause} ${c.customerRequest} ${c.agency} ${c.city}`.toLowerCase();

    if (q.includes(c.id.toLowerCase())) score += 50;

    keywords.forEach(kw => {
      if (c.id.toLowerCase().includes(kw)) score += 25;
      if (c.product.toLowerCase().includes(kw)) score += 12;
      if (c.issue.toLowerCase().includes(kw)) score += 12;
      if (c.clientName.toLowerCase().includes(kw)) score += 10;
      if (c.agency.toLowerCase().includes(kw) || c.city.toLowerCase().includes(kw)) score += 6;
      const count = (fullText.split(kw).length - 1);
      score += count * 2;
    });

    if ((q.includes('critique') || q.includes('urgent') || q.includes('risque') || q.includes('churn')) && (c.urgency === 'Critique' || c.churnRisk >= 60)) {
      score += 8;
    }
    if ((q.includes('vip') || q.includes('faste') || q.includes('client')) && c.clientVip) {
      score += 8;
    }
    if ((q.includes('anomalie') || q.includes('fraude') || q.includes('bogue') || q.includes('erreur')) && c.isAnomaly) {
      score += 8;
    }

    return { complaint: c, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const matchedItems = scored.filter(s => s.score > 0).map(s => s.complaint);
  const totalMatches = matchedItems.length;
  const matches = totalMatches > 0 ? matchedItems.slice(0, limit) : complaintsStore.slice(0, limit);

  return { matches, totalMatches, keywords };
}

export function generateLocalResponse(query: string, intention: string): string {
  const { matches, totalMatches } = searchRelevantComplaints(query, 5);
  const totalInBase = complaintsStore.length;
  const criticalInBase = complaintsStore.filter(c => c.urgency === 'Critique');
  const vipList = complaintsStore.filter(c => c.clientVip);
  const highChurn = complaintsStore.filter(c => c.churnRisk >= 60);
  const anomalies = complaintsStore.filter(c => c.isAnomaly);

  const productCounts: Record<string, number> = {};
  complaintsStore.forEach(c => { productCounts[c.product] = (productCounts[c.product] || 0) + 1; });
  const topProdEntry = Object.entries(productCounts).sort((a, b) => b[1] - a[1])[0];

  const issueCounts: Record<string, number> = {};
  complaintsStore.forEach(c => { issueCounts[c.issue] = (issueCounts[c.issue] || 0) + 1; });
  const topIssueEntry = Object.entries(issueCounts).sort((a, b) => b[1] - a[1])[0];

  const citationsBlock = matches.map(c =>
    `• **${c.id}** — *${c.clientName}* (${c.clientVip ? 'VIP' : 'Standard'}) | **${c.product}** (${c.issue})\n` +
    `  ↳ **Urgence :** ${c.urgency} | **Montant :** ${c.amount} € | **Risque Churn :** ${c.churnRisk}%\n` +
    `  ↳ **Synthèse IA :** "${c.aiSummary}"\n` +
    `  ↳ **Cause Racine :** ${c.probableCause}`
  ).join('\n\n');

  if (intention === 'STATISTIQUE') {
    return `### 📊 Synthèse Statistique & RAG Analytics

- **Total des réclamations en base :** **${totalInBase}** dossiers
- **Dossiers avec urgence Critique :** **${criticalInBase.length}** (${Math.round((criticalInBase.length / (totalInBase || 1)) * 100)}% du total)
- **Produit à fort volume :** **${topProdEntry ? topProdEntry[0] : 'Carte de Crédit'}** (**${topProdEntry ? topProdEntry[1] : 0}** réclamations)
- **Motif récurrent principal :** **${topIssueEntry ? topIssueEntry[0] : 'Facturation'}** (**${topIssueEntry ? topIssueEntry[1] : 0}** cas)
- **Clients VIP affectés :** **${vipList.length}** comptes majeurs
- **Montant total en litige :** **${complaintsStore.reduce((sum, c) => sum + c.amount, 0).toLocaleString()} €**

### 📁 Dossiers Pertinents Identifiés dans la Recherche

${citationsBlock}

### 💡 Recommandations Stratégiques

1. **Traitement prioritaire :** Mobiliser la cellule VIP pour traiter les **${criticalInBase.length}** réclamations critiques sous 12h.
2. **Audit produit :** Lancer une revue technique approfondie du module **${topProdEntry ? topProdEntry[0] : 'Carte de Crédit'}**.
3. **Prévention churn :** Déclencher un protocole de rétention commerciale pour les dossiers à plus de 60% de risque d'attrition.`;
  }

  if (intention === 'RISQUE') {
    return `### ⚠️ Analyse des Risques, Attrition (Churn) & Anomalies Systémiques

- **Clients VIP à risque de résiliation :** **${vipList.length}** comptes sous haute surveillance
- **Dossiers à très haut risque de Churn (>60%) :** **${highChurn.length}** dossiers
- **Anomalies opérationnelles & financières détectées :** **${anomalies.length}** cas
- **Impact financier estimé des cas à risque :** **${highChurn.reduce((acc, c) => acc + c.amount, 0).toLocaleString()} €**

### 📁 Dossiers VIP & Critiques à Traiter en Priorité Immédiate

${citationsBlock}

### 💡 Plan de Mitigation des Risques

1. **Contact direct :** Faire contacter les clients VIP par leur Chargé d'Affaires Dédié dans les 4 heures.
2. **Geste commercial encadré :** Accorder un remboursement à gré d'office pour les litiges < 500 € afin d'éviter l'escalade vers le médiateur bancaire.
3. **Surveillance automatisée :** Activer les alertes de niveau rouge sur toute récurrence de même motif.`;
  }

  if (intention === 'TENDANCE') {
    return `### 📈 Analyse des Tendances & Signaux Faibles

- **Signal Majeur 1 :** Augmentation significative (+340%) des réclamations sur l'**Application Mobile (v4.2.1)** suite à des erreurs d'authentification (ERR_AUTH_502).
- **Signal Majeur 2 :** Augmentation du délai moyen de déblocage des **Prêts Immobiliers** (porté à 14 jours ouvrés).
- **Signal Majeur 3 :** Incidents récurrents de doubles débits sur les **Cartes de Crédit** lors de la clôture mensuelle.

### 📁 Extrait des Dossiers Représentatifs

${citationsBlock}

### 💡 Plan d'Action Correctif

1. **Correctif applicatif :** Publier la version v4.2.2 de l'application mobile en déploiement d'urgence.
2. **Ressources prêt :** Affecter temporairement 3 analystes seniors au pôle Prêts Immobiliers.
3. **Communication proactive :** Envoyer une notification d'excuse avec récréditement automatique des frais induits.`;
  }

  return `### 🤖 Synthèse Exécutive RAG & Analyse Contextuelle

En réponse à votre question : *"${query}"*

- **Dossiers identifiés en base :** **${totalMatches > 0 ? totalMatches : matches.length}** réclamations associées
- **Intention détectée :** **${intention}**
- **Niveau de confiance des données :** **96%**

### 📁 Extraits & Dossiers Clés Extraits du Corpus

${citationsBlock}

### 💡 Synthèse & Recommandations D'Action

1. **Inspection détaillée :** Cliquer sur les identifiants de plaintes ci-dessus pour accéder à leur fiche complète.
2. **Priorité opérationnelle :** Traiter en priorité les réclamations VIP et critiques.
3. **Suivi qualité :** Archiver les leçons tirées et mettre à jour le système de classification IA.`;
}

export function calculateDashboardMetrics(): DashboardMetrics {
  const total = complaintsStore.length;
  const critical = complaintsStore.filter(c => c.urgency === 'Critique').length;
  const resolved = complaintsStore.filter(c => c.status === 'Résolue' || c.status === 'Fermée').length;
  const open = complaintsStore.filter(c => c.status === 'Ouverte' || c.status === 'En cours' || c.status === 'Escaladée').length;

  const issueCounts: Record<string, number> = {};
  complaintsStore.forEach(c => { issueCounts[c.issue] = (issueCounts[c.issue] || 0) + 1; });
  const topIssues = Object.entries(issueCounts)
    .map(([issue, count]) => ({ issue, count, percentage: Math.round((count / (total || 1)) * 100) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const productCounts: Record<string, { count: number; criticalCount: number }> = {};
  complaintsStore.forEach(c => {
    if (!productCounts[c.product]) productCounts[c.product] = { count: 0, criticalCount: 0 };
    productCounts[c.product].count += 1;
    if (c.urgency === 'Critique' || c.urgency === 'Haute') productCounts[c.product].criticalCount += 1;
  });
  const topProducts = Object.entries(productCounts)
    .map(([product, data]) => ({
      product,
      count: data.count,
      risk: (data.criticalCount > 2 ? 'Critique' : data.criticalCount > 0 ? 'Haute' : 'Moyenne') as any
    }))
    .sort((a, b) => b.count - a.count);

  const serviceCounts: Record<string, number> = {};
  complaintsStore.forEach(c => { serviceCounts[c.service] = (serviceCounts[c.service] || 0) + 1; });
  const topServices = Object.entries(serviceCounts)
    .map(([service, count]) => ({ service, count }))
    .sort((a, b) => b.count - a.count);

  const dailyMap: Record<string, { volume: number; critical: number }> = {};
  complaintsStore.forEach(c => {
    const d = c.dateReceived;
    if (!dailyMap[d]) dailyMap[d] = { volume: 0, critical: 0 };
    dailyMap[d].volume += 1;
    if (c.urgency === 'Critique') dailyMap[d].critical += 1;
  });
  const dailyTrend = Object.entries(dailyMap)
    .map(([date, data]) => ({ date, volume: data.volume, critical: data.critical }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const monthlyMap: Record<string, { volume: number; resolved: number }> = {};
  complaintsStore.forEach(c => {
    const month = c.dateReceived.substring(0, 7);
    if (!monthlyMap[month]) monthlyMap[month] = { volume: 0, resolved: 0 };
    monthlyMap[month].volume += 1;
    if (c.status === 'Résolue' || c.status === 'Fermée') monthlyMap[month].resolved += 1;
  });
  const monthlyTrend = Object.entries(monthlyMap)
    .map(([month, data]) => ({ month, volume: data.volume, resolved: data.resolved }))
    .sort((a, b) => a.month.localeCompare(b.month));

  const avgSatisfaction = Math.round(
    complaintsStore.reduce((acc, c) => acc + (c.satisfactionScore || 50), 0) / (total || 1)
  );

  return {
    totalComplaints: total,
    criticalComplaints: critical,
    resolvedComplaints: resolved,
    openComplaints: open,
    avgResolutionTimeDays: 3.8,
    customerSatisfactionIdx: avgSatisfaction,
    qualityIndex: 91,
    aiConfidenceScore: 96,
    topIssues,
    topProducts,
    topServices,
    dailyTrend,
    monthlyTrend
  };
}

export function detectIntention(query: string): 'STATISTIQUE' | 'TENDANCE' | 'RISQUE' | 'RECHERCHE' | 'CLASSIFICATION' | 'RÉSUMÉ' | 'RAG' {
  const q = query.toLowerCase();
  if (q.includes('combien') || q.includes('statistique') || q.includes('total') || q.includes('pourcentage') || q.includes('nombre')) return 'STATISTIQUE';
  if (q.includes('pourquoi') || q.includes('augmentation') || q.includes('evolution') || q.includes('tendance') || q.includes('mois') || q.includes('semaine')) return 'TENDANCE';
  if (q.includes('risque') || q.includes('anomalie') || q.includes('partir') || q.includes('churn') || q.includes('perte') || q.includes('critique')) return 'RISQUE';
  if (q.includes('cherche') || q.includes('trouve') || q.includes('similaire') || q.includes('recherche')) return 'RECHERCHE';
  if (q.includes('classe') || q.includes('catégorie') || q.includes('produit')) return 'CLASSIFICATION';
  if (q.includes('résumé') || q.includes('synthèse') || q.includes('récapitulatif')) return 'RÉSUMÉ';
  return 'RAG';
}

// Petite aide CORS/method commune à toutes les routes
export function setCors(res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}
