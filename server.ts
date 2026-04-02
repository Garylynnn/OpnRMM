import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";

// Local storage for device stats
interface DeviceStats {
  id: string;
  name: string;
  ip: string;
  status: 'online' | 'offline' | 'warning';
  os: 'Windows' | 'Linux' | 'macOS';
  cpu: number;
  ram: number;
  lastSeen: number; // timestamp
  clamav?: {
    active: boolean;
    version: string;
    lastScan: string;
    threatsFound: number;
    realTimeEnabled: boolean;
  };
}

interface Asset {
  id: string;
  name: string;
  type: 'Hardware' | 'Software' | 'License';
  serialNumber?: string;
  purchaseDate: string;
  value: number;
  location: string;
}

interface Ticket {
  id: string;
  title: string;
  requester: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in-progress' | 'closed';
  assignedTo: string;
  createdAt: string;
}

interface Threat {
  id: string;
  deviceId: string;
  deviceName: string;
  filePath: string;
  threatName: string;
  detectedAt: string;
  actionTaken: 'quarantined' | 'deleted' | 'ignored';
}

let devices: Record<string, DeviceStats> = {
  '1': { 
    id: '1', 
    name: 'SRV-PROD-01', 
    ip: '192.168.1.10', 
    status: 'online', 
    os: 'Linux', 
    cpu: 12, 
    ram: 45, 
    lastSeen: Date.now(),
    clamav: { active: true, version: 'ClamAV 1.0.1', lastScan: '2026-04-01 22:00', threatsFound: 0, realTimeEnabled: true }
  },
  '2': { 
    id: '2', 
    name: 'WKST-DESK-04', 
    ip: '192.168.1.45', 
    status: 'online', 
    os: 'Windows', 
    cpu: 4, 
    ram: 22, 
    lastSeen: Date.now() - 120000,
    clamav: { active: false, version: 'N/A', lastScan: 'N/A', threatsFound: 0, realTimeEnabled: false }
  },
};

let threats: Threat[] = [
  { id: 'T1', deviceId: '1', deviceName: 'SRV-PROD-01', filePath: '/tmp/eicar.com', threatName: 'Eicar-Test-Signature', detectedAt: '2026-04-01 15:30', actionTaken: 'quarantined' },
];

let assets: Asset[] = [
  { id: 'A1', name: 'Dell Latitude 5420', type: 'Hardware', serialNumber: 'SN-99281', purchaseDate: '2023-05-12', value: 1200, location: 'HQ - Floor 2' },
  { id: 'A2', name: 'Adobe Creative Cloud', type: 'License', purchaseDate: '2024-01-15', value: 600, location: 'Cloud' },
  { id: 'A3', name: 'Cisco C9200 Switch', type: 'Hardware', serialNumber: 'SN-11023', purchaseDate: '2022-11-20', value: 3500, location: 'Server Room A' },
  { id: 'A4', name: 'Microsoft 365 Business', type: 'License', purchaseDate: '2023-12-01', value: 2400, location: 'Cloud' },
];

let tickets: Ticket[] = [
  { id: 'T-101', title: 'VPN Connection Issues', requester: 'Sarah Connor', priority: 'high', status: 'open', assignedTo: 'John Doe', createdAt: '2026-03-31 14:20' },
  { id: 'T-102', title: 'New Laptop Setup', requester: 'Kyle Reese', priority: 'medium', status: 'in-progress', assignedTo: 'Jane Smith', createdAt: '2026-04-01 09:15' },
  { id: 'T-103', title: 'Printer Offline - Floor 3', requester: 'Ellen Ripley', priority: 'low', status: 'open', assignedTo: 'Unassigned', createdAt: '2026-04-01 10:30' },
  { id: 'T-104', title: 'Email Password Reset', requester: 'Arthur Dent', priority: 'low', status: 'closed', assignedTo: 'John Doe', createdAt: '2026-03-30 16:45' },
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API: Get all devices
  app.get("/api/devices", (req, res) => {
    const deviceList = Object.values(devices).map(d => {
      // Mark as offline if no heartbeat for 2 minutes
      const isOffline = Date.now() - d.lastSeen > 120000;
      return {
        ...d,
        status: isOffline ? 'offline' : d.status,
        lastSeen: isOffline ? 'Offline' : 'Just now'
      };
    });
    res.json(deviceList);
  });

  // API: Get all assets
  app.get("/api/assets", (req, res) => {
    res.json(assets);
  });

  // API: Get all tickets
  app.get("/api/tickets", (req, res) => {
    res.json(tickets);
  });

  // API: Get all threats
  app.get("/api/threats", (req, res) => {
    res.json(threats);
  });

  // API: Heartbeat from Go Agent
  app.post("/api/heartbeat", (req, res) => {
    const { id, name, ip, os, cpu, ram, clamav } = req.body;
    
    if (!id || !name) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    devices[id] = {
      id,
      name,
      ip: ip || 'Unknown',
      os: os || 'Linux',
      cpu: cpu || 0,
      ram: ram || 0,
      status: cpu > 80 ? 'warning' : 'online',
      lastSeen: Date.now(),
      clamav: clamav || devices[id]?.clamav
    };

    console.log(`Heartbeat received from ${name} (${id})`);
    res.json({ status: "ok" });
  });

  // API: Report Threat from Go Agent
  app.post("/api/threats", (req, res) => {
    const { deviceId, deviceName, filePath, threatName, actionTaken } = req.body;
    
    const newThreat: Threat = {
      id: `T${Date.now()}`,
      deviceId,
      deviceName,
      filePath,
      threatName,
      detectedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      actionTaken: actionTaken || 'quarantined'
    };

    threats.unshift(newThreat);
    if (threats.length > 50) threats.pop(); // Keep last 50 threats

    console.log(`Threat detected on ${deviceName}: ${threatName}`);
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
