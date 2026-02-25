# KeyGuard - Keylogger Detection for Windows

## Diplom Taslamasy / Diploma Project

**Awtor / Author:** Rowshen Orazmuhammedow

**Tema / Topic:**
- EN: Keylogger Detection in Windows Operating System
- TM: Windows operasion ulgamynda keylogger-leri ýüze çykarmak

---

## Näme üçin bu taslama gerek? / Why is this project needed?

Keylogger-ler iň howply gizlin howplardan biridir. Olar parollary, bank maglumatlary we şahsy habarlary ogurlap bilýär. Bu taslama:

Keyloggers are among the most dangerous hidden threats. They can steal passwords, banking information, and personal messages. This project:

- Keylogger-leriň nähili işleýändigini görkezýär / Demonstrates how keyloggers work
- Windows ulgamynda keylogger-leri ýüze çykarmak usullaryny öwredýär / Teaches keylogger detection methods in Windows
- Hakyky wagtda gorag üpjün edýär / Provides real-time protection
- Proses we hook gözegçiligini görkezýär / Shows process and hook monitoring

---

## Keylogger Görnüşleri / Keylogger Types

### 1. Programma Keylogger-leri / Software Keyloggers
- **Hook-based:** SetWindowsHookEx API ulanýar
- **API-based:** GetAsyncKeyState, GetKeyboardState
- **Form grabbers:** Brauzer formalaryny tutýar
- **Memory-injection:** Proses ýadyna sanjym

### 2. Apparat Keylogger-leri / Hardware Keyloggers
- USB keylogger enjamlary
- Simsiz signal snifferler
- Akustik keylogger-ler

### 3. Kernel Keylogger-leri / Kernel Keyloggers
- Rootkit esasly
- Sürüji esasly
- Filter driver-ler

---

## Ýüze Çykaryş Usullary / Detection Methods

| Usul / Method | Düşündiriş / Description |
|---------------|-------------------------|
| Hook Detection | SetWindowsHookEx çagyryşlaryny gözegçilik |
| API Monitoring | GetAsyncKeyState, keybd_event çagyryşlary |
| Process Analysis | Şübheli proses özüni alyp barşy |
| Registry Scan | Durnuklylyk mehanizmlerini gözlemek |
| Network Monitor | Maglumat çykarma synanyşyklary |

---

## Windows API-lary / Windows APIs

Keylogger-ler tarapyndan ulanylýan esasy API-lar:

```c
// Hook gurnamak
HHOOK SetWindowsHookEx(
  int idHook,        // WH_KEYBOARD_LL
  HOOKPROC lpfn,     // Hook funksiýasy
  HINSTANCE hmod,
  DWORD dwThreadId
);

// Klawiatura ýagdaýyny almak
SHORT GetAsyncKeyState(int vKey);
BOOL GetKeyboardState(PBYTE lpKeyState);

// Raw input
UINT GetRawInputData(...);
```

---

## Tehnologiýa / Technology Stack

- **Frontend:** Vue.js 3, PrimeVue
- **Backend:** Node.js, Express.js
- **Target OS:** Windows 10/11
- **Detection:** Hook monitoring, API tracking

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

### 1. Keylogger näme?
Keylogger kompýuterde klawiatura basmalaryny ýazga alýan zyýanly programma ýa-da enjamdyr. Ol parollary, kredit karta belgilerini we şahsy habarlary tutup bilýär.

### 2. Keylogger-ler nähili işleýär?
Programma keylogger-leri esasan iki usul ulanýar:
- **Hook-based:** SetWindowsHookEx API arkaly ulgam derejesinde klawiatura hook-laryny gurnaýar
- **API-based:** GetAsyncKeyState ýaly funksiýalary yzygiderli çagyryp klawiatura ýagdaýyny barlaýar

### 3. Keylogger-leri nähili ýüze çykarmaly?
- Işleýän prosesleri we olaryň klawiatura hook-laryny barlamaly
- Şübheli API çagyryşlaryny gözegçilik etmeli
- Reýestrde durnuklylyk mehanizmlerini gözlemeli
- Tor trafikinde maglumat çykarma synanyşyklaryny ýüze çykarmaly

### 4. Bu taslama nähili döredildi?
Vue.js bilen frontend, Node.js bilen backend döredildi. Windows proses gözegçiligi we hook ýüze çykaryş simulýasiýasy ýerine ýetirildi.

### 5. Özüňi keylogger-lerden nähili goramaly?
- Ygtybarly antiwirus programmasyny ulanyň
- Ulgamyňyzy täze saklaň
- Näbelli programmalary gurmaň
- Duýgur maglumatlar üçin wirtual klawiaturany ulanyň
- Yzygiderli keylogger skany geçiriň

---

## Gorag Maslahatlary / Protection Tips

1. **Antiwirus ulanyň** - Ygtybarly antiwirus programmasyny işjeň saklaň
2. **Ulgamy täzeläň** - Windows we programmalary täze saklaň
3. **Şübheli ýüklemelerden gaça duruň** - Näbelli çeşmelerden programma gurmaň
4. **Wirtual klawiatura** - Bank amallarynda wirtual klawiatura ulanyň
5. **İki faktorly tassyklama** - Mümkin bolsa 2FA ulanyň

---

© 2024 Rowshen Orazmuhammedow - Diplom Taslamasy
