# AI Firewall - Intelligent Network Protection

## Diplom Taslamasy / Diploma Project

**Awtor / Author:** Shatlyk Gurbandurdyyew

**Tema / Topic:**
- EN: Firewall Automation with Artificial Intelligence
- TM: Emeli intellekt bilen firewall awtomatizasiýasy

---

## Näme üçin bu taslama gerek? / Why is this project needed?

Adaty firewall-lar statik düzgünlere bil baglaýar we täze howplara garşy ejiz. AI firewall:

Traditional firewalls rely on static rules and are vulnerable to new threats. AI firewall:

- Howplary awtomatiki ýüze çykarýar / Automatically detects threats
- Nol gün hüjümlerini tanap bilýär / Can recognize zero-day attacks
- Firewall düzgünlerini awtomatiki döredýär / Automatically generates firewall rules
- Yzygiderli öwrenýär we uýgunlaşýar / Continuously learns and adapts

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

---

## Neural Network Arhitekturasy / Neural Network Architecture

```
Input Layer (Packet Features)
    ↓
Hidden Layer 1 (128 nodes, ReLU)
    ↓
Hidden Layer 2 (64 nodes, ReLU)
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

---

## Tehnologiýa / Technology Stack

- **Frontend:** Vue.js 3, PrimeVue, Chart.js
- **Backend:** Node.js, Express.js
- **AI/ML:** Neural Network simulation
- **Visualization:** Real-time traffic graphs

---

## Gurnamak we Başlatmak / Installation & Running

```bash
# Backend
cd backend && npm install && npm start

# Frontend (täze terminalda)
cd frontend && npm install && npm run dev
```

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

### 5. Bu taslama nähili döredildi?
Vue.js bilen frontend, Node.js bilen backend döredildi. Neural network arhitekturasynyň simulýasiýasy we howp ýüze çykaryş demonstrasiýasy ýerine ýetirildi.

---

## Howp Görnüşleri / Threat Types

| Howp / Threat | Düşündiriş / Description | AI Ýüze Çykaryş / AI Detection |
|--------------|-------------------------|-------------------------------|
| Port Scan | Port-lary gözlemek | Baglanyşyk nagyşy seljermesi |
| DDoS | Köp mukdarda trafik | Anomaliýa ýüze çykaryş |
| Brute Force | Köp sanly synanyşyk | Ýygylyk seljermesi |
| Malware C&C | Zyýanly aragatnaşyk | Özüni alyp baryş seljermesi |
| Data Exfiltration | Maglumat ogurlamak | Uly göwrümli çykyş trafigi |

---

© 2024 Shatlyk Gurbandurdyyew - Diplom Taslamasy
