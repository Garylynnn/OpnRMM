# FrappeRMM - Remote Monitoring & Management

A clean, modular RMM dashboard inspired by the Frappe framework.

## Features
- **Dashboard**: Real-time overview of your infrastructure.
- **Device Management**: Monitor CPU, RAM, and status of servers/workstations.
- **Asset Management**: Track hardware, software, and licenses.
- **IT Ticket Management**: Manage support requests with priority and status.
- **Go Agent**: Lightweight agent for real-time monitoring on Ubuntu/Linux/Windows.
- **AI Previews**: Visualize advanced features using Google Gemini AI.

---

## 🚀 Deployment (Ubuntu Server)

### Prerequisites
- Docker & Docker Compose installed.
- A Google Gemini API Key (for AI previews).

### 1. Clone the Repository
```bash
git clone <your-github-repo-url>
cd frappe-rmm
```

### 2. Configure Environment
Create a `.env` file:
```bash
GEMINI_API_KEY=your_gemini_api_key_here
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

## 📄 License
Apache-2.0
