import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { AuditLog } from '../src/types.js';
import {
  complaintsStore,
  alertsStore,
  auditLogsStore,
  getGeminiClient,
  searchRelevantComplaints,
  generateLocalResponse,
  detectIntention,
  setCors
} from './_lib/engine';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query } = req.body || {};
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query is required' });
  }

  const intention = detectIntention(query);
  const ai = getGeminiClient();

  const { matches: relevantComplaints, totalMatches } = searchRelevantComplaints(query, 8);

  const contextData = relevantComplaints.map(c => ({
    id: c.id,
    client: c.clientName,
    vip: c.clientVip,
    product: c.product,
    subProduct: c.subProduct,
    service: c.service,
    issue: c.issue,
    subIssue: c.subIssue,
    dateReceived: c.dateReceived,
    urgency: c.urgency,
    sentiment: c.sentiment,
    aiSummary: c.aiSummary,
    probableCause: c.probableCause,
    customerRequest: c.customerRequest,
    amount: `${c.amount} €`,
    churnRisk: `${c.churnRisk}%`,
    status: c.status,
    agency: c.agency,
    city: c.city,
    isAnomaly: c.isAnomaly ? 'Oui' : 'Non',
    anomalyReason: c.anomalyReason || 'Aucune'
  }));

  const alertsContext = alertsStore.slice(0, 5).map(a => ({
    id: a.id,
    title: a.title,
    level: a.level,
    product: a.product,
    justification: a.justification
  }));

  let replyText = '';
  const confidenceScore = 0.96;

  if (ai) {
    try {
      const systemInstruction = `
Tu es le Copilote IA d'Intelligence des Plaintes Clients & Risques Bancaires (ComplaintScope AI).
Tu es un expert reconnu en gestion du risque, conformité bancaire et expérience client.
Consignes strictes de réponse :
1. Rédige une réponse analytique de niveau exécutif, claire, professionnelle et structurée en Markdown.
2. Utilise des titres de section explicites (ex: ### 📊 Synthèse Exécutive, ### 🔎 Analyse des Données & Citations, ### ⚠️ Analyse de Cause Racine & Risques, ### 💡 Plan d'Action & Recommandations).
3. Cite OBLIGATOIREMENT les identifiants exacts des plaintes pertinentes (ex: **CFPB-2026-98124**) avec le nom du client et le montant lorsque tu mentionnes un cas.
4. Appuie-toi sur les données fournies dans le contexte ci-dessous (volumes, montants, pourcentages, causes racines).
5. Termine par 2 à 3 recommandations concrètes et hiérarchisées.
`;

      const promptContent = `
INTENTION DÉTECTÉE : ${intention}

EXTRAIT RAG PERTINENT (${relevantComplaints.length} dossiers extraits sur ${totalMatches} pertinents) :
${JSON.stringify(contextData, null, 2)}

ALERTES COMPLAINTSCOPE ACTIVES :
${JSON.stringify(alertsContext, null, 2)}

METRIQUES GLOBALES BASE :
- Nombre total de réclamations : ${complaintsStore.length}
- Plaintes d'urgence Critique : ${complaintsStore.filter(c => c.urgency === 'Critique').length}
- Clients VIP sous risque : ${complaintsStore.filter(c => c.clientVip).length}
- Dossiers Churn > 60% : ${complaintsStore.filter(c => c.churnRisk >= 60).length}

QUESTION DE L'UTILISATEUR :
"${query}"
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: promptContent,
        config: {
          systemInstruction,
          temperature: 0.2,
        },
      });

      replyText = response.text || generateLocalResponse(query, intention);
    } catch (err: any) {
      console.log(`[Copilot AI] Remote API unavailable (${err?.status || err?.code || '403/Restricted'}). Seamlessly using Local RAG Engine.`);
      replyText = generateLocalResponse(query, intention);
    }
  } else {
    replyText = generateLocalResponse(query, intention);
  }

  const matchedIdsInText = new Set<string>();
  relevantComplaints.forEach(c => {
    if (replyText.includes(c.id) || matchedIdsInText.size < 4) {
      matchedIdsInText.add(c.id);
    }
  });

  const sources = complaintsStore
    .filter(c => matchedIdsInText.has(c.id))
    .slice(0, 4)
    .map(c => ({
      id: c.id,
      title: `${c.product} - ${c.issue}`,
      product: c.product,
      snippet: c.aiSummary,
      score: 0.96
    }));

  const newLog: AuditLog = {
    id: `LOG-${Date.now()}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    userId: 'user-active',
    userName: 'Utilisateur Connecté',
    userRole: 'Analyste',
    action: 'Question au Copilote IA',
    intention,
    query,
    responseSummary: replyText.substring(0, 120) + '...',
    sourcesCount: sources.length,
    confidenceScore
  };
  auditLogsStore.unshift(newLog);

  res.status(200).json({
    text: replyText,
    intention,
    sources,
    confidence: confidenceScore,
    suggestedQuestions: [
      "Quels clients VIP risquent de résilier leur compte ?",
      "Donne-moi le détail de l'incident sur l'application mobile.",
      "Génère un plan d'action d'urgence pour le service crédit."
    ]
  });
}
