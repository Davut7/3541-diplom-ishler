# WAF Behavioral Analysis - Web Application Firewall

## Diplom Taslamasy / Diploma Project

**Awtor / Author:** Batyr Akyýew

**Tema / Topic:**
- EN: Web Application Firewall with Behavioral Analysis
- TM: Ulanyjynyň hereketine görä işleýän web gorag ulgamy

---

## Taslamanyň Mazmuny / Project Overview

Bu taslama adaty gol esasly ýüze çykaryş bilen AI güýçli özüni alyp baryş derňewini birleşdirýän Web Programma Firewall-yny görkezýär.

This project demonstrates a Web Application Firewall that combines traditional signature-based detection with AI-powered behavioral analysis.

---

## Esasy Aýratynlyklar / Key Features

### 1. WAF Goragy / WAF Protection
- SQL Injection ýüze çykaryş we bloklaýyş
- XSS (Cross-Site Scripting) goragy
- Path Traversal öňüni almak
- Command Injection ýüze çykaryş

### 2. Özüni Alyp Baryş Derňewi / Behavioral Analysis
- Ulanyjy sessiýa gözegçiligi
- Bot ýüze çykaryş
- Anomaliýa kesgitlemek
- Howp baly hasaplamak

### 3. Hakyky Wagtda Gözegçilik / Real-time Monitoring
- Dessine howp ýüze çykaryş
- Hüjüm ýazgylary
- Statistika we analitika

---

## Tehnologiýa / Technology Stack

- **Frontend:** Vue.js 3, PrimeVue 4, Chart.js
- **Backend:** Node.js, Express.js
- **Analysis:** Behavioral profiling, Pattern matching
- **Visualization:** Real-time charts and logs

---

## Gurnamak we Başlatmak / Installation & Running

```bash
# Backend (Port 7017)
cd backend && npm install && npm start

# Frontend (Port 7018)
cd frontend && npm install && npm run dev
```

### Brauzerda açmak / Open in browser:
- Frontend: http://localhost:7018
- Backend API: http://localhost:7017

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/rules` | GET | WAF düzgünlerini almak |
| `/api/analyze` | POST | Talapy derňemek |
| `/api/logs` | GET | Hüjüm ýazgylaryny almak |
| `/api/statistics` | GET | Statistikany almak |
| `/api/behavioral` | GET | Özüni alyp baryş maglumatlaryny almak |
| `/api/test-attack` | POST | Hüjüm synagy |

---

## Hüjüm Görnüşleri / Attack Types

| Hüjüm / Attack | Düşündiriş / Description | Ýüze Çykaryş / Detection |
|---------------|-------------------------|--------------------------|
| SQL Injection | Maglumat bazasyna hüjüm | Pattern matching |
| XSS | Skript hüjümi | Script tag detection |
| Path Traversal | Ýol geçiş hüjümi | Path pattern detection |
| Command Injection | Buýruk hüjümi | Command pattern detection |
| Brute Force | Köp synanyşyk | Rate limiting |
| Bot Traffic | Awtomatik trafik | Behavioral analysis |

---

## Howp Baly / Risk Score

| Dereje / Level | Bal / Score | Amal / Action |
|---------------|-------------|---------------|
| LOW | 0-29% | Allow |
| MEDIUM | 30-49% | Monitor |
| HIGH | 50-69% | Challenge |
| CRITICAL | 70-100% | Block |

---

## Sahypalar / Pages

| Sahypa / Page | Mazmuny / Content |
|--------------|-------------------|
| Home | Baş sahypa, statistika |
| WAF Rules | Firewall düzgünleri |
| Analyzer | Talap derňewçisi |
| Behavioral | Özüni alyp baryş derňewi |
| Logs | Hüjüm ýazgylary |
| Statistics | Statistika we grafikler |
| How It Works | Nähili işleýär |
| About | Taslama barada |

---

© 2026 Batyr Akyýew - Diplom Taslamasy / Diploma Project
