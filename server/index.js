const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const store = require('./store');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Server-Sent Events (SSE) subscribers for real-time live synchronization across browsers
let sseClients = [];

function broadcast(event, payload) {
  const data = `event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`;
  sseClients.forEach(client => client.res.write(data));
}

app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const clientId = Date.now();
  const newClient = { id: clientId, res };
  sseClients.push(newClient);

  req.on('close', () => {
    sseClients = sseClients.filter(c => c.id !== clientId);
  });
});

// Configure Multer for File Uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage: storage });

// Download file endpoint for Team Leads and Developers
app.get('/api/files/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);

  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});

// Direct file upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const fileAttachment = {
    id: 'FILE-' + Date.now(),
    name: req.file.originalname,
    size: req.file.size,
    mimeType: req.file.mimetype,
    filename: req.file.filename,
    url: `/api/files/${req.file.filename}`,
    uploadedAt: new Date().toISOString()
  };

  const { entityType, entityId } = req.body;
  if (entityType && entityId) {
    const updatedEntity = store.addAttachmentToEntity(entityType, entityId, fileAttachment);
    broadcast('ATTACHMENT_ADDED', { entityType, entityId, attachment: fileAttachment });
    return res.json({ success: true, attachment: fileAttachment, entity: updatedEntity });
  }

  res.json({ success: true, attachment: fileAttachment });
});

// --- API ENDPOINTS ---

// Get all state
app.get('/api/state', (req, res) => {
  res.json({
    developers: store.getDevelopers(),
    clients: store.getClients(),
    requirements: store.getRequirements(),
    modules: store.getModules(),
    customizationRequests: store.getCustomizationRequests(),
    auditLogs: store.data.auditLogs
  });
});

// DEVELOPERS
app.get('/api/developers', (req, res) => res.json(store.getDevelopers()));
app.post('/api/developers', (req, res) => {
  const newDev = store.addDeveloper(req.body);
  broadcast('STATE_UPDATE', { type: 'DEVELOPER_ADDED', data: newDev });
  res.status(201).json(newDev);
});
app.put('/api/developers/:id', (req, res) => {
  const updated = store.updateDeveloper(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Developer not found' });
  broadcast('STATE_UPDATE', { type: 'DEVELOPER_UPDATED', data: updated });
  res.json(updated);
});
app.delete('/api/developers/:id', (req, res) => {
  const success = store.deleteDeveloper(req.params.id);
  if (!success) return res.status(404).json({ error: 'Developer not found' });
  broadcast('STATE_UPDATE', { type: 'DEVELOPER_DELETED', id: req.params.id });
  res.json({ success: true });
});

// CLIENTS
app.get('/api/clients', (req, res) => res.json(store.getClients()));
app.post('/api/clients', (req, res) => {
  const newClient = store.addClient(req.body);
  broadcast('STATE_UPDATE', { type: 'CLIENT_ADDED', data: newClient });
  res.status(201).json(newClient);
});
app.put('/api/clients/:id', (req, res) => {
  const updated = store.updateClient(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Client not found' });
  broadcast('STATE_UPDATE', { type: 'CLIENT_UPDATED', data: updated });
  res.json(updated);
});
app.delete('/api/clients/:id', (req, res) => {
  const success = store.deleteClient(req.params.id);
  if (!success) return res.status(404).json({ error: 'Client not found' });
  broadcast('STATE_UPDATE', { type: 'CLIENT_DELETED', id: req.params.id });
  res.json({ success: true });
});

// REQUIREMENTS
app.get('/api/requirements', (req, res) => res.json(store.getRequirements()));
app.post('/api/requirements', (req, res) => {
  const newReq = store.addRequirement(req.body);
  broadcast('STATE_UPDATE', { type: 'REQUIREMENT_ADDED', data: newReq });
  res.status(201).json(newReq);
});
app.put('/api/requirements/:id', (req, res) => {
  const updated = store.updateRequirement(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Requirement not found' });
  broadcast('STATE_UPDATE', { type: 'REQUIREMENT_UPDATED', data: updated });
  res.json(updated);
});
app.delete('/api/requirements/:id', (req, res) => {
  const success = store.deleteRequirement(req.params.id);
  if (!success) return res.status(404).json({ error: 'Requirement not found' });
  broadcast('STATE_UPDATE', { type: 'REQUIREMENT_DELETED', id: req.params.id });
  res.json({ success: true });
});

// MODULES
app.get('/api/modules', (req, res) => res.json(store.getModules()));
app.post('/api/modules', (req, res) => {
  const newMod = store.addModule(req.body);
  broadcast('STATE_UPDATE', { type: 'MODULE_ADDED', data: newMod });
  res.status(201).json(newMod);
});
app.put('/api/modules/:id', (req, res) => {
  const updated = store.updateModule(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Module not found' });
  broadcast('STATE_UPDATE', { type: 'MODULE_UPDATED', data: updated });
  res.json(updated);
});
app.delete('/api/modules/:id', (req, res) => {
  const success = store.deleteModule(req.params.id);
  if (!success) return res.status(404).json({ error: 'Module not found' });
  broadcast('STATE_UPDATE', { type: 'MODULE_DELETED', id: req.params.id });
  res.json({ success: true });
});

// CUSTOMIZATION REQUESTS
app.get('/api/customization-requests', (req, res) => res.json(store.getCustomizationRequests()));
app.post('/api/customization-requests', (req, res) => {
  const newCr = store.addCustomizationRequest(req.body);
  broadcast('STATE_UPDATE', { type: 'CR_ADDED', data: newCr });
  res.status(201).json(newCr);
});
app.put('/api/customization-requests/:id', (req, res) => {
  const updated = store.updateCustomizationRequest(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Customization Request not found' });
  broadcast('STATE_UPDATE', { type: 'CR_UPDATED', data: updated });
  res.json(updated);
});
app.delete('/api/customization-requests/:id', (req, res) => {
  const success = store.deleteCustomizationRequest(req.params.id);
  if (!success) return res.status(404).json({ error: 'Customization Request not found' });
  broadcast('STATE_UPDATE', { type: 'CR_DELETED', id: req.params.id });
  res.json({ success: true });
});

// AUDIT LOGS
app.get('/api/audit-logs', (req, res) => res.json(store.data.auditLogs));

// RESET ALL DATA
app.post('/api/reset', (req, res) => {
  const resetData = store.resetAllData();
  broadcast('STATE_UPDATE', { type: 'RESET_ALL', data: resetData });
  res.json({ success: true, message: 'All data permanently reset', data: resetData });
});

// Serve built frontend assets in production
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(distPath, 'index.html'));
    }
  });
}

app.listen(PORT, () => {
  console.log(`Customization Tracker Server running on http://localhost:${PORT}`);
});
