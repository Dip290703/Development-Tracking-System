import React, { useState } from 'react';
import { TrackerProvider, useTracker } from './context/TrackerContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { RequirementsView } from './components/RequirementsView';
import { ModulesView } from './components/ModulesView';
import { CustomizationRequestsView } from './components/CustomizationRequestsView';
import { ClientsView } from './components/ClientsView';
import { DevelopersView } from './components/DevelopersView';
import { AuditLogView } from './components/AuditLogView';
import { TraceabilityModal } from './components/TraceabilityModal';
import { ResetModal } from './components/ResetModal';
import { ToastContainer } from './components/ToastContainer';

const MainLayout: React.FC = () => {
  const { activeTab, setActiveTab, loading } = useTracker();
  const [selectedReqForModule, setSelectedReqForModule] = useState<string | undefined>(undefined);

  const handleOpenNewModuleWithReq = (reqId: string) => {
    setSelectedReqForModule(reqId);
    setActiveTab('modules');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'requirements':
        return <RequirementsView onOpenNewModuleWithReq={handleOpenNewModuleWithReq} />;
      case 'modules':
        return <ModulesView initialReqId={selectedReqForModule} />;
      case 'customization-requests':
        return <CustomizationRequestsView />;
      case 'clients':
        return <ClientsView />;
      case 'developers':
        return <DevelopersView />;
      case 'audit-log':
        return <AuditLogView />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-200">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold tracking-wide text-indigo-400">Loading Customization Tracker Store...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans antialiased">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          onOpenNewRequirement={() => setActiveTab('requirements')}
          onOpenNewModule={() => setActiveTab('modules')}
          onOpenNewCR={() => setActiveTab('customization-requests')}
        />

        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
          {renderTabContent()}
        </main>
      </div>

      {/* Traceability Modal */}
      <TraceabilityModal />

      {/* System Reset Modal */}
      <ResetModal />

      {/* Live Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <TrackerProvider>
      <MainLayout />
    </TrackerProvider>
  );
}

export default App;
