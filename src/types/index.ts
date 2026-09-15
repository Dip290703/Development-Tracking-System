export type WorkflowStatus =
  | 'New'
  | 'Analysis'
  | 'Development'
  | 'Internal Testing'
  | 'Ready for Client'
  | 'Client Testing'
  | 'Changes Requested'
  | 'Rework'
  | 'Approved'
  | 'Closed';

export type ModuleStatus =
  | 'Planning'
  | 'In development'
  | 'Internal testing'
  | 'Completed'
  | 'Deployed';

export type Priority = 'Low' | 'Medium' | 'High' | 'Urgent';

export type TestingStatus = 'Not started' | 'Internal testing' | 'Client testing' | 'Passed' | 'Failed';

export type ClientReviewStatus = 'Pending' | 'Approved' | 'Changes requested';

export type FinalApprovalStatus = 'Pending' | 'Approved' | 'Rejected';

export interface FileAttachment {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  filename: string;
  url: string;
  uploadedAt: string;
}

export interface Developer {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarColor: string;
  active: boolean;
}

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  notes?: string;
  createdAt: string;
}

export interface Requirement {
  id: string; // REQ-001
  clientId: string;
  projectName: string;
  title: string;
  detailedRequirement: string;
  requirementDate: string;
  priority: Priority;
  assignedDeveloperId: string;
  expectedCompletionDate: string;
  status: WorkflowStatus;
  attachments?: FileAttachment[];
  createdAt: string;
  updatedAt: string;
}

export interface VersionEntry {
  version: string; // e.g. "v1.0" or "v1.1"
  timestamp: string;
  note: string;
  crId?: string;
}

export interface Module {
  id: string; // MOD-001
  linkedRequirementId: string;
  moduleName: string;
  technicalName: string;
  odooVersion: string; // e.g. "19.0"
  devStartDate: string;
  developerId: string;
  status: ModuleStatus;
  completionDate: string;
  version: string; // e.g. "1.0", "1.1"
  versionHistory: VersionEntry[];
  attachments?: FileAttachment[];
  createdAt: string;
  updatedAt: string;
}

export interface CustomizationRequest {
  id: string; // CR-001
  relatedModuleId: string;
  originalRequirementId: string;
  clientId: string;
  requestDate: string;
  description: string;
  reason: string;
  assignedDeveloperId: string;
  priority: Priority;
  developmentStatus: WorkflowStatus;
  devStartDate: string;
  devCompletionDate: string;
  testingStatus: TestingStatus;
  clientReviewStatus: ClientReviewStatus;
  clientFeedback: string;
  finalApproval: FinalApprovalStatus;
  attachments?: FileAttachment[];
  createdAt: string;
  updatedAt: string;
}

export interface AuditChange {
  field: string;
  oldVal: any;
  newVal: any;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'VERSION_BUMP' | 'RESET_ALL';
  entityType: 'Requirement' | 'Module' | 'CustomizationRequest' | 'Client' | 'Developer' | 'System';
  entityId: string;
  summary: string;
  changes?: AuditChange[];
}

export type TabSection =
  | 'dashboard'
  | 'requirements'
  | 'modules'
  | 'customization-requests'
  | 'clients'
  | 'developers'
  | 'audit-log';
