# AI Firewall - Intelligent Network Protection

## Diplom Taslamasy / Diploma Project

**Awtor / Author:** Shatlyk Rahmanov

**Tema / Topic:**
- EN: Firewall Automation with Artificial Intelligence
- TM: Emeli intellekt bilen firewall awtomatizasiýasy

---

## Taslamanyň Mazmuny / Project Overview

Bu taslama emeli intellekti ulanyp firewall dolandyryşyny awtomatlaşdyrýar. Neural network esasly howp ýüze çykaryş, trafik seljermesi we firewall düzgünleriniň awtomatiki döredilmegi görkezilýär.

This project demonstrates firewall automation using artificial intelligence. It showcases neural network-based threat detection, traffic analysis, and automatic firewall rule generation.

---

## Näme üçin bu taslama gerek? / Why is this project needed?

Adaty firewall-lar statik düzgünlere bil baglaýar we täze howplara garşy ejiz. AI firewall:

Traditional firewalls rely on static rules and are vulnerable to new threats. AI firewall:

- Howplary awtomatiki ýüze çykarýar / Automatically detects threats
- Nol gün hüjümlerini tanap bilýär / Can recognize zero-day attacks
- Firewall düzgünlerini awtomatiki döredýär / Automatically generates firewall rules
- Yzygiderli öwrenýär we uýgunlaşýar / Continuously learns and adapts

---

## Sahypalar / Pages

| Sahypa / Page | Mazmuny / Content |
|--------------|-------------------|
| **Home** | Baş sahypa, AI firewall barada maglumat |
| **Rules** | Firewall düzgünlerini dolandyrmak, AI teklipler |
| **Traffic** | Hakyky wagtda trafik gözegçiligi |
| **AI Engine** | AI model ýagdaýy, howp ýüze çykaryş |
| **Statistics** | Grafikler we diagrammalar bilen statistika |
| **How It Works** | AI firewall nähili işleýär |
| **About** | Taslama we awtor barada |

---

## AI Mümkinçilikleri / AI Capabilities

### 1. Anomaliýa Ýüze Çykaryş / Anomaly Detection
- Adaty bolmadyk trafik nagyşlaryny kesgitleýär
- Baseline özüni alyp baryşdan gyşarmany ýüze çykarýar

### 2. Zyýanly Programma Trafigi / Malware Traffic Detection
- C&C (Command & Control) aragatnaşygyny tapýar
- Data exfiltration synanyşyklaryny kesgitleýär

### 3. DDoS Goragy / DDoS Protection
- Uly göwrümli hüjümleri kesgitleýär
- Awtomatiki azaltma çärelerini ulanýar

### 4. Aralaşma Ýüze Çykaryş / Intrusion Detection
- Ýerleşiş synanyşyklaryny kesgitleýär
- Lateral movement-i gözegçilik edýär

### 5. Özüni Alyp Baryş Seljermesi / Behavioral Analysis
- Ulanyjy we enjam özüni alyp barşyny öwrenýär
- Adaty bolmadyk hereketleri belgilenýär

### 6. Nol Gün Howp Ýüze Çykaryşy / Zero-Day Detection
- Öň görülmedik hüjüm nagyşlaryny tapýar
- Şübheli özüni alyp baryşy kesgitleýär

---

## Neural Network Arhitekturasy / Neural Network Architecture

```
Input Layer (Packet Features - 6 inputs)
    ↓
Hidden Layer 1 (128 nodes, ReLU activation)
    ↓
Hidden Layer 2 (64 nodes, ReLU activation)
    ↓
Output Layer (3 classes: Safe, Suspicious, Threat)
```

### Giriş Aýratynlyklary / Input Features:
- Paket ölçegi / Packet size
- Protokol görnüşi / Protocol type
- Çeşme/maksat portlary / Source/destination ports
- Baglanyşyk dowamlylygy / Connection duration
- Baýt sany / Byte count
- Paket ýygylygy / Packet frequency

---

## Adaty vs AI Firewall / Traditional vs AI Firewall

| Aýratynlyk / Feature | Adaty / Traditional | AI Firewall |
|---------------------|---------------------|-------------|
| Düzgün Dolandyryşy | El bilen / Manual | Awtomatiki / Automatic |
| Nol Gün Howplar | Ýüze çykaryp bilmeýär | Pattern tanamak |
| Ýalňyş Pozitiwler | Ýokary | ML azaldýar |
| Uýgunlaşma | Statik düzgünler | Yzygiderli öwreniş |
| Özüni Alyp Baryş Seljermesi | Ýok | Bar |
| Jogap Wagty | Haýal | < 1ms |

---

## Tehnologiýa / Technology Stack

