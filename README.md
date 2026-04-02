# FrappeRMM - Remote Monitoring & Management

A clean, modular RMM dashboard inspired by the Frappe framework.

## Features
- **Dashboard**: Real-time overview of your infrastructure.
- **Device Management**: Monitor CPU, RAM, and status of servers/workstations.
- **Asset Management**: Track hardware, software, and licenses.
- **IT Ticket Management**: Manage support requests with priority and status.
- **Go Agent**: Lightweight agent for real-time monitoring on Ubuntu/Linux/Windows.

---

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Dev Server
```bash
npm run dev
```
The dashboard will be available at `http://localhost:3000`.

---

## 📸 Screenshots

### 🖥️ Dashboard Overview
![Dashboard Overview](https://picsum.photos/seed/rmm-dashboard/1200/600)

### 🛡️ Security Dashboard (ClamAV)
![Security Dashboard](https://picsum.photos/seed/rmm-security/1200/600)

### 📦 Asset Management
![Asset Management](https://picsum.photos/seed/rmm-assets/1200/600)

---

## 🐙 GitHub Hosting Guide

To host this project on your own GitHub account:

### 1. Create a New Repository
Go to [GitHub](https://github.com/new) and create a new repository named `frappe-rmm`.

### 2. Push Code to GitHub
On your local machine (or in the AI Studio terminal):
```bash
git init
git add .
git commit -m "Initial commit of FrappeRMM"
git branch -M main
git remote add origin https://github.com/<your-username>/frappe-rmm.git
git push -u origin main
```

### 3. Enable GitHub Actions (Optional)
You can set up a GitHub Action to automatically build and push your Docker image to GitHub Packages (GHCR).

---

## 🛠️ Technology Stack
- **Frontend**: React 19, Vite, Tailwind CSS 4, Lucide Icons, Framer Motion.
- **Backend**: Node.js, Express, TypeScript.
- **Agent**: Go (Golang) for high-performance monitoring.
- **Deployment**: Docker, Docker Compose.

---

## 📋 Detailed Features

### 🖥️ Dashboard & Monitoring
- **Real-time Heartbeats**: Devices report status every 30 seconds.
- **Performance Metrics**: Monitor CPU and RAM usage with live charts.
- **Offline Detection**: Automatically marks devices as offline if they miss heartbeats.

### 🛡️ Security (ClamAV)
- **Real-time Scanning**: Integration with ClamAV On-Access scanning.
- **Threat Dashboard**: View and manage security threats across all devices.
- **Quarantine Management**: Track actions taken on detected malware.

### 📦 Asset & Ticket Management
- **Inventory Tracking**: Manage hardware, software, and licenses.
- **Support Workflow**: Create and track tickets with priority levels and assignments.

---

## 🚀 Deployment (Ubuntu Server)

### Prerequisites
- Docker & Docker Compose installed.

### 1. Clone the Repository
```bash
git clone <your-github-repo-url>
cd frappe-rmm
```

### 2. Configure Environment
Create a `.env` file:
```bash
APP_URL=http://your-server-ip:3000
```

### 3. Start the Dashboard
```bash
docker compose up -d --build
```
Your dashboard will be available at `http://<your-server-ip>:3000`.

---

## 🛠️ Setting up the Go Agent on VMs

The agent collects system stats and sends them to the dashboard.

### 1. Install Go
On your Ubuntu VM:
```bash
sudo apt update
sudo apt install golang-go -y
```

### 2. Prepare the Agent
Copy the `agent/main.go` file to your VM. Update the `ServerURL` in `main.go` to point to your dashboard's IP:
```go
const ServerURL = "http://<your-dashboard-ip>:3000/api/heartbeat"
```

### 3. Build and Run
```bash
cd agent
go mod init rmm-agent
go get github.com/shirou/gopsutil/cpu
go get github.com/shirou/gopsutil/mem
go build -o rmm-agent main.go
./rmm-agent
```

## 🛡️ ClamAV Security Integration

This project includes a real-time security dashboard for ClamAV.

### 1. Install ClamAV on Ubuntu VM
```bash
sudo apt update
sudo apt install clamav clamav-daemon -y
```

### 2. Enable Real-time Scanning (On-Access)
Edit the ClamAV configuration:
```bash
sudo nano /etc/clamav/clamd.conf
```
Add or ensure these lines exist:
```text
ScanOnAccess yes
OnAccessIncludePath /home
OnAccessIncludePath /tmp
OnAccessPrevention yes
```
Restart the service:
```bash
sudo systemctl restart clamav-daemon
```

### 3. Agent Integration
The Go agent automatically detects if ClamAV is active and reports threats to the dashboard. The dashboard provides:
- Real-time threat alerts.
- Global protection status.
- Quarantine history.

---

## 📦 Project Structure
- `/src`: React frontend source code.
- `/server.ts`: Express backend for API and static file serving.
- `/agent`: Go source code for the monitoring agent.
- `/Dockerfile`: Production build configuration.
- `/docker-compose.yml`: Multi-container orchestration.

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 💬 Support
If you have any questions or need help, please open an issue on GitHub.

## 📄 License
Apache-2.0

---

*Built with ❤️ using AI Studio.*
