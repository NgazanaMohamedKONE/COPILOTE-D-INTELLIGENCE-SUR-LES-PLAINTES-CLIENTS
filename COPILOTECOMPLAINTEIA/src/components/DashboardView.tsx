import React, { useState } from 'react';
import { DashboardMetrics, ComplaintRecord, SmartAlert } from '../types';
import { BrandLogo } from './BrandLogo';
import { useLanguage } from '../i18n/translations';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  TrendingUp,
  TrendingDown,
  Award,
  ShieldAlert,
  Sparkles,
  ArrowUpRight,
  ChevronRight,
  PieChart as PieIcon,
  BarChart2,
  FileSpreadsheet,
  Search,
  Filter,
  MapPin,
  Building2,
  Users,
  DollarSign,
  Activity,
  Zap,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

interface DashboardViewProps {
  metrics: DashboardMetrics;
  complaints: ComplaintRecord[];
  alerts: SmartAlert[];
  onSelectComplaint: (id: string) => void;
  onNavigateToCopilot: () => void;
  onNavigateToAlerts: () => void;
  onNavigateToReports: () => void;
}

const COLORS = ['#0020A6', '#FF5500', '#2563EB', '#10B981', '#6366F1', '#EC4899', '#8B5CF6'];

export const DashboardView: React.FC<DashboardViewProps> = ({
  metrics,
  complaints,
  alerts,
  onSelectComplaint,
  onNavigateToCopilot,
  onNavigateToAlerts,
  onNavigateToReports,
}) => {
  const { t } = useLanguage();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [trendViewMode, setTrendViewMode] = useState<'daily' | 'monthly'>('daily');
  const [tableFilter, setTableFilter] = useState<'all' | 'critical' | 'vip' | 'churn' | 'anomaly'>('all');
  const [tableSearch, setTableSearch] = useState('');

  // Calculate high churn risk & total financial impact
  const totalFinancialExposure = complaints.reduce((sum, c) => sum + (c.financialImpact || c.amount || 0), 0);
  const vipComplaintsCount = complaints.filter(c => c.clientVip).length;
  const highChurnCount = complaints.filter(c => c.churnRisk >= 60).length;
  const anomaliesCount = complaints.filter(c => c.isAnomaly).length;

  // Regional breakdown for regional risk distribution card
  const regionalData = React.useMemo(() => {
    const counts: Record<string, number> = {};
    complaints.forEach(c => {
      const reg = c.region || 'Île-de-France';
      counts[reg] = (counts[reg] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([region, count]) => ({ region, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [complaints]);

  // Filter complaints for the priority table
  const filteredComplaints = complaints.filter(c => {
    // Search match
    const searchMatch = tableSearch === '' || 
      c.id.toLowerCase().includes(tableSearch.toLowerCase()) ||
      c.clientName.toLowerCase().includes(tableSearch.toLowerCase()) ||
      c.product.toLowerCase().includes(tableSearch.toLowerCase()) ||
      c.issue.toLowerCase().includes(tableSearch.toLowerCase());

    if (!searchMatch) return false;

    if (tableFilter === 'critical') return c.urgency === 'Critique';
    if (tableFilter === 'vip') return c.clientVip;
    if (tableFilter === 'churn') return c.churnRisk >= 60;
    if (tableFilter === 'anomaly') return c.isAnomaly;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Executive Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 p-6 text-white shadow-xl border border-blue-900/40">
        {/* Background Decorative Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <div className="px-3 py-1 rounded-full text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center gap-1.5 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-orange-400 animate-pulse" /> {t('copilotFullBadge')}
              </div>
              <span className="text-xs text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700/50 flex items-center gap-1.5">
                <Activity className="w-3 h-3 text-emerald-400" /> {t('fluxTime')}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <BrandLogo size="md" variant="icon" />
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {t('dashboardTitle')}
              </h1>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              {t('dashboardSubtitle')}
            </p>
          </div>

          {/* Action Buttons & Time Range Selector */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {/* Time Range Selector */}
            <div className="flex items-center p-1 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-inner text-xs font-semibold">
              <button
                onClick={() => setTimeRange('7d')}
                className={`px-3 py-1.5 rounded-lg transition ${timeRange === '7d' ? 'bg-blue-600 text-white font-bold shadow-xs' : 'text-slate-400 hover:text-white'}`}
              >
                {t('time7d')}
              </button>
              <button
                onClick={() => setTimeRange('30d')}
                className={`px-3 py-1.5 rounded-lg transition ${timeRange === '30d' ? 'bg-blue-600 text-white font-bold shadow-xs' : 'text-slate-400 hover:text-white'}`}
              >
                {t('time30d')}
              </button>
              <button
                onClick={() => setTimeRange('90d')}
                className={`px-3 py-1.5 rounded-lg transition ${timeRange === '90d' ? 'bg-blue-600 text-white font-bold shadow-xs' : 'text-slate-400 hover:text-white'}`}
              >
                {t('time90d')}
              </button>
            </div>

            <button
              onClick={onNavigateToCopilot}
              className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-orange-600/30"
            >
              <Sparkles className="w-4 h-4" /> {t('interrogateCopilot')}
            </button>
            <button
              onClick={onNavigateToReports}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition flex items-center justify-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> {t('exportPdfCsv')}
            </button>
          </div>
        </div>

        {/* Live AI Flash Insight Ticker */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-2 bg-blue-950/60 p-2.5 rounded-xl border border-blue-800/40">
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-slate-300">
              Signal fort : <strong className="text-white">+340%</strong> de plaintes sur l'App Mobile (v4.2.1)
            </span>
          </div>
          <div className="flex items-center gap-2 bg-red-950/40 p-2.5 rounded-xl border border-red-900/40">
            <Users className="w-4 h-4 text-red-400 shrink-0" />
            <span className="text-slate-300">
              Risque Churn VIP : <strong className="text-red-400">{vipComplaintsCount} clients VIP</strong> nécessitent un rappel sous 24h
            </span>
          </div>
          <div className="flex items-center gap-2 bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-900/40">
            <DollarSign className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-slate-300">
              Exposition Financière : <strong className="text-emerald-400">{totalFinancialExposure.toLocaleString()} €</strong> à arbitrer
            </span>
          </div>
        </div>
      </div>

      {/* Top 8 Key Metrics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        
        {/* Total Complaints */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-400 transition">
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">{t('kpiTotalComplaints')}</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{metrics.totalComplaints}</p>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
            <TrendingUp className="w-3 h-3" /> +4.2%
          </span>
        </div>

        {/* Critical Complaints */}
        <div className="p-3.5 rounded-xl bg-red-50/60 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 shadow-xs hover:border-red-400 transition">
          <p className="text-[11px] font-semibold text-red-600 dark:text-red-400 flex items-center justify-between">
            {t('kpiCritical')} <AlertCircle className="w-3.5 h-3.5 text-red-500" />
          </p>
          <p className="text-2xl font-black text-red-600 dark:text-red-400 mt-1">{metrics.criticalComplaints}</p>
          <span className="text-[10px] text-red-500 font-bold mt-1 block">{t('urgencyUnder24h')}</span>
        </div>

        {/* Resolved Complaints */}
        <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 shadow-xs hover:border-emerald-400 transition">
          <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
            {t('kpiResolved')} <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          </p>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{metrics.resolvedComplaints}</p>
          <span className="text-[10px] text-emerald-600 font-bold mt-1 block">{t('rate85')}</span>
        </div>

        {/* Open Complaints */}
        <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 shadow-xs hover:border-blue-400 transition">
          <p className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">{t('kpiInFollowup')}</p>
          <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">{metrics.openComplaints}</p>
          <span className="text-[10px] text-blue-500 font-bold mt-1 block">{t('activeFollowup')}</span>
        </div>

        {/* High Churn Risk Count */}
        <div className="p-3.5 rounded-xl bg-orange-50/60 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/40 shadow-xs hover:border-orange-400 transition">
          <p className="text-[11px] font-semibold text-orange-600 dark:text-orange-400 flex items-center justify-between">
            {t('kpiChurnRisk')} <TrendingDown className="w-3.5 h-3.5 text-orange-500" />
          </p>
          <p className="text-2xl font-black text-orange-600 dark:text-orange-400 mt-1">{highChurnCount}</p>
          <span className="text-[10px] text-orange-600 font-bold mt-1 block">{t('scoresOver60')}</span>
        </div>

        {/* Average Processing Time */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-400 transition">
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-between">
            {t('kpiAvgDelay')} <Clock className="w-3.5 h-3.5 text-amber-500" />
          </p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{metrics.avgResolutionTimeDays} <span className="text-xs font-medium">{t('daysUnit')}</span></p>
          <span className="text-[10px] text-emerald-600 font-bold mt-1 block">-0.8j</span>
        </div>

        {/* Satisfaction Score */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-orange-400 transition">
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-between">
            {t('kpiSatisfaction')} <Award className="w-3.5 h-3.5 text-orange-500" />
          </p>
          <p className="text-2xl font-black text-orange-600 dark:text-orange-400 mt-1">{metrics.customerSatisfactionIdx}<span className="text-xs font-medium">/100</span></p>
          <span className="text-[10px] text-slate-500 mt-1 block">{t('qualityIndex')}</span>
        </div>

        {/* AI Confidence Score */}
        <div className="p-3.5 rounded-xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40 shadow-xs hover:border-purple-400 transition">
          <p className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 flex items-center justify-between">
            {t('kpiAiPrecision')} <Sparkles className="w-3.5 h-3.5 text-purple-500" />
          </p>
          <p className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">{metrics.aiConfidenceScore}%</p>
          <span className="text-[10px] text-purple-500 font-bold mt-1 block">{t('geminiModel')}</span>
        </div>

      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Daily / Monthly Volume & Critical Trends (Area / Line Chart) */}
        <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                {t('chronologicalEvolution')}
                <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-semibold border border-blue-200 dark:border-blue-800">
                  {trendViewMode === 'daily' ? t('dailyView') : t('monthlyView')}
                </span>
              </h3>
              <p className="text-xs text-slate-500">{t('volumeSupervision')}</p>
            </div>

            {/* Toggle Daily vs Monthly */}
            <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold self-start sm:self-auto">
              <button
                onClick={() => setTrendViewMode('daily')}
                className={`px-3 py-1 rounded-lg transition ${trendViewMode === 'daily' ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 font-bold shadow-xs' : 'text-slate-500'}`}
              >
                {t('byDay')}
              </button>
              <button
                onClick={() => setTrendViewMode('monthly')}
                className={`px-3 py-1 rounded-lg transition ${trendViewMode === 'monthly' ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 font-bold shadow-xs' : 'text-slate-500'}`}
              >
                {t('byMonth')}
              </button>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {trendViewMode === 'daily' ? (
                <AreaChart data={metrics.dailyTrend}>
                  <defs>
                    <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0020A6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0020A6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorCritical" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      color: '#FFF',
                      fontSize: '12px'
                    }}
                  />
                  <Area type="monotone" dataKey="volume" name="Volume Total" stroke="#0020A6" fillOpacity={1} fill="url(#colorVolume)" strokeWidth={2.5} />
                  <Area type="monotone" dataKey="critical" name="Critiques" stroke="#EF4444" fillOpacity={1} fill="url(#colorCritical)" strokeWidth={2.5} />
                </AreaChart>
              ) : (
                <BarChart data={metrics.monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      color: '#FFF',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="volume" name="Plaintes Reçues" fill="#0020A6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="resolved" name="Plaintes Résolues" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Product Breakdown (Pie / Donut Chart) */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Distribution par Produit</h3>
              <PieIcon className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-xs text-slate-500 mb-2">Part des irritants par gamme bancaire</p>

            <div className="h-44 w-full flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={metrics.topProducts}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={72}
                    paddingAngle={3}
                    dataKey="count"
                    nameKey="product"
                  >
                    {metrics.topProducts.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderRadius: '0.5rem',
                      color: '#FFF',
                      fontSize: '11px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Donut Center Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-black text-slate-900 dark:text-white">{metrics.totalComplaints}</span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Total</span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5 mt-2">
            {metrics.topProducts.slice(0, 4).map((p, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                  <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[130px]">{p.product}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white">{p.count}</span>
                  <span className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold ${
                    p.risk === 'Critique' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}>
                    {p.risk}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Second Row: Top Issues & Regional Risk Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Top 10 Issues Bar Chart */}
        <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Top 10 des Motifs de Plaintes Recurrentes</h3>
              <p className="text-xs text-slate-500">Classification automatique par traitement du langage naturel (NLP)</p>
            </div>
            <BarChart2 className="w-4 h-4 text-orange-500" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={metrics.topIssues} margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" opacity={0.2} />
                <XAxis type="number" stroke="#94A3B8" fontSize={11} />
                <YAxis dataKey="issue" type="category" stroke="#94A3B8" fontSize={11} width={110} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '0.5rem',
                    color: '#FFF',
                    fontSize: '11px'
                  }}
                />
                <Bar dataKey="count" name="Plaintes" fill="#FF5500" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Regional Distribution & Smart Alerts Widget */}
        <div className="space-y-6">
          
          {/* Active Smart Alerts Box */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-orange-500 animate-pulse" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Alertes Système</h3>
              </div>
              <button
                onClick={onNavigateToAlerts}
                className="text-xs text-blue-600 hover:underline font-semibold flex items-center gap-0.5"
              >
                Voir tout ({alerts.length}) <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {alerts.slice(0, 2).map((alert) => (
                <div
                  key={alert.id}
                  onClick={onNavigateToAlerts}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 hover:border-orange-500/50 cursor-pointer transition"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      alert.level === 'Critique'
                        ? 'bg-red-500 text-white'
                        : alert.level === 'Élevé'
                        ? 'bg-orange-500 text-white'
                        : 'bg-blue-500 text-white'
                    }`}>
                      {alert.level}
                    </span>
                    <span className="text-[10px] text-slate-400">{alert.date}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 line-clamp-1">
                    {alert.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                    {alert.justification}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Regional Risk Distribution Card */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">{t('regionalZones')}</h3>
              </div>
            </div>
            
            <div className="space-y-2">
              {regionalData.map((item, idx) => {
                const percentage = Math.round((item.count / (complaints.length || 1)) * 100);
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
                      <span>{item.region}</span>
                      <span className="font-bold text-slate-900 dark:text-white">{item.count} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, percentage * 2.5)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* Critical Complaint Recent Table Preview */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              {t('priorityCases')}
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                {filteredComplaints.length}
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              {t('prioritySubtitle')}
            </p>
          </div>

          {/* Table Search & Category Filter Tabs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                placeholder={t('searchTablePlaceholder')}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-48"
              />
            </div>

            <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold overflow-x-auto">
              <button
                onClick={() => setTableFilter('all')}
                className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition ${tableFilter === 'all' ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 font-bold shadow-xs' : 'text-slate-500'}`}
              >
                {t('filterAll')}
              </button>
              <button
                onClick={() => setTableFilter('critical')}
                className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition ${tableFilter === 'critical' ? 'bg-red-500 text-white font-bold shadow-xs' : 'text-slate-500'}`}
              >
                {t('filterCritical')}
              </button>
              <button
                onClick={() => setTableFilter('vip')}
                className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition ${tableFilter === 'vip' ? 'bg-amber-500 text-white font-bold shadow-xs' : 'text-slate-500'}`}
              >
                {t('filterVip')} ({vipComplaintsCount})
              </button>
              <button
                onClick={() => setTableFilter('churn')}
                className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition ${tableFilter === 'churn' ? 'bg-orange-500 text-white font-bold shadow-xs' : 'text-slate-500'}`}
              >
                {t('filterChurn')}
              </button>
              <button
                onClick={() => setTableFilter('anomaly')}
                className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition ${tableFilter === 'anomaly' ? 'bg-purple-600 text-white font-bold shadow-xs' : 'text-slate-500'}`}
              >
                {t('filterAnomalies')}
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-2.5 px-3">{t('thComplaintId')}</th>
                <th className="py-2.5 px-3">{t('thClient')}</th>
                <th className="py-2.5 px-3">{t('thProductMotif')}</th>
                <th className="py-2.5 px-3">{t('thUrgency')}</th>
                <th className="py-2.5 px-3">{t('thChurnRisk')}</th>
                <th className="py-2.5 px-3">{t('thFinancialImpact')}</th>
                <th className="py-2.5 px-3">{t('thStatus')}</th>
                <th className="py-2.5 px-3 text-right">{t('thAction')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredComplaints.slice(0, 7).map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition group">
                  <td className="py-3 px-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                    {c.id}
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                    <div className="flex items-center gap-1.5">
                      <span>{c.clientName}</span>
                      {c.clientVip && (
                        <span className="px-1.5 py-0.2 text-[9px] font-extrabold rounded bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300">
                          VIP
                        </span>
                      )}
                      {c.isAnomaly && (
                        <span className="px-1.5 py-0.2 text-[9px] font-extrabold rounded bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300">
                          Anomalie
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-medium text-slate-800 dark:text-slate-200">{c.product}</div>
                    <div className="text-[11px] text-slate-400 truncate max-w-[200px]">{c.issue}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      c.urgency === 'Critique'
                        ? 'bg-red-100 text-red-700 dark:bg-red-950/80 dark:text-red-300'
                        : c.urgency === 'Haute'
                        ? 'bg-orange-100 text-orange-700 dark:bg-orange-950/80 dark:text-orange-300'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300'
                    }`}>
                      {c.urgency}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-bold">
                    <span className={c.churnRisk >= 60 ? 'text-red-600 dark:text-red-400 font-black' : 'text-slate-700 dark:text-slate-300'}>
                      {c.churnRisk}%
                    </span>
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                    {c.amount > 0 ? `${c.amount.toLocaleString()} €` : '-'}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onSelectComplaint(c.id)}
                      className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300 font-semibold hover:bg-blue-600 hover:text-white transition flex items-center gap-1 ml-auto"
                    >
                      Analyser <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredComplaints.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Aucun dossier ne correspond aux critères de filtre.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

