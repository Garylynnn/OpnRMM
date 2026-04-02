export interface ClamAVStatus {
  active: boolean;
  version: string;
  lastScan: string;
  threatsFound: number;
  realTimeEnabled: boolean;
}

export interface Device {
  id: string;
  name: string;
  ip: string;
  status: 'online' | 'offline' | 'warning';
  os: 'Windows' | 'Linux' | 'macOS';
  cpu: number;
  ram: number;
  lastSeen: string;
  clamav?: ClamAVStatus;
}

export interface Threat {
  id: string;
  deviceId: string;
  deviceName: string;
  filePath: string;
  threatName: string;
  detectedAt: string;
  actionTaken: 'quarantined' | 'deleted' | 'ignored';
}

export interface Asset {
  id: string;
  name: string;
  type: 'Hardware' | 'Software' | 'License';
  serialNumber?: string;
  purchaseDate: string;
  value: number;
  location: string;
}

export interface Ticket {
  id: string;
  title: string;
  requester: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in-progress' | 'closed';
  assignedTo: string;
  createdAt: string;
}
