import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Monitor, 
  ShieldCheck, 
  Shield,
  AlertTriangle,
  Terminal, 
  Settings, 
  Search, 
  Bell, 
  User, 
  ChevronRight, 
  MoreVertical,
  Cpu,
  HardDrive,
  Activity,
  AlertCircle,
  AlertTriangle as AlertTriangleIcon,
  Plus,
  Package,
  Ticket as TicketIcon,
  Clock,
  CheckCircle2,
  Filter,
  Download,
  Calendar
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Device, Asset, Ticket, Threat } from './types';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Mock Data
const PERFORMANCE_DATA = [
  { time: '09:00', cpu: 20, ram: 40 },
  { time: '10:00', cpu: 35, ram: 42 },
  { time: '11:00', cpu: 25, ram: 45 },
  { time: '12:00', cpu: 45, ram: 48 },
  { time: '13:00', cpu: 30, ram: 44 },
  { time: '14:00', cpu: 55, ram: 50 },
  { time: '15:00', cpu: 40, ram: 46 },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [devices, setDevices] = useState<Device[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [threats, setThreats] = useState<Threat[]>([]);

  useEffect(() => {
    const fetchData = async (retries = 3) => {
      try {
        const baseUrl = window.location.origin;
        console.log(`Fetching from: ${baseUrl}/api/devices (Attempt ${4 - retries})`);
        
        const [devRes, assetRes, ticketRes, threatRes] = await Promise.all([
          fetch(`${baseUrl}/api/devices`),
          fetch(`${baseUrl}/api/assets`),
          fetch(`${baseUrl}/api/tickets`),
          fetch(`${baseUrl}/api/threats`)
        ]);

        if (devRes.ok) setDevices(await devRes.json());
        if (assetRes.ok) setAssets(await assetRes.json());
        if (ticketRes.ok) setTickets(await ticketRes.json());
        if (threatRes.ok) setThreats(await threatRes.json());
      } catch (err) {
        console.error("Failed to fetch data:", err);
        if (retries > 0) {
          console.log(`Retrying in 2 seconds... (${retries} left)`);
          setTimeout(() => fetchData(retries - 1), 2000);
        }
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const filteredDevices = devices.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.ip.includes(searchQuery)
  );

  const filteredAssets = assets.filter(a => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.serialNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTickets = tickets.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.requester.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredThreats = threats.filter(t => 
    t.deviceName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.threatName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#F4F5F7] text-gray-900 font-sans selection:bg-blue-100">
      {/* Sidebar - Frappe Style */}
      <aside className="w-64 bg-white border-right border-gray-200 flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <ShieldCheck className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight">FrappeRMM</span>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { id: 'devices', icon: Monitor, label: 'Devices' },
            { id: 'assets', icon: Package, label: 'Assets' },
            { id: 'tickets', icon: TicketIcon, label: 'Tickets' },
            { id: 'automation', icon: Terminal, label: 'Automation' },
            { id: 'security', icon: ShieldCheck, label: 'Security' },
            { id: 'reports', icon: Activity, label: 'Reports' },
            { id: 'settings', icon: Settings, label: 'Settings' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                activeTab === item.id 
                  ? "bg-blue-50 text-blue-600 shadow-sm" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
              GL
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">Gary Lin</p>
              <p className="text-xs text-gray-500 truncate">Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder={`Search ${activeTab}...`}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm">
              <Plus className="w-4 h-4" />
              New {activeTab === 'tickets' ? 'Ticket' : activeTab === 'assets' ? 'Asset' : 'Device'}
            </button>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {activeTab === 'dashboard' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Devices', value: '124', icon: Monitor, color: 'text-blue-600', bg: 'bg-blue-50' },
                  { label: 'Open Tickets', value: '8', icon: TicketIcon, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                  { label: 'Critical Alerts', value: '3', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
                  { label: 'Asset Value', value: '$42.5k', icon: Package, color: 'text-green-600', bg: 'bg-green-50' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className={cn("p-2 rounded-lg", stat.bg)}>
                        <stat.icon className={cn("w-5 h-5", stat.color)} />
                      </div>
                      <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">+4%</span>
                    </div>
                    <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                    <h2 className="text-2xl font-bold mt-1">{stat.value}</h2>
                  </div>
                ))}
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-lg">Network Performance</h3>
                    <select className="text-xs border-none bg-gray-50 rounded-md p-1 focus:ring-0">
                      <option>Last 24 Hours</option>
                      <option>Last 7 Days</option>
                    </select>
                  </div>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={PERFORMANCE_DATA}>
                        <defs>
                          <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                        <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9CA3AF'}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9CA3AF'}} />
                        <Tooltip 
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Area type="monotone" dataKey="cpu" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorCpu)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="font-bold text-lg mb-6">System Health</h3>
                  <div className="space-y-6">
                    {[
                      { label: 'CPU Usage', value: 42, color: 'bg-blue-500' },
                      { label: 'Memory Usage', value: 68, color: 'bg-indigo-500' },
                      { label: 'Disk Space', value: 24, color: 'bg-green-500' },
                      { label: 'Network Load', value: 15, color: 'bg-amber-500' },
                    ].map((item, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500 font-medium">{item.label}</span>
                          <span className="font-bold">{item.value}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${item.value}%` }}
                            className={cn("h-full rounded-full", item.color)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'devices' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-lg">Device Inventory</h3>
                <div className="flex gap-2">
                  <button className="text-sm px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                    <Filter className="w-4 h-4" /> Filter
                  </button>
                  <button className="text-sm px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                    <Download className="w-4 h-4" /> Export
                  </button>
                </div>
              </div>
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                    <th className="px-6 py-4">Device Name</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">OS</th>
                    <th className="px-6 py-4">IP Address</th>
                    <th className="px-6 py-4">Performance</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredDevices.map((device) => (
                    <tr key={device.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                            <Monitor className="w-4 h-4 text-gray-500" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{device.name}</p>
                            <p className="text-xs text-gray-500">Last seen {device.lastSeen}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium",
                          device.status === 'online' ? "bg-green-50 text-green-700" :
                          device.status === 'warning' ? "bg-amber-50 text-amber-700" :
                          "bg-gray-100 text-gray-600"
                        )}>
                          <span className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            device.status === 'online' ? "bg-green-500" :
                            device.status === 'warning' ? "bg-amber-500" :
                            "bg-gray-400"
                          )} />
                          {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{device.os}</td>
                      <td className="px-6 py-4 text-sm font-mono text-gray-500">{device.ip}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Cpu className="w-3 h-3 text-gray-400" />
                            <span className="text-xs font-medium">{device.cpu}%</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <HardDrive className="w-3 h-3 text-gray-400" />
                            <span className="text-xs font-medium">{device.ram}%</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-all opacity-0 group-hover:opacity-100">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}

          {activeTab === 'assets' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-lg">Asset Management</h3>
                <div className="flex gap-2">
                  <button className="text-sm px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                    <Filter className="w-4 h-4" /> Filter
                  </button>
                  <button className="text-sm px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                    <Download className="w-4 h-4" /> Export
                  </button>
                </div>
              </div>
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                    <th className="px-6 py-4">Asset Name</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Serial Number</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Purchase Date</th>
                    <th className="px-6 py-4 text-right">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredAssets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center">
                            <Package className="w-4 h-4 text-blue-600" />
                          </div>
                          <p className="text-sm font-semibold">{asset.name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-xs font-medium",
                          asset.type === 'Hardware' ? "bg-purple-50 text-purple-700" :
                          asset.type === 'Software' ? "bg-blue-50 text-blue-700" :
                          "bg-green-50 text-green-700"
                        )}>
                          {asset.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-mono text-gray-500">{asset.serialNumber || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{asset.location}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{asset.purchaseDate}</td>
                      <td className="px-6 py-4 text-right text-sm font-bold">${asset.value.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}

          {activeTab === 'tickets' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-lg">IT Support Tickets</h3>
                <div className="flex gap-2">
                  <button className="text-sm px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                    <Filter className="w-4 h-4" /> Filter
                  </button>
                </div>
              </div>
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                    <th className="px-6 py-4">Ticket</th>
                    <th className="px-6 py-4">Requester</th>
                    <th className="px-6 py-4">Priority</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Assigned To</th>
                    <th className="px-6 py-4 text-right">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredTickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-indigo-50 flex items-center justify-center">
                            <TicketIcon className="w-4 h-4 text-indigo-600" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{ticket.title}</p>
                            <p className="text-xs text-gray-500">{ticket.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{ticket.requester}</td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-xs font-bold uppercase",
                          ticket.priority === 'high' ? "bg-red-50 text-red-700" :
                          ticket.priority === 'medium' ? "bg-amber-50 text-amber-700" :
                          "bg-blue-50 text-blue-700"
                        )}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          {ticket.status === 'open' && <Clock className="w-3 h-3 text-blue-500" />}
                          {ticket.status === 'in-progress' && <Activity className="w-3 h-3 text-amber-500" />}
                          {ticket.status === 'closed' && <CheckCircle2 className="w-3 h-3 text-green-500" />}
                          <span className="text-xs font-medium capitalize">{ticket.status.replace('-', ' ')}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{ticket.assignedTo}</td>
                      <td className="px-6 py-4 text-right text-xs text-gray-500">{ticket.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-500">ClamAV Active</h3>
                    <Shield className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="text-2xl font-bold">{devices.filter(d => d.clamav?.active).length} / {devices.length}</div>
                  <p className="text-xs text-gray-400 mt-1">Devices with active protection</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-500">Real-time Scanning</h3>
                    <Activity className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="text-2xl font-bold">{devices.filter(d => d.clamav?.realTimeEnabled).length}</div>
                  <p className="text-xs text-gray-400 mt-1">Devices with On-Access enabled</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-500">Total Threats</h3>
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  </div>
                  <div className="text-2xl font-bold">{threats.length}</div>
                  <p className="text-xs text-gray-400 mt-1">Total detections across network</p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="text-lg font-bold">Recent Security Threats</h2>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Clear History</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                        <th className="px-6 py-4">Device</th>
                        <th className="px-6 py-4">Threat Name</th>
                        <th className="px-6 py-4">File Path</th>
                        <th className="px-6 py-4">Detected At</th>
                        <th className="px-6 py-4">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredThreats.map((threat) => (
                        <tr key={threat.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 font-medium text-sm">{threat.deviceName}</td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-red-50 text-red-700 rounded text-xs font-bold uppercase">
                              {threat.threatName}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs text-gray-500 font-mono truncate max-w-xs" title={threat.filePath}>
                            {threat.filePath}
                          </td>
                          <td className="px-6 py-4 text-xs text-gray-500">{threat.detectedAt}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                              threat.actionTaken === 'quarantined' ? 'bg-amber-50 text-amber-700' : 
                              threat.actionTaken === 'deleted' ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {threat.actionTaken}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {filteredThreats.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">
                            No security threats detected.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-lg font-bold mb-4">ClamAV Status by Device</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {devices.map(device => (
                    <div key={device.id} className="p-4 border border-gray-100 rounded-xl flex items-center gap-4 hover:bg-gray-50 transition-colors">
                      <div className={`p-2 rounded-lg ${device.clamav?.active ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        <Shield className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-sm">{device.name}</div>
                        <div className="text-xs text-gray-500">
                          {device.clamav?.active ? `Active - ${device.clamav.version}` : 'Protection Disabled'}
                        </div>
                        {device.clamav?.active && (
                          <div className="text-[10px] text-gray-400 mt-1">
                            Last Scan: {device.clamav.lastScan}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
