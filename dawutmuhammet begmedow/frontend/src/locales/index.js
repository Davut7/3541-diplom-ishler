export const translations = {
  en: {
    nav: { home: 'Home', scan: 'Scan', techniques: 'Techniques', history: 'History', howItWorks: 'How It Works', about: 'About' },
    footer: { diploma: 'Diploma Project', author: 'Author' },
    home: {
      title: 'Advanced Malware Detection',
      subtitle: 'Detecting Viruses That Evade Traditional Antivirus Solutions',
      description: 'Our AI-powered tool uses advanced heuristic analysis, behavioral detection, and signature-less techniques to identify malware that conventional antivirus software cannot detect.',
      startScan: 'Start Scan',
      learnMore: 'Learn Techniques',
      features: {
        title: 'Detection Methods',
        heuristic: { title: 'Heuristic Analysis', desc: 'Analyzes code behavior patterns to identify suspicious activities' },
        behavioral: { title: 'Behavioral Detection', desc: 'Monitors file execution to detect malicious behavior' },
        aiPowered: { title: 'AI-Powered Detection', desc: 'Machine learning models trained on millions of malware samples' },
        signatureless: { title: 'Signature-less Detection', desc: 'Detects zero-day threats without relying on virus signatures' }
      },
      stats: { filesScanned: 'Files Scanned', threatsDetected: 'Threats Detected', evasionTechniques: 'Evasion Techniques', detectionRate: 'Detection Rate' }
    },
    scan: {
      title: 'File Scanner',
      subtitle: 'Scan files for malware using advanced detection techniques',
      uploadFile: 'Upload File',
      dropzone: 'Select a File to Scan',
      clickOrDrag: 'Click to browse or drag & drop',
      scanFolder: 'Scan Entire Folder',
      selectFolder: 'Select folder to scan all files',
      scanning: 'Scanning...',
      folderResults: 'Folder Scan Results',
      scannedFiles: 'Files scanned',
      openLocation: 'Open Location',
      saveReport: 'Save to History',
      settings: 'Settings',
      results: {
        title: 'Scan Results',
        fileName: 'File Name',
        fileSize: 'File Size',
        fileType: 'File Type',
        hash: 'SHA-256 Hash',
        hashes: 'File Hashes',
        entropy: 'Entropy',
        status: 'Status',
        threatLevel: 'Threat Level',
        threatScore: 'Threat Score',
        details: 'Details',
        suspiciousPatterns: 'Suspicious Patterns Detected'
      },
      status: {
        clean: 'Clean',
        suspicious: 'Suspicious',
        malware: 'Malware Detected',
        potentially_unwanted: 'Potentially Unwanted',
        unknown: 'Unknown'
      }
    },
    techniques: {
      title: 'Evasion Techniques & Detection',
      subtitle: 'Understanding how malware evades antivirus and how we detect it',
      evasion: {
        title: 'Evasion Techniques',
        polymorphic: { title: 'Polymorphic Code', desc: 'Malware that changes its code each time it replicates', detection: 'Behavioral analysis and heuristic scanning' },
        metamorphic: { title: 'Metamorphic Code', desc: 'Complete code rewriting with each iteration', detection: 'AI pattern recognition and code flow analysis' },
        packing: { title: 'Packing/Encryption', desc: 'Compressing or encrypting malicious payload', detection: 'Entropy analysis and unpacking techniques' },
        fileless: { title: 'Fileless Malware', desc: 'Operates entirely in memory without files', detection: 'Memory scanning and process monitoring' },
        rootkit: { title: 'Rootkits', desc: 'Hides presence from the operating system', detection: 'Low-level system scanning and integrity checks' },
        sandboxEvasion: { title: 'Sandbox Evasion', desc: 'Detects analysis environments and delays execution', detection: 'Multiple environment simulation and timing analysis' }
      }
    },
    history: {
      title: 'Scan History',
      subtitle: 'View your previous scan results',
      empty: 'No scan history yet. Scan a file to get started!',
      clearHistory: 'Clear History',
      columns: { file: 'File', status: 'Status', date: 'Date', threat: 'Threat', actions: 'Actions' }
    },
    howItWorks: {
      title: 'How Detection Works',
      subtitle: 'Understanding our multi-layer detection approach',
      steps: {
        step1: { title: 'File Selection', desc: 'User selects file or folder for analysis' },
        step2: { title: 'Hash Calculation', desc: 'Calculate MD5, SHA1, SHA256 file fingerprints' },
        step3: { title: 'Entropy Analysis', desc: 'Detect packed or encrypted content' },
        step4: { title: 'Pattern Scanning', desc: 'Search for suspicious strings and API calls' },
        step5: { title: 'VirusTotal Check', desc: 'Query against 70+ antivirus engines' }
      },
      faq: {
        q1: { question: 'Why cant traditional antivirus detect all malware?', answer: 'Traditional antivirus relies on signature databases. New malware or variants without known signatures can evade detection.' },
        q2: { question: 'What is entropy analysis?', answer: 'Entropy measures the randomness of data. High entropy indicates compression or encryption, often used by malware to hide its payload.' },
        q3: { question: 'What is VirusTotal?', answer: 'VirusTotal is a service that aggregates results from 70+ antivirus engines. We use their API to check file hashes against known malware.' },
        q4: { question: 'What patterns do you detect?', answer: 'We scan for suspicious strings like PowerShell commands, registry modifications, network functions, and known malware signatures.' }
      }
    },
    about: {
      title: 'About VirusDetect Pro',
      subtitle: 'Advanced Malware Detection Desktop Application',
      description: 'This desktop application provides real malware detection capabilities including file hash calculation, entropy analysis, pattern detection, and VirusTotal integration.',
      features: [
        'Real SHA256/MD5/SHA1 hash calculation',
        'Entropy analysis for packed file detection',
        'Suspicious pattern scanning',
        'VirusTotal API integration',
        'Folder scanning support',
        'Persistent scan history'
      ],
      author: { title: 'Author', name: 'Dawutmuhammet Begmedow', project: 'Diploma Project', topic: 'Detecting viruses that evade antivirus detection', topicTk: 'Antiwiruslaryň anyklamasyndan gaçýan wirusleri anyklamak we seljermek' }
    }
  },
  tk: {
    nav: { home: 'Baş sahypa', scan: 'Skanirle', techniques: 'Usullar', history: 'Taryh', howItWorks: 'Nähili işleýär', about: 'Hakynda' },
    footer: { diploma: 'Diplom taslamasy', author: 'Awtor' },
    home: {
      title: 'Ösen Zyýanly Programma Anyklaýjy',
      subtitle: 'Adaty Antiwirus Çözgütlerinden Gaçýan Wiruslary Anyklamak',
      description: 'Biziň AI güýçli guralymyz adaty antiwirus programmalarynyň anyklap bilmeýän zyýanly programmalaryny kesgitlemek üçin ösen ewristiki derňew, özüni alyp baryş anyklaýjy we gol goýmasyz usullary ulanýar.',
      startScan: 'Skanirle',
      learnMore: 'Usullary öwren',
      features: {
        title: 'Anyklaýyş Usullary',
        heuristic: { title: 'Ewristiki Derňew', desc: 'Şübheli hereketleri kesgitlemek üçin kod özüni alyp baryş nagyşlaryny derňeýär' },
        behavioral: { title: 'Özüni Alyp Baryş Anyklaýjysy', desc: 'Zyýanly özüni alyp barşy anyklamak üçin faýl ýerine ýetirilişini gözegçilikde saklaýar' },
        aiPowered: { title: 'AI Güýçli Anyklaýjy', desc: 'Millionlarça zyýanly programma nusgalarynda türgenleşdirilen maşyn öwreniş modelleri' },
        signatureless: { title: 'Gol Goýmasyz Anyklaýjy', desc: 'Wirus gollaryna daýanman nol-gün howplaryny anyklaýar' }
      },
      stats: { filesScanned: 'Skanirlen faýllar', threatsDetected: 'Tapylan howplar', evasionTechniques: 'Gaçmak usullary', detectionRate: 'Anyklaýyş derejesi' }
    },
    scan: {
      title: 'Faýl Skaner',
      subtitle: 'Ösen anyklaýyş usullaryny ulanyp faýllary skanirläň',
      uploadFile: 'Faýl ýükle',
      dropzone: 'Skanirlemek üçin faýl saýlaň',
      clickOrDrag: 'Basmak ýa-da süýräp goýmak',
      scanFolder: 'Bütin Bukjany Skanirle',
      selectFolder: 'Ähli faýllary skanirlemek üçin bukja saýlaň',
      scanning: 'Skanirlenýär...',
      folderResults: 'Bukja Skan Netijeleri',
      scannedFiles: 'Skanirlen faýllar',
      openLocation: 'Ýerleşýän ýerini aç',
      saveReport: 'Taryha ýatda sakla',
      settings: 'Sazlamalar',
      results: {
        title: 'Skan Netijeleri',
        fileName: 'Faýl Ady',
        fileSize: 'Faýl Ölçegi',
        fileType: 'Faýl Görnüşi',
        hash: 'SHA-256 Hash',
        hashes: 'Faýl Hashlary',
        entropy: 'Entropiýa',
        status: 'Ýagdaý',
        threatLevel: 'Howp Derejesi',
        threatScore: 'Howp Baly',
        details: 'Jikme-jiklikler',
        suspiciousPatterns: 'Şübheli Nagyşlar Tapyldy'
      },
      status: {
        clean: 'Arassa',
        suspicious: 'Şübheli',
        malware: 'Zyýanly Programma Tapyldy',
        potentially_unwanted: 'Potensial Islenilmeýän',
        unknown: 'Näbelli'
      }
    },
    techniques: {
      title: 'Gaçmak Usullary we Anyklaýyş',
      subtitle: 'Zyýanly programmalaryň antiwirus sistemalaryndan nähili gaçýandygyna we olary nähili anyklaýandygymyza düşünmek',
      evasion: {
        title: 'Gaçmak Usullary',
        polymorphic: { title: 'Polimorf Kod', desc: 'Her gezek köpelende kodyny üýtgedýän zyýanly programma', detection: 'Özüni alyp baryş derňewi we ewristiki skanirleme' },
        metamorphic: { title: 'Metamorf Kod', desc: 'Her iterasiýada doly kod täzeden ýazmak', detection: 'AI nagyş tanamak we kod akymy derňewi' },
        packing: { title: 'Gaplama/Şifrleme', desc: 'Zyýanly ýüki gysmak ýa-da şifrlemek', detection: 'Entropiýa derňewi we açmak usullary' },
        fileless: { title: 'Faýlsyz Zyýanly Programma', desc: 'Faýlsyz, diňe ýatda işleýär', detection: 'Ýat skanirleme we proses gözegçiligi' },
        rootkit: { title: 'Rootkitler', desc: 'Operasion ulgamyndan barlygyny gizleýär', detection: 'Pes derejeli ulgam skanirleme we bitewilik barlaglary' },
        sandboxEvasion: { title: 'Sandbox Gaçmak', desc: 'Derňew gurşawyny anyklap ýerine ýetirişi gijikdirýär', detection: 'Köp gurşaw simulýasiýasy we wagt derňewi' }
      }
    },
    history: {
      title: 'Skan Taryhy',
      subtitle: 'Öňki skan netijeleriňizi görüň',
      empty: 'Entek skan taryhy ýok. Başlamak üçin faýl skanirläň!',
      clearHistory: 'Taryhy arassala',
      columns: { file: 'Faýl', status: 'Ýagdaý', date: 'Sene', threat: 'Howp', actions: 'Hereketler' }
    },
    howItWorks: {
      title: 'Anyklaýyş Nähili Işleýär',
      subtitle: 'Köp gatlakly anyklaýyş usulymyza düşünmek',
      steps: {
        step1: { title: 'Faýl Saýlamak', desc: 'Ulanyjy derňew üçin faýl ýa-da bukja saýlaýar' },
        step2: { title: 'Hash Hasaplamak', desc: 'MD5, SHA1, SHA256 faýl barmaklaryny hasaplaýar' },
        step3: { title: 'Entropiýa Derňewi', desc: 'Gaplanan ýa-da şifrlenen mazmuny anyklaýar' },
        step4: { title: 'Nagyş Skanirleme', desc: 'Şübheli setirler we API çagyryşlaryny gözleýär' },
        step5: { title: 'VirusTotal Barlagy', desc: '70+ antiwirus motoryna garşy soraýar' }
      },
      faq: {
        q1: { question: 'Näme üçin adaty antiwirus ähli zyýanly programmalary anyklap bilmeýär?', answer: 'Adaty antiwirus gol maglumat bazalaryna daýanýar. Belli gollary bolmadyk täze zyýanly programmalar ýa-da wariantlar anyklamadan gaçyp biler.' },
        q2: { question: 'Entropiýa derňewi näme?', answer: 'Entropiýa maglumatlaryň tötänliligini ölçeýär. Ýokary entropiýa gyşdyrma ýa-da şifrlemäni görkezýär, köplenç zyýanly programmalaryň ýüklerini gizlemek üçin ulanylýar.' },
        q3: { question: 'VirusTotal näme?', answer: 'VirusTotal 70+ antiwirus motorynyň netijelerini birleşdirýän hyzmatdyr. Faýl hashlaryny belli zyýanly programmalar bilen barlamak üçin olaryň API-sini ulanýarys.' },
        q4: { question: 'Haýsy nagyşlary anyklaýarsyňyz?', answer: 'PowerShell buýruklary, reestr üýtgeşmeleri, tor funksiýalary we belli zyýanly programma gollary ýaly şübheli setirleri skanirleýäris.' }
      }
    },
    about: {
      title: 'VirusDetect Pro Hakynda',
      subtitle: 'Ösen Zyýanly Programma Anyklaýyş Desktop Programmasy',
      description: 'Bu desktop programmasy faýl hash hasaplamasy, entropiýa derňewi, nagyş anyklaýyş we VirusTotal integrasiýasyny öz içine alýan hakyky zyýanly programma anyklaýyş mümkinçiliklerini üpjün edýär.',
      features: [
        'Hakyky SHA256/MD5/SHA1 hash hasaplamasy',
        'Gaplanan faýl anyklamak üçin entropiýa derňewi',
        'Şübheli nagyş skanirleme',
        'VirusTotal API integrasiýasy',
        'Bukja skanirleme goldawy',
        'Hemişelik skan taryhy'
      ],
      author: { title: 'Awtor', name: 'Dawutmuhammet Begmedow', project: 'Diplom Taslamasy', topic: 'Detecting viruses that evade antivirus detection', topicTk: 'Antiwiruslaryň anyklamasyndan gaçýan wirusleri anyklamak we seljermek' }
    }
  }
}
