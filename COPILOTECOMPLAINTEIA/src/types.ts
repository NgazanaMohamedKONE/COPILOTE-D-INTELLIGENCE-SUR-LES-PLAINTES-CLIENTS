export type UserRole = 'Administrateur' | 'Manager' | 'Analyste';

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  department: string;
}

export type UrgencyLevel = 'Faible' | 'Moyenne' | 'Haute' | 'Critique';
export type SentimentType = 'Positif' | 'Neutre' | 'Négatif' | 'Très négatif';
export type ComplaintStatus = 'Ouverte' | 'En cours' | 'En revue' | 'Résolue' | 'Escaladée' | 'Fermée';

export interface ExtractedEntities {
  clientName: string;
  clientVip: boolean;
  product: string;
  subProduct?: string;
  service: string;
  date: string;
  amount: number;
  agency: string;
  city: string;
  region: string;
  request: string;
  urgency: UrgencyLevel;
  sentiment: SentimentType;
  category: string;
  probableCause: string;
}

export interface ComplaintRecord {
  id: string;
  clientName: string;
  clientVip: boolean;
  product: string;
  subProduct: string;
  service: string;
  issue: string;
  subIssue: string;
  narrative: string;
  cleanedNarrative: string;
  dateReceived: string; // YYYY-MM-DD
  amount: number;
  agency: string;
  city: string;
  region: string; // State / Region
  zipCode: string;
  status: ComplaintStatus;
  urgency: UrgencyLevel;
  sentiment: SentimentType;
  sentimentScore: number; // -1.0 to 1.0
  satisfactionScore: number; // 0 to 100
  predictedCategory: string;
  categoryConfidence: number; // 0.0 to 1.0
  aiSummary: string;
  probableCause: string;
  customerRequest: string;
  churnRisk: number; // 0 to 100%
  escalationProbability: number; // 0 to 100%
  financialImpact: number; // EUR / USD
  priorityScore: number; // 1 to 100
  isAnomaly: boolean;
  anomalyScore: number; // 0.0 to 1.0
  anomalyReason?: string;
  clusterTopic?: string;
  similarIds?: string[];
  companyResponse?: string;
}

export type AlertLevel = 'Information' | 'Moyen' | 'Élevé' | 'Critique';
export type AlertStatus = 'Active' | 'En cours' | 'Résolue' | 'Ignorée';

export interface SmartAlert {
  id: string;
  title: string;
  level: AlertLevel;
  date: string;
  product: string;
  issue?: string;
  agency?: string;
  justification: string;
  aiExplanation?: string;
  relatedComplaintIds: string[];
  status: AlertStatus;
  metricsSummary?: string;
}

export interface Recommendation {
  id: string;
  category: string;
  title: string;
  description: string;
  priority: 'Haute' | 'Moyenne' | 'Faible';
  targetDepartment: string;
  estimatedImpact: string;
  actionSteps: string[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  intention?: 'STATISTIQUE' | 'TENDANCE' | 'RISQUE' | 'RECHERCHE' | 'CLASSIFICATION' | 'RÉSUMÉ' | 'RAG';
  query?: string;
  responseSummary?: string;
  sourcesCount?: number;
  confidenceScore?: number;
}

export interface DataQualityReport {
  totalRows: number;
  validRows: number;
  duplicateCount: number;
  missingFieldsCount: number;
  qualityScore: number; // 0 to 100
  detectedLanguages: Record<string, number>;
  validationErrors: string[];
}

export interface DashboardMetrics {
  totalComplaints: number;
  criticalComplaints: number;
  resolvedComplaints: number;
  openComplaints: number;
  avgResolutionTimeDays: number;
  customerSatisfactionIdx: number; // 0-100
  qualityIndex: number; // 0-100
  aiConfidenceScore: number; // 0-100
  topIssues: { issue: string; count: number; percentage: number }[];
  topProducts: { product: string; count: number; risk: UrgencyLevel }[];
  topServices: { service: string; count: number }[];
  dailyTrend: { date: string; volume: number; critical: number }[];
  monthlyTrend: { month: string; volume: number; resolved: number }[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  intention?: 'STATISTIQUE' | 'TENDANCE' | 'RISQUE' | 'RECHERCHE' | 'CLASSIFICATION' | 'RÉSUMÉ' | 'RAG';
  sources?: { id: string; title: string; product: string; snippet: string; score?: number }[];
  recommendations?: string[];
  confidence?: number;
}
