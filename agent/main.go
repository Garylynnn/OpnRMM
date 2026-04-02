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

// CONFIGURATION: Update this to your server's public URL
const ServerURL = "http://localhost:3000/api/heartbeat"

type ClamAVStatus struct {
	Active          bool   `json:"active"`
	Version         string `json:"version"`
	LastScan        string `json:"lastScan"`
	ThreatsFound    int    `json:"threatsFound"`
	RealTimeEnabled bool   `json:"realTimeEnabled"`
}

type Heartbeat struct {
	ID     string        `json:"id"`
	Name   string        `json:"name"`
	IP     string        `json:"ip"`
	OS     string        `json:"os"`
	CPU    float64       `json:"cpu"`
	RAM    float64       `json:"ram"`
	ClamAV ClamAVStatus `json:"clamav"`
}

type ThreatReport struct {
	DeviceID    string `json:"deviceId"`
	DeviceName  string `json:"deviceName"`
	FilePath    string `json:"filePath"`
	ThreatName  string `json:"threatName"`
	ActionTaken string `json:"actionTaken"`
}

func main() {
	hostname, _ := os.Hostname()
	id := hostname // Using hostname as unique ID

	fmt.Printf("Starting FrappeRMM Agent on %s...\n", hostname)
	fmt.Printf("Reporting to: %s\n", ServerURL)

	// Simulation: Randomly report a threat every 5 minutes for demo
	go func() {
		for {
			time.Sleep(5 * time.Minute)
			reportMockThreat(id, hostname)
		}
	}()

	for {
		// Collect CPU stats
		cpuPercent, err := cpu.Percent(time.Second, false)
		if err != nil {
			log.Printf("Error getting CPU: %v", err)
			cpuPercent = []float64{0}
		}
		
		// Collect RAM stats
		vMem, err := mem.VirtualMemory()
		if err != nil {
			log.Printf("Error getting RAM: %v", err)
			vMem = &mem.VirtualMemoryStat{UsedPercent: 0}
		}

		// Check ClamAV status (Simulated for this demo)
		// In production, you would check if `clamd` service is running
		clamStatus := ClamAVStatus{
			Active:          true,
			Version:         "ClamAV 1.0.1",
			LastScan:        time.Now().Format("2006-01-02 15:04"),
			ThreatsFound:    0,
			RealTimeEnabled: true,
		}

		data := Heartbeat{
			ID:     id,
			Name:   hostname,
			IP:     "127.0.0.1",
			OS:     runtime.GOOS,
			CPU:    cpuPercent[0],
			RAM:    vMem.UsedPercent,
			ClamAV: clamStatus,
		}

		sendHeartbeat(data)
		time.Sleep(30 * time.Second) // Send every 30 seconds
	}
}

func reportMockThreat(id, name string) {
	threat := ThreatReport{
		DeviceID:    id,
		DeviceName:  name,
		FilePath:    "/tmp/malware_test.sh",
		ThreatName:  "Unix.Malware.Agent-1234",
		ActionTaken: "quarantined",
	}

	jsonData, _ := json.Marshal(threat)
	http.Post(fmt.Sprintf("%s/../threats", ServerURL), "application/json", bytes.NewBuffer(jsonData))
	log.Printf("!!! Security Threat Reported: %s", threat.ThreatName)
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
		log.Printf("Heartbeat sent: CPU %.1f%%, RAM %.1f%%", data.CPU, data.RAM)
	} else {
		log.Printf("Server error: %s", resp.Status)
	}
}
