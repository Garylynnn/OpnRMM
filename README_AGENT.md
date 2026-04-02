# FrappeRMM Go Agent

This is a lightweight agent written in Go to collect system metrics and send heartbeats to the FrappeRMM dashboard.

## Prerequisites

- [Go](https://golang.org/doc/install) installed on the target VM.
- `gopsutil` library for system metrics.

## The Agent Code (`agent.go`)

```go
package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"runtime"
	"time"

	"github.com/shirou/gopsutil/cpu"
	"github.com/shirou/gopsutil/mem"
)

// Replace with your actual RMM Server URL
const ServerURL = "https://your-rmm-app.run.app/api/heartbeat"

type Heartbeat struct {
	ID   string  `json:"id"`
	Name string  `json:"name"`
	IP   string  `json:"ip"`
	OS   string  `json:"os"`
	CPU  float64 `json:"cpu"`
	RAM  float64 `json:"ram"`
}

func main() {
	hostname, _ := os.Hostname()
	id := hostname // Using hostname as unique ID for this demo

	fmt.Printf("Starting FrappeRMM Agent on %s...\n", hostname)

	for {
		// Collect CPU stats
		cpuPercent, _ := cpu.Percent(time.Second, false)
		
		// Collect RAM stats
		vMem, _ := mem.VirtualMemory()

		data := Heartbeat{
			ID:   id,
			Name: hostname,
			IP:   "127.0.0.1", // In a real app, you'd detect public/private IP
			OS:   runtime.GOOS,
			CPU:  cpuPercent[0],
			RAM:  vMem.UsedPercent,
		}

		sendHeartbeat(data)
		time.Sleep(30 * time.Second) // Send every 30 seconds
	}
}

func sendHeartbeat(data Heartbeat) {
	jsonData, err := json.Marshal(data)
	if err != nil {
		log.Printf("Error encoding JSON: %v", err)
		return
	}

	resp, err := http.Post(ServerURL, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		log.Printf("Failed to send heartbeat: %v", err)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode == http.StatusOK {
		log.Printf("Heartbeat sent successfully: CPU %.1f%%, RAM %.1f%%", data.CPU, data.RAM)
	} else {
		log.Printf("Server returned error: %s", resp.Status)
	}
}
```

## How to Build and Run

1.  **Initialize the Go module**:
    ```bash
    go mod init rmm-agent
    go get github.com/shirou/gopsutil/cpu
    go get github.com/shirou/gopsutil/mem
    ```

2.  **Build the binary**:
    ```bash
    # For the current OS
    go build -o rmm-agent agent.go

    # For a Linux VM (from Windows/Mac)
    GOOS=linux GOARCH=amd64 go build -o rmm-agent-linux agent.go
    ```

3.  **Run on the VM**:
    ```bash
    ./rmm-agent
    ```

The agent will now start reporting its status to your FrappeRMM dashboard every 30 seconds.
