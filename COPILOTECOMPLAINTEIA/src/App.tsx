import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './i18n/translations';
import { UserProfile, ComplaintRecord, SmartAlert, Recommendation, AuditLog, DashboardMetrics } from './types';
import { INITIAL_USERS, MOCK_COMPLAINTS, MOCK_ALERTS, MOCK_RECOMMENDATIONS, MOCK_AUDIT_LOGS } from './data/mockComplaints';
import { Navbar } from './components/Navbar';
import { Sidebar, NavTab } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { CopilotChatView } from './components/CopilotChatView';
import { ComplaintsListView } from './components/ComplaintsListView';
import { ComplaintDetailView } from './components/ComplaintDetailView';
import { DataImportView } from './components/DataImportView';
import { SemanticSearchView } from './components/SemanticSearchView';
import { TrendsAnalyticsView } from './components/TrendsAnalyticsView';
import { AnomalyDetectionView } from './components/AnomalyDetectionView';
import { AlertsView } from './components/AlertsView';
import { RecommendationsView } from './components/RecommendationsView';
import { ReportsView } from './components/ReportsView';
import { AuditLogsView } from './components/AuditLogsView';
import { LoginView } from './components/LoginView';

function MainAppContent() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(INITIAL_USERS[0]);
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Data state

  const [complaints, setComplaints] = useState<ComplaintRecord[]>(MOCK_COMPLAINTS);
  const [alerts, setAlerts] = useState<SmartAlert[]>(MOCK_ALERTS);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(MOCK_RECOMMENDATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(MOCK_AUDIT_LOGS);
  
  // Selected complaint for deep dive view
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);

  // Quick search modal state
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Sync dark mode class on <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Fetch server data on mount
  useEffect(() => {
    fetch('/api/complaints')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data) {
          setComplaints(data.data);
        }
      })
      .catch((err) => console.log('Using local memory complaints store'));
  }, []);

  // Compute metrics dynamically from current state
  const computeMetrics = (): DashboardMetrics => {
    const total = complaints.length;
    const critical = complaints.filter((c) => c.urgency === 'Critique').length;
    const resolved = complaints.filter((c) => c.status === 'Résolue' || c.status === 'Fermée').length;
    const open = complaints.filter((c) => c.status === 'Ouverte' || c.status === 'En cours' || c.status === 'Escaladée').length;

    const issueCounts: Record<string, number> = {};
    complaints.forEach((c) => {
      issueCounts[c.issue] = (issueCounts[c.issue] || 0) + 1;
    });
    const topIssues = Object.entries(issueCounts)
      .map(([issue, count]) => ({
        issue,
        count,
        percentage: Math.round((count / (total || 1)) * 100)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const productCounts: Record<string, { count: number; criticalCount: number }> = {};
    complaints.forEach((c) => {
      if (!productCounts[c.product]) {
        productCounts[c.product] = { count: 0, criticalCount: 0 };
      }
      productCounts[c.product].count += 1;
      if (c.urgency === 'Critique' || c.urgency === 'Haute') {
        productCounts[c.product].criticalCount += 1;
      }
    });
    const topProducts = Object.entries(productCounts)
      .map(([product, data]) => ({
        product,
        count: data.count,
        risk: (data.criticalCount > 2 ? 'Critique' : data.criticalCount > 0 ? 'Haute' : 'Moyenne') as any
      }))
      .sort((a, b) => b.count - a.count);

    const serviceCounts: Record<string, number> = {};
    complaints.forEach((c) => {
      serviceCounts[c.service] = (serviceCounts[c.service] || 0) + 1;
    });
    const topServices = Object.entries(serviceCounts)
      .map(([service, count]) => ({ service, count }))
      .sort((a, b) => b.count - a.count);

    const dailyMap: Record<string, { volume: number; critical: number }> = {};
    complaints.forEach((c) => {
      const d = c.dateReceived;
      if (!dailyMap[d]) dailyMap[d] = { volume: 0, critical: 0 };
      dailyMap[d].volume += 1;
      if (c.urgency === 'Critique') dailyMap[d].critical += 1;
    });
    const dailyTrend = Object.entries(dailyMap)
      .map(([date, data]) => ({ date, volume: data.volume, critical: data.critical }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const monthlyMap: Record<string, { volume: number; resolved: number }> = {};
    complaints.forEach((c) => {
      const month = c.dateReceived.substring(0, 7);
      if (!monthlyMap[month]) monthlyMap[month] = { volume: 0, resolved: 0 };
      monthlyMap[month].volume += 1;
      if (c.status === 'Résolue' || c.status === 'Fermée') monthlyMap[month].resolved += 1;
    });
    const monthlyTrend = Object.entries(monthlyMap)
      .map(([month, data]) => ({ month, volume: data.volume, resolved: data.resolved }))
      .sort((a, b) => a.month.localeCompare(b.month));

    const avgSatisfaction = Math.round(
      complaints.reduce((acc, c) => acc + (c.satisfactionScore || 50), 0) / (total || 1)
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
  };

  const currentMetrics = computeMetrics();

  // Selected complaint object
  const selectedComplaint = complaints.find((c) => c.id === selectedComplaintId);
  const similarComplaints = complaints.filter(
    (c) => selectedComplaint && c.id !== selectedComplaint.id && c.product === selectedComplaint.product
  ).slice(0, 3);

  // Handle complaint selection
  const handleSelectComplaint = (id: string) => {
    setSelectedComplaintId(id);
  };

  // If not logged in, render login page
  if (!currentUser) {
    return <LoginView users={INITIAL_USERS} onLoginSuccess={(u) => setCurrentUser(u)} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors">
      
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        allUsers={INITIAL_USERS}
        onSelectUser={(u) => setCurrentUser(u)}
        onOpenSearch={() => setActiveTab('search')}
        activeAlertsCount={alerts.filter((a) => a.status === 'Active').length}
        onNavigateToAlerts={() => {
          setSelectedComplaintId(null);
          setActiveTab('alerts');
        }}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* Main Layout Container */}
      <div className="flex max-w-7xl mx-auto w-full px-3 sm:px-6 py-4 sm:py-6 gap-6">
        
        {/* Lateral Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={(tab) => {
            setSelectedComplaintId(null);
            setActiveTab(tab);
          }}
          activeAlertsCount={alerts.filter((a) => a.status === 'Active').length}
          anomaliesCount={complaints.filter((c) => c.isAnomaly).length}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Workspace Content */}
        <main className="flex-1 min-w-0">
          
          {/* Render Complaint Detail View if a complaint is selected */}
          {selectedComplaintId && selectedComplaint ? (
            <ComplaintDetailView
              complaint={selectedComplaint}
              similarComplaints={similarComplaints}
              onBack={() => setSelectedComplaintId(null)}
              onSelectComplaint={(id) => setSelectedComplaintId(id)}
              onOpenCopilotWithContext={(query) => {
                setSelectedComplaintId(null);
                setActiveTab('copilot');
              }}
            />
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <DashboardView
                  metrics={currentMetrics}
                  complaints={complaints}
                  alerts={alerts}
                  onSelectComplaint={handleSelectComplaint}
                  onNavigateToCopilot={() => setActiveTab('copilot')}
                  onNavigateToAlerts={() => setActiveTab('alerts')}
                  onNavigateToReports={() => setActiveTab('reports')}
                />
              )}

              {activeTab === 'copilot' && (
                <CopilotChatView
                  complaints={complaints}
                  onSelectComplaint={handleSelectComplaint}
                />
              )}

              {activeTab === 'complaints' && (
                <ComplaintsListView
                  complaints={complaints}
                  onSelectComplaint={handleSelectComplaint}
                  onOpenImport={() => setActiveTab('import')}
                />
              )}

              {activeTab === 'import' && (
                <DataImportView
                  onImportCompleted={() => {
                    fetch('/api/complaints')
                      .then((res) => res.json())
                      .then((data) => data?.data && setComplaints(data.data));
                  }}
                />
              )}

              {activeTab === 'search' && (
                <SemanticSearchView
                  complaints={complaints}
                  onSelectComplaint={handleSelectComplaint}
                />
              )}

              {activeTab === 'trends' && (
                <TrendsAnalyticsView
                  metrics={currentMetrics}
                  complaints={complaints}
                />
              )}

              {activeTab === 'anomalies' && (
                <AnomalyDetectionView
                  complaints={complaints}
                  onSelectComplaint={handleSelectComplaint}
                />
              )}

              {activeTab === 'alerts' && (
                <AlertsView
                  alerts={alerts}
                  onSelectComplaint={handleSelectComplaint}
                  onOpenCopilotWithContext={(query) => setActiveTab('copilot')}
                />
              )}

              {activeTab === 'recommendations' && (
                <RecommendationsView recommendations={recommendations} />
              )}

              {activeTab === 'reports' && (
                <ReportsView
                  metrics={currentMetrics}
                  complaints={complaints}
                  alerts={alerts}
                  recommendations={recommendations}
                />
              )}

              {activeTab === 'audit' && (
                <AuditLogsView logs={auditLogs} />
              )}
            </>
          )}

        </main>
      </div>

    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <MainAppContent />
    </LanguageProvider>
  );
}
