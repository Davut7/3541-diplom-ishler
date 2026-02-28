# OSINT.AI - AI-Assisted Open Source Intelligence Tools

## Diplom Taslamasy / Diploma Project

**Awtor / Author:** Süleýman Akmuhammedow

**Tema / Topic:**
- EN: AI-Assisted OSINT Tools for Ethical Cybersecurity Research
- TM: Emeli aň kömegi bilen OSINT guralary

---

## Taslama Hakynda / About the Project

OSINT.AI - bu açyk çeşmelerden maglumat ýygnamak we derňemek üçin döredilen web programmasy. Bu gural kiberhowpsuzlyk hünärmenlerine nyşanalary köpçülige açyk maglumatlar arkaly derňemäge kömek edýär.

OSINT.AI is a web application designed for gathering and analyzing information from open sources. This tool helps cybersecurity professionals analyze targets using publicly available information.

---

## Esasy Aýratynlyklar / Key Features

### 1. DNS Gözlegi / DNS Reconnaissance
- Domen atlaryny IP salgylaryna öwürmek
- DNS ýazgylaryny tapmak
- Resolve domain names to IP addresses
- Discover DNS records

### 2. IP Ýerleşişi / IP Geolocation
- IP salgylaryň geografiki ýerleşişini kesgitlemek
- ISP we gurama maglumatlaryny almak
- Determine geographic location of IP addresses
- Retrieve ISP and organization information

### 3. Port Skanirleme / Port Scanning
- Açyk portlary kesgitlemek
- Işleýän hyzmatlary tanamak
- Identify open ports
- Detect running services

### 4. WHOIS Aňtaw / WHOIS Intelligence
- Domen hasaba alyş maglumatlary
- Eýeçilik we möhlet maglumatlary
- Domain registration information
- Ownership and expiration details

### 5. Howp Bahasy / Risk Assessment
- AI esasly howp balyny hasaplamak
- Howpsuzlyk meselelerini kesgitlemek
- AI-powered risk score calculation
- Identify security issues

### 6. Hasabat Döretmek / Report Generation
- JSON we HTML formatlarynda eksport
- Çap etmek mümkinçiligi
- Export in JSON and HTML formats
- Print functionality

---

## Nähili Işleýär / How It Works

### 1. Nyşana Girişi / Target Input
Ulanyjy domen ady ýa-da IP salgy girizýär.
User enters a domain name or IP address.

### 2. Maglumat Ýygnamak / Data Gathering
Ulgam aşakdakylary ýerine ýetirýär:
- DNS çözgüdi
- Ping synag
- Port skanirleme
- WHOIS gözleg
- GeoIP gözleg

The system performs:
- DNS resolution
- Ping test
- Port scanning
- WHOIS lookup
- GeoIP lookup

### 3. Derňew / Analysis
AI ähli ýygnalan maglumatlary derňeýär we howp balyny hasaplaýar.
AI analyzes all gathered data and calculates risk score.

### 4. Hasabat / Report
Jikme-jik hasabat döredilýär we eksport edilip bilner.
Detailed report is generated and can be exported.

---

## Tehnologiýa Toplumy / Technology Stack

### Frontend
- **Vue.js 3** - Progresif JavaScript framework
- **PrimeVue** - UI komponent kitaphanasy
- **Vue Router** - SPA nawigasiýa
- **Chart.js** - Maglumat wizualizasiýasy
- **Axios** - HTTP müşderi

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **DNS Module** - DNS çözgüdi
- **Child Process** - Ulgam buýruklary

---

## Gurnamak / Installation

### Talaplary / Requirements
- Node.js 18+
- npm 9+

### Ädimleri / Steps

```bash
# 1. Backend gurnamak / Install backend
cd backend
npm install

# 2. Frontend gurnamak / Install frontend
cd ../frontend
npm install
```

---

## Başlatmak / Running

### Backend serveri / Backend server
```bash
cd backend
npm start
# Server: http://localhost:7003
```

### Frontend development server
```bash
cd frontend
npm run dev
# App: http://localhost:7004
```

