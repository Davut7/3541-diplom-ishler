# Wireshark Network Monitor

## Diploma Project: Network Traffic Analysis with Wireshark
### Wireshark bilen tor trafikini seljermek we gözegçilik etmek

**Author / Awtor:** Shanur Gulmyradow

---

## Table of Contents / Mazmuny

1. [Project Overview](#project-overview)
2. [What is Wireshark?](#what-is-wireshark)
3. [Network Protocols](#network-protocols)
4. [OSI Model](#osi-model)
5. [Packet Capture](#packet-capture)
6. [Traffic Analysis](#traffic-analysis)
7. [Security Monitoring](#security-monitoring)
8. [Technology Stack](#technology-stack)
9. [Installation](#installation)
10. [Usage](#usage)

---

## Project Overview

This diploma project demonstrates network traffic analysis techniques similar to Wireshark. It provides:

- **Real-time packet capture simulation** - Wireshark-like interface
- **Protocol analysis** - 12 network protocols supported
- **Traffic visualization** - Charts and statistics
- **Security monitoring** - Anomaly detection
- **Bilingual interface** - English / Turkmen

### Why Network Monitoring Matters

Network monitoring is essential for:
- **Security** - Detecting attacks and intrusions
- **Troubleshooting** - Finding network issues
- **Performance** - Analyzing bandwidth usage
- **Compliance** - Ensuring policy adherence

---

## What is Wireshark?

**Wireshark** is the world's most widely used network protocol analyzer. It allows you to:

- Capture network packets in real-time
- Decode hundreds of protocols
- Analyze packet contents
- Filter traffic based on criteria
- Export data for further analysis

### How Wireshark Works

```
┌─────────────────────────────────────────────────────────────┐
│                    Wireshark Architecture                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   Network Interface (eth0, wlan0)                            │
│           │                                                  │
│           ▼                                                  │
│   ┌───────────────┐                                         │
│   │ Packet Capture │ ← Promiscuous Mode                     │
│   │    (libpcap)   │                                         │
│   └───────────────┘                                         │
│           │                                                  │
│           ▼                                                  │
│   ┌───────────────┐                                         │
│   │   Dissectors   │ ← Protocol Decoding                    │
│   │  (TCP, HTTP..) │                                         │
│   └───────────────┘                                         │
│           │                                                  │
│           ▼                                                  │
│   ┌───────────────┐                                         │
│   │    Display     │ ← Filtering & Analysis                 │
│   │   Interface    │                                         │
│   └───────────────┘                                         │
└─────────────────────────────────────────────────────────────┘
```

---

## Network Protocols

### Application Layer (Layer 7)

| Protocol | Port | Description |
|----------|------|-------------|
| **HTTP** | 80 | HyperText Transfer Protocol - Web pages |
| **HTTPS** | 443 | HTTP Secure - Encrypted web traffic |
| **DNS** | 53 | Domain Name System - Name resolution |
| **FTP** | 21 | File Transfer Protocol - File sharing |
| **SSH** | 22 | Secure Shell - Encrypted remote access |
| **SMTP** | 25 | Simple Mail Transfer - Email |
| **DHCP** | 67/68 | Dynamic Host Configuration - IP assignment |
| **NTP** | 123 | Network Time Protocol - Time sync |

### Transport Layer (Layer 4)

| Protocol | Description |
|----------|-------------|
| **TCP** | Transmission Control Protocol - Reliable, ordered delivery with error checking |
| **UDP** | User Datagram Protocol - Fast, connectionless, no guarantee of delivery |

### Network Layer (Layer 3)

| Protocol | Description |
|----------|-------------|
| **IP** | Internet Protocol - Packet addressing and routing |
| **ICMP** | Internet Control Message Protocol - Ping, traceroute, error messages |

### Data Link Layer (Layer 2)

| Protocol | Description |
|----------|-------------|
| **ARP** | Address Resolution Protocol - Maps IP to MAC addresses |
| **Ethernet** | Frame-based protocol for local network communication |

---

## OSI Model

The **Open Systems Interconnection (OSI)** model is a conceptual framework for understanding network protocols:

```
┌───────────────────────────────────────────────────────────┐
│ Layer │   Name        │ Protocols           │ Data Unit  │
├───────────────────────────────────────────────────────────┤
│   7   │ Application   │ HTTP, DNS, FTP, SSH │ Data       │
│   6   │ Presentation  │ SSL/TLS, JPEG, GIF  │ Data       │
│   5   │ Session       │ NetBIOS, RPC        │ Data       │
│   4   │ Transport     │ TCP, UDP            │ Segment    │
│   3   │ Network       │ IP, ICMP, IGMP      │ Packet     │
│   2   │ Data Link     │ Ethernet, ARP, PPP  │ Frame      │
│   1   │ Physical      │ Cables, Hubs        │ Bits       │
└───────────────────────────────────────────────────────────┘
```

### Encapsulation Process

When data is sent over a network:
1. **Application** creates data
2. **Transport** adds TCP/UDP header (segment)
3. **Network** adds IP header (packet)
4. **Data Link** adds MAC header + trailer (frame)
5. **Physical** converts to electrical signals (bits)

---

## Packet Capture

### What is Packet Capture?

Packet capture (pcap) is the process of intercepting and logging network traffic. It is essential for:

- Network troubleshooting
- Security analysis
- Protocol development
- Performance monitoring

### Promiscuous Mode

In promiscuous mode, the network interface captures ALL packets on the network segment, not just those addressed to it.

```
Normal Mode:       Captures only packets addressed to this host
Promiscuous Mode:  Captures ALL packets on the network segment
```

### Capture Filters (BPF Syntax)

```
tcp port 80          # HTTP traffic only
udp port 53          # DNS queries only
host 192.168.1.1     # Traffic to/from specific IP
tcp[tcpflags] & tcp-syn != 0  # SYN packets (connection attempts)
not arp              # Exclude ARP traffic
port 80 or port 443  # HTTP or HTTPS
```

---

## Traffic Analysis

### Protocol Hierarchy

After capture, analyze protocol distribution:

```
Ethernet (100%)
└── Internet Protocol (95%)
    ├── TCP (72%)
    │   ├── HTTP (15%)
    │   ├── HTTPS (45%)
    │   └── Other TCP (12%)
    ├── UDP (20%)
    │   ├── DNS (12%)
    │   └── Other UDP (8%)
    └── ICMP (3%)
└── ARP (5%)
```

### Top Talkers Analysis

Identify hosts generating the most traffic:

| Rank | IP Address | Hostname | Packets | Bytes |
|------|------------|----------|---------|-------|
| 1 | 192.168.1.100 | workstation | 15,234 | 2.3 GB |
| 2 | 192.168.1.50 | server | 12,890 | 1.8 GB |
| 3 | 8.8.8.8 | dns.google | 8,945 | 890 MB |

### Conversation Analysis

Track communication between hosts:
- Source/Destination pairs
- Data transferred in each direction
- Protocol used
- Duration

---

## Security Monitoring

### Types of Network Threats

#### 1. Port Scanning
```
Indicator: Multiple SYN packets to different ports from same source
Action: Block source IP, alert administrator
```

#### 2. DDoS Attacks
```
Indicator: High volume of traffic from multiple sources
Action: Rate limiting, traffic filtering, upstream mitigation
```

#### 3. Data Exfiltration
```
Indicator: Large outbound transfers to unknown IPs
Action: Block transfer, investigate source
```

#### 4. DNS Tunneling
```
Indicator: Abnormally long DNS queries, high DNS traffic
Action: DNS query inspection, block suspicious domains
```

### Security Best Practices

1. **Monitor baseline traffic** - Know what's normal
2. **Set up alerts** - Automated notifications for anomalies
3. **Log everything** - Store captures for forensics
4. **Regular analysis** - Periodic security reviews

---

## Technology Stack

### Frontend
- **Vue.js 3** - Progressive JavaScript framework
- **Composition API** - Modern reactive programming
- **PrimeVue 4** - Enterprise UI components
- **Chart.js** - Data visualization
- **PrimeIcons** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **REST API** - Data endpoints

### Features
- Real-time packet simulation
- Protocol analysis
- Statistics and charts
- Security alerts
- Bilingual (EN/TK)

---

## Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Quick Start

```bash
# Clone/navigate to project
cd "shanur gulmyradow"

# Install backend
cd backend
npm install

# Install frontend
cd ../frontend
npm install

# Start servers
cd ..
./start.sh
```

### Manual Start

```bash
# Terminal 1 - Backend
cd backend
node server.js
# Running on http://localhost:7009

# Terminal 2 - Frontend
cd frontend
npm run dev
# Running on http://localhost:7010
```

---

## Usage

### 1. Home Page
Overview with live network statistics and feature highlights.

### 2. Capture Page
- Select network interface
- Apply capture filters
- Start/Stop capture
- View packets in real-time
- Inspect packet details
- View hex dump

### 3. Analyze Page
- Upload capture files
- Analyze traffic patterns
- View protocol distribution
- Detect anomalies
- See top talkers

### 4. Protocols Page
- Learn about network protocols
- OSI model visualization
- Protocol port information
- Searchable protocol list

### 5. Statistics Page
- Protocol distribution charts
- Traffic over time graphs
- Top ports analysis
- Connection states
- Security alerts

### 6. How It Works
- Packet capture process
- Protocol decoding
- FAQ section

---

## Q&A for Diploma Defense

### 1. Wireshark näme? / What is Wireshark?
Wireshark dünýäde iň köp ulanylýan tor protokol analizatorydyr. Tor paketlerini hakyky wagtda tutýar we seljerýär.

### 2. Promiscuous režimi näme? / What is promiscuous mode?
Tor interfeýsiniň diňe özüne salgylananlary däl, tor segmentindäki ähli paketleri tutmagyna mümkinçilik berýän režim.

### 3. Paket tutmak näme üçin möhüm? / Why is packet capture important?
Tor howpsuzlygyny üpjün etmek, näsazlyklary düzetmek we tor öndürijiligini seljermek üçin zerur.

### 4. TCP bilen UDP arasynda näme tapawut bar? / Difference between TCP and UDP?
TCP ygtybarly we tertipli eltip berýär, UDP bolsa çalt ýöne kepilliksiz.

### 5. Bu taslama nähili döredildi? / How was this project created?
Vue.js 3 frontend, Node.js backend. Wireshark-yň işleýşini simulýasiýa edýär.

---

## API Documentation

### Base URL
```
http://localhost:7009/api
```

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/packets | Get simulated packets |
| GET | /api/interfaces | List network interfaces |
| GET | /api/protocols | Get protocol information |
| POST | /api/analyze | Analyze traffic |
| GET | /api/statistics | Get network statistics |
| GET | /api/hosts | List network hosts |

---

## License

This project is part of a diploma thesis and is for educational purposes.

---

**Author:** Shanur Gulmyradow
**Project:** Diploma - Network Traffic Analysis with Wireshark
**Year:** 2026

© 2026 Shanur Gulmyradow - Diplom Taslamasy
