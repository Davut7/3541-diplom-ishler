# WireGuard Monitor - Network Traffic Analysis

## Diplom Taslamasy / Diploma Project

**Awtor / Author:** Shanur Taganow

**Tema / Topic:**
- EN: Network Traffic Analysis and Monitoring with Wireshark
- TM: Wireshark bilen tor trafikini seljermek we gözegçilik etmek

---

## Näme üçin bu taslama gerek? / Why is this project needed?

Tor howpsuzlygy häzirki döwürde örän möhüm. Tor trafigini seljermek we gözegçilik etmek kiberhowpsuzlyk hünärmenleri üçin zerur başarnykdyr. Bu taslama:

Network security is crucial in modern times. Analyzing and monitoring network traffic is an essential skill for cybersecurity professionals. This project:

- Wireshark-yň işleýiş ýörelgelerini görkezýär / Demonstrates how Wireshark works
- Tor protokollaryna düşünmäge kömek edýär / Helps understand network protocols
- Şübheli tor işjeňligini nähili anyklamalydygyny öwredýär / Teaches how to detect suspicious network activity
- Paket tutmak we seljerme usullaryny görkezýär / Shows packet capture and analysis techniques

---

## Esasy Aýratynlyklar / Key Features

### 1. Paket Tutmak / Packet Capture
- Hakyky wagtda paket simulýasiýasy / Real-time packet simulation
- Dürli interfeýsler (Ethernet, Wi-Fi, Loopback) / Multiple interfaces
- Süzgüçleme mümkinçiligi / Filtering capability

### 2. Trafik Seljermesi / Traffic Analysis
- Protokol paýlanyşy / Protocol distribution
- Top talkers (iň köp gepleşýän IP-ler) / Top talking IPs
- Anomaliýa ýüze çykarma / Anomaly detection

### 3. Protokol Öwrenmek / Protocol Learning
- OSI modeliň ähli gatlaklary / All OSI model layers
- Ýaýgyn protokollar (HTTP, HTTPS, DNS, TCP, UDP, ş.m.) / Common protocols
- Port maglumatlary / Port information

### 4. Howpsuzlyk Gözegçiligi / Security Monitoring
- Port skan ýüze çykarma / Port scan detection
- Maglumat çykarylyş duýduryşy / Data exfiltration alerts
- DDoS nagyş tanamak / DDoS pattern recognition

---

## Tehnologiýa / Technology Stack

- **Frontend:** Vue.js 3, PrimeVue, Chart.js
- **Backend:** Node.js, Express.js
- **Simulýasiýa:** Paket generasiýasy, protokol dekodirlemesi

---

## Gurnamak we Başlatmak / Installation & Running

```bash
# Backend
cd backend && npm install && npm start

# Frontend (täze terminalda)
cd frontend && npm install && npm run dev
```

---

## Wireshark Barada / About Wireshark

Wireshark dünýäde iň köp ulanylýan tor protokol analizatorydyr. Ol:

Wireshark is the world's most widely used network protocol analyzer. It:

- Tor paketlerini hakyky wagtda tutýar / Captures network packets in real-time
- Ýüzlerçe protokoly dekodirleýär / Decodes hundreds of protocols
- Müňlerçe faýl formatyny goldaýar / Supports thousands of file formats
- Mugt we açyk çeşmeli / Free and open source

---

## OSI Modeli / OSI Model

| Gatlak / Layer | At / Name | Protokollar / Protocols |
|----------------|-----------|------------------------|
| 7 | Application | HTTP, HTTPS, FTP, SSH, DNS |
| 6 | Presentation | SSL/TLS, JPEG, GIF |
| 5 | Session | NetBIOS, RPC |
| 4 | Transport | TCP, UDP |
| 3 | Network | IP, ICMP, IGMP |
| 2 | Data Link | Ethernet, ARP, PPP |
| 1 | Physical | Kabellar, Hublar |

---

## Prepod Üçin Soraglar / Q&A for Professor

### 1. Wireshark näme we näme üçin ulanylýar?
Wireshark tor paketlerini tutmak we seljermek üçin ulanylýan mugt guralydyr. Tor näsazlyklaryny düzetmek, howpsuzlyk seljermesi, protokol işläp düzmek we bilim maksatly ulanylýar.

### 2. Paket tutmak nähili işleýär?
Tor interfeýsi "promiscuous" režiminde goýulýar, bu ähli geçýän paketleri tutmaga mümkinçilik berýär. Paketler protokol gatlaklaryna bölünýär we seljerilýär.

### 3. Näme üçin tor gözegçiligi möhüm?
Tor gözegçiligi howpsuzlyk howplaryny ýüze çykarmaga, näsazlyklary düzetmäge we tor öndürijiligini seljermäge kömek edýär. Kiberhowpsuzlyk üçin zerur başarnykdyr.

### 4. Bu taslama nähili döredildi?
Vue.js bilen frontend, Node.js bilen backend döredildi. Wireshark-yň işleýşini görkezmek üçin paket tutmak we seljerme simulýasiýasy ýerine ýetirildi.

### 5. Anomaliýa ýüze çykarmak nähili işleýär?
Tor trafiginiň nagyşlary seljerilýär. Adaty bolmadyk hereketler (köp port soraglary, uly maglumat geçirimleri) anomaliýa hökmünde belgilenýär.

---

## Paket Süzgüç Mysallary / Filter Examples

```
tcp port 80          # HTTP trafigi
udp port 53          # DNS soraglary
host 192.168.1.1     # Belli IP-den/IP-e trafik
tcp.flags.syn == 1   # SYN paketleri
http.request.method == "GET"  # HTTP GET soraglary
```

---

© 2024 Shanur Taganow - Diplom Taslamasy
