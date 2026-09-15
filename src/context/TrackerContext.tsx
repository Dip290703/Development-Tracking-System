import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Developer,
  Client,
  Requirement,
  Module,
  CustomizationRequest,
  AuditLog,
  TabSection,
  FileAttachment
} from '../types';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

interface TrackerContextType {
  activeTab: TabSection;
  setActiveTab: (tab: TabSection) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  
  // Data lists
  developers: Developer[];
  clients: Client[];
  requirements: Requirement[];
  modules: Module[];
  customizationRequests: CustomizationRequest[];
  auditLogs: AuditLog[];
  loading: boolean;
  connected: boolean;

  // Traceability Timeline Modal
  traceTarget: { type: 'requirement' | 'module'; id: string } | null;
  openTraceModal: (type: 'requirement' | 'module', id: string) => void;
  closeTraceModal: () => void;

  // Reset Data Modal
  isResetModalOpen: boolean;
  openResetModal: () => void;
  closeResetModal: () => void;
  resetAllData: () => Promise<void>;

  // CRUD Actions
  addDeveloper: (dev: Partial<Developer>) => Promise<void>;
  updateDeveloper: (id: string, updates: Partial<Developer>) => Promise<void>;
  deleteDeveloper: (id: string) => Promise<void>;

  addClient: (client: Partial<Client>) => Promise<void>;
  updateClient: (id: string, updates: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;

  addRequirement: (req: Partial<Requirement>) => Promise<Requirement | undefined>;
  updateRequirement: (id: string, updates: Partial<Requirement>) => Promise<void>;
  deleteRequirement: (id: string) => Promise<void>;

  addModule: (mod: Partial<Module>) => Promise<Module | undefined>;
  updateModule: (id: string, updates: Partial<Module>) => Promise<void>;
  deleteModule: (id: string) => Promise<void>;

  addCustomizationRequest: (cr: Partial<CustomizationRequest>) => Promise<CustomizationRequest | undefined>;
  updateCustomizationRequest: (id: string, updates: Partial<CustomizationRequest>) => Promise<void>;
  deleteCustomizationRequest: (id: string) => Promise<void>;

  uploadFile: (file: File, entityType?: string, entityId?: string) => Promise<FileAttachment | undefined>;
  
  // Toasts
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;

  refreshData: () => Promise<void>;
}

const TrackerContext = createContext<TrackerContextType | undefined>(undefined);

export const TrackerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<TabSection>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [customizationRequests, setCustomizationRequests] = useState<CustomizationRequest[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const [traceTarget, setTraceTarget] = useState<{ type: 'requirement' | 'module'; id: string } | null>(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    const newToast = { ...toast, id };
    setToasts(prev => [...prev, newToast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const fetchState = useCallback(async () => {
    try {
      const res = await fetch('/api/state');
      if (res.ok) {
        const data = await res.json();
        setDevelopers(data.developers || []);
        setClients(data.clients || []);
        setRequirements(data.requirements || []);
        setModules(data.modules || []);
        setCustomizationRequests(data.customizationRequests || []);
        setAuditLogs(data.auditLogs || []);
      }
    } catch (err) {
      console.error('Error fetching state:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchState();

    // SSE connection for live updates
    const eventSource = new EventSource('/api/events');
    eventSource.onopen = () => setConnected(true);
    eventSource.onerror = () => setConnected(false);

    eventSource.addEventListener('STATE_UPDATE', (e: MessageEvent) => {
      try {
        const eventData = JSON.parse(e.data);
        fetchState();
        if (eventData.type === 'CR_UPDATED' && eventData.data?.developmentStatus === 'Approved') {
          addToast({
            type: 'info',
            title: 'Auto Version Bump!',
            message: `Module version auto-incremented following Customization Request approval.`
          });
        }
      } catch (err) {
        console.error('Error parsing SSE event:', err);
      }
    });

    eventSource.addEventListener('ATTACHMENT_ADDED', () => {
      fetchState();
    });

    return () => {
      eventSource.close();
    };
  }, [fetchState, addToast]);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.classList.toggle('light-mode', next === 'light');
  };

  const openTraceModal = (type: 'requirement' | 'module', id: string) => {
    setTraceTarget({ type, id });
  };
  const closeTraceModal = () => setTraceTarget(null);

  const openResetModal = () => setIsResetModalOpen(true);
  const closeResetModal = () => setIsResetModalOpen(false);

  // CRUD Implementations
  const addDeveloper = async (dev: Partial<Developer>) => {
    const res = await fetch('/api/developers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dev)
    });
    if (res.ok) {
      await fetchState();
      addToast({ type: 'success', title: 'Developer Added', message: `Added ${dev.name} to team.` });
    }
  };

  const updateDeveloper = async (id: string, updates: Partial<Developer>) => {
    const res = await fetch(`/api/developers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (res.ok) {
      await fetchState();
      addToast({ type: 'success', title: 'Developer Updated', message: `Developer info saved.` });
    }
  };

  const deleteDeveloper = async (id: string) => {
    const res = await fetch(`/api/developers/${id}`, { method: 'DELETE' });
    if (res.ok) {
      await fetchState();
      addToast({ type: 'warning', title: 'Developer Deleted', message: `Removed developer from system.` });
    }
  };

  const addClient = async (client: Partial<Client>) => {
    const res = await fetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(client)
    });
    if (res.ok) {
      await fetchState();
      addToast({ type: 'success', title: 'Client Added', message: `Added ${client.name}.` });
    }
  };

  const updateClient = async (id: string, updates: Partial<Client>) => {
    const res = await fetch(`/api/clients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (res.ok) {
      await fetchState();
      addToast({ type: 'success', title: 'Client Updated', message: `Client profile updated.` });
    }
  };

  const deleteClient = async (id: string) => {
    const res = await fetch(`/api/clients/${id}`, { method: 'DELETE' });
    if (res.ok) {
      await fetchState();
      addToast({ type: 'warning', title: 'Client Deleted', message: `Removed client record.` });
    }
  };

  const addRequirement = async (req: Partial<Requirement>) => {
    const res = await fetch('/api/requirements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req)
    });
    if (res.ok) {
      const created = await res.json();
      await fetchState();
      addToast({ type: 'success', title: 'Requirement Created', message: `${created.id}: ${created.title}` });
      return created;
    }
  };

  const updateRequirement = async (id: string, updates: Partial<Requirement>) => {
    const res = await fetch(`/api/requirements/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (res.ok) {
      await fetchState();
      addToast({ type: 'success', title: 'Requirement Updated', message: `Saved changes to ${id}` });
    }
  };

  const deleteRequirement = async (id: string) => {
    const res = await fetch(`/api/requirements/${id}`, { method: 'DELETE' });
    if (res.ok) {
      await fetchState();
      addToast({ type: 'warning', title: 'Requirement Deleted', message: `Removed requirement ${id}` });
    }
  };

  const addModule = async (mod: Partial<Module>) => {
    const res = await fetch('/api/modules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mod)
    });
    if (res.ok) {
      const created = await res.json();
      await fetchState();
      addToast({ type: 'success', title: 'Module Created', message: `${created.id} (${created.version}) initialized.` });
      return created;
    }
  };

  const updateModule = async (id: string, updates: Partial<Module>) => {
    const res = await fetch(`/api/modules/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (res.ok) {
      await fetchState();
      addToast({ type: 'success', title: 'Module Updated', message: `Saved changes for ${id}` });
    }
  };

  const deleteModule = async (id: string) => {
    const res = await fetch(`/api/modules/${id}`, { method: 'DELETE' });
    if (res.ok) {
      await fetchState();
      addToast({ type: 'warning', title: 'Module Deleted', message: `Removed module ${id}` });
    }
  };

  const addCustomizationRequest = async (cr: Partial<CustomizationRequest>) => {
    const res = await fetch('/api/customization-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cr)
    });
    if (res.ok) {
      const created = await res.json();
      await fetchState();
      addToast({ type: 'success', title: 'Customization Request Created', message: `Logged ${created.id}` });
      return created;
    }
  };

  const updateCustomizationRequest = async (id: string, updates: Partial<CustomizationRequest>) => {
    const res = await fetch(`/api/customization-requests/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (res.ok) {
      await fetchState();
      addToast({ type: 'success', title: 'CR Updated', message: `Saved status for ${id}` });
    }
  };

  const deleteCustomizationRequest = async (id: string) => {
    const res = await fetch(`/api/customization-requests/${id}`, { method: 'DELETE' });
    if (res.ok) {
      await fetchState();
      addToast({ type: 'warning', title: 'CR Deleted', message: `Removed customization request ${id}` });
    }
  };

  const uploadFile = async (file: File, entityType?: string, entityId?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (entityType) formData.append('entityType', entityType);
    if (entityId) formData.append('entityId', entityId);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        await fetchState();
        addToast({ type: 'success', title: 'File Attached', message: `Uploaded ${file.name}` });
        return data.attachment;
      }
    } catch (err) {
      console.error('File upload error:', err);
      addToast({ type: 'error', title: 'Upload Failed', message: `Could not upload file.` });
    }
  };

  const resetAllData = async () => {
    const res = await fetch('/api/reset', { method: 'POST' });
    if (res.ok) {
      await fetchState();
      setIsResetModalOpen(false);
      addToast({ type: 'error', title: 'Data Wiped', message: 'All custom requirements, modules, and logs reset.' });
    }
  };

  return (
    <TrackerContext.Provider
      value={{
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        theme,
        toggleTheme,

        developers,
        clients,
        requirements,
        modules,
        customizationRequests,
        auditLogs,
        loading,
        connected,

        traceTarget,
        openTraceModal,
        closeTraceModal,

        isResetModalOpen,
        openResetModal,
        closeResetModal,
        resetAllData,

        addDeveloper,
        updateDeveloper,
        deleteDeveloper,

        addClient,
        updateClient,
        deleteClient,

        addRequirement,
        updateRequirement,
        deleteRequirement,

        addModule,
        updateModule,
        deleteModule,

        addCustomizationRequest,
        updateCustomizationRequest,
        deleteCustomizationRequest,

        uploadFile,

        toasts,
        addToast,
        removeToast,

        refreshData: fetchState
      }}
    >
      {children}
    </TrackerContext.Provider>
  );
};

export const useTracker = () => {
  const context = useContext(TrackerContext);
  if (!context) {
    throw new Error('useTracker must be used within a TrackerProvider');
  }
  return context;
};
