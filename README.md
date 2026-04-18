# TMDDI Group 3541 - Diploma Projects

## Cybersecurity Diploma Projects Collection

This repository contains all diploma projects for TMDDI Group 3541, focusing on various cybersecurity topics.

---

## Projects Overview

| # | Author | Topic (EN) | Topic (TM) | Frontend | Backend |
|---|--------|------------|------------|----------|---------|
| 1 | Bayram Gochmyradow | Android Security Analyzer | Android programmalarynda howpsuzlyk derňewi | 7020 | 7021 |
| 2 | Suleyman Akmuhammedow | AI-Assisted OSINT Tools | Emeli aň kömegi bilen OSINT guralary | 7090 | 7091 |
| 3 | Selbi Weliyyewa | GAN Security Analyzer | GAN-lara hüjümler we howpsuzlyk | 7060 | 7061 |
| 4 | Dawutmuhammet Begmedow | VirusDetect Pro | Antiwiruslaryň anyklamasyndan gaçýan wirusleri anyklamak | 7040 | 7041 |
| 5 | Shanur Gulmyradow | Network Packet Analyzer | Tor paketlerini derňeýji ulgam | 7070 | 7071 |
| 6 | Daniyar Nurmedow | XSS Shield | XSS hüjümlerinden gorag | 7030 | 7031 |
| 7 | Rowshen Palwanow | KeyGuard Keylogger Scanner | Keylogger anyklaýjy ulgam | 7050 | 7051 |
| 8 | Shatlyk Rahmanov | AI-Powered Firewall | Emeli aň bilen firewall ulgamy | 7080 | 7081 |
| 9 | Batyr Akyýew | WAF with Behavioral Analysis | Ulanyjynyň hereketine görä işleýän web gorag ulgamy | 7010 | 7011 |

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
| 7010-7011 | Batyr Akyýew |
| 7020-7021 | Bayram Gochmyradow |
| 7030-7031 | Daniyar Nurmedow |
| 7040-7041 | Dawutmuhammet Begmedow |
| 7050-7051 | Rowshen Palwanow |
| 7060-7061 | Selbi Weliyyewa |
| 7070-7071 | Shanur Gulmyradow |
| 7080-7081 | Shatlyk Rahmanov |
| 7090-7091 | Suleyman Akmuhammedow |

---

## Project Structure

```
3541/
├── ecosystem.config.js     # PM2 configuration
├── start-all.sh           # PM2 management script
├── README.md              # This file
│
├── batyr_akyýew/          # WAF Behavioral Analysis (7010/7011)
├── bayram_gochmyradow/    # Android Security Analyzer (7020/7021)
├── daniyar_nurmedow/      # XSS Shield (7030/7031)
├── dawutmuhammet_begmedow/# VirusDetect Pro (7040/7041)
├── rowshen_palwanow/      # KeyGuard Scanner (7050/7051)
├── selbi_weliyyewa/       # GAN Security Analyzer (7060/7061)
├── shanur_gulmyradow/     # Network Packet Analyzer (7070/7071)
├── shatlyk_rahmanov/      # AI Firewall (7080/7081)
└── suleyman_akmuhammedow/ # OSINT.AI Tools (7090/7091)
```

---

© 2026 TMDDI Group 3541 - Diploma Projects
