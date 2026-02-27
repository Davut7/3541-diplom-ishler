# TMDDI Group 3541 - Diploma Projects

## Cybersecurity Diploma Projects Collection

This repository contains all diploma projects for TMDDI Group 3541, focusing on various cybersecurity topics.

---

## Projects Overview

| # | Author | Topic (EN) | Topic (TM) | Frontend | Backend |
|---|--------|------------|------------|----------|---------|
| 1 | Bayram Gochmyradow | Network Traffic Analysis | Tor trafikini seljermek we howpsuzlygy üpjün etmek | 7002 | 7001 |
| 2 | Suleyman Akmuhammedow | AI-Assisted OSINT Tools | Emeli aň kömegi bilen OSINT guralary | 7004 | 7003 |
| 3 | Selbi Weliyyewa | AI Password Strength Analyzer | Emeli aň bilen parol güýjüni derňemek | 7006 | 7005 |
| 4 | Dawutmuhammet Begmedow | Vulnerability Scanner | Tor howpsuzlygyny barlaýjy ulgam | 7008 | 7007 |
| 5 | Shanur Gulmyradow | Network Packet Analyzer | Tor paketlerini derňeýji ulgam | 7010 | 7009 |
| 6 | Daniyar Nurmedow | Intrusion Detection System | Tor gorag ulgamy | 7012 | 7011 |
| 7 | Rowshen Orazmuhammedow | DDoS Attack Protection | DDoS hüjümlerinden gorag | 7014 | 7013 |
| 8 | Shatlyk Rahmanov | AI-Powered Firewall | Emeli aň bilen firewall ulgamy | 7016 | 7015 |
| 9 | Batyr Akyýew | WAF with Behavioral Analysis | Ulanyjynyň hereketine görä işleýän web gorag ulgamy | 7018 | 7017 |

---

## Quick Start with PM2

### Prerequisites

- Node.js 18+
- npm
- PM2 (will be installed automatically)

### Commands

```bash
# Install dependencies for all projects
./start-all.sh install

# Start all projects
./start-all.sh start

# Stop all projects
./start-all.sh stop

# Restart all projects
./start-all.sh restart

# View status
./start-all.sh status

# View logs
./start-all.sh logs

# Delete all PM2 processes
./start-all.sh delete
```

---

## Individual Project Start

Each project can be started individually using its own `start.sh`:

```bash
# Example: Start Bayram's project
cd "bayram gochmyradow"
./start.sh

# Example: Start Selbi's project
cd "selbi weliyyewa"
./start.sh
```

---

## Technology Stack

All projects use:

- **Frontend:** Vue.js 3, PrimeVue 4 (Aura Theme), Chart.js
- **Backend:** Node.js, Express.js
- **Languages:** English / Turkmen (Bilingual)
- **Theme:** Dark/Light mode support

---

## Port Allocation

| Port Range | Usage |
|------------|-------|
| 7001-7002 | Bayram Gochmyradow |
| 7003-7004 | Suleyman Akmuhammedow |
| 7005-7006 | Selbi Weliyyewa |
| 7007-7008 | Dawutmuhammet Begmedow |
| 7009-7010 | Shanur Gulmyradow |
| 7011-7012 | Daniyar Nurmedow |
| 7013-7014 | Rowshen Orazmuhammedow |
| 7015-7016 | Shatlyk Rahmanov |
| 7017-7018 | Batyr Akyýew |

---

## Project Structure

```
3541/
├── ecosystem.config.js     # PM2 configuration
├── start-all.sh           # PM2 management script
├── README.md              # This file
│
├── bayram gochmyradow/    # Network Traffic Analysis
├── suleyman akmuhammedow/ # OSINT AI Tools
├── selbi weliyyewa/       # Password Analyzer
├── dawutmuhammet begmedow/# Vulnerability Scanner
├── shanur gulmyradow/     # Packet Analyzer
├── daniyar nurmedow/      # IDS System
├── rowshen orazmuhammedow/# DDoS Protection
├── shatlyk rahmanov/      # AI Firewall
└── batyr akyýew/          # WAF Behavioral
```

---

© 2026 TMDDI Group 3541 - Diploma Projects
