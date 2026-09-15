const fs = require('fs');
const path = require('path');

const IS_VERCEL = !!process.env.VERCEL;
const DATA_DIR = IS_VERCEL ? path.join('/tmp', 'data') : path.join(__dirname, 'data');
const UPLOADS_DIR = IS_VERCEL ? path.join('/tmp', 'uploads') : path.join(__dirname, 'uploads');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

// Ensure directories exist
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
} catch (e) {
  console.warn('Directory creation warning:', e.message);
}

const DEFAULT_DATA = {
  developers: [
    {
      id: 'DEV-001',
      name: 'Alex Mercer',
      email: 'alex.mercer@odoo-dev.com',
      role: 'Senior Odoo Technical Lead',
      avatarColor: '#6366f1',
      active: true
    },
    {
      id: 'DEV-002',
      name: 'Sarah Connor',
      email: 'sarah.connor@odoo-dev.com',
      role: 'Odoo Module Specialist',
      avatarColor: '#ec4899',
      active: true
    },
    {
      id: 'DEV-003',
      name: 'David Chen',
      email: 'david.chen@odoo-dev.com',
      role: 'Odoo Integration & Backend Dev',
      avatarColor: '#10b981',
      active: true
    }
  ],
  clients: [
    {
      id: 'CLI-001',
      name: 'Acme Logistics Ltd',
      company: 'Acme Logistics',
      email: 'contact@acmelogistics.com',
      phone: '+1 555-0192',
      notes: 'Odoo Online 19.0 SaaS tenant with custom delivery workflows.',
      createdAt: '2026-09-01T10:00:00.000Z'
    },
    {
      id: 'CLI-002',
      name: 'Nexus Retail Corp',
      company: 'Nexus Retail',
      email: 'odoo-admin@nexusretail.io',
      phone: '+1 555-0481',
      notes: 'Odoo 19 Multi-company setup requiring custom sales commissions.',
      createdAt: '2026-09-05T11:30:00.000Z'
    },
    {
      id: 'CLI-003',
      name: 'Apex Health Systems',
      company: 'Apex Health',
      email: 'tech@apexhealth.org',
      phone: '+1 555-0922',
      notes: 'Medical inventory tracking on Odoo 19 SaaS.',
      createdAt: '2026-09-10T14:15:00.000Z'
    }
  ],
  requirements: [
    {
      id: 'REQ-001',
      clientId: 'CLI-002',
      projectName: 'Nexus Sales Boost 2026',
      title: 'Custom Sales Commission Module',
      detailedRequirement: 'Client requires a multi-tiered sales commission calculation engine integrated directly into Odoo 19 Sale Orders and Account Invoices. Must support percentage splits per salesperson and tier threshold bonuses.',
      requirementDate: '2026-09-06T09:00:00.000Z',
      priority: 'High',
      assignedDeveloperId: 'DEV-001',
      expectedCompletionDate: '2026-09-25T18:00:00.000Z',
      status: 'Development',
      attachments: [],
      createdAt: '2026-09-06T09:00:00.000Z',
      updatedAt: '2026-09-06T09:00:00.000Z'
    },
    {
      id: 'REQ-002',
      clientId: 'CLI-001',
      projectName: 'Acme Automated Picker',
      title: 'Barcode Delivery Routing Assistant',
      detailedRequirement: 'Automated warehouse barcode picker rule for Odoo 19 Stock picking. Requires fast item lookup and batch routing visualization on mobile warehouse screens.',
      requirementDate: '2026-09-08T10:30:00.000Z',
      priority: 'Urgent',
      assignedDeveloperId: 'DEV-002',
      expectedCompletionDate: '2026-09-28T17:00:00.000Z',
      status: 'Analysis',
      attachments: [],
      createdAt: '2026-09-08T10:30:00.000Z',
      updatedAt: '2026-09-08T10:30:00.000Z'
    }
  ],
  modules: [
    {
      id: 'MOD-001',
      linkedRequirementId: 'REQ-001',
      moduleName: 'Sales Commission Manager',
      technicalName: 'sale_commission_custom',
      odooVersion: '19.0',
      devStartDate: '2026-09-07T08:00:00.000Z',
      developerId: 'DEV-001',
      status: 'In development',
      completionDate: '2026-09-22T00:00:00.000Z',
      version: '1.0',
      attachments: [],
      versionHistory: [
        {
          version: '1.0',
          timestamp: '2026-09-07T08:00:00.000Z',
          note: 'V1.0 — Initial module creation & structure development'
        }
      ],
      createdAt: '2026-09-07T08:00:00.000Z',
      updatedAt: '2026-09-07T08:00:00.000Z'
    },
    {
      id: 'MOD-002',
      linkedRequirementId: 'REQ-002',
      moduleName: 'Warehouse Barcode Picker',
      technicalName: 'stock_barcode_picker_custom',
      odooVersion: '19.0',
      devStartDate: '2026-09-09T09:00:00.000Z',
      developerId: 'DEV-002',
      status: 'Planning',
      completionDate: '2026-09-26T00:00:00.000Z',
      version: '1.0',
      attachments: [],
      versionHistory: [
        {
          version: '1.0',
          timestamp: '2026-09-09T09:00:00.000Z',
          note: 'V1.0 — Initial architecture design and manifest setup'
        }
      ],
      createdAt: '2026-09-09T09:00:00.000Z',
      updatedAt: '2026-09-09T09:00:00.000Z'
    }
  ],
  customizationRequests: [
    {
      id: 'CR-001',
      relatedModuleId: 'MOD-001',
      originalRequirementId: 'REQ-001',
      clientId: 'CLI-002',
      requestDate: '2026-09-12T11:00:00.000Z',
      description: 'Add manager override approval rule for commissions exceeding $5,000 threshold.',
      reason: 'Business governance policy requested by Nexus finance team after demo review.',
      assignedDeveloperId: 'DEV-001',
      priority: 'High',
      developmentStatus: 'Development',
      devStartDate: '2026-09-13T09:00:00.000Z',
      devCompletionDate: '2026-09-20T17:00:00.000Z',
      testingStatus: 'Internal testing',
      clientReviewStatus: 'Pending',
      clientFeedback: 'Initial feedback received from CFO. Awaiting revised test build.',
      finalApproval: 'Pending',
      attachments: [],
      createdAt: '2026-09-12T11:00:00.000Z',
      updatedAt: '2026-09-13T09:00:00.000Z'
    }
  ],
  auditLogs: [
    {
      id: 'AUD-001',
      timestamp: '2026-09-06T09:00:00.000Z',
      action: 'CREATE',
      entityType: 'Requirement',
      entityId: 'REQ-001',
      summary: 'Requirement REQ-001 "Custom Sales Commission Module" created for Nexus Retail Corp',
      changes: []
    },
    {
      id: 'AUD-002',
      timestamp: '2026-09-07T08:00:00.000Z',
      action: 'CREATE',
      entityType: 'Module',
      entityId: 'MOD-001',
      summary: 'Module MOD-001 "Sales Commission Manager" created and linked to REQ-001 (Version 1.0)',
      changes: []
    },
    {
      id: 'AUD-003',
      timestamp: '2026-09-12T11:00:00.000Z',
      action: 'CREATE',
      entityType: 'CustomizationRequest',
      entityId: 'CR-001',
      summary: 'Customization request CR-001 logged for MOD-001: "Manager override approval rule"',
      changes: []
    }
  ]
};

