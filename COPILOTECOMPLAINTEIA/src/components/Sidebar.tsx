import React from 'react';
import { useLanguage } from '../i18n/translations';
import {
  LayoutDashboard,
  Bot,
  FileText,
  UploadCloud,
  Search,
  TrendingUp,
  AlertTriangle,
  BellRing,
  Lightbulb,
  FileSpreadsheet,
  ShieldCheck,
  ChevronRight,
  X
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'copilot'
  | 'complaints'
  | 'import'
  | 'search'
  | 'trends'
  | 'anomalies'
  | 'alerts'
  | 'recommendations'
  | 'reports'
  | 'audit';

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  activeAlertsCount: number;
  anomaliesCount: number;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  activeAlertsCount,
  anomaliesCount,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const { t } = useLanguage();

  const menuSections = [
    {
      title: t('groupOverview'),
      items: [
        { id: 'dashboard', label: t('navDashboard'), icon: LayoutDashboard },
        { id: 'copilot', label: t('navCopilot'), icon: Bot, badge: 'IA Pro' },
        { id: 'complaints', label: t('navComplaints'), icon: FileText },
        { id: 'import', label: t('navImport'), icon: UploadCloud },
        { id: 'search', label: t('searchButton'), icon: Search },
      ],
    },
    {
      title: t('groupIntelligence'),
      items: [
        { id: 'trends', label: t('navTrends'), icon: TrendingUp },
        { id: 'anomalies', label: t('navAnomalies'), icon: AlertTriangle, count: anomaliesCount, badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300' },
        { id: 'alerts', label: t('navAlerts'), icon: BellRing, count: activeAlertsCount, badgeColor: 'bg-orange-500 text-white' },
        { id: 'recommendations', label: t('navRecommendations'), icon: Lightbulb },
      ],
    },
    {
      title: t('groupGovernance'),
      items: [
        { id: 'reports', label: t('navReports'), icon: FileSpreadsheet },
        { id: 'audit', label: t('navAudit'), icon: ShieldCheck },
      ],
    },
  ];

  const handleSelectTab = (tab: NavTab) => {
    onTabChange(tab);
    if (onCloseMobile) onCloseMobile();
  };

  const navContent = (
    <div className="flex flex-col justify-between h-full py-4 px-3 space-y-6 overflow-y-auto">
      <div className="space-y-6">
        {/* Mobile Header Title */}
        {onCloseMobile && (
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 lg:hidden">
            <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Navigation</span>
            <button
              onClick={onCloseMobile}
              className="p-1 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {menuSections.map((section, idx) => (
          <div key={idx}>
            <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              {section.title}
            </p>
            <nav className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id as NavTab)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-blue-900 text-white font-semibold shadow-md shadow-blue-950/20'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-orange-400' : 'text-slate-500 dark:text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.badge && (
                        <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/30">
                          {item.badge}
                        </span>
                      )}
                      {item.count !== undefined && item.count > 0 && (
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${item.badgeColor || 'bg-blue-600 text-white'}`}>
                          {item.count}
                        </span>
                      )}
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-orange-400" />}
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Footer info box */}
      <div className="p-3 rounded-xl bg-gradient-to-br from-blue-900/10 to-indigo-900/10 border border-blue-200/50 dark:border-blue-800/30 shrink-0">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Moteur RAG & Gemini</p>
        </div>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
          CFTB Consumer Complaints API connected. Processing NLP supervised & clustering.
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (hidden on mobile, visible on lg+) */}
      <aside className="hidden lg:flex w-64 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex-col min-h-[calc(100vh-4rem)]">
        {navContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={onCloseMobile}
          />
          
          {/* Slide-over panel */}
          <aside className="relative w-72 max-w-[85vw] bg-white dark:bg-slate-900 h-full shadow-2xl z-10 flex flex-col animate-in slide-in-from-left duration-200">
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
};

