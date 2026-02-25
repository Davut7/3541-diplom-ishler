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
      subtitle: 'Upload a file or analyze a hash to detect hidden malware',
      uploadFile: 'Upload File',
      dropzone: 'Drag & drop files here or click to upload',
      scanning: 'Scanning...',
      results: { title: 'Scan Results', fileName: 'File Name', fileSize: 'File Size', hash: 'SHA-256 Hash', status: 'Status', threatLevel: 'Threat Level', details: 'Details' },
      status: { clean: 'Clean', suspicious: 'Suspicious', malware: 'Malware Detected', unknown: 'Unknown' }
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
    history: { title: 'Scan History', subtitle: 'View your previous scan results', empty: 'No scan history yet', columns: { file: 'File', status: 'Status', date: 'Date', actions: 'Actions' } },
    howItWorks: {
      title: 'How Detection Works',
      subtitle: 'Understanding our multi-layer detection approach',
      steps: {
        step1: { title: 'File Upload', desc: 'User uploads suspicious file for analysis' },
        step2: { title: 'Static Analysis', desc: 'Examine file structure, entropy, and embedded strings' },
        step3: { title: 'Dynamic Analysis', desc: 'Execute in sandbox and monitor behavior' },
        step4: { title: 'AI Analysis', desc: 'Machine learning models classify the sample' },
        step5: { title: 'Report Generation', desc: 'Comprehensive threat report is generated' }
      },
      faq: {
        q1: { question: 'Why cant traditional antivirus detect all malware?', answer: 'Traditional antivirus relies on signature databases. New malware or variants without known signatures can evade detection.' },
        q2: { question: 'What is heuristic analysis?', answer: 'Heuristic analysis examines code behavior and patterns to identify suspicious activities, even without a known signature.' },
        q3: { question: 'What is behavioral detection?', answer: 'Behavioral detection monitors how a file behaves when executed, looking for malicious actions like file encryption or network connections.' },
        q4: { question: 'How does AI help in malware detection?', answer: 'AI models are trained on millions of samples to recognize patterns and can identify new malware variants that humans might miss.' }
      }
    },
    about: {
      title: 'About VirusDetect Pro',
      subtitle: 'Advanced Malware Detection System',
      description: 'This project demonstrates advanced techniques for detecting malware that evades traditional antivirus solutions using heuristic analysis, behavioral detection, and AI.',
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
      subtitle: 'Gizlin zyýanly programmany anyklamak üçin faýl ýükläň',
      uploadFile: 'Faýl ýükle',
      dropzone: 'Faýllary şu ýere süýräň ýa-da ýüklemek üçin basyň',
      scanning: 'Skanirlenýär...',
      results: { title: 'Skan Netijeleri', fileName: 'Faýl Ady', fileSize: 'Faýl Ölçegi', hash: 'SHA-256 Hash', status: 'Ýagdaý', threatLevel: 'Howp Derejesi', details: 'Jikme-jiklikler' },
      status: { clean: 'Arassa', suspicious: 'Şübheli', malware: 'Zyýanly Programma Tapyldy', unknown: 'Näbelli' }
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
    history: { title: 'Skan Taryhy', subtitle: 'Öňki skan netijeleriňizi görüň', empty: 'Entek skan taryhy ýok', columns: { file: 'Faýl', status: 'Ýagdaý', date: 'Sene', actions: 'Hereketler' } },
    howItWorks: {
      title: 'Anyklaýyş Nähili Işleýär',
      subtitle: 'Köp gatlakly anyklaýyş usulymyza düşünmek',
      steps: {
        step1: { title: 'Faýl Ýüklemek', desc: 'Ulanyjy şübheli faýly derňew üçin ýükleýär' },
        step2: { title: 'Statik Derňew', desc: 'Faýl gurluşyny, entropiýany we ýerleşdirilen setirleri barlaýar' },
        step3: { title: 'Dinamik Derňew', desc: 'Sandboxda ýerine ýetirýär we özüni alyp barşyny gözegçilikde saklaýar' },
        step4: { title: 'AI Derňewi', desc: 'Maşyn öwreniş modelleri nusgany klassifikasiýalaýar' },
        step5: { title: 'Hasabat Döretmek', desc: 'Doly howp hasabaty döredilýär' }
      },
      faq: {
        q1: { question: 'Näme üçin adaty antiwirus ähli zyýanly programmalary anyklap bilmeýär?', answer: 'Adaty antiwirus gol maglumat bazalaryna daýanýar. Belli gollary bolmadyk täze zyýanly programmalar ýa-da wariantlar anyklamadan gaçyp biler.' },
        q2: { question: 'Ewristiki derňew näme?', answer: 'Ewristiki derňew, belli gol bolmasa-da şübheli hereketleri kesgitlemek üçin kod özüni alyp barşyny we nagyşlaryny barlaýar.' },
        q3: { question: 'Özüni alyp baryş anyklaýjysy näme?', answer: 'Özüni alyp baryş anyklaýjysy faýlyň ýerine ýetirilende nähili özüni alyp barýandygyny gözegçilikde saklaýar, faýl şifrleme ýa-da tor birikmelerini gözleýär.' },
        q4: { question: 'AI zyýanly programma anyklamakda nähili kömek edýär?', answer: 'AI modelleri nagyşlary tanamak üçin millionlarça nusgada türgenleşdirilýär we adamlaryň sypdyryp biljek täze zyýanly programma wariantlaryny kesgitläp biler.' }
      }
    },
    about: {
      title: 'VirusDetect Pro Hakynda',
      subtitle: 'Ösen Zyýanly Programma Anyklaýyş Ulgamy',
      description: 'Bu taslama ewristiki derňew, özüni alyp baryş anyklaýjysy we AI ulanyp adaty antiwirus çözgütlerinden gaçýan zyýanly programmalary anyklamak üçin ösen usullary görkezýär.',
      author: { title: 'Awtor', name: 'Dawutmuhammet Begmedow', project: 'Diplom Taslamasy', topic: 'Detecting viruses that evade antivirus detection', topicTk: 'Antiwiruslaryň anyklamasyndan gaçýan wirusleri anyklamak we seljermek' }
    }
  }
}