class Store {
  constructor() {
    this.data = this.loadData();
  }

  loadData() {
    try {
      if (fs.existsSync(STORE_FILE)) {
        const raw = fs.readFileSync(STORE_FILE, 'utf8');
        const parsed = JSON.parse(raw);
        // Ensure all keys exist
        return {
          developers: parsed.developers || DEFAULT_DATA.developers,
          clients: parsed.clients || DEFAULT_DATA.clients,
          requirements: parsed.requirements || DEFAULT_DATA.requirements,
          modules: parsed.modules || DEFAULT_DATA.modules,
          customizationRequests: parsed.customizationRequests || DEFAULT_DATA.customizationRequests,
          auditLogs: parsed.auditLogs || DEFAULT_DATA.auditLogs
        };
      }
    } catch (err) {
      console.error('Error loading store file, falling back to default data:', err);
    }
    this.saveData(DEFAULT_DATA);
    return DEFAULT_DATA;
  }

  saveData(newData = this.data) {
    this.data = newData;
    try {
      fs.writeFileSync(STORE_FILE, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      console.error('Error writing store file:', err);
    }
  }

  // Audit logger helper
  addAuditLog(action, entityType, entityId, summary, changes = []) {
    const logId = `AUD-${String(this.data.auditLogs.length + 1).padStart(3, '0')}`;
    const logEntry = {
      id: logId,
      timestamp: new Date().toISOString(),
      action,
      entityType,
      entityId,
      summary,
      changes
    };
    this.data.auditLogs.unshift(logEntry);
    this.saveData();
    return logEntry;
  }

  // --- DEVELOPERS ---
  getDevelopers() {
    return this.data.developers;
  }

  addDeveloper(dev) {
    const id = `DEV-${String(this.data.developers.length + 1).padStart(3, '0')}`;
    const newDev = { id, avatarColor: '#6366f1', active: true, ...dev };
    this.data.developers.push(newDev);
    this.addAuditLog('CREATE', 'Developer', id, `Added new developer "${newDev.name}" (${newDev.role})`);
    this.saveData();
    return newDev;
  }

  updateDeveloper(id, updates) {
    const index = this.data.developers.findIndex(d => d.id === id);
    if (index === -1) return null;
    const old = { ...this.data.developers[index] };
    this.data.developers[index] = { ...this.data.developers[index], ...updates };
    this.addAuditLog('UPDATE', 'Developer', id, `Updated developer details for "${this.data.developers[index].name}"`);
    this.saveData();
    return this.data.developers[index];
  }

  deleteDeveloper(id) {
    const dev = this.data.developers.find(d => d.id === id);
    if (!dev) return false;
    this.data.developers = this.data.developers.filter(d => d.id !== id);
    this.addAuditLog('DELETE', 'Developer', id, `Deleted developer "${dev.name}"`);
    this.saveData();
    return true;
  }

  // --- CLIENTS ---
  getClients() {
    return this.data.clients;
  }

  addClient(client) {
    const id = `CLI-${String(this.data.clients.length + 1).padStart(3, '0')}`;
    const newClient = { id, createdAt: new Date().toISOString(), ...client };
    this.data.clients.push(newClient);
    this.addAuditLog('CREATE', 'Client', id, `Added new client "${newClient.name}" (${newClient.company})`);
    this.saveData();
    return newClient;
  }

  updateClient(id, updates) {
    const index = this.data.clients.findIndex(c => c.id === id);
    if (index === -1) return null;
    this.data.clients[index] = { ...this.data.clients[index], ...updates };
    this.addAuditLog('UPDATE', 'Client', id, `Updated client info for "${this.data.clients[index].name}"`);
    this.saveData();
    return this.data.clients[index];
  }

  deleteClient(id) {
    const client = this.data.clients.find(c => c.id === id);
    if (!client) return false;
    this.data.clients = this.data.clients.filter(c => c.id !== id);
    this.addAuditLog('DELETE', 'Client', id, `Deleted client "${client.name}"`);
    this.saveData();
    return true;
  }

  // --- REQUIREMENTS ---
  getRequirements() {
    return this.data.requirements;
  }

  addRequirement(req) {
    const id = `REQ-${String(this.data.requirements.length + 1).padStart(3, '0')}`;
    const now = new Date().toISOString();
    const newReq = {
      id,
      status: 'New',
      attachments: [],
      createdAt: now,
      updatedAt: now,
      ...req
    };
    this.data.requirements.push(newReq);
    this.addAuditLog('CREATE', 'Requirement', id, `Logged new requirement ${id}: "${newReq.title}"`);
    this.saveData();
    return newReq;
  }

  updateRequirement(id, updates) {
    const index = this.data.requirements.findIndex(r => r.id === id);
    if (index === -1) return null;
    const old = this.data.requirements[index];
    const changes = [];

    if (updates.status && updates.status !== old.status) {
      changes.push({ field: 'status', oldVal: old.status, newVal: updates.status });
    }
    if (updates.priority && updates.priority !== old.priority) {
      changes.push({ field: 'priority', oldVal: old.priority, newVal: updates.priority });
    }

    const updated = {
      ...old,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.data.requirements[index] = updated;
    const summary = changes.length > 0
      ? `Updated requirement ${id} (${changes.map(c => `${c.field}: ${c.oldVal} → ${c.newVal}`).join(', ')})`
      : `Updated requirement details for ${id}`;

    this.addAuditLog('UPDATE', 'Requirement', id, summary, changes);
    this.saveData();
    return updated;
  }

  deleteRequirement(id) {
    const req = this.data.requirements.find(r => r.id === id);
    if (!req) return false;
    this.data.requirements = this.data.requirements.filter(r => r.id !== id);
    this.addAuditLog('DELETE', 'Requirement', id, `Deleted requirement ${id} "${req.title}"`);
    this.saveData();
    return true;
  }

  // --- MODULES ---
  getModules() {
    return this.data.modules;
  }

  addModule(mod) {
    const id = `MOD-${String(this.data.modules.length + 1).padStart(3, '0')}`;
    const now = new Date().toISOString();
    const initialVersion = mod.version || '1.0';
    const newMod = {
      id,
      odooVersion: '19.0',
      version: initialVersion,
      attachments: [],
      versionHistory: [
        {
          version: `v${initialVersion}`,
          timestamp: now,
          note: `V${initialVersion} — Initial module development creation`
        }
      ],
      createdAt: now,
      updatedAt: now,
      ...mod
    };
    this.data.modules.push(newMod);
    this.addAuditLog('CREATE', 'Module', id, `Created module ${id}: "${newMod.moduleName}" (${newMod.technicalName}) v${initialVersion}`);
    this.saveData();
    return newMod;
  }

  updateModule(id, updates) {
    const index = this.data.modules.findIndex(m => m.id === id);
    if (index === -1) return null;
    const old = this.data.modules[index];
    const changes = [];

    if (updates.status && updates.status !== old.status) {
      changes.push({ field: 'status', oldVal: old.status, newVal: updates.status });
    }
    if (updates.version && updates.version !== old.version) {
      changes.push({ field: 'version', oldVal: old.version, newVal: updates.version });
    }

    const updated = {
      ...old,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.data.modules[index] = updated;
    const summary = changes.length > 0
      ? `Updated module ${id} (${changes.map(c => `${c.field}: ${c.oldVal} → ${c.newVal}`).join(', ')})`
      : `Updated module details for ${id}`;

    this.addAuditLog('UPDATE', 'Module', id, summary, changes);
    this.saveData();
    return updated;
  }

  deleteModule(id) {
    const mod = this.data.modules.find(m => m.id === id);
    if (!mod) return false;
    this.data.modules = this.data.modules.filter(m => m.id !== id);
    this.addAuditLog('DELETE', 'Module', id, `Deleted module ${id} "${mod.moduleName}"`);
    this.saveData();
    return true;
  }

  // --- CUSTOMIZATION REQUESTS (Core workflow & Version bump trigger) ---
  getCustomizationRequests() {
    return this.data.customizationRequests;
  }

  addCustomizationRequest(cr) {
    const id = `CR-${String(this.data.customizationRequests.length + 1).padStart(3, '0')}`;
    const now = new Date().toISOString();
    const newCr = {
      id,
      developmentStatus: 'New',
      testingStatus: 'Not started',
      clientReviewStatus: 'Pending',
      finalApproval: 'Pending',
      attachments: [],
      createdAt: now,
      updatedAt: now,
      ...cr
    };
    this.data.customizationRequests.push(newCr);
    this.addAuditLog('CREATE', 'CustomizationRequest', id, `Logged customization request ${id} for Module ${newCr.relatedModuleId}`);
    this.saveData();
    return newCr;
  }

  updateCustomizationRequest(id, updates) {
    const index = this.data.customizationRequests.findIndex(c => c.id === id);
    if (index === -1) return null;
    const old = this.data.customizationRequests[index];
    const changes = [];

    // Track workflow field changes
    if (updates.developmentStatus && updates.developmentStatus !== old.developmentStatus) {
      changes.push({ field: 'developmentStatus', oldVal: old.developmentStatus, newVal: updates.developmentStatus });
    }
    if (updates.testingStatus && updates.testingStatus !== old.testingStatus) {
      changes.push({ field: 'testingStatus', oldVal: old.testingStatus, newVal: updates.testingStatus });
    }
    if (updates.clientReviewStatus && updates.clientReviewStatus !== old.clientReviewStatus) {
      changes.push({ field: 'clientReviewStatus', oldVal: old.clientReviewStatus, newVal: updates.clientReviewStatus });
    }
    if (updates.finalApproval && updates.finalApproval !== old.finalApproval) {
      changes.push({ field: 'finalApproval', oldVal: old.finalApproval, newVal: updates.finalApproval });
    }

    const updatedCr = {
      ...old,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.data.customizationRequests[index] = updatedCr;

    this.addAuditLog(
      'UPDATE',
      'CustomizationRequest',
      id,
      `Updated CR ${id} status (${changes.map(c => `${c.field}: ${c.oldVal} → ${c.newVal}`).join(', ') || 'details'})`,
      changes
    );

    // --- AUTOMATIC VERSION BUMP RULE ---
    // When Development Status is changed to "Approved" (or finalApproval transitions to "Approved")
    const justApprovedStatus = updates.developmentStatus === 'Approved' && old.developmentStatus !== 'Approved';
    const justFinalApproved = updates.finalApproval === 'Approved' && old.finalApproval !== 'Approved';

    if (justApprovedStatus || justFinalApproved) {
      this.bumpModuleVersionForCR(updatedCr);
    }

    this.saveData();
    return updatedCr;
  }

  bumpModuleVersionForCR(cr) {
    const mod = this.data.modules.find(m => m.id === cr.relatedModuleId);
    if (!mod) return;

    // Increment minor version: e.g. 1.0 -> 1.1, 1.1 -> 1.2
    const currentVer = parseFloat(mod.version) || 1.0;
    const newVerNum = (currentVer + 0.1).toFixed(1);
    const newVerStr = `${newVerNum}`;

    mod.version = newVerStr;
    mod.updatedAt = new Date().toISOString();

    if (!mod.versionHistory) mod.versionHistory = [];
    const note = `V${newVerStr} — Auto-bumped on Customization Request ${cr.id} Approval: "${cr.description.slice(0, 50)}${cr.description.length > 50 ? '...' : ''}"`;

    mod.versionHistory.unshift({
      version: `v${newVerStr}`,
      timestamp: new Date().toISOString(),
      note,
      crId: cr.id
    });

    this.addAuditLog(
      'VERSION_BUMP',
      'Module',
      mod.id,
      `Module ${mod.id} version automatically bumped from v${currentVer} to v${newVerStr} following approval of ${cr.id}`
    );
  }

  deleteCustomizationRequest(id) {
    const cr = this.data.customizationRequests.find(c => c.id === id);
    if (!cr) return false;
    this.data.customizationRequests = this.data.customizationRequests.filter(c => c.id !== id);
    this.addAuditLog('DELETE', 'CustomizationRequest', id, `Deleted customization request ${id}`);
    this.saveData();
    return true;
  }

  // --- ATTACHMENTS HANDLING ---
  addAttachmentToEntity(entityType, entityId, fileAttachment) {
    let list;
    if (entityType === 'Requirement') list = this.data.requirements;
    else if (entityType === 'Module') list = this.data.modules;
    else if (entityType === 'CustomizationRequest') list = this.data.customizationRequests;

    if (!list) return null;
    const item = list.find(x => x.id === entityId);
    if (!item) return null;

    if (!item.attachments) item.attachments = [];
    item.attachments.push(fileAttachment);
    item.updatedAt = new Date().toISOString();

    this.addAuditLog(
      'UPDATE',
      entityType,
      entityId,
      `Attached file "${fileAttachment.name}" (${(fileAttachment.size / 1024).toFixed(1)} KB) to ${entityType} ${entityId}`
    );
    this.saveData();
    return item;
  }

  deleteAttachmentFromEntity(entityType, entityId, attachmentId) {
    let list;
    if (entityType === 'Requirement') list = this.data.requirements;
    else if (entityType === 'Module') list = this.data.modules;
    else if (entityType === 'CustomizationRequest') list = this.data.customizationRequests;

    if (!list) return null;
    const item = list.find(x => x.id === entityId);
    if (!item || !item.attachments) return null;

    const file = item.attachments.find(a => a.id === attachmentId);
    item.attachments = item.attachments.filter(a => a.id !== attachmentId);

    if (file) {
      this.addAuditLog('UPDATE', entityType, entityId, `Removed file attachment "${file.name}" from ${entityType} ${entityId}`);
    }
    this.saveData();
    return item;
  }

  // --- RESET ALL DATA ---
  resetAllData() {
    this.data = {
      developers: DEFAULT_DATA.developers,
      clients: DEFAULT_DATA.clients,
      requirements: [],
      modules: [],
      customizationRequests: [],
      auditLogs: [
        {
          id: 'AUD-001',
          timestamp: new Date().toISOString(),
          action: 'RESET_ALL',
          entityType: 'System',
          entityId: 'SYS-000',
          summary: 'SYSTEM RESET EXECUTION: All requirements, modules, customization requests and logs were permanently erased.',
          changes: []
        }
      ]
    };
    this.saveData();
    return this.data;
  }
}

module.exports = new Store();
