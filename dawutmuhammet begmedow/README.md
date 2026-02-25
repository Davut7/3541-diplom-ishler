# VirusDetect Pro - Advanced Malware Detection

## Diplom Taslamasy / Diploma Project

**Awtor / Author:** Dawutmuhammet Begmedow

**Tema / Topic:**
- EN: Detecting Viruses That Evade Antivirus Detection
- TM: Antiwiruslaryň anyklamasyndan gaçýan wirusleri anyklamak we seljermek

---

## Näme üçin bu taslama gerek? / Why is this project needed?

Adaty antiwirus programmalary gol (signature) esasly anyklaýyş ulanýar. Emma täze zyýanly programmalar gol bolmasa anyklanmaýar. Bu taslama:

Traditional antivirus uses signature-based detection. New malware without known signatures evades detection. This project:

- Gol goýmasyz anyklaýyş usullaryny görkezýär / Demonstrates signature-less detection
- Ewristiki derňew nähili işleýändigini düşündirýär / Explains how heuristic analysis works
- AI-yň zyýanly programma anyklamakdaky roluny görkezýär / Shows AI's role in malware detection

---

## Anyklaýyş Usullary / Detection Methods

### 1. Ewristiki Derňew / Heuristic Analysis
Kod özüni alyp baryş nagyşlaryny derňeýär - şübheli API çagyryşlary, faýl operasiýalary we ş.m.

Analyzes code behavior patterns - suspicious API calls, file operations, etc.

### 2. Özüni Alyp Baryş Anyklaýjysy / Behavioral Detection
Faýly howpsuz sandbox gurşawynda ýerine ýetirip, hereketlerini gözegçilikde saklaýar.

Executes file in safe sandbox environment and monitors its actions.

### 3. AI Güýçli Anyklaýyş / AI-Powered Detection
Millionlarça zyýanly programma nusgalarynda türgenleşdirilen maşyn öwreniş modelleri.

Machine learning models trained on millions of malware samples.

### 4. Entropiýa Derňewi / Entropy Analysis
Gaplamak/şifrleme anyklamak üçin faýl entropiýasyny hasaplaýar.

Calculates file entropy to detect packing/encryption.

---

## Gaçmak Usullary / Evasion Techniques

| Usul / Technique | Düşündiriş / Description | Anyklaýyş / Detection |
|------------------|--------------------------|----------------------|
| Polimorf Kod | Her gezek köpelende kodyny üýtgedýär | Özüni alyp baryş derňewi |
| Metamorf Kod | Doly kod täzeden ýazmak | AI nagyş tanamak |
| Gaplama | Zyýanly ýüki şifrleýär | Entropiýa derňewi |
| Faýlsyz | Diňe ýatda işleýär | Ýat skanirleme |
| Rootkit | Barlygyny gizleýär | Pes derejeli skanirleme |

---

## Tehnologiýa / Technology Stack

- **Frontend:** Vue.js 3, PrimeVue, Chart.js
- **Backend:** Node.js, Express.js
- **Analiz:** Crypto, SHA-256 hashing

---

## Gurnamak we Başlatmak / Installation & Running

```bash
# Backend
cd backend && npm install && npm start

# Frontend
cd frontend && npm install && npm run dev
```

---

## Prepod Üçin Soraglar / Q&A for Professor

### 1. Näme üçin adaty antiwirus ýeterlik däl?
Adaty antiwirus diňe belli gollary gözleýär. Täze wiruslar ýa-da üýtgedilen görnüşleri bu gollara gabat gelmeýär.

### 2. Ewristiki derňew näme?
Kod nähili özüni alyp barýandygyny derňeýär - meselem, köp faýl ýazsa, tor birikmelerini açsa, şübheli hasaplanýar.

### 3. AI nähili kömek edýär?
AI millionlarça zyýanly programma nusgalaryndan nagyşlary öwrenýär we täze, görülmedik wiruslary hem tanap bilýär.

### 4. Taslamany nähili döretdiňiz?
Vue.js bilen frontend, Node.js bilen backend döretdim. Faýl derňewi üçin hash hasaplamak, entropiýa derňewi we simulýasiýa ulandym.

---

© 2024 Dawutmuhammet Begmedow - Diplom Taslamasy