### Production build
```bash
cd frontend
npm run build
```

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/analyze` | POST | Nyşanany derňemek / Analyze target |
| `/api/demo` | GET | Demo maglumatlary / Demo data |
| `/api/health` | GET | Server ýagdaýy / Server health |

---

## Howp Baly Hasaplamasy / Risk Score Calculation

Howp baly açyk portlara esaslanýar:
Risk score is based on open ports:

| Port Görnüşi / Port Type | Bal / Points |
|--------------------------|--------------|
| Kritik (Telnet, SMB, RDP, Redis, MongoDB) | +20 |
| Ýokary howp (FTP, MySQL, PostgreSQL) | +10 |
| Beýleki açyk portlar / Other ports | +5 |

| Howp Derejesi / Risk Level | Bal Aralygy / Score Range |
|----------------------------|---------------------------|
| PES / LOW | 0-29% |
| ORTA / MEDIUM | 30-49% |
| ÝOKARY / HIGH | 50-69% |
| HOWPLY / CRITICAL | 70-100% |

---

## Ekran Suratlary / Screenshots

### Baş sahypa / Home Page
Programmanyň baş sahypasy esasy aýratynlyklary we statistikany görkezýär.
The home page displays key features and statistics.

### Derňew sahypasy / Analysis Page
Nyşana giriziň we doly derňew alyň.
Enter a target and get complete analysis.

### Hasabatlar / Reports
Derňew taryhyny görüň we eksport ediň.
View analysis history and export reports.

---

## Etiki Ulanyş / Ethical Use

⚠️ **Möhüm / Important:**

Bu gural diňe bilim we ygtyýarly howpsuzlyk synag maksatlary üçin döredildi. Islendik tory ýa-da ulgamy skanirlemezden ozal hemişe degişli ygtyýarnamany alyň.

This tool is designed for educational and authorized security testing purposes only. Always obtain proper authorization before scanning any network or system.

---

## Prepod Üçin Soraglar we Jogaplar / Q&A for Professor

### 1. OSINT näme? / What is OSINT?
OSINT (Açyk Çeşme Aňtaw) köpçülige elýeterli çeşmelerden maglumatlary ýygnamak we derňemekdir. Bu DNS ýazgylary, WHOIS maglumatlary, we beýleki açyk çeşmeleri öz içine alýar.

OSINT (Open Source Intelligence) is the collection and analysis of information from publicly available sources including DNS records, WHOIS data, and other open sources.

### 2. Bu gural näme üçin gerek? / Why is this tool needed?
Kiberhowpsuzlyk hünärmenlerine ulgamlaryň howpsuzlygyny bahalandyrmaga kömek edýär. Açyk portlary we mümkin bolan gowşaklyklary kesgitläp, howplary öňünden anyklamaga mümkinçilik berýär.

It helps cybersecurity professionals assess system security. By identifying open ports and potential vulnerabilities, it enables proactive threat detection.

### 3. Taslama nähili döredildi? / How was the project created?
- Frontend: Vue.js 3 we PrimeVue bilen döredildi
- Backend: Node.js we Express.js bilen
- DNS, Port Scanning we WHOIS üçin Node.js modullaryny ulanyldy
- Howp bahasy üçin algoritm işlenildi

- Frontend: Built with Vue.js 3 and PrimeVue
- Backend: Node.js and Express.js
- Used Node.js modules for DNS, Port Scanning, and WHOIS
- Developed algorithm for risk assessment

### 4. Haýsy howpsuzlyk çäreleri bar? / What security measures exist?
- Diňe okalýan amallar (destruktiw däl)
- Ýerli ýerine ýetiriş - maglumatlar serwerden çykmaýar
- API rate limiting mümkin
- Giriş barlagy

- Read-only operations (non-destructive)
- Local execution - data doesn't leave the server
- API rate limiting possible
- Input validation

---

## Lisenziýa / License

Bu taslama bilim maksatlary üçin döredildi.
This project was created for educational purposes.

© 2026 Süleýman Akmuhammedow - Diplom Taslamasy / Diploma Project
