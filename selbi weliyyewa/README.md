# GAN Security Analyzer

## Diplom Taslamasy / Diploma Project

**Awtor / Author:** Selbi Weliýewa

**Tema / Topic:**
- EN: Attacks to GANs and Security
- TM: GAN (Generative Adversarial Networks) garşy hüjümler we howpsuzlyk

---

## Taslama Hakynda / About the Project

Bu taslama Generatiw Garşydaş Torlaryň (GAN) howpsuzlyk gowşaklyklaryny öwrenýär we dürli hüjüm usullaryny hem-de gorag strategiýalaryny görkezýär.

This project explores security vulnerabilities of Generative Adversarial Networks (GANs) and demonstrates various attack methods along with defense strategies.

---

## GAN näme? / What is a GAN?

Generatiw Garşydaş Torlar (GAN-lar) iki nerw torunyň biri-biri bilen bäsleşýän maşyn öwreniş çarçuwasydyr:

1. **Generator** - Galp maglumatlar döredýär
2. **Discriminator** - Hakyky bilen galpy tapawutlandyrýar

GANs consist of two neural networks competing against each other:
1. **Generator** - Creates fake data
2. **Discriminator** - Distinguishes real from fake

---

## Hüjüm Görnüşleri / Attack Types

### 1. Garşydaş Mysallar / Adversarial Examples
- Model ýalňyşlyk etmegine sebäp bolýan kiçi üýtgeşmeler
- Small perturbations that cause model misclassification
- **Usullar / Methods:** FGSM, PGD, C&W Attack, DeepFool

### 2. Model Tersleşdirme / Model Inversion
- Model çykyşlaryndan türgenleşik maglumatlaryny dikeltmek
- Reconstructing training data from model outputs
- **Howp derejesi / Risk Level:** Kritik / Critical

### 3. Agzalyk Netijesi / Membership Inference
- Nusganyň türgenleşik maglumatlarynda bolandygyny kesgitlemek
- Determining if a sample was in training data

### 4. Maglumat Zäherleme / Data Poisoning
- Model özüni alyp barşyny dolandyrmak üçin türgenleşik maglumatlaryny zaýalamak
- Corrupting training data to manipulate model behavior

### 5. Model Ogurlamak / Model Stealing
- Soraglar arkaly model parametrlerini çykarmak
- Extracting model parameters through queries

---

## Gorag Mehanizmleri / Defense Mechanisms

### 1. Garşydaş Türgenleşik / Adversarial Training
- Berkitligi gowulandyrmak üçin garşydaş mysallar bilen türgenleşik
- Training with adversarial examples to improve robustness
- **Netijelilik / Effectiveness:** 85%

### 2. Giriş Öňünden Işlemek / Input Preprocessing
- Modele bermezden ozal girişleri arassalamak
- Sanitizing inputs before feeding to the model
- **Netijelilik / Effectiveness:** 70%

### 3. Diferensial Gizlinlik / Differential Privacy
- Türgenleşik maglumat gizlinligini goramak üçin ses goşmak
- Adding noise to protect training data privacy
- **Netijelilik / Effectiveness:** 90%

### 4. Hüjüm Kesgitlemek / Attack Detection
- Garşydaş girişleri kesgitlemek we ret etmek
- Identifying and rejecting adversarial inputs
- **Netijelilik / Effectiveness:** 80%

---

## Tehnologiýa Toplumy / Technology Stack

### Frontend
- **Vue.js 3** - Progresif JavaScript framework
- **PrimeVue** - UI komponent kitaphanasy
- **Chart.js** - Maglumat wizualizasiýasy

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework

---

## Gurnamak / Installation

```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

---

## Başlatmak / Running

```bash
# Backend
cd backend && npm start
# Server: http://localhost:3000

# Frontend
cd frontend && npm run dev
# App: http://localhost:5173
```

---

## Prepod Üçin Soraglar we Jogaplar / Q&A for Professor

### 1. GAN näme? / What is a GAN?
GAN (Generatiw Garşydaş Tor) iki nerw torunyň bäsleşýän maşyn öwreniş modelidir. Generator galp maglumatlar döredýär, Diskriminator bolsa hakykyny galp bilen tapawutlandyrýar.

### 2. GAN-lar näme üçin hüjümlere sezewar? / Why are GANs vulnerable?
- Gradient esasly optimizasiýa ulanýarlar
- Türgenleşik maglumatlaryny ýatda saklap bilýärler
- Goşa-tor arhitekturasy üýtgeşik hüjüm ýüzlerini döredýär

### 3. Iň howply hüjüm haýsy? / Most dangerous attack?
Maglumat zäherleme (Data Poisoning) - türgenleşik wagtynda modeli bozup, ähli geljekki çykyşlara täsir edip biler.

### 4. Bu taslamany nähili döretdiňiz? / How was this project created?
- Frontend: Vue.js 3 we PrimeVue bilen
- Backend: Node.js we Express.js bilen
- Hüjüm we gorag mehanizmleri barada ylmy makalalardan öwrenildi

---

## Etiki Ulanyş / Ethical Use

Bu taslama diňe bilim maksatlary üçin döredildi. Hakyky ulgamlara garşy ygtyýarnama almadyk hüjümler bikanundyr.

This project is for educational purposes only. Unauthorized attacks against real systems are illegal.

---

© 2024 Selbi Weliýewa - Diplom Taslamasy / Diploma Project