- **Frontend:** Vue.js 3, PrimeVue 4, Chart.js
- **Backend:** Node.js, Express.js
- **AI/ML:** Neural Network simulation
- **Visualization:** Real-time traffic graphs, statistics charts
- **Styling:** CSS3, Dark/Light mode support
- **Localization:** English / Turkmen

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/rules` | GET | Firewall düzgünlerini almak |
| `/api/traffic` | GET | Soňky trafik maglumatlaryny almak |
| `/api/traffic/stats` | GET | Trafik statistikasyny almak |
| `/api/threats` | GET | Ýüze çykarylan howplary almak |
| `/api/ai/analyze` | POST | Trafigi AI bilen seljermek |
| `/api/ai/suggestions` | GET | AI düzgün teklipler |
| `/api/ai/model` | GET | AI model maglumatlaryny almak |
| `/api/ai/learning` | GET | Öwreniş ösüşini almak |
| `/api/statistics` | GET | Umumy statistika |

---

## Gurnamak we Başlatmak / Installation & Running

```bash
# Backend (Port 7015)
cd backend && npm install && npm start

# Frontend (Port 7016 - täze terminalda)
cd frontend && npm install && npm run dev
```

### Brauzerda açmak / Open in browser:
- Frontend: http://localhost:7016
- Backend API: http://localhost:7015

---

## Howp Görnüşleri / Threat Types

| Howp / Threat | Düşündiriş / Description | AI Ýüze Çykaryş / AI Detection |
|--------------|-------------------------|-------------------------------|
| Port Scan | Port-lary gözlemek | Baglanyşyk nagyşy seljermesi |
| DDoS | Köp mukdarda trafik | Anomaliýa ýüze çykaryş |
| Brute Force | Köp sanly synanyşyk | Ýygylyk seljermesi |
| Malware C&C | Zyýanly aragatnaşyk | Özüni alyp baryş seljermesi |
| Data Exfiltration | Maglumat ogurlamak | Uly göwrümli çykyş trafigi |
| SQL Injection | Maglumat bazasyna hüjüm | Şübheli SQL nagyşlary |
| XSS | Skript hüjümi | Script tag ýüze çykaryş |
| Zero-Day | Täze görnüşli hüjüm | Anomaliýa + ML |

---

## Prepod Üçin Soraglar / Q&A for Professor

### 1. AI Firewall näme?
AI firewall tor trafikini seljermek, howplary ýüze çykarmak we optimal howpsuzlyk düzgünlerini awtomatiki döretmek üçin maşyn öwreniş algoritmlerini ulanýan firewall-dyr.

### 2. Adaty firewall-dan tapawudy näme?
- Adaty firewall diňe statik düzgünlere bil baglaýar
- AI firewall trafik nagyşlaryndan öwrenýär
- Nol gün howplaryny ýüze çykarýar
- Düzgünleri awtomatiki optimizirleýär

### 3. AI nähili howplary ýüze çykarýar?
Neural network trafik aýratynlyklaryny (paket ölçegi, port, protokol, ýygylyk) seljerýär we nagyşlary tanamak arkaly kadaly trafigi howplardan tapawutlandyrýar.

### 4. Awtomatiki düzgün döretme nähili işleýär?
AI:
1. Trafik nagyşlaryny seljerýär
2. Kadaly özüni alyp barşy öwrenýär
3. Anomaliýalary ýüze çykarýar
4. Degişli düzgünleri teklip edýär ýa-da awtomatiki döredýär

### 5. Neural network näme üçin ulanylýar?
Neural network çylşyrymly nagyşlary tanamakda we klassifikasiýada örän täsirli. Trafigi "Howpsuz", "Şübheli" ýa-da "Howp" hökmünde klassifisirlemek üçin ulanylýar.

### 6. Bu taslama hakyky firewall-my?
Bu taslama AI firewall-yň konsepsiýasyny we işleýşini görkezýän demonstrasiýa. Hakyky önümçilikde ulanmak üçin has köp howpsuzlyk we optimizasiýa gerek.

---

## Taslama Gurluşy / Project Structure

```
shatlyk rahmanov/
├── backend/
│   ├── server.js          # Express API server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── views/
│   │   │   ├── HomeView.vue
│   │   │   ├── RulesView.vue
│   │   │   ├── TrafficView.vue
│   │   │   ├── AIView.vue
│   │   │   ├── StatisticsView.vue
│   │   │   ├── HowItWorksView.vue
│   │   │   └── AboutView.vue
│   │   ├── locales/
│   │   │   ├── en.js      # English translations
│   │   │   └── tk.js      # Turkmen translations
│   │   ├── App.vue
│   │   └── main.js
│   ├── index.html
│   └── package.json
├── start.sh               # Quick start script
└── README.md
```

---

© 2026 Shatlyk Rahmanov - Diplom Taslamasy / Diploma Project
